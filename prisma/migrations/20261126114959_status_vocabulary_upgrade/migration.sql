-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "informationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEEDS_VALIDATION',
    "importance" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "observedAt" DATETIME NOT NULL,
    "validatedAt" DATETIME,
    "validatedBy" TEXT,
    "rejectedReason" TEXT,
    "lastReviewedAt" DATETIME,
    "reviewDueAt" DATETIME,
    "supersedesInsightId" TEXT,
    "originType" TEXT NOT NULL DEFAULT 'HUMAN',
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Insight_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("accountId", "aiGenerated", "confidence", "createdAt", "createdBy", "id", "importance", "informationType", "lastReviewedAt", "observedAt", "originType", "reviewDueAt", "statement", "status", "supersedesInsightId", "title", "topic", "updatedAt", "validatedAt", "validatedBy") SELECT "accountId", "aiGenerated", "confidence", "createdAt", "createdBy", "id", "importance", "informationType", "lastReviewedAt", "observedAt", "originType", "reviewDueAt", "statement", "status", "supersedesInsightId", "title", "topic", "updatedAt", "validatedAt", "validatedBy" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_KnowledgeGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "owner" TEXT,
    "targetDate" DATETIME,
    "resolution" TEXT,
    "resolvedAt" DATETIME,
    "resolvedBy" TEXT,
    "relatedInsightId" TEXT,
    "answeredByInsightId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KnowledgeGap_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGap_relatedInsightId_fkey" FOREIGN KEY ("relatedInsightId") REFERENCES "Insight" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGap_answeredByInsightId_fkey" FOREIGN KEY ("answeredByInsightId") REFERENCES "Insight" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_KnowledgeGap" ("accountId", "createdAt", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "topic", "updatedAt") SELECT "accountId", "createdAt", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "topic", "updatedAt" FROM "KnowledgeGap";
DROP TABLE "KnowledgeGap";
ALTER TABLE "new_KnowledgeGap" RENAME TO "KnowledgeGap";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
