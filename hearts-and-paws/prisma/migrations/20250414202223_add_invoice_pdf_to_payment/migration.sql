/*
  Warnings:

  - You are about to drop the column `invoiceData` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceData",
ADD COLUMN     "invoicePdf" TEXT,
ADD COLUMN     "invoiceUrl" TEXT;
