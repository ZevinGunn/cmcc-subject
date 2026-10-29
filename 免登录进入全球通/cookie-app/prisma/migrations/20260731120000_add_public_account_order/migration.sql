ALTER TABLE "Account"
ADD COLUMN "publicPinnedAt" TIMESTAMP(3),
ADD COLUMN "publicSortOrder" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Account_userId_publicPinnedAt_publicSortOrder_idx"
ON "Account"("userId", "publicPinnedAt", "publicSortOrder");
