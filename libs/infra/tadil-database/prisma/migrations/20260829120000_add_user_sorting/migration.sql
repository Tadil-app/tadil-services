ALTER TABLE "users" ADD COLUMN "sorting" INTEGER NOT NULL DEFAULT 1;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY role ORDER BY "firstName", "lastName", id) AS n
  FROM "users"
)
UPDATE "users" SET "sorting" = numbered.n FROM numbered WHERE "users".id = numbered.id;
