import AppError from "../errors/AppError";
import ValidationErrors from "../errors/ValidationError";
import { createProduct, deleteProductService, updateProductService } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";

export const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  if (!productId || Array.isArray(productId))
    throw new ValidationErrors({ productId: "Product ID is required" });

  const deletedProduct = await deleteProductService(productId);
  if (!deletedProduct)
    throw new AppError({
      message: "Failed to delete product",
      statusCode: 500,
      type: "INTERNAL_SERVER_ERROR",
    });

  res.status(200).json({ message: "Product deleted successfully" });
});

export const addProduct = catchAsync(async (req, res) => {
  // req.body is already validated & coerced by the validate() middleware
  const product = await createProduct(req.body);

  return res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
   if (!productId || Array.isArray(productId))
    throw new ValidationErrors({ productId: "Product ID is required" });

  const product = await updateProductService(productId, req.body);



  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});
