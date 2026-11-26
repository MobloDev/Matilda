"use server";

// Server Actions for the Account Plan's "MATILDA change layer"
// (docs/account-plan.md §11). V1 scope: Accept & Link, and Dismiss. A full
// "Reject" of the Insight itself already exists on the Customer Intelligence
// Insights page — re-offering it here would just duplicate that action, not
// add a new one, so it's deliberately left out of this file.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAccountPages() {
  revalidatePath("/");
  revalidatePath("/account-plan");
  revalidatePath("/customer-intelligence");
  revalidatePath("/customer-intelligence/insights");
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
