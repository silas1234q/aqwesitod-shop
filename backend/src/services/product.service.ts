import { prisma } from "../config/prisma"
import NotFoundError from "../errors/NotFoundError"



export const deleteProductService = async (productId: string) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundError("Product");

    // delete dependents first
    await tx.productVariant.deleteMany({ where: { productId } });
    await tx.productCare.deleteMany({ where: { productId } });
    await tx.productImage.deleteMany({ where: { productId } });
    await tx.productSize.deleteMany({ where: { productId } });
    await tx.productColor.deleteMany({ where: { productId } });
    await tx.productDetail.deleteMany({ where: { productId } });

    // delete parent last
    await tx.product.delete({ where: { id: productId } });

    return product;
  });
};