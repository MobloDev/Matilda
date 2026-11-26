import { prisma } from "@/lib/prisma";
import { Badge, Section, Tabs } from "@/components/ui";
import { CI_TABS, DOMAIN_LABEL } from "@/lib/customer-intelligence";

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
      <p className="text-sm text-zinc-500">
        No Account found. Run <code>npm run seed</code> to load the demo scenario.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={CI_TABS} active="/customer-intelligence/sources" />

      <button
        disabled
        title="Adding a Source is part of a later, interactive phase"
        className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-400 dark:border-zinc-700"
      >
        + Add Source (coming soon)
      </button>

      <Section title={`${account.sources.length} Sources`}>
        <ul className="flex flex-col gap-3">
          {account.sources.map((source) => (
            <li
              key={source.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
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
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {source.summary}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {source.sourceDate && source.sourceDate.toLocaleDateString()} ·{" "}
                {source.domainLinks.map((d) => DOMAIN_LABEL[d.domain]).join(", ")}
                {source.owner && ` · Owner: ${source.owner}`}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
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
