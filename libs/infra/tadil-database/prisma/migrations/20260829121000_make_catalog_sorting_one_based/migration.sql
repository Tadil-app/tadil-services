UPDATE "sections" SET "sorting" = "sorting" + 1;
UPDATE "alterations" SET "sorting" = "sorting" + 1;
UPDATE "informations" SET "sorting" = "sorting" + 1;
UPDATE "extras" SET "sorting" = "sorting" + 1;

ALTER TABLE "sections" ALTER COLUMN "sorting" SET DEFAULT 1;
ALTER TABLE "alterations" ALTER COLUMN "sorting" SET DEFAULT 1;
ALTER TABLE "informations" ALTER COLUMN "sorting" SET DEFAULT 1;
ALTER TABLE "extras" ALTER COLUMN "sorting" SET DEFAULT 1;
