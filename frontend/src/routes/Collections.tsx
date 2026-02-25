import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import type { ProductDetails } from "../types/productTypes";
import { useGetProductsByCategory } from "../hooks/useProducts.hook";
import { useGetCategories } from "../hooks/category.hook";
import type { CategoryItem } from "../types/CategoryTypes";
import Loader from "../components/UtilsComponents/Loader";
import { useLocation } from "react-router-dom";

const Collections = () => {
  const location = useLocation();
  const categoryIdFromState = location.state?.categoryId;

  const [selectedCategory, setSelectedCategory] = useState(
    categoryIdFromState ? String(categoryIdFromState) : "all"
  );
  const [sortBy, setSortBy] = useState("featured");
  const [limit, setLimit] = useState(10);

  const { data: categoryData, isFetching: isCategoryLoading } = useGetCategories();
  const categories = categoryData?.categories || [];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const { data, isFetching } = useGetProductsByCategory(
    selectedCategory,
    limit
  );

  const products: ProductDetails[] = data?.productsByCategory || [];

  useEffect(() => {
    if (categoryIdFromState) {
      setSelectedCategory(String(categoryIdFromState));
    }
  }, [categoryIdFromState]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountedPriceCents || a.priceCents;
    const priceB = b.discountedPriceCents || b.priceCents;

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "featured":
      default:
        return 0;
    }
  });

  // Determine if there might be more products to load
  const hasMore = products.length === limit;

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
            {isCategoryLoading ? (
              <div className="flex items-center justify-center px-6 py-2">
                <Loader text="" size={20}/>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setLimit(10);
                  }}
                  className={`px-6 py-2 text-sm font-light tracking-wide whitespace-nowrap transition-colors ${
                    selectedCategory === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Products
                </button>
                {categories.map((category: CategoryItem) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(String(category.id));
                      setLimit(10);
                    }}
                    className={`px-6 py-2 text-sm font-light tracking-wide whitespace-nowrap transition-colors ${
                      selectedCategory === String(category.id)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </>
            )}
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

            {/* Products Count */}
            <span className="text-sm text-gray-600 font-light">
              {sortedProducts.length} Products
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {isFetching && products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Loader text="Loading products..." size={20} />
          </div>
        ) : sortedProducts.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">No Products Found</h2>
            <p className="text-gray-600 font-light mb-8">
              Try selecting a different category or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {sortedProducts.map((product: ProductDetails) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button - Always show if there are products and might be more */}
        {!isFetching && sortedProducts.length > 0 && hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="px-12 py-4 border-2 border-gray-900 text-gray-900 text-sm font-medium tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading indicator for load more */}
        {isFetching && products.length > 0 && (
          <div className="mt-16 text-center">
            <Loader text="Loading more products..." size={30} />
          </div>
        )}

        {/* End of results message */}
        {!isFetching && sortedProducts.length > 0 && !hasMore && (
          <div className="mt-16 text-center">
            <p className="text-gray-500 font-light text-sm">
              You've reached the end of the collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
