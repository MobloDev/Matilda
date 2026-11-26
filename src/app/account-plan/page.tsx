import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Badge,
  DateField,
  Field,
  FormDisclosure,
  Section,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui";
import {
  deferToReview,
  dismissPlanImpact,
  editSuggestion,
  linkInsightToPlan,
  requestMoreEvidence,
} from "./actions";
import { rejectInsight } from "../customer-intelligence/actions";
import {
  createAction,
  createAssumption,
  createGoal,
  createGrowthArea,
  createInitiative,
  createRelationship,
  createRisk,
  updateAction,
  updateAssumption,
  updateGoal,
  updateGrowthArea,
  updateInitiative,
  updatePlanOverview,
  updateRelationship,
  updateRisk,
} from "./authoring-actions";

// Importance/priority enums are stored as plain strings in SQLite, so we
// sort them in JavaScript after fetching (see src/app/page.tsx for the
// same pattern).
const importanceRank: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const IMPORTANCE_OPTIONS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((v) => ({
  value: v,
  label: v,
}));
const CONFIDENCE_OPTIONS = ["HIGH", "MEDIUM", "LOW"].map((v) => ({
  value: v,
  label: v,
}));
const GOAL_STATUS_OPTIONS = [
  "PROPOSED",
  "ACTIVE",
  "AT_RISK",
  "ACHIEVED",
  "STOPPED",
].map((v) => ({ value: v, label: v.replace("_", " ") }));
const INITIATIVE_STATUS_OPTIONS = [
  "PROPOSED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "STOPPED",
].map((v) => ({ value: v, label: v.replace("_", " ") }));
const RELATIONSHIP_STRENGTH_OPTIONS = ["UNKNOWN", "WEAK", "DEVELOPING", "STRONG"].map(
  (v) => ({ value: v, label: v }),
);
const DECISION_ROLE_OPTIONS = [
  { value: "sponsor", label: "Sponsor" },
  { value: "decision maker", label: "Decision maker" },
  { value: "influencer", label: "Influencer" },
  { value: "user", label: "User" },
  { value: "unknown", label: "Unknown" },
];
const GROWTH_POSTURE_OPTIONS = ["PURSUE", "MONITOR", "REJECT"].map((v) => ({
  value: v,
  label: v,
}));
const ASSUMPTION_STATUS_OPTIONS = ["UNVALIDATED", "CONFIRMED", "INVALIDATED"].map(
  (v) => ({ value: v, label: v }),
);
const RISK_LEVEL_OPTIONS = ["LOW", "MEDIUM", "HIGH"].map((v) => ({
  value: v,
  label: v,
}));
const ACTION_STATUS_OPTIONS = [
  "PROPOSED",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
].map((v) => ({ value: v, label: v.replace("_", " ") }));
const PLAN_STATUS_OPTIONS = ["DRAFT", "ACTIVE", "NEEDS_REVIEW", "RETIRED"].map(
  (v) => ({ value: v, label: v.replace("_", " ") }),
);

export default async function AccountPlanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { actionsView } = await searchParams;

  // This page is a generated VIEW over existing domain data — see
  // docs/architecture.md ("Data ownership") and docs/data-model.md
  // ("Account Plan is a view over structured entities"). Nothing here is
  // stored separately; every section below reads live rows.
  const account = await prisma.account.findFirst({
    include: {
      goals: {
        include: {
          initiatives: {
            include: {
              opportunities: { include: { qualifications: true } },
              relationshipLinks: { include: { relationship: true } },
              insightLinks: { include: { insight: true } },
            },
          },
          assumptions: true,
          risks: true,
        },
      },
      relationships: {
        include: { initiativeLinks: { include: { initiative: true } } },
      },
      growthAreas: { include: { initiative: true } },
      assumptions: { include: { goal: true, initiative: true } },
      risks: { include: { goal: true, initiative: true } },
      actions: true,
      knowledgeGaps: {
        where: { status: { notIn: ["ANSWERED", "CLOSED_UNANSWERABLE"] } },
      },
      insights: {
        where: { affectsAccountPlan: true },
        include: {
          sourceLinks: { include: { source: true } },
          reviewLinks: { include: { review: true } },
        },
      },
      reviews: {
        where: { status: { not: "FINALISED" } },
        orderBy: { reviewDate: "asc" },
      },
    },
  });

  if (!account) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-2 p-16 text-center">
        <p className="text-lg font-medium">No Account found.</p>
        <p className="text-zinc-500">
          Run{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            npm run seed
          </code>{" "}
          to load the demo scenario.
        </p>
      </main>
    );
  }

  const accountTeamOptions = (account.accountTeam ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ value: name, label: name }));

  const initiatives = account.goals.flatMap((goal) =>
    goal.initiatives.map((initiative) => ({ ...initiative, goal })),
  );

  const now = new Date();
  const ninetyDaysOut = new Date(now.getTime() + 90 * 86_400_000);
  const allOpenActions = account.actions
    .filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  const next90Actions = allOpenActions.filter(
    (a) => !a.dueDate || a.dueDate <= ninetyDaysOut,
  );
  const visibleActions = actionsView === "all" ? account.actions : next90Actions;

  const relationshipsWithInitiatives = account.relationships.filter(
    (relationship) => relationship.initiativeLinks.length > 0,
  );

  const knowledgeGaps = [...account.knowledgeGaps].sort(
    (a, b) => importanceRank[a.importance] - importanceRank[b.importance],
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Account Overview
        </Link>
        <span className="mt-2 inline-block w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-300">
          Synthetic prototype data
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Plan — {account.name}
        </h1>
        <div className="flex flex-wrap gap-2 pt-1 text-sm text-zinc-500">
          <span>Owner: {account.accountManager}</span>
          <Badge>{account.planStatus.replace("_", " ")}</Badge>
          {account.timeHorizon && <span>· Horizon: {account.timeHorizon}</span>}
          {account.lastReviewedAt && (
            <span>· Last reviewed: {account.lastReviewedAt.toLocaleDateString()}</span>
          )}
          {account.reviewDueAt && (
            <span>· Next review due: {account.reviewDueAt.toLocaleDateString()}</span>
          )}
        </div>
        <Link
          href="/customer-intelligence"
          className="mt-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View Customer Intelligence →
        </Link>
      </header>

      {/* 1. Our Ambition — account-plan.md §4 */}
      <Section title="Our Ambition">
        <p className="text-zinc-700 dark:text-zinc-300">
          {account.ambition ?? "No ambition recorded yet for this Account."}
        </p>

        <FormDisclosure label="Edit Ambition &amp; Plan Status">
          <form action={updatePlanOverview} className="flex flex-col gap-3">
            <input type="hidden" name="accountId" value={account.id} />
            <TextAreaField
              name="ambition"
              label="Ambition"
              defaultValue={account.ambition}
              rows={3}
            />
            <TextField
              name="timeHorizon"
              label="Time horizon"
              defaultValue={account.timeHorizon}
              placeholder="e.g. 12-36 months"
            />
            <SelectField
              name="planStatus"
              label="Plan status"
              defaultValue={account.planStatus}
              options={PLAN_STATUS_OPTIONS}
              required
            />
            <DateField
              name="reviewDueAt"
              label="Next review due"
              defaultValue={account.reviewDueAt}
            />
            <button
              type="submit"
              className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
            >
              Save
            </button>
          </form>
        </FormDisclosure>

        <ul className="flex flex-col gap-3">
          {account.goals.map((goal) => (
            <li
              key={goal.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{goal.title}</p>
                <div className="flex gap-2">
                  <Badge>{goal.priority}</Badge>
                  <Badge>{goal.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {goal.rationale}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Success criteria: {goal.successCriteria}
              </p>
              {goal.progressAssessment && (
                <p className="mt-1 text-xs text-zinc-500">
                  Progress: {goal.progressAssessment}
                </p>
              )}

              <FormDisclosure label="Edit">
                <form action={updateGoal} className="flex flex-col gap-3">
                  <input type="hidden" name="goalId" value={goal.id} />
                  <TextField name="title" label="Title" defaultValue={goal.title} required />
                  <TextAreaField
                    name="description"
                    label="Description"
                    defaultValue={goal.description}
                  />
                  <TextAreaField
                    name="rationale"
                    label="Rationale"
                    defaultValue={goal.rationale}
                    required
                  />
                  <SelectField
                    name="owner"
                    label="Owner"
                    defaultValue={goal.owner}
                    options={accountTeamOptions}
                    required
                  />
                  <SelectField
                    name="priority"
                    label="Priority"
                    defaultValue={goal.priority}
                    options={IMPORTANCE_OPTIONS}
                    required
                  />
                  <TextField name="horizon" label="Horizon" defaultValue={goal.horizon} />
                  <TextAreaField
                    name="successCriteria"
                    label="Success criteria"
                    defaultValue={goal.successCriteria}
                    required
                  />
                  <TextField name="baseline" label="Baseline" defaultValue={goal.baseline} />
                  <TextField name="target" label="Target" defaultValue={goal.target} />
                  <SelectField
                    name="status"
                    label="Status"
                    defaultValue={goal.status}
                    options={GOAL_STATUS_OPTIONS}
                    required
                  />
                  <TextAreaField
                    name="progressAssessment"
                    label="Progress assessment"
                    defaultValue={goal.progressAssessment}
                  />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                  >
                    Save
                  </button>
                </form>
              </FormDisclosure>
            </li>
          ))}
          {account.goals.length === 0 && (
            <p className="text-sm text-zinc-500">No Goals recorded yet.</p>
          )}
        </ul>

        <FormDisclosure label="+ New Goal">
          <form action={createGoal} className="flex flex-col gap-3">
            <input type="hidden" name="accountId" value={account.id} />
            <TextField name="title" label="Title" required />
            <TextAreaField name="description" label="Description" />
            <TextAreaField name="rationale" label="Rationale" required />
            <SelectField
              name="owner"
              label="Owner"
              options={accountTeamOptions}
              required
            />
            <SelectField
              name="priority"
              label="Priority"
              options={IMPORTANCE_OPTIONS}
              required
            />
            <TextField name="horizon" label="Horizon" placeholder="e.g. next 2 quarters" />
            <TextAreaField name="successCriteria" label="Success criteria" required />
            <TextField name="baseline" label="Baseline" />
            <TextField name="target" label="Target" />
            <Field label="Status">
              <input type="hidden" name="status" value="PROPOSED" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Proposed</span>
            </Field>
            <button
              type="submit"
              className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
            >
              Create Goal
            </button>
          </form>
        </FormDisclosure>
      </Section>

      {/* 2. Where We Are Today — account-plan.md §5 */}
      <Section title="Where We Are Today">
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">Relationship position</p>
            <ul className="flex flex-col gap-2">
              {account.relationships.map((relationship) => (
                <li
                  key={relationship.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{relationship.contactName}</p>
                      <p className="text-xs text-zinc-500">
                        {relationship.role ?? "Role unknown"}
                        {relationship.decisionRole && ` · ${relationship.decisionRole}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{relationship.strength}</Badge>
                      {relationship.desiredPosition && (
                        <Badge>→ {relationship.desiredPosition}</Badge>
                      )}
                    </div>
                  </div>

                  <FormDisclosure label="Edit">
                    <form action={updateRelationship} className="flex flex-col gap-3">
                      <input type="hidden" name="relationshipId" value={relationship.id} />
                      <TextField
                        name="contactName"
                        label="Contact name"
                        defaultValue={relationship.contactName}
                        required
                      />
                      <TextField
                        name="organisationOrUnit"
                        label="Organisation / unit"
                        defaultValue={relationship.organisationOrUnit}
                      />
                      <TextField
                        name="role"
                        label="Role"
                        defaultValue={relationship.role}
                      />
                      <SelectField
                        name="decisionRole"
                        label="Decision role"
                        defaultValue={relationship.decisionRole}
                        options={DECISION_ROLE_OPTIONS}
                      />
                      <SelectField
                        name="strategicRelevance"
                        label="Strategic relevance"
                        defaultValue={relationship.strategicRelevance}
                        options={IMPORTANCE_OPTIONS}
                        required
                      />
                      <SelectField
                        name="novaRelationshipOwner"
                        label="NOVA relationship owner"
                        defaultValue={relationship.novaRelationshipOwner}
                        options={accountTeamOptions}
                        required
                      />
                      <SelectField
                        name="strength"
                        label="Strength"
                        defaultValue={relationship.strength}
                        options={RELATIONSHIP_STRENGTH_OPTIONS}
                        required
                      />
                      <TextField
                        name="desiredPosition"
                        label="Desired position"
                        defaultValue={relationship.desiredPosition}
                      />
                      <TextAreaField
                        name="plannedApproach"
                        label="Planned approach"
                        defaultValue={relationship.plannedApproach}
                      />
                      <DateField
                        name="lastInteractionAt"
                        label="Last interaction"
                        defaultValue={relationship.lastInteractionAt}
                      />
                      <TextAreaField
                        name="notes"
                        label="Notes"
                        defaultValue={relationship.notes}
                      />
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                      >
                        Save
                      </button>
                    </form>
                  </FormDisclosure>
                </li>
              ))}
              {account.relationships.length === 0 && (
                <p className="text-sm text-zinc-500">No Relationships recorded yet.</p>
              )}
            </ul>

            <div className="mt-3">
              <FormDisclosure label="+ Add Relationship">
                <form action={createRelationship} className="flex flex-col gap-3">
                  <input type="hidden" name="accountId" value={account.id} />
                  <TextField name="contactName" label="Contact name" required />
                  <TextField name="organisationOrUnit" label="Organisation / unit" />
                  <TextField name="role" label="Role" />
                  <SelectField
                    name="decisionRole"
                    label="Decision role"
                    options={DECISION_ROLE_OPTIONS}
                  />
                  <SelectField
                    name="strategicRelevance"
                    label="Strategic relevance"
                    options={IMPORTANCE_OPTIONS}
                    required
                  />
                  <SelectField
                    name="novaRelationshipOwner"
                    label="NOVA relationship owner"
                    options={accountTeamOptions}
                    required
                  />
                  <SelectField
                    name="strength"
                    label="Strength"
                    defaultValue="UNKNOWN"
                    options={RELATIONSHIP_STRENGTH_OPTIONS}
                    required
                  />
                  <TextField name="desiredPosition" label="Desired position" />
                  <TextAreaField name="plannedApproach" label="Planned approach" />
                  <DateField name="lastInteractionAt" label="Last interaction" />
                  <TextAreaField name="notes" label="Notes" />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                  >
                    Add Relationship
                  </button>
                </form>
              </FormDisclosure>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Commercial position</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {initiatives.reduce((count, i) => count + i.opportunities.length, 0)}{" "}
              active Opportunity(ies) across {initiatives.length} Initiative(s). See the
              Account Overview for qualification detail.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Opportunity authoring is not built here yet — a future version will pull
              Opportunities directly from CRM, with: Title, Opportunity type (new
              business / existing business), Contact, Estimated revenue, and Estimated
              close date.
            </p>
          </div>
        </div>
      </Section>

      {/* 3. Where We Could Go — account-plan.md §6 */}
      <Section title="Where We Could Go">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <th className="py-2 pr-3">Area</th>
                <th className="py-2 pr-3">NOVA today</th>
                <th className="py-2 pr-3">Customer priority</th>
                <th className="py-2 pr-3">Potential</th>
                <th className="py-2 pr-3">Timing</th>
                <th className="py-2 pr-3">Posture</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {account.growthAreas.map((area) => (
                <tr
                  key={area.id}
                  className="border-b border-zinc-100 align-top last:border-0 dark:border-zinc-900"
                >
                  <td className="py-2 pr-3 font-medium">{area.name}</td>
                  <td className="py-2 pr-3">{area.novaToday}</td>
                  <td className="py-2 pr-3">{area.customerPriority}</td>
                  <td className="py-2 pr-3">{area.potential}</td>
                  <td className="py-2 pr-3">{area.timing ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <Badge>{area.posture}</Badge>
                  </td>
                  <td className="py-2">
                    <details className="text-xs">
                      <summary className="cursor-pointer rounded border border-zinc-300 px-2 py-1 font-medium dark:border-zinc-700">
                        Edit
                      </summary>
                      <form
                        action={updateGrowthArea}
                        className="mt-2 flex w-56 flex-col gap-2"
                      >
                        <input type="hidden" name="growthAreaId" value={area.id} />
                        <TextField name="name" label="Name" defaultValue={area.name} required />
                        <SelectField
                          name="novaToday"
                          label="NOVA today"
                          defaultValue={area.novaToday}
                          options={IMPORTANCE_OPTIONS}
                          required
                        />
                        <SelectField
                          name="customerPriority"
                          label="Customer priority"
                          defaultValue={area.customerPriority}
                          options={IMPORTANCE_OPTIONS}
                          required
                        />
                        <SelectField
                          name="potential"
                          label="Potential"
                          defaultValue={area.potential}
                          options={IMPORTANCE_OPTIONS}
                          required
                        />
                        <TextField name="timing" label="Timing" defaultValue={area.timing} />
                        <SelectField
                          name="posture"
                          label="Posture"
                          defaultValue={area.posture}
                          options={GROWTH_POSTURE_OPTIONS}
                          required
                        />
                        <TextAreaField
                          name="recommendedApproach"
                          label="Recommended approach"
                          defaultValue={area.recommendedApproach}
                        />
                        <button
                          type="submit"
                          className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                        >
                          Save
                        </button>
                      </form>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {account.growthAreas.length === 0 && (
            <p className="text-sm text-zinc-500">No Growth Areas assessed yet.</p>
          )}
        </div>

        <div className="mt-3">
          <FormDisclosure label="+ New Growth Area">
            <form action={createGrowthArea} className="flex flex-col gap-3">
              <input type="hidden" name="accountId" value={account.id} />
              <TextField name="name" label="Name" required />
              <SelectField name="novaToday" label="NOVA today" options={IMPORTANCE_OPTIONS} required />
              <SelectField
                name="customerPriority"
                label="Customer priority"
                options={IMPORTANCE_OPTIONS}
                required
              />
              <SelectField name="potential" label="Potential" options={IMPORTANCE_OPTIONS} required />
              <TextField name="timing" label="Timing" placeholder="e.g. Now, Near term" />
              <SelectField
                name="posture"
                label="Posture"
                defaultValue="MONITOR"
                options={GROWTH_POSTURE_OPTIONS}
                required
              />
              <TextAreaField name="recommendedApproach" label="Recommended approach" />
              <button
                type="submit"
                className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
              >
                Create Growth Area
              </button>
            </form>
          </FormDisclosure>
        </div>
      </Section>

      {/* 4. Our Strategy — account-plan.md §7 */}
      <Section title="Our Strategy">
        <ul className="flex flex-col gap-4">
          {initiatives.map((initiative) => (
            <li
              key={initiative.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{initiative.title}</p>
                <div className="flex gap-2">
                  <Badge>{initiative.priority}</Badge>
                  <Badge>{initiative.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Supports Goal: {initiative.goal.title}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {initiative.rationale}
              </p>
              {initiative.nextMilestone && (
                <p className="mt-2 text-xs text-zinc-500">
                  Next milestone: {initiative.nextMilestone}
                </p>
              )}

              <FormDisclosure label="Edit">
                <form action={updateInitiative} className="flex flex-col gap-3">
                  <input type="hidden" name="initiativeId" value={initiative.id} />
                  <TextField
                    name="title"
                    label="Title"
                    defaultValue={initiative.title}
                    required
                  />
                  <TextAreaField
                    name="description"
                    label="Description"
                    defaultValue={initiative.description}
                    required
                  />
                  <TextAreaField
                    name="rationale"
                    label="Rationale"
                    defaultValue={initiative.rationale}
                    required
                  />
                  <SelectField
                    name="owner"
                    label="Owner"
                    defaultValue={initiative.owner}
                    options={accountTeamOptions}
                    required
                  />
                  <SelectField
                    name="priority"
                    label="Priority"
                    defaultValue={initiative.priority}
                    options={IMPORTANCE_OPTIONS}
                    required
                  />
                  <SelectField
                    name="status"
                    label="Status"
                    defaultValue={initiative.status}
                    options={INITIATIVE_STATUS_OPTIONS}
                    required
                  />
                  <DateField
                    name="startDate"
                    label="Start date"
                    defaultValue={initiative.startDate}
                  />
                  <DateField
                    name="targetDate"
                    label="Target date"
                    defaultValue={initiative.targetDate}
                  />
                  <TextField
                    name="nextMilestone"
                    label="Next milestone"
                    defaultValue={initiative.nextMilestone}
                  />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                  >
                    Save
                  </button>
                </form>
              </FormDisclosure>
            </li>
          ))}
          {initiatives.length === 0 && (
            <p className="text-sm text-zinc-500">No Initiatives recorded yet.</p>
          )}
        </ul>

        <FormDisclosure label="+ New Initiative">
          <form action={createInitiative} className="flex flex-col gap-3">
            <input type="hidden" name="accountId" value={account.id} />
            <SelectField
              name="goalId"
              label="Supports Goal"
              options={account.goals.map((g) => ({ value: g.id, label: g.title }))}
              required
            />
            <TextField name="title" label="Title" required />
            <TextAreaField name="description" label="Description" required />
            <TextAreaField name="rationale" label="Rationale" required />
            <SelectField
              name="owner"
              label="Owner"
              options={accountTeamOptions}
              required
            />
            <SelectField
              name="priority"
              label="Priority"
              options={IMPORTANCE_OPTIONS}
              required
            />
            <Field label="Status">
              <input type="hidden" name="status" value="PROPOSED" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Proposed</span>
            </Field>
            <DateField name="startDate" label="Start date" />
            <DateField name="targetDate" label="Target date" />
            <TextField name="nextMilestone" label="Next milestone" />
            <button
              type="submit"
              className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
            >
              Create Initiative
            </button>
          </form>
        </FormDisclosure>
      </Section>

      {/* 5. Relationship Strategy — account-plan.md §8 */}
      <Section title="Relationship Strategy">
        <ul className="flex flex-col gap-2">
          {relationshipsWithInitiatives.map((relationship) => (
            <li
              key={relationship.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div>
                <p className="font-medium">{relationship.contactName}</p>
                <p className="text-xs text-zinc-500">
                  Critical to:{" "}
                  {relationship.initiativeLinks
                    .map((link) => link.initiative.title)
                    .join(", ")}
                </p>
              </div>
              <Badge>Owner: {relationship.novaRelationshipOwner}</Badge>
            </li>
          ))}
          {relationshipsWithInitiatives.length === 0 && (
            <p className="text-sm text-zinc-500">
              No Relationship is yet marked critical to an Initiative.
            </p>
          )}
        </ul>
      </Section>

      {/* 6. Execution Plan — account-plan.md §9. Account-level Actions, not
          linked to an Initiative — a deliberate simplification (see the
          Fase A authoring brainstorm). */}
      <Section title="Execution Plan">
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/account-plan"
            className={
              !actionsView || actionsView !== "all"
                ? "font-medium text-blue-600 dark:text-blue-400"
                : "text-zinc-500 hover:underline"
            }
          >
            Next 90 days
          </Link>
          <Link
            href="/account-plan?actionsView=all"
            className={
              actionsView === "all"
                ? "font-medium text-blue-600 dark:text-blue-400"
                : "text-zinc-500 hover:underline"
            }
          >
            All actions
          </Link>
        </div>

        <ul className="flex flex-col gap-2">
          {visibleActions.map((action) => (
            <li
              key={action.id}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{action.title}</p>
                <div className="flex items-center gap-2">
                  {action.dueDate && action.dueDate < now && action.status !== "COMPLETED" && (
                    <Badge>Overdue</Badge>
                  )}
                  {action.dueDate && (
                    <span className="text-xs text-zinc-500">
                      Due {action.dueDate.toLocaleDateString()}
                    </span>
                  )}
                  <Badge>{action.status.replace("_", " ")}</Badge>
                </div>
              </div>
              {action.outcome && (
                <p className="text-xs text-zinc-500">Outcome: {action.outcome}</p>
              )}

              <details className="text-xs">
                <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                  Edit
                </summary>
                <form action={updateAction} className="mt-2 flex flex-col gap-2">
                  <input type="hidden" name="actionId" value={action.id} />
                  <TextField name="title" label="Title" defaultValue={action.title} required />
                  <SelectField
                    name="owner"
                    label="Owner"
                    defaultValue={action.owner}
                    options={accountTeamOptions}
                    required
                  />
                  <DateField name="dueDate" label="Due date" defaultValue={action.dueDate} />
                  <SelectField
                    name="priority"
                    label="Priority"
                    defaultValue={action.priority}
                    options={IMPORTANCE_OPTIONS}
                    required
                  />
                  <SelectField
                    name="status"
                    label="Status"
                    defaultValue={action.status}
                    options={ACTION_STATUS_OPTIONS}
                    required
                  />
                  <TextAreaField
                    name="outcome"
                    label="Outcome (required if marking Completed)"
                    defaultValue={action.outcome}
                  />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                  >
                    Save
                  </button>
                </form>
              </details>
            </li>
          ))}
          {visibleActions.length === 0 && (
            <p className="text-sm text-zinc-500">No Actions in this view.</p>
          )}
        </ul>

        <FormDisclosure label="+ New Action">
          <form action={createAction} className="flex flex-col gap-3">
            <input type="hidden" name="accountId" value={account.id} />
            <TextField name="title" label="Title" required />
            <SelectField
              name="owner"
              label="Owner"
              options={accountTeamOptions}
              required
            />
            <DateField name="dueDate" label="Due date" />
            <SelectField
              name="priority"
              label="Priority"
              options={IMPORTANCE_OPTIONS}
              required
            />
            <button
              type="submit"
              className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
            >
              Create Action
            </button>
          </form>
        </FormDisclosure>
      </Section>

      {/* 7. Assumptions, Knowledge Gaps and Risks — account-plan.md §10 */}
      <Section title="Assumptions, Knowledge Gaps and Risks">
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">Assumptions</p>
            <ul className="flex flex-col gap-2">
              {account.assumptions.map((assumption) => (
                <li
                  key={assumption.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{assumption.statement}</span>
                    <div className="flex gap-2">
                      <Badge>{assumption.confidence}</Badge>
                      <Badge>{assumption.status}</Badge>
                    </div>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                      Edit
                    </summary>
                    <form action={updateAssumption} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="assumptionId" value={assumption.id} />
                      <TextAreaField
                        name="statement"
                        label="Statement"
                        defaultValue={assumption.statement}
                        required
                      />
                      <SelectField
                        name="confidence"
                        label="Confidence"
                        defaultValue={assumption.confidence}
                        options={CONFIDENCE_OPTIONS}
                        required
                      />
                      <SelectField
                        name="status"
                        label="Status"
                        defaultValue={assumption.status}
                        options={ASSUMPTION_STATUS_OPTIONS}
                        required
                      />
                      <SelectField
                        name="validationOwner"
                        label="Validation owner"
                        defaultValue={assumption.validationOwner}
                        options={accountTeamOptions}
                      />
                      <DateField
                        name="validationDate"
                        label="Validation date"
                        defaultValue={assumption.validationDate}
                      />
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                      >
                        Save
                      </button>
                    </form>
                  </details>
                </li>
              ))}
              {account.assumptions.length === 0 && (
                <p className="text-sm text-zinc-500">No Assumptions recorded.</p>
              )}
            </ul>

            <div className="mt-2">
              <FormDisclosure label="+ New Assumption">
                <form action={createAssumption} className="flex flex-col gap-3">
                  <input type="hidden" name="accountId" value={account.id} />
                  <TextAreaField name="statement" label="Statement" required />
                  <SelectField
                    name="confidence"
                    label="Confidence"
                    options={CONFIDENCE_OPTIONS}
                    required
                  />
                  <Field label="Status">
                    <input type="hidden" name="status" value="UNVALIDATED" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Unvalidated
                    </span>
                  </Field>
                  <SelectField
                    name="validationOwner"
                    label="Validation owner"
                    options={accountTeamOptions}
                  />
                  <DateField name="validationDate" label="Validation date" />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                  >
                    Create Assumption
                  </button>
                </form>
              </FormDisclosure>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Knowledge Gaps</p>
            <ul className="flex flex-col gap-2">
              {knowledgeGaps.map((gap) => (
                <li
                  key={gap.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <span>{gap.question}</span>
                  <Badge>{gap.importance}</Badge>
                </li>
              ))}
              {knowledgeGaps.length === 0 && (
                <p className="text-sm text-zinc-500">No open Knowledge Gaps.</p>
              )}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Risks</p>
            <ul className="flex flex-col gap-2">
              {account.risks.map((risk) => (
                <li
                  key={risk.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{risk.description}</span>
                    <div className="flex gap-2">
                      <Badge>Likelihood: {risk.likelihood}</Badge>
                      <Badge>Impact: {risk.impact}</Badge>
                    </div>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                      Edit
                    </summary>
                    <form action={updateRisk} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="riskId" value={risk.id} />
                      <TextAreaField
                        name="description"
                        label="Description"
                        defaultValue={risk.description}
                        required
                      />
                      <SelectField
                        name="likelihood"
                        label="Likelihood"
                        defaultValue={risk.likelihood}
                        options={RISK_LEVEL_OPTIONS}
                        required
                      />
                      <SelectField
                        name="impact"
                        label="Impact"
                        defaultValue={risk.impact}
                        options={RISK_LEVEL_OPTIONS}
                        required
                      />
                      <TextAreaField
                        name="mitigation"
                        label="Mitigation"
                        defaultValue={risk.mitigation}
                      />
                      <SelectField
                        name="owner"
                        label="Owner"
                        defaultValue={risk.owner}
                        options={accountTeamOptions}
                        required
                      />
                      <DateField
                        name="reviewDate"
                        label="Review date"
                        defaultValue={risk.reviewDate}
                      />
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                      >
                        Save
                      </button>
                    </form>
                  </details>
                </li>
              ))}
              {account.risks.length === 0 && (
                <p className="text-sm text-zinc-500">No Risks recorded.</p>
              )}
            </ul>

            <div className="mt-2">
              <FormDisclosure label="+ New Risk">
                <form action={createRisk} className="flex flex-col gap-3">
                  <input type="hidden" name="accountId" value={account.id} />
                  <TextAreaField name="description" label="Description" required />
                  <SelectField
                    name="likelihood"
                    label="Likelihood"
                    options={RISK_LEVEL_OPTIONS}
                    required
                  />
                  <SelectField name="impact" label="Impact" options={RISK_LEVEL_OPTIONS} required />
                  <TextAreaField name="mitigation" label="Mitigation" />
                  <SelectField
                    name="owner"
                    label="Owner"
                    options={accountTeamOptions}
                    required
                  />
                  <DateField name="reviewDate" label="Review date" />
                  <button
                    type="submit"
                    className="w-fit rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
                  >
                    Create Risk
                  </button>
                </form>
              </FormDisclosure>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. MATILDA change layer — account-plan.md §11. All five responses
          (Accept & Link, Edit suggestion, Request more evidence, Defer to
          Account Review, Dismiss) are implemented; rejecting the Insight
          itself reuses the existing Customer Intelligence action. */}
      <Section title="MATILDA Changes">
        <p className="mb-2 text-sm text-zinc-500">
          {account.insights.length} change(s) may affect this plan
          {account.lastReviewedAt &&
            ` since it was last reviewed on ${account.lastReviewedAt.toLocaleDateString()}`}
          .
        </p>
        <ul className="flex flex-col gap-3">
          {account.insights.map((insight) => {
            const requestedEvidence = account.knowledgeGaps.filter(
              (gap) => gap.relatedInsightId === insight.id,
            );
            return (
              <li
                key={insight.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="font-medium">{insight.title}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {insight.statement}
                </p>
                {insight.soWhat && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Why this may affect the plan: {insight.soWhat}
                  </p>
                )}
                <p className="mt-1 text-xs text-zinc-500">
                  Evidence:{" "}
                  {insight.sourceLinks.map((link) => link.source.title).join(", ") ||
                    "none"}
                </p>
                {requestedEvidence.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {requestedEvidence.map((gap) => (
                      <p
                        key={gap.id}
                        className="text-xs text-amber-700 dark:text-amber-400"
                      >
                        Evidence requested: {gap.question} ({gap.status.toLowerCase()})
                      </p>
                    ))}
                  </div>
                )}
                {insight.reviewLinks.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {insight.reviewLinks.map((link) => (
                      <p
                        key={link.reviewId}
                        className="text-xs text-amber-700 dark:text-amber-400"
                      >
                        Deferred to Account Review:{" "}
                        {link.review.reviewDate.toLocaleDateString()}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-900">
                  <form action={linkInsightToPlan} className="flex items-center gap-2">
                    <input type="hidden" name="insightId" value={insight.id} />
                    <select
                      name="target"
                      required
                      className="rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                    >
                      <option value="">Link to…</option>
                      <optgroup label="Goals">
                        {account.goals.map((goal) => (
                          <option key={goal.id} value={`GOAL:${goal.id}`}>
                            {goal.title}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Initiatives">
                        {initiatives.map((initiative) => (
                          <option key={initiative.id} value={`INITIATIVE:${initiative.id}`}>
                            {initiative.title}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <button
                      type="submit"
                      className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium dark:border-zinc-700"
                    >
                      Accept &amp; Link
                    </button>
                  </form>

                  <form action={dismissPlanImpact}>
                    <input type="hidden" name="insightId" value={insight.id} />
                    <button
                      type="submit"
                      className="rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium dark:border-zinc-700"
                    >
                      Dismiss — no plan change needed
                    </button>
                  </form>

                  <details className="text-xs">
                    <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                      Edit suggestion
                    </summary>
                    <form action={editSuggestion} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="insightId" value={insight.id} />
                      <label className="flex flex-col gap-1">
                        Statement
                        <textarea
                          name="statement"
                          defaultValue={insight.statement}
                          rows={2}
                          className="w-full rounded border border-zinc-300 bg-transparent p-2 text-xs dark:border-zinc-700"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        Why it may affect the plan
                        <textarea
                          name="soWhat"
                          defaultValue={insight.soWhat ?? ""}
                          rows={2}
                          className="w-full rounded border border-zinc-300 bg-transparent p-2 text-xs dark:border-zinc-700"
                        />
                      </label>
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                      >
                        Save edit
                      </button>
                    </form>
                  </details>

                  <details className="text-xs">
                    <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                      Request more evidence
                    </summary>
                    <form action={requestMoreEvidence} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="insightId" value={insight.id} />
                      <textarea
                        name="question"
                        defaultValue={`What additional evidence confirms: ${insight.title}?`}
                        rows={2}
                        className="w-full rounded border border-zinc-300 bg-transparent p-2 text-xs dark:border-zinc-700"
                      />
                      <p className="text-zinc-500">
                        Creates a Knowledge Gap tracking this; the change stays in this
                        queue until it's answered.
                      </p>
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                      >
                        Request evidence
                      </button>
                    </form>
                  </details>

                  {(() => {
                    const deferredReviewIds = new Set(
                      insight.reviewLinks.map((link) => link.reviewId),
                    );
                    const availableReviews = account.reviews.filter(
                      (review) => !deferredReviewIds.has(review.id),
                    );
                    if (availableReviews.length === 0) return null;
                    return (
                      <details className="text-xs">
                        <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700">
                          Defer to Account Review
                        </summary>
                        <form action={deferToReview} className="mt-2 flex flex-col gap-2">
                          <input type="hidden" name="insightId" value={insight.id} />
                          <select
                            name="reviewId"
                            required
                            className="rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                          >
                            <option value="">Review…</option>
                            {availableReviews.map((review) => (
                              <option key={review.id} value={review.id}>
                                {review.reviewDate.toLocaleDateString()} (
                                {review.status.toLowerCase().replace("_", " ")})
                              </option>
                            ))}
                          </select>
                          <p className="text-zinc-500">
                            The decision will be made at that Review instead of now; this
                            change stays in the queue until then.
                          </p>
                          <button
                            type="submit"
                            className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                          >
                            Defer
                          </button>
                        </form>
                      </details>
                    );
                  })()}

                  <details className="text-xs">
                    <summary className="cursor-pointer rounded border border-zinc-300 px-2.5 py-1 font-medium text-red-700 dark:border-zinc-700 dark:text-red-400">
                      Reject Insight
                    </summary>
                    <form action={rejectInsight} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="insightId" value={insight.id} />
                      <textarea
                        name="reason"
                        placeholder="Why reject this Insight entirely? (required)"
                        rows={2}
                        className="w-full rounded border border-zinc-300 bg-transparent p-2 text-xs dark:border-zinc-700"
                      />
                      <button
                        type="submit"
                        className="w-fit rounded border border-zinc-300 px-2.5 py-1 font-medium dark:border-zinc-700"
                      >
                        Confirm reject
                      </button>
                    </form>
                  </details>
                </div>
              </li>
            );
          })}
          {account.insights.length === 0 && (
            <p className="text-sm text-zinc-500">
              No changes are currently flagged as affecting this plan.
            </p>
          )}
        </ul>
      </Section>
    </main>
  );
}
