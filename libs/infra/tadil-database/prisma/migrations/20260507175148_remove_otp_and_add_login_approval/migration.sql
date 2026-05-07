/*
  Warnings:

  - You are about to drop the `otps` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LoginRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "otps" DROP CONSTRAINT "otps_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "loginRequestStatus" "LoginRequestStatus",
ADD COLUMN     "loginToken" TEXT;

-- DropTable
DROP TABLE "otps";
