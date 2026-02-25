import { useState } from "react";
import { useGetCategories } from "../../hooks/category.hook";
import Loader from "../UtilsComponents/Loader";
import type { CategoryItem } from "../../types/CategoryTypes";
// import { useGetCategories } from "../../hooks/category.hook";
// import { useAuth } from "@clerk/clerk-react";

// import { categories } from "../../utils/Categories";

const Category = () => {
  // Fashion-specific categories

  const { data, isLoading } = useGetCategories();


  const categories = data?.categories || [];

  console.log("Fetched Categories:", categories);

  if (!categories) return;
  <Loader text="categories loading" />;

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg font-light">
            Discover your style across our curated collections
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <Loader text="categories loading" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: CategoryItem) => (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative h-100 overflow-hidden cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-white text-3xl md:text-4xl font-light mb-2 tracking-wide">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm font-light mb-4 tracking-wide">
                      {category.products.length} Products
                    </p>

                    {/* Shop Now Link */}
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-medium tracking-widest uppercase border-b border-white/50 group-hover:border-white transition-all duration-300">
                        Shop Now
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-500 ${
                          hoveredId === category.id
                            ? "translate-x-2"
                            : "translate-x-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
