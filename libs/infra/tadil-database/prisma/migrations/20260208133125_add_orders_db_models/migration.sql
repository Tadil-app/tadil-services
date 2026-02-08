-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'inProgress', 'completed', 'waitingForPickup');

-- CreateTable
CREATE TABLE "order-item-alteration-informations" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sourceInformationId" TEXT NOT NULL,
    "orderItemAlterationId" TEXT NOT NULL,

    CONSTRAINT "order-item-alteration-informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order-item-alterations" (
    "id" TEXT NOT NULL,
    "sourceAlterationId" TEXT NOT NULL,
    "orderItemSectionId" TEXT NOT NULL,

    CONSTRAINT "order-item-alterations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order-item-sections" (
    "id" TEXT NOT NULL,
    "sourceSectionId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,

    CONSTRAINT "order-item-sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order-items" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "order-items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom-order-items" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "modelId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "custom-order-items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order-item-alteration-informations" ADD CONSTRAINT "order-item-alteration-informations_orderItemAlterationId_fkey" FOREIGN KEY ("orderItemAlterationId") REFERENCES "order-item-alterations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-item-alterations" ADD CONSTRAINT "order-item-alterations_orderItemSectionId_fkey" FOREIGN KEY ("orderItemSectionId") REFERENCES "order-item-sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-item-sections" ADD CONSTRAINT "order-item-sections_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order-items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom-order-items" ADD CONSTRAINT "custom-order-items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
