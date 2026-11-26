# MATILDA Account Plan

## Purpose

The Account Plan describes how NOVA intends to develop an Account from its current position to a desired future position.

It connects live Customer Intelligence with strategic choices, relationship development, coordinated execution and commercial learning.

The Account Plan is not a static document. It is a structured and continuously updated view generated from MATILDA's living Account model.

> **Core principle:** The strategy is the combination of Ambition, Goals, selected Initiatives, Relationship Strategy, Actions, Assumptions and Risks. It should not be stored only as a large free-text field.

---

## 1. Questions the Account Plan must answer

The plan should make it easy to understand:

1. What is NOVA's ambition for the Account?
2. Where are the customer and NOVA today?
3. Where is the greatest realistic potential?
4. Which strategic choices has the Account team made?
5. Which relationships are required to execute the strategy?
6. What must happen during the next 90 days?
7. Which assumptions, Knowledge Gaps and Risks could change the plan?
8. What has changed since the plan was last reviewed?

---

## 2. Account Plan principles

### Living rather than static

The Account Plan should update as validated customer information changes. It should not depend on rebuilding a PowerPoint or Word document every quarter.

### Capture once, reuse everywhere

Validated Insights, Relationships, Goals, Initiatives, Actions and Opportunities should be reused from the Account model. The same information should not be copied manually into the plan.

### Choices rather than inventory

The Account Plan should show what NOVA has chosen to prioritise. It should not become a list of every possible activity or capability.

### Evidence before confidence

Strategic claims should be linked to relevant Insights and Sources. Observations, Hypotheses and AI Inferences must not be presented as Facts.

### Explicit uncertainty

The plan should show what the Account team does not know, what it assumes and what needs validation.

### Human ownership

MATILDA may identify changes, recommend updates and prepare drafts. The Account team validates the information and decides the strategy.

### Strategy connected to execution

Every active Initiative should support at least one Goal and have a clear owner, milestone and next Action.

---

## 3. Account Plan structure

The Account Plan consists of seven connected sections:

1. Our Ambition
2. Where We Are Today
3. Where We Could Go
4. Our Strategy
5. Relationship Strategy
6. Execution Plan
7. Assumptions, Knowledge Gaps and Risks

MATILDA should also provide a layer showing changes affecting the plan.

---

# 4. Our Ambition

## Purpose

Define the future position NOVA wants to achieve with the Account.

The ambition should describe a meaningful change in NOVA's role, position or value to the customer. It should be specific enough to guide priorities without becoming a list of numerical targets.

## Example

> Develop NOVA's position from a strong digital delivery partner in selected areas to a strategic technology and transformation partner across the Account.

## Suggested fields

| Field | Description |
|---|---|
| `account_ambition` | Concise description of the desired future position |
| `time_horizon` | Expected horizon, normally 12–36 months |
| `account_owner` | Person accountable for the overall plan |
| `last_reviewed_at` | Date the ambition was last reviewed |
| `review_due_at` | Date for the next formal review |
| `status` | Draft, Active, Needs Review or Retired |

---

## 4.1 Goals

Goals describe the outcomes NOVA wants to achieve. Goals are not activities.

### Example Goals

- Strengthen executive-level relationships.
- Expand NOVA's position across selected business areas.
- Establish NOVA in two new strategic capability areas.
- Protect and grow profitable existing business.
- Develop a small number of evidence-based strategic Opportunities.

### Suggested Goal fields

| Field | Description |
|---|---|
| `goal_id` | Unique identifier |
| `account_id` | Related Account |
| `title` | Short outcome statement |
| `description` | More complete explanation |
| `rationale` | Why the Goal matters |
| `owner` | Accountable person |
| `priority` | High, Medium or Low |
| `time_horizon` | Target period |
| `baseline` | Current position |
| `target` | Desired outcome |
| `success_criteria` | Observable evidence that the Goal has been achieved |
| `status` | Proposed, Active, At Risk, Achieved or Stopped |
| `progress_assessment` | Human assessment supported by evidence |

### Goal design rules

- The prototype should normally show **three to five active Goals** per Account.
- Each Goal should represent an outcome, not a task.
- Each active Goal should have at least one Initiative.
- Progress should be explained through evidence, not only a percentage.

---

# 5. Where We Are Today

## Purpose

Provide a concise, evidence-based understanding of the present situation.

This section should be generated primarily from validated Customer Intelligence rather than maintained as duplicated prose.

It should contain four views.

---

## 5.1 Customer Strategic Context

Summarise the customer developments most relevant to NOVA's Account strategy.

Include:

- strategic priorities
- important changes
- investment themes
- transformation programmes
- business or technology challenges
- changes in leadership, organisation or governance

### Example output

> The customer is consolidating digital capabilities and increasing focus on shared data, applied AI and common platforms. However, ownership and investment timing remain unclear in two of these areas.

Every material statement should link to the relevant Insights and Sources.

---

## 5.2 NOVA's Current Position

Describe NOVA's current role and relevance.

Include:

- current deliveries
- areas of recognised strength
- weak or fragmented positions
- how important NOVA is to the customer's goals
- how the customer appears to perceive NOVA
- delivery quality and current risks

### Example output

> NOVA has a strong delivery position and trusted operational relationships in selected areas, but limited executive coverage and uneven recognition of NOVA's broader capabilities.

---

## 5.3 Commercial Position

Provide a concise commercial view.

Include:

- current business and revenue where available
- profitability where available
- business that must be protected
- active Opportunities
- white-space areas
- major contract or procurement events
- concentration and renewal risk

The commercial view should not reduce the Account Plan to a pipeline report.

---

## 5.4 Relationship Position

Summarise whether NOVA has the relationships needed to execute the plan.

Include:

- strong sponsors
- operational champions
- decision makers
- influencers
- weak or missing relationships
- dependency on a single contact
- relationship coverage across active Initiatives

### Example MATILDA assessment

> Relationship coverage is strong at the operational level but insufficient for two of four priority Initiatives. Executive sponsorship is the most important gap.

---

# 6. Where We Could Go

## Purpose

Make the potential visible and identify where NOVA should consider investing.

This section should combine:

- customer priority
- size and strategic value of the potential
- NOVA capability fit
- NOVA's current position
- timing
- relationship access
- competitive position
- relevance across NOVA business areas

---

## 6.1 Growth and White-Space Map

A useful visual model is:

| Area | NOVA today | Customer priority | Potential | NOVA position | Timing | Recommended posture |
|---|---|---|---|---|---|---|
| Digital Experience | Strong | High | Medium | Strong | Now | Protect and expand |
| Applied AI | Emerging | High | High | Developing | Near term | Validate and build position |
| Data Platform | Limited | High | High | Weak | Emerging | Selective investment |
| Commerce | None | Low | Medium | Weak | Unclear | Monitor |
| Design | Strong | Medium | Medium | Strong | Now | Expand selectively |

Values in the prototype are illustrative. In production, each material assessment should be supported by Account Intelligence.

## White-space rules

- A capability gap is not automatically an Opportunity.
- High customer priority plus strong NOVA capability fit is still insufficient if timing, access or sponsorship are absent.
- MATILDA should show both upside and the conditions required to realise it.
- The Account team should explicitly choose which areas to pursue, monitor or reject.

---

# 7. Our Strategy

## Purpose

Translate the Ambition and current understanding into a small number of deliberate strategic choices.

The strategy should normally contain **three to five active Initiatives**. It should not include every possible idea.

---

## 7.1 Initiative structure

Each Initiative should answer:

- What change are we trying to create?
- Why does it matter?
- Which Goal does it support?
- Which customer evidence supports it?
- Which stakeholders matter?
- What must be true for it to succeed?
- What is the next meaningful milestone?

### Suggested fields

| Field | Description |
|---|---|
| `initiative_id` | Unique identifier |
| `account_id` | Related Account |
| `goal_ids` | Goals supported by the Initiative |
| `title` | Short strategic Initiative name |
| `description` | Desired change and scope |
| `rationale` | Why the Initiative matters |
| `owner` | Accountable person |
| `priority` | High, Medium or Low |
| `status` | Proposed, Active, On Hold, Completed or Stopped |
| `start_date` | Start date |
| `target_date` | Target date |
| `next_milestone` | Next meaningful outcome |
| `related_insights` | Evidence supporting the Initiative |
| `related_relationships` | Critical stakeholders |
| `related_opportunities` | Opportunities connected to the Initiative |
| `success_criteria` | Evidence of successful progress |

---

## 7.2 Example Initiatives

### Initiative 1: Strengthen Executive Engagement

**Why**

Limited executive coverage prevents NOVA from influencing strategic priorities.

**Desired change**

Move from primarily operational relationships to regular dialogue with relevant executive stakeholders.

**Related Goals**

- Strengthen executive-level relationships.
- Improve NOVA's strategic position.

**Critical Relationships**

- Chief Information Officer
- Vice President Digital
- Relevant business-area leaders

**Next milestone**

Complete an executive strategy discussion during the next quarter.

---

### Initiative 2: Establish an Applied AI Position

**Why**

Applied AI is becoming strategically important to the customer, while NOVA's current position is fragmented.

**Desired change**

NOVA becomes recognised as a relevant strategic and delivery partner for applied AI.

**Approach**

- consolidate relevant NOVA capabilities and references
- validate the customer's AI priorities
- develop customer-specific Hypotheses
- identify a credible first engagement

---

### Initiative 3: Develop the Data Platform Position

**Why**

Recent Observations indicate possible demand for more common data capabilities, but ownership, funding and timing are uncertain.

**Desired change**

Move from weak visibility to a validated position with access to the relevant sponsor and buying process.

**Important condition**

The Initiative should not become a qualified Opportunity until the customer need and buying context are sufficiently validated.

---

# 8. Relationship Strategy

## Purpose

Identify and develop the customer relationships required to execute the Account strategy.

The Account Plan should not duplicate the full Relationship Map. It should show only strategically important stakeholders and gaps.

## Suggested view

| Stakeholder | Customer role | Strategic role | Current position | Desired position | NOVA owner | Related Initiatives | Planned approach |
|---|---|---|---|---|---|---|---|
| CIO | Executive leader | Decision maker | Weak | Strong | Account Manager | 1, 2 | Executive dialogue |
| VP Digital | Digital leader | Sponsor | Developing | Strong | Named owner | 1, 3 | Quarterly engagement |
| Platform Lead | Technology lead | Influencer | Strong | Maintain | Technical Account Manager | 3 | Delivery and innovation dialogue |

## Relationship Strategy rules

- Every priority Initiative should identify the Relationships required for success.
- Relationship strength should not be based only on meeting frequency.
- MATILDA should identify Initiatives without sufficient sponsor or decision-maker coverage.
- The plan should show concentration risk when NOVA depends on one stakeholder.
- Each critical Relationship should have one named NOVA owner.

### Example MATILDA assessment

> Two of four strategic Initiatives currently lack sufficient executive sponsorship. The most important gap is access to the decision owner for the emerging data platform agenda.

---

# 9. Execution Plan

## Purpose

Translate strategic Initiatives into coordinated short-term execution.

The Account Plan should emphasise the **next 90 days**. Detailed task management may live on the Actions page.

## Recommended structure

For each priority Initiative, show:

- next milestone
- three to five priority Actions
- owner
- due date
- status
- expected outcome
- dependency or blocker

## Example

### Initiative: Executive Engagement

| Priority Action | Owner | Due date | Status | Expected outcome |
|---|---|---|---|---|
| Develop executive perspective on digital transformation | Account Manager | 12 Dec | In progress | Clear discussion point for executive meeting |
| Secure meeting with VP Digital | Relationship owner | 20 Dec | Planned | Confirmed executive dialogue |
| Brief Account team | Initiative owner | 4 Jan | Planned | Common message and coordinated follow-up |

### Initiative: Applied AI Position

| Priority Action | Owner | Due date | Status | Expected outcome |
|---|---|---|---|---|
| Consolidate relevant NOVA AI references | AI lead | 15 Dec | Planned | Reusable customer evidence |
| Validate customer AI priorities | Account Manager | 18 Dec | Planned | Confirmed needs and Knowledge Gaps |
| Develop customer-specific Hypothesis | Initiative team | 15 Jan | Proposed | Testable point of view |

## Execution rules

- An Action must have an owner and due date before it is considered committed.
- MATILDA-generated Actions remain suggestions until a human accepts them.
- Completed Actions should record an outcome, not only a completed status.
- Significant outcomes should be able to create new Insights or resolve Knowledge Gaps.

---

# 10. Assumptions, Knowledge Gaps and Risks

## Purpose

Make uncertainty and potential failure points explicit.

A strong Account Plan should not look more certain than the evidence allows.

---

## 10.1 Assumptions

Assumptions describe conditions the strategy currently depends on.

Example:

> We assume AI governance will become a strategic investment area during the next planning period.

Each assumption should have:

- statement
- related Goal or Initiative
- supporting evidence
- confidence
- validation owner
- validation date
- current status

---

## 10.2 Knowledge Gaps

Knowledge Gaps should be expressed as answerable questions.

Examples:

- Who owns the data platform decision?
- Is funding expected in the current planning period?
- Which business areas are included?
- What role do incumbent technology partners have?

Each high-priority Knowledge Gap should have:

- importance
- owner
- related Initiative or Opportunity
- target resolution date
- planned validation method

---

## 10.3 Risks

Risks describe events or conditions that could prevent the strategy from succeeding.

Examples:

- An incumbent global partner may establish executive access before NOVA.
- Delivery issues could weaken NOVA's credibility.
- The Account team may pursue too many areas simultaneously.
- A strategic Initiative may lack a real customer sponsor.

Each material Risk should include:

- description
- likelihood
- impact
- affected Goals or Initiatives
- mitigation
- owner
- review date

---

## 10.4 Validation priorities

MATILDA should recommend what the team should validate next.

Example:

> Validate the customer's willingness to engage NOVA before formal procurement. This assumption affects both the Data Platform Initiative and the emerging Opportunity.

---

# 11. MATILDA change layer

## Purpose

Continuously identify new information that may affect the plan.

The Account Plan should display:

- date last reviewed
- number of relevant changes since review
- affected Goals or Initiatives
- proposed updates
- supporting evidence
- required human decision

## Example

### Three changes may affect this plan

#### Goal may require review

A newly published customer strategy reduces emphasis on the area supporting Goal 3.

**MATILDA proposal:** Review Goal priority.

#### New strategic signal

Three recent Insights support considering Data Platform as a strategic Initiative.

**MATILDA proposal:** Create a draft Initiative for human review.

#### Relationship risk

Initiative 2 depends on an executive stakeholder with whom NOVA has no active relationship.

**MATILDA proposal:** Assign a Relationship owner and create a validation Action.

## Available human responses

- Accept update
- Edit suggestion
- Reject suggestion
- Request more evidence
- Defer to Account Review

MATILDA must not silently change validated Account strategy.

### V1 implementation scope

The prototype's "MATILDA Changes" section on the Account Plan page implements the signal this
chapter describes as any Insight flagged `affects_account_plan` (data-model.md "Insight"), and
offers four of the five responses above:

- **Accept update** → "Accept & Link": link the Insight to the Goal or Initiative it affects.
  The link itself is the durable record of acceptance.
- **Edit suggestion**: update the Insight's statement and/or "so what for NOVA" text. Only
  changes the text — it does not also accept, link, or dismiss, since editing and deciding are
  different responses.
- **Request more evidence**: creates a Knowledge Gap, linked back to the Insight, capturing
  what's missing. The Insight stays in the change queue (not accepted, not dismissed) until the
  Gap is answered; the card shows the requested evidence and its status.
- **Reject suggestion** → "Dismiss": acknowledge the Insight without linking it to anything.

Rejecting the Insight outright reuses the existing action from the Customer Intelligence
Insights page rather than a separate control here — the Insight is the same record either way.
"Defer to Account Review" is not built yet — there is no notion of queuing an item for a
specific future Review. There is also no richer change-type categorisation (goal-review-needed
vs. new-strategic-signal vs. relationship-risk, per the examples above) — every flagged Insight
is presented the same way for now.

---

# 12. Suggested page structure

```text
ACCOUNT PLAN
Account name · Owner · Last reviewed · Next review

OUR AMBITION
Desired future position
Goal 1 · Goal 2 · Goal 3

WHERE WE ARE TODAY                 WHERE WE COULD GO
Customer strategic context        Growth and white-space map
NOVA's current position           Areas to pursue, monitor or reject
Commercial position
Relationship position

OUR STRATEGY
Initiative 1 · Initiative 2 · Initiative 3
Why · Desired change · Owner · Next milestone

RELATIONSHIP STRATEGY              NEXT 90 DAYS
Critical stakeholders             Priority Actions
Coverage gaps                     Owners and dates

WHAT ARE WE BETTING ON?
Assumptions · Knowledge Gaps · Risks · Validation priorities

MATILDA CHANGES
Changes since last review · Proposed updates · Evidence
```

---

# 13. Account Plan modes for KAM and TAM

MATILDA should use the same domain model for KAM and TAM Accounts, but the emphasis should differ.

## KAM Account Plan

A KAM plan should focus on protecting, deepening and developing an existing strategic position.

Emphasise:

- long-term Account Ambition
- protection of important existing business
- executive relationships
- cross-business-area development
- strategic Initiatives
- delivery quality and risk
- long-term customer value
- coordinated expansion

## TAM Account Plan

A TAM plan should focus on qualifying the Account and winning a stronger position.

Emphasise:

- attractiveness and potential
- entry points
- white space
- relationship gaps
- testable Hypotheses
- active pursuit Initiatives
- concrete Opportunities
- next 90-day Actions
- evidence that the Account should remain prioritised

The central TAM question is:

> How can NOVA win a sufficiently strong and valuable position with this Account?

---

# 14. Plan health checks

MATILDA should be able to identify structural weaknesses in the plan.

Possible checks:

- Goal without an active Initiative
- Initiative without a related Goal
- Initiative without an owner
- Initiative without a next milestone
- Initiative without supporting evidence
- priority Initiative without critical Relationships
- Action without owner or due date
- overdue high-priority Action
- high-impact Knowledge Gap without owner
- stale Insight supporting an important strategic choice
- Opportunity presented as qualified despite major missing evidence
- too many simultaneous priority Initiatives

These checks should produce recommendations, not automatic changes.

---

# 15. What should not be stored as duplicated plan content

The Account Plan should reuse rather than duplicate:

- Insights
- Sources
- Relationships
- Opportunities
- Actions
- Knowledge Gaps
- Account Review decisions

MATILDA may generate summary text from these entities, but the structured entities remain the system of record.

A generated strategy narrative is an output from the model. It is not the model itself.

---

# 16. Prototype acceptance criteria

The Account Plan prototype is successful when a user can:

1. Understand NOVA's Ambition for the Account.
2. See three to five outcome-based Goals.
3. Understand the customer's strategic context and NOVA's current position.
4. See a visual Growth and White-Space Map.
5. Understand which areas NOVA has chosen to pursue, monitor or reject.
6. See three to five strategic Initiatives connected to Goals.
7. Identify the critical Relationships and coverage gaps.
8. See priority Actions for the next 90 days.
9. Inspect Assumptions, Knowledge Gaps and Risks.
10. See what has changed since the plan was last reviewed.
11. Review MATILDA's proposed updates and supporting evidence.
12. Accept, edit or reject suggested changes.
13. Navigate from plan elements to underlying Insights and Sources.
14. Distinguish Account strategy from detailed task management and CRM pipeline reporting.

---

# 17. North-star test

The Account Plan should enable the Account team to state, in simple language:

- This is where we want to take the Account.
- This is where we are today.
- These are the opportunities we have deliberately chosen to pursue.
- These are the Relationships we need.
- These are the next Actions.
- These are the assumptions and uncertainties behind the strategy.
- This is what has changed and how the plan should respond.

If the Account Plan cannot support these statements, it is either too shallow, too fragmented or too operational.
