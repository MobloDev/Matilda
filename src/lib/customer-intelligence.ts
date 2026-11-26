// Shared helpers for the Customer Intelligence module (docs/customer-intelligence.md).

export const CI_TABS = [
  { href: "/customer-intelligence", label: "Overview" },
  { href: "/customer-intelligence/insights", label: "Insights" },
  { href: "/customer-intelligence/sources", label: "Sources" },
  { href: "/customer-intelligence/knowledge-gaps", label: "Knowledge Gaps" },
];

export const DOMAIN_LABEL = {
  COMPANY_BUSINESS: "Company & Business",
  STRATEGY_PRIORITIES: "Strategy & Priorities",
  ORGANISATION_LEADERSHIP: "Organisation & Leadership",
  TECHNOLOGY_DIGITAL: "Technology & Digital Agenda",
  NEWS_CHANGES: "News & Key Changes",
  NOVA_CUSTOMER: "NOVA & Customer",
} as const;

export type IntelligenceDomainKey = keyof typeof DOMAIN_LABEL;

export const DOMAINS = Object.keys(DOMAIN_LABEL) as IntelligenceDomainKey[];

type DomainInsight = {
  informationType: string;
  status: string;
  validatedAt: Date | null;
  observedAt: Date;
  updatedAt: Date;
};

type DomainGap = {
  importance: string;
  status: string;
};

export type DomainStatusValue = "STRONG" | "PARTIAL" | "LIMITED" | "STALE";

// Prototype heuristic — docs/customer-intelligence.md §4 "Domain status". A
// deterministic calculation, not a model call: see architecture.md "Freshness".
export function computeDomainStatus(
  insights: DomainInsight[],
  gaps: DomainGap[],
  now: Date = new Date(),
): DomainStatusValue {
  if (insights.length === 0) return "LIMITED";

  const validated = insights.filter((i) => i.status === "VALIDATED");
  const hasFact = validated.some((i) => i.informationType === "FACT");
  const openHighGaps = gaps.filter(
    (g) =>
      (g.importance === "HIGH" || g.importance === "CRITICAL") &&
      (g.status === "OPEN" || g.status === "INVESTIGATING"),
  ).length;

  const newestValidated = validated.reduce<Date | null>((latest, insight) => {
    const date = insight.validatedAt ?? insight.observedAt;
    return !latest || date > latest ? date : latest;
  }, null);
  const ageDays = newestValidated
    ? (now.getTime() - newestValidated.getTime()) / 86_400_000
    : Infinity;

  if (newestValidated && ageDays > 180) return "STALE";
  if (validated.length >= 5 && hasFact && openHighGaps === 0 && ageDays < 90) {
    return "STRONG";
  }
  if (validated.length >= 2 || openHighGaps >= 1) return "PARTIAL";
  return "LIMITED";
}

// "Recent change" on the Overview domain table: Insights newly validated or
// otherwise changed in the last 30 days.
export function countRecentChanges(
  insights: { updatedAt: Date }[],
  now: Date = new Date(),
): number {
  const thirtyDaysAgo = now.getTime() - 30 * 86_400_000;
  return insights.filter((i) => i.updatedAt.getTime() >= thirtyDaysAgo).length;
}
