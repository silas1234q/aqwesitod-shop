import { Request, Response } from 'express';
import { searchProductsService, searchSuggestionsService } from '../services/search.service';
import { catchAsync } from '../utils/catchAsync'; // Adjust import path

// Main search endpoint
export const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    query,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sizes,
    colors,
    page,
    limit,
    sortBy,
  } = req.query;

  // Parse query parameters
  const searchParams = {
    query: (q || query) as string,
    categoryId: categoryId as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
    sizes: sizes ? (Array.isArray(sizes) ? sizes : [sizes]) as string[] : undefined,
    colors: colors ? (Array.isArray(colors) ? colors : [colors]) as string[] : undefined,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 20,
    sortBy: (sortBy as any) || 'relevance',
  };

  const result = await searchProductsService(searchParams);

  return res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
    filters: result.filters,
  });
});

// Autocomplete suggestions endpoint
export const searchSuggestions = catchAsync(async (req: Request, res: Response) => {
  const { q, query, limit } = req.query;

  const searchQuery = (q || query) as string;
  const resultLimit = limit ? parseInt(limit as string, 10) : 5;

  if (!searchQuery || searchQuery.trim().length < 2) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const suggestions = await searchSuggestionsService(searchQuery, resultLimit);

  return res.status(200).json({
    success: true,
    data: suggestions,
  });
});

// Get products by category
export const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { page, limit, sortBy } = req.query;

  const result = await searchProductsService({
    categoryId: categoryId as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 20,
    sortBy: (sortBy as any) || 'newest',
  });

  return res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
    filters: result.filters,
  });
});