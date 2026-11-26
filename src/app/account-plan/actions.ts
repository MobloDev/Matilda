"use server";

// Server Actions for the Account Plan's "MATILDA change layer"
// (docs/account-plan.md §11). V1 scope: Accept & Link, Edit suggestion,
// Request more evidence, and Dismiss. A full "Reject" of the Insight itself
// already exists on the Customer Intelligence Insights page — re-offering it
// here would just duplicate that action, not add a new one, so it's
// deliberately left out of this file. "Defer to Account Review" remains
// unbuilt — there is no notion yet of queuing an item for a specific future
// Review.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAccountPages() {
  revalidatePath("/");
  revalidatePath("/account-plan");
  revalidatePath("/customer-intelligence");
  revalidatePath("/customer-intelligence/insights");
  revalidatePath("/customer-intelligence/knowledge-gaps");
}

// Accepts a plan-impacting Insight by linking it to the Goal or Initiative
// it affects, then clearing the flag — the link itself (GoalInsight /
// InitiativeInsight) is the durable record of "this was accepted", so no
// separate "accepted" field is needed.
export async function linkInsightToPlan(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const target = String(formData.get("target") ?? ""); // "GOAL:<id>" or "INITIATIVE:<id>"
  const [targetType, targetId] = target.split(":");
  if (!insightId || !targetType || !targetId) return;

  if (targetType === "GOAL") {
    await prisma.goalInsight.create({
      data: { goalId: targetId, insightId },
    });
  } else if (targetType === "INITIATIVE") {
    await prisma.initiativeInsight.create({
      data: { initiativeId: targetId, insightId },
    });
  } else {
    return;
  }

  await prisma.insight.update({
    where: { id: insightId },
    data: { affectsAccountPlan: false },
  });

  revalidateAccountPages();
}

// Acknowledges a plan-impacting Insight without linking it to any element —
// "I've seen this, it doesn't need a plan change." The Insight itself is
// untouched; only the flag that it's awaiting a plan decision is cleared.
export async function dismissPlanImpact(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  if (!insightId) return;

  await prisma.insight.update({
    where: { id: insightId },
    data: { affectsAccountPlan: false },
  });

  revalidateAccountPages();
}

// Edits the proposed change itself before a decision is made — refines the
// statement and/or "so what for NOVA" text. Deliberately does NOT accept,
// link, or dismiss: editing and deciding are two different responses in
// account-plan.md §11, so this only ever updates the text.
export async function editSuggestion(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const statement = String(formData.get("statement") ?? "").trim();
  const soWhat = String(formData.get("soWhat") ?? "").trim();
  if (!insightId || !statement) return;

  await prisma.insight.update({
    where: { id: insightId },
    data: { statement, soWhat: soWhat || null },
  });

  revalidateAccountPages();
}

// "Request more evidence": the KAM doesn't yet have enough to Accept or
// Dismiss. Creates a Knowledge Gap tracking what's missing, linked back to
// the Insight — the Insight stays in the change queue (affectsAccountPlan is
// untouched) until the Gap is answered and a real decision can be made.
export async function requestMoreEvidence(formData: FormData) {
  const insightId = String(formData.get("insightId"));
  const question = String(formData.get("question") ?? "").trim();
  if (!insightId || !question) return;

  const insight = await prisma.insight.findUnique({ where: { id: insightId } });
  if (!insight) return;

  await prisma.knowledgeGap.create({
    data: {
      accountId: insight.accountId,
      question,
      domain: insight.domain,
      importance: insight.importance,
      whyItMatters:
        "Requested from the Account Plan's MATILDA Changes queue before deciding on a related proposed change.",
      creationType: "HUMAN_CONTEXTUAL",
      relatedInsightId: insight.id,
    },
  });

  revalidateAccountPages();
}
