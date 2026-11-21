-- CreateTable
CREATE TABLE "StaffMfaChallenge" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "challengeTokenHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "usedAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffMfaChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffMfaChallenge_challengeTokenHash_key" ON "StaffMfaChallenge"("challengeTokenHash");

-- CreateIndex
CREATE INDEX "StaffMfaChallenge_accountId_idx" ON "StaffMfaChallenge"("accountId");

-- AddForeignKey
ALTER TABLE "StaffMfaChallenge" ADD CONSTRAINT "StaffMfaChallenge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "StaffAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
