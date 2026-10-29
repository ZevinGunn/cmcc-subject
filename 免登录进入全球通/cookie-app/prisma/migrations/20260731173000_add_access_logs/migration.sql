CREATE TABLE "AccessLog" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorType" TEXT NOT NULL DEFAULT 'anonymous',
    "actorId" TEXT,
    "actorName" TEXT,
    "feature" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "requestId" TEXT,
    "metaJson" TEXT,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");
CREATE INDEX "AccessLog_actorType_actorId_createdAt_idx" ON "AccessLog"("actorType", "actorId", "createdAt");
CREATE INDEX "AccessLog_feature_createdAt_idx" ON "AccessLog"("feature", "createdAt");
CREATE INDEX "AccessLog_success_createdAt_idx" ON "AccessLog"("success", "createdAt");
