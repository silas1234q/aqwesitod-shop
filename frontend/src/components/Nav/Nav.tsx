import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { CiSearch, CiShoppingCart, CiHeart, CiUser } from "react-icons/ci";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { CartItemsType } from "../../types/cartTypes";
import { useCart } from "../../hooks/cart.hooks";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();

  const { data, isFetching: cartFetching } = useCart();
  const cartItems: CartItemsType[] = data?.cart || [];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left - Menu Icon (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <IoCloseOutline size={28} className="text-gray-900" />
              ) : (
                <IoMenuOutline size={28} className="text-gray-900" />
              )}
            </button>

            {/* Center - Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
            >
              <h1 className="font-light text-2xl md:text-3xl text-gray-900 tracking-tight">
                AQUESITOD
              </h1>
            </Link>

            {/* Center - Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-light tracking-wide text-gray-700 hover:text-gray-900 transition-colors uppercase"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right - Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/search">
                <button
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                  aria-label="Search"
                >
                  <CiSearch
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                </button>
              </Link>

              <Link to="/wishlist" className="hidden md:block">
                <button
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                  aria-label="Wishlist"
                >
                  <CiHeart
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                </button>
              </Link>

              <Link to="/cart">
                <button
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full relative"
                  aria-label="Shopping cart"
                >
                  <CiShoppingCart
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                  {/* Cart Badge */}
                  {!cartFetching && cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {cartItems.length > 99 ? "99+" : cartItems.length}
                    </span>
                  )}
                </button>
              </Link>

              {/* Desktop User Button */}
              <div className="hidden md:block">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-9999 ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 h-dvh w-full bg-black/60 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <aside
          className={`absolute top-0 right-0 h-dvh w-[85%] max-w-sm bg-white shadow-2xl
      transform transition-transform duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-light text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <IoCloseOutline size={28} className="text-gray-900" />
              </button>
            </div>

            {/* User */}
            {isSignedIn && (
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ elements: { avatarBox: "w-12 h-12" } }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName || user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll area */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-8 border-t border-gray-200 space-y-4">
                  {!isSignedIn && (
                    <Link
                      to="/sign-in"
                      className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CiUser size={20} strokeWidth={0.5} />
                      Sign In
                    </Link>
                  )}

                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CiHeart size={20} strokeWidth={0.5} />
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/contact"
                    className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help & Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Nav;
