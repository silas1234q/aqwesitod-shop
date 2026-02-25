import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import ProductCard from "../components/ProductCard/ProductCard";
import type { ProductDetails } from "../types/productTypes";
import { useGetProducts } from "../hooks/useProducts.hook";
import { useGetCategories } from "../hooks/category.hook";
import type { CategoryItem } from "../types/CategoryTypes";

type ProductWithCategory = ProductDetails & {
  category?: { id?: string; name?: string };
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductWithCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Summer dresses",
    "Linen blazer",
    "White sneakers",
  ]);

  const { data, isFetching } = useGetProducts();
  const products = (data?.products ?? []) as ProductWithCategory[];

  const {data: categoriesData} = useGetCategories();

  const categories = categoriesData?.categories ?? [];

  const popularSearches = useMemo(
    () => [
      "New Arrivals",
      "Sale",
      "Dresses",
      "Blazers",
      "Denim",
      "Accessories",
      "Outerwear",
      "Shoes",
    ],
    []
  );

  const trendingProducts = useMemo(() => products.slice(0, 4), [products]);

  // console.log("All products for search:", products.map(p => ({ id: p.id, name: p.name, category: p.category?.name })));

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      const results = products.filter((product) => {
        const name = (product.name ?? "").toLowerCase();
        const desc = (product.description ?? "").toLowerCase();
        const cat = (product.category?.name ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q);
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchQuery(trimmed);

    // Add to recent searches if not already there (case-insensitive)
    const normalized = trimmed.toLowerCase();
    const exists = recentSearches.some((s) => s.toLowerCase() === normalized);
    if (!exists) {
      setRecentSearches([trimmed, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Search Header */}
        <div className="mb-12">
          {/* Search Input */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <CiSearch
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
                strokeWidth={0.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                autoFocus
                className="w-full pl-16 pr-16 py-5 border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-lg font-light transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Clear search"
                >
                  <IoCloseOutline size={24} />
                </button>
              )}
            </div>

            {/* Search Info */}
            {searchQuery && (
              <p className="mt-4 text-sm text-gray-600 font-light text-center">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    {searchResults.length}{" "}
                    {searchResults.length === 1 ? "result" : "results"} for "
                    {searchQuery}"
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-16 mb-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CiSearch size={32} className="text-gray-400" strokeWidth={0.5} />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              No results found
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Try adjusting your search or browse our collections
            </p>
            <a
              href="/collections"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
            >
              Browse Collections
            </a>
          </div>
        )}

        {/* Default State - Before Search */}
        {!searchQuery && (
          <div className="space-y-16">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-light text-gray-900 tracking-tight">
                    Recent Searches
                  </h2>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map((search, index) => (
                    <div
                      key={`${search}-${index}`}
                      className="group flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-900 transition-colors"
                    >
                      <button
                        onClick={() => handleSearch(search)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        aria-label={`Remove recent search ${search}`}
                      >
                        <IoCloseOutline size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h2 className="text-xl font-light text-gray-900 tracking-tight mb-6">
                Popular Searches
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularSearches.map((search, index) => (
                  <button
                    key={`${search}-${index}`}
                    onClick={() => handleSearch(search)}
                    className="py-4 border border-gray-300 text-sm text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Products */}
            <div>
              <h2 className="text-xl font-light text-gray-900 tracking-tight mb-6">
                Trending Now
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            </div>

            {/* Categories Quick Links */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-light text-gray-900 tracking-tight mb-6">
                Shop by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((category:CategoryItem) => (
                  <a
                    key={category.id}
                    href={`/collections?category=${category.name.toLowerCase()}`}
                    className="group relative aspect-square overflow-hidden"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-light tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;