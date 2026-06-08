-- Bilingual, denormalized city/district on addresses so any viewer can render
-- the names in their own language.

-- 1. Add new columns (names nullable for now so we can backfill).
ALTER TABLE "addresses" ADD COLUMN "cityId" INTEGER;
ALTER TABLE "addresses" ADD COLUMN "cityNameAr" TEXT;
ALTER TABLE "addresses" ADD COLUMN "cityNameEn" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtId" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtNameAr" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtNameEn" TEXT;

-- 2. Backfill city names + id by matching the old single string against either language.
UPDATE "addresses" a
SET "cityNameAr" = c."nameAr",
    "cityNameEn" = c."nameEn",
    "cityId" = c."id"
FROM "cities" c
WHERE a."city" = c."nameAr" OR a."city" = c."nameEn";

-- 3. Backfill district names + id likewise.
UPDATE "addresses" a
SET "districtNameAr" = d."nameAr",
    "districtNameEn" = d."nameEn",
    "districtId" = d."id"
FROM "districts" d
WHERE a."district" IS NOT NULL AND (a."district" = d."nameAr" OR a."district" = d."nameEn");

-- 4. Fallback: rows whose city/district didn't match a known row keep the raw
--    string in both languages (hand-typed or geocoded values).
UPDATE "addresses"
SET "cityNameAr" = COALESCE("cityNameAr", "city"),
    "cityNameEn" = COALESCE("cityNameEn", "city");

UPDATE "addresses"
SET "districtNameAr" = COALESCE("districtNameAr", "district"),
    "districtNameEn" = COALESCE("districtNameEn", "district")
WHERE "district" IS NOT NULL;

-- 5. City names are required.
ALTER TABLE "addresses" ALTER COLUMN "cityNameAr" SET NOT NULL;
ALTER TABLE "addresses" ALTER COLUMN "cityNameEn" SET NOT NULL;

-- 6. Drop the old single-language columns.
ALTER TABLE "addresses" DROP COLUMN "city";
ALTER TABLE "addresses" DROP COLUMN "district";
