import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import { CI_TABS, DOMAIN_LABEL } from "@/lib/customer-intelligence";
import { addSource } from "../actions";

const KIND_LABEL: Record<string, string> = {
  DOCUMENT: "Document",
  URL: "URL",
  NOTE: "Note",
};

const CATEGORY_LABEL: Record<string, string> = {
  WEBSITE: "Website",
  ANNUAL_REPORT: "Annual report",
  PRESS_RELEASE: "Press release",
  NEWS_ARTICLE: "News article",
  INVESTOR_PRESENTATION: "Investor presentation",
  PARTNER_CASE: "Partner case",
  JOB_POSTING: "Job posting",
  PUBLIC_REPORT: "Public report",
  SHAREPOINT_DOCUMENT: "SharePoint document",
  TEAMS_CONVERSATION: "Teams conversation",
  PROPOSAL: "Proposal",
  PROJECT_REPORT: "Project report",
  ACCOUNT_PLAN: "Account Plan",
  CRM_RECORD: "CRM record",
  MEETING: "Meeting",
  MEETING_TRANSCRIPT: "Meeting transcript",
  EMAIL: "Email",
  WORKSHOP: "Workshop",
  USER_OBSERVATION: "User observation",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  ANALYSING: "Analysing",
  ANALYSED: "Analysed",
  MONITORED: "Monitored",
  FAILED: "Failed",
  ARCHIVED: "Archived",
};

export default async function CustomerIntelligenceSourcesPage() {
  const account = await prisma.account.findFirst({
    include: {
      sources: {
        include: { domainLinks: true, insightLinks: true, excerpts: true },
        orderBy: { sourceDate: "desc" },
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

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={CI_TABS} active="/customer-intelligence/sources" />

      <details className="w-fit">
        <summary className="cursor-pointer rounded border border-border px-3 py-1.5 text-sm font-medium ">
          + Add Source
        </summary>
        <form
          action={addSource}
          className="mt-3 flex max-w-md flex-col gap-3 rounded-lg border border-border p-4 "
        >
          <label className="flex flex-col gap-1 text-xs text-ink/70">
            Title
            <input
              name="title"
              required
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            Kind
            <select
              name="kind"
              defaultValue="NOTE"
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            >
              {Object.entries(KIND_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            Category
            <select
              name="category"
              defaultValue="MEETING"
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            >
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            URL (if kind is URL)
            <input
              name="url"
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            File name (if kind is Document — metadata only, no file is stored)
            <input
              name="fileName"
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            Note text (if kind is Note)
            <textarea
              name="noteText"
              rows={3}
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-ink/70">
            Owner
            <input
              name="owner"
              className="rounded border border-border bg-transparent px-2 py-1 text-sm text-ink-strong"
            />
          </label>

          <p className="text-xs text-ink/70">
            Automatic analysis is not built yet — this just saves the Source.
            MATILDA will not generate suggested Insights from it until that
            capability exists.
          </p>

          <button
            type="submit"
            className="w-fit rounded border border-border px-3 py-1.5 text-sm font-medium "
          >
            Add Source
          </button>
        </form>
      </details>

      <Section title={`${account.sources.length} Sources`}>
        <ul className="flex flex-col gap-3">
          {account.sources.map((source) => (
            <li
              key={source.id}
              className="rounded-lg border border-border p-4 "
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{KIND_LABEL[source.kind]}</Badge>
                <Badge>{CATEGORY_LABEL[source.category]}</Badge>
                <Badge>{STATUS_LABEL[source.status]}</Badge>
                {source.visibility === "INTERNAL" && <Badge>🔒 Internal</Badge>}
                {source.monitor && <Badge>Monitored</Badge>}
                {source.originType === "MATILDA_SUGGESTION" && (
                  <Badge>Found by MATILDA</Badge>
                )}
              </div>
              <p className="mt-2 font-medium">{source.title}</p>
              {source.summary && (
                <p className="mt-1 text-sm text-ink/80">{source.summary}</p>
              )}
              <p className="mt-2 text-xs text-ink/70">
                {[
                  source.sourceDate && source.sourceDate.toLocaleDateString(),
                  source.domainLinks.length > 0
                    ? source.domainLinks
                        .map((d) => DOMAIN_LABEL[d.domain])
                        .join(", ")
                    : null,
                  source.owner && `Owner: ${source.owner}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-1 text-xs text-ink/70">
                {source.insightLinks.length} Insight(s) derived ·{" "}
                {source.excerpts.length} excerpt(s)
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
