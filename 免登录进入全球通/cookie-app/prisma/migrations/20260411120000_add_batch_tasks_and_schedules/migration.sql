-- CreateTable
CREATE TABLE "BatchTask" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "scheduleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dedupeKey" TEXT,
    "runKey" TEXT,
    "sspid" TEXT,
    "timezone" TEXT,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "currentLabel" TEXT,
    "message" TEXT,
    "paramsJson" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchTaskItem" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountLabel" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchTaskItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "action" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
    "sspid" TEXT,
    "timesJson" TEXT NOT NULL,
    "lastTriggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskScheduleFire" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "fireKey" TEXT NOT NULL,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskScheduleFire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BatchTask_runKey_key" ON "BatchTask"("runKey");

-- CreateIndex
CREATE INDEX "BatchTask_scopeType_scopeId_status_idx" ON "BatchTask"("scopeType", "scopeId", "status");

-- CreateIndex
CREATE INDEX "BatchTask_dedupeKey_status_idx" ON "BatchTask"("dedupeKey", "status");

-- CreateIndex
CREATE INDEX "BatchTask_createdAt_idx" ON "BatchTask"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BatchTaskItem_taskId_accountId_key" ON "BatchTaskItem"("taskId", "accountId");

-- CreateIndex
CREATE INDEX "BatchTaskItem_taskId_orderIndex_idx" ON "BatchTaskItem"("taskId", "orderIndex");

-- CreateIndex
CREATE INDEX "BatchTaskItem_accountId_idx" ON "BatchTaskItem"("accountId");

-- CreateIndex
CREATE INDEX "TaskSchedule_enabled_scopeType_scopeId_idx" ON "TaskSchedule"("enabled", "scopeType", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskScheduleFire_fireKey_key" ON "TaskScheduleFire"("fireKey");

-- CreateIndex
CREATE INDEX "TaskScheduleFire_scheduleId_createdAt_idx" ON "TaskScheduleFire"("scheduleId", "createdAt");

-- AddForeignKey
ALTER TABLE "BatchTask" ADD CONSTRAINT "BatchTask_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TaskSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTaskItem" ADD CONSTRAINT "BatchTaskItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "BatchTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTaskItem" ADD CONSTRAINT "BatchTaskItem_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskScheduleFire" ADD CONSTRAINT "TaskScheduleFire_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "TaskSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
