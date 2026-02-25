import { Link } from "react-router-dom";
import type { ProductDetails } from "../../types/productTypes";

const ProductCard = ({ product}:{product :ProductDetails}) => {
  const discountPercentage = product.discountedPriceCents 
    ? Math.round(((product.priceCents - product.discountedPriceCents) / product.priceCents) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer">
      <div>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
          <img
            src={product.images[0]?.url || ""}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Discount Badge - Only show if there's a discount */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 tracking-wider">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Wishlist Button - Desktop Only */}
          <button className="hidden md:flex absolute top-3 right-3 bg-white w-9 h-9 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-900 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick Add - Desktop Only */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full bg-white text-gray-900 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Product Name */}
          <h3 className="text-sm font-light text-gray-900 line-clamp-2 min-h-10 leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-gray-900">
              ${product.discountedPriceCents ? (product.discountedPriceCents / 100).toFixed(2) : (product.priceCents / 100).toFixed(2)}
            </span>
            {product.discountedPriceCents && (
              <span className="text-sm text-gray-400 line-through font-light">
                ${(product.priceCents / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;