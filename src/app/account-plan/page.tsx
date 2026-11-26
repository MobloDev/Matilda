import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Section } from "@/components/ui";
import { dismissPlanImpact, linkInsightToPlan } from "./actions";
import { rejectInsight } from "../customer-intelligence/actions";

// Importance/priority enums are stored as plain strings in SQLite, so we
// sort them in JavaScript after fetching (see src/app/page.tsx for the
// same pattern).
const importanceRank: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export default async function AccountPlanPage() {
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
              actions: true,
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
      knowledgeGaps: {
        where: { status: { notIn: ["ANSWERED", "CLOSED_UNANSWERABLE"] } },
      },
      insights: {
        where: { affectsAccountPlan: true },
        include: { sourceLinks: { include: { source: true } } },
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

  const initiatives = account.goals.flatMap((goal) =>
    goal.initiatives.map((initiative) => ({ ...initiative, goal })),
  );

  const openActions = initiatives
    .flatMap((initiative) =>
      initiative.actions.map((action) => ({ action, initiative })),
    )
    .filter(
      ({ action }) =>
        action.status !== "COMPLETED" && action.status !== "CANCELLED",
    )
    .sort((a, b) => {
      if (!a.action.dueDate) return 1;
      if (!b.action.dueDate) return -1;
      return a.action.dueDate.getTime() - b.action.dueDate.getTime();
    });

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
          {account.lastReviewedAt && (
            <span>
              · Last reviewed:{" "}
              {account.lastReviewedAt.toLocaleDateString()}
            </span>
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
                  <Badge>{goal.status}</Badge>
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
            </li>
          ))}
          {account.goals.length === 0 && (
            <p className="text-sm text-zinc-500">No Goals recorded yet.</p>
          )}
        </ul>
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
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-medium">{relationship.contactName}</p>
                    <p className="text-xs text-zinc-500">
                      {relationship.role ?? "Role unknown"}
                      {relationship.decisionRole &&
                        ` · ${relationship.decisionRole}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{relationship.strength}</Badge>
                    {relationship.desiredPosition && (
                      <Badge>→ {relationship.desiredPosition}</Badge>
                    )}
                  </div>
                </li>
              ))}
              {account.relationships.length === 0 && (
                <p className="text-sm text-zinc-500">
                  No Relationships recorded yet.
                </p>
              )}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Commercial position</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {initiatives.reduce(
                (count, i) => count + i.opportunities.length,
                0,
              )}{" "}
              active Opportunity(ies) across {initiatives.length} Initiative(s).
              See the Account Overview for qualification detail.
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
                <th className="py-2">Posture</th>
              </tr>
            </thead>
            <tbody>
              {account.growthAreas.map((area) => (
                <tr
                  key={area.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="py-2 pr-3 font-medium">{area.name}</td>
                  <td className="py-2 pr-3">{area.novaToday}</td>
                  <td className="py-2 pr-3">{area.customerPriority}</td>
                  <td className="py-2 pr-3">{area.potential}</td>
                  <td className="py-2 pr-3">{area.timing ?? "—"}</td>
                  <td className="py-2">
                    <Badge>{area.posture}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {account.growthAreas.length === 0 && (
            <p className="text-sm text-zinc-500">
              No Growth Areas assessed yet.
            </p>
          )}
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
            </li>
          ))}
          {initiatives.length === 0 && (
            <p className="text-sm text-zinc-500">No Initiatives recorded yet.</p>
          )}
        </ul>
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

      {/* 6. Execution Plan — account-plan.md §9, "next 90 days" */}
      <Section title="Execution Plan — Next 90 Days">
        <ul className="flex flex-col gap-2">
          {openActions.map(({ action, initiative }) => (
            <li
              key={action.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div>
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-zinc-500">{initiative.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {action.dueDate && (
                  <span className="text-xs text-zinc-500">
                    Due {action.dueDate.toLocaleDateString()}
                  </span>
                )}
                <Badge>{action.status.replace("_", " ")}</Badge>
              </div>
            </li>
          ))}
          {openActions.length === 0 && (
            <p className="text-sm text-zinc-500">No open Actions.</p>
          )}
        </ul>
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
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <span>{assumption.statement}</span>
                  <div className="flex gap-2">
                    <Badge>{assumption.confidence}</Badge>
                    <Badge>{assumption.status}</Badge>
                  </div>
                </li>
              ))}
              {account.assumptions.length === 0 && (
                <p className="text-sm text-zinc-500">No Assumptions recorded.</p>
              )}
            </ul>
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
                <p className="text-sm text-zinc-500">
                  No open Knowledge Gaps.
                </p>
              )}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Risks</p>
            <ul className="flex flex-col gap-2">
              {account.risks.map((risk) => (
                <li
                  key={risk.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <span>{risk.description}</span>
                  <div className="flex gap-2">
                    <Badge>Likelihood: {risk.likelihood}</Badge>
                    <Badge>Impact: {risk.impact}</Badge>
                  </div>
                </li>
              ))}
              {account.risks.length === 0 && (
                <p className="text-sm text-zinc-500">No Risks recorded.</p>
              )}
            </ul>
          </div>
        </div>
      </Section>

      {/* 8. MATILDA change layer — account-plan.md §11.
          V1 scope: Accept & Link, and Dismiss. Rejecting the Insight itself
          reuses the same action already on the Customer Intelligence Insights
          page, rather than duplicating it here. */}
      <Section title="MATILDA Changes">
        <p className="mb-2 text-sm text-zinc-500">
          {account.insights.length} change(s) may affect this plan
          {account.lastReviewedAt &&
            ` since it was last reviewed on ${account.lastReviewedAt.toLocaleDateString()}`}
          .
        </p>
        <ul className="flex flex-col gap-3">
          {account.insights.map((insight) => (
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
          ))}
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
