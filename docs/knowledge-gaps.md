# Knowledge Gaps

## Purpose

A Knowledge Gap represents an important question about an Account that NOVA does not currently have sufficient reliable information to answer.

Knowledge Gaps are a core part of MATILDA's Account Intelligence model.

MATILDA must not hide uncertainty or attempt to fill missing information with unsupported assumptions.

A good Knowledge Gap makes uncertainty explicit and actionable.

Example:

> Who owns the Data Platform initiative?

Knowledge Gaps are NOT a separate top-level application module.

They are created and surfaced contextually throughout MATILDA and managed collectively under:

Customer Intelligence → Knowledge Gaps

---

# 1. Core principle

MATILDA should help distinguish between:

- what we know

- what we think we know

- what we believe but need to validate

- what we do not know

Unknown information is useful information.

A Knowledge Gap is particularly important when resolving it could affect:

- Account understanding

- Account Plan

- Goals

- Initiatives

- Relationships

- Opportunities

- Account Review

- customer decisions

- commercial decisions

Knowledge Gaps should therefore be prioritised based on decision relevance, not simply age or number.

---

# 2. Knowledge Gaps are not a separate main navigation module

Do NOT create a top-level "Knowledge Map" or "Knowledge Gaps" module in V1.

The logic should exist in the MATILDA domain model, while the user experiences Knowledge Gaps in the context where they matter.

The Knowledge Gap collection is available under:

Customer Intelligence

→ Knowledge Gaps

This is the main management view for reviewing all open gaps for an Account.

---

# 3. Where Knowledge Gaps can be created

Knowledge Gaps should be creatable from multiple contexts.

The user should not need to navigate to Customer Intelligence before registering a missing piece of knowledge.

Support four primary creation paths.

## A. Manual creation

Customer Intelligence

→ Add Intelligence

→ Knowledge Gap

Use when the Account team already knows that important information is missing.

Example:

> Who owns investment decisions for the Data Platform programme?

---

## B. Contextual creation

The user may create a Knowledge Gap directly from:

- Account Overview

- Customer Intelligence / Insight

- Account Plan

- Relationship

- Opportunity

- Account Review

MATILDA should automatically capture the context.

Example:

The user is viewing:

Account Plan

→ Initiative

→ "Develop Data Platform Position"

The user selects:

"Add Knowledge Gap"

and enters:

> Is funding approved for the programme?

MATILDA automatically links the new Knowledge Gap to:

- Account

- Initiative

- relevant Goal where available

- related Insights where available

Avoid requiring users to manually recreate contextual links.

---

## C. MATILDA-generated suggestion

MATILDA should proactively identify potential Knowledge Gaps when analysing information.

Example:

A new Observation states:

> The customer is establishing a common AI governance model.

MATILDA may suggest:

1. Who owns the initiative?

2. Has the programme been formally approved?

3. Which business units are included?

4. What is the expected timeline?

These remain suggestions.

The user can:

- Accept

- Edit

- Reject

MATILDA must not create large numbers of low-value Knowledge Gaps automatically.

Prioritise questions that could materially affect understanding, decisions or Actions.

---

## D. Account Review

An Account Review may expose uncertainty that should become a Knowledge Gap.

Example:

Decision:

> Prioritise development of NOVA's AI position.

MATILDA may identify:

> We do not yet know which AI use cases have the highest customer priority.

The Account team can convert this into a Knowledge Gap directly from the Review.

---

# 4. Manual creation experience

Creating a Knowledge Gap should be extremely lightweight.

Minimum form:

## What do we need to know?

Required.

Example:

> Who owns the Data Platform initiative?

## Domain

Required or suggested automatically. Uses the same seven Intelligence Domains as the rest of
Customer Intelligence (`customer-intelligence.md` §4) — not a separate Knowledge-Gap-only
taxonomy, so a gap and the Insights around it are classified consistently. `Partners &
Competition` was added to the shared set specifically because this module needed it; see
`data-model.md` "intelligence_domain".

## Importance

Suggested values:

- Critical

- High

- Medium

- Low

MATILDA may suggest importance based on context.

## Why does it matter?

Optional.

Example:

> Ownership must be understood before we invest further in the Data Platform Initiative.

## Owner

Optional at creation, but recommended for High and Critical gaps.

## Target date

Optional.

When created contextually, related entities should normally be populated automatically.

---

# 5. Data model

Suggested V1 KnowledgeGap entity:

KnowledgeGap

- id

- account_id

- question

- domain

- why_it_matters

- importance

- status

- creation_type

- accepted

- owner_id

- target_date

- created_at

- created_by

- resolved_at

- resolved_by

- resolution

Relationships:

- related_insight_id (the Insight this gap is about, if any — a single, specific link, not a generic many-to-many)

- answered_by_insight_id (the Insight that answered it, once `status = answered`)

- related_goal_ids

- related_initiative_ids

- related_relationship_ids

- related_opportunity_ids

- related_review_ids

- related_action_ids

Each `related_*_ids` is a many-to-many link table (`knowledge_gap_goals`,
`knowledge_gap_initiatives`, `knowledge_gap_relationships`, `knowledge_gap_opportunities`,
`knowledge_gap_reviews`, `knowledge_gap_actions`) — see `data-model.md` "Knowledge Gap" §Links.

---

# 6. Enum values

## domain

Shared with the rest of Customer Intelligence — `data-model.md` "intelligence_domain" (seven
values, including `partners_competition`, added for this module). Not a separate
Knowledge-Gap-only `area` enum.

## importance

- critical

- high

- medium

- low

## status

Shared with the rest of MATILDA — `data-model.md` "knowledge_gap_status":

- open

- investigating

- answered

- closed_unanswerable

No separate `partially_resolved` or `no_longer_relevant` value: `closed_unanswerable` already
covers "we tried and could not get a reliable answer." Avoid excessive workflow states.

## creation_type

- human_manual

- human_contextual

- matilda_suggested

- account_review

This should make it possible to distinguish human-created and machine-suggested gaps.

---

# 7. Knowledge Gap vs Action

A Knowledge Gap and an Action are different concepts.

Knowledge Gap:

> Who owns the Data Platform initiative?

Action:

> Ask the Platform Lead about programme ownership during Thursday's meeting.

The Knowledge Gap describes missing knowledge.

The Action describes how NOVA intends to obtain the knowledge.

Model these as separate entities with a relationship between them.

The preferred learning loop is:

Knowledge Gap

→ Action

→ Customer interaction / research

→ Insight

→ Knowledge Gap resolved

Do not mark an Action as completing the Knowledge Gap automatically.

The Action may fail to produce a reliable answer.

---

# 8. Resolving Knowledge Gaps

A Knowledge Gap should normally be resolved through new Customer Intelligence.

Example:

Open Knowledge Gap:

> Who owns the Data Platform initiative?

New Observation:

> The customer confirmed during the meeting that Group Technology owns the initiative.

MATILDA should detect the possible relationship and suggest:

"This new Insight may resolve the Knowledge Gap:

Who owns the Data Platform initiative?"

The user may:

- Answer (status becomes `answered`, linked to the new Insight)

- Keep Open or Investigating

When resolving, preserve:

- resolution date

- resolver

- related Insight(s)

- Source(s)

- short resolution summary

Do not delete the Knowledge Gap.

Resolved gaps form part of the learning history of the Account.

---

# 9. MATILDA resolution assistance

MATILDA should help the Account team close important gaps.

For an open Knowledge Gap, MATILDA may recommend one of four paths.

## Public research

Example:

> Search customer strategy, corporate website or recent leadership communications.

MATILDA may attempt this automatically when appropriate.

## Existing Customer Intelligence

Example:

> Relevant information may already exist in uploaded Sources or existing Insights.

MATILDA should search existing Account Intelligence before asking the user to collect duplicate information.

## Internal NOVA knowledge

Example:

> Recent project or Account team information may contain relevant knowledge.

Where integrations and permissions support it, MATILDA may search available internal sources.

## Customer validation

Example:

> This information cannot be reliably established from available Sources. Validate directly with the customer.

This is an acceptable and valuable MATILDA result.

MATILDA must prefer "unknown" over an unsupported answer.

---

# 10. Collective management view

All Knowledge Gaps should be visible under:

Customer Intelligence

→ Knowledge Gaps

Example view:

OPEN KNOWLEDGE GAPS

12 open

4 High/Critical

3 overdue

Columns:

- Question

- Domain

- Related to

- Importance

- Owner

- Target date

- Status

Example:

| Question | Domain | Related to | Importance | Owner | Status |

| --- | --- | --- | --- | --- | --- |

| Who owns the Data Platform initiative? | Organisation & Leadership | Initiative | Critical | Morten | Investigating |

| Is funding approved? | Strategy & Priorities | Opportunity | High | Anna | Open |

| Which AI use cases matter most? | Technology & Digital Agenda | Account Plan | High | Erik | Open |

| Which partner leads Data Architecture? | Partners & Competition | Initiative | Medium | Kari | Open |

Available actions:

- Open

- Edit

- Assign

- Create Action

- Add evidence

- Answer

- Close as unanswerable

---

# 11. Account Overview integration

Knowledge Gaps should be surfaced selectively on Account Overview.

Do NOT show every gap.

Show:

- number of Critical/High Knowledge Gaps

- the most strategically important gaps

- Account Landscape areas affected

- important gaps affecting the Account Plan

Example:

KNOWLEDGE GAPS

4 important gaps require attention

1. Who owns the Data Platform initiative?

   Critical · Organization & Governance

2. Is Data Platform funding approved?

   High · Organization & Governance

3. Which AI priorities matter most?

   High · Technology & Digital

View all →

---

# 12. Account Landscape integration

There is no separate Knowledge Map page in V1.

Full domain coverage — current understanding, recent changes, freshness — already lives on the
Customer Intelligence Overview's Domain Status table (`customer-intelligence.md` §5.1), across
all seven Intelligence Domains. Account Overview does not repeat that computation.

Instead, Account Overview shows a **lighter, gap-focused** breakdown: open Knowledge Gap counts
across the same seven domains, plus the most important individual gaps (already specified in
§11 above). This keeps "capture once, reuse everywhere" — one place computes domain
understanding, Account Overview just surfaces where the open gaps are.

Example:

Technology & Digital Agenda: 2 open

Organisation & Leadership: 2 open

Strategy & Priorities: 1 open

Company & Business: 1 open

(other domains: 0 open)

Top gaps:

- Who owns the platform decision? — Critical

- Is funding available or planned? — Critical

---

# 13. Account Plan integration

Knowledge Gaps should appear where they affect strategy.

Example:

Initiative:

Develop Data Platform Position

MATILDA:

"2 unresolved Knowledge Gaps may affect this Initiative."

- Who owns the programme?

- Is funding approved?

The Account Plan can create new gaps but should not store duplicate copies.

The KnowledgeGap entity remains the single source of truth.

---

# 14. Opportunity integration

Missing Opportunity qualification information should be able to generate Knowledge Gaps.

Example:

Decision maker: UNKNOWN

MATILDA suggestion:

> Who is the final decision maker for this Opportunity?

Budget: UNKNOWN

MATILDA suggestion:

> Is funding allocated and who owns the budget?

Do not automatically create every empty Opportunity field as a Knowledge Gap.

Only create or suggest gaps where the missing information is materially relevant to qualification or next decisions.

---

# 15. Relationship integration

Knowledge Gaps may relate to customer stakeholders.

Examples:

> Does the VP Digital sponsor the programme?

> Who influences the CIO's decision?

> Who owns the commercial decision?

These should link to the relevant Relationship where known.

Do not convert Relationship assumptions into Facts without evidence.

---

# 16. Account Review integration

Account Review should explicitly surface strategically important unresolved gaps.

Possible Review section:

KNOWLEDGE RISK

Three important questions remain unresolved:

1. Programme ownership

2. Funding

3. Decision process

MATILDA should explain which Goals, Initiatives or Opportunities depend on these answers.

The Account team may:

- assign investigation

- create Actions

- change priority

- accept uncertainty

- create new gaps

- resolve existing gaps based on Review evidence

---

# 17. Prioritisation logic

Knowledge Gaps should not be prioritised simply by age.

Priority should consider:

- importance of the underlying question

- relevance to active Account Goals

- relevance to priority Initiatives

- relevance to active Opportunities

- decision dependency

- commercial impact

- strategic impact

- approaching customer event or decision

- age / overdue status

Conceptually:

Priority =

Importance

× Strategic relevance

× Decision dependency

× Urgency

This does not need to become a visible numeric score in V1.

Prefer understandable labels:

CRITICAL

HIGH

MEDIUM

LOW

MATILDA should be able to explain why a gap is High or Critical.

---

# 18. Avoid Knowledge Gap inflation

MATILDA should not generate dozens of questions simply because information is incomplete.

A Knowledge Gap belongs in MATILDA when answering it could materially improve:

- understanding

- prioritisation

- a decision

- an Action

- Opportunity qualification

- Account Plan quality

Before suggesting a Knowledge Gap, MATILDA should effectively ask:

> Would knowing the answer potentially change what the Account team thinks, decides or does?

If not, do not create the gap.

---

# 19. Human and AI responsibility

MATILDA may:

- detect uncertainty

- propose Knowledge Gaps

- search existing Sources

- suggest ways to resolve a gap

- identify related Insights

- suggest that new evidence resolves a gap

- prioritise gaps

- surface gaps contextually

Humans remain responsible for:

- accepting important AI-generated gaps

- interpreting customer context

- assigning owners

- deciding when evidence is sufficient

- confirming resolution where material

- deciding whether uncertainty is acceptable

MATILDA augments Account Intelligence. It does not manufacture certainty.

---

# 20. UX principle

The user should register a Knowledge Gap where the gap is discovered.

MATILDA handles:

- classification

- Account linkage

- contextual relationships

- prioritisation suggestions

- consolidated management

The user should not need to understand the full underlying Knowledge Gap data model.

The experience should feel like:

"I just realised we don't know this."

→ Add Knowledge Gap

rather than:

"I need to go to the Knowledge Management module and create a record."

---

# 21. V1 acceptance criteria

The V1 Knowledge Gap implementation is successful when:

1. A user can manually create a Knowledge Gap in Customer Intelligence.

2. A user can create a Knowledge Gap contextually from relevant MATILDA views.

3. MATILDA can propose a Knowledge Gap from an Insight.

4. Account Review can create Knowledge Gaps.

5. Every gap belongs to an Account.

6. Gaps can link to Goals, Initiatives, Relationships, Opportunities, Reviews and Insights.

7. A gap can have an owner, importance, target date and status.

8. A gap can create or link to an Action.

9. An Action does not automatically resolve a gap.

10. A new Insight can be proposed as resolution evidence.

11. A human can resolve or partially resolve a gap.

12. Resolution history is retained.

13. Important gaps appear contextually on Account Overview.

14. Gaps affecting Account Plan or Opportunities are visible there.

15. All gaps can be managed from Customer Intelligence → Knowledge Gaps.

16. MATILDA can suggest how a gap might be resolved.

17. MATILDA does not invent an answer when available evidence is insufficient.

---

# 22. Final design rule

Knowledge Gaps are not primarily records to maintain.

They represent the gap between:

WHAT THE ACCOUNT TEAM NEEDS TO UNDERSTAND

and

WHAT THE ACCOUNT TEAM CAN CURRENTLY SUPPORT WITH RELIABLE EVIDENCE.

The core loop is:

Insight

→ uncertainty detected

→ Knowledge Gap

→ investigation / Action

→ new Source

→ new Insight

→ human validation

→ Knowledge Gap resolved

→ improved Account understanding

This learning loop is a core part of MATILDA.