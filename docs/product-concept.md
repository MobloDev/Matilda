# MATILDA Product Concept

## Purpose of this document

This document explains the product concept and operating model for MATILDA. It complements `CLAUDE.md`, which contains the governing build instructions.

## Executive summary

MATILDA—**Machine Augmented Transformation Intelligence Learning & Decision Assistant**—is NOVA's prototype AI-native Account Management Operating System.

Its purpose is to turn fragmented customer information into shared understanding, deliberate decisions, coordinated action, and reusable learning. It does this through one living Account model rather than a set of disconnected documents, dashboards, CRM records, and conversations.

The product hypothesis is:

> A continuously maintained and AI-augmented Account model can improve the quality, consistency, and scalability of strategic Account Management.

## The problem

Strategic customer knowledge is commonly distributed across:

- individual memory;
- Teams conversations;
- meeting notes and transcripts;
- email;
- CRM;
- presentations and Account Plans;
- SharePoint and project documentation; and
- Opportunity records.

The result is predictable:

- knowledge is fragmented and difficult to verify;
- the same information is copied into several artefacts;
- Account Plans become stale documents;
- Account Reviews require manual reconstruction;
- uncertainty is hidden rather than managed;
- Opportunities may be advanced on optimism instead of evidence;
- learning from execution does not consistently update Account understanding; and
- customer development becomes dependent on individual Account Managers.

## The concept

MATILDA treats Account Management as a connected learning system:

```text
Customer information
→ structured Customer Intelligence
→ shared understanding
→ priorities and Goals
→ Initiatives and Actions
→ decisions
→ Opportunities and outcomes
→ learning
→ better Customer Intelligence
```

The Account is the root of this system. Its model evolves when new information is captured, validated, linked, acted on, and learned from.

MATILDA does not merely hold data. It makes relationships between evidence, unknowns, priorities, work, decisions, and commercial development visible.

## What MATILDA is

MATILDA helps the Account team perform five connected jobs.

### Understand

- What do we know about the Account?
- What changed?
- How reliable and fresh is our knowledge?
- What do we not know?

### Prioritise

- What matters most?
- What should NOVA try to achieve?
- Where should the team focus?

### Act

- What should happen next?
- Who owns the Action?
- What is overdue or blocked?

### Decide

- What requires human judgment?
- Which trade-off, investment, or commitment should the team make?

### Learn

- What happened?
- What did the outcome teach us?
- How should it change Account understanding and future action?

## What MATILDA is not

MATILDA is not intended to be:

- a complete CRM replacement;
- a generic sales pipeline tool;
- a document management system;
- a reporting dashboard with AI added;
- a chatbot detached from structured Account data;
- a generic task manager;
- an autonomous AI Account Manager; or
- a complete enterprise platform in the prototype phase.

It may integrate with systems that perform some of these jobs in the future. The prototype must first prove the operating model.

## The living Account model

The living model connects three logical layers.

### 1. Customer Intelligence

Contains:

- Insights;
- Sources;
- Knowledge Gaps; and
- Relationships.

Purpose: create an evidence-aware understanding of the Account.

### 2. Account Management

Contains:

- Goals;
- Initiatives;
- Actions; and
- Opportunities.

Purpose: turn understanding into priorities, coordinated work, and commercial development.

### 3. Governance and learning

Contains:

- Account Reviews;
- human Decisions;
- outcomes; and
- material change history.

Purpose: challenge assumptions, decide, monitor progress, and feed learning back into Customer Intelligence.

The product operates across all three layers. Value comes from the loop between them, not from any single screen.

## Capture once, reuse everywhere

A single Observation might:

1. be connected to a Source;
2. reveal an unanswered question;
3. strengthen or challenge an existing Insight;
4. affect the relevance of a Goal;
5. create or change an Initiative;
6. produce a recommended Action;
7. appear as a material change in Account Review;
8. contribute to an Opportunity after validation; and
9. create new learning when acted on.

The system should preserve the original meaning and provenance while making the information reusable.

## Human and AI partnership

MATILDA is machine augmented, not machine controlled.

AI can reduce cognitive and administrative work through:

- extraction and classification;
- summarisation;
- linking related information;
- change detection;
- Knowledge Gap identification;
- hypothesis generation;
- Account Plan and Review preparation;
- meeting preparation;
- evidence-based Opportunity assessment; and
- next-Action recommendations.

Humans remain responsible for:

- validating important knowledge;
- customer relationships;
- strategic prioritisation;
- commercial judgment;
- Opportunity qualification;
- commitments and promises;
- final Account Plan changes; and
- decisions.

AI output must remain inspectable. The user should see what MATILDA suggests, why, which evidence supports it, and what information is still missing.

## Knowledge reliability

The product must distinguish among:

| Type | Meaning | Required treatment |
|---|---|---|
| Fact | Supported by sufficiently reliable evidence | Show evidence and date |
| Observation | Reported or observed, not necessarily independently confirmed | Make validation state visible |
| Hypothesis | Interpretation requiring validation | Never present as confirmed |
| AI Inference | Generated connection, conclusion, or recommendation | Label as AI-generated and explain reasoning |
| Decision | Explicitly approved by a human | Show owner, date, and resulting Action where relevant |

Important information also has a freshness dimension. A previously validated statement may become stale as the customer changes.

## Product principles

1. **Living Account Model** — organise around evolving structured data, not static documents.
2. **Capture once, reuse everywhere** — avoid manual duplication.
3. **Source before assertion** — connect important claims to their origin.
4. **Expose uncertainty** — make unknowns and assumptions useful.
5. **Decisions over reporting** — show implications and required choices.
6. **Easy contribution** — make input practical for the whole Account team.
7. **AI in the background** — normal use should not depend on prompt-writing.
8. **Human in control** — AI proposes; humans validate and decide.
9. **Intelligence must lead somewhere** — knowledge should affect priorities or action.
10. **Continuous learning** — outcomes improve future Account understanding.

## Account team operating model

MATILDA is a team system. Potential contributors include:

- Account Manager;
- Technical Account Manager;
- consultants;
- project leaders;
- business-area representatives;
- sales specialists; and
- leadership.

The Account Manager may retain overall accountability without becoming the only person able to contribute knowledge. Contribution should be easy; governance and validation responsibility should be explicit.

## Account Plan concept

The Account Plan is not a single document object. It is a generated and editable view over:

- Account ambition;
- strategic understanding;
- Goals;
- Initiatives;
- Relationships;
- Actions;
- Opportunities;
- Knowledge Gaps; and
- risks.

The plan changes when underlying validated information changes. Export may be added later, but the system of record remains structured Account data.

## Account Review concept

Account Review is a decision arena generated from the current model and the changes since the previous Review.

It should answer:

1. What changed?
2. What did we learn?
3. What progress did we make?
4. What is at risk?
5. Which important Knowledge Gaps remain?
6. Which Opportunities changed?
7. Which Actions are overdue?
8. What decisions are required?
9. What should happen next?

The Review should not create a second copy of Account information. Humans inspect, challenge, edit, decide, and approve. Approved decisions create accountable Actions without duplicate registration.

## Opportunity development concept

An Initiative and an Opportunity are different:

- An **Initiative** is coordinated work NOVA undertakes to develop the Account.
- An **Opportunity** is a potential commercial outcome.

A useful progression is:

```text
Observation
→ Hypothesis
→ validated customer need
→ Initiative
→ potential Opportunity
→ qualified Opportunity
```

MATILDA should show what is confirmed, uncertain, and missing across customer need, business importance, sponsor, decision process, funding, timing, NOVA relevance, competition, and next customer commitment.

The product should help improve Opportunity quality rather than encourage stage movement unsupported by evidence.

## Prototype proposition

The prototype should demonstrate one coherent fictional Account story using realistic synthetic data. It should make these ideas visually obvious:

- living Customer Intelligence;
- provenance;
- Knowledge Gaps;
- the distinction between human and AI;
- continuous Account Planning;
- decision-oriented Account Review;
- evidence-based Opportunity development; and
- the learning loop.

A stakeholder should understand the value without a technical explanation.

## Success criteria

The prototype proves the operating model when stakeholders can experience:

- fast capture of customer information;
- AI-assisted structure without hidden mutation;
- explicit knowledge reliability and uncertainty;
- visible impact on the Account Plan;
- coordinated Action driven by Goals and Initiatives;
- Review preparation from live information;
- accountable human decisions;
- evidence-based Opportunity qualification; and
- outcomes feeding new learning into the Account model.

It does not need to prove enterprise scalability or production integration.

## Long-term direction without prototype overreach

If the operating model proves valuable, later versions may add richer decision and outcome entities, enterprise integrations, production governance, security, collaboration, analytics, and deployment architecture.

These possibilities must not distract the prototype from its central promise:

> Better understanding → better decisions → coordinated action → commercial learning → stronger customer development.
