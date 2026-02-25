import { UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { CiSearch, CiShoppingCart, CiHeart, CiUser } from "react-icons/ci";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { CartItemsType } from "../../types/cartTypes";
import { useCart } from "../../hooks/cart.hooks";
import Loader from "../UtilsComponents/Loader";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data, isFetching: cartFetching } = useCart();
  const cartItems: CartItemsType[] = data?.cart || [];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left - Menu Icon (Mobile) */}
            <button
              onClick={() => {
                console.log("hi");
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
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
            <a
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
            >
              <h1 className="font-light text-2xl md:text-3xl text-gray-900 tracking-tight">
                AQUESITOD
              </h1>
            </a>

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
              <Link to={"/search"}>
                <button
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full cursor-pointer"
                  aria-label="Search"
                >
                  <CiSearch
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                </button>
              </Link>

              <Link to={"/wishlist"}>
                <button
                  className="hidden md:block p-2 hover:bg-gray-100 transition-colors rounded-full cursor-pointer"
                  aria-label="Wishlist"
                >
                  <CiHeart
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                </button>
              </Link>
              <Link to={"/cart"}>
                <button
                  className="p-2 hover:bg-gray-100 transition-colors rounded-full relative cursor-pointer"
                  aria-label="Shopping cart"
                >
                  <CiShoppingCart
                    size={24}
                    className="text-gray-900"
                    strokeWidth={0.5}
                  />
                  {/* Cart Badge */}
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {cartFetching ? <Loader text="" /> : cartItems.length}
                  </span>
                </button>
              </Link>

              <button
                className="hidden md:block p-2 hover:bg-gray-100 transition-colors rounded-full"
                aria-label="Account"
              >
                <UserButton />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0  w-full max-w-full bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full z-99"
        }`}
      >
        {/* Close Button */}
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

        {/* Menu Links */}
        <div className="px-6 py-8 space-y-6 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors capitalize"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {/* Mobile Bottom Links */}
          <div className="pt-8 border-t border-gray-200 space-y-4">
            <a
              href="/account"
              className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CiUser size={20} strokeWidth={0.5} />
              My Account
            </a>
            <a
              href="/wishlist"
              className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CiHeart size={20} strokeWidth={0.5} />
              Wishlist
            </a>
            <a
              href="/help"
              className="flex items-center gap-3 text-base font-light text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Help & Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
