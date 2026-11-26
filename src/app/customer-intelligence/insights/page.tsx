import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import { CI_TABS, DOMAINS, DOMAIN_LABEL } from "@/lib/customer-intelligence";

const INFORMATION_TYPE_LABEL: Record<string, string> = {
  FACT: "Fact",
  OBSERVATION: "Observation",
  HYPOTHESIS: "Hypothesis",
  AI_INFERENCE: "AI Inference",
};

const STATUS_LABEL: Record<string, string> = {
  NEEDS_VALIDATION: "Needs Validation",
  VALIDATED: "Validated",
  DISPUTED: "Disputed",
  SUPERSEDED: "Superseded",
  REJECTED: "Rejected",
};

// Plain <select>s in a GET <form> — filtering is just a URL search param
// read server-side, so no client-side state is needed for this.
function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-500">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function CustomerIntelligenceInsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const domain = params.domain ?? "";
  const type = params.type ?? "";
  const status = params.status ?? "";
  const importance = params.importance ?? "";
  const origin = params.origin ?? "";

  const account = await prisma.account.findFirst({
    include: {
      insights: {
        where: {
          ...(domain && { domain: domain as never }),
          ...(type && { informationType: type as never }),
          ...(status && { status: status as never }),
          ...(importance && { importance: importance as never }),
          ...(origin && { originType: origin as never }),
        },
        include: { sourceLinks: { include: { source: true } } },
        orderBy: { observedAt: "desc" },
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

  const grouped = DOMAINS.map((d) => ({
    domain: d,
    insights: account.insights.filter((i) => i.domain === d),
  })).filter((group) => group.insights.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={CI_TABS} active="/customer-intelligence/insights" />

      <form className="flex flex-wrap gap-3" method="get">
        <FilterSelect
          name="domain"
          label="Domain"
          value={domain}
          options={DOMAINS.map((d) => ({ value: d, label: DOMAIN_LABEL[d] }))}
        />
        <FilterSelect
          name="type"
          label="Type"
          value={type}
          options={Object.entries(INFORMATION_TYPE_LABEL).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          name="status"
          label="Status"
          value={status}
          options={Object.entries(STATUS_LABEL).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          name="importance"
          label="Importance"
          value={importance}
          options={["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((value) => ({
            value,
            label: value,
          }))}
        />
        <FilterSelect
          name="origin"
          label="Origin"
          value={origin}
          options={[
            { value: "HUMAN", label: "User" },
            { value: "MATILDA_SUGGESTION", label: "Agent" },
          ]}
        />
        <button
          type="submit"
          className="self-end rounded border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
        >
          Apply
        </button>
        <a
          href="/customer-intelligence/insights"
          className="self-end text-sm text-zinc-500 hover:underline"
        >
          Clear
        </a>
      </form>

      {grouped.map((group) => (
        <Section key={group.domain} title={DOMAIN_LABEL[group.domain]}>
          <ul className="flex flex-col gap-3">
            {group.insights.map((insight) => (
              <li
                key={insight.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{INFORMATION_TYPE_LABEL[insight.informationType]}</Badge>
                  <Badge>{STATUS_LABEL[insight.status]}</Badge>
                  <Badge>{insight.importance}</Badge>
                  <Badge>{insight.confidence} confidence</Badge>
                  {insight.originType === "MATILDA_SUGGESTION" && (
                    <Badge>Suggested by MATILDA</Badge>
                  )}
                  <span className="text-xs text-zinc-500">
                    {insight.observedAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 font-medium">{insight.title}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {insight.statement}
                </p>
                {insight.soWhat && (
                  <p className="mt-1 text-xs text-zinc-500">
                    So what for NOVA: {insight.soWhat}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  {insight.sourceLinks.length} source(s):{" "}
                  {insight.sourceLinks.map((link) => link.source.title).join(", ") ||
                    "none"}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ))}
      {grouped.length === 0 && (
        <p className="text-sm text-zinc-500">No Insights match these filters.</p>
      )}
    </div>
  );
}
