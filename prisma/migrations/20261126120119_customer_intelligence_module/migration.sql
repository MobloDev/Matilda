/*
  Warnings:

  - You are about to drop the column `topic` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `KnowledgeGap` table. All the data in the column will be lost.
  - You are about to drop the column `classification` on the `Source` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `Source` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Source` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `Source` table. All the data in the column will be lost.
  - Added the required column `domain` to the `Insight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `KnowledgeGap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kind` to the `Source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reliability` to the `Source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Source` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SourceDomain" (
    "sourceId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    PRIMARY KEY ("sourceId", "domain"),
    CONSTRAINT "SourceDomain_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SourceExcerpt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "location" TEXT,
    CONSTRAINT "SourceExcerpt_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "sourcesCreated" INTEGER NOT NULL DEFAULT 0,
    "insightsSuggested" INTEGER NOT NULL DEFAULT 0,
    "gapsSuggested" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "AgentRun_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntelligenceBrief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntelligenceBrief_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntelligenceBriefInsight" (
    "briefId" TEXT NOT NULL,
    "insightId" TEXT NOT NULL,

    PRIMARY KEY ("briefId", "insightId"),
    CONSTRAINT "IntelligenceBriefInsight_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "IntelligenceBrief" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IntelligenceBriefInsight_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccountDomainOverride" (
    "accountId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "statusOverride" TEXT NOT NULL,
    "statusOverrideReason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("accountId", "domain"),
    CONSTRAINT "AccountDomainOverride_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
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
    "relatedInsightId" TEXT,
    "suggestionKind" TEXT,
    "rationale" TEXT,
    "soWhat" TEXT,
    "agentRunId" TEXT,
    "affectsAccountPlan" BOOLEAN NOT NULL DEFAULT false,
    "originType" TEXT NOT NULL DEFAULT 'HUMAN',
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Insight_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insight_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "AgentRun" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("accountId", "aiGenerated", "confidence", "createdAt", "createdBy", "id", "importance", "informationType", "lastReviewedAt", "observedAt", "originType", "rejectedReason", "reviewDueAt", "statement", "status", "supersedesInsightId", "title", "updatedAt", "validatedAt", "validatedBy") SELECT "accountId", "aiGenerated", "confidence", "createdAt", "createdBy", "id", "importance", "informationType", "lastReviewedAt", "observedAt", "originType", "rejectedReason", "reviewDueAt", "statement", "status", "supersedesInsightId", "title", "updatedAt", "validatedAt", "validatedBy" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_InsightSource" (
    "insightId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "excerptId" TEXT,
    "supportType" TEXT NOT NULL,
    "note" TEXT,

    PRIMARY KEY ("insightId", "sourceId", "supportType"),
    CONSTRAINT "InsightSource_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InsightSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InsightSource_excerptId_fkey" FOREIGN KEY ("excerptId") REFERENCES "SourceExcerpt" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InsightSource" ("insightId", "note", "sourceId", "supportType") SELECT "insightId", "note", "sourceId", "supportType" FROM "InsightSource";
DROP TABLE "InsightSource";
ALTER TABLE "new_InsightSource" RENAME TO "InsightSource";
CREATE TABLE "new_KnowledgeGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "whyItMatters" TEXT,
    "importance" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "originType" TEXT NOT NULL DEFAULT 'HUMAN',
    "accepted" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_KnowledgeGap" ("accountId", "answeredByInsightId", "createdAt", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "updatedAt") SELECT "accountId", "answeredByInsightId", "createdAt", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "updatedAt" FROM "KnowledgeGap";
DROP TABLE "KnowledgeGap";
ALTER TABLE "new_KnowledgeGap" RENAME TO "KnowledgeGap";
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "reliability" TEXT NOT NULL,
    "url" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "noteText" TEXT,
    "participants" TEXT,
    "sourceDate" DATETIME,
    "owner" TEXT,
    "originType" TEXT NOT NULL DEFAULT 'HUMAN',
    "monitor" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ANALYSED',
    "summary" TEXT,
    "agentRunId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Source_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Source_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "AgentRun" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("accountId", "createdAt", "id", "owner", "sourceDate", "title") SELECT "accountId", "createdAt", "id", "owner", "sourceDate", "title" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
