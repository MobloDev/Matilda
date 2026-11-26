import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Section } from "@/components/ui";

// Importance/priority enums are stored as plain strings in SQLite, so
// Prisma can't sort them "LOW < MEDIUM < HIGH < CRITICAL" on its own —
// alphabetically "CRITICAL" would sort before "HIGH". This map lets us
// sort in JavaScript after fetching instead.
const importanceRank: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const informationTypeLabel: Record<string, string> = {
  FACT: "Fact",
  OBSERVATION: "Observation",
  HYPOTHESIS: "Hypothesis",
  AI_INFERENCE: "AI Inference",
};

export default async function AccountOverviewPage() {
  // This is a single-Account prototype for now, so we just take the first
  // (and currently only) Account — the Account switcher mentioned in
  // docs/ui-principles.md is out of scope until there is a second Account.
  const account = await prisma.account.findFirst({
    include: {
      insights: { orderBy: { observedAt: "desc" }, take: 5 },
      knowledgeGaps: {
        where: { status: { notIn: ["ANSWERED", "CLOSED_UNANSWERABLE"] } },
      },
      goals: {
        include: {
          initiatives: {
            include: {
              actions: true,
              opportunities: { include: { qualifications: true } },
            },
          },
        },
      },
      reviews: { orderBy: { reviewDate: "desc" }, take: 1 },
    },
  });

  if (!account) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-2 p-16 text-center">
        <p className="text-lg font-medium">No Account found.</p>
        <p className="text-zinc-500">
          Run <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">npm run seed</code>{" "}
          to load the demo scenario.
        </p>
      </main>
    );
  }

  const knowledgeGaps = [...account.knowledgeGaps].sort(
    (a, b) => importanceRank[a.importance] - importanceRank[b.importance],
  );

  const allActions = account.goals.flatMap((goal) =>
    goal.initiatives.flatMap((initiative) => initiative.actions),
  );
  const openActions = allActions.filter(
    (action) => action.status !== "COMPLETED" && action.status !== "CANCELLED",
  );
  const now = new Date();
  const overdueActions = openActions.filter(
    (action) => action.dueDate && action.dueDate < now,
  );

  const opportunities = account.goals.flatMap((goal) =>
    goal.initiatives.flatMap((initiative) => initiative.opportunities),
  );

  const latestReview = account.reviews[0];
  const reviewSummary = latestReview?.generatedSummary
    ? (JSON.parse(latestReview.generatedSummary) as {
        whatChanged?: string;
        decisionRequired?: string;
      })
    : null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-2">
        <span className="inline-block w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-300">
          Synthetic prototype data
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">{account.name}</h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{account.ambition}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge>Account Manager: {account.accountManager}</Badge>
          {account.strategicStatus && <Badge>{account.strategicStatus}</Badge>}
        </div>
        <Link
          href="/account-plan"
          className="mt-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View Account Plan →
        </Link>
      </header>

      {reviewSummary?.decisionRequired && (
        <Section title="Decision required">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="font-medium">{reviewSummary.decisionRequired}</p>
            {reviewSummary.whatChanged && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                What changed: {reviewSummary.whatChanged}
              </p>
            )}
          </div>
        </Section>
      )}

      <Section title="Recent Insights">
        <ul className="flex flex-col gap-3">
          {account.insights.map((insight) => (
            <li
              key={insight.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{informationTypeLabel[insight.informationType]}</Badge>
                <Badge>{insight.status.replace("_", " ")}</Badge>
                <span className="text-xs text-zinc-500">
                  {insight.observedAt.toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 font-medium">{insight.title}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {insight.statement}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Important Knowledge Gaps">
        <ul className="flex flex-col gap-2">
          {knowledgeGaps.map((gap) => (
            <li
              key={gap.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <span>{gap.question}</span>
              <Badge>{gap.importance}</Badge>
            </li>
          ))}
          {knowledgeGaps.length === 0 && (
            <p className="text-sm text-zinc-500">No open Knowledge Gaps.</p>
          )}
        </ul>
      </Section>

      <Section title="Goals &amp; Initiatives">
        <ul className="flex flex-col gap-4">
          {account.goals.map((goal) => (
            <li key={goal.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{goal.title}</p>
                <Badge>{goal.status}</Badge>
              </div>
              <ul className="mt-3 flex flex-col gap-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                {goal.initiatives.map((initiative) => (
                  <li key={initiative.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{initiative.title}</span>
                      <Badge>{initiative.status.replace("_", " ")}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Actions">
        <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>{openActions.length} open</span>
          <span>{overdueActions.length} overdue</span>
        </div>
        <ul className="flex flex-col gap-2">
          {openActions.map((action) => (
            <li
              key={action.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <span>{action.title}</span>
              <div className="flex items-center gap-2">
                {action.dueDate && action.dueDate < now && (
                  <Badge>Overdue</Badge>
                )}
                <Badge>{action.status.replace("_", " ")}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Opportunities">
        <ul className="flex flex-col gap-3">
          {opportunities.map((opportunity) => {
            const confirmed = opportunity.qualifications.filter(
              (q) => q.state === "CONFIRMED",
            ).length;
            const total = opportunity.qualifications.length;
            return (
              <li
                key={opportunity.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{opportunity.title}</p>
                  <Badge>{opportunity.stage}</Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {opportunity.customerNeed}
                </p>
                {total > 0 && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Qualification: {confirmed} of {total} dimensions confirmed
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
    </main>
  );
}
