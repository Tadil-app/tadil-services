-- CreateTable
CREATE TABLE "alterations" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,

    CONSTRAINT "alterations_pkey" PRIMARY KEY ("id")
);
