-- CreateTable
CREATE TABLE "RetailProduct" (
    "productCode" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT,
    "normCount" INTEGER NOT NULL DEFAULT 0,
    "contentJson" TEXT NOT NULL,
    "firstFoundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastFoundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastQueriedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RetailProduct_pkey" PRIMARY KEY ("productCode")
);

CREATE TABLE "RetailProductQuerySchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "startCode" TEXT NOT NULL,
    "endCode" TEXT NOT NULL,
    "executionMode" TEXT NOT NULL DEFAULT 'sequential',
    "queryIntervalMs" INTEGER NOT NULL DEFAULT 1000,
    "concurrency" INTEGER NOT NULL DEFAULT 1,
    "runIntervalSec" INTEGER NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RetailProductQuerySchedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RetailProductQueryTask" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "executionMode" TEXT NOT NULL DEFAULT 'sequential',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "intervalMs" INTEGER NOT NULL DEFAULT 1000,
    "concurrency" INTEGER NOT NULL DEFAULT 1,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "foundCount" INTEGER NOT NULL DEFAULT 0,
    "notFoundCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "currentCode" TEXT,
    "message" TEXT,
    "scheduleId" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RetailProductQueryTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RetailProductQueryItem" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "errorCode" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RetailProductQueryItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RetailProduct_productName_idx" ON "RetailProduct"("productName");
CREATE INDEX "RetailProduct_lastFoundAt_idx" ON "RetailProduct"("lastFoundAt");
CREATE INDEX "RetailProductQuerySchedule_enabled_nextRunAt_idx" ON "RetailProductQuerySchedule"("enabled", "nextRunAt");
CREATE INDEX "RetailProductQueryTask_status_createdAt_idx" ON "RetailProductQueryTask"("status", "createdAt");
CREATE INDEX "RetailProductQueryTask_scheduleId_createdAt_idx" ON "RetailProductQueryTask"("scheduleId", "createdAt");
CREATE UNIQUE INDEX "RetailProductQueryItem_taskId_productCode_key" ON "RetailProductQueryItem"("taskId", "productCode");
CREATE INDEX "RetailProductQueryItem_taskId_orderIndex_idx" ON "RetailProductQueryItem"("taskId", "orderIndex");
CREATE INDEX "RetailProductQueryItem_productCode_idx" ON "RetailProductQueryItem"("productCode");

ALTER TABLE "RetailProductQueryTask" ADD CONSTRAINT "RetailProductQueryTask_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "RetailProductQuerySchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RetailProductQueryItem" ADD CONSTRAINT "RetailProductQueryItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RetailProductQueryTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
