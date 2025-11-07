/*
  Warnings:

  - Added the required column `imageFileId` to the `models` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "models" ADD COLUMN     "imageFileId" TEXT NOT NULL;
