-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "shotsUpToDate" BOOLEAN NOT NULL,
    "microchipped" BOOLEAN NOT NULL,
    "houseTrained" BOOLEAN NOT NULL,
    "goodWithDogs" BOOLEAN NOT NULL,
    "goodWithCats" BOOLEAN NOT NULL,
    "goodWithKids" BOOLEAN NOT NULL,
    "purebred" BOOLEAN NOT NULL,
    "specialNeeds" BOOLEAN NOT NULL,
    "behavioralIssues" BOOLEAN NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adoption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "postcode" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "hasGarden" BOOLEAN NOT NULL,
    "homeSituation" TEXT NOT NULL,
    "householdSetting" TEXT NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "homePhotos" TEXT[],
    "numAdults" INTEGER NOT NULL,
    "numChildren" INTEGER NOT NULL,
    "youngestChildAge" INTEGER NOT NULL,
    "visitingChildren" BOOLEAN NOT NULL,
    "visitingChildrenAges" TEXT,
    "flatmatesOrLodgers" BOOLEAN NOT NULL,
    "allergiesToPets" BOOLEAN NOT NULL,
    "previousPetExperience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adoption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rehome" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "durationToKeepPet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rehome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rehome" ADD CONSTRAINT "Rehome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rehome" ADD CONSTRAINT "Rehome_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
