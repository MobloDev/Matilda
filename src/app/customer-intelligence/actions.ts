"use server";

// Server Actions for Customer Intelligence Phase 2 interactivity. Each
// action is a plain form submission handled on the server — no client-side
// state management needed (docs/architecture.md "Readable over abstract").

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function revalidateAccountPages() {
  revalidatePath("/");
  revalidatePath("/account-plan");
  revalidatePath("/customer-intelligence");
  revalidatePath("/customer-intelligence/insights");
  revalidatePath("/customer-intelligence/sources");
  revalidatePath("/customer-intelligence/knowledge-gaps");
}

// --- Run agent (mocked) ---
//
// A real agent would crawl and reason over live sources. This prototype
// mocks that with a short, fixed list of "fixtures" — each one is consumed
// at most once per Account, in order, so repeated clicks don't fabricate
// endless new signals. Once all fixtures are used, the run honestly
// reports that nothing new was found, rather than inventing more.
const AGENT_RUN_FIXTURES = [
  {
    key: "Nordic Horizon Group evaluating additional Nordic data partners",
    source: {
      title: "Nordic Horizon Group evaluating additional Nordic data partners",
      kind: "URL" as const,
      category: "NEWS_ARTICLE" as const,
      visibility: "PUBLIC" as const,
      reliability: "MEDIUM" as const,
      url: "https://example.com/news/nordic-horizon-partner-evaluation",
      sourceDate: new Date(),
      summary:
        "A trade press article reports Nordic Horizon Group is evaluating additional Nordic data-platform partners alongside its existing providers.",
      domains: ["PARTNERS_COMPETITION"] as const,
    },
    insight: {
      title: "Customer may be evaluating additional data platform partners",
      statement:
        "A trade press article suggests Nordic Horizon Group is considering additional Nordic partners for the data platform initiative, alongside existing providers.",
      domain: "PARTNERS_COMPETITION" as const,
      informationType: "OBSERVATION" as const,
      importance: "MEDIUM" as const,
      confidence: "LOW" as const,
      rationale:
        "Trade press coverage naming the customer alongside a partner evaluation process for the same initiative MATILDA is already tracking.",
      soWhat:
        "NOVA's position may need to account for additional competing or complementary partners, not just the incumbent.",
    },
    gap: {
      question:
        "Which capabilities would an additional data platform partner offer that NOVA does not?",
      domain: "PARTNERS_COMPETITION" as const,
      importance: "MEDIUM" as const,
      whyItMatters:
        "Determines whether NOVA's current proposition has a material gap versus alternatives being evaluated.",
    },
  },
  {
    key: "Nordic Horizon Group publishes Q1 technology investment update",
    source: {
      title: "Nordic Horizon Group publishes Q1 technology investment update",
      kind: "URL" as const,
      category: "PRESS_RELEASE" as const,
      visibility: "PUBLIC" as const,
      reliability: "HIGH" as const,
      url: "https://example.com/press/nordic-horizon-q1-technology-update",
      sourceDate: new Date(),
      summary:
        "Nordic Horizon Group's Q1 update names data and platform investment as a named priority area for the coming year.",
      domains: ["STRATEGY_PRIORITIES", "TECHNOLOGY_DIGITAL"] as const,
    },
    insight: {
      title: "Data and platform investment named a Q1 technology priority",
      statement:
        "Nordic Horizon Group's Q1 technology investment update names data and platform investment as a priority area for the coming year.",
      domain: "STRATEGY_PRIORITIES" as const,
      informationType: "FACT" as const,
      importance: "HIGH" as const,
      confidence: "HIGH" as const,
      rationale:
        "Directly stated in a published, high-reliability company update.",
      soWhat:
        "Strengthens the case that the data platform Initiative is strategically timed, not speculative.",
    },
    gap: null,
  },
] as const;

export async function runAgent() {
  const account = await prisma.account.findFirst();
  if (!account) return;

  const existingTitles = new Set(
    (await prisma.source.findMany({ where: { accountId: account.id }, select: { title: true } })).map(
      (s) => s.title,
    ),
  );

  const fixture = AGENT_RUN_FIXTURES.find((f) => !existingTitles.has(f.key));

  const agentRun = await prisma.agentRun.create({
    data: {
      accountId: account.id,
      job: "MONITOR",
      status: "COMPLETED",
      finishedAt: new Date(),
      sourcesCreated: fixture ? 1 : 0,
      insightsSuggested: fixture ? 1 : 0,
      gapsSuggested: fixture?.gap ? 1 : 0,
    },
  });

  let message = "No new signals found.";

  if (fixture) {
    const source = await prisma.source.create({
      data: {
        accountId: account.id,
        title: fixture.source.title,
        kind: fixture.source.kind,
        category: fixture.source.category,
        visibility: fixture.source.visibility,
        reliability: fixture.source.reliability,
        url: fixture.source.url,
        sourceDate: fixture.source.sourceDate,
        summary: fixture.source.summary,
        originType: "MATILDA_SUGGESTION",
        monitor: true,
        lastCheckedAt: new Date(),
        status: "ANALYSED",
        agentRunId: agentRun.id,
      },
    });

    await prisma.sourceDomain.createMany({
      data: fixture.source.domains.map((domain) => ({ sourceId: source.id, domain })),
    });

    const insight = await prisma.insight.create({
      data: {
        accountId: account.id,
        title: fixture.insight.title,
        statement: fixture.insight.statement,
        domain: fixture.insight.domain,
        informationType: fixture.insight.informationType,
        status: "NEEDS_VALIDATION",
        importance: fixture.insight.importance,
        confidence: fixture.insight.confidence,
        observedAt: new Date(),
        originType: "MATILDA_SUGGESTION",
        aiGenerated: true,
        suggestionKind: "NEW",
        rationale: fixture.insight.rationale,
        soWhat: fixture.insight.soWhat,
        createdBy: "agent",
        agentRunId: agentRun.id,
      },
    });

    await prisma.insightSource.create({
      data: { insightId: insight.id, sourceId: source.id, supportType: "SUPPORTS" },
    });

    if (fixture.gap) {
      await prisma.knowledgeGap.create({
        data: {
          accountId: account.id,
          question: fixture.gap.question,
          domain: fixture.gap.domain,
          importance: fixture.gap.importance,
          whyItMatters: fixture.gap.whyItMatters,
          creationType: "MATILDA_SUGGESTED",
          accepted: false,
          relatedInsightId: insight.id,
        },
      });
    }

    message = `Found 1 new Source and 1 suggested Insight${fixture.gap ? " and 1 suggested Knowledge Gap" : ""}.`;
  }

  revalidateAccountPages();
  redirect(`/customer-intelligence?ranAgent=${encodeURIComponent(message)}`);
}

// --- Insight review (Accept / Edit & Accept / Reject) ---

export async function acceptInsight(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const account = await prisma.account.findFirst();
  if (!account) return;

  await prisma.insight.update({
    where: { id: insightId },
    data: {
      status: "VALIDATED",
      validatedAt: new Date(),
      validatedBy: account.accountManager,
    },
  });

  revalidateAccountPages();
}

export async function editAndAcceptInsight(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const statement = String(formData.get("statement") ?? "").trim();
  if (!statement) return;
  const account = await prisma.account.findFirst();
  if (!account) return;

  await prisma.insight.update({
    where: { id: insightId },
    data: {
      statement,
      status: "VALIDATED",
      validatedAt: new Date(),
      validatedBy: account.accountManager,
    },
  });

  revalidateAccountPages();
}

export async function rejectInsight(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return; // data-model.md: rejected requires a reason.

  await prisma.insight.update({
    where: { id: insightId },
    data: { status: "REJECTED", rejectedReason: reason },
  });

  revalidateAccountPages();
}

// --- Add Source ---
//
// Creates the Source record as-is. Deliberately does NOT simulate
// automatic analysis or fabricate suggested Insights from it — that
// capability is not built yet, and claiming otherwise would misrepresent
// what MATILDA actually did (docs/architecture.md "Honest capability").
// Internal NOVA and direct-contact categories (docs/data-model.md "source_category")
// default to internal visibility; external categories default to public.
const INTERNAL_CATEGORIES = new Set([
  "SHAREPOINT_DOCUMENT",
  "TEAMS_CONVERSATION",
  "PROPOSAL",
  "PROJECT_REPORT",
  "ACCOUNT_PLAN",
  "CRM_RECORD",
  "MEETING",
  "MEETING_TRANSCRIPT",
  "EMAIL",
  "WORKSHOP",
  "USER_OBSERVATION",
]);

export async function addSource(formData: FormData) {
  const account = await prisma.account.findFirst();
  if (!account) return;

  const kind = String(formData.get("kind"));
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category"));
  if (!title || !kind || !category) return;

  await prisma.source.create({
    data: {
      accountId: account.id,
      title,
      kind: kind as never,
      category: category as never,
      visibility: INTERNAL_CATEGORIES.has(category) ? "INTERNAL" : "PUBLIC",
      reliability: "MEDIUM",
      url: kind === "URL" ? String(formData.get("url") ?? "") || null : null,
      fileName: kind === "DOCUMENT" ? String(formData.get("fileName") ?? "") || null : null,
      noteText: kind === "NOTE" ? String(formData.get("noteText") ?? "") || null : null,
      owner: String(formData.get("owner") ?? "") || null,
      sourceDate: new Date(),
      status: "PENDING",
      originType: "HUMAN",
    },
  });

  revalidatePath("/customer-intelligence/sources");
}
