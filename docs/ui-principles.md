# MATILDA UI and Interaction Principles

## Purpose

This document defines the prototype's user experience, information architecture, visual semantics, and core interaction patterns.

## Experience goal

The interface should make users feel:

- I understand the Account.
- I understand what changed.
- I understand what matters.
- I understand what we do not know.
- I understand the decision required.
- I understand what should happen next.
- I can inspect why MATILDA made a suggestion.

The product should feel like a focused modern enterprise application, not an information-dense CRM.

## Core UX principles

1. **Decision-first hierarchy** — put material changes, risks, gaps, and Actions before exhaustive status.
2. **Progressive disclosure** — show the conclusion first and make evidence easy to inspect.
3. **Visible epistemic status** — users must distinguish Fact, Observation, Hypothesis, AI Inference, and Decision.
4. **Provenance nearby** — important claims show Source and date without requiring deep navigation.
5. **Human/AI distinction** — proposals and validated information must look and behave differently.
6. **Fast contribution** — Observation capture requires minimal input.
7. **Contextual AI** — MATILDA appears inside workflows, not only in a chat page.
8. **One model, many views** — Overview, Plan, Review, and Opportunity reuse the same entities.
9. **Actionable uncertainty** — Knowledge Gaps have priority, owner, and resolution path.
10. **Accessible semantics** — never depend on colour alone.

## Avoid

- large CRM-style forms;
- default views dominated by tables;
- dashboards full of metrics without decisions;
- decorative AI animations;
- chatbot-first navigation;
- unexplained scores;
- hidden source links;
- silent auto-acceptance of AI output;
- dense configuration; and
- duplicate editing experiences for the same domain data.

## Primary navigation

Recommended Account-level navigation:

- Overview
- Customer Intelligence
- Knowledge Map
- Account Plan
- Relationships
- Opportunities
- Actions
- Account Review

MATILDA Assistant is contextual and available throughout. The exact navigation may evolve after usability testing, but the mental model should remain stable.

## Global layout

### Application shell

Include:

- product identity;
- Account switcher;
- primary navigation;
- global create action;
- contextual search/assistant entry;
- user identity; and
- clear synthetic/prototype label.

### Page header

Each Account page should show:

- Account name;
- view title;
- relevant time window;
- freshness or last-updated context;
- primary Action; and
- critical status only when meaningful.

### Content hierarchy

Prefer:

1. what needs attention;
2. what changed;
3. recommended or required action;
4. supporting evidence; and
5. full detail.

## Account Overview

The Overview should answer four questions:

- What matters now?
- What changed recently?
- What needs attention?
- What should happen next?

Recommended sections:

- strategic Account summary;
- recent material Insights;
- high-priority Knowledge Gaps;
- priority Goals and Initiatives;
- overdue or blocked Actions;
- Opportunity changes;
- relationship alerts;
- upcoming Decisions; and
- MATILDA Recommendations.

Do not make the Overview a generic BI dashboard. Every indicator should lead to evidence, a decision, or an Action.

## Observation capture

### Minimal form

Required:

- Observation text;
- Account, preselected when in Account context; and
- Source type/date, defaulted when context is available.

Optional initially:

- Source link or file;
- topic;
- importance; and
- people mentioned.

### Two-step interaction

1. **Capture** — preserve the user's original words quickly.
2. **Review MATILDA proposals** — classification, links, gaps, and Actions.

Never block capture because AI is unavailable. Save the user's input and allow later analysis.

## Customer Intelligence

Allow browsing and filtering by:

- topic;
- information type;
- importance;
- validation status;
- freshness/date;
- Source; and
- related Initiative or Opportunity.

### Insight card

Show at a glance:

- statement;
- information-type label;
- confidence;
- validation state;
- Source and Source date;
- freshness;
- related entities; and
- AI-origin marker when applicable.

Actions:

- inspect evidence;
- validate/edit;
- link;
- supersede;
- create Knowledge Gap; and
- view history.

Prefer cards or a compact list over a wide field table.

## Knowledge Map

The Knowledge Map answers:

> How well do we understand the things that matter about this Account?

Possible domains:

- Strategy
- Business model
- Organisation
- Decision structure
- Relationships
- Technology
- Market
- Competition
- Current NOVA deliveries
- Customer priorities
- Commercial position

For each domain show:

- relevant Insights;
- confidence and freshness;
- important Knowledge Gaps;
- owner; and
- material change.

Do not equate more data with better understanding. Coverage reflects relevant, current, and validated knowledge.

A grid, heatmap, or map can support scanning, but every state needs a text label and drill-down.

## Account Plan

Present the Account Plan as a structured workspace, not a long document.

Recommended order:

1. Account ambition and strategic situation;
2. priority Goals;
3. Initiatives under each Goal;
4. relevant Relationships;
5. open Actions;
6. Opportunities;
7. Knowledge Gaps and risks; and
8. proposed changes.

### Proposed-change panel

For each MATILDA proposal show:

- affected entity;
- proposed change;
- reason;
- supporting evidence;
- missing information; and
- actions: Accept, Edit, Reject, Defer, Inspect evidence.

Batch approval may be added only when every item remains inspectable.

## Relationships

Focus on strategic coverage, not contact-management volume.

Show:

- stakeholder and role;
- decision role;
- strategic relevance;
- NOVA relationship owner;
- relationship strength;
- last interaction;
- related Initiatives, Opportunities, or gaps; and
- coverage risks.

A relationship map may be useful for the demo, but it must have an accessible list alternative.

## Actions

Actions should be concise and commitment-oriented.

Show:

- verb-led title;
- owner;
- due date;
- priority;
- status;
- originating Initiative, Opportunity, or Review;
- created-by type; and
- outcome when completed.

Distinguish `Proposed` from committed states. MATILDA may propose; a human must accept ownership and due date.

Overdue should be derived and visibly explained.

## Account Review

The Account Review screen should be more decision-oriented than the general Overview.

Recommended sections:

- **What changed**
- **What we learned**
- **Progress**
- **Risks**
- **Knowledge Gaps**
- **Opportunity changes**
- **Overdue Actions**
- **Decisions required**
- **Next Actions**

### Review layout

A two-column desktop layout may work well:

- main column: change, progress, evidence, and risks;
- decision rail: MATILDA recommendation, decision required, and proposed Actions.

On small screens, place decision topics immediately after their supporting evidence.

### Finalisation

Humans can inspect, challenge, edit, decide, and approve. The final action should clearly state that finalisation records human Decisions and may create Actions.

## Opportunity experience

Do not lead with value, stage, and probability alone.

Lead with:

- customer need;
- business impact;
- evidence;
- sponsor and decision structure;
- process and funding;
- timing;
- NOVA relevance;
- competition;
- Knowledge Gaps; and
- next customer commitment.

### Qualification matrix

Each dimension uses one of:

- Confirmed
- Uncertain
- Missing
- Not applicable

Each row shows:

- state;
- short rationale;
- evidence links;
- owner for missing information; and
- last assessed date.

Avoid presenting a single maturity score as the decision. If a summary count is used, show that critical gaps may still block qualification.

## MATILDA Recommendation pattern

Use a consistent component:

**Recommendation**  
What MATILDA suggests.

**Why**  
The reasoning in concise language.

**Evidence**  
Linked Insights and Sources.

**Missing / uncertain**  
Important gaps and assumptions.

**Proposed Action or change**  
The structured consequence.

Actions:

- Accept;
- Edit and accept;
- Reject;
- Defer; and
- Inspect evidence.

Never hide a write operation behind a conversational answer.

## MATILDA Assistant

The Assistant is a contextual interface to the Account model. It may answer:

- What changed with this Account?
- What do we know about the customer's strategy?
- What are the most important Knowledge Gaps?
- What should I know before tomorrow's meeting?
- Why is this Opportunity considered weak?
- What Decisions are needed at the next Review?
- Which Goals are not progressing?
- What evidence supports this Hypothesis?
- What should we do next?

Responses should:

- state the relevant Account and time context;
- distinguish retrieved knowledge from inference;
- cite in-product Sources/Insights;
- expose uncertainty;
- propose, not silently execute, changes; and
- offer a structured next step.

## Visual semantics

### Information types

Use a label, icon, and colour together.

| Type | Meaning | Suggested treatment |
|---|---|---|
| Fact | Evidence-backed | Stable, neutral/blue treatment |
| Observation | Reported but not fully validated | Distinct observation label |
| Hypothesis | Requires validation | Exploratory/purple treatment |
| AI Inference | Generated by MATILDA | AI icon plus explicit label |
| Knowledge Gap | Unknown or insufficiently understood | Warning/orange treatment |
| Decision | Human approved | Strong decision label, owner, and date |

Colour names are illustrative, not mandatory. Meet contrast requirements and never rely on colour alone.

### Status language

Use plain labels:

**Insights:** New, Needs Validation, Validated, Superseded, Stale  
**Knowledge Gaps:** Open, Investigating, Resolved  
**Initiatives:** Proposed, Active, On Hold, Completed, Stopped  
**Actions:** Proposed, Planned, In Progress, Completed, Cancelled; derive Overdue  
**Opportunities:** Potential, Validating, Qualified, Proposal, Negotiation, Won, Lost

Do not introduce synonyms casually.

## Confidence and freshness

Confidence and freshness are different.

- Confidence communicates strength of current belief.
- Freshness communicates whether the information may need revalidation.

Show both when relevant. A high-confidence Insight may still be stale.

## Provenance interaction

Every important claim should offer an **Evidence** action or expandable area containing:

- Source title and type;
- Source date;
- relevant excerpt or reference;
- who added the link;
- validation information; and
- supporting versus challenging relationship.

Do not display raw technical IDs as the primary user experience.

## Change history

For material changes, show a compact history:

- what changed;
- previous and new value;
- when;
- who or what changed it;
- reason/Source; and
- whether a human approved an AI proposal.

History should be understandable without a database audit vocabulary.

## Forms and validation

- Keep required fields to the minimum for the workflow stage.
- Use inline validation with specific recovery guidance.
- Preserve entered text on failure.
- Prefill context safely but make it editable.
- Avoid modal chains.
- Confirm destructive or irreversible actions.
- Prefer reversible proposal workflows.

## Loading, empty, and error states

### Loading

Use skeletons or progress indicators without implying that AI has completed before results arrive.

### Empty

Explain why the section matters and offer one primary next step.

### Error

State what failed, what was preserved, and what the user can do. If AI fails, retain captured information and allow manual completion or retry.

## Accessibility

At minimum:

- keyboard access for all interactive elements;
- visible focus states;
- semantic headings and landmarks;
- accessible names for icons;
- contrast that meets recognised standards;
- status conveyed beyond colour;
- readable tables with headers;
- alternative list views for visual maps; and
- reduced-motion support for nonessential animation.

## Responsive behaviour

Desktop is likely the primary demonstration environment, but core workflows should remain usable on smaller screens.

- Stack side panels below primary content.
- Keep Observation capture practical on mobile.
- Avoid horizontal scrolling for core content.
- Convert wide qualification matrices into labelled cards when necessary.

## Demonstration design

The demo should make these concepts immediately visible:

- a living model;
- Source traceability;
- Knowledge Gaps;
- human versus AI;
- Account Plan impact;
- decision-oriented Review;
- evidence-based Opportunity development; and
- learning feeding back.

Use the same Account, Observation, terminology, visual semantics, and timeline across screens.

## UI acceptance checklist

Before considering a screen complete, verify:

- Can a user tell what matters within a few seconds?
- Is the next Action clear?
- Can every important claim be traced?
- Are unknowns visible?
- Can AI output be distinguished from human-validated content?
- Does accepting a proposal show exactly what will change?
- Is the screen useful without MATILDA Assistant?
- Does it avoid duplicate data entry?
- Is it keyboard accessible and understandable without colour?
- Does it strengthen the canonical demo path?
