// import { products } from "../../utils/product";
import { Link } from "react-router-dom";
import { useGetProducts } from "../../hooks/useProducts.hook";
import type { ProductDetails } from "../../types/productTypes";
import ProductCard from "../ProductCard/ProductCard";

const BestSellers = () => {
  const { data } = useGetProducts();

  const products:ProductDetails[] = data?.products || [];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-4 font-light">
            Customer Favorites
          </p>
          <h2 className="font-light text-5xl md:text-6xl text-gray-900 tracking-tight mb-6">
            Best Sellers
          </h2>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Our most coveted pieces, loved by our community
          </p>
          <div className="w-16 h-px bg-gray-400 mx-auto mt-8"></div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(products.slice(0, 8) as unknown as ProductDetails[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-gray-900 text-sm tracking-[0.2em] uppercase font-medium border-b-2 border-gray-900/30 hover:border-gray-900 pb-2 transition-all duration-300 group"
          >
            Shop All Best Sellers
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

export default BestSellers;
