/**
 * All homepage copy, taken verbatim from "Homepage Content.docx".
 * `*word*` marks words rendered in the blue accent colour inside headlines.
 * ` ` (non-breaking space) only keeps the last two words of a headline together.
 * `\n` starts a new line in a headline; each line stays on one row where the screen is wide enough.
 */

export type Link = { label: string; href: string };

export const nav = {
  brand: "EQIP",
  links: [
    { label: "What We See", href: "#what-we-see" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "AI Agents", href: "#agents" },
    { label: "Where It Matters", href: "#where-it-matters" },
    { label: "Evidence", href: "#evidence" },
    { label: "About EQIP", href: "#about" },
  ] satisfies Link[],
  cta: { label: "Talk to an Expert", href: "#contact" } satisfies Link,
};

export const hero = {
  title: "Know your business *before* it becomes a risk.",
  body: "Your organisation’s software holds years of business decisions, customer commitments, rules, and hard-won knowledge. EQIP helps you see it clearly—so you can modernise, change, validate, and move forward with confidence.",
  primary: { label: "Talk to an Expert", href: "#contact" } satisfies Link,
  secondary: { label: "Explore the Evidence", href: "#evidence" } satisfies Link,
};

// Scrolling keyword band under the hero.
export const keywords = [
  "Knowledge Graph",
  "Zero Trust Authentication",
  "Predictive Quality Intelligence",
  "ML Monitoring",
  "Model Result Verification",
  "Cognitive Analysis",
];

export const problem = {
  eyebrow: "The problem",
  title: "Your business remembers more than your documentation does.",
  body: "Across every enterprise are applications that have outlived their original teams, systems connected in ways no diagram captures, and business rules buried in code, processes, and people’s memory.",
  bridge: "That is manageable—until a transformation, migration, acquisition, or rapid release asks a simple question:",
  question: "What will this change affect?",
  answerLead: "For too many organisations, the honest answer is:",
  answer: "we do not know yet.",
};

export const visible = {
  eyebrow: "What EQIP makes visible",
  title: "Clarity before change.\n*Confidence after it.*",
  body: "EQIP brings together the evidence already distributed across your software estate: how applications behave, where dependencies sit, what business rules matter, and where change creates risk.",
  body2: "It gives leaders and delivery teams a clearer basis for decisions that are usually made under pressure.",
  pillars: [
    {
      title: "Understand what you own",
      text: "Surface the real behaviour, relationships, and hidden knowledge within complex applications.",
    },
    {
      title: "Preserve what matters",
      text: "Protect the business logic and institutional memory that should not be lost during change.",
    },
    {
      title: "Validate what changes",
      text: "Focus attention on the parts of the estate where confidence is most needed.",
    },
    {
      title: "Evolve without blind spots",
      text: "Make modernisation, releases, and investment decisions with a living view of software reality.",
    },
  ],
};

export const capabilities = {
  eyebrow: "The capabilities behind EQIP",
  title: "Eleven capabilities.\n*One connected intelligence.*",
  body: "Each outcome EQIP delivers is powered by capabilities that work together, so what is learned in one part of the estate informs every decision that follows.",
  // Grouped under the four outcomes from "What EQIP makes visible".
  groups: [
    {
      label: "Understand what you own",
      items: [
        {
          title: "Software Intelligence Fabric",
          text: "A continuously connected intelligence layer that brings together code, data, requirements, business logic, dependencies, tests and operational insights.",
        },
        {
          title: "Digital Archaeology",
          text: "Reconstructing undocumented business logic, system dependencies and hidden workflows embedded in legacy software.",
        },
        {
          title: "Application Behavior Intelligence",
          text: "Understand application workflows, dependencies and behavioral patterns to create context-aware test scenarios.",
        },
        {
          title: "Software Due Diligence Engine",
          text: "Understand the real condition, complexity and risk of an application before acquiring, migrating or investing in it.",
        },
      ],
    },
    {
      label: "Preserve what matters",
      items: [
        {
          title: "Engineering Memory Graph",
          text: "A connected knowledge structure that preserves the reasoning, decisions, dependencies, defects and evolution history of software.",
        },
        {
          title: "Quality Knowledge Graph",
          text: "Connect requirements, application components, test cases, defects, dependencies and historical execution data into a contextual quality intelligence layer.",
        },
      ],
    },
    {
      label: "Validate what changes",
      items: [
        {
          title: "Multi-Agent Quality Orchestration Framework",
          text: "Specialized AI agents collaborate to interpret requirements, generate tests, execute scenarios, analyze failures and produce quality insights.",
        },
        {
          title: "Generative Test Synthesis",
          text: "Automatically create relevant test scenarios, test cases, test data and validation scripts by understanding an application’s requirements, source code, business logic, architecture and historical behaviour.",
        },
        {
          title: "Risk-Weighted Test Orchestration",
          text: "Intelligently deciding what to test, how deeply to test it, and in what order, based on the risk associated with each change or component.",
        },
      ],
    },
    {
      label: "Evolve without blind spots",
      items: [
        {
          title: "Closed-Loop Engineering Intelligence",
          text: "Creating a continuous feedback loop between development, testing, production behaviour, defects and future improvements.",
        },
        {
          title: "Bridge Legacy and Modern Technology",
          text: "Understand, analyse, test and validate applications built across different generations of technology.",
        },
      ],
    },
  ],
};

export const agents = {
  eyebrow: "Core intelligence modules",
  title: "20 AI Agents, *One Platform.*",
  body: "Purpose-built agents that collaborate across the entire testing lifecycle—no human in the loop required.",
  modules: [
    {
      stage: "Requirement analysis",
      title: "Discovery & Risk Intelligence",
      agents: ["Requirement Intelligence Agent", "Domain Risk Simulation Agent", "Change Impact Intelligence Agent"],
    },
    {
      stage: "Test planning",
      title: "Test Engineering",
      agents: [
        "Test Case Co-Designer Agent",
        "Exploratory Testing Assistant Agent",
        "Test Data Intelligence Agent",
        "Locator Intelligence Agent",
        "Automation Script Generation Agent",
        "Self-Healing & Stability Advisor Agent",
      ],
    },
    {
      stage: "Test execution",
      title: "Execution Intelligence",
      agents: ["Test Predictive Advisor Agent", "Execution Orchestrator Agent", "Environment Intelligence Agent"],
    },
    {
      stage: "Test execution",
      title: "Security, Performance & UX",
      agents: ["Security Intelligence Agent", "Performance & Scalability Agent", "Accessibility & UX Agent"],
    },
    {
      stage: "Defect reporting & release decision",
      title: "Decision & Intelligence",
      agents: ["Failure Intelligence Agent", "Test Report Intelligence Agent", "Insights & Trend Intelligence Agent"],
    },
    {
      stage: "Observability",
      title: "Production Intelligence",
      agents: ["Observability Correlation Agent", "Continuous Learning Agent"],
    },
  ],
};

export const matters = {
  eyebrow: "Where confidence matters most",
  title: "When the cost of being wrong is *high.*",
  cases: [
    {
      title: "Modernisation and migration",
      text: "Move from legacy platforms without leaving critical business logic behind.",
    },
    {
      title: "Enterprise change",
      text: "Understand the likely impact of a change before it reaches customers, operations, or compliance teams.",
    },
    {
      title: "AI-generated and AI-assisted software",
      text: "As software is created faster, maintain an independent view of whether it behaves as intended.",
    },
    {
      title: "Technology due diligence",
      text: "See the condition, complexity, and risk within an application before you acquire, migrate, or invest.",
    },
  ],
};

export const evidence = {
  eyebrow: "Evidence, not assurance theatre",
  title: "Confidence should be *visible.*",
  body: "EQIP does not ask teams to rely on a black box or a reassuring dashboard. It helps create a traceable view of what is known, what has changed, what has been validated, and where attention is still needed.",
  kicker: "The result is a conversation grounded in evidence:",
  points: [
    "Which business journeys are understood",
    "Which systems and dependencies are affected",
    "What has been checked before a release or transition",
    "Where risk remains and why",
    "What the organisation has learned for the next decision",
  ],
};

export const experience = {
  eyebrow: "Built on experience with complex software",
  title: "Enterprise software is never just *software.*",
  body: "It is the accumulated record of how an organisation operates: exceptions made for customers, rules shaped by regulation, decisions taken during growth, and workarounds that became essential.",
  // The four layers named in the sentence above, shown as the strata graphic.
  strata: [
    "Exceptions made for customers",
    "Rules shaped by regulation",
    "Decisions taken during growth",
    "Workarounds that became essential",
  ],
  statement:
    "EQIP is built for that reality. We combine deep quality and software assurance experience with a modern intelligence layer designed for estates that are complex, consequential, and constantly changing.",
  proof:
    "[Insert approved proof statement here: e.g., “Built on more than [X] years of experience supporting enterprise software quality and transformation.”]",
};

export const field = {
  eyebrow: "Evidence from the field",
  title: "The work speaks for *itself.*",
  linkLabel: "Read the case study",
  stories: [
    {
      title: "Enterprise ERP modernisation",
      href: "#",
      steps: [
        {
          label: "The challenge",
          text: "A business-critical transformation depended on workflows spread across legacy systems, changing requirements, and multiple operational teams.",
        },
        {
          label: "What became clear",
          text: "The organisation gained a more complete view of critical journeys, dependencies, and release risk before go-live.",
        },
        {
          label: "What changed",
          text: "Teams could focus validation where it mattered most and move into rollout with a defensible basis for confidence.",
        },
      ],
    },
    {
      title: "Regulated industry release assurance",
      href: "#",
      steps: [
        {
          label: "The challenge",
          text: "A high-impact release introduced change across customer, policy, and calculation workflows.",
        },
        {
          label: "What became clear",
          text: "The team could connect requirements, application behaviour, and validation evidence in one view.",
        },
        {
          label: "What changed",
          text: "Release conversations shifted from opinion and status reporting to evidence and informed decision-making.",
        },
      ],
    },
  ],
};

export const closing = {
  title: "The next change should not depend on what someone happens to *remember.*",
  body: "Bring the intelligence already inside your software into view. Understand what matters, preserve what works, and change with confidence.",
  primary: { label: "Talk to an Expert", href: "#contact" } satisfies Link,
  secondary: { label: "See EQIP in Context", href: "#where-it-matters" } satisfies Link,
};

export const footer = {
  line: "EQIP helps organisations understand, preserve, validate, and continuously evolve their software with confidence.",
};
