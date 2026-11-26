# MATILDA

## Project definition

MATILDA stands for **Machine Augmented Transformation Intelligence Learning & Decision Assistant**.

MATILDA is NOVA's prototype AI-native Account Management Operating System. It is a living account intelligence and decision system that helps an account team understand strategic customers, coordinate account development, make better decisions, and learn from interactions and outcomes.

MATILDA is not primarily a CRM, dashboard, reporting tool, document repository, task manager, or chatbot. It augments Account Management; it does not replace human ownership of relationships or commercial decisions.

## Prototype objective

The prototype must make one coherent lifecycle tangible:

```text
Customer information
→ structured intelligence
→ understanding
→ plan
→ action
→ Account Review
→ opportunity development
→ outcome
→ learning
→ improved customer understanding
```

The prototype succeeds when an internal stakeholder can use it and understand how one living Account model connects Customer Intelligence, Account Planning, execution, relationships, Account Review, Opportunity development, and continuous learning.

Prioritise conceptual clarity and a reliable end-to-end demonstration over enterprise completeness.

## Core hypothesis

Information about an Account should be captured once and reused throughout the Account Management lifecycle.

One new customer Observation may:

1. improve Account understanding;
2. expose a Knowledge Gap;
3. affect a Goal;
4. create or change an Initiative;
5. lead to an Action;
6. surface in an Account Review;
7. eventually contribute to an Opportunity; and
8. produce learning that updates the Account model.

Never require users to copy the same information manually between separate documents or workflows.

## North Star

MATILDA should always help the Account team answer:

- What do we know?
- What has changed?
- What do we not know?
- What does it mean?
- What should we decide?
- What should we do next?
- What did we learn?

## Governing product principles

### 1. Living Account Model

Design around a continuously evolving representation of the Account, not static Account documents.

### 2. Capture once, reuse everywhere

Capture information once and reuse it across Customer Intelligence, Account Plans, Reviews, Initiatives, Actions, and Opportunities.

### 3. Source before assertion

Important customer intelligence should be traceable to its origin. Make “Why do we believe this?” easy to answer.

### 4. Expose uncertainty

Show what is known, observed, hypothesised, inferred by AI, stale, or unknown. Unknown information is strategically useful; do not hide it.

### 5. Decisions over reporting

Reviews and overview screens should emphasise change, implications, risk, decisions, and next Actions—not reproduce status information.

### 6. Easy contribution

A team member should be able to record a useful customer Observation in less than one minute without understanding the domain model.

### 7. AI works in the background

Normal workflows must not require prompting skills. A contextual assistant may complement, but never replace, structured product interactions.

### 8. Human in control

AI proposes. Humans validate, prioritise, commit, and decide.

### 9. Intelligence must lead somewhere

Customer knowledge should improve understanding, priorities, decisions, Actions, or commercial outcomes. Avoid a passive knowledge repository.

### 10. Continuous learning

Actions and Opportunities produce outcomes and evidence. Feed that learning back into Account Intelligence.

## Core domain model

All core entities ultimately belong to an `Account`.

- `Account` — the customer and root of the living model.
- `Insight` — one atomic piece of knowledge about the Account.
- `Source` — the evidence or origin supporting an Insight.
- `KnowledgeGap` — an important unanswered question.
- `Relationship` — NOVA's relationship with a relevant customer stakeholder.
- `Goal` — a strategic outcome NOVA wants to achieve with the Account.
- `Initiative` — coordinated work intended to move the Account toward a Goal.
- `Action` — a concrete next step with an owner, status, and due date.
- `Opportunity` — a potential commercial outcome, distinct from an Initiative.
- `AccountReview` — a periodic decision view generated primarily from the existing model.

Use this conceptual hierarchy while allowing meaningful cross-links:

```text
Account
├── Insights
│   ├── Sources
│   └── Knowledge Gaps
├── Relationships
├── Goals
│   └── Initiatives
│       ├── Actions
│       └── Opportunities
└── Account Reviews
```

Do not introduce a new domain entity merely for completeness. Add one only when it clarifies behaviour that cannot be represented cleanly with the existing model.

Detailed fields, enums, relationships, and validation rules are defined in [`docs/data-model.md`](docs/data-model.md).

## Knowledge and AI rules

The system must explicitly distinguish:

- `FACT` — information supported by sufficiently reliable evidence.
- `OBSERVATION` — something reported or observed but not necessarily independently confirmed.
- `HYPOTHESIS` — an interpretation that requires validation.
- `AI_INFERENCE` — a conclusion, connection, or recommendation generated by MATILDA.
- `DECISION` — a conclusion or commitment explicitly approved by a human.

Never silently convert an Observation, Hypothesis, or AI Inference into a Fact. Conversion requires evidence or explicit human validation.

Important Insights must show, where practical:

- information type;
- supporting Source;
- observed date;
- confidence;
- validation status; and
- freshness or staleness.

Important AI recommendations must make four things inspectable:

1. **What** MATILDA suggests.
2. **Why** it suggests it.
3. **Evidence** supporting the suggestion.
4. **Missing** or uncertain information.

MATILDA may classify, extract, summarise, connect information, detect change, identify Knowledge Gaps, generate hypotheses, prepare Reviews, assess qualification, and recommend Actions.

MATILDA must not silently mutate validated knowledge or make commercial commitments. Material proposed changes must remain visible until accepted, edited, or rejected by a human.

Humans remain accountable for validation, prioritisation, relationship ownership, Opportunity qualification, commitments, customer promises, and commercial decisions.

## Primary prototype scenario

Use the canonical fictional scenario in [`docs/demo-scenario.md`](docs/demo-scenario.md):

1. A consultant learns that a customer may be considering a shared Nordic data platform.
2. The consultant records this as an Observation.
3. MATILDA proposes classification, links, Knowledge Gaps, and Actions.
4. A human validates or edits the proposal.
5. The validated Insight affects the Account Plan.
6. The next Account Review highlights the change and asks for a decision.
7. Further evidence may develop the Initiative into an Opportunity.
8. Qualification is based on evidence and gaps, not optimism.
9. New learning returns to the Account model.

An Observation must never automatically become an Opportunity.

## Prototype scope

### Optimise for

- one primary demonstration Account;
- realistic synthetic data;
- a coherent end-to-end lifecycle;
- clear provenance;
- visible uncertainty;
- a clear human/AI distinction;
- simple, reliable interactions; and
- deterministic behaviour where that improves the demo.

### Do not optimise for

- enterprise scale or multi-tenancy;
- complex permissions;
- production Microsoft 365 integrations;
- complete CRM functionality;
- financial forecasting, billing, or advanced analytics;
- exhaustive configuration;
- production-grade security architecture;
- complex workflow engines;
- generic task management; or
- technical sophistication that does not strengthen the core demonstration.

AI may initially be simulated, deterministic, or partially mocked. Simulated behaviour must remain honest and reflect the intended future workflow; never imply analysis the prototype did not perform.

## Build rules

1. Keep the architecture simple and easy to change.
2. Prefer explicit domain concepts and readable code over abstractions.
3. Preserve the canonical demo path.
4. Use the established terminology consistently.
5. Do not build “a CRM with a chatbot.”
6. Treat the Account Plan as a generated view over structured data, not a document record.
7. Treat Account Review as a decision arena, not a duplicate reporting store.
8. Keep Initiative and Opportunity distinct.
9. Prefer evidence-based qualification over subjective probability.
10. Make AI-generated content identifiable in storage and UI.
11. Retain enough change history to explain material updates.
12. Avoid feature drift into authentication, notifications, exports, settings, or integrations unless explicitly requested.

When trade-offs are necessary, prioritise:

1. correct MATILDA concept;
2. coherent end-to-end demo;
3. provenance and human/AI distinction;
4. user experience;
5. domain integrity;
6. functional completeness;
7. technical sophistication; and
8. production readiness.

## Project documentation

Use these documents as the detailed product specification:

- [`docs/product-concept.md`](docs/product-concept.md) — product concept and operating model.
- [`docs/data-model.md`](docs/data-model.md) — entities, fields, relationships, enums, and validation.
- [`docs/user-journeys.md`](docs/user-journeys.md) — expected workflows and acceptance criteria.
- [`docs/demo-scenario.md`](docs/demo-scenario.md) — canonical end-to-end prototype story.
- [`docs/ui-principles.md`](docs/ui-principles.md) — UX, navigation, visual semantics, and interaction patterns.
- [`docs/architecture.md`](docs/architecture.md) — implementation boundaries and technical architecture.

`CLAUDE.md` defines the governing principles. Detailed implementation must remain consistent with these documents.

When changing behaviour or the domain model, update the relevant documentation together with the code.

## The MATILDA test

Before implementing a feature, ask:

1. Does this improve our understanding of the Account?
2. Does this improve a decision?
3. Does this result in clearer action?
4. Does this help MATILDA learn?
5. Does this demonstrate something materially different from a conventional CRM?

If the feature does none of these, defer it.

## Definition of prototype success

The prototype is successful when stakeholders can experience how:

- customer information enters MATILDA;
- information becomes structured Intelligence;
- knowledge is distinguished from assumptions;
- Knowledge Gaps become visible;
- Intelligence affects the Account Plan;
- Goals drive Initiatives and Actions;
- an Account Review is prepared from live data;
- humans make and own decisions;
- an Initiative may develop into an Opportunity;
- Opportunity learning improves the Account model; and
- AI increases team capacity without taking ownership away from people.

MATILDA should not simply store Account Management work. It should make the Account team better at Account Management.
