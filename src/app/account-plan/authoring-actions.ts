"use server";

// Server Actions for directly authoring Account Plan content (Fase A —
// see the brainstorm at ~/brainstorms/2026-11-26-matilda-account-plan-authoring.md).
// Every form here is deliberately flat: its own fields only, no cross-entity
// linking UI, no delete — status fields are the only way to retire something.
// This is distinct from actions.ts, which is the "MATILDA change layer" for
// Insights flagged as affecting the plan, not direct authoring.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAccountPlan() {
  revalidatePath("/");
  revalidatePath("/account-plan");
}

function dateOrNull(value: FormDataEntryValue | null): Date | null {
  const str = String(value ?? "").trim();
  return str ? new Date(str) : null;
}

function textOrNull(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str || null;
}

// --- Account / Ambition & Plan status ---

export async function updatePlanOverview(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  if (!accountId) return;

  await prisma.account.update({
    where: { id: accountId },
    data: {
      ambition: textOrNull(formData.get("ambition")),
      timeHorizon: textOrNull(formData.get("timeHorizon")),
      planStatus: String(formData.get("planStatus")) as never,
      reviewDueAt: dateOrNull(formData.get("reviewDueAt")),
    },
  });

  revalidateAccountPlan();
}

// --- Goals ---

export async function createGoal(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const title = textOrNull(formData.get("title"));
  const rationale = textOrNull(formData.get("rationale"));
  const owner = textOrNull(formData.get("owner"));
  const successCriteria = textOrNull(formData.get("successCriteria"));
  if (!accountId || !title || !rationale || !owner || !successCriteria) return;

  await prisma.goal.create({
    data: {
      accountId,
      title,
      description: textOrNull(formData.get("description")),
      rationale,
      owner,
      priority: String(formData.get("priority")) as never,
      horizon: textOrNull(formData.get("horizon")),
      successCriteria,
      baseline: textOrNull(formData.get("baseline")),
      target: textOrNull(formData.get("target")),
      status: String(formData.get("status")) as never,
    },
  });

  revalidateAccountPlan();
}

export async function updateGoal(formData: FormData) {
  const goalId = String(formData.get("goalId"));
  const title = textOrNull(formData.get("title"));
  const rationale = textOrNull(formData.get("rationale"));
  const owner = textOrNull(formData.get("owner"));
  const successCriteria = textOrNull(formData.get("successCriteria"));
  if (!goalId || !title || !rationale || !owner || !successCriteria) return;

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      title,
      description: textOrNull(formData.get("description")),
      rationale,
      owner,
      priority: String(formData.get("priority")) as never,
      horizon: textOrNull(formData.get("horizon")),
      successCriteria,
      baseline: textOrNull(formData.get("baseline")),
      target: textOrNull(formData.get("target")),
      status: String(formData.get("status")) as never,
      progressAssessment: textOrNull(formData.get("progressAssessment")),
    },
  });

  revalidateAccountPlan();
}

// --- Initiatives ---

export async function createInitiative(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const goalId = String(formData.get("goalId"));
  const title = textOrNull(formData.get("title"));
  const description = textOrNull(formData.get("description"));
  const rationale = textOrNull(formData.get("rationale"));
  const owner = textOrNull(formData.get("owner"));
  if (!accountId || !goalId || !title || !description || !rationale || !owner) return;

  await prisma.initiative.create({
    data: {
      accountId,
      goalId,
      title,
      description,
      rationale,
      owner,
      priority: String(formData.get("priority")) as never,
      status: String(formData.get("status")) as never,
      startDate: dateOrNull(formData.get("startDate")),
      targetDate: dateOrNull(formData.get("targetDate")),
      nextMilestone: textOrNull(formData.get("nextMilestone")),
    },
  });

  revalidateAccountPlan();
}

export async function updateInitiative(formData: FormData) {
  const initiativeId = String(formData.get("initiativeId"));
  const title = textOrNull(formData.get("title"));
  const description = textOrNull(formData.get("description"));
  const rationale = textOrNull(formData.get("rationale"));
  const owner = textOrNull(formData.get("owner"));
  if (!initiativeId || !title || !description || !rationale || !owner) return;

  await prisma.initiative.update({
    where: { id: initiativeId },
    data: {
      title,
      description,
      rationale,
      owner,
      priority: String(formData.get("priority")) as never,
      status: String(formData.get("status")) as never,
      startDate: dateOrNull(formData.get("startDate")),
      targetDate: dateOrNull(formData.get("targetDate")),
      nextMilestone: textOrNull(formData.get("nextMilestone")),
    },
  });

  revalidateAccountPlan();
}

// --- Relationships ---

export async function createRelationship(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const contactName = textOrNull(formData.get("contactName"));
  const novaRelationshipOwner = textOrNull(formData.get("novaRelationshipOwner"));
  if (!accountId || !contactName || !novaRelationshipOwner) return;

  await prisma.relationship.create({
    data: {
      accountId,
      contactName,
      organisationOrUnit: textOrNull(formData.get("organisationOrUnit")),
      role: textOrNull(formData.get("role")),
      decisionRole: textOrNull(formData.get("decisionRole")),
      strategicRelevance: String(formData.get("strategicRelevance")) as never,
      novaRelationshipOwner,
      strength: String(formData.get("strength")) as never,
      desiredPosition: textOrNull(formData.get("desiredPosition")),
      plannedApproach: textOrNull(formData.get("plannedApproach")),
      lastInteractionAt: dateOrNull(formData.get("lastInteractionAt")),
      notes: textOrNull(formData.get("notes")),
    },
  });

  revalidateAccountPlan();
}

export async function updateRelationship(formData: FormData) {
  const relationshipId = String(formData.get("relationshipId"));
  const contactName = textOrNull(formData.get("contactName"));
  const novaRelationshipOwner = textOrNull(formData.get("novaRelationshipOwner"));
  if (!relationshipId || !contactName || !novaRelationshipOwner) return;

  await prisma.relationship.update({
    where: { id: relationshipId },
    data: {
      contactName,
      organisationOrUnit: textOrNull(formData.get("organisationOrUnit")),
      role: textOrNull(formData.get("role")),
      decisionRole: textOrNull(formData.get("decisionRole")),
      strategicRelevance: String(formData.get("strategicRelevance")) as never,
      novaRelationshipOwner,
      strength: String(formData.get("strength")) as never,
      desiredPosition: textOrNull(formData.get("desiredPosition")),
      plannedApproach: textOrNull(formData.get("plannedApproach")),
      lastInteractionAt: dateOrNull(formData.get("lastInteractionAt")),
      notes: textOrNull(formData.get("notes")),
    },
  });

  revalidateAccountPlan();
}

// --- Growth Areas ---

export async function createGrowthArea(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const name = textOrNull(formData.get("name"));
  if (!accountId || !name) return;

  await prisma.growthArea.create({
    data: {
      accountId,
      name,
      novaToday: String(formData.get("novaToday")) as never,
      customerPriority: String(formData.get("customerPriority")) as never,
      potential: String(formData.get("potential")) as never,
      timing: textOrNull(formData.get("timing")),
      posture: String(formData.get("posture")) as never,
      recommendedApproach: textOrNull(formData.get("recommendedApproach")),
    },
  });

  revalidateAccountPlan();
}

export async function updateGrowthArea(formData: FormData) {
  const growthAreaId = String(formData.get("growthAreaId"));
  const name = textOrNull(formData.get("name"));
  if (!growthAreaId || !name) return;

  await prisma.growthArea.update({
    where: { id: growthAreaId },
    data: {
      name,
      novaToday: String(formData.get("novaToday")) as never,
      customerPriority: String(formData.get("customerPriority")) as never,
      potential: String(formData.get("potential")) as never,
      timing: textOrNull(formData.get("timing")),
      posture: String(formData.get("posture")) as never,
      recommendedApproach: textOrNull(formData.get("recommendedApproach")),
    },
  });

  revalidateAccountPlan();
}

// --- Assumptions ---

export async function createAssumption(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const statement = textOrNull(formData.get("statement"));
  if (!accountId || !statement) return;

  await prisma.assumption.create({
    data: {
      accountId,
      statement,
      confidence: String(formData.get("confidence")) as never,
      status: String(formData.get("status")) as never,
      validationOwner: textOrNull(formData.get("validationOwner")),
      validationDate: dateOrNull(formData.get("validationDate")),
    },
  });

  revalidateAccountPlan();
}

export async function updateAssumption(formData: FormData) {
  const assumptionId = String(formData.get("assumptionId"));
  const statement = textOrNull(formData.get("statement"));
  if (!assumptionId || !statement) return;

  await prisma.assumption.update({
    where: { id: assumptionId },
    data: {
      statement,
      confidence: String(formData.get("confidence")) as never,
      status: String(formData.get("status")) as never,
      validationOwner: textOrNull(formData.get("validationOwner")),
      validationDate: dateOrNull(formData.get("validationDate")),
    },
  });

  revalidateAccountPlan();
}

// --- Risks ---

export async function createRisk(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const description = textOrNull(formData.get("description"));
  const owner = textOrNull(formData.get("owner"));
  if (!accountId || !description || !owner) return;

  await prisma.risk.create({
    data: {
      accountId,
      description,
      likelihood: String(formData.get("likelihood")) as never,
      impact: String(formData.get("impact")) as never,
      mitigation: textOrNull(formData.get("mitigation")),
      owner,
      reviewDate: dateOrNull(formData.get("reviewDate")),
    },
  });

  revalidateAccountPlan();
}

export async function updateRisk(formData: FormData) {
  const riskId = String(formData.get("riskId"));
  const description = textOrNull(formData.get("description"));
  const owner = textOrNull(formData.get("owner"));
  if (!riskId || !description || !owner) return;

  await prisma.risk.update({
    where: { id: riskId },
    data: {
      description,
      likelihood: String(formData.get("likelihood")) as never,
      impact: String(formData.get("impact")) as never,
      mitigation: textOrNull(formData.get("mitigation")),
      owner,
      reviewDate: dateOrNull(formData.get("reviewDate")),
    },
  });

  revalidateAccountPlan();
}

// --- Actions (Execution Plan) — account-level, not linked to an Initiative ---

export async function createAction(formData: FormData) {
  const accountId = String(formData.get("accountId"));
  const title = textOrNull(formData.get("title"));
  const owner = textOrNull(formData.get("owner"));
  if (!accountId || !title || !owner) return;

  await prisma.action.create({
    data: {
      accountId,
      title,
      owner,
      dueDate: dateOrNull(formData.get("dueDate")),
      priority: String(formData.get("priority")) as never,
      status: "PLANNED",
      originType: "HUMAN",
    },
  });

  revalidateAccountPlan();
}

export async function updateAction(formData: FormData) {
  const actionId = String(formData.get("actionId"));
  const title = textOrNull(formData.get("title"));
  const owner = textOrNull(formData.get("owner"));
  const status = String(formData.get("status"));
  if (!actionId || !title || !owner) return;

  const outcome = textOrNull(formData.get("outcome"));
  // Completed requires an outcome (data-model.md "Action" §Rules).
  if (status === "COMPLETED" && !outcome) return;

  await prisma.action.update({
    where: { id: actionId },
    data: {
      title,
      owner,
      dueDate: dateOrNull(formData.get("dueDate")),
      priority: String(formData.get("priority")) as never,
      status: status as never,
      outcome,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  revalidateAccountPlan();
}
