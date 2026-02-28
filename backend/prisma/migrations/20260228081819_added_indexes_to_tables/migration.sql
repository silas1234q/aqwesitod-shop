/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductCare_productId_idx";

-- DropIndex
DROP INDEX "ProductDetail_productId_idx";

-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- CreateIndex
CREATE INDEX "Cart_updatedAt_idx" ON "Cart"("updatedAt");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Product_inStock_idx" ON "Product"("inStock");

-- CreateIndex
CREATE INDEX "Product_priceCents_idx" ON "Product"("priceCents");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_categoryId_inStock_priceCents_idx" ON "Product"("categoryId", "inStock", "priceCents");

-- CreateIndex
CREATE INDEX "Product_searchVector_idx" ON "Product" USING GIN ("searchVector");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "ProductCare_productId_sortOrder_idx" ON "ProductCare"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductColor_productId_sortOrder_idx" ON "ProductColor"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductDetail_productId_sortOrder_idx" ON "ProductDetail"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductSize_productId_sortOrder_idx" ON "ProductSize"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_isActive_stockQuantity_idx" ON "ProductVariant"("productId", "isActive", "stockQuantity");

-- CreateIndex
CREATE INDEX "ProductVariant_isActive_stockQuantity_idx" ON "ProductVariant"("isActive", "stockQuantity");

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
