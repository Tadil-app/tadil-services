/*
  Warnings:

  - You are about to drop the `model_sections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `modelId` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "model_sections" DROP CONSTRAINT "model_sections_modelId_fkey";

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "coordinates" JSONB[],
ADD COLUMN     "modelId" TEXT NOT NULL;

-- DropTable
DROP TABLE "model_sections";

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
