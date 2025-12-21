/*
  Warnings:

  - The `category` column on the `models` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ModelCategory" AS ENUM ('all', 'men', 'women', 'kids');

-- AlterTable
ALTER TABLE "models" DROP COLUMN "category",
ADD COLUMN     "category" "ModelCategory" NOT NULL DEFAULT 'all';
