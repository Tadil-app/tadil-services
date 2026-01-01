-- CreateTable
CREATE TABLE "_alterations-extras" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_alterations-extras_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_alterations-extras_B_index" ON "_alterations-extras"("B");

-- AddForeignKey
ALTER TABLE "_alterations-extras" ADD CONSTRAINT "_alterations-extras_A_fkey" FOREIGN KEY ("A") REFERENCES "alterations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alterations-extras" ADD CONSTRAINT "_alterations-extras_B_fkey" FOREIGN KEY ("B") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
