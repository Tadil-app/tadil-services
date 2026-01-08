/*
  Warnings:

  - You are about to drop the `_alterations-extras` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_alterations-extras" DROP CONSTRAINT "_alterations-extras_A_fkey";

-- DropForeignKey
ALTER TABLE "_alterations-extras" DROP CONSTRAINT "_alterations-extras_B_fkey";

-- DropTable
DROP TABLE "_alterations-extras";

-- CreateTable
CREATE TABLE "_informations-extras" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_informations-extras_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_informations-extras_B_index" ON "_informations-extras"("B");

-- AddForeignKey
ALTER TABLE "_informations-extras" ADD CONSTRAINT "_informations-extras_A_fkey" FOREIGN KEY ("A") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_informations-extras" ADD CONSTRAINT "_informations-extras_B_fkey" FOREIGN KEY ("B") REFERENCES "informations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
