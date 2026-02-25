import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  inStock: boolean;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Cashmere Sweater",
      price: 350,
      discountedPrice: 280,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
      inStock: true
    },
    {
      id: 2,
      name: "Leather Jacket",
      price: 599,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      inStock: true
    },
    {
      id: 3,
      name: "Silk Dress",
      price: 450,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      inStock: false
    },
    {
      id: 4,
      name: "Wool Coat",
      price: 780,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
      inStock: true
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // Handle add to cart
    console.log("Added to cart:", id);
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
            Wishlist
          </h1>
          <p className="text-gray-600 font-light">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Save your favorite items to find them easily later
            </p>
            
            <a
              href="/collections"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100"
                  >
                    <IoCloseOutline size={20} />
                  </button>

                  {/* Product Image */}
                  <div className="relative aspect-3/4 bg-gray-100 mb-4 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-light text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {item.discountedPrice ? (
                        <>
                          <span className="text-base font-medium text-gray-900">
                            ${item.discountedPrice}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-medium text-gray-900">
                          ${item.price}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={!item.inStock}
                      className={`w-full py-3 text-sm font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2 ${
                        item.inStock
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <CiShoppingCart size={18} strokeWidth={1.5} />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-gray-200">
              <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 text-sm font-medium tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-colors">
                Add All to Cart
              </button>
              
              <Link
                to="/collections"
                className="px-8 py-4 text-gray-600 text-sm font-medium tracking-wide uppercase hover:text-gray-900 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {/* Share Wishlist (Optional) */}
        {wishlistItems.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 text-center">
            <h3 className="text-xl font-light text-gray-900 mb-4">
              Share Your Wishlist
            </h3>
            <p className="text-gray-600 font-light mb-6">
              Let others know what you're loving
            </p>
            <div className="flex gap-4 justify-center">
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;