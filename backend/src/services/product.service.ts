import { Prisma, ProductCare, ProductColor, ProductDetail, ProductImage, ProductSize, ProductVariant } from "@prisma/client";

import { prisma } from "../config/prisma";
import NotFoundError from "../errors/NotFoundError";
import ValidationErrors from "../errors/ValidationError";
import { CreateProductInput, UpdateProductInput } from "../utils/zod.schema";

// ─── Shared include ────────────────────────────────────────────────────────────

const PRODUCT_INCLUDE: Prisma.ProductInclude = {
  category: { select: { id: true, name: true, image: true } },
  colors:   { orderBy: { sortOrder: "asc" } },
  sizes:    { orderBy: { sortOrder: "asc" } },
  images:   { orderBy: { sortOrder: "asc" } },
  details:  { orderBy: { sortOrder: "asc" } },
  care:     { orderBy: { sortOrder: "asc" } },
  variants: {
    orderBy: [{ size: "asc" }, { colorName: "asc" }],
    where:   { isActive: true },
  },
};

// ─── deleteProduct ────────────────────────────────────────────────────────────

export const deleteProductService = async (productId: string) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product");
    }

    // Delete dependents explicitly before the parent row
    await tx.productVariant.deleteMany({ where: { productId } });
    await tx.productCare.deleteMany({    where: { productId } });
    await tx.productImage.deleteMany({   where: { productId } });
    await tx.productSize.deleteMany({    where: { productId } });
    await tx.productColor.deleteMany({   where: { productId } });
    await tx.productDetail.deleteMany({  where: { productId } });

    await tx.product.delete({ where: { id: productId } });

    return product;
  });
};

// ─── createProduct ────────────────────────────────────────────────────────────

export async function createProduct(input:CreateProductInput) {
  const {
    colors,
    sizes,
    images,
    details,
    care,
    variants,
    categoryId,
    name,
    description,
    fabric,
    inStock,
    priceCents,
    discountedPriceCents,
    primaryImageUrl,
    stock,
  } = input;

  if (categoryId) {
    const exists = await prisma.category.findUnique({
      where:  { id: categoryId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundError(`Category with id "${categoryId}"`);
    }
  }

  return prisma.$transaction(async (tx) => {
    return tx.product.create({
      data: {
        name,
        description,
        fabric,
        inStock,
        priceCents,
        discountedPriceCents: discountedPriceCents ?? null,
        primaryImageUrl,
        stock:      stock      ?? null,
        categoryId: categoryId ?? null,

        colors:  { create: colors.map( (c) => ({ name: c.name, hex: c.hex, sortOrder: c.sortOrder })) },
        sizes:   { create: sizes.map(  (s) => ({ size: s.size, sortOrder: s.sortOrder })) },
        images:  { create: images.map( (i) => ({ url: i.url, alt: i.alt ?? "", sortOrder: i.sortOrder })) },
        details: { create: details.map((d) => ({ value: d.value, sortOrder: d.sortOrder })) },
        care:    { create: care.map(   (c) => ({ value: c.value, sortOrder: c.sortOrder })) },

        variants: {
          create: variants.map((v) => ({
            size:                 v.size,
            colorName:            v.colorName,
            sku:                  v.sku                  ?? null,
            priceCents:           v.priceCents,
            discountedPriceCents: v.discountedPriceCents  ?? null,
            stockQuantity:        v.stockQuantity          ?? 0,
            isActive:             v.isActive               ?? true,
          })),
        },
      },
      include: PRODUCT_INCLUDE,
    });
  });
}

export async function updateProductService(id: string, input: UpdateProductInput) {
  // 1. Verify product exists and get current price for cross-field validation
  const existing = await prisma.product.findUnique({
    where:  { id },
    select: { id: true, priceCents: true },
  });

  if (!existing) {
    throw new NotFoundError("Product");
  }

  // 2. Cross-field price validation
  //    Only run when discountedPriceCents is explicitly in the payload
  if (input.discountedPriceCents !== undefined) {
    const effectivePrice = input.priceCents ?? existing.priceCents;
    if (input.discountedPriceCents != null && input.discountedPriceCents >= effectivePrice) {
      throw new ValidationErrors({
        discountedPriceCents: "Discounted price must be less than the full price",
      });
    }
  }

  // 3. Verify categoryId if provided (null is allowed to clear the relation)
  if (input.categoryId !== undefined && input.categoryId !== null) {
    const category = await prisma.category.findUnique({
      where:  { id: input.categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundError(`Category with id "${input.categoryId}"`);
    }
  }

  const { colors, sizes, images, details, care, variants, categoryId } = input;

  // 4. Build a safe, whitelisted core update object
  //    Explicit field-by-field so no unexpected keys ever reach Prisma
  const coreUpdate: Prisma.ProductUpdateInput = {};

  if (input.name            !== undefined) coreUpdate.name            = input.name;
  if (input.description     !== undefined) coreUpdate.description     = input.description;
  if (input.fabric          !== undefined) coreUpdate.fabric          = input.fabric;
  if (input.inStock         !== undefined) coreUpdate.inStock         = input.inStock;
  if (input.priceCents      !== undefined) coreUpdate.priceCents      = input.priceCents;
  if (input.primaryImageUrl !== undefined) coreUpdate.primaryImageUrl = input.primaryImageUrl;
  if (input.stock           !== undefined) coreUpdate.stock           = input.stock;

  // Use `"in"` check because discountedPriceCents can legitimately be null
  if ("discountedPriceCents" in input) {
    coreUpdate.discountedPriceCents = input.discountedPriceCents;
  }

  // Use Prisma's connect/disconnect syntax for the category FK
  if (categoryId !== undefined) {
    coreUpdate.category = categoryId
      ? { connect: { id: categoryId } }
      : { disconnect: true };
  }

  // 5. Single transaction: core update + full-replace any provided relations
  const updated = await prisma.$transaction(async (tx) => {
    if (Object.keys(coreUpdate).length > 0) {
      await tx.product.update({ where: { id }, data: coreUpdate });
    }

    if (colors !== undefined) {
      await tx.productColor.deleteMany({ where: { productId: id } });
      if (colors.length > 0) {
        await tx.productColor.createMany({
          data: colors.map((c) => ({
            productId: id,
            name:      c.name,
            hex:       c.hex,
            sortOrder: c.sortOrder,
          })),
        });
      }
    }

    if (sizes !== undefined) {
      await tx.productSize.deleteMany({ where: { productId: id } });
      if (sizes.length > 0) {
        await tx.productSize.createMany({
          data: sizes.map((s) => ({
            productId: id,
            size:      s.size,
            sortOrder: s.sortOrder,
          })),
        });
      }
    }

    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((i) => ({
            productId: id,
            url:       i.url,
            alt:       i.alt ?? "",
            sortOrder: i.sortOrder,
          })),
        });
      }
    }

    if (details !== undefined) {
      await tx.productDetail.deleteMany({ where: { productId: id } });
      if (details.length > 0) {
        await tx.productDetail.createMany({
          data: details.map((d) => ({
            productId: id,
            value:     d.value,
            sortOrder: d.sortOrder,
          })),
        });
      }
    }

    if (care !== undefined) {
      await tx.productCare.deleteMany({ where: { productId: id } });
      if (care.length > 0) {
        await tx.productCare.createMany({
          data: care.map((c) => ({
            productId: id,
            value:     c.value,
            sortOrder: c.sortOrder,
          })),
        });
      }
    }

    if (variants !== undefined) {
      // ⚠ Full-replace breaks any CartItem / OrderItem rows pointing at old
      // variant IDs. Switch to an upsert strategy if you need to preserve those.
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v) => ({
            productId:            id,
            size:                 v.size,
            colorName:            v.colorName,
            sku:                  v.sku                  ?? null,
            priceCents:           v.priceCents,
            discountedPriceCents: v.discountedPriceCents  ?? null,
            stockQuantity:        v.stockQuantity,
            isActive:             v.isActive,
          })),
        });
      }
    }

    return tx.product.findUniqueOrThrow({
      where:   { id },
      include: PRODUCT_INCLUDE,
    });
  });

  return updated;
}