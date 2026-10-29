-- AlterTable
ALTER TABLE "Account"
ADD COLUMN "disabledAt" TIMESTAMP(3),
ADD COLUMN "disabledReason" TEXT;

-- AlterTable
ALTER TABLE "PublicLink"
ADD COLUMN "disabledAt" TIMESTAMP(3),
ADD COLUMN "disabledReason" TEXT;

-- CreateIndex
CREATE INDEX "Account_disabledAt_idx" ON "Account"("disabledAt");

-- CreateIndex
CREATE INDEX "PublicLink_disabledAt_idx" ON "PublicLink"("disabledAt");
