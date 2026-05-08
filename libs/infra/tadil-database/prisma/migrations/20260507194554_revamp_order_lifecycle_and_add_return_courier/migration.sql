/*
  Warnings:

  - The values [completed,waitingForPickup] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('pending', 'waitingForTailorAssignement', 'waitingForCourierAssignement', 'waitingForPickupFromCustomer', 'waitingForDropoffToTailor', 'inProgress', 'waitingForReturnCourierAssignement', 'waitingForPickupFromTailor', 'waitingForDropoffToCustomer', 'done');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "assignedReturnCourierId" TEXT;

-- CreateTable
CREATE TABLE "_return-courier-rejected-orders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_return-courier-rejected-orders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_return-courier-rejected-orders_B_index" ON "_return-courier-rejected-orders"("B");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assignedReturnCourierId_fkey" FOREIGN KEY ("assignedReturnCourierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_return-courier-rejected-orders" ADD CONSTRAINT "_return-courier-rejected-orders_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_return-courier-rejected-orders" ADD CONSTRAINT "_return-courier-rejected-orders_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
