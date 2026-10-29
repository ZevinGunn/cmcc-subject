ALTER TABLE "Account"
ADD COLUMN "activationInfoEnc" TEXT,
ADD COLUMN "activationCheckedAt" TIMESTAMP(3),
ADD COLUMN "qqtSignInfoEnc" TEXT,
ADD COLUMN "qqtSignResultEnc" TEXT,
ADD COLUMN "qqtSignUpdatedAt" TIMESTAMP(3),
ADD COLUMN "xdrReceiveEnc" TEXT,
ADD COLUMN "xdrReceiveUpdatedAt" TIMESTAMP(3);
