import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import { CI_TABS, DOMAINS, DOMAIN_LABEL } from "@/lib/customer-intelligence";
import { acceptInsight, editAndAcceptInsight, rejectInsight } from "../actions";

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
    <label className="flex flex-col gap-1 text-xs text-ink/70">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
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
      <p className="text-sm text-ink/70">
        No Account found. Run <code>npm run seed</code> to load the demo
        scenario.
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
          options={Object.entries(INFORMATION_TYPE_LABEL).map(
            ([value, label]) => ({
              value,
              label,
            }),
          )}
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
          className="self-end rounded border border-border px-3 py-1 text-sm "
        >
          Apply
        </button>
        <a
          href="/customer-intelligence/insights"
          className="self-end text-sm text-ink/70 hover:underline"
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
                className="rounded-lg border border-border p-4 "
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    {INFORMATION_TYPE_LABEL[insight.informationType]}
                  </Badge>
                  <Badge>{STATUS_LABEL[insight.status]}</Badge>
                  <Badge>{insight.importance}</Badge>
                  <Badge>{insight.confidence} confidence</Badge>
                  {insight.originType === "MATILDA_SUGGESTION" && (
                    <Badge>Suggested by MATILDA</Badge>
                  )}
                  <span className="text-xs text-ink/70">
                    {insight.observedAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 font-medium">{insight.title}</p>
                <p className="mt-1 text-sm text-ink/80">{insight.statement}</p>
                {insight.soWhat && (
                  <p className="mt-1 text-xs text-ink/70">
                    So what for NOVA: {insight.soWhat}
                  </p>
                )}
                <p className="mt-2 text-xs text-ink/70">
                  {insight.sourceLinks.length} source(s):{" "}
                  {insight.sourceLinks
                    .map((link) => link.source.title)
                    .join(", ") || "none"}
                </p>
                {insight.status === "NEEDS_VALIDATION" && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-3 ">
                    <div className="flex flex-wrap items-center gap-2">
                      <form action={acceptInsight}>
                        <input
                          type="hidden"
                          name="insightId"
                          value={insight.id}
                        />
                        <button
                          type="submit"
                          className="rounded border border-border px-2.5 py-1 text-xs font-medium "
                        >
                          Accept
                        </button>
                      </form>
                      <details className="text-xs">
                        <summary className="cursor-pointer rounded border border-border px-2.5 py-1 font-medium ">
                          Edit &amp; Accept
                        </summary>
                        <form
                          action={editAndAcceptInsight}
                          className="mt-2 flex flex-col gap-2"
                        >
                          <input
                            type="hidden"
                            name="insightId"
                            value={insight.id}
                          />
                          <textarea
                            name="statement"
                            defaultValue={insight.statement}
                            rows={2}
                            className="w-full rounded border border-border bg-transparent p-2 text-xs "
                          />
                          <button
                            type="submit"
                            className="w-fit rounded border border-border px-2.5 py-1 font-medium "
                          >
                            Save &amp; Accept
                          </button>
                        </form>
                      </details>
                      <details className="text-xs">
                        <summary className="cursor-pointer rounded border border-border px-2.5 py-1 font-medium text-red-700 dark:text-red-400">
                          Reject
                        </summary>
                        <form
                          action={rejectInsight}
                          className="mt-2 flex flex-col gap-2"
                        >
                          <input
                            type="hidden"
                            name="insightId"
                            value={insight.id}
                          />
                          <textarea
                            name="reason"
                            placeholder="Why reject this suggestion? (required)"
                            rows={2}
                            className="w-full rounded border border-border bg-transparent p-2 text-xs "
                          />
                          <button
                            type="submit"
                            className="w-fit rounded border border-border px-2.5 py-1 font-medium "
                          >
                            Confirm reject
                          </button>
                        </form>
                      </details>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      ))}
      {grouped.length === 0 && (
        <p className="text-sm text-ink/70">No Insights match these filters.</p>
      )}
    </div>
  );
}
