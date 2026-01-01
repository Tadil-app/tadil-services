-- CreateTable
CREATE TABLE "extras" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("id")
);
