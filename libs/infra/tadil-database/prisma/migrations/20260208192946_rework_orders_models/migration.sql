/*
  Warnings:

  - You are about to drop the column `modelId` on the `custom-order-items` table. All the data in the column will be lost.
  - You are about to drop the column `sourceInformationId` on the `order-item-alteration-informations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceAlterationId` on the `order-item-alterations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceSectionId` on the `order-item-sections` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `order-items` table. All the data in the column will be lost.
  - Added the required column `imageFileId` to the `custom-order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arabicName` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bengaliName` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hindiName` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urduName` to the `order-item-alteration-informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arabicName` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bengaliName` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hindiName` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urduName` to the `order-item-alterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arabicName` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bengaliName` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hindiName` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageFileId` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urduName` to the `order-item-sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arabicName` to the `order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bengaliName` to the `order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hindiName` to the `order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageFileId` to the `order-items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urduName` to the `order-items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "custom-order-items" DROP COLUMN "modelId",
ADD COLUMN     "imageFileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-item-alteration-informations" DROP COLUMN "sourceInformationId",
ADD COLUMN     "arabicName" TEXT NOT NULL,
ADD COLUMN     "bengaliName" TEXT NOT NULL,
ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "hindiName" TEXT NOT NULL,
ADD COLUMN     "type" "InformationType" NOT NULL,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "urduName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-item-alterations" DROP COLUMN "sourceAlterationId",
ADD COLUMN     "arabicName" TEXT NOT NULL,
ADD COLUMN     "bengaliName" TEXT NOT NULL,
ADD COLUMN     "customCoordinates" JSONB[],
ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "hindiName" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "urduName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-item-sections" DROP COLUMN "sourceSectionId",
ADD COLUMN     "arabicName" TEXT NOT NULL,
ADD COLUMN     "bengaliName" TEXT NOT NULL,
ADD COLUMN     "coordinates" JSONB[],
ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "hindiName" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT NOT NULL,
ADD COLUMN     "urduName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-items" DROP COLUMN "modelId",
ADD COLUMN     "arabicName" TEXT NOT NULL,
ADD COLUMN     "bengaliName" TEXT NOT NULL,
ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "hindiName" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT NOT NULL,
ADD COLUMN     "urduName" TEXT NOT NULL;
