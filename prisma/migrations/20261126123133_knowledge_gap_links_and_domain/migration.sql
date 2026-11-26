/*
  Warnings:

  - You are about to drop the column `originType` on the `KnowledgeGap` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "KnowledgeGapGoal" (
    "knowledgeGapId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "goalId"),
    CONSTRAINT "KnowledgeGapGoal_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapGoal_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeGapInitiative" (
    "knowledgeGapId" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "initiativeId"),
    CONSTRAINT "KnowledgeGapInitiative_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapInitiative_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeGapRelationship" (
    "knowledgeGapId" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "relationshipId"),
    CONSTRAINT "KnowledgeGapRelationship_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapRelationship_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeGapOpportunity" (
    "knowledgeGapId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "opportunityId"),
    CONSTRAINT "KnowledgeGapOpportunity_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeGapReview" (
    "knowledgeGapId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "reviewId"),
    CONSTRAINT "KnowledgeGapReview_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "AccountReview" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeGapAction" (
    "knowledgeGapId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,

    PRIMARY KEY ("knowledgeGapId", "actionId"),
    CONSTRAINT "KnowledgeGapAction_knowledgeGapId_fkey" FOREIGN KEY ("knowledgeGapId") REFERENCES "KnowledgeGap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeGapAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KnowledgeGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "whyItMatters" TEXT,
    "importance" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "creationType" TEXT NOT NULL DEFAULT 'HUMAN_MANUAL',
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
INSERT INTO "new_KnowledgeGap" ("accepted", "accountId", "answeredByInsightId", "createdAt", "domain", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "updatedAt", "whyItMatters") SELECT "accepted", "accountId", "answeredByInsightId", "createdAt", "domain", "id", "importance", "owner", "question", "relatedInsightId", "resolution", "resolvedAt", "resolvedBy", "status", "targetDate", "updatedAt", "whyItMatters" FROM "KnowledgeGap";
DROP TABLE "KnowledgeGap";
ALTER TABLE "new_KnowledgeGap" RENAME TO "KnowledgeGap";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
