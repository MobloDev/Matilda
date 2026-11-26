-- CreateTable
CREATE TABLE "InsightReview" (
    "insightId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    PRIMARY KEY ("insightId", "reviewId"),
    CONSTRAINT "InsightReview_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InsightReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "AccountReview" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
