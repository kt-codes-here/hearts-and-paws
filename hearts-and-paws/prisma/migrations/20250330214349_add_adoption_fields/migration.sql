-- AlterTable
ALTER TABLE "AdoptionRequest" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "adoptedById" TEXT,
ADD COLUMN     "isAdopted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_adoptedById_fkey" FOREIGN KEY ("adoptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
