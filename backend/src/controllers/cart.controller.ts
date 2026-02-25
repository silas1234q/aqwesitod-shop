import { getAuth } from "@clerk/express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { addToCartService, removeCartItemService, updateCartItemService } from "../services/cart.service";
import AuthError from "../errors/AuthError";
import ValidationErrors from "../errors/ValidationError";
import { CartType } from "../types/types";

export const addToCart = catchAsync(async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  // Debug: Log to see what's coming in
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);

  const { variantId, quantity } = req.body;

  if (!clerkId) throw new AuthError("user not authenticated");
  const error: any = {};
  if (!variantId) error.productVariantId = "productVariantId is required";
  if (!quantity) error.quantity = "quantity is required";

  if (Object.keys(error).length > 0) throw new ValidationErrors(error);

  const cart = await addToCartService(clerkId, variantId, quantity);
  if (cart == null) {
    throw new AppError({
      message: "error adding to cart",
      statusCode: 500,
      type: "INTERNAL_SERVER_ERROR",
    });
  }
  return res.status(200).json(cart);
});

export const removeCartItem = catchAsync(async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  const { cartId } = req.params;
  if (!clerkId) throw new AuthError("user not authenticated");

  if(!cartId) {
    throw new ValidationErrors({
      cartId: "cartId is required"
    });
  }

  const cartItem = await removeCartItemService(clerkId, cartId as string);
  if (cartItem == null) {
    throw new AppError({
      message: "error removing cart item",
      statusCode: 500,
      type: "INTERNAL_SERVER_ERROR",
    });
  }

  return res.status(200).json(cartItem);
});


export const updateCartQuantity = catchAsync(async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  const { cartId } = req.params;
  const { quantity } = req.body;
  if (!clerkId) throw new AuthError("user not authenticated");

  if(!cartId) {
    throw new ValidationErrors({
      cartId: "cartId is required"
    });
  }

  if(quantity == null) {
    throw new ValidationErrors({
      quantity: "quantity is required"
    });
  }

  const cartItem = await updateCartItemService(clerkId, cartId as string, quantity);
  if (cartItem == null) {
    throw new AppError({
      message: "error updating cart item quantity",
      statusCode: 500,
      type: "INTERNAL_SERVER_ERROR",
    });
  }

  return res.status(200).json(cartItem);
});