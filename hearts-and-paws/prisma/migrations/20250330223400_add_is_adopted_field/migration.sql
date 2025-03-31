/*
  Warnings:

  - You are about to drop the column `isRead` on the `AdoptionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `adoptedById` on the `Pet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_adoptedById_fkey";

-- AlterTable
ALTER TABLE "AdoptionRequest" DROP COLUMN "isRead";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "adoptedById",
ADD COLUMN     "adoptedBy" TEXT;
