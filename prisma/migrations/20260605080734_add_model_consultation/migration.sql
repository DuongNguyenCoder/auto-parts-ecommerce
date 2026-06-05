-- CreateEnum
CREATE TYPE "ConsulationStatus" AS ENUM ('PENDING', 'PROCESSED');

-- CreateTable
CREATE TABLE "Consulation" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "note" TEXT,
    "status" "ConsulationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consulation_phone_idx" ON "Consulation"("phone");
