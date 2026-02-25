// @ts-ignore

// Needed for process.exit type
import {prisma} from '../src/config/prisma'


// Category seed data
const categoriesData = [
  { name: "T-Shirts",image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" ,description: "Explore our collection of stylish and comfortable t-shirts, perfect for any occasion." },
  { name: "Hoodies", image: "https://images.unsplash.com/photo-1622567893612-a5345baa5c9a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,description: "Discover our cozy hoodies, designed to keep you warm and stylish all year round." },
  { name: "Pants", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800" ,description: "Find the perfect pair of pants for any look, from casual to chic." },
  { name: "Bags", image: "https://tse2.mm.bing.net/th/id/OIP.i9sY6Yq0NWBbAJVOg9CEjAHaJx?rs=1&pid=ImgDetMain&o=7&rm=3", description: "Stay stylish and protected with our range of jackets, suitable for all seasons." },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500",  description: "Complete your outfit with our selection of accessories, from hats to bags and more." },
];

// Product data from your file
const productsData = [

  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    description: "This is a great product that you will love!",
    discountedPrice: 19.99,
    details: [
      "Made from 100% organic cotton for a soft and comfortable feel.",
      "Features a classic fit with a crew neckline and short sleeves.",
      "Available in a variety of colors to suit your style.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low or hang to dry for best results.",
      "Do not bleach or iron directly on the print.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", alt: "Product 1 Front View" },
      { url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800", alt: "Product 1 Side View" },
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", alt: "Product 1 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 39.99,
    description: "This is a great product that you will love!",
    discountedPrice: 29.99,
    details: [
      "Crafted from premium materials for durability and style.",
      "Features a modern fit with a V-neckline and short sleeves.",
      "Available in multiple colors to match your wardrobe.",
    ],
    fabric: "80% Cotton, 20% Polyester",
    care: [
      "Machine wash warm with like colors.",
      "Tumble dry medium or hang to dry for best results.",
      "Do not bleach or iron directly on the print.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Maroon", hex: "#800000" },
      { name: "Olive", hex: "#808000" },  
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800", alt: "Product 2 Front View" },
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", alt: "Product 2 Side View" },
      { url: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800", alt: "Product 2 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "Product 3",
    price: 49.99,
    description: "This is a great product that you will love!",
    discountedPrice: 39.99,
    details: [
      "Made from a blend of cotton and spandex for a comfortable stretch.",
      "Features a slim fit with a scoop neckline and short sleeves.",
      "Perfect for active lifestyles and everyday wear.",
    ],
    fabric: "85% Cotton, 15% Spandex",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low or hang to dry.",
      "Do not bleach or iron.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Red", hex: "#FF0000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Green", hex: "#008000" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", alt: "Product 3 Front View" },
      { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800", alt: "Product 3 Side View" },
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800", alt: "Product 3 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Product 4",
    price: 59.99,
    description: "This is a great product that you will love!",
    discountedPrice: 49.99,
    details: [
      "Premium quality with exceptional durability.",
      "Modern design with comfortable fit.",
      "Available in multiple colors.",
    ],
    fabric: "100% Cotton",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800", alt: "Product 4 Front View" },
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800", alt: "Product 4 Side View" },
      { url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800", alt: "Product 4 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "Product 5",
    price: 69.99,
    description: "This is a great product that you will love!",
    discountedPrice: 59.99,
    details: [
      "High-quality craftsmanship.",
      "Stylish and versatile design.",
      "Comfortable for all-day wear.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low.",
      "Iron on low heat if needed.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#36454F" },
      { name: "Cream", hex: "#FFFDD0" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800", alt: "Product 5 Front View" },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800", alt: "Product 5 Side View" },
      { url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800", alt: "Product 5 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 6,
    name: "Product 6",
    price: 79.99,
    description: "This is a great product that you will love!",
    discountedPrice: 69.99,
    details: [
      "Premium materials for superior comfort.",
      "Contemporary style.",
      "Great for layering.",
    ],
    fabric: "90% Cotton, 10% Polyester",
    care: [
      "Machine wash warm.",
      "Tumble dry medium.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Slate", hex: "#708090" },
      { name: "Sand", hex: "#C2B280" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800", alt: "Product 6 Front View" },
      { url: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800", alt: "Product 6 Side View" },
      { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800", alt: "Product 6 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 7,
    name: "Product 7",
    price: 89.99,
    description: "This is a great product that you will love!",
    discountedPrice: 79.99,
    details: [
      "Exceptional quality and comfort.",
      "Modern minimalist design.",
      "Perfect for any occasion.",
    ],
    fabric: "100% Premium Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low.",
      "Do not bleach or iron.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Midnight", hex: "#191970" },
      { name: "Pearl", hex: "#FDEEF4" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800", alt: "Product 7 Front View" },
      { url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800", alt: "Product 7 Side View" },
      { url: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800", alt: "Product 7 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 8,
    name: "Product 8",
    price: 99.99,
    description: "This is a great product that you will love!",
    discountedPrice: 89.99,
    details: [
      "Luxury craftsmanship.",
      "Sophisticated design.",
      "Ultra-comfortable fit.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold with similar colors.",
      "Tumble dry low.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ebony", hex: "#555555" },
      { name: "Ivory", hex: "#FFFFF0" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800", alt: "Product 8 Front View" },
      { url: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800", alt: "Product 8 Side View" },
      { url: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800", alt: "Product 8 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 9,
    name: "Product 9",
    price: 109.99,
    description: "This is a great product that you will love!",
    discountedPrice: 99.99,
    details: [
      "Top-tier quality and design.",
      "Premium comfort features.",
      "Perfect statement piece.",
    ],
    fabric: "100% Premium Organic Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low or hang dry.",
      "Do not bleach or iron directly.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx", hex: "#0F0F0F" },
      { name: "Cloud", hex: "#F5F5F5" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", alt: "Product 9 Front View" },
      { url: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800", alt: "Product 9 Side View" },
      { url: "https://images.unsplash.com/photo-1598032895397-b9372bc7f537?w=800", alt: "Product 9 Detail View" },
    ],
    inStock: true,
  },
];



async function main() {
  console.log('🌱 Starting database seed...');


  // Clear existing data
  console.log('🗑️  Clearing existing products and categories...');
  await prisma.productVariant.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productCare.deleteMany();
  await prisma.productDetail.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories
  console.log('🌱 Seeding categories...');
  const createdCategories: { id: string; name: string }[] = [];
  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({ data: categoryData });
    createdCategories.push(category);
    console.log(`✅ Created category: ${category.name}`);
  }

  // Helper to assign a random category to each product
  function getRandomCategoryId(categories: { id: string }[]): string {
    const idx = Math.floor(Math.random() * categories.length);
    return categories[idx].id;
  }

  // Seed products
  for (const productData of productsData) {
    const categoryId = getRandomCategoryId(createdCategories);
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        fabric: productData.fabric,
        inStock: productData.inStock,
        priceCents: Math.round(productData.price * 100),
        discountedPriceCents: productData.discountedPrice 
          ? Math.round(productData.discountedPrice * 100)
          : null,
        primaryImageUrl: productData.images[0].url,
        category: { connect: { id: categoryId } },

        // Create images
        images: {
          create: productData.images.map((img: { url: string; alt: string }, index: number) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: index,
          })),
        },
        // Create details
        details: {
          create: productData.details.map((detail: string, index: number) => ({
            value: detail,
            sortOrder: index,
          })),
        },
        // Create care instructions
        care: {
          create: productData.care.map((care: string, index: number) => ({
            value: care,
            sortOrder: index,
          })),
        },
        // Create sizes
        sizes: {
          create: productData.sizes.map((size: string, index: number) => ({
            size,
            sortOrder: index,
          })),
        },
        // Create colors
        colors: {
          create: productData.colors.map((color: { name: string; hex: string }, index: number) => ({
            name: color.name,
            hex: color.hex,
            sortOrder: index,
          })),
        },
        // Create variants (all size-color combinations)
        variants: {
          create: productData.sizes.flatMap((size: string) =>
            productData.colors.map((color: { name: string }) => ({
              size,
              colorName: color.name,
              sku: `${productData.name.toUpperCase().replace(/\s+/g, '-')}-${size}-${color.name.toUpperCase()}`,
              priceCents: Math.round(productData.price * 100),
              discountedPriceCents: productData.discountedPrice
                ? Math.round(productData.discountedPrice * 100)
                : null,
              stockQuantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
              isActive: true,
            }))
          ),
        },
      },
    });
    console.log(`✅ Created ${product.name} with ${productData.sizes.length * productData.colors.length} variants`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
