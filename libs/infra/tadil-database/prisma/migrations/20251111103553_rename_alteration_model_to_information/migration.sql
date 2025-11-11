/*
  Warnings:

  - You are about to drop the `_services-alterations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alterations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_services-alterations" DROP CONSTRAINT "_services-alterations_A_fkey";

-- DropForeignKey
ALTER TABLE "_services-alterations" DROP CONSTRAINT "_services-alterations_B_fkey";

-- DropTable
DROP TABLE "_services-alterations";

-- DropTable
DROP TABLE "alterations";

-- CreateTable
CREATE TABLE "informations" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "value" TEXT,
    "unit" TEXT,

    CONSTRAINT "informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_services-informations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_services-informations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_services-informations_B_index" ON "_services-informations"("B");

-- AddForeignKey
ALTER TABLE "_services-informations" ADD CONSTRAINT "_services-informations_A_fkey" FOREIGN KEY ("A") REFERENCES "informations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_services-informations" ADD CONSTRAINT "_services-informations_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
