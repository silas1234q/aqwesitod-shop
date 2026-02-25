-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "new" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "inStock" SET DEFAULT true;
