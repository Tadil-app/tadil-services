-- Add Bengali/Hindi/Urdu names alongside the existing Arabic/English ones, so
-- cities, districts, and denormalized addresses render in any of the 5 supported
-- languages. New columns are added nullable, backfilled, then set NOT NULL where
-- the existing bilingual columns are NOT NULL (city names; district names stay
-- optional). City/District rows are re-seeded with translated data afterwards.

-- 1. City + District: add the three new name columns (nullable for backfill).
ALTER TABLE "cities" ADD COLUMN "nameBn" TEXT;
ALTER TABLE "cities" ADD COLUMN "nameHi" TEXT;
ALTER TABLE "cities" ADD COLUMN "nameUr" TEXT;

ALTER TABLE "districts" ADD COLUMN "nameBn" TEXT;
ALTER TABLE "districts" ADD COLUMN "nameHi" TEXT;
ALTER TABLE "districts" ADD COLUMN "nameUr" TEXT;

-- 2. Backfill existing city/district rows from English so the columns are
--    populated before the NOT NULL constraint. The seed (db seed) reinserts
--    these tables with proper transliterations right after migrating.
UPDATE "cities" SET "nameBn" = "nameEn", "nameHi" = "nameEn", "nameUr" = "nameAr";
UPDATE "districts" SET "nameBn" = "nameEn", "nameHi" = "nameEn", "nameUr" = "nameAr";

ALTER TABLE "cities" ALTER COLUMN "nameBn" SET NOT NULL;
ALTER TABLE "cities" ALTER COLUMN "nameHi" SET NOT NULL;
ALTER TABLE "cities" ALTER COLUMN "nameUr" SET NOT NULL;

ALTER TABLE "districts" ALTER COLUMN "nameBn" SET NOT NULL;
ALTER TABLE "districts" ALTER COLUMN "nameHi" SET NOT NULL;
ALTER TABLE "districts" ALTER COLUMN "nameUr" SET NOT NULL;

-- 3. Address: add denormalized city/district names for the new languages.
ALTER TABLE "addresses" ADD COLUMN "cityNameBn" TEXT;
ALTER TABLE "addresses" ADD COLUMN "cityNameHi" TEXT;
ALTER TABLE "addresses" ADD COLUMN "cityNameUr" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtNameBn" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtNameHi" TEXT;
ALTER TABLE "addresses" ADD COLUMN "districtNameUr" TEXT;

-- 4. Backfill addresses by matching the denormalized id to the (now translated)
--    city/district rows. cityId/districtId are loose (no FK), so a row may not
--    match; those fall back in step 5.
UPDATE "addresses" a
SET "cityNameBn" = c."nameBn",
    "cityNameHi" = c."nameHi",
    "cityNameUr" = c."nameUr"
FROM "cities" c
WHERE a."cityId" = c."id";

UPDATE "addresses" a
SET "districtNameBn" = d."nameBn",
    "districtNameHi" = d."nameHi",
    "districtNameUr" = d."nameUr"
FROM "districts" d
WHERE a."districtId" IS NOT NULL AND a."districtId" = d."id";

-- 5. Fallback: addresses whose id didn't match (hand-typed/geocoded, or matched
--    before the seed reinserts translations) reuse the English city name and the
--    Arabic-derived value, mirroring step 2.
UPDATE "addresses"
SET "cityNameBn" = COALESCE("cityNameBn", "cityNameEn"),
    "cityNameHi" = COALESCE("cityNameHi", "cityNameEn"),
    "cityNameUr" = COALESCE("cityNameUr", "cityNameAr");

UPDATE "addresses"
SET "districtNameBn" = COALESCE("districtNameBn", "districtNameEn"),
    "districtNameHi" = COALESCE("districtNameHi", "districtNameEn"),
    "districtNameUr" = COALESCE("districtNameUr", "districtNameAr")
WHERE "districtNameEn" IS NOT NULL OR "districtNameAr" IS NOT NULL;

-- 6. City names are required (match the bilingual columns); district names stay
--    nullable.
ALTER TABLE "addresses" ALTER COLUMN "cityNameBn" SET NOT NULL;
ALTER TABLE "addresses" ALTER COLUMN "cityNameHi" SET NOT NULL;
ALTER TABLE "addresses" ALTER COLUMN "cityNameUr" SET NOT NULL;
