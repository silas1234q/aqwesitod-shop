import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { IoShareOutline } from "react-icons/io5";
import type { ProductDetails, ProductVariant } from "../../types/productTypes";
import { useAddToCart } from "../../hooks/cart.hooks";
import { Link } from "react-router-dom";
export const ProductDetailsContent = ({
  product,
}: {
  product: ProductDetails;
}) => {
  // Convert cents to dollars
  const price = product.priceCents / 100;
  const discountedPrice = product.discountedPriceCents
    ? product.discountedPriceCents / 100
    : undefined;

  // Extract data from objects
  const sizes = product.sizes
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.size);

  const colors = product.colors.sort((a, b) => a.sortOrder - b.sortOrder);

  const details = product.details
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((d) => d.value);

  const care = product.care
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => c.value);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  const { mutateAsync: addToCart } = useAddToCart();

  // Find the selected variant based on color and size
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = product.variants.find(
        (v) => v.colorName === selectedColor.name && v.size === selectedSize,
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product.variants]);

  console.log(selectedVariant);

  const discountPercentage = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  // Handler for add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      console.error("No variant selected");
      return;
    }

    console.log("Adding to cart:", {
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      color: selectedVariant.colorName,
      size: selectedVariant.size,
      quantity: quantity,
      price: discountedPrice || price,
    });
    const variantId = selectedVariant.id;
    console.log(variantId)

    await addToCart({ variantId, quantity });

    // TODO: Implement your add to cart logic here
    // e.g., dispatch to Redux, update context, call API, etc.
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to="/collections"
                className="hover:text-gray-900 transition-colors"
              >
                Collections
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-50">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-3/4 overflow-hidden bg-gray-50">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square overflow-hidden bg-gray-50 border-2 transition-colors ${
                      selectedImage.id === image.id
                        ? "border-gray-900"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Product Name & Price */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-2">
                {discountedPrice ? (
                  <>
                    <span className="text-2xl font-medium text-gray-900">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${price.toFixed(2)}
                    </span>
                    <span className="bg-red-600 text-white text-xs px-2 py-1 uppercase tracking-wide">
                      -{discountPercentage}% Off
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-medium text-gray-900">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">
                {product.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>

              {/* Debug: Show selected variant ID */}
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2">
                  Variant ID: {selectedVariant.id}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Color
                  </label>
                  <span className="text-sm text-gray-600">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Size
                  </label>
                  <button className="text-sm text-gray-600 underline hover:text-gray-900">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-900 uppercase tracking-wide block mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 min-w-15 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || !product.inStock}
                className={`w-full py-4 text-sm font-semibold tracking-wide uppercase transition-colors ${
                  !selectedVariant || !product.inStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {!selectedSize
                  ? "Select a Size"
                  : !selectedColor
                    ? "Select a Color"
                    : "Add to Cart"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-4 text-sm font-semibold tracking-wide uppercase border-2 transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <CiHeart
                    size={20}
                    fill={isWishlisted ? "white" : "none"}
                    strokeWidth={1.5}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </button>

                <button className="px-6 py-4 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                  <IoShareOutline size={20} />
                </button>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="border-t border-gray-200 space-y-0">
              {/* Details */}
              {details.length > 0 && (
                <details className="group border-b border-gray-200">
                  <summary className="py-6 cursor-pointer list-none flex items-center justify-between">
                    <span className="text-sm font-medium uppercase tracking-wide">
                      Details
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="pb-6">
                    <ul className="space-y-2 text-sm text-gray-700 font-light">
                      {details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}

              {/* Fabric & Care */}
              {(product.fabric || care.length > 0) && (
                <details className="group border-b border-gray-200">
                  <summary className="py-6 cursor-pointer list-none flex items-center justify-between">
                    <span className="text-sm font-medium uppercase tracking-wide">
                      Fabric & Care
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="pb-6 space-y-4">
                    {product.fabric && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Fabric
                        </p>
                        <p className="text-sm text-gray-700 font-light">
                          {product.fabric}
                        </p>
                      </div>
                    )}
                    {care.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Care Instructions
                        </p>
                        <ul className="space-y-1 text-sm text-gray-700 font-light">
                          {care.map((instruction, index) => (
                            <li key={index}>• {instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Shipping */}
              <details className="group border-b border-gray-200">
                <summary className="py-6 cursor-pointer list-none flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Shipping & Returns
                  </span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="pb-6 text-sm text-gray-700 font-light space-y-3">
                  <p>Free standard shipping on orders over $100</p>
                  <p>Express shipping available at checkout</p>
                  <p>Free returns within 30 days of purchase</p>
                  <p>Items must be unworn with tags attached</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
