# MATILDA Logical Data Model

## Purpose

This document defines the implementation-neutral logical schema for the prototype: entities, fields, relationships, enums, and validation rules.

The core domain contains thirteen entities:

1. Account
2. Insight
3. Source
4. Knowledge Gap
5. Relationship
6. Goal
7. Initiative
8. Action
9. Opportunity
10. Account Review
11. Assumption
12. Risk
13. Growth Area

Assumption, Risk, and Growth Area were added when `account-plan.md` was written out in
full (see that document's chapters 6 and 10): the Account Plan needs to show conditions
the strategy depends on, threats to the strategy, and candidate areas of potential that
are not yet (and may never become) an Initiative. None of these can be represented
cleanly by an existing entity — an Assumption is not an open question (`KnowledgeGap`),
a Risk is not customer knowledge (`Insight`), and a Growth Area can exist, and be
rejected, without ever becoming coordinated work (`Initiative`).

A physical schema may add junction tables, indexes, and technical metadata without changing this domain meaning.

## Modelling principles

- `Account` is the root entity.
- `Insight` is the atomic unit of Account knowledge.
- Important Insights are connected to Sources.
- Unknowns are represented explicitly as Knowledge Gaps.
- Account Plan is a view over structured entities, not a document entity.
- Account Review is primarily a generated decision view.
- Initiative and Opportunity are distinct.
- AI proposals and validated human knowledge must remain distinguishable.
- Material changes should be traceable over time.
- Avoid new domain objects unless required by actual prototype behaviour.

## Conceptual relationships

```mermaid
flowchart TB
    Account --> Insight
    Account --> Source
    Account --> KnowledgeGap[Knowledge Gap]
    Account --> Relationship
    Account --> Goal
    Goal --> Initiative
    Initiative --> Action
    Initiative --> Opportunity
    Account --> AccountReview[Account Review]
    Account --> Assumption
    Account --> Risk
    Account --> GrowthArea[Growth Area]

    Source -. supports .-> Insight
    Insight -. informs .-> Goal
    Insight -. supports or challenges .-> Initiative
    Insight -. supports or challenges .-> Opportunity
    KnowledgeGap -. relates to .-> Insight
    KnowledgeGap -. relates to .-> Relationship
    KnowledgeGap -. relates to .-> Initiative
    KnowledgeGap -. relates to .-> Opportunity
    Relationship -. relevant to .-> Initiative
    Relationship -. relevant to .-> Opportunity
    AccountReview -. creates .-> Action
    Opportunity -. produces learning .-> Insight
    Action -. produces learning .-> Insight
    Assumption -. depends on .-> Goal
    Assumption -. depends on .-> Initiative
    Risk -. threatens .-> Goal
    Risk -. threatens .-> Initiative
    GrowthArea -. may become .-> Initiative
```

All cross-links must remain within the same Account.

## Common conventions

### Identifiers

Use stable opaque identifiers such as UUIDs. Human-readable prefixes may be added for demo display, for example `INS-018`, but display IDs must not be relied on as database keys.

### Timestamps

Store timestamps in UTC and render them in the user's locale. Use ISO 8601 at integration boundaries.

### Audit metadata

Where relevant, entities should include:

| Field | Type | Required | Notes |
|---|---|---:|---|
| `created_at` | datetime | Yes | Immutable creation time |
| `created_by` | string/user reference | Yes | Human or service identity |
| `updated_at` | datetime | Yes | Last material update |
| `updated_by` | string/user reference | Yes | Human or service identity |
| `origin_type` | enum | Yes | `human`, `matilda_suggestion`, `import`, `system` |
| `ai_generated` | boolean | Yes | True when initial content was AI-generated |

Do not use one generic AI data table. AI metadata belongs with the affected records and proposal history.

### Optional values

Use `null` for unknown values. Do not convert unknown into false, zero, or “not applicable.” Where the distinction matters, model `unknown` and `not_applicable` explicitly.

## Enums

### `information_type`

- `fact`
- `observation`
- `hypothesis`
- `ai_inference`

`decision` is conceptually a separate human-approved result, not an Insight type in the initial physical model. Review decisions may be stored within Account Review until a dedicated Decision entity is justified.

### `insight_status`

- `new`
- `needs_validation`
- `validated`
- `superseded`
- `stale`

### `confidence_level`

- `low`
- `medium`
- `high`

Confidence does not replace evidence or validation status.

### `importance_level`

- `low`
- `medium`
- `high`
- `critical`

### `knowledge_gap_status`

- `open`
- `investigating`
- `resolved`

### `relationship_strength`

- `unknown`
- `weak`
- `developing`
- `strong`

### `goal_status`

- `proposed`
- `active`
- `achieved`
- `stopped`

### `initiative_status`

- `proposed`
- `active`
- `on_hold`
- `completed`
- `stopped`

### `action_status`

- `proposed`
- `planned`
- `in_progress`
- `completed`
- `cancelled`

`overdue` should normally be derived from `due_date < now` and an incomplete status rather than stored.

### `opportunity_stage`

- `potential`
- `validating`
- `qualified`
- `proposal`
- `negotiation`
- `won`
- `lost`

### `qualification_state`

- `confirmed`
- `uncertain`
- `missing`
- `not_applicable`

### `review_status`

- `draft`
- `in_review`
- `finalised`

### `assumption_status`

- `unvalidated`
- `confirmed`
- `invalidated`

### `risk_level`

Used for both `likelihood` and `impact` on a Risk.

- `low`
- `medium`
- `high`

### `growth_posture`

- `pursue`
- `monitor`
- `reject`

## Account

Represents the customer organisation and root of the living model.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `name` | string | Yes | Unique within the prototype unless duplicate legal entities are intentional |
| `account_type` | string/enum | No | Example: strategic, KAM, TAM, other |
| `segment` | string | No | Business-defined segment |
| `industry` | string | No | Plain-language industry |
| `account_manager` | user reference | Yes | Overall accountable owner |
| `technical_account_manager` | user reference | No | When relevant |
| `account_team` | user-reference list | No | Contributors |
| `ambition` | text | No | NOVA's overall ambition for the Account |
| `strategic_status` | string/enum | No | Keep initial values simple |
| `last_reviewed_at` | datetime | No | Last Account-level review |
| common audit fields | — | Yes | As above |

### Rules

- Every core record belongs to exactly one Account.
- Account deletion should be restricted or implemented only as a full demo reset.
- Synthetic demo Accounts must be clearly marked in the UI or seed metadata.

## Insight

Represents one discrete claim or piece of knowledge about an Account.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `title` | string | Yes | Short scannable label |
| `statement` | text | Yes | One atomic claim where practical |
| `topic` | string/enum | Yes | Example: strategy, technology, decision structure |
| `information_type` | enum | Yes | Fact, Observation, Hypothesis, or AI Inference |
| `status` | enum | Yes | Insight status |
| `importance` | enum | Yes | Strategic relevance |
| `confidence` | enum | Yes | Explicit, not implied by type |
| `observed_at` | datetime/date | Yes | When the information applied or was observed |
| `validated_at` | datetime | No | Required when status becomes validated |
| `validated_by` | user reference | No | Required with `validated_at` |
| `last_reviewed_at` | datetime | No | Last freshness review |
| `review_due_at` | datetime | No | Optional freshness threshold |
| `supersedes_insight_id` | UUID/FK | No | Previous Insight if this replaces it |
| common audit fields | — | Yes | As above |

### Rules

- Prefer one claim per Insight. Split compound statements.
- `ai_inference` requires `ai_generated = true`.
- `validated` requires `validated_at` and `validated_by`.
- Changing `information_type` to `fact` requires human validation and at least one Source or explicit user-origin rationale.
- Superseded Insights remain queryable for history.
- Staleness does not mean false; it means revalidation may be needed.

## Source

Represents evidence or origin for customer intelligence.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `source_type` | enum/string | Yes | Meeting, transcript, email, document, web, CRM, team Observation, other |
| `title` | string | Yes | Human-readable Source title |
| `reference` | string/URL | No | Link or external reference when available |
| `source_date` | datetime/date | Yes | Date of the underlying Source |
| `owner` | user/string | No | Source owner or contact |
| `classification` | enum/string | No | Internal/external and access classification |
| `excerpt` | text | No | Short relevant excerpt; do not duplicate entire documents unnecessarily |
| common audit fields | — | Yes | As above |

### Insight–Source link

Use a many-to-many link table such as `insight_sources`:

| Field | Type | Required | Notes |
|---|---|---:|---|
| `insight_id` | UUID/FK | Yes | Same Account as Source |
| `source_id` | UUID/FK | Yes | Same Account as Insight |
| `support_type` | enum | Yes | `supports`, `challenges`, `context` |
| `note` | text | No | Why the Source is relevant |

Unique constraint: one row per `(insight_id, source_id, support_type)`.

## Knowledge Gap

Represents strategically important information the team does not know.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `question` | text | Yes | Formulated as an answerable question |
| `topic` | string/enum | Yes | Knowledge domain |
| `importance` | enum | Yes | Priority of resolving the gap |
| `status` | enum | Yes | Open, investigating, resolved |
| `owner` | user reference | No | Required once investigating |
| `target_date` | date | No | Optional resolution target |
| `resolution` | text | No | Required when resolved |
| `resolved_at` | datetime | No | Required when resolved |
| `resolved_by` | user reference | No | Human validator |
| common audit fields | — | Yes | As above |

### Links

A Knowledge Gap may link to one or more Insights, Relationships, Initiatives, or Opportunities through implementation-level link tables.

### Rules

- `resolved` requires `resolution`, `resolved_at`, and `resolved_by`.
- Resolution should create or link to one or more Insights when it produces reusable Account knowledge.
- Do not delete important resolved gaps; they provide learning history.

## Relationship

Represents NOVA's relationship with a relevant customer stakeholder.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `contact_name` | string | Yes | Stakeholder name in real use; fictional in demo |
| `organisation_or_unit` | string | No | Business unit or function |
| `role` | string | No | Job or functional role |
| `decision_role` | string/enum | No | Sponsor, decision maker, influencer, user, unknown |
| `strategic_relevance` | enum | Yes | Low, medium, high, critical |
| `nova_relationship_owner` | user reference | Yes | NOVA owner |
| `strength` | enum | Yes | Relationship strength |
| `desired_position` | string/enum | No | Where NOVA wants this relationship to be (mirrors `strength`) |
| `planned_approach` | text | No | How NOVA intends to develop the relationship |
| `last_interaction_at` | datetime | No | Most recent interaction |
| `notes` | text | No | Concise context, not a full contact history |
| common audit fields | — | Yes | As above |

### Rules

- The prototype is not a full contact database.
- Relationship strength should not be inferred from activity volume alone.
- Links to Initiatives, Opportunities, Insights, and Knowledge Gaps may be many-to-many.

## Goal

Represents a strategic outcome NOVA wants to achieve with the Account.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `title` | string | Yes | Outcome-oriented statement |
| `description` | text | No | Additional context |
| `rationale` | text | Yes | Why this matters |
| `owner` | user reference | Yes | Accountable owner |
| `priority` | enum | Yes | Low, medium, high, critical |
| `horizon` | string/date range | No | Time horizon |
| `success_criteria` | text | Yes | Observable success definition |
| `baseline` | text/number | No | Starting position |
| `target` | text/number | No | Desired result |
| `status` | enum | Yes | Goal status |
| `progress_assessment` | text | No | Human explanation of progress, not only a percentage |
| common audit fields | — | Yes | As above |

### Rules

- A Goal describes an outcome, not an activity.
- At least one success criterion is required before activation.
- Goals may be supported or challenged by multiple Insights.

## Initiative

Represents coordinated work intended to move the Account toward a Goal.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `goal_id` | UUID/FK | Yes | Parent Goal, same Account |
| `title` | string | Yes | Short workstream name |
| `description` | text | Yes | Intended change or coordinated effort |
| `rationale` | text | Yes | Evidence-based reason |
| `owner` | user reference | Yes | Accountable owner |
| `priority` | enum | Yes | Priority |
| `status` | enum | Yes | Initiative status |
| `start_date` | date | No | Planned/actual start |
| `target_date` | date | No | Planned completion or review |
| `next_milestone` | text | No | Next meaningful outcome shown in the Execution Plan |
| common audit fields | — | Yes | As above |

### Initiative–Relationship link

Use a many-to-many link table such as `initiative_relationships` so the Account Plan can
show which stakeholders are critical to which Initiative:

| Field | Type | Required | Notes |
|---|---|---:|---|
| `initiative_id` | UUID/FK | Yes | Same Account as Relationship |
| `relationship_id` | UUID/FK | Yes | Same Account as Initiative |

### Rules

- Goal and Initiative must belong to the same Account.
- An Initiative may exist without an Opportunity.
- Completing an Initiative should capture an outcome and propose learning when appropriate.

## Action

Represents a concrete next step.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `initiative_id` | UUID/FK | No | Related Initiative |
| `opportunity_id` | UUID/FK | No | Related Opportunity |
| `review_id` | UUID/FK | No | Originating Review |
| `title` | string | Yes | Verb-led next step |
| `description` | text | No | Scope or expected result |
| `owner` | user reference | Yes after proposal acceptance | Human owner |
| `due_date` | date | Yes after proposal acceptance | Commitment date |
| `priority` | enum | Yes | Priority |
| `status` | enum | Yes | Action status |
| `outcome` | text | No | Required when completed |
| `completed_at` | datetime | No | Required when completed |
| common audit fields | — | Yes | Includes whether MATILDA suggested it |

### Rules

- An Action must belong to at least the Account and may link to an Initiative, Opportunity, or Review.
- `completed` requires `outcome` and `completed_at`.
- MATILDA may suggest an Action but cannot assign a human commitment silently.
- Completion may trigger proposed Insights or Knowledge Gap resolution.

## Opportunity

Represents a potential commercial outcome.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `initiative_id` | UUID/FK | No | Related Initiative |
| `title` | string | Yes | Opportunity name |
| `customer_need` | text | Yes | Evidence-based need statement |
| `business_value` | text | No | Customer impact |
| `stage` | enum | Yes | Opportunity stage |
| `estimated_value` | decimal + currency | No | Optional prototype field |
| `probability` | integer 0–100 | No | Secondary; never a substitute for evidence |
| `sponsor_relationship_id` | UUID/FK | No | Identified sponsor |
| `decision_maker_relationship_id` | UUID/FK | No | Identified decision maker |
| `decision_process` | text | No | Buying/approval process |
| `budget_status` | text/enum | No | Funding evidence |
| `timing` | text/date range | No | Expected timing |
| `nova_proposition` | text | No | Why NOVA is relevant |
| `competition` | text | No | Known competitive position |
| `next_step` | text | No | Next customer commitment or Action |
| `next_step_date` | date | No | Date |
| `status` | string/enum | Yes | Open, closed-won, closed-lost if separate from stage |
| common audit fields | — | Yes | As above |

### Qualification dimensions

Store a structured state and evidence reference for:

- customer need confirmed;
- business importance understood;
- sponsor identified;
- decision maker identified;
- decision process understood;
- funding path understood;
- timing understood;
- NOVA relevance established;
- competitive position understood; and
- next customer commitment agreed.

This may be implemented as a child table or validated JSON for the prototype. Each dimension requires:

- `state` (`confirmed`, `uncertain`, `missing`, `not_applicable`);
- optional `evidence_insight_ids`;
- optional `note`; and
- `last_assessed_at` and `assessed_by`.

### Rules

- An Observation or Hypothesis must not automatically create an Opportunity.
- `qualified` requires a human qualification decision.
- Qualification UI must show missing and uncertain dimensions.
- Do not calculate maturity solely from a count; strategically critical gaps may block qualification.

## Account Review

Represents a periodic decision event and its finalised output. Most displayed content is generated from existing data.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `review_date` | date | Yes | Review date |
| `review_period_start` | date | Yes | Change window start |
| `review_period_end` | date | Yes | Change window end |
| `participants` | user/string list | No | Participants |
| `status` | enum | Yes | Draft, in review, finalised |
| `generated_summary` | structured text/JSON | No | Regenerable preparation output |
| `edited_summary` | structured text/JSON | No | Human-edited version |
| `decisions` | structured list | No | Human-approved decisions |
| `finalised_by` | user reference | No | Required when finalised |
| `finalised_at` | datetime | No | Required when finalised |
| common audit fields | — | Yes | As above |

### Decision structure within a Review

Until a dedicated Decision entity is justified, each decision item should contain:

- decision text;
- decision owner/approver;
- decided at;
- rationale;
- related entity links; and
- resulting Action IDs.

### Rules

- Generated summary is not a separate source of Account truth.
- Finalising a Review requires a human actor.
- Recommendations, Decisions, and Actions must remain distinct.
- Review Actions are normal Action records linked through `review_id`.

## Assumption

Represents a condition the Account strategy currently depends on being true.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `statement` | text | Yes | The condition being assumed |
| `goal_id` | UUID/FK | No | Related Goal |
| `initiative_id` | UUID/FK | No | Related Initiative |
| `supporting_insight_id` | UUID/FK | No | Evidence the assumption is reasonable, if any |
| `confidence` | enum | Yes | Confidence level |
| `status` | enum | Yes | Assumption status |
| `validation_owner` | user reference | No | Required once validation is planned |
| `validation_date` | date | No | Target date to validate |
| common audit fields | — | Yes | As above |

### Rules

- An Assumption must relate to at least a Goal or an Initiative.
- Moving `status` to `confirmed` should normally create or link a supporting Insight.
- An invalidated Assumption should prompt review of the Goal or Initiative it supported, not silent removal.

## Risk

Represents an event or condition that could prevent the strategy from succeeding.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `description` | text | Yes | What could go wrong |
| `goal_id` | UUID/FK | No | Affected Goal |
| `initiative_id` | UUID/FK | No | Affected Initiative |
| `likelihood` | enum | Yes | Risk level |
| `impact` | enum | Yes | Risk level |
| `mitigation` | text | No | Planned mitigation |
| `owner` | user reference | Yes | Accountable person |
| `review_date` | date | No | Next review of this Risk |
| common audit fields | — | Yes | As above |

### Rules

- A Risk must relate to at least a Goal or an Initiative.
- A Risk is a threat to the strategy, not an unanswered question (`KnowledgeGap`) or a strategic precondition (`Assumption`).

## Growth Area

Represents a candidate area of potential NOVA has assessed, whether or not it becomes an
Initiative. Backs the Account Plan's Growth and White-Space Map (`account-plan.md` §6.1).

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | UUID | Yes | Primary key |
| `account_id` | UUID/FK | Yes | Parent Account |
| `name` | string | Yes | Short area name, e.g. "Applied AI" |
| `nova_today` | enum | Yes | Importance-scale reuse: NOVA's current strength in this area |
| `customer_priority` | enum | Yes | Importance-scale reuse |
| `potential` | enum | Yes | Importance-scale reuse |
| `timing` | string | No | Free-text timing assessment |
| `posture` | enum | Yes | Growth posture decision |
| `recommended_approach` | text | No | Short free-text elaboration of the posture |
| `initiative_id` | UUID/FK | No | Set once NOVA decides to pursue the area as an Initiative |
| common audit fields | — | Yes | As above |

### Rules

- A Growth Area with posture `reject` or `monitor` normally has no `initiative_id`.
- Setting `posture` to `pursue` should normally be followed by creating or linking an Initiative.
- A Growth Area is a human-owned assessment; MATILDA may propose one but a human sets the posture.

## Material change history

A technical `change_log` table is recommended but is not a user-facing domain entity.

| Field | Type | Required |
|---|---|---:|
| `id` | UUID | Yes |
| `account_id` | UUID/FK | Yes |
| `entity_type` | string | Yes |
| `entity_id` | UUID | Yes |
| `change_type` | string | Yes |
| `previous_value` | JSON/text | No |
| `new_value` | JSON/text | No |
| `actor_type` | enum | Yes |
| `actor_id` | string | No |
| `reason` | text | No |
| `source_id` | UUID/FK | No |
| `created_at` | datetime | Yes |

Use it to generate “what changed?” and to inspect material AI influence.

## Data integrity rules

At minimum:

1. Every core record belongs to an Account.
2. Cross-entity links cannot cross Accounts.
3. Important Insights require type, observed date, origin, and confidence/validation state.
4. AI-generated content is identifiable in storage and UI.
5. Fact, Observation, Hypothesis, and AI Inference remain distinguishable.
6. Human validation records validator and time.
7. Resolved Knowledge Gaps link to reusable learning where applicable.
8. Completed Actions contain an outcome.
9. Finalised Reviews contain a human finaliser and timestamp.
10. Qualified Opportunities contain a human qualification decision.
11. Deleting history must not be the normal way to correct knowledge; supersede or change with traceability.
12. Synthetic demo data is never presented as real customer information.

## Recommended indexes

For a relational implementation, consider indexes on:

- every `account_id`;
- `insight(account_id, status, topic, observed_at)`;
- `knowledge_gap(account_id, status, importance)`;
- `action(account_id, status, due_date)`;
- `opportunity(account_id, stage)`;
- `account_review(account_id, review_date)`;
- Source links by both Insight and Source ID; and
- change log by Account and creation time.

Avoid premature indexing beyond observed prototype queries.

## Seed-data target

For the primary demonstration Account:

- 25–50 Insights;
- 10–20 Sources;
- 5–10 Knowledge Gaps;
- 8–15 Relationships;
- 2–4 Goals;
- 3–6 Initiatives;
- 10–20 Actions;
- 2–5 Opportunities;
- 2–4 Account Reviews;
- 2–5 Assumptions;
- 2–5 Risks; and
- 3–6 Growth Areas.

Coherence matters more than volume. All seed data should support the canonical scenario in `demo-scenario.md`.
