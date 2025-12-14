-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_modelImageId_fkey";

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_modelImageId_fkey" FOREIGN KEY ("modelImageId") REFERENCES "models-images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
