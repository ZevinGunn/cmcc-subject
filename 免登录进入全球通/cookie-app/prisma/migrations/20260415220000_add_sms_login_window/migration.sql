-- AlterTable
ALTER TABLE "Account"
ADD COLUMN "smsLoginAt" TIMESTAMP(3),
ADD COLUMN "smsLoginExpireAt" TIMESTAMP(3);
