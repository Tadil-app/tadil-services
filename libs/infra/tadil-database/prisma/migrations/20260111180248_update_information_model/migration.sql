-- CreateEnum
CREATE TYPE "InformationType" AS ENUM ('text', 'number', 'select_menu', 'checkbox');

-- AlterTable
ALTER TABLE "informations" ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "InformationType" NOT NULL DEFAULT 'text';
