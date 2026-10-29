-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "label" TEXT,
    "displayPhone" TEXT,
    "cookieEnc" TEXT,
    "cookieUpdatedAt" TIMESTAMP(3),
    "cookieInvalidAt" TIMESTAMP(3),
    "cookieInvalidReason" TEXT,
    "requestHeadersEnc" TEXT,
    "newHomeUrlEnc" TEXT,
    "qqtAccessTokenEnc" TEXT,
    "qqtInfoEnc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicLink" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicLinkAccount" (
    "linkId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicLinkAccount_pkey" PRIMARY KEY ("linkId","accountId")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL DEFAULT 'info',
    "action" TEXT NOT NULL,
    "requestId" TEXT,
    "accountId" TEXT,
    "linkId" TEXT,
    "message" TEXT,
    "metaEnc" TEXT,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_updatedAt_idx" ON "Account"("updatedAt");

-- CreateIndex
CREATE INDEX "PublicLinkAccount_accountId_idx" ON "PublicLinkAccount"("accountId");

-- CreateIndex
CREATE INDEX "LogEntry_createdAt_idx" ON "LogEntry"("createdAt");

-- CreateIndex
CREATE INDEX "LogEntry_action_idx" ON "LogEntry"("action");

-- CreateIndex
CREATE INDEX "LogEntry_accountId_idx" ON "LogEntry"("accountId");

-- CreateIndex
CREATE INDEX "LogEntry_linkId_idx" ON "LogEntry"("linkId");

-- AddForeignKey
ALTER TABLE "PublicLinkAccount" ADD CONSTRAINT "PublicLinkAccount_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "PublicLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicLinkAccount" ADD CONSTRAINT "PublicLinkAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
