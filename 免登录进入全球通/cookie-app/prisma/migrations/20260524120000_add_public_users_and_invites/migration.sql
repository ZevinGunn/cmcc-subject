ALTER TABLE "Account"
ADD COLUMN IF NOT EXISTS "userId" TEXT;

ALTER TABLE "PublicLink"
ADD COLUMN IF NOT EXISTS "usedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "usedByUserId" TEXT;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT,
  "disabledAt" TIMESTAMP(3),
  "disabledReason" TEXT,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserSession" (
  "token" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sourceLinkId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "lastSeenAt" TIMESTAMP(3),
  CONSTRAINT "UserSession_pkey" PRIMARY KEY ("token")
);

CREATE TABLE IF NOT EXISTS "AuthPolicy" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "usernameAllowlistJson" TEXT NOT NULL DEFAULT '[]',
  "usernameBlocklistJson" TEXT NOT NULL DEFAULT '[]',
  "defaultResetPassword" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuthPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'super_admin',
  "disabledAt" TIMESTAMP(3),
  "disabledReason" TEXT,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE INDEX IF NOT EXISTS "User_disabledAt_idx" ON "User"("disabledAt");
CREATE INDEX IF NOT EXISTS "UserSession_userId_idx" ON "UserSession"("userId");
CREATE INDEX IF NOT EXISTS "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");
CREATE INDEX IF NOT EXISTS "UserSession_revokedAt_idx" ON "UserSession"("revokedAt");
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "PublicLink_usedByUserId_idx" ON "PublicLink"("usedByUserId");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username");
CREATE INDEX IF NOT EXISTS "AdminUser_disabledAt_idx" ON "AdminUser"("disabledAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Account_userId_fkey'
  ) THEN
    ALTER TABLE "Account"
    ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'PublicLink_usedByUserId_fkey'
  ) THEN
    ALTER TABLE "PublicLink"
    ADD CONSTRAINT "PublicLink_usedByUserId_fkey"
    FOREIGN KEY ("usedByUserId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserSession_userId_fkey'
  ) THEN
    ALTER TABLE "UserSession"
    ADD CONSTRAINT "UserSession_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "AuthPolicy" ("id", "usernameAllowlistJson", "usernameBlocklistJson", "defaultResetPassword", "updatedAt")
VALUES ('default', '[]', '[]', '', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
