// import { products } from "../../utils/product";
import {
  useGetProductsByCategory,
} from "../../hooks/useProducts.hook";
import type { ProductDetails } from "../../types/productTypes";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";
import Loader from "../UtilsComponents/Loader";

const NewCollection = () => {
  const { data, isLoading } = useGetProductsByCategory("all", 4);
  const products: ProductDetails[] = data?.productsByCategory || [];

  console.log("Fetched products:", products);
  return (
    <section className="bg-white py-12 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-4 font-light">
                Latest Arrivals
              </p>
              <h2 className="font-light text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight">
                New This Week
              </h2>
            </div>
            <p className="text-gray-600 font-light text-lg max-w-md leading-relaxed md:pb-2">
              Curated pieces that embody sophistication and contemporary style.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader text="products loading" size={20} />
            </div>
          ) : (
            products
              .slice(0, 4)
              .map((product: ProductDetails) => (
                <ProductCard key={product.id} product={product} />
              ))
          )}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-gray-900 text-sm tracking-[0.2em] uppercase font-medium border-b-2 border-gray-900/30 hover:border-gray-900 pb-2 transition-all duration-300 group"
          >
            View All Products
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewCollection;
