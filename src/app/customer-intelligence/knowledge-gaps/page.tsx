import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import { CI_TABS, DOMAIN_LABEL } from "@/lib/customer-intelligence";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  ANSWERED: "Answered",
  CLOSED_UNANSWERABLE: "Closed (unanswerable)",
};

const IMPORTANCE_RANK: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export default async function CustomerIntelligenceKnowledgeGapsPage() {
  const account = await prisma.account.findFirst({
    include: {
      knowledgeGaps: {
        include: { relatedInsight: true, answeredByInsight: true },
      },
    },
  });

  if (!account) {
    return (
      <p className="text-sm text-zinc-500">
        No Account found. Run <code>npm run seed</code> to load the demo scenario.
      </p>
    );
  }

  const gaps = [...account.knowledgeGaps].sort(
    (a, b) => IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance],
  );

  const highImportanceWithoutOwner = gaps.filter(
    (g) =>
      (g.importance === "HIGH" || g.importance === "CRITICAL") &&
      !g.owner &&
      (g.status === "OPEN" || g.status === "INVESTIGATING"),
  );

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={CI_TABS} active="/customer-intelligence/knowledge-gaps" />

      {highImportanceWithoutOwner.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          {highImportanceWithoutOwner.length} high-importance Knowledge Gap(s) have
          no owner.
        </div>
      )}

      <Section title={`${gaps.length} Knowledge Gaps`}>
        <ul className="flex flex-col gap-3">
          {gaps.map((gap) => (
            <li
              key={gap.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{DOMAIN_LABEL[gap.domain]}</Badge>
                <Badge>{gap.importance}</Badge>
                <Badge>{STATUS_LABEL[gap.status]}</Badge>
                {gap.originType === "MATILDA_SUGGESTION" && !gap.accepted && (
                  <Badge>Suggested by MATILDA — awaiting acceptance</Badge>
                )}
                {!gap.owner &&
                  (gap.importance === "HIGH" || gap.importance === "CRITICAL") && (
                    <Badge>⚠ No owner</Badge>
                  )}
              </div>
              <p className="mt-2 font-medium">{gap.question}</p>
              {gap.whyItMatters && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {gap.whyItMatters}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {gap.owner ? `Owner: ${gap.owner}` : "No owner assigned"}
                {gap.targetDate && ` · Due ${gap.targetDate.toLocaleDateString()}`}
                {gap.relatedInsight && ` · About: ${gap.relatedInsight.title}`}
                {gap.answeredByInsight &&
                  ` · Answered by: ${gap.answeredByInsight.title}`}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
