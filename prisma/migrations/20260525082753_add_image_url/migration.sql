-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
