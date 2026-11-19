-- AlterTable
ALTER TABLE "users" ADD COLUMN "sessionsValidAfter" TIMESTAMP(3);

-- Sessions issued before this deploy skipped re-approval (the approval token
-- was never cleared). Sign tailors and couriers out so they request it again.
UPDATE "users" SET "sessionsValidAfter" = date_trunc('second', NOW()) WHERE "role" IN ('tailor', 'courier');
