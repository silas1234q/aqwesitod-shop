
import { useParams } from "react-router-dom";
import { useGetProductById } from "../hooks/useProducts.hook";
import type { ProductDetails } from "../types/productTypes";
import { ProductDetailsContent } from "../components/ProductDetailsContent/ProductDetailsContent";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { data, isFetching, isError } = useGetProductById(productId!);

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 font-light mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/collections"
            className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const product: ProductDetails = data.product;

  return <ProductDetailsContent product={product} />;
};



export default ProductDetailsPage;