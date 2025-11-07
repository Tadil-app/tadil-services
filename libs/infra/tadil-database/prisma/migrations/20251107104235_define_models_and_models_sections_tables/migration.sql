-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_sections" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "urduName" TEXT NOT NULL,
    "hindiName" TEXT NOT NULL,
    "bengaliName" TEXT NOT NULL,
    "coordinates" JSONB[],
    "modelId" TEXT NOT NULL,

    CONSTRAINT "model_sections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "model_sections" ADD CONSTRAINT "model_sections_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
