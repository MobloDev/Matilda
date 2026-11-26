// Seeds the canonical Nordic Horizon Group demo scenario from docs/demo-scenario.md.
// Run with: npm run seed
//
// This is a first, coherent pass through the story — not yet the full
// 25-50 Insight target in docs/data-model.md. Volume can be added later;
// what matters first is that every stage of the lifecycle has real data
// behind it.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete in child-to-parent order so foreign keys never point at a
  // row that no longer exists.
  await prisma.action.deleteMany();
  await prisma.opportunityQualification.deleteMany();
  await prisma.opportunityInsight.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.growthArea.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.assumption.deleteMany();
  await prisma.initiativeRelationship.deleteMany();
  await prisma.initiativeInsight.deleteMany();
  await prisma.initiative.deleteMany();
  await prisma.goalInsight.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.knowledgeGap.deleteMany();
  await prisma.relationship.deleteMany();
  await prisma.insightSource.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.source.deleteMany();
  await prisma.accountReview.deleteMany();
  await prisma.account.deleteMany();

  const account = await prisma.account.create({
    data: {
      name: "Nordic Horizon Group",
      accountType: "Strategic",
      segment: "Enterprise",
      industry: "Diversified / multi-business-unit group",
      accountManager: "Astrid Lindqvist",
      technicalAccountManager: "Jonas Berg",
      accountTeam: "Astrid Lindqvist, Jonas Berg, Maya Olsen",
      ambition:
        "Become the trusted partner for Nordic Horizon Group's digital development agenda.",
      strategicStatus: "Developing",
    },
  });

  // --- Sources ---

  const strategySource = await prisma.source.create({
    data: {
      accountId: account.id,
      sourceType: "strategy_document",
      title: "Nordic Horizon Group 2026 digital ambition statement",
      sourceDate: new Date("2026-09-01"),
      owner: "Astrid Lindqvist",
      classification: "external",
      excerpt:
        "The group wants more integrated digital customer experiences across business units.",
    },
  });

  const meetingSource = await prisma.source.create({
    data: {
      accountId: account.id,
      sourceType: "customer_meeting",
      title: "Quarterly check-in with Digital Platform team",
      sourceDate: new Date("2026-11-18"),
      owner: "Maya Olsen",
      classification: "external",
      excerpt:
        "Customer indicated they may be considering a shared Nordic data platform.",
    },
  });

  const sponsorMeetingSource = await prisma.source.create({
    data: {
      accountId: account.id,
      sourceType: "customer_meeting",
      title: "Validation discussion with technical sponsor",
      sourceDate: new Date("2026-11-25"),
      owner: "Jonas Berg",
      classification: "external",
      excerpt:
        "Sponsor confirmed the need, but funding is not available until next fiscal year.",
    },
  });

  // --- Insights ---

  const fragmentationInsight = await prisma.insight.create({
    data: {
      accountId: account.id,
      title: "Data fragmentation previously flagged as a problem",
      statement:
        "Fragmented customer and product data has previously been identified as slowing cross-business digital services.",
      topic: "Data strategy",
      informationType: "FACT",
      status: "VALIDATED",
      importance: "MEDIUM",
      confidence: "MEDIUM",
      observedAt: new Date("2026-06-10"),
      validatedAt: new Date("2026-06-12"),
      validatedBy: "Astrid Lindqvist",
      createdBy: "Astrid Lindqvist",
    },
  });

  const ambitionInsight = await prisma.insight.create({
    data: {
      accountId: account.id,
      title: "Group ambition for integrated digital customer experiences",
      statement:
        "Nordic Horizon Group's 2026 strategy names more integrated digital customer experiences as a stated ambition.",
      topic: "Strategy",
      informationType: "FACT",
      status: "VALIDATED",
      importance: "HIGH",
      confidence: "HIGH",
      observedAt: new Date("2026-09-01"),
      validatedAt: new Date("2026-09-05"),
      validatedBy: "Astrid Lindqvist",
      createdBy: "Astrid Lindqvist",
    },
  });

  const platformObservation = await prisma.insight.create({
    data: {
      accountId: account.id,
      title: "Possible shared Nordic data platform initiative",
      statement:
        "The customer appears to be considering a shared Nordic data platform to improve the sharing of customer and product data across business units. The initiative may be anchored in digital leadership, but scope and timing are not known.",
      topic: "Data strategy",
      informationType: "OBSERVATION",
      status: "NEEDS_VALIDATION",
      importance: "HIGH",
      confidence: "MEDIUM",
      observedAt: new Date("2026-11-18"),
      createdBy: "Maya Olsen",
    },
  });

  await prisma.insightSource.createMany({
    data: [
      {
        insightId: platformObservation.id,
        sourceId: meetingSource.id,
        supportType: "SUPPORTS",
        note: "Customer raised the idea directly in this meeting.",
      },
      {
        insightId: ambitionInsight.id,
        sourceId: strategySource.id,
        supportType: "SUPPORTS",
      },
    ],
  });

  // --- Knowledge Gaps ---

  await prisma.knowledgeGap.createMany({
    data: [
      {
        accountId: account.id,
        question: "Who owns the platform decision?",
        topic: "Decision structure",
        importance: "HIGH",
        status: "OPEN",
        relatedInsightId: platformObservation.id,
      },
      {
        accountId: account.id,
        question: "Is funding available or planned for this initiative?",
        topic: "Commercial",
        importance: "CRITICAL",
        status: "OPEN",
        relatedInsightId: platformObservation.id,
      },
      {
        accountId: account.id,
        question: "Which business units are involved?",
        topic: "Scope",
        importance: "MEDIUM",
        status: "OPEN",
        relatedInsightId: platformObservation.id,
      },
    ],
  });

  // --- Relationships ---

  // Created individually (not createMany) so we can link both to the
  // Initiative below via InitiativeRelationship.
  const erikRelationship = await prisma.relationship.create({
    data: {
      accountId: account.id,
      contactName: "Erik Solberg",
      organisationOrUnit: "Digital Platform team",
      role: "Technical lead",
      decisionRole: "influencer",
      strategicRelevance: "HIGH",
      novaRelationshipOwner: "Jonas Berg",
      strength: "DEVELOPING",
      desiredPosition: "Strong",
      plannedApproach:
        "Deepen through the exploratory workshop and joint technical roadmap work.",
      lastInteractionAt: new Date("2026-11-25"),
      notes: "Confirmed as technical sponsor for the platform idea.",
    },
  });

  const cdoRelationship = await prisma.relationship.create({
    data: {
      accountId: account.id,
      contactName: "Unknown group CDO",
      organisationOrUnit: "Group digital leadership",
      role: "Possible decision maker",
      decisionRole: "unknown",
      strategicRelevance: "CRITICAL",
      novaRelationshipOwner: "Astrid Lindqvist",
      strength: "UNKNOWN",
      desiredPosition: "Strong",
      plannedApproach:
        "Identify the decision owner and initiate executive-level dialogue.",
      notes: "Group-level decision owner not yet identified.",
    },
  });

  // --- Goal, Initiative, Actions ---

  const goal = await prisma.goal.create({
    data: {
      accountId: account.id,
      title:
        "Strengthen NOVA's strategic position in the customer's digital development agenda",
      rationale:
        "The group's stated digital ambition and existing data-fragmentation problem create an opening for NOVA relevance.",
      owner: "Astrid Lindqvist",
      priority: "HIGH",
      successCriteria:
        "NOVA is recognised as a relevant partner for at least one group-wide digital initiative within two quarters.",
      status: "ACTIVE",
      progressAssessment:
        "Early momentum: the underlying problem is confirmed and a technical sponsor is engaged, but executive-level recognition is not yet established.",
    },
  });

  await prisma.goalInsight.createMany({
    data: [
      { goalId: goal.id, insightId: ambitionInsight.id },
      { goalId: goal.id, insightId: fragmentationInsight.id },
    ],
  });

  const initiative = await prisma.initiative.create({
    data: {
      accountId: account.id,
      goalId: goal.id,
      title: "Develop NOVA's position around the shared data platform direction",
      description:
        "Coordinate validation, capability mapping, and a customer-facing point of view on the possible shared Nordic data platform.",
      rationale:
        "Early engagement while the initiative is still exploratory gives NOVA a chance to shape it before competitors do.",
      owner: "Jonas Berg",
      priority: "HIGH",
      status: "ACTIVE",
      startDate: new Date("2026-11-19"),
      nextMilestone:
        "Confirm the decision owner and propose an exploratory workshop.",
    },
  });

  await prisma.initiativeInsight.create({
    data: { initiativeId: initiative.id, insightId: platformObservation.id },
  });

  await prisma.initiativeRelationship.createMany({
    data: [
      { initiativeId: initiative.id, relationshipId: erikRelationship.id },
      { initiativeId: initiative.id, relationshipId: cdoRelationship.id },
    ],
  });

  // --- Assumptions ---

  await prisma.assumption.createMany({
    data: [
      {
        accountId: account.id,
        statement:
          "Data and AI governance will become a strategic investment area for the group in the next planning period.",
        initiativeId: initiative.id,
        confidence: "MEDIUM",
        status: "UNVALIDATED",
        validationOwner: "Jonas Berg",
        validationDate: new Date("2027-02-01"),
      },
      {
        accountId: account.id,
        statement:
          "The customer is willing to let NOVA engage informally before a formal procurement process begins.",
        goalId: goal.id,
        supportingInsightId: platformObservation.id,
        confidence: "LOW",
        status: "UNVALIDATED",
        validationOwner: "Astrid Lindqvist",
        validationDate: new Date("2026-12-20"),
      },
    ],
  });

  // --- Risks ---

  await prisma.risk.createMany({
    data: [
      {
        accountId: account.id,
        description:
          "An existing global technology partner may establish executive access before NOVA.",
        initiativeId: initiative.id,
        likelihood: "MEDIUM",
        impact: "HIGH",
        mitigation:
          "Accelerate the exploratory workshop and seek direct access to the decision owner.",
        owner: "Astrid Lindqvist",
        reviewDate: new Date("2026-12-15"),
      },
      {
        accountId: account.id,
        description:
          "The Account team may pursue too many areas simultaneously and dilute executive engagement.",
        goalId: goal.id,
        likelihood: "LOW",
        impact: "MEDIUM",
        mitigation:
          "Keep the number of active Initiatives within the three-to-five target range.",
        owner: "Astrid Lindqvist",
      },
    ],
  });

  // --- Growth Areas (Growth and White-Space Map) ---

  await prisma.growthArea.createMany({
    data: [
      {
        accountId: account.id,
        name: "Data Platform",
        novaToday: "LOW",
        customerPriority: "HIGH",
        potential: "HIGH",
        timing: "Emerging",
        posture: "PURSUE",
        recommendedApproach:
          "Selective investment while validating sponsorship and funding.",
        initiativeId: initiative.id,
      },
      {
        accountId: account.id,
        name: "Applied AI",
        novaToday: "MEDIUM",
        customerPriority: "HIGH",
        potential: "HIGH",
        timing: "Near term",
        posture: "MONITOR",
        recommendedApproach:
          "Validate the customer's AI priorities before committing a dedicated Initiative.",
      },
      {
        accountId: account.id,
        name: "Digital Experience",
        novaToday: "HIGH",
        customerPriority: "MEDIUM",
        potential: "MEDIUM",
        timing: "Now",
        posture: "MONITOR",
        recommendedApproach:
          "Protect the existing strong position; revisit if customer priority increases.",
      },
      {
        accountId: account.id,
        name: "Commerce",
        novaToday: "LOW",
        customerPriority: "LOW",
        potential: "MEDIUM",
        timing: "Unclear",
        posture: "REJECT",
        recommendedApproach: "No current fit or customer signal; do not pursue.",
      },
    ],
  });

  await prisma.action.createMany({
    data: [
      {
        accountId: account.id,
        initiativeId: initiative.id,
        title: "Validate the customer need with digital leadership",
        owner: "Jonas Berg",
        dueDate: new Date("2026-11-25"),
        priority: "HIGH",
        status: "COMPLETED",
        outcome:
          "Sponsor confirmed the need but said funding is not available until next fiscal year.",
        completedAt: new Date("2026-11-25"),
        originType: "HUMAN",
      },
      {
        accountId: account.id,
        initiativeId: initiative.id,
        title: "Identify the initiative owner and decision structure",
        owner: "Astrid Lindqvist",
        dueDate: new Date("2026-12-10"),
        priority: "HIGH",
        status: "IN_PROGRESS",
        originType: "HUMAN",
      },
      {
        accountId: account.id,
        initiativeId: initiative.id,
        title: "Assemble relevant NOVA capabilities and references",
        owner: "Maya Olsen",
        dueDate: new Date("2026-12-15"),
        priority: "MEDIUM",
        status: "PROPOSED",
        originType: "MATILDA_SUGGESTION",
      },
    ],
  });

  // --- Opportunity + qualification ---

  const opportunity = await prisma.opportunity.create({
    data: {
      accountId: account.id,
      initiativeId: initiative.id,
      title: "Nordic Data Platform Advisory",
      customerNeed:
        "Improve data sharing and support more integrated digital services across business units.",
      businessValue: "Exploratory advisory and architecture engagement.",
      stage: "VALIDATING",
      novaProposition: "Exploratory advisory and architecture engagement",
      competition: "An existing global technology partner is already involved.",
      nextStep: "Confirm customer participants and decision owner for a workshop",
      nextStepDate: new Date("2026-12-12"),
      status: "open",
    },
  });

  await prisma.opportunityInsight.create({
    data: { opportunityId: opportunity.id, insightId: platformObservation.id },
  });

  await prisma.opportunityQualification.createMany({
    data: [
      {
        opportunityId: opportunity.id,
        dimension: "CUSTOMER_NEED",
        state: "CONFIRMED",
        note: "Confirmed in the sponsor validation meeting.",
        assessedBy: "Jonas Berg",
      },
      {
        opportunityId: opportunity.id,
        dimension: "BUSINESS_IMPORTANCE",
        state: "CONFIRMED",
        note: "Matches the group's stated digital ambition.",
        assessedBy: "Jonas Berg",
      },
      {
        opportunityId: opportunity.id,
        dimension: "SPONSOR",
        state: "CONFIRMED",
        note: "Erik Solberg confirmed as technical sponsor.",
        assessedBy: "Jonas Berg",
      },
      {
        opportunityId: opportunity.id,
        dimension: "DECISION_MAKER",
        state: "MISSING",
        note: "Group-level decision owner not yet identified.",
        assessedBy: "Astrid Lindqvist",
      },
      {
        opportunityId: opportunity.id,
        dimension: "DECISION_PROCESS",
        state: "MISSING",
        assessedBy: "Astrid Lindqvist",
      },
      {
        opportunityId: opportunity.id,
        dimension: "FUNDING_PATH",
        state: "UNCERTAIN",
        note: "No budget allocated until next fiscal year.",
        assessedBy: "Jonas Berg",
      },
      {
        opportunityId: opportunity.id,
        dimension: "TIMING",
        state: "UNCERTAIN",
        note: "Formal decision expected in roughly six months.",
        assessedBy: "Jonas Berg",
      },
      {
        opportunityId: opportunity.id,
        dimension: "NOVA_RELEVANCE",
        state: "CONFIRMED",
        note: "Existing relevant capabilities and delivery history.",
        assessedBy: "Astrid Lindqvist",
      },
      {
        opportunityId: opportunity.id,
        dimension: "COMPETITION",
        state: "UNCERTAIN",
        note: "Existing global partner involved; position unclear.",
        assessedBy: "Astrid Lindqvist",
      },
      {
        opportunityId: opportunity.id,
        dimension: "NEXT_CUSTOMER_COMMITMENT",
        state: "CONFIRMED",
        note: "Customer open to exploring a workshop format.",
        assessedBy: "Jonas Berg",
      },
    ],
  });

  // --- Account Review ---

  await prisma.accountReview.create({
    data: {
      accountId: account.id,
      reviewDate: new Date("2026-11-26"),
      reviewPeriodStart: new Date("2026-09-01"),
      reviewPeriodEnd: new Date("2026-11-26"),
      participants: "Astrid Lindqvist, Jonas Berg, Maya Olsen",
      status: "IN_REVIEW",
      generatedSummary: JSON.stringify({
        whatChanged:
          "A possible group-wide data platform initiative has been identified and the underlying problem has been confirmed.",
        whatWeLearned:
          "The customer is interested in exploring approaches, but scope, funding, and formal ownership remain unclear.",
        risks: [
          "An existing global technology partner may establish position early.",
          "NOVA's relationship remains mainly technical.",
          "Investment could be premature without clearer sponsorship.",
        ],
        decisionRequired:
          "Should NOVA invest capacity in developing a clear perspective and proposing an exploratory workshop before a formal Opportunity exists?",
      }),
    },
  });

  console.log("Seed complete: Nordic Horizon Group scenario loaded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
