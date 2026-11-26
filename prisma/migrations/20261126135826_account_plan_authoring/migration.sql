-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountType" TEXT,
    "segment" TEXT,
    "industry" TEXT,
    "accountManager" TEXT NOT NULL,
    "technicalAccountManager" TEXT,
    "accountTeam" TEXT,
    "ambition" TEXT,
    "timeHorizon" TEXT,
    "planStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "reviewDueAt" DATETIME,
    "strategicStatus" TEXT,
    "lastReviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Account" ("accountManager", "accountTeam", "accountType", "ambition", "createdAt", "id", "industry", "lastReviewedAt", "name", "segment", "strategicStatus", "technicalAccountManager", "updatedAt") SELECT "accountManager", "accountTeam", "accountType", "ambition", "createdAt", "id", "industry", "lastReviewedAt", "name", "segment", "strategicStatus", "technicalAccountManager", "updatedAt" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
