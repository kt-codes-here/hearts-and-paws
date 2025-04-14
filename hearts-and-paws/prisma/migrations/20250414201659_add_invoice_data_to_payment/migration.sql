/*
  Warnings:

  - You are about to drop the column `invoiceUrl` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceUrl",
ADD COLUMN     "invoiceData" JSONB;
