import AppError from "../errors/AppError";
import ValidationErrors from "../errors/ValidationError";
import { deleteProductService } from "../services/product.service";
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
