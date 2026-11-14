-- CreateTable
CREATE TABLE "device-tokens" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'ar',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device-tokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "push-dispatches" (
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push-dispatches_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "device-tokens_userId_idx" ON "device-tokens"("userId");

-- AddForeignKey
ALTER TABLE "device-tokens" ADD CONSTRAINT "device-tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

