CREATE TABLE "DailyTaskState" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "taskDate" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "source" TEXT NOT NULL DEFAULT 'manual',
  "message" TEXT,
  "resultJson" TEXT,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DailyTaskState_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DailyTaskState_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "DailyTaskState_accountId_taskDate_taskType_key" ON "DailyTaskState"("accountId", "taskDate", "taskType");
CREATE INDEX "DailyTaskState_accountId_taskDate_idx" ON "DailyTaskState"("accountId", "taskDate");
CREATE INDEX "DailyTaskState_taskDate_taskType_status_idx" ON "DailyTaskState"("taskDate", "taskType", "status");
