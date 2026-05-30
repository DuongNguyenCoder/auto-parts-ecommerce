/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CarModel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_slug_key" ON "CarModel"("slug");

-- CreateIndex
CREATE INDEX "CarModel_slug_idx" ON "CarModel"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
