/*
  Warnings:

  - You are about to drop the column `imageFileId` on the `models` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `sections` table. All the data in the column will be lost.
  - Added the required column `modelImageId` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_modelId_fkey";

-- AlterTable
ALTER TABLE "models" DROP COLUMN "imageFileId";

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "modelId",
ADD COLUMN     "modelImageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "models-images" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "models-images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_modelImageId_fkey" FOREIGN KEY ("modelImageId") REFERENCES "models-images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models-images" ADD CONSTRAINT "models-images_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
