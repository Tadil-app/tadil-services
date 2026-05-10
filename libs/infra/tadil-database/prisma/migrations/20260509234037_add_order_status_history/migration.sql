-- CreateTable
CREATE TABLE "order-status-histories" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order-status-histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order-status-histories" ADD CONSTRAINT "order-status-histories_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
