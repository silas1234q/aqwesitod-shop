import { Prisma } from "@prisma/client";


import type { CreateProductInput, UpdateProductInput } from "../utils/zod.schema";
import { prisma } from "../config/prisma";
import NotFoundError from "../errors/NotFoundError";
import ValidationErrors from "../errors/ValidationError";

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

// ─── Transaction options ───────────────────────────────────────────────────────
// Default is 5 000 ms. We raise it to 30 s as a safety net.
// The real fix is parallelising DB calls so we never get close to it.

const TX_OPTIONS = { timeout: 30_000 };

// ─── deleteProduct ────────────────────────────────────────────────────────────

export const deleteProductService = async (productId: string) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError(`Product with id "${productId}".`);
    }

    // Delete all children in parallel — they share no dependencies on each other
    await Promise.all([
      tx.productVariant.deleteMany({ where: { productId } }),
      tx.productCare.deleteMany({   where: { productId } }),
      tx.productImage.deleteMany({  where: { productId } }),
      tx.productSize.deleteMany({   where: { productId } }),
      tx.productColor.deleteMany({  where: { productId } }),
      tx.productDetail.deleteMany({ where: { productId } }),
    ]);

    await tx.product.delete({ where: { id: productId } });

    return product;
  }, TX_OPTIONS);
};

// ─── createProduct ────────────────────────────────────────────────────────────

export async function createProduct(input: CreateProductInput) {
  const {
    colors, sizes, images, details, care, variants,
    categoryId, name, description, fabric, inStock,
    priceCents, discountedPriceCents, primaryImageUrl, stock,
  } = input;

  if (categoryId) {
    const exists = await prisma.category.findUnique({
      where: { id: categoryId }, select: { id: true },
    });
    if (!exists) {
      throw new NotFoundError(`Category with id "${categoryId}".`);
    }
  }

  // createProduct uses nested writes — Prisma handles them efficiently in one
  // round trip so no parallelisation is needed here.
  return prisma.$transaction(async (tx) => {
    return tx.product.create({
      data: {
        name, description, fabric, inStock, priceCents,
        discountedPriceCents: discountedPriceCents ?? null,
        primaryImageUrl,
        stock:      stock      ?? null,
        categoryId: categoryId ?? null,

        colors:   { create: colors.map(  (c) => ({ name: c.name, hex: c.hex, sortOrder: c.sortOrder })) },
        sizes:    { create: sizes.map(   (s) => ({ size: s.size, sortOrder: s.sortOrder })) },
        images:   { create: images.map(  (i) => ({ url: i.url, alt: i.alt ?? "", sortOrder: i.sortOrder })) },
        details:  { create: details.map( (d) => ({ value: d.value, sortOrder: d.sortOrder })) },
        care:     { create: care.map(    (c) => ({ value: c.value, sortOrder: c.sortOrder })) },
        variants: {
          create: variants.map((v) => ({
            size:                 v.size,
            colorName:            v.colorName,
            sku:                  v.sku                 ?? null,
            priceCents:           v.priceCents,
            discountedPriceCents: v.discountedPriceCents ?? null,
            stockQuantity:        v.stockQuantity        ?? 0,
            isActive:             v.isActive             ?? true,
          })),
        },
      },
      include: PRODUCT_INCLUDE,
    });
  }, TX_OPTIONS);
}

// ─── updateProduct ────────────────────────────────────────────────────────────
//
// Relation strategy: full-replace.
// If a relation key is present in the payload (even as []) → delete all existing
// records and insert the new set.
// If a relation key is absent entirely → leave existing records untouched.
//
// Performance strategy: all deletes run in parallel, then all inserts run in
// parallel. This cuts 14 sequential round-trips down to 3 parallel batches,
// keeping the total well inside the transaction timeout.

export async function updateProductService(id: string, input: UpdateProductInput) {
  // 1. Verify product exists and get current price for cross-field validation
  const existing = await prisma.product.findUnique({
    where: { id }, select: { id: true, priceCents: true },
  });

  if (!existing) {
    throw new NotFoundError(`Product with id "${id}".`);
  }

  // 2. Cross-field price validation
  if (input.discountedPriceCents !== undefined) {
    const effectivePrice = input.priceCents ?? existing.priceCents;
    if (input.discountedPriceCents != null && input.discountedPriceCents >= effectivePrice) {
      throw new ValidationErrors({
        discountedPriceCents: "Discounted price must be less than the regular price.",
      });
    }
  }

  // 3. Verify categoryId if provided (null clears the relation)
  if (input.categoryId !== undefined && input.categoryId !== null) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId }, select: { id: true },
    });
    if (!category) {
      throw new NotFoundError(`Category with id "${input.categoryId}".`);
    }
  }

  const { colors, sizes, images, details, care, variants, categoryId } = input;

  // 4. Build whitelisted core update payload
  const coreUpdate: Prisma.ProductUpdateInput = {};

  if (input.name            !== undefined) coreUpdate.name            = input.name;
  if (input.description     !== undefined) coreUpdate.description     = input.description;
  if (input.fabric          !== undefined) coreUpdate.fabric          = input.fabric;
  if (input.inStock         !== undefined) coreUpdate.inStock         = input.inStock;
  if (input.priceCents      !== undefined) coreUpdate.priceCents      = input.priceCents;
  if (input.primaryImageUrl !== undefined) coreUpdate.primaryImageUrl = input.primaryImageUrl;
  if (input.stock           !== undefined) coreUpdate.stock           = input.stock;

  if ("discountedPriceCents" in input) {
    coreUpdate.discountedPriceCents = input.discountedPriceCents;
  }

  if (categoryId !== undefined) {
    coreUpdate.category = categoryId
      ? { connect: { id: categoryId } }
      : { disconnect: true };
  }

  // 5. Transaction with parallelised operations
  const updated = await prisma.$transaction(async (tx) => {

    // ── Step A: core scalar update (must finish before relations) ──────────
    if (Object.keys(coreUpdate).length > 0) {
      await tx.product.update({ where: { id }, data: coreUpdate });
    }

    // ── Step B: delete stale relation rows — all in parallel ───────────────
    await Promise.all([
      colors   !== undefined && tx.productColor.deleteMany({   where: { productId: id } }),
      sizes    !== undefined && tx.productSize.deleteMany({    where: { productId: id } }),
      images   !== undefined && tx.productImage.deleteMany({   where: { productId: id } }),
      details  !== undefined && tx.productDetail.deleteMany({  where: { productId: id } }),
      care     !== undefined && tx.productCare.deleteMany({    where: { productId: id } }),
      variants !== undefined && tx.productVariant.deleteMany({ where: { productId: id } }),
    ].filter(Boolean));

    // ── Step C: insert new relation rows — all in parallel ─────────────────
    await Promise.all([
      colors?.length && tx.productColor.createMany({
        data: colors.map((c) => ({ productId: id, name: c.name, hex: c.hex, sortOrder: c.sortOrder })),
      }),
      sizes?.length && tx.productSize.createMany({
        data: sizes.map((s) => ({ productId: id, size: s.size, sortOrder: s.sortOrder })),
      }),
      images?.length && tx.productImage.createMany({
        data: images.map((i) => ({ productId: id, url: i.url, alt: i.alt ?? "", sortOrder: i.sortOrder })),
      }),
      details?.length && tx.productDetail.createMany({
        data: details.map((d) => ({ productId: id, value: d.value, sortOrder: d.sortOrder })),
      }),
      care?.length && tx.productCare.createMany({
        data: care.map((c) => ({ productId: id, value: c.value, sortOrder: c.sortOrder })),
      }),
      variants?.length && tx.productVariant.createMany({
        data: variants.map((v) => ({
          productId:            id,
          size:                 v.size,
          colorName:            v.colorName,
          sku:                  v.sku                 ?? null,
          priceCents:           v.priceCents,
          discountedPriceCents: v.discountedPriceCents ?? null,
          stockQuantity:        v.stockQuantity,
          isActive:             v.isActive,
        })),
      }),
    ].filter(Boolean));

    // ── Step D: return the fully loaded product ────────────────────────────
    return tx.product.findUniqueOrThrow({
      where:   { id },
      include: PRODUCT_INCLUDE,
    });

  }, TX_OPTIONS);

  return updated;
}