ALTER TABLE "RetailProductQueryTask" ADD COLUMN "accountId" TEXT;
ALTER TABLE "RetailProductQuerySchedule" ADD COLUMN "accountId" TEXT;

CREATE INDEX "RetailProductQueryTask_accountId_createdAt_idx" ON "RetailProductQueryTask"("accountId", "createdAt");
CREATE INDEX "RetailProductQuerySchedule_accountId_idx" ON "RetailProductQuerySchedule"("accountId");

ALTER TABLE "RetailProductQueryTask" ADD CONSTRAINT "RetailProductQueryTask_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RetailProductQuerySchedule" ADD CONSTRAINT "RetailProductQuerySchedule_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
