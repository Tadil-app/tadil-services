-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('TAILOR', 'COURIER');

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chats_orderId_channel_key" ON "chats"("orderId", "channel");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
