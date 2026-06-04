-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "overview" TEXT;

-- CreateIndex
CREATE INDEX "Order_phone_idx" ON "Order"("phone");
