-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_providerId_fkey";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
