import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
// import { products } from "../utils/product";
import type { ProductDetails } from "../types/productTypes";
import {
  useGetProductsByCategory,
} from "../hooks/useProducts.hook";
import { useGetCategories } from "../hooks/category.hook";
import type { CategoryItem } from "../types/CategoryTypes";

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);



  const { data: categoryData } = useGetCategories();
  const categories = categoryData?.categories || [];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  let limit = 10;
  const { data, isFetching ,refetch} = useGetProductsByCategory(selectedCategory, limit);


  const products: ProductDetails[] = data?.productsByCategory || [];

  const handleLoadMore = () => {
    // Implement load more functionality here
    console.log("Load more products...");
    // For example, you could increase the limit and refetch products
    limit += 10;
    // Refetch products with the new limit (you may need to implement this in your hook)
    refetch();

  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }
  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true;
    // Add your category filtering logic here
    console.log(product);
    return true;
  }) as unknown as ProductDetails[];

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-4 font-light">
            Shop Our
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-6">
            Collections
          </h1>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
            Discover timeless pieces designed for the modern wardrobe
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12 pb-6 border-b border-gray-200">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-2 text-sm font-light tracking-wide whitespace-nowrap transition-colors ${
                  selectedCategory === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
            </div>
            {categories.map((category: CategoryItem) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(String(category.id))}
                className={`px-6 py-2 text-sm font-light tracking-wide whitespace-nowrap transition-colors ${
                  selectedCategory === category.id.toString()
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-10 text-sm font-light focus:outline-none focus:border-gray-900 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden px-4 py-2 border border-gray-300 text-sm font-light"
            >
              Filter
            </button>

            {/* Products Count */}
            <span className="text-sm text-gray-600 font-light">
              {filteredProducts.length} Products
            </span>
          </div>
        </div>

        {/* Products Grid */}
        
        {isFetching ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">loading.....</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product: ProductDetails) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-16 text-center">
          <button
            className="px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-medium tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-colors"
            onClick={() => handleLoadMore()}
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;
