/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cartId_fkey";

-- DropIndex
DROP INDEX "Cart_clerkUserId_key";

-- DropIndex
DROP INDEX "User_cartId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "clerkUserId",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cartId";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_clerkId_key" ON "Cart"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_variantId_idx" ON "CartItem"("variantId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
