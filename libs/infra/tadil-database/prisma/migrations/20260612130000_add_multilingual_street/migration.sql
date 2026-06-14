-- Add per-language street labels alongside the legacy `street`. The map pin is
-- reverse-geocoded once per supported language, so the street can render in the
-- viewer's language. All columns are nullable (street has always been optional).

ALTER TABLE "addresses" ADD COLUMN "streetAr" TEXT;
ALTER TABLE "addresses" ADD COLUMN "streetEn" TEXT;
ALTER TABLE "addresses" ADD COLUMN "streetBn" TEXT;
ALTER TABLE "addresses" ADD COLUMN "streetHi" TEXT;
ALTER TABLE "addresses" ADD COLUMN "streetUr" TEXT;

-- Backfill existing rows: the single legacy label was geocoded in whatever the
-- viewer's language was at pick time. Seed it as the English variant so existing
-- addresses still show a street; new addresses get all 5 populated on save.
UPDATE "addresses" SET "streetEn" = "street" WHERE "street" IS NOT NULL;
