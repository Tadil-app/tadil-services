-- Transportation fee charged on each order (already included in totalPrice).
ALTER TABLE "orders" ADD COLUMN "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Per-user rate becomes an optional override of the global tailor rate.
-- 10 was the column default, so those rows had no custom rate.
ALTER TABLE "users" ALTER COLUMN "commissionRate" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "commissionRate" DROP DEFAULT;
UPDATE "users" SET "commissionRate" = NULL WHERE "commissionRate" = 10;

CREATE TABLE "platform-settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "freeDeliveryThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "courierBasePayout" DOUBLE PRECISION NOT NULL DEFAULT 7.5,
    "tailorCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "courierCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 6.5,
    CONSTRAINT "platform-settings_pkey" PRIMARY KEY ("id")
);
INSERT INTO "platform-settings" ("id") VALUES (1);

-- The system role is not editable in the admin, so grant it the new permissions here.
UPDATE "StaffRole"
SET "permissions" = "permissions" || ARRAY['settings.read', 'settings.update']
WHERE "isSystem" = true AND NOT ('settings.read' = ANY("permissions"));
