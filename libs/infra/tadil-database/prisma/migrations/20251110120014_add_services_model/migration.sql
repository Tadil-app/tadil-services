-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_services-sections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_services-sections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_services-alterations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_services-alterations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_services-sections_B_index" ON "_services-sections"("B");

-- CreateIndex
CREATE INDEX "_services-alterations_B_index" ON "_services-alterations"("B");

-- AddForeignKey
ALTER TABLE "_services-sections" ADD CONSTRAINT "_services-sections_A_fkey" FOREIGN KEY ("A") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_services-sections" ADD CONSTRAINT "_services-sections_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_services-alterations" ADD CONSTRAINT "_services-alterations_A_fkey" FOREIGN KEY ("A") REFERENCES "alterations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_services-alterations" ADD CONSTRAINT "_services-alterations_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
