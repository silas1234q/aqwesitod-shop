// import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "../hooks/cart.hooks";
import type { CartItemsType } from "../types/cartTypes";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   discountedPrice?: number;
//   image: string;
//   size: string;
//   color: string;
//   quantity: number;
// }

const Cart = () => {
 
  const { data } = useCart();
  const cartItems: CartItemsType[] = data?.cart || [];

  const { mutateAsync: removeCartItem } = useRemoveFromCart();
  const { mutateAsync: updateCartQuantity } = useUpdateCartQuantity();
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartQuantity({ cartItemId: id, quantity: newQuantity });
  };

  const removeItem = async (id: string) => {
    await removeCartItem(id);
  };

  // const moveToWishlist = (id: number) => {
  //   // Handle move to wishlist
  //   removeItem(id);
  // };

  const subtotal = cartItems.reduce(
    (sum: number, item: CartItemsType) =>
      sum +
      (item.variant.discountedPriceCents || item.variant.priceCents) *
        item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 font-light">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Add some products to get started
            </p>

            <a
              href="/collections"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item: CartItemsType) => (
                <div
                  key={item.id}
                  className="flex gap-6 pb-6 border-b border-gray-200"
                >
                  {/* Product Image */}
                  <div className="w-32 h-40 shrink-0 bg-gray-100 overflow-hidden">
                    <img
                      src={item.variant.product.images[0]?.url}
                      alt={item.variant.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-light text-gray-900 mb-1">
                          {item.variant.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-light">
                          {item.variant.colorName} / Size {item.variant.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-900 transition-colors h-6"
                      >
                        <IoCloseOutline size={24} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-12.5 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.variant.discountedPriceCents ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium text-gray-900">
                              $
                              {(
                                item.variant.discountedPriceCents / 100
                              ).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${(item.variant.priceCents / 100).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-medium text-gray-900">
                            ${(item.variant.priceCents / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3">
                      <button
                        onClick={() => console.log("Move to wishlist", item.id)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                      >
                        <CiHeart size={18} strokeWidth={1} />
                        Move to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 sticky top-24">
                <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">Subtotal</span>
                    <span className="text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-gray-500 font-light">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-300 mb-6">
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-4 text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-colors mb-3 cursor-pointer">
                    Proceed to Checkout
                  </button>

                  <a
                    href="/collections"
                    className="block w-full text-center py-4 border-2 border-gray-900 text-gray-900 text-sm font-semibold tracking-wide uppercase hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>

                {/* Promo Code */}
                <div className="pt-6 border-t border-gray-300">
                  <details className="group">
                    <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-medium text-gray-900 mb-3">
                      Have a promo code?
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ↓
                      </span>
                    </summary>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
                      />
                      <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                        Apply
                      </button>
                    </div>
                  </details>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-gray-300 mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="font-light">Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-light">
                      Free returns within 30 days
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-light">Fast shipping available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
