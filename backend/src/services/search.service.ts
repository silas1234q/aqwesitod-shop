import { ProductDetail, ProductDetails } from '../types/productTypes';
import { prisma } from '../config/prisma'; // Adjust import path

export interface SearchProductsParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'name';
}

export interface SearchResult {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    availableSizes: string[];
    availableColors: { name: string; hex: string }[];
    priceRange: { min: number; max: number };
  };
}

export const searchProductsService = async (
  params: SearchProductsParams
): Promise<SearchResult> => {
  const {
    query,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sizes,
    colors,
    page = 1,
    limit = 20,
    sortBy = 'relevance',
  } = params;

  const skip = (page - 1) * limit;

  // Build the where clause
  const where: any = {};

  // Full-text search
  if (query && query.trim()) {
    // Use raw SQL for full-text search
    const searchQuery = query.trim().split(' ').join(' & ');
    
    // We'll use Prisma's raw query for the search
    const searchCondition = prisma.$queryRaw`
      SELECT id FROM "Product"
      WHERE "searchVector" @@ to_tsquery('english', ${searchQuery})
    `;
    
    // Get matching product IDs
    const matchingIds = await searchCondition as { id: string }[];
    
    if (matchingIds.length > 0) {
      where.id = { in: matchingIds.map(p => p.id) };
    } else {
      // No matches, return empty results
      return {
        products: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        filters: {
          availableSizes: [],
          availableColors: [],
          priceRange: { min: 0, max: 0 },
        },
      };
    }
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceCents = {};
    if (minPrice !== undefined) where.priceCents.gte = minPrice * 100;
    if (maxPrice !== undefined) where.priceCents.lte = maxPrice * 100;
  }

  // Stock filter
  if (inStock !== undefined) {
    where.inStock = inStock;
  }

  // Size and color filters (through variants)
  if (sizes && sizes.length > 0 || colors && colors.length > 0) {
    where.variants = {
      some: {
        AND: [
          sizes && sizes.length > 0 ? { size: { in: sizes } } : {},
          colors && colors.length > 0 ? { colorName: { in: colors } } : {},
          { isActive: true },
          { stockQuantity: { gt: 0 } },
        ].filter(condition => Object.keys(condition).length > 0),
      },
    };
  }

  // Get total count
  const total = await prisma.product.count({ where });

  // Build orderBy
  let orderBy: any = {};
  switch (sortBy) {
    case 'price_asc':
      orderBy = { priceCents: 'asc' };
      break;
    case 'price_desc':
      orderBy = { priceCents: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'name':
      orderBy = { name: 'asc' };
      break;
    case 'relevance':
    default:
      // For relevance, we rely on the order from full-text search
      orderBy = { name: 'asc' };
      break;
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      variants: {
        where: {
          isActive: true,
          stockQuantity: { gt: 0 },
        },
        select: {
          id: true,
          size: true,
          colorName: true,
          priceCents: true,
          discountedPriceCents: true,
          stockQuantity: true,
        },
      },
      sizes: {
        orderBy: { sortOrder: 'asc' },
      },
      colors: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy,
    skip,
    take: limit,
  });

  // Get available filters (for faceted search)
  const availableSizes = await prisma.productSize.findMany({
    where: {
      product: where,
    },
    distinct: ['size'],
    select: { size: true },
  });

  const availableColors = await prisma.productColor.findMany({
    where: {
      product: where,
    },
    distinct: ['name', 'hex'],
    select: { name: true, hex: true },
  });

  const priceRange = await prisma.product.aggregate({
    where,
    _min: { priceCents: true },
    _max: { priceCents: true },
  });

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      fabric: product.fabric,
      inStock: product.inStock,
      price: product.priceCents / 100,
      discountedPrice: product.discountedPriceCents ? product.discountedPriceCents / 100 : null,
      primaryImage: product.images[0]?.url || product.primaryImageUrl,
      category: product.category,
      availableSizes: product.sizes.map(s => s.size),
      availableColors: product.colors.map(c => ({ name: c.name, hex: c.hex })),
      variantCount: product.variants.length,
      minPrice: Math.min(...product.variants.map(v => v.priceCents)) / 100,
      maxPrice: Math.max(...product.variants.map(v => v.priceCents)) / 100,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filters: {
      availableSizes: availableSizes.map(s => s.size),
      availableColors: availableColors.map(c => ({ name: c.name, hex: c.hex })),
      priceRange: {
        min: priceRange._min.priceCents ? priceRange._min.priceCents / 100 : 0,
        max: priceRange._max.priceCents ? priceRange._max.priceCents / 100 : 0,
      },
    },
  };
};

// Autocomplete/suggestions service
export const searchSuggestionsService = async (query: string, limit = 5) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchQuery = query.trim().split(' ').join(' & ');

  const suggestions = await prisma.$queryRaw<{ id: string; name: string; description: string }[]>`
    SELECT id, name, description
    FROM "Product"
    WHERE "searchVector" @@ to_tsquery('english', ${searchQuery})
    ORDER BY ts_rank("searchVector", to_tsquery('english', ${searchQuery})) DESC
    LIMIT ${limit}
  `;

  return suggestions.map((s: any)=> ({
    id: s.id,
    name: s.name,
    snippet: s.description.substring(0, 100) + '...',
  }));
};