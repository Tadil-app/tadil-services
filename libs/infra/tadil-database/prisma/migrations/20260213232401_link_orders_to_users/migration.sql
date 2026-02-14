-- DropForeignKey
ALTER TABLE "custom-order-items" DROP CONSTRAINT "custom-order-items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order-item-alterations" DROP CONSTRAINT "order-item-alterations_customOrderItemId_fkey";

-- DropForeignKey
ALTER TABLE "order-item-sections" DROP CONSTRAINT "order-item-sections_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "order-items" DROP CONSTRAINT "order-items_orderId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "assignedCourierId" TEXT,
ADD COLUMN     "assignedTailorId" TEXT;

-- CreateTable
CREATE TABLE "_user-rejected-orders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user-rejected-orders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_courier-rejected-orders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_courier-rejected-orders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_user-rejected-orders_B_index" ON "_user-rejected-orders"("B");

-- CreateIndex
CREATE INDEX "_courier-rejected-orders_B_index" ON "_courier-rejected-orders"("B");

-- AddForeignKey
ALTER TABLE "order-item-alterations" ADD CONSTRAINT "order-item-alterations_customOrderItemId_fkey" FOREIGN KEY ("customOrderItemId") REFERENCES "custom-order-items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-item-sections" ADD CONSTRAINT "order-item-sections_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order-items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom-order-items" ADD CONSTRAINT "custom-order-items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assignedTailorId_fkey" FOREIGN KEY ("assignedTailorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assignedCourierId_fkey" FOREIGN KEY ("assignedCourierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-rejected-orders" ADD CONSTRAINT "_user-rejected-orders_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-rejected-orders" ADD CONSTRAINT "_user-rejected-orders_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courier-rejected-orders" ADD CONSTRAINT "_courier-rejected-orders_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courier-rejected-orders" ADD CONSTRAINT "_courier-rejected-orders_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
