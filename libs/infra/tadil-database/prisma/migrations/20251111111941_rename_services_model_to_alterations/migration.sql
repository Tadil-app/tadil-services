/*
  Warnings:

  - You are about to drop the `_services-informations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_services-sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_services-informations" DROP CONSTRAINT "_services-informations_A_fkey";

-- DropForeignKey
ALTER TABLE "_services-informations" DROP CONSTRAINT "_services-informations_B_fkey";

-- DropForeignKey
ALTER TABLE "_services-sections" DROP CONSTRAINT "_services-sections_A_fkey";

-- DropForeignKey
ALTER TABLE "_services-sections" DROP CONSTRAINT "_services-sections_B_fkey";

-- DropTable
DROP TABLE "_services-informations";

-- DropTable
DROP TABLE "_services-sections";

-- DropTable
DROP TABLE "services";

-- CreateTable
CREATE TABLE "alterations" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "alterations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_alterations-sections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_alterations-sections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_alterations-informations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_alterations-informations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_alterations-sections_B_index" ON "_alterations-sections"("B");

-- CreateIndex
CREATE INDEX "_alterations-informations_B_index" ON "_alterations-informations"("B");

-- AddForeignKey
ALTER TABLE "_alterations-sections" ADD CONSTRAINT "_alterations-sections_A_fkey" FOREIGN KEY ("A") REFERENCES "alterations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alterations-sections" ADD CONSTRAINT "_alterations-sections_B_fkey" FOREIGN KEY ("B") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alterations-informations" ADD CONSTRAINT "_alterations-informations_A_fkey" FOREIGN KEY ("A") REFERENCES "alterations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alterations-informations" ADD CONSTRAINT "_alterations-informations_B_fkey" FOREIGN KEY ("B") REFERENCES "informations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
