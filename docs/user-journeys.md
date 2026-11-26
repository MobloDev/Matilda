# MATILDA User Journeys

## Purpose

This document defines the expected prototype workflows. Each journey uses the canonical Nordic Horizon Group scenario from `demo-scenario.md` and separates MATILDA's role from human accountability.

## Primary roles

- **Account Team Contributor** — captures customer information and completes assigned Actions.
- **Account Manager** — accountable for Account relevance, priorities, and governance.
- **Technical Account Manager** — contributes technical context and capability links.
- **Opportunity Owner** — develops and qualifies a potential commercial Opportunity.
- **Review Participant / Leader** — challenges the model and makes human Decisions.
- **MATILDA** — proposes structure, links, gaps, summaries, and Actions.

One person may have several roles in the prototype.

## Journey principles

Every journey should:

1. start from a clear user intent;
2. minimise required input;
3. show relevant existing context;
4. distinguish user-provided content from AI proposals;
5. expose Sources, uncertainty, and missing information;
6. require human approval for material changes;
7. produce reusable structured data; and
8. make the next meaningful Action obvious.

## Journey 1 — Add a customer Observation

### User intent

Record useful information immediately after a customer interaction.

### Preconditions

- the user has selected an Account;
- the Account exists; and
- the user knows what was observed but not necessarily how it should be classified.

### Main flow

1. User selects **Add Observation**.
2. System asks for a short statement and Source context.
3. User enters the Observation in natural language.
4. User optionally adds meeting date, Source link, topic, or importance.
5. MATILDA proposes information type, topic, importance, related Insights, Knowledge Gaps, and possible Actions.
6. UI shows what came from the user and what came from MATILDA.
7. User accepts, edits, or rejects each material proposal.
8. System stores the approved Observation and links.
9. System shows the immediate impact and next validation owner.

### Alternate flows

- If no Account is selected, ask the user to choose one before saving.
- If a similar Insight exists, propose linking or superseding; do not silently merge.
- If the content contains several claims, propose splitting it into atomic Insights.
- If Source details are missing, allow save as a user-origin Observation and create a Source/validation gap.

### Acceptance criteria

- capture can be completed in under one minute;
- the original user text is preserved;
- AI-generated fields are identifiable;
- an Observation is not presented as Fact; and
- no Opportunity is created automatically.

## Journey 2 — Validate new Intelligence

### User intent

Decide whether a new Observation, Hypothesis, or AI Inference should become validated Account knowledge.

### Preconditions

- an Insight has `new` or `needs_validation` status; and
- the user can inspect available evidence.

### Main flow

1. User opens the validation queue or Insight detail.
2. UI shows statement, type, Source, date, confidence, related items, and MATILDA reasoning.
3. User inspects the original Source where available.
4. User chooses one of:
   - validate as the current type;
   - edit and validate;
   - change type with justification;
   - request more information;
   - supersede with a corrected Insight; or
   - reject/delete a pure proposal before validation.
5. System records validator, timestamp, and material changes.
6. System recalculates affected plan, Review, and qualification views.

### Rules

- Fact conversion requires evidence or explicit human rationale.
- AI Inference never becomes Fact automatically.
- Editing must not erase provenance.
- A validated Insight can later become stale or superseded.

### Acceptance criteria

- validation actor and date are recorded;
- evidence is one click or one clear action away;
- material changes are visible in history; and
- downstream impacts are proposed or recalculated without duplicate entry.

## Journey 3 — Resolve a Knowledge Gap

### User intent

Turn an important unknown into validated learning.

### Preconditions

- a Knowledge Gap exists; and
- the gap is assigned or relevant to the user.

### Main flow

1. User opens the Knowledge Gap.
2. UI shows why the question matters and linked entities.
3. User records new evidence or links an existing Source/Insight.
4. MATILDA proposes a resolution and downstream impacts.
5. User edits and confirms the resolution.
6. System marks the gap resolved and records who/when.
7. System creates or links the resulting Insight.
8. Related Initiative or Opportunity views update.

### Alternate flow

If the answer remains partial, keep the gap open or investigating and create a narrower follow-up question.

### Acceptance criteria

- resolution is not just free text disconnected from the model;
- the resulting knowledge is reusable; and
- resolved gaps remain available as history.

## Journey 4 — Update the Account Plan

### User intent

Translate validated Account Intelligence into priorities and coordinated work.

### Preconditions

- relevant validated Insights exist; and
- the user is viewing the generated Account Plan.

### Main flow

1. User opens the Account Plan.
2. UI shows ambition, strategic understanding, Goals, Initiatives, Relationships, Actions, Opportunities, Knowledge Gaps, and risks.
3. MATILDA highlights a new or changed Insight and the plan elements it may affect.
4. MATILDA proposes one or more changes, for example:
   - increase Goal relevance;
   - create or edit an Initiative;
   - create a Knowledge Gap;
   - propose an Action; or
   - flag a relationship need.
5. User reviews reasoning, evidence, and missing information.
6. User accepts, edits, rejects, or defers each proposal.
7. System saves approved structured changes.
8. Plan view refreshes and records the change.

### Rules

- Account Plan is not saved as a duplicate document snapshot.
- A MATILDA recommendation is not a Decision.
- A proposed Action does not become a commitment without owner and due date approval.

### Acceptance criteria

- users can trace each proposed change to evidence;
- accepted changes update the underlying entities; and
- rejected proposals do not mutate validated knowledge.

## Journey 5 — Complete an Action and capture the outcome

### User intent

Record what happened and convert the result into Account learning.

### Preconditions

- an Action is assigned and in progress or planned.

### Main flow

1. User opens the Action.
2. User marks it complete and records an outcome.
3. MATILDA analyses the outcome and proposes:
   - a new Insight;
   - a changed Opportunity qualification dimension;
   - a resolved or new Knowledge Gap;
   - a changed Initiative; or
   - a follow-up Action.
4. User reviews evidence and accepts, edits, or rejects proposals.
5. System saves the outcome and approved learning.
6. Account Overview, Plan, Review, and Opportunity views refresh.

### Acceptance criteria

- completed Actions require an outcome;
- outcome learning is not hidden in task history; and
- the user can see where accepted learning was reused.

## Journey 6 — Prepare an Account Review

### User intent

Prepare a decision-oriented Review without manually assembling a presentation.

### Preconditions

- an Account and review period are selected;
- sufficient domain data exists; and
- at least one material change, risk, gap, or decision topic is available.

### Main flow

1. User selects **Prepare Account Review**.
2. System identifies changes since the previous Review.
3. MATILDA prepares sections for:
   - What changed;
   - What we learned;
   - Progress;
   - Risks;
   - Knowledge Gaps;
   - Opportunity changes;
   - Overdue Actions;
   - Decisions required; and
   - Recommended next Actions.
4. User inspects each section and opens underlying evidence.
5. User edits or challenges the generated narrative.
6. System stores the draft Review preparation without duplicating underlying records.
7. Review is moved to `in_review`.

### Rules

- Review content must be generated from the chosen period and current model.
- The interface should foreground changes and decisions, not all Account data.
- AI-prepared language remains editable and attributable.

### Acceptance criteria

- every material claim can be traced to domain records;
- the system clearly identifies the review period; and
- the draft can be regenerated without losing deliberate human edits unexpectedly.

## Journey 7 — Record Review Decisions

### User intent

Turn discussion into explicit, accountable Decisions and Actions.

### Preconditions

- a Review is in progress; and
- decision topics are visible.

### Main flow

1. Participants inspect a decision topic, recommendation, evidence, and gaps.
2. A responsible human records the Decision.
3. User adds rationale and links affected Goal, Initiative, Opportunity, or Insight.
4. The system proposes resulting Actions.
5. Human owners and due dates are confirmed.
6. Review is finalised by an accountable human.
7. Decisions and Actions appear in relevant views.

### Rules

Keep separate:

- MATILDA Recommendation: “Consider an exploratory workshop.”
- Human Decision: “Approve preparation of an exploratory workshop.”
- Action: “Prepare workshop proposition by the agreed date.”

### Acceptance criteria

- each Decision has a human approver and time;
- resulting Actions have human ownership; and
- finalisation does not create duplicate Account facts.

## Journey 8 — Develop an Initiative into an Opportunity

### User intent

Recognise when coordinated Account work has become a plausible commercial Opportunity.

### Preconditions

- an active Initiative exists;
- customer evidence indicates a possible need; and
- the team wants to evaluate commercial relevance.

### Main flow

1. User opens the Initiative.
2. MATILDA summarises relevant Insights, Sources, Relationships, and Knowledge Gaps.
3. MATILDA proposes a potential Opportunity and explains why.
4. User reviews customer need, business value, NOVA relevance, and missing qualification information.
5. User accepts, edits, or rejects the proposal.
6. If accepted, system creates a `potential` Opportunity linked to the Initiative and evidence.
7. System creates or links Knowledge Gaps for missing qualification dimensions.

### Rules

- original Observations remain original Observations.
- Creating an Opportunity does not mean it is qualified.
- The Initiative may continue even when no Opportunity is created.

### Acceptance criteria

- Opportunity origin and evidence are visible;
- human acceptance is required; and
- missing information becomes actionable Knowledge Gaps.

## Journey 9 — Qualify an Opportunity

### User intent

Make an evidence-based decision about whether the Opportunity is real and mature enough to qualify.

### Preconditions

- a potential or validating Opportunity exists.

### Main flow

1. User opens the qualification view.
2. System shows each dimension as Confirmed, Uncertain, Missing, or Not Applicable.
3. User opens evidence for confirmed dimensions.
4. MATILDA explains the strongest evidence and most material gaps.
5. User records new evidence or updates a dimension.
6. MATILDA recommends qualify, continue validating, restructure, or stop.
7. Human Opportunity owner decides.
8. System records decision, rationale, actor, and time.
9. Next customer commitment and Action are confirmed.

### Qualification dimensions

- customer need;
- business importance;
- sponsor;
- decision maker;
- decision process;
- funding path;
- timing;
- NOVA relevance;
- competition; and
- next customer commitment.

### Acceptance criteria

- the screen does not imply certainty from a simple score;
- critical missing dimensions can block qualification;
- stage change requires a human; and
- evidence and gaps remain visible after stage change.

## Journey 10 — Feed Opportunity learning back into the Account model

### User intent

Ensure that customer knowledge learned during Opportunity development benefits broader Account Management.

### Preconditions

- new evidence or an outcome exists in the Opportunity context.

### Main flow

1. User records new evidence, customer feedback, or Opportunity outcome.
2. MATILDA identifies reusable Account-level learning.
3. MATILDA proposes new or changed Insights and Knowledge Gaps.
4. User validates or edits the proposals.
5. Accepted learning updates Customer Intelligence.
6. Affected Goals, Initiatives, Relationships, and future Reviews reflect the update.

### Example

Opportunity learning: budget is not available until the next fiscal planning cycle.

Possible effects:

- new Fact about funding;
- later Opportunity timing;
- Initiative priority adjustment;
- resolved budget-status gap;
- new gap about approval requirements; and
- changed Review risk.

### Acceptance criteria

- learning is not trapped in Opportunity notes;
- provenance to the Opportunity interaction is preserved; and
- broader Account views update without manual copying.

## Cross-journey behaviours

### Notifications and work queues

The prototype may use simple in-product queues for validation, overdue Actions, Review preparation, and important stale Insights. Full notification infrastructure is out of scope unless explicitly requested.

### Empty states

Each empty state should explain:

- what the object means;
- why it matters;
- the minimum next step; and
- whether MATILDA can help.

### Error recovery

- Preserve user-entered text if AI processing fails.
- Allow retry without duplicate records.
- Explain when evidence or context is insufficient.
- Never hide a failed save behind a success-looking AI message.

### History

Users should be able to inspect material changes, validation, and decision ownership without requiring a production-grade audit console.

## End-to-end acceptance scenario

The prototype passes the main journey test when a user can:

1. capture the Nordic data platform Observation;
2. review and validate MATILDA proposals;
3. see new Knowledge Gaps;
4. update the Account Plan;
5. accept an Action;
6. prepare an Account Review;
7. record a human Decision;
8. develop a potential Opportunity;
9. assess qualification gaps;
10. add new customer evidence; and
11. see the learning return to Customer Intelligence.

The user should not need to re-enter the same information at any stage.
