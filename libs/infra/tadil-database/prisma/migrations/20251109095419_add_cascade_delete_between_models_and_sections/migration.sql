-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_modelId_fkey";

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
