-- AlterTable
ALTER TABLE "sections" ADD COLUMN "sorting" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "sections" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "alterations" ADD COLUMN "sorting" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "informations" ADD COLUMN "sorting" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "extras" ADD COLUMN "sorting" INTEGER NOT NULL DEFAULT 0;

-- Backfill sections per model image (stable current row order)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "modelImageId" ORDER BY id) - 1 AS n
  FROM "sections"
)
UPDATE "sections" SET "sorting" = numbered.n FROM numbered WHERE "sections".id = numbered.id;

-- Backfill catalog tables
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS n FROM "alterations"
)
UPDATE "alterations" SET "sorting" = numbered.n FROM numbered WHERE "alterations".id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS n FROM "informations"
)
UPDATE "informations" SET "sorting" = numbered.n FROM numbered WHERE "informations".id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS n FROM "extras"
)
UPDATE "extras" SET "sorting" = numbered.n FROM numbered WHERE "extras".id = numbered.id;
