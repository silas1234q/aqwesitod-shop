import { prisma } from "../config/prisma";
import NotFoundError from "../errors/NotFoundError";
import ValidationErrors from "../errors/ValidationError";



export const addToCartService = async (
  clerkId: string,  // Using clerkId to match Cart schema
  variantId: string,
  quantity: number
) => {
  // Validate inputs
  if (!variantId) {
    throw new ValidationErrors({
      variantId: "variantId is required",
    });
  }

  if (quantity < 1) {
    throw new ValidationErrors({
      quantity: "Quantity must be at least 1",
    });
  }

  return prisma.$transaction(async (tx) => {
    // 1. Find and validate the variant
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant) {
      throw new NotFoundError("variant");
    }

    // Check if variant is active
    if (!variant.isActive) {
      throw new ValidationErrors({
        variantId: "This product variant is not available",
      });
    }

    // 2. Get or create cart
    const cart = await tx.cart.upsert({
      where: { clerkId },
      create: { clerkId },
      update: {},  // No need to update clerkId, it's already correct
    });

    // 3. Check if item already exists in cart
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: variantId,
        },
      },
    });

    const currentQuantity = existingItem?.quantity ?? 0;
    const newQuantity = currentQuantity + quantity;

    // 4. Validate stock availability
    if (newQuantity > variant.stockQuantity) {
      throw new ValidationErrors({
        quantity: `Only ${variant.stockQuantity} item(s) available. You currently have ${currentQuantity} in cart.`,
      });
    }

    // 5. Update or create cart item
    if (existingItem) {
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variantId,
          quantity: quantity,
        },
      });
    }

    // 6. Return cart with all items and product details
    return await tx.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { sortOrder: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
};

export const getCartService = async (clerkId: string) => {
  console.log("Fetching cart for clerkId:", clerkId);
  const cart = await prisma.cart.findUnique({
    where: { clerkId},
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return cart?.items || [];
};

// Update cart item quantity
export const updateCartItemService = async (
  clerkId: string,
  cartItemId: string,
  quantity: number
) => {
  if (quantity < 1) {
    throw new ValidationErrors({
      quantity: "Quantity must be at least 1",
    });
  }

  return prisma.$transaction(async (tx) => {
    // Find cart item and verify ownership
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        variant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundError("cart item");
    }

    if (cartItem.cart.clerkId !== clerkId) {
      throw new ValidationErrors({
        cartItemId: "This cart item does not belong to you",
      });
    }

    // Check stock
    if (quantity > cartItem.variant.stockQuantity) {
      throw new ValidationErrors({
        quantity: `Only ${cartItem.variant.stockQuantity} item(s) available`,
      });
    }

    // Update quantity
    await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    // Return updated cart
    return await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { sortOrder: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
};

// Remove item from cart
export const removeCartItemService = async (
  clerkId: string,
  cartItemId: string
) => {
  return prisma.$transaction(async (tx) => {
    // Find cart item and verify ownership
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundError("cart item");
    }

    if (cartItem.cart.clerkId !== clerkId) {
      throw new ValidationErrors({
        cartItemId: "This cart item does not belong to you",
      });
    }

    // Delete the item
    await tx.cartItem.delete({
      where: { id: cartItemId },
    });

    // Return updated cart
    return await tx.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { sortOrder: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
};

// Clear entire cart
export const clearCartService = async (clerkId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { clerkId },
  });

  if (!cart) {
    throw new NotFoundError("cart");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: true,
    },
  });
};