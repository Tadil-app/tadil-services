-- AlterTable
ALTER TABLE "order-item-alterations" ADD COLUMN     "customOrderItemId" TEXT,
ALTER COLUMN "orderItemSectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order-item-alterations" ADD CONSTRAINT "order-item-alterations_customOrderItemId_fkey" FOREIGN KEY ("customOrderItemId") REFERENCES "custom-order-items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
