import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import {
  CI_TABS,
  DOMAINS,
  DOMAIN_LABEL,
  computeDomainStatus,
  countRecentChanges,
} from "@/lib/customer-intelligence";
import { runAgent } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  STRONG: "Strong",
  PARTIAL: "Partial",
  LIMITED: "Limited",
  STALE: "Stale",
};

export default async function CustomerIntelligenceOverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { ranAgent } = await searchParams;
  const account = await prisma.account.findFirst({
    include: {
      insights: {
        include: {
          goalLinks: true,
          initiativeLinks: true,
          opportunityLinks: true,
        },
      },
      knowledgeGaps: true,
      domainOverrides: true,
      briefs: {
        orderBy: { generatedAt: "desc" },
        take: 1,
        include: { insightLinks: { include: { insight: true } } },
      },
    },
  });

  if (!account) {
    return (
      <p className="text-sm text-ink/70">
        No Account found. Run <code>npm run seed</code> to load the demo
        scenario.
      </p>
    );
  }

  const now = new Date();
  const brief = account.briefs[0];

  const domainRows = DOMAINS.map((domain) => {
    const insights = account.insights.filter((i) => i.domain === domain);
    const gaps = account.knowledgeGaps.filter((g) => g.domain === domain);
    const override = account.domainOverrides.find((o) => o.domain === domain);
    const computed = computeDomainStatus(insights, gaps, now);
    const status = override?.statusOverride ?? computed;
    const recentChanges = countRecentChanges(insights, now);
    const openGaps = gaps.filter(
      (g) => g.status === "OPEN" || g.status === "INVESTIGATING",
    ).length;
    const lastUpdated = insights.reduce<Date | null>(
      (latest, i) => (!latest || i.updatedAt > latest ? i.updatedAt : latest),
      null,
    );
    return { domain, status, override, recentChanges, openGaps, lastUpdated };
  });

  const recentImportantInsights = [...account.insights]
    .filter((i) => i.importance === "HIGH" || i.importance === "CRITICAL")
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const reviewQueue = account.insights.filter(
    (i) =>
      i.status === "NEEDS_VALIDATION" && i.originType === "MATILDA_SUGGESTION",
  );

  const topGaps = [...account.knowledgeGaps]
    .filter((g) => g.status === "OPEN" || g.status === "INVESTIGATING")
    .sort((a, b) => {
      const rank: Record<string, number> = {
        CRITICAL: 0,
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
      };
      return rank[a.importance] - rank[b.importance];
    })
    .slice(0, 3);

  const planImpactInsights = account.insights.filter(
    (i) => i.affectsAccountPlan,
  );

  return (
    <div className="flex flex-col gap-8">
      <Tabs tabs={CI_TABS} active="/customer-intelligence" />

      <div className="flex items-center justify-between gap-3">
        {ranAgent ? (
          <p className="text-sm text-ink/80">{ranAgent}</p>
        ) : (
          <span />
        )}
        <form action={runAgent}>
          <button
            type="submit"
            className="rounded border border-border px-3 py-1.5 text-sm font-medium "
          >
            Run agent
          </button>
        </form>
      </div>

      <Section title="Intelligence Brief">
        {brief ? (
          <div className="rounded-lg border border-border p-4 ">
            <div className="mb-2 flex items-center justify-between">
              <Badge>AI Inference</Badge>
              <span className="text-xs text-ink/70">
                Generated {brief.generatedAt.toLocaleDateString()}
              </span>
            </div>
            <p className="text-ink">{brief.text}</p>
            <p className="mt-2 text-xs text-ink/70">
              Based on:{" "}
              {brief.insightLinks.map((link) => link.insight.title).join(", ")}
            </p>
            <button
              disabled
              title="Regenerating the brief is part of a later, interactive phase"
              className="mt-3 rounded border border-border px-2.5 py-1 text-xs text-ink/50 "
            >
              Regenerate (coming soon)
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink/70">No brief generated yet.</p>
        )}
      </Section>

      <Section title="Domain Status">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-ink/70 ">
                <th className="py-2 pr-3">Domain</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Recent change</th>
                <th className="py-2 pr-3">Open gaps</th>
                <th className="py-2">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {domainRows.map((row) => (
                <tr
                  key={row.domain}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="py-2 pr-3 font-medium">
                    {DOMAIN_LABEL[row.domain]}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge>{STATUS_LABEL[row.status]}</Badge>
                    {row.override && (
                      <span
                        className="ml-1 text-xs text-ink/50"
                        title={row.override.statusOverrideReason}
                      >
                        (overridden)
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {row.recentChanges === 0
                      ? "→"
                      : row.recentChanges <= 2
                        ? "↑"
                        : "↑↑"}{" "}
                    {row.recentChanges}
                  </td>
                  <td className="py-2 pr-3">{row.openGaps}</td>
                  <td className="py-2 text-ink/70">
                    {row.lastUpdated
                      ? row.lastUpdated.toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="What Changed">
        <ul className="flex flex-col gap-2">
          {recentImportantInsights.map((insight) => (
            <li
              key={insight.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 "
            >
              <div>
                <p className="font-medium">{insight.title}</p>
                <p className="text-xs text-ink/70">
                  {DOMAIN_LABEL[insight.domain]} ·{" "}
                  {insight.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <Badge>{insight.importance}</Badge>
            </li>
          ))}
          {recentImportantInsights.length === 0 && (
            <p className="text-sm text-ink/70">
              No significant recent changes.
            </p>
          )}
        </ul>
      </Section>

      <Section title="Review Queue">
        <p className="mb-2 text-sm text-ink/70">
          {reviewQueue.length} suggestion(s) awaiting review. Accept, Edit &amp;
          Accept, or Reject them on the{" "}
          <a
            href="/customer-intelligence/insights"
            className="text-brand-ink hover:underline"
          >
            Insights page
          </a>
          .
        </p>
        <ul className="flex flex-col gap-2">
          {reviewQueue.slice(0, 3).map((insight) => (
            <li
              key={insight.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 "
            >
              <div>
                <p className="font-medium">{insight.title}</p>
                {insight.rationale && (
                  <p className="text-xs text-ink/70">
                    Why MATILDA suggests this: {insight.rationale}
                  </p>
                )}
              </div>
              <Badge>Suggested by MATILDA</Badge>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Most Important Knowledge Gaps">
        <ul className="flex flex-col gap-2">
          {topGaps.map((gap) => (
            <li
              key={gap.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 "
            >
              <span>{gap.question}</span>
              <div className="flex gap-2">
                <Badge>{gap.importance}</Badge>
                {gap.owner && <Badge>{gap.owner}</Badge>}
              </div>
            </li>
          ))}
          {topGaps.length === 0 && (
            <p className="text-sm text-ink/70">No open Knowledge Gaps.</p>
          )}
        </ul>
      </Section>

      <Section title="Possible Impact on Account Plan">
        <ul className="flex flex-col gap-2">
          {planImpactInsights.map((insight) => {
            const elements = [
              ...insight.goalLinks.map(() => "Goal"),
              ...insight.initiativeLinks.map(() => "Initiative"),
              ...insight.opportunityLinks.map(() => "Opportunity"),
            ];
            return (
              <li
                key={insight.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 "
              >
                <div>
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-xs text-ink/70">
                    {elements.length > 0
                      ? `Linked to: ${elements.join(", ")}`
                      : "Not yet linked to a plan element"}
                  </p>
                </div>
                <a
                  href="/account-plan"
                  className="text-xs font-medium text-brand-ink hover:underline"
                >
                  Open in Account Plan →
                </a>
              </li>
            );
          })}
          {planImpactInsights.length === 0 && (
            <p className="text-sm text-ink/70">
              No Insight is currently flagged as affecting the Account Plan.
            </p>
          )}
        </ul>
      </Section>
    </div>
  );
}
