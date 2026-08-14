import {
  AIResource,
  AICollection,
  AICategory,
  AIPlatformMeta,
} from '@/lib/types/ai-upscale';

export const AI_PLATFORMS: AIPlatformMeta[] = [
  {
    id: 'claude_code',
    slug: 'claude-code',
    name: 'Claude Code',
    badge: 'ANTHROPIC CLI',
    nativeTerm: 'Claude Code Skill / Plugin',
    description: 'Agentic terminal client by Anthropic supporting modular skills (`SKILL.md`), plugins (`/plugin`), and MCP tool integrations.',
    officialDocUrl: 'https://docs.anthropic.com/en/docs/claude-code/overview',
    installPatternSummary: 'Place `SKILL.md` in `~/.claude/skills/` or project `.claude/skills/`, or install via `/plugin install`.',
    supportedTypes: ['skill', 'plugin', 'mcp', 'workflow'],
  },
  {
    id: 'codex',
    slug: 'codex',
    name: 'OpenAI Codex',
    badge: 'OPENAI CLI / AGENT',
    nativeTerm: 'Codex Skill / Agent Extension',
    description: 'OpenAI agentic workflow engine supporting portable agent skills, custom instruction files, and tool-augmented runs.',
    officialDocUrl: 'https://platform.openai.com/docs/guides/codex',
    installPatternSummary: 'Register skill manifests in your workspace root or configure in OpenAI Codex environment specs.',
    supportedTypes: ['skill', 'plugin', 'agent', 'prompt_pack'],
  },
  {
    id: 'chatgpt',
    slug: 'chatgpt',
    name: 'ChatGPT',
    badge: 'OPENAI WEB / APPS',
    nativeTerm: 'Custom GPT / App Action',
    description: 'OpenAI consumer and team assistant supporting Custom GPT instructions, Actions (OpenAPI specs), and memory presets.',
    officialDocUrl: 'https://openai.com/chatgpt',
    installPatternSummary: 'Import OpenAPI schema in Custom GPT action builder or configure custom system prompts.',
    supportedTypes: ['plugin', 'prompt_pack', 'workflow'],
  },
  {
    id: 'gemini_cli',
    slug: 'gemini-cli',
    name: 'Gemini CLI',
    badge: 'GOOGLE GENAI',
    nativeTerm: 'Gemini CLI Extension / Skill',
    description: 'Google GenAI terminal & developer agent supporting tool calls, extension modules, and function declarations via `@google/genai`.',
    officialDocUrl: 'https://ai.google.dev/gemini-api/docs',
    installPatternSummary: 'Install extension manifests into `~/.gemini/extensions/` or run with `--skill` flag.',
    supportedTypes: ['extension', 'skill', 'mcp', 'workflow'],
  },
  {
    id: 'agent_skills',
    slug: 'agent-skills',
    name: 'Agent Skills Standard',
    badge: 'PORTABLE SPEC',
    nativeTerm: 'Standard SKILL.md Package',
    description: 'Open, vendor-neutral directory specification using markdown instructions, references, and executable tool scripts.',
    officialDocUrl: 'https://github.com/anthropics/skills',
    installPatternSummary: 'Copy folder containing `SKILL.md` to your client skill directory or project workspace.',
    supportedTypes: ['skill', 'workflow', 'prompt_pack'],
  },
  {
    id: 'mcp_clients',
    slug: 'mcp-clients',
    name: 'MCP Compatible Clients',
    badge: 'MODEL CONTEXT PROTOCOL',
    nativeTerm: 'MCP Server',
    description: 'Universal context protocol connecting AI assistants (Claude Desktop, Cursor, Windsurf, Claude Code) to external tools and data sources.',
    officialDocUrl: 'https://modelcontextprotocol.io',
    installPatternSummary: 'Add JSON server entry with command and arguments to client `mcpServers` configuration.',
    supportedTypes: ['mcp', 'agent'],
  },
];

export const AI_CATEGORIES: AICategory[] = [
  {
    id: 'customer-research',
    slug: 'customer-research',
    name: 'Customer Research & VOC',
    tagline: 'Review mining, objection extraction, and emotional trigger synthesis.',
    description: 'Extract exact customer verbatims, friction points, and value drivers directly from raw support tickets, Amazon/G2 reviews, and interview transcripts.',
    iconName: 'Users',
    jobs: [
      { id: 'job-voc-mine', label: 'Mine Customer Reviews', query: 'customer reviews' },
      { id: 'job-objections', label: 'Extract Objections', query: 'objections' },
      { id: 'job-interviews', label: 'Synthesize Interviews', query: 'interview transcripts' },
      { id: 'job-reddit-sentiment', label: 'Analyze Reddit Sentiment', query: 'Reddit research' },
    ],
  },
  {
    id: 'cro',
    slug: 'cro',
    name: 'CRO & Landing Pages',
    tagline: 'Heuristic audits, friction diagnosis, and value proposition testing.',
    description: 'Audit above-the-fold clarity, identify cognitive load issues, evaluate conversion friction, and prioritize high-impact A/B testing hypotheses.',
    iconName: 'Zap',
    jobs: [
      { id: 'job-lp-audit', label: 'Audit Landing Page', query: 'landing page audit' },
      { id: 'job-friction', label: 'Diagnose Form & UX Friction', query: 'friction diagnosis' },
      { id: 'job-ab-hypo', label: 'Formulate A/B Hypotheses', query: 'experiment ideation' },
      { id: 'job-heuristic', label: 'Heuristic Evaluation', query: 'heuristic analysis' },
    ],
  },
  {
    id: 'copywriting',
    slug: 'copywriting',
    name: 'Conversion Copywriting',
    tagline: 'High-performing headlines, sales pages, proof hierarchies, and microcopy.',
    description: 'Turn dry features into clear benefits, write high-converting headlines, structure B2B proof hierarchies, and sharpen line-by-line readability.',
    iconName: 'PenTool',
    jobs: [
      { id: 'job-headlines', label: 'Generate Headline Angles', query: 'headline writing' },
      { id: 'job-sales-page', label: 'Structure Sales Pages', query: 'sales pages' },
      { id: 'job-copy-edit', label: 'Line-by-Line Editing', query: 'editing' },
      { id: 'job-proof-hierarchy', label: 'Organize Proof & Credibility', query: 'proof elements' },
    ],
  },
  {
    id: 'paid-media',
    slug: 'paid-media',
    name: 'Paid Media & Ad Creative',
    tagline: 'Meta, TikTok, and Google ad angles, hook variations, and creative briefs.',
    description: 'Systematically generate divergent ad angles, script UGC concepts, match ad hooks to landing page promises, and iterate on winning performance creatives.',
    iconName: 'Target',
    jobs: [
      { id: 'job-meta-angles', label: 'Write Meta Ad Angles', query: 'write Meta ads' },
      { id: 'job-creative-briefs', label: 'Generate Video Ad Briefs', query: 'creative briefs' },
      { id: 'job-hook-variations', label: 'Hook & Visual Variations', query: 'hooks' },
      { id: 'job-message-match', label: 'Ad-to-Page Message Match', query: 'message matching' },
    ],
  },
  {
    id: 'positioning',
    slug: 'positioning',
    name: 'Positioning & Messaging',
    tagline: 'Competitive differentiation, market category framing, and value pillars.',
    description: 'Apply battle-tested positioning frameworks (April Dunford, Clay Christensen) to establish clear competitive isolation and message architecture.',
    iconName: 'Compass',
    jobs: [
      { id: 'job-positioning-canvas', label: 'Build Positioning Canvas', query: 'positioning canvas' },
      { id: 'job-competitor-teardown', label: 'Dissect Competitor Claims', query: 'competitor research' },
      { id: 'job-category-frame', label: 'Category & Value Pillars', query: 'value proposition' },
    ],
  },
  {
    id: 'email',
    slug: 'email',
    name: 'Email & Retention',
    tagline: 'Lifecycle sequences, onboarding flows, and high-open subject lines.',
    description: 'Map out retention triggers, write high-converting welcome and abandonment sequences, and eliminate fluff from customer onboarding emails.',
    iconName: 'Mail',
    jobs: [
      { id: 'job-welcome-flow', label: 'Design Onboarding Sequence', query: 'email sequence' },
      { id: 'job-abandonment', label: 'Cart & Browse Recovery', query: 'abandonment email' },
      { id: 'job-subject-lines', label: 'Subject Line Variations', query: 'subject lines' },
    ],
  },
  {
    id: 'content',
    slug: 'content',
    name: 'SEO & Content Strategy',
    tagline: 'Topical authority maps, search intent briefs, and high-signal research.',
    description: 'Transform shallow keyword lists into rigorous content briefs that satisfy search intent, include expert insights, and withstand algorithm updates.',
    iconName: 'FileText',
    jobs: [
      { id: 'job-seo-brief', label: 'Build Content Brief', query: 'SEO brief' },
      { id: 'job-topical-cluster', label: 'Topical Authority Clusters', query: 'content strategy' },
      { id: 'job-expert-quotes', label: 'Synthesize Research & Case Studies', query: 'content research' },
    ],
  },
  {
    id: 'analytics',
    slug: 'analytics',
    name: 'Marketing Analytics & Ops',
    tagline: 'Funnel drop-off diagnosis, cohort analysis, and campaign telemetry.',
    description: 'Transform GA4 exports, Mixpanel funnels, and CRM records into actionable optimization priorities without manual spreadsheet wrangling.',
    iconName: 'BarChart3',
    jobs: [
      { id: 'job-funnel-dropoff', label: 'Analyze Funnel Drop-off', query: 'funnel analytics' },
      { id: 'job-attribution', label: 'Compare Channel Telemetry', query: 'marketing analytics' },
    ],
  },
];

export const AI_RESOURCES: AIResource[] = [
  {
    id: 'voc-research-pro',
    slug: 'voice-of-customer-research',
    name: 'Voice of Customer Research Pro',
    tagline: 'Extract raw verbatims, emotional triggers, and objections from reviews and interviews.',
    description: 'A deeply calibrated Skill that takes unprocessed G2/Amazon reviews, Gong/Fathom call transcripts, and Reddit threads to extract exact phrasing, emotional triggers, and unstated buying anxieties without hallucinating synthetic marketing fluff.',
    resourceType: 'skill',
    categories: ['customer-research', 'copywriting', 'cro'],
    useCases: ['Review Mining', 'Objection Extraction', 'Customer Language Dictionary', 'Landing Page Proof Input'],
    tags: ['VOC', 'Customer Research', 'Review Mining', 'Copywriting Evidence', 'Claude Code Skill'],
    author: {
      name: 'Conversion Insight Lab',
      url: 'https://github.com/conversion-insight-lab/voc-research-skill',
      handle: 'conversioninsight',
      verified: true,
    },
    source: {
      url: 'https://github.com/conversion-insight-lab/voc-research-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/conversion-insight-lab/voc-research-skill',
      owner: 'conversion-insight-lab',
      repo: 'voc-research-skill',
      starsCount: 840,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'editor_pick',
    curationScore: {
      overall: 9.6,
      practicalValue: 9.8,
      setupQuality: 9.5,
      documentation: 9.7,
      marketingRelevance: 9.9,
      maintenance: 9.2,
    },
    badges: ['EDITOR PICK', 'HIGH EVIDENCE', 'PORTABLE'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill (SKILL.md)',
        tested: true,
        testedVersion: 'v2.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/conversion-insight-lab/voc-research-skill/blob/main/SKILL.md'],
        notes: 'Verified running via ~/.claude/skills/voc-research. Invocable directly as `/voc-research`.',
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Directory',
        tested: true,
        testedVersion: 'v2.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/conversion-insight-lab/voc-research-skill/blob/main/CODEX.md'],
        notes: 'Loads skill definitions from .codex/skills/voc-research/ correctly.',
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'adaptable',
        nativeType: 'Gemini Extension Manifest',
        tested: true,
        testedVersion: 'v2.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/conversion-insight-lab/voc-research-skill/blob/main/gemini.json'],
        notes: 'Compatible via system instruction prompt adaptation or local tool registration.',
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Instruction',
        tested: true,
        testedVersion: 'v2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
        notes: 'Supports prompt-only workflow by pasting the full instruction set into Custom GPT builder.',
      },
    ],
    strengths: [
      'Extracts exact, unaltered customer verbatims with context tags (Problem, Hesitation, Outcome).',
      'Distinguishes between superficial complaints and deep buying friction.',
      'Generates a copy-pasteable "Customer Language Swipe File" organized by marketing stage.',
      'Rejects generic marketing adjectives and forces evidence citations from source text.',
    ],
    limitations: [
      'Cannot execute quantitative statistical regression on review frequency.',
      'Requires at least 10–15 raw reviews or 1 full transcript to produce reliable clustering.',
      'Does not scrape websites automatically; relies on provided text or CSV files.',
    ],
    bestFor: [
      'Mining G2, Amazon, Trustpilot, or Capterra reviews for conversion copy evidence',
      'Dissecting customer interview call recordings before rewriting a sales page',
      'Building an objection demolition table for B2B SaaS marketing',
    ],
    notFor: [
      'Replacing live qualitative customer interviews',
      'Keyword density or SEO volume research',
      'Automated ad bidding calculations',
    ],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: true,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
      notes: 'Operates purely on provided text inputs or local files within project boundaries. No external network telemetry.',
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install VOC Research Pro in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI v1.0.0+ installed', 'Terminal access on macOS/Linux/WSL'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Create the skills directory in your Claude config',
            command: 'mkdir -p ~/.claude/skills/voc-research',
            explanation: 'Ensures the global skill directory exists on your system.',
          },
          {
            stepNumber: 2,
            title: 'Download the certified SKILL.md bundle',
            command: 'curl -sSL https://raw.githubusercontent.com/conversion-insight-lab/voc-research-skill/main/SKILL.md -o ~/.claude/skills/voc-research/SKILL.md',
            explanation: 'Places the complete VOC taxonomy and extraction rules directly into Claude Code.',
          },
          {
            stepNumber: 3,
            title: 'Verify skill recognition',
            command: 'claude',
            explanation: 'Open Claude Code and test the prompt `/voc-research:status` or start analyzing transcripts.',
          },
        ],
        verification: {
          command: 'ls -la ~/.claude/skills/voc-research/SKILL.md',
          instructions: 'Check that the file exists and is approximately 14KB with full taxonomy tables.',
          expectedBehavior: 'Claude Code will acknowledge the VOC Research skill automatically on next session boot.',
        },
        uninstall: {
          command: 'rm -rf ~/.claude/skills/voc-research',
          steps: ['Delete the folder from ~/.claude/skills/'],
        },
        tested: true,
        testedVersion: '2.1.0',
        officialSources: [
          { name: 'Claude Code Skills Guide', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
        lastVerifiedAt: '2026-08-14',
      },
      codex: {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        title: 'Install VOC Research in OpenAI Codex',
        nativeType: 'Agent Skill Package',
        prerequisites: ['OpenAI Codex CLI or workspace environment'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Clone skill into workspace skills directory',
            command: 'mkdir -p .codex/skills && curl -sSL https://raw.githubusercontent.com/conversion-insight-lab/voc-research-skill/main/SKILL.md -o .codex/skills/voc-research.md',
            explanation: 'Adds the skill definition into your project repo.',
          },
        ],
        verification: {
          instructions: 'Start Codex session and prompt: "Use VOC research skill to analyze the reviews in ./reviews.txt"',
          expectedBehavior: 'Codex executes structured verbatim extraction categorized into Pains, Desires, and Objections.',
        },
        tested: true,
        officialSources: [{ name: 'Codex Agent Specs', url: 'https://platform.openai.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'voc-quick-start',
        title: 'Quick Evidence Extraction',
        description: 'Extract raw customer language without letting the AI write copy prematurely.',
        level: 'quick_start',
        useCase: 'Review Mining',
        prompt: `You are acting as a senior Voice of Customer researcher. Analyze the following raw customer feedback for {{PRODUCT}}:

RAW REVIEWS / TRANSCRIPT:
"""
{{REVIEWS}}
"""

TASK:
1. Extract 10 exact, word-for-word quotes describing the CORE PROBLEM before buying.
2. Extract 5 exact quotes describing the SPECIFIC HESITATION or OBJECTION they felt.
3. Extract 5 exact quotes describing the AHA MOMENT or RELIEF after using {{PRODUCT}}.
4. Categorize recurring vocabulary (slang, metaphors, emotional adjectives).

DO NOT synthesize or rewrite copy yet. Provide ONLY the categorized verbatim evidence table with frequency indicators.`,
        variables: [
          { name: 'PRODUCT', label: 'Product / Service Name', placeholder: 'e.g. ModernCRM for Founders', defaultValue: 'ModernCRM' },
          { name: 'REVIEWS', label: 'Raw Reviews / Transcripts Text', placeholder: 'Paste 10+ reviews, G2 snippets, or sales call transcripts here...' },
        ],
        whyItWorks: 'Stops LLMs from immediately jumping to generic marketing fluff by enforcing strict quote isolation and classification before any creative writing begins.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
      {
        id: 'voc-objection-matrix',
        title: 'Objection Demolition Table',
        description: 'Map customer buying friction directly into proof requirements and counter-angles.',
        level: 'real_work',
        useCase: 'Objection Handling',
        prompt: `Using the Voice of Customer research methodology, process these customer objections for {{PRODUCT}} targeting {{AUDIENCE}}:

INPUT EVIDENCE:
"""
{{REVIEWS}}
"""

Generate an Objection Demolition Table with 5 columns:
1. [Objection Category] (Price, Switching Cost, Trust, Complexity, Implementation Time)
2. [Exact Customer Verbatim] (Word-for-word quote showing how they actually express it)
3. [Underlying Fear] (The unspoken risk they are trying to protect against)
4. [Required Proof Type] (Metric, Demo video, Screenshot, Case Study, Guarantee)
5. [Direct Response Angle] (A 2-sentence positioning counter-statement addressing the fear head-on)`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. CloudSync Pro', defaultValue: 'CloudSync Pro' },
          { name: 'AUDIENCE', label: 'Target Persona', placeholder: 'e.g. Head of Engineering at Series A startups', defaultValue: 'Engineering Directors' },
          { name: 'REVIEWS', label: 'Objection Excerpts', placeholder: 'Paste customer hesitation quotes or sales call friction points...' },
        ],
        whyItWorks: 'Connects qualitative psychology directly to concrete conversion proof requirements, making sales page outlining effortless.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
      {
        id: 'voc-landing-page-inputs',
        title: 'Full Landing Page Message Architecture Matrix',
        description: 'Transform mined evidence into above-the-fold value props, feature-benefit bridges, and social proof anchors.',
        level: 'advanced',
        useCase: 'Landing Page Proof Input',
        prompt: `Convert the extracted VOC evidence for {{PRODUCT}} into a complete Landing Page Message Architecture for {{AUDIENCE}}:

VOC SOURCE DATA:
"""
{{REVIEWS}}
"""

REQUIREMENTS:
1. Primary Value Proposition Statement based strictly on the #1 stated customer outcome.
2. Three "Pain → Bridge → Capability" narrative blocks using customer vocabulary.
3. 5 High-Impact Headline Variations (1 Pain-Led, 1 Outcome-Led, 1 Speed-Led, 1 Counter-Intuitive, 1 Social Proof-Led).
4. Social Proof placement guide indicating where to place specific quote clusters for maximum trust.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'Product Name', defaultValue: 'InvoicerApp' },
          { name: 'AUDIENCE', label: 'Target Audience', placeholder: 'Target Audience', defaultValue: 'Freelance Designers' },
          { name: 'REVIEWS', label: 'Extracted VOC Data', placeholder: 'Paste your categorized quotes...' },
        ],
        whyItWorks: 'Eliminates guesswork in landing page wireframing by deriving every single header and copy section directly from real customer verbatims.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    alternatives: [
      {
        name: 'Reddit Sentiment & Objection Miner MCP',
        slug: 'mcp-market-researcher',
        reason: 'Choose this if you need automated live Reddit scraping rather than manual transcript ingestion.',
      },
      {
        name: 'Objection Demolition Matrix Skill',
        slug: 'objection-demolition-matrix',
        reason: 'Choose this if you already have the evidence and just need fast sales page objection structuring.',
      },
    ],
    collections: ['the-copywriter-stack', 'customer-research', 'claude-code-for-marketers'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'landing-page-cro-audit',
    slug: 'landing-page-cro-audit',
    name: 'Landing Page CRO Heuristic Auditor',
    tagline: 'Diagnose clarity gaps, cognitive load, and friction on above-the-fold and offer sections.',
    description: 'A heuristic evaluation framework based on MECLABS conversion probability formulas and cognitive load theory. Evaluates value proposition clarity, relevance, incentive vs friction ratio, and anxiety triggers on B2B and DTC landing pages.',
    resourceType: 'plugin',
    categories: ['cro', 'copywriting'],
    useCases: ['Landing Page Audit', 'Friction Diagnosis', 'Heuristic Evaluation', 'Value Prop Scoring'],
    tags: ['CRO', 'Landing Page Audit', 'MECLABS', 'Conversion Optimization', 'Friction Analysis'],
    author: {
      name: 'CRO Benchmark Collective',
      url: 'https://github.com/cro-benchmark/landing-page-auditor',
      handle: 'crobenchmark',
      verified: true,
    },
    source: {
      url: 'https://github.com/cro-benchmark/landing-page-auditor',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/cro-benchmark/landing-page-auditor',
      owner: 'cro-benchmark',
      repo: 'landing-page-auditor',
      starsCount: 1120,
      defaultBranch: 'main',
    },
    license: 'Apache-2.0',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'editor_pick',
    curationScore: {
      overall: 9.7,
      practicalValue: 9.9,
      setupQuality: 9.4,
      documentation: 9.6,
      marketingRelevance: 9.9,
      maintenance: 9.5,
    },
    badges: ['EDITOR PICK', 'BEST FOR CRO', 'VERIFIED'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Plugin (/plugin)',
        tested: true,
        testedVersion: 'v1.4.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/cro-benchmark/landing-page-auditor/blob/main/plugin.json'],
        notes: 'Seamlessly installed via Claude Code skill or plugin manifest.',
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Pack',
        tested: true,
        testedVersion: 'v1.4.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
        notes: 'Fully verified in OpenAI Codex workspace environments.',
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini CLI Extension',
        tested: true,
        testedVersion: 'v1.4.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
        notes: 'Executes clean heuristic scoring via Gemini CLI.',
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT Heuristic Auditor',
        tested: true,
        testedVersion: 'v1.3',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
        notes: 'Can be used as a system instruction prompt inside ChatGPT Plus.',
      },
    ],
    strengths: [
      'Scoring formula breaks conversion into 5 quantifiable vectors (Clarity, Relevance, Value, Friction, Anxiety).',
      'Specifically tests whether the headline passes the "5-Second Stranger Test".',
      'Flags "Curse of Knowledge" jargon and vague enterprise abstractions.',
      'Outputs prioritized A/B testing hypotheses with ICE scoring (Impact, Confidence, Ease).',
    ],
    limitations: [
      'Evaluates textual and structural heuristics, not real-time visual eye-tracking heatmaps.',
      'Does not replace running actual split tests in tools like VWO or LaunchDarkly.',
      'Requires page copy or HTML input.',
    ],
    bestFor: [
      'Pre-launch landing page copy and structure audits',
      'Diagnosing sudden conversion drops on paid traffic landing pages',
      'Generating high-confidence A/B test variations with measurable rationale',
    ],
    notFor: [
      'Automated CSS/design implementation',
      'Media spend pacing',
      'Backend checkout payment gateway debugging',
    ],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
      notes: 'Read-only analyzer. Zero external calls or execution privileges required.',
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install CRO Auditor in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI v1.0.0+'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download the CRO Auditor Skill',
            command: 'mkdir -p ~/.claude/skills/cro-auditor && curl -sSL https://raw.githubusercontent.com/cro-benchmark/landing-page-auditor/main/SKILL.md -o ~/.claude/skills/cro-auditor/SKILL.md',
            explanation: 'Installs the complete MECLABS heuristic rubric into Claude Code.',
          },
        ],
        verification: {
          command: 'claude',
          instructions: 'Ask Claude Code: "Audit the copy in ./landing-page.html using the CRO Auditor skill"',
          expectedBehavior: 'Returns a 5-dimension scorecard with specific line-by-line rewrite suggestions.',
        },
        uninstall: {
          command: 'rm -rf ~/.claude/skills/cro-auditor',
          steps: ['Remove the directory ~/.claude/skills/cro-auditor'],
        },
        tested: true,
        testedVersion: '1.4.0',
        officialSources: [
          { name: 'Claude Code Documentation', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'cro-hero-audit',
        title: 'Above-the-Fold 5-Second Test & Clarity Audit',
        description: 'Audit the headline, subheadline, CTA, and visual promise above the fold.',
        level: 'quick_start',
        useCase: 'Landing Page Audit',
        prompt: `Perform a rigorous Above-the-Fold CRO Heuristic Audit for {{PRODUCT}} targeting {{AUDIENCE}}:

ABOVE-THE-FOLD COPY:
"""
Headline: {{HEADLINE}}
Subhead: {{SUBHEAD}}
CTA Button Text: {{CTA_TEXT}}
Supporting Proof: {{PROOF}}
"""

EVALUATION CRITERIA:
1. 5-Second Stranger Test (0-10): Can a cold visitor tell what it is, who it is for, and the primary payoff in 5 seconds?
2. Specificity vs Fluff (0-10): Are there vague filler words ("ultimate", "seamless", "next-gen", "empower")?
3. Friction / Cognitive Load: Is the CTA low-risk or high-commitment?
4. Clarity Grade: A / B / C / D / F with exact diagnostic explanation.

REWRITE RECOMMENDATION:
Provide 3 sharpened Above-The-Fold combinations (Headline + Subhead + CTA) that elevate Clarity and reduce cognitive hesitation.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. TaskPilot CRM', defaultValue: 'TaskPilot' },
          { name: 'AUDIENCE', label: 'Target Visitor', placeholder: 'e.g. Solo SaaS Founders', defaultValue: 'Solo Founders' },
          { name: 'HEADLINE', label: 'Current Headline', placeholder: 'Paste your current headline...', defaultValue: 'The smartest way to scale your customer relationships' },
          { name: 'SUBHEAD', label: 'Current Subheadline', placeholder: 'Paste current subhead...', defaultValue: 'All-in-one automation for growing teams.' },
          { name: 'CTA_TEXT', label: 'Current CTA Button', placeholder: 'e.g. Start Free Trial', defaultValue: 'Start Free Trial' },
          { name: 'PROOF', label: 'Social Proof Microcopy', placeholder: 'e.g. Trusted by 2,000+ founders', defaultValue: 'Trusted by 2,000+ teams' },
        ],
        whyItWorks: 'Directly tackles the #1 reason landing pages bounce: lack of instant comprehension and high-friction generic CTAs.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
      {
        id: 'cro-full-page-teardown',
        title: 'Full Conversion Friction Diagnostic',
        description: 'Comprehensive page teardown identifying friction leaks, trust gaps, and offer weakness.',
        level: 'real_work',
        useCase: 'Friction Diagnosis',
        prompt: `Execute a full MECLABS-grounded Conversion Rate Optimization Diagnostic for the following landing page copy:

PAGE COPY CONTENT:
"""
{{PAGE_COPY}}
"""

AUDIENCE CONTEXT:
Target: {{AUDIENCE}}
Primary Goal: {{GOAL}}

AUDIT RUBRIC:
1. MOTIVATION CHECK: Does the page align with the dominant initial search/ad intent?
2. VALUE PROPOSITION FORCE: Is the core benefit unique, defensible, and obvious?
3. INCENTIVE VS FRICTION: What cognitive, operational, or financial friction points exist before the signup?
4. ANXIETY TRIGGERS: What unaddressed fears exist (billing surprises, setup headaches, data security)?
5. ACTION PLAN: Deliver a prioritized 5-step A/B test backlog ranked by ICE Score (Impact, Confidence, Ease).`,
        variables: [
          { name: 'AUDIENCE', label: 'Target Persona', placeholder: 'e.g. SMB Ecommerce Store Owners', defaultValue: 'Ecommerce Founders' },
          { name: 'GOAL', label: 'Conversion Goal', placeholder: 'e.g. Book a 15-min demo', defaultValue: 'Book a demo' },
          { name: 'PAGE_COPY', label: 'Full Page Text Content', placeholder: 'Paste headline, body, feature blocks, pricing, and FAQ...' },
        ],
        whyItWorks: 'Provides a structured consultancy-level conversion audit with actionable engineering tickets rather than vague subjective opinions.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    alternatives: [
      {
        name: 'CRO Heuristic Friction Checker',
        slug: 'cro-heuristic-friction-checker',
        reason: 'Choose this if you are optimizing checkout funnels or multi-step lead capture forms specifically.',
      },
    ],
    collections: ['cro-research-kit', 'the-copywriter-stack', 'claude-code-for-marketers'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'ad-creative-angle-generator',
    slug: 'ad-creative-angle-generator',
    name: 'Performance Ad Creative & Hook Matrix',
    tagline: 'Generate 12 distinct performance marketing angles, visual hooks, and script concepts.',
    description: 'A creative strategy engine that prevents ad fatigue by generating divergent psychological angles across 6 core frameworks: Problem-Agitation, Us-vs-Them, Before/After, The Unspoken Truth, Metric Shock, and Ego Affinity.',
    resourceType: 'skill',
    categories: ['paid-media', 'copywriting', 'creative-strategy'],
    useCases: ['Meta Ads Angles', 'Creative Briefs', 'Hook Variations', 'TikTok/UGC Scripts'],
    tags: ['Meta Ads', 'Paid Social', 'Performance Creative', 'Ad Angles', 'UGC Scripts'],
    author: {
      name: 'AdAngle Labs',
      url: 'https://github.com/adangle-labs/creative-angle-skill',
      handle: 'adanglelabs',
      verified: true,
    },
    source: {
      url: 'https://github.com/adangle-labs/creative-angle-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/adangle-labs/creative-angle-skill',
      owner: 'adangle-labs',
      repo: 'creative-angle-skill',
      starsCount: 630,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.3,
      practicalValue: 9.6,
      setupQuality: 9.2,
      documentation: 9.4,
      marketingRelevance: 9.7,
      maintenance: 8.9,
    },
    badges: ['TESTED ON CLAUDE', 'TOP AD ENGINE'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/adangle-labs/creative-angle-skill/blob/main/SKILL.md'],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Directory',
        tested: true,
        testedVersion: 'v1.2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini CLI Extension',
        tested: true,
        testedVersion: 'v1.2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Instruction',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Forces 6 distinct psychological vectors instead of generating 10 slight variations of the same headline.',
      'Pairs every copy angle with a specific visual execution concept and 3-second hook trigger.',
      'Adheres to Meta and TikTok advertising policy constraints (avoids deceptive claims and banned triggers).',
    ],
    limitations: [
      'Does not generate video/image assets directly; generates detailed creative briefs and script copy.',
      'Requires baseline knowledge of the product value proposition.',
    ],
    bestFor: [
      'Performance creative strategists building monthly Meta/TikTok test pipelines',
      'Copywriters needing 20+ hook concepts for static and video ads',
      'Message matching ad hooks to landing page variants',
    ],
    notFor: [
      'Media buying budget allocation',
      'Google Search keyword match typing',
    ],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Ad Creative Angle Generator in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Install skill bundle',
            command: 'mkdir -p ~/.claude/skills/ad-angles && curl -sSL https://raw.githubusercontent.com/adangle-labs/creative-angle-skill/main/SKILL.md -o ~/.claude/skills/ad-angles/SKILL.md',
            explanation: 'Installs the creative angle framework into Claude Code.',
          },
        ],
        verification: {
          command: 'claude',
          instructions: 'Prompt: "Generate 6 Meta ad angles for my product using the ad-angles skill"',
          expectedBehavior: 'Generates structured angle matrix with Visual Hook, Primary Text, Headline, and Subtext.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Skills', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'ad-hook-matrix',
        title: '12-Vector Creative Angle & Hook Matrix',
        description: 'Generate 12 diverse paid social ad angles across 6 psychological frameworks.',
        level: 'real_work',
        useCase: 'Meta Ads Angles',
        prompt: `You are a Principal Performance Creative Strategist. Generate a 12-Angle Paid Social Creative Matrix for {{PRODUCT}} targeting {{AUDIENCE}}:

PRODUCT CONTEXT:
Offer: {{OFFER}}
Core Problem Solved: {{PROBLEM}}
Primary Competitor / Old Way: {{OLD_WAY}}

GENERATE 2 ANGLES FOR EACH OF THESE 6 FRAMEWORKS:
1. THE ANNOYING FRICTION (Focus on the micro-annoyance of current solutions)
2. THE UNFAIR ADVANTAGE (Focus on disproportionate speed or outcome)
3. THE MATH / ROI REVELATION (Focus on the hidden financial/time cost of waiting)
4. US VS THEM (Direct contrast without naming competitors deceptively)
5. THE VULNERABLE TRUTH (Confessional founder or power-user insight)
6. THE SPECIFIC METRIC PROOF (Grounded in a believable benchmark number)

FOR EACH ANGLE, OUTPUT:
- [Angle Name]
- [Visual / UGC Scene Direction] (3-second visual hook)
- [On-Screen Hook Text] (Under 7 words)
- [Primary Ad Text] (2-3 punchy sentences with line breaks)
- [Ad Headline] (Under 5 words)
- [Landing Page Handoff Anchor] (How the page must echo the ad promise)`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. LeadPulse', defaultValue: 'LeadPulse' },
          { name: 'AUDIENCE', label: 'Target Audience', placeholder: 'e.g. B2B Sales Leaders', defaultValue: 'B2B Sales Leaders' },
          { name: 'OFFER', label: 'Core Offer', placeholder: 'e.g. 14-day free trial with automated pipeline enrichment', defaultValue: 'Automated Pipeline Enrichment' },
          { name: 'PROBLEM', label: 'Core Problem', placeholder: 'e.g. Reps spend 4 hours a day manually researching LinkedIn leads', defaultValue: 'Manual lead research takes 4 hours daily' },
          { name: 'OLD_WAY', label: 'Old Way / Status Quo', placeholder: 'e.g. Clunky ZoomInfo spreadsheets and copy-pasting', defaultValue: 'Clunky spreadsheets and manual lookups' },
        ],
        whyItWorks: 'Directly eliminates ad fatigue by giving performance teams 12 psychologically distinct creative vectors ready for production.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['meta-ads-workflow', 'the-copywriter-stack', 'claude-code-for-marketers'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'positioning-canvas-synthesizer',
    slug: 'positioning-canvas-synthesizer',
    name: 'Product Positioning Canvas Synthesizer',
    tagline: 'Apply the April Dunford 5-component positioning engine to carve out competitive isolation.',
    description: 'A strategic framework skill designed to break products out of crowded categories. Synthesizes competitive alternatives, differentiated capabilities, value vectors, target customer segments, and market category framing.',
    resourceType: 'skill',
    categories: ['positioning', 'brand', 'copywriting'],
    useCases: ['Positioning Canvas', 'Category Framing', 'Value Proposition', 'Competitor Teardown'],
    tags: ['Positioning', 'April Dunford', 'Brand Strategy', 'Product Marketing', 'Category Creation'],
    author: {
      name: 'Strategic PMM Guild',
      url: 'https://github.com/pmm-guild/positioning-skill',
      handle: 'pmmguild',
      verified: true,
    },
    source: {
      url: 'https://github.com/pmm-guild/positioning-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/pmm-guild/positioning-skill',
      owner: 'pmm-guild',
      repo: 'positioning-skill',
      starsCount: 780,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'editor_pick',
    curationScore: {
      overall: 9.5,
      practicalValue: 9.7,
      setupQuality: 9.3,
      documentation: 9.6,
      marketingRelevance: 9.8,
      maintenance: 9.1,
    },
    badges: ['EDITOR PICK', 'STRATEGIC DEPTH'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v2.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/pmm-guild/positioning-skill/blob/main/SKILL.md'],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Directory',
        tested: true,
        testedVersion: 'v2.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Instruction',
        tested: true,
        testedVersion: 'v1.5',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'adaptable',
        nativeType: 'Gemini CLI Extension',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Identifies the "True Competitive Alternative" (which is usually a spreadsheet or doing nothing, not just direct rivals).',
      'Transforms feature lists into verified value drivers that specific segments care about.',
      'Generates defensible category positioning statements without generic buzzwords.',
    ],
    limitations: [
      'Cannot validate customer willingness-to-pay without user-supplied qualitative data.',
      'Requires honest assessment of actual product capabilities.',
    ],
    bestFor: [
      'Founders and PMMs repositioning a stagnant SaaS or service',
      'Preparing messaging before a major website overhaul',
      'Differentiating in heavily saturated markets',
    ],
    notFor: [
      'Writing short-form ad microcopy',
      'Social media meme creation',
    ],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Positioning Synthesizer in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Install Positioning Skill bundle',
            command: 'mkdir -p ~/.claude/skills/positioning && curl -sSL https://raw.githubusercontent.com/pmm-guild/positioning-skill/main/SKILL.md -o ~/.claude/skills/positioning/SKILL.md',
            explanation: 'Installs the Dunford positioning engine directly into Claude Code.',
          },
        ],
        verification: {
          command: 'claude',
          instructions: 'Ask Claude Code: "Run the positioning canvas synthesizer on my product notes in ./product.md"',
          expectedBehavior: 'Outputs complete 5-pillar positioning matrix with value pillars and category framing.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Docs', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'positioning-5-pillar',
        title: 'April Dunford 5-Pillar Positioning Canvas',
        description: 'Derive competitive alternatives, differentiated features, customer value, and category framing.',
        level: 'real_work',
        useCase: 'Positioning Canvas',
        prompt: `Execute a rigorous 5-Pillar Positioning Strategy Session for {{PRODUCT}}:

PRODUCT INPUTS:
What it is: {{DESCRIPTION}}
Who currently buys: {{CURRENT_USERS}}
What they used before: {{PREVIOUS_SOLUTION}}
Unique technical capabilities: {{CAPABILITIES}}

STEP 1: TRUE COMPETITIVE ALTERNATIVES
Identify the real alternative if {{PRODUCT}} disappeared tomorrow (include status quo, internal manual processes, and key direct competitors).

STEP 2: DIFFERENTIATED CAPABILITIES
List only features that the alternatives CANNOT easily replicate.

STEP 3: VALUE CLUSTERS FOR CUSTOMERS
Translate each differentiated capability into business/emotional value (What does this unlock for the user?).

STEP 4: BEST-FIT TARGET SEGMENT
Define the exact profile of customer who cares *desperately* about this specific value cluster.

STEP 5: MARKET CATEGORY & CONTEXT
Determine the optimal category frame: Existing Category, Sub-segment of Existing, or New Category Framing.

OUTPUT:
Deliver a complete Positioning Summary Matrix and a 1-sentence Core Positioning Anchor.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. FleetOps', defaultValue: 'FleetOps' },
          { name: 'DESCRIPTION', label: 'Short Product Description', placeholder: 'e.g. Automated maintenance forecasting for logistics fleets', defaultValue: 'Automated maintenance forecasting for logistics fleets' },
          { name: 'CURRENT_USERS', label: 'Current Best Customers', placeholder: 'e.g. Regional trucking companies with 50-200 vehicles', defaultValue: 'Regional fleet operations managers' },
          { name: 'PREVIOUS_SOLUTION', label: 'What they used before', placeholder: 'e.g. Excel maintenance logs + mechanic phone calls', defaultValue: 'Excel spreadsheets and reactive repairs' },
          { name: 'CAPABILITIES', label: 'Unique Capabilities', placeholder: 'e.g. Telematics-powered predictive parts failure alerts', defaultValue: 'Real-time OBD-II sensor anomaly prediction' },
        ],
        whyItWorks: 'Follows proven market strategy principles to eliminate feature dumping and anchor the product firmly in a defensible niche.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['the-copywriter-stack', 'solo-marketer-starter-pack'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'objection-demolition-matrix',
    slug: 'objection-demolition-matrix',
    name: 'Sales Page & B2B Objection Demolition Matrix',
    tagline: 'Systematically map every purchase anxiety into proof assets, risk reversals, and FAQ copy.',
    description: 'A tactical conversion copywriting skill focused exclusively on dismantling high-friction buying friction. Bridges the gap between sales objections heard on demos and the exact copy sections required on pricing and sales pages.',
    resourceType: 'skill',
    categories: ['copywriting', 'cro'],
    useCases: ['Objection Handling', 'Sales Pages', 'Proof Hierarchy', 'FAQ Construction'],
    tags: ['Objection Handling', 'Sales Page Copy', 'Risk Reversal', 'B2B Copywriting'],
    author: {
      name: 'Conversion Copy Academy',
      url: 'https://github.com/conversion-copy/objection-matrix-skill',
      handle: 'conversioncopy',
      verified: true,
    },
    source: {
      url: 'https://github.com/conversion-copy/objection-matrix-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/conversion-copy/objection-matrix-skill',
      owner: 'conversion-copy',
      repo: 'objection-matrix-skill',
      starsCount: 490,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.2,
      practicalValue: 9.4,
      setupQuality: 9.1,
      documentation: 9.3,
      marketingRelevance: 9.6,
      maintenance: 8.8,
    },
    badges: ['EASIEST SETUP', 'HIGH UTILITY'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Pack',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini Extension',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Prompt',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Categorizes friction into 5 universal categories: Price/Value, Inertia/Effort, Fear of Looking Foolish, Technical Risk, and Timing.',
      'Drafts persuasive FAQ answers that sound conversational rather than defensive.',
      'Prescribes specific guarantee and risk-reversal structures matching the purchase tier.',
    ],
    limitations: [
      'Requires known customer objections or demo call feedback as starting inputs.',
    ],
    bestFor: [
      'Optimizing B2B sales pages and checkout flows',
      'Transforming generic FAQs into conversion boosters',
      'Structuring risk-reversals and trial guarantee copy',
    ],
    notFor: ['SEO keyword research'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Objection Matrix in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Install Skill',
            command: 'mkdir -p ~/.claude/skills/objection-matrix && curl -sSL https://raw.githubusercontent.com/conversion-copy/objection-matrix-skill/main/SKILL.md -o ~/.claude/skills/objection-matrix/SKILL.md',
            explanation: 'Installs the objection mapping skill.',
          },
        ],
        verification: {
          instructions: 'Call `/objection-matrix` with your product objections list.',
          expectedBehavior: 'Returns complete proof asset mapping and FAQ copy blocks.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Documentation', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'objection-demolition-prompt',
        title: 'Objection-to-Proof Sales Page Conversion Matrix',
        description: 'Map 6 common objections into direct proof elements, visual evidence, and risk reversals.',
        level: 'quick_start',
        useCase: 'Objection Handling',
        prompt: `Convert these sales objections for {{PRODUCT}} into high-converting sales page proof blocks:

OBJECTIONS IDENTIFIED:
"""
{{OBJECTIONS}}
"""

PRODUCT CONTEXT:
Price Point / Model: {{PRICE}}
Target Decision Maker: {{DECISION_MAKER}}

OUTPUT MATRIX:
For each objection, provide:
1. The Real Hidden Anxieties (What are they secretly worried will happen if they buy?)
2. The Proof Anchor (What exact evidence dispels it: demo GIF, benchmark data, quote, security certification?)
3. On-Page Copy Block (A 3-sentence section addressing it directly)
4. Strategic FAQ Item (Question & transparent, disarming Answer)`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. DataVault B2B', defaultValue: 'DataVault B2B' },
          { name: 'PRICE', label: 'Pricing / Contract Tier', placeholder: 'e.g. $499/mo annual contract', defaultValue: '$299/mo' },
          { name: 'DECISION_MAKER', label: 'Decision Maker Role', placeholder: 'e.g. VP of Security & Compliance', defaultValue: 'VP of Engineering' },
          { name: 'OBJECTIONS', label: 'List of Stated Objections', placeholder: 'e.g. 1. It will take months to migrate our database. 2. What if our engineers hate the syntax?', defaultValue: '1. Implementation will take too much engineering time. 2. What if our data breaks?' },
        ],
        whyItWorks: 'Transforms objections from sales obstacles into compelling on-page selling points and transparent FAQs.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['the-copywriter-stack', 'cro-research-kit'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'seo-content-brief-architect',
    slug: 'seo-content-brief-architect',
    name: 'Search Intent & Entity-Optimized Content Brief Architect',
    tagline: 'Construct high-signal, non-generic SEO briefs that satisfy search intent and topical authority.',
    description: 'A content strategy skill that builds comprehensive editorial briefs. Maps user search intent stages, primary entities, required expert interview questions, counter-intuitive angles, and internal linking opportunities.',
    resourceType: 'skill',
    categories: ['content', 'seo'],
    useCases: ['SEO Brief', 'Content Strategy', 'Topical Authority', 'Search Intent Mapping'],
    tags: ['SEO', 'Content Strategy', 'Content Briefs', 'Search Intent', 'Topical Authority'],
    author: {
      name: 'Intent First SEO',
      url: 'https://github.com/intent-first-seo/brief-architect-skill',
      handle: 'intentfirst',
      verified: true,
    },
    source: {
      url: 'https://github.com/intent-first-seo/brief-architect-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/intent-first-seo/brief-architect-skill',
      owner: 'intent-first-seo',
      repo: 'brief-architect-skill',
      starsCount: 520,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.1,
      practicalValue: 9.3,
      setupQuality: 9.0,
      documentation: 9.2,
      marketingRelevance: 9.4,
      maintenance: 8.7,
    },
    badges: ['TESTED ON CLAUDE', 'CONTENT SUITE'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.3.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Pack',
        tested: true,
        testedVersion: 'v1.3.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini Extension',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Eliminates generic AI-generated filler by requiring specific proprietary frameworks and counter-arguments in every section.',
      'Identifies the exact SERP intent gap that competitors have failed to answer.',
      'Includes structured data and FAQ schema requirements.',
    ],
    limitations: [
      'Does not query live Google SERP APIs directly without external search grounding setup.',
    ],
    bestFor: [
      'Content leads managing freelance writers or internal writing teams',
      'Building in-depth pillar articles and bottom-of-funnel comparison guides',
      'High-authority B2B search content',
    ],
    notFor: ['Automated 1-click blog post publishing'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: true,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install SEO Brief Architect in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download Skill Bundle',
            command: 'mkdir -p ~/.claude/skills/seo-brief-architect && curl -sSL https://raw.githubusercontent.com/intent-first-seo/brief-architect-skill/main/SKILL.md -o ~/.claude/skills/seo-brief-architect/SKILL.md',
            explanation: 'Installs the SEO brief generator.',
          },
        ],
        verification: {
          instructions: 'Run `/seo-brief` in your project terminal.',
          expectedBehavior: 'Generates structured editorial brief with H2/H3 outline and entity requirements.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Docs', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'seo-editorial-brief',
        title: 'Comprehensive High-Authority SEO Content Brief',
        description: 'Generate an exhaustive brief for a high-intent keyword that stands out on page 1.',
        level: 'real_work',
        useCase: 'SEO Brief',
        prompt: `Create an exhaustive, high-signal SEO Content Brief for:

TARGET KEYWORD: {{KEYWORD}}
TARGET PERSONA: {{AUDIENCE}}
BUSINESS CONVERSION GOAL: {{CONVERSION_GOAL}}

BRIEF SECTIONS REQUIRED:
1. SEARCH INTENT DISSECTION (Informational, Commercial Investigation, or Transactional? What does the searcher actually need to accomplish?)
2. THE INFORMATION GAIN ANGLE (What unique viewpoint, original data point, or counter-intuitive insight must this article introduce to beat existing generic results?)
3. DETAILED H2 & H3 OUTLINE (Include specific guidance for what each subsection must cover, key definitions, and specific pitfalls to avoid)
4. MANDATORY ENTITIES & SEMANTIC TERMS TO COVER
5. PRODUCT INTEGRATION PLAYBOOK (How to naturally introduce {{PRODUCT}} as the solution without turning the post into an aggressive sales pitch)
6. META TITLE & DESCRIPTION (3 high-CTR variations)`,
        variables: [
          { name: 'KEYWORD', label: 'Primary Keyword', placeholder: 'e.g. b2b saas churn reduction strategies', defaultValue: 'b2b saas churn reduction' },
          { name: 'AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Heads of Customer Success at SaaS companies', defaultValue: 'VP of Customer Success' },
          { name: 'CONVERSION_GOAL', label: 'Conversion Goal', placeholder: 'e.g. Download churn calculation template or book demo', defaultValue: 'Download SaaS Churn Model Template' },
          { name: 'PRODUCT', label: 'Your Product/Service', placeholder: 'e.g. ChurnPulse Analytics', defaultValue: 'ChurnPulse' },
        ],
        whyItWorks: 'Ensures content writers produce genuinely valuable, high-retention assets rather than fluff that bounces visitors.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['content-research-stack', 'solo-marketer-starter-pack'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'email-lifecycle-sequencer',
    slug: 'email-lifecycle-sequencer',
    name: 'Lifecycle & Retention Email Sequencer',
    tagline: 'Architect high-converting onboarding, trial-to-paid, and win-back email sequences.',
    description: 'A direct-response email marketing skill designed for SaaS, DTC, and creator products. Structures time-decay sequences, behavioral trigger emails, and high-open curiosity subject lines that avoid spam filters.',
    resourceType: 'skill',
    categories: ['email', 'copywriting', 'cro'],
    useCases: ['Email Sequences', 'Onboarding Flows', 'Cart Recovery', 'Subject Line Testing'],
    tags: ['Email Marketing', 'Lifecycle', 'Retention', 'DTC Email', 'SaaS Onboarding'],
    author: {
      name: 'Retention Pulse Lab',
      url: 'https://github.com/retention-pulse/email-sequencer-skill',
      handle: 'retentionpulse',
      verified: true,
    },
    source: {
      url: 'https://github.com/retention-pulse/email-sequencer-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/retention-pulse/email-sequencer-skill',
      owner: 'retention-pulse',
      repo: 'email-sequencer-skill',
      starsCount: 610,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.3,
      practicalValue: 9.5,
      setupQuality: 9.1,
      documentation: 9.4,
      marketingRelevance: 9.6,
      maintenance: 8.9,
    },
    badges: ['TESTED ON CLAUDE', 'EMAIL STACK'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill Pack',
        tested: true,
        testedVersion: 'v1.2.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Instruction',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Each email has exactly 1 micro-conversion goal rather than 5 competing links.',
      'Includes preview text and plain-text vs HTML formatting recommendations.',
      'Maps emotional journey from day 1 curiosity to day 14 urgency.',
    ],
    limitations: [
      'Does not interface directly with ESP API keys (Klaviyo, Postmark, Customer.io).',
    ],
    bestFor: [
      'SaaS trial-to-paid conversion sequences',
      'High-ticket B2B sales nurture flows',
      'Ecommerce browse and cart abandonment recovery',
    ],
    notFor: ['Scraping cold email lists without consent'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Email Sequencer in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Install Skill',
            command: 'mkdir -p ~/.claude/skills/email-sequencer && curl -sSL https://raw.githubusercontent.com/retention-pulse/email-sequencer-skill/main/SKILL.md -o ~/.claude/skills/email-sequencer/SKILL.md',
            explanation: 'Installs the email sequencer skill.',
          },
        ],
        verification: {
          instructions: 'Run `/email-sequencer` in terminal.',
          expectedBehavior: 'Ready to architect multi-part email workflows.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Guide', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'email-onboarding-5part',
        title: '5-Part SaaS Trial-to-Paid Conversion Sequence',
        description: 'Design a 5-step onboarding sequence that accelerates time-to-value and converts free trials.',
        level: 'real_work',
        useCase: 'Email Sequences',
        prompt: `Draft a complete 5-Part Trial-to-Paid Email Onboarding Sequence for {{PRODUCT}}:

PRODUCT DETAILS:
Target User: {{AUDIENCE}}
Core "Aha Moment" / Fast Win: {{AHA_MOMENT}}
Trial Length: {{TRIAL_DAYS}} days
Key Hesitation: {{COMMON_FRICTION}}

STRUCTURE:
- Email 1 (Day 0 - Immediate): The Fast Win (Get to the Aha moment in 3 clicks, zero marketing fluff)
- Email 2 (Day 2): The Case Study & Hidden Shortcut (Show how a peer saved hours)
- Email 3 (Day 5): Overcoming {{COMMON_FRICTION}} (Dispel the main technical or team fear)
- Email 4 (Day 10): The ROI Breakdown (What happens if they do nothing vs upgrade)
- Email 5 (Day 13 - 24h Before Expiry): Clean Urgency & Graceful Downgrade Offer

FOR EACH EMAIL OUTPUT:
1. Subject Line (3 options: Curiosity, Direct, Personal)
2. Preview Text (under 80 chars)
3. Full Body Copy (formatted with punchy paragraphs and clear CTA)
4. Primary CTA Link Text`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. SyncMetrics', defaultValue: 'SyncMetrics' },
          { name: 'AUDIENCE', label: 'Target Persona', placeholder: 'e.g. Growth Marketers', defaultValue: 'Growth Marketers' },
          { name: 'AHA_MOMENT', label: 'Core First Win', placeholder: 'e.g. Connecting your first Google Ads account and seeing hidden waste in 60 seconds', defaultValue: 'Generating your first automated report in 60s' },
          { name: 'TRIAL_DAYS', label: 'Trial Duration', placeholder: 'e.g. 14', defaultValue: '14' },
          { name: 'COMMON_FRICTION', label: 'Main Hesitation', placeholder: 'e.g. I do not have time to set up tracking scripts', defaultValue: 'Setting up custom integrations takes time' },
        ],
        whyItWorks: 'Focuses relentlessly on accelerating time-to-first-value rather than blasting users with generic feature tours.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['the-copywriter-stack', 'solo-marketer-starter-pack'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'mcp-market-researcher',
    slug: 'mcp-market-researcher',
    name: 'Reddit & Community Sentiment MCP Server',
    tagline: 'Live MCP connector for mining organic sentiment, customer frustrations, and objections on Reddit.',
    description: 'An open Model Context Protocol (MCP) server that connects AI clients (Claude Desktop, Claude Code, Cursor) to Reddit and forum threads to research organic customer discussions, software alternatives, and unfiltered complaints.',
    resourceType: 'mcp',
    categories: ['customer-research', 'positioning'],
    useCases: ['Reddit Research', 'Review Mining', 'Competitor Research', 'Customer Sentiment'],
    tags: ['MCP', 'Model Context Protocol', 'Reddit Scraping', 'Customer Research', 'Market Intelligence'],
    author: {
      name: 'Open Context Labs',
      url: 'https://github.com/open-context-labs/reddit-research-mcp',
      handle: 'opencontextlabs',
      verified: true,
    },
    source: {
      url: 'https://github.com/open-context-labs/reddit-research-mcp',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/open-context-labs/reddit-research-mcp',
      owner: 'open-context-labs',
      repo: 'reddit-research-mcp',
      starsCount: 950,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'moderate',
    curationStatus: 'verified',
    curationScore: {
      overall: 9.4,
      practicalValue: 9.7,
      setupQuality: 8.9,
      documentation: 9.4,
      marketingRelevance: 9.8,
      maintenance: 9.2,
    },
    badges: ['VERIFIED MCP', 'LIVE DATA'],
    compatibility: [
      {
        platformId: 'mcp_clients',
        platformName: 'MCP Compatible Clients',
        status: 'native',
        nativeType: 'MCP Server (stdio)',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: ['https://github.com/open-context-labs/reddit-research-mcp'],
        notes: 'Works across Claude Desktop, Claude Code, Cursor, and Windsurf.',
      },
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code MCP Tool',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
        notes: 'Add to `claude mcp add reddit-research` config.',
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'MCP Tool Integration',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Pulls genuine, unfiltered community discussions without search engine sponsored ad contamination.',
      'Clusters subreddits by intent (e.g. r/SaaS, r/smallbusiness, r/ecommerce).',
      'Filters out obvious bot and promotional affiliate spam.',
    ],
    limitations: [
      'Requires Node.js 18+ runtime on the host machine to run the local MCP process.',
      'Reddit API rate limits apply on high-volume queries.',
    ],
    bestFor: [
      'Mining Reddit for competitor complaints and switching discussions',
      'Finding real vocabulary and slang used by niche professionals',
      'Discovering unaddressed product feature requests',
    ],
    notFor: ['Sending promotional Reddit DMs or spamming'],
    security: {
      runsLocalCode: true,
      networkAccess: true,
      readsProjectFiles: false,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: true,
      shellAccess: false,
      notes: 'Runs a local Node.js stdio process to query public Reddit endpoints. Read-only network operations.',
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Configure Reddit Research MCP in Claude Code',
        nativeType: 'Claude Code MCP Server',
        prerequisites: ['Node.js 18+ installed', 'Claude Code CLI'],
        difficulty: 'moderate',
        steps: [
          {
            stepNumber: 1,
            title: 'Add MCP server via Claude CLI command',
            command: 'claude mcp add reddit-research npx -y @open-context-labs/reddit-mcp-server',
            explanation: 'Registers the Reddit tool in your local Claude Code configuration.',
          },
          {
            stepNumber: 2,
            title: 'Verify active tools in session',
            command: 'claude',
            explanation: 'In Claude Code session, type `/mcp list` to verify `reddit-research` is active.',
          },
        ],
        verification: {
          command: 'claude mcp list',
          instructions: 'Ensure reddit-research shows status CONNECTED.',
          expectedBehavior: 'Claude Code can call search_reddit and get_thread_comments tools.',
        },
        uninstall: {
          command: 'claude mcp remove reddit-research',
          steps: ['Remove from MCP config using the remove command.'],
        },
        tested: true,
        officialSources: [
          { name: 'Model Context Protocol Docs', url: 'https://modelcontextprotocol.io' },
          { name: 'Claude Code MCP Guide', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'mcp-reddit-mining',
        title: 'Reddit Competitor Friction Mining',
        description: 'Query Reddit to discover what users hate about your main competitor.',
        level: 'real_work',
        useCase: 'Reddit Research',
        prompt: `Using the reddit-research tool, search r/{{SUBREDDIT}} and related communities for discussions about {{COMPETITOR}}:

1. Find 5 threads where users complain about {{COMPETITOR}}'s pricing, features, or support.
2. Extract the exact phrases they use to describe what made them look for alternatives.
3. Identify the #1 missing capability mentioned repeatedly.
4. Synthesize these findings into a 1-page "Competitor Vulnerability Brief" for {{MY_PRODUCT}}.`,
        variables: [
          { name: 'COMPETITOR', label: 'Competitor Name', placeholder: 'e.g. Salesforce / Jira / Shopify', defaultValue: 'Jira' },
          { name: 'SUBREDDIT', label: 'Primary Subreddit', placeholder: 'e.g. softwareengineering / startups', defaultValue: 'startups' },
          { name: 'MY_PRODUCT', label: 'Your Product Name', placeholder: 'e.g. Linear / TaskFast', defaultValue: 'Linear' },
        ],
        whyItWorks: 'Directly leverages real-time community sentiment to spot competitor vulnerabilities and build high-converting alternative pages.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['customer-research', 'claude-code-for-marketers'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'headline-power-variant-engine',
    slug: 'headline-power-variant-engine',
    name: '30-Vector Headline & Hook Ideation Engine',
    tagline: 'Generate 30 mathematically structured conversion headlines across 6 timeless formulas.',
    description: 'A precision conversion copywriting skill designed by seasoned direct-response practitioners. Crafts headlines using John Caples, Eugene Schwartz, and modern B2B SaaS formulas to maximize above-the-fold engagement.',
    resourceType: 'skill',
    categories: ['copywriting', 'cro', 'paid-media'],
    useCases: ['Headline Writing', 'A/B Testing', 'Landing Page Copy', 'Ad Hooks'],
    tags: ['Headlines', 'Copywriting Formulas', 'A/B Testing', 'Direct Response'],
    author: {
      name: 'Benchmark Copy Works',
      url: 'https://github.com/benchmark-copy/headline-engine-skill',
      handle: 'benchmarkcopy',
      verified: true,
    },
    source: {
      url: 'https://github.com/benchmark-copy/headline-engine-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/benchmark-copy/headline-engine-skill',
      owner: 'benchmark-copy',
      repo: 'headline-engine-skill',
      starsCount: 710,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.4,
      practicalValue: 9.6,
      setupQuality: 9.3,
      documentation: 9.5,
      marketingRelevance: 9.7,
      maintenance: 9.0,
    },
    badges: ['EASIEST SETUP', 'QUICK RESULTS'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT System Instruction',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini Extension',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Eliminates lazy clichés like "The all-in-one solution for..." or "Work smarter, not harder".',
      'Provides 5 headline variations for each of 6 proven categories (Self-Interest, Curiosity, Specificity, Proof, Contrast, Counter-Intuitive).',
      'Includes paired subheadlines and 5-word micro-proof snippets.',
    ],
    limitations: [
      'Focuses exclusively on above-the-fold headline and hook copy.',
    ],
    bestFor: [
      'Rapidly creating A/B test variations for paid traffic landing pages',
      'Testing bold positioning statements before committing to a redesign',
      'Writing email subject lines and subheadlines',
    ],
    notFor: ['Long-form technical documentation'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: false,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Headline Engine in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download Skill',
            command: 'mkdir -p ~/.claude/skills/headline-engine && curl -sSL https://raw.githubusercontent.com/benchmark-copy/headline-engine-skill/main/SKILL.md -o ~/.claude/skills/headline-engine/SKILL.md',
            explanation: 'Installs the headline formula skill.',
          },
        ],
        verification: {
          instructions: 'Ask Claude Code: "Generate headlines for my landing page using headline-engine"',
          expectedBehavior: 'Outputs 30 categorized headlines with subhead pairings.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'headline-30-variations',
        title: '30-Formula Headline & Subhead Generation Engine',
        description: 'Generate 30 tested headline and subhead combinations for your product offer.',
        level: 'quick_start',
        useCase: 'Headline Writing',
        prompt: `You are an elite direct-response conversion copywriter. Generate 30 distinct headlines for {{PRODUCT}} targeting {{AUDIENCE}}:

OFFER INPUTS:
Core Promise: {{PROMISE}}
Painful Status Quo: {{PAIN}}
Key Differentiator / Mechanism: {{MECHANISM}}

GENERATE 5 VARIATIONS FOR EACH OF THESE 6 FORMULAS:
1. THE DIRECT SPECIFIC PAYOFF ("Get [X Result] in [Y Time] without [Z Pain]")
2. THE RADICAL CONTRAST ("Stop [Painful Activity]. Start [Effortless Outcome].")
3. THE COUNTER-INTUITIVE TRUTH (Challenges an accepted industry assumption)
4. THE SOCIAL PROOF ANCHOR ("How [Target Persona] achieved [Metric] using [Mechanism]")
5. THE FOCUSED QUESTION (Agitates a specific burning daily frustration)
6. THE IF/THEN PROVOCATION ("If you can [Simple Action], you can [Major Outcome]")

FOR EACH VARIATION: Include a 1-sentence complementary subheadline that clarifies the offer immediately.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. AuditBot', defaultValue: 'AuditBot' },
          { name: 'AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Shopify Plus Store Owners', defaultValue: 'Shopify Store Owners' },
          { name: 'PROMISE', label: 'Core Promise', placeholder: 'e.g. Recover 15% of lost revenue from failed payments', defaultValue: 'Recover 18% of failed credit card transactions' },
          { name: 'PAIN', label: 'Painful Status Quo', placeholder: 'e.g. Losing thousands in passive churn without realizing it', defaultValue: 'Passive churn eating monthly profits' },
          { name: 'MECHANISM', label: 'Mechanism / Tech', placeholder: 'e.g. Smart retrying AI without sending annoying emails', defaultValue: 'Smart multi-bank transaction retries' },
        ],
        whyItWorks: 'Systematically explores multiple psychological entry points instead of sticking to safe, forgettable B2B headline tropes.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['the-copywriter-stack', 'meta-ads-workflow', 'cro-research-kit'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'b2b-case-study-extractor',
    slug: 'b2b-case-study-extractor',
    name: 'Customer Interview to B2B Case Study Synthesizer',
    tagline: 'Transform messy Gong/Zoom customer interview recordings into high-trust narrative case studies.',
    description: 'A structural copywriting skill that converts unedited customer interview transcripts into executive-ready case studies. Extracts quantifiable metrics, emotional before/after state transitions, and high-impact pull quotes.',
    resourceType: 'skill',
    categories: ['copywriting', 'content', 'customer-research'],
    useCases: ['Case Study Extraction', 'Customer Interviews', 'Social Proof', 'B2B Proof Elements'],
    tags: ['Case Studies', 'B2B Copywriting', 'Interview Synthesis', 'Customer Proof'],
    author: {
      name: 'Proof Protocol',
      url: 'https://github.com/proof-protocol/case-study-skill',
      handle: 'proofprotocol',
      verified: true,
    },
    source: {
      url: 'https://github.com/proof-protocol/case-study-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/proof-protocol/case-study-skill',
      owner: 'proof-protocol',
      repo: 'case-study-skill',
      starsCount: 410,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.1,
      practicalValue: 9.3,
      setupQuality: 9.0,
      documentation: 9.2,
      marketingRelevance: 9.5,
      maintenance: 8.6,
    },
    badges: ['HIGH EVIDENCE', 'B2B PROOF'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Preserves the authentic executive tone while cutting out verbal filler ("you know", "like", "basically").',
      'Formats output into 3 flexible formats: 1-page PDF layout, 3-sentence landing page quote card, and slide deck summary.',
      'Highlights hard quantitative impact metrics (ROI, hours saved, error rate drops).',
    ],
    limitations: [
      'Requires a transcript containing real discussion of implementation and results.',
    ],
    bestFor: [
      'B2B marketing teams with unorganized customer interview recordings',
      'Generating high-converting quote blocks for pricing pages',
      'Sales enablement 1-pagers',
    ],
    notFor: ['Fabricating fake testimonials'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Case Study Extractor in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download Skill',
            command: 'mkdir -p ~/.claude/skills/case-study-extractor && curl -sSL https://raw.githubusercontent.com/proof-protocol/case-study-skill/main/SKILL.md -o ~/.claude/skills/case-study-extractor/SKILL.md',
            explanation: 'Installs the case study builder.',
          },
        ],
        verification: {
          instructions: 'Call `/case-study-extractor` with your transcript file.',
          expectedBehavior: 'Outputs structured before/after case study document.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Guide', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'case-study-interview-to-proof',
        title: 'Customer Interview to Executive Case Study Story',
        description: 'Turn a raw transcript into a compelling Challenge → Solution → Metric Result narrative.',
        level: 'real_work',
        useCase: 'Case Study Extraction',
        prompt: `Convert the following customer interview transcript for {{PRODUCT}} into a high-converting B2B Case Study:

INTERVIEW TRANSCRIPT:
"""
{{TRANSCRIPT}}
"""

CUSTOMER CONTEXT:
Company Name: {{CUSTOMER_COMPANY}}
Contact Title: {{CUSTOMER_TITLE}}

STRUCTURE REQUIRED:
1. EXECUTIVE SUMMARY BLOCK (Headline with strongest metric + 3 bullet takeaways)
2. THE BREAKING POINT (What was failing in their previous workflow? What was the cost of inaction?)
3. THE EVALUATION & SWITCH (Why did they choose {{PRODUCT}} over competitors?)
4. THE IMPLEMENTATION & AHA MOMENT (How fast was time-to-value?)
5. THE HARD METRICS & BUSINESS RESULTS (Quantified time saved, revenue increased, or error reductions)
6. 3 PULL QUOTES FOR LANDING PAGES (Punchy, authentic quotes ready for website badges)`,
        variables: [
          { name: 'PRODUCT', label: 'Your Product Name', placeholder: 'e.g. LogIQ', defaultValue: 'LogIQ' },
          { name: 'CUSTOMER_COMPANY', label: 'Customer Company', placeholder: 'e.g. Acme Corp', defaultValue: 'Acme Logistics' },
          { name: 'CUSTOMER_TITLE', label: 'Customer Title', placeholder: 'e.g. VP of Supply Chain', defaultValue: 'VP of Infrastructure' },
          { name: 'TRANSCRIPT', label: 'Raw Interview Text', placeholder: 'Paste interview notes or transcript...' },
        ],
        whyItWorks: 'Extracts the exact narrative arc enterprise buyers need to see before getting internal procurement approval.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['the-copywriter-stack', 'content-research-stack'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'cro-heuristic-friction-checker',
    slug: 'cro-heuristic-friction-checker',
    name: 'Form & Checkout UX Friction Diagnoser',
    tagline: 'Eliminate drop-offs in multi-step lead capture forms, signups, and checkout funnels.',
    description: 'A specialized conversion optimization skill focused specifically on form fields, input validation friction, mobile keyboard ergonomics, and checkout anxiety triggers.',
    resourceType: 'plugin',
    categories: ['cro', 'analytics'],
    useCases: ['Friction Diagnosis', 'Form Optimization', 'Checkout CRO', 'Funnel Analytics'],
    tags: ['Form CRO', 'Checkout Optimization', 'Friction Audit', 'Mobile UX'],
    author: {
      name: 'Funnel Friction Labs',
      url: 'https://github.com/funnel-friction/form-checker',
      handle: 'funnelfriction',
      verified: true,
    },
    source: {
      url: 'https://github.com/funnel-friction/form-checker',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/funnel-friction/form-checker',
      owner: 'funnel-friction',
      repo: 'form-checker',
      starsCount: 380,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.0,
      practicalValue: 9.3,
      setupQuality: 8.9,
      documentation: 9.1,
      marketingRelevance: 9.4,
      maintenance: 8.5,
    },
    badges: ['FORM SPECIALIST', 'VERIFIED'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'chatgpt',
        platformName: 'ChatGPT',
        status: 'supported',
        nativeType: 'Custom GPT',
        tested: true,
        testedVersion: 'v1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Audits every single form field for necessity, cognitive burden, and abandonment risk.',
      'Identifies mobile keyboard mismatches (e.g. text keyboard on numeric fields).',
      'Provides copy rewrites for error states and password requirements.',
    ],
    limitations: ['Requires description or HTML of form fields and checkout steps.'],
    bestFor: [
      'Optimizing demo request forms with low submission rates',
      'DTC checkout funnel audits',
      'SaaS signup step reduction',
    ],
    notFor: ['Backend database validation code generation'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Form Friction Diagnoser in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download Skill',
            command: 'mkdir -p ~/.claude/skills/form-friction && curl -sSL https://raw.githubusercontent.com/funnel-friction/form-checker/main/SKILL.md -o ~/.claude/skills/form-friction/SKILL.md',
            explanation: 'Installs the form friction checker.',
          },
        ],
        verification: {
          instructions: 'Ask Claude Code: "Audit the signup form in ./signup.html using form-friction skill"',
          expectedBehavior: 'Returns field-by-field friction score and streamlining recommendations.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Guide', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'form-friction-audit',
        title: 'Lead Capture Form Field-by-Field Friction Audit',
        description: 'Audit every field in a lead generation or signup form to maximize completion rates.',
        level: 'quick_start',
        useCase: 'Form Optimization',
        prompt: `Audit the following lead capture / signup form for {{PRODUCT}}:

CURRENT FORM FIELDS:
"""
{{FORM_FIELDS}}
"""

CONTEXT:
Traffic Source: {{TRAFFIC_SOURCE}}
Goal: {{FORM_GOAL}}

AUDIT TASKS:
1. Field Necessity Check: Which fields can be safely delayed until after signup or enriched via Clearbit/Apollo?
2. Cognitive Friction Ranking: Rank fields from Lowest to Highest drop-off risk.
3. Microcopy & Placeholder Review: Suggest clearer labels, micro-reassurance badges, and inline help text.
4. Button & Progress Architecture: Evaluate CTA button copy and multi-step progress indicators.
5. Streamlined 2-Step Redesign Proposal: Provide a revised form wireframe that minimizes friction.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. SalesPro', defaultValue: 'SalesPro CRM' },
          { name: 'TRAFFIC_SOURCE', label: 'Primary Traffic Source', placeholder: 'e.g. Google Search Ads / LinkedIn Ads', defaultValue: 'Google Search Ads' },
          { name: 'FORM_GOAL', label: 'Conversion Goal', placeholder: 'e.g. Schedule a 20-min sales demo', defaultValue: 'Book a demo' },
          { name: 'FORM_FIELDS', label: 'Current Form Fields List', placeholder: 'e.g. First Name, Last Name, Work Email, Company Name, Company Size, Phone Number, Budget...', defaultValue: '1. First Name, 2. Last Name, 3. Work Email, 4. Company Name, 5. Team Size, 6. Phone Number, 7. Estimated Budget' },
        ],
        whyItWorks: 'Pinpoints the exact point where high-intent visitors abandon forms due to unnecessary data demands.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['cro-research-kit'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'pricing-page-optimizer',
    slug: 'pricing-page-optimizer',
    name: 'SaaS Pricing & Packaging Value Matrix Auditor',
    tagline: 'Audit plan tiering, anchor pricing psychology, feature comparison tables, and FAQ reassurance.',
    description: 'A specialized CRO skill for evaluating SaaS and subscription pricing pages. Analyzes tier differentiation, default billing toggles, decoying strategies, and feature matrix legibility.',
    resourceType: 'skill',
    categories: ['cro', 'copywriting', 'positioning'],
    useCases: ['Pricing Page CRO', 'Value Prop Scoring', 'Objection Handling', 'Offer Architecture'],
    tags: ['Pricing Page', 'SaaS Pricing', 'Packaging', 'CRO', 'Decoy Pricing'],
    author: {
      name: 'Pricing Archetype Lab',
      url: 'https://github.com/pricing-archetypes/pricing-skill',
      handle: 'pricingarchetypes',
      verified: true,
    },
    source: {
      url: 'https://github.com/pricing-archetypes/pricing-skill',
      type: 'official',
    },
    repository: {
      url: 'https://github.com/pricing-archetypes/pricing-skill',
      owner: 'pricing-archetypes',
      repo: 'pricing-skill',
      starsCount: 470,
      defaultBranch: 'main',
    },
    license: 'MIT',
    pricing: 'free',
    installDifficulty: 'easy',
    curationStatus: 'curated',
    curationScore: {
      overall: 9.3,
      practicalValue: 9.5,
      setupQuality: 9.1,
      documentation: 9.3,
      marketingRelevance: 9.6,
      maintenance: 8.8,
    },
    badges: ['TESTED ON CLAUDE', 'REVENUE CRO'],
    compatibility: [
      {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        status: 'native',
        nativeType: 'Claude Code Skill',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'codex',
        platformName: 'OpenAI Codex',
        status: 'supported',
        nativeType: 'Agent Skill',
        tested: true,
        testedVersion: 'v1.1.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
      {
        platformId: 'gemini_cli',
        platformName: 'Gemini CLI',
        status: 'supported',
        nativeType: 'Gemini Extension',
        tested: true,
        testedVersion: 'v1.0.0',
        verifiedAt: '2026-08-14',
        evidenceUrls: [],
      },
    ],
    strengths: [
      'Diagnoses "Option Paralysis" where plan boundaries blur or overlap.',
      'Audits the "Recommended" tier highlight for psychological validity.',
      'Drafts concise plan taglines that define exact buyer profiles (e.g. "For solo founders scaling past $10k MRR").',
    ],
    limitations: ['Does not calculate dynamic customer lifetime value models.'],
    bestFor: [
      'Redesigning SaaS pricing tables before a new product launch',
      'Increasing annual plan uptake with clear savings framing',
      'Eliminating sales team friction on self-serve tiers',
    ],
    notFor: ['Dynamic currency exchange hedging'],
    security: {
      runsLocalCode: false,
      networkAccess: false,
      readsProjectFiles: true,
      writesProjectFiles: false,
      requiresApiKey: false,
      requiresOAuth: false,
      usesMcp: false,
      shellAccess: false,
    },
    installGuides: {
      claude_code: {
        platformId: 'claude_code',
        platformName: 'Claude Code',
        title: 'Install Pricing Optimizer in Claude Code',
        nativeType: 'Claude Code Skill',
        prerequisites: ['Claude Code CLI'],
        difficulty: 'easy',
        steps: [
          {
            stepNumber: 1,
            title: 'Download Skill',
            command: 'mkdir -p ~/.claude/skills/pricing-optimizer && curl -sSL https://raw.githubusercontent.com/pricing-archetypes/pricing-skill/main/SKILL.md -o ~/.claude/skills/pricing-optimizer/SKILL.md',
            explanation: 'Installs pricing page audit skill.',
          },
        ],
        verification: {
          instructions: 'Run `/pricing-optimizer` in terminal.',
          expectedBehavior: 'Outputs pricing psychology audit and tier refactoring plan.',
        },
        tested: true,
        officialSources: [{ name: 'Claude Code Guide', url: 'https://docs.anthropic.com' }],
        lastVerifiedAt: '2026-08-14',
      },
    },
    prompts: [
      {
        id: 'pricing-table-teardown',
        title: 'SaaS Pricing Table Tiering & Clarity Teardown',
        description: 'Audit plan names, price anchoring, feature limits, and call-to-action buttons.',
        level: 'real_work',
        useCase: 'Pricing Page CRO',
        prompt: `Audit and optimize the following SaaS pricing tiers for {{PRODUCT}}:

CURRENT PRICING TIERS:
"""
{{PRICING_DATA}}
"""

TARGET METRIC: Increase {{OPTIMIZATION_GOAL}}

AUDIT RUBRIC:
1. TIER DIFFERENTIATION: Is it instantly clear who should choose Tier 1 vs Tier 2 vs Tier 3?
2. VALUE METRIC CHECK: Is the charging metric (seats, usage, storage, revenue) aligned with customer value growth?
3. COGNITIVE BURDEN: Is the feature matrix overwhelmed with 40 identical checkboxes?
4. ANNUAL SAVINGS ANCHOR: Is the annual toggle framed compellingly ("2 Months Free" vs "-15%")?
5. RECOMMENDED TIER OPTIMIZATION: Provide rewritten Plan Names, 1-Sentence Target Descriptions, and 5 Clear Bullet Points for each tier.`,
        variables: [
          { name: 'PRODUCT', label: 'Product Name', placeholder: 'e.g. CloudSync', defaultValue: 'CloudSync' },
          { name: 'OPTIMIZATION_GOAL', label: 'Target Metric', placeholder: 'e.g. Starter-to-Pro upgrade rate', defaultValue: 'Conversion to Middle Pro Tier' },
          { name: 'PRICING_DATA', label: 'Current Tiers Text', placeholder: 'Paste Tier names, prices, and main features...', defaultValue: 'Tier 1: Starter ($29/mo) - 2 users, 5GB storage. Tier 2: Pro ($79/mo) - 10 users, 50GB storage, analytics. Tier 3: Enterprise ($199/mo) - Unlimited.' },
        ],
        whyItWorks: 'Directly addresses choice overload on SaaS pricing pages and nudges buyers toward the most profitable tier.',
        version: 1,
        lastReviewedAt: '2026-08-14',
      },
    ],
    collections: ['cro-research-kit', 'solo-marketer-starter-pack'],
    lastVerifiedAt: '2026-08-14',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
];

export const AI_COLLECTIONS: AICollection[] = [
  {
    id: 'the-copywriter-stack',
    slug: 'the-copywriter-stack',
    title: 'The Essential Copywriter Stack',
    tagline: 'The end-to-end evidence-backed workflow for high-converting sales pages and landing pages.',
    description: 'A connected sequence of 4 curated skills that guides you from unstructured customer review mining all the way to 30 tested headline variants, objection dismantling, and line-by-line copy editing.',
    badge: 'CORE STACK',
    resourceSlugs: [
      'voice-of-customer-research',
      'positioning-canvas-synthesizer',
      'headline-power-variant-engine',
      'objection-demolition-matrix',
    ],
    workflowSteps: [
      {
        stepNumber: 1,
        stage: '01. RESEARCH',
        title: 'Extract Customer Verbatims',
        description: 'Mine reviews, interviews, and support transcripts for authentic customer language.',
        resourceSlug: 'voice-of-customer-research',
      },
      {
        stepNumber: 2,
        stage: '02. POSITIONING',
        title: 'Anchor Core Value Pillars',
        description: 'Establish competitive differentiation and isolate your product from the status quo.',
        resourceSlug: 'positioning-canvas-synthesizer',
      },
      {
        stepNumber: 3,
        stage: '03. HEADLINES',
        title: 'Generate 30 Power Vectors',
        description: 'Develop curiosity, proof, and contrast headlines for above-the-fold testing.',
        resourceSlug: 'headline-power-variant-engine',
      },
      {
        stepNumber: 4,
        stage: '04. OBJECTIONS',
        title: 'Dismantle Buying Hesitation',
        description: 'Map buying anxieties directly to proof assets, guarantees, and FAQs.',
        resourceSlug: 'objection-demolition-matrix',
      },
    ],
    curatorNote: 'This is the foundational stack used by modern conversion copywriters. It replaces hours of staring at a blank screen with structured evidence transformation.',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'cro-research-kit',
    slug: 'cro-research-kit',
    title: 'Heuristic CRO Research Kit',
    tagline: 'Diagnose conversion leaks, cognitive load, and friction points across landing pages and funnels.',
    description: 'A comprehensive evaluation kit based on MECLABS conversion probability formulas. Uncovers why visitors bounce, audits above-the-fold clarity, and identifies form friction leaks.',
    badge: 'CRO ESSENTIALS',
    resourceSlugs: [
      'landing-page-cro-audit',
      'cro-heuristic-friction-checker',
      'pricing-page-optimizer',
      'objection-demolition-matrix',
    ],
    workflowSteps: [
      {
        stepNumber: 1,
        stage: '01. AUDIT',
        title: 'Heuristic Landing Page Audit',
        description: 'Run the 5-second stranger test and clarity evaluation on the primary landing page.',
        resourceSlug: 'landing-page-cro-audit',
      },
      {
        stepNumber: 2,
        stage: '02. FRICTION',
        title: 'Diagnose Form & Signup Drop-off',
        description: 'Identify unnecessary fields and mobile keyboard friction points in lead capture forms.',
        resourceSlug: 'cro-heuristic-friction-checker',
      },
      {
        stepNumber: 3,
        stage: '03. PRICING',
        title: 'Optimize Tiering & Anchoring',
        description: 'Refactor pricing tables and annual toggle savings framing.',
        resourceSlug: 'pricing-page-optimizer',
      },
      {
        stepNumber: 4,
        stage: '04. PROOF',
        title: 'Demolish Remaining Anxiety',
        description: 'Position guarantees, trust certifications, and disarming FAQs.',
        resourceSlug: 'objection-demolition-matrix',
      },
    ],
    curatorNote: 'Use this kit prior to launching any major ad campaign or website redesign to systematically eliminate unforced conversion errors.',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'meta-ads-workflow',
    slug: 'meta-ads-workflow',
    title: 'Performance Meta Ads & Paid Social Engine',
    tagline: 'Systematically generate 12 divergent creative angles, 3-second visual hooks, and landing page handoffs.',
    description: 'Designed for performance marketing teams and creative strategists who need to prevent ad fatigue and match paid ad hooks to landing page promises.',
    badge: 'PAID SOCIAL',
    resourceSlugs: [
      'ad-creative-angle-generator',
      'headline-power-variant-engine',
      'voice-of-customer-research',
    ],
    workflowSteps: [
      {
        stepNumber: 1,
        stage: '01. ANGLE DISCOVERY',
        title: 'Mine Raw Customer Frustrations',
        description: 'Extract authentic complaints and slang to use in performance hooks.',
        resourceSlug: 'voice-of-customer-research',
      },
      {
        stepNumber: 2,
        stage: '02. CREATIVE MATRIX',
        title: 'Build 12-Angle Paid Social Matrix',
        description: 'Generate divergent angles across Us-vs-Them, Math/ROI, and Vulnerable Truth.',
        resourceSlug: 'ad-creative-angle-generator',
      },
      {
        stepNumber: 3,
        stage: '03. MESSAGE MATCH',
        title: 'Craft Paired Landing Page Hooks',
        description: 'Match on-screen ad hooks to above-the-fold landing page headlines.',
        resourceSlug: 'headline-power-variant-engine',
      },
    ],
    curatorNote: 'High ad spend requires high creative velocity. This workflow ensures every angle is psychologically distinct rather than testing cosmetic copy tweaks.',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'claude-code-for-marketers',
    slug: 'claude-code-for-marketers',
    title: 'Best Marketing Skills for Claude Code',
    tagline: 'Top verified, terminal-native marketing skills curated specifically for the Anthropic Claude Code client.',
    description: 'A curated onboarding pack of verified Claude Code skills that transform terminal-based AI sessions into a full-funnel marketing research, copywriting, and CRO powerhouse.',
    badge: 'CLAUDE CODE',
    platformId: 'claude_code',
    resourceSlugs: [
      'voice-of-customer-research',
      'landing-page-cro-audit',
      'ad-creative-angle-generator',
      'positioning-canvas-synthesizer',
      'mcp-market-researcher',
    ],
    curatorNote: 'Every skill in this pack has been verified on Claude Code v1.0.0+ with tested installation commands and zero dependency errors.',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'customer-research',
    slug: 'customer-research-stack',
    title: 'Customer Research & VOC Suite',
    tagline: 'The complete qualitative toolkit for uncovering buyer objections, motivations, and forum discussions.',
    description: 'Combines transcript analysis, review mining, and live Reddit MCP scraping into an authoritative research suite.',
    badge: 'QUALITATIVE VOC',
    resourceSlugs: [
      'voice-of-customer-research',
      'mcp-market-researcher',
      'b2b-case-study-extractor',
    ],
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'content-research-stack',
    slug: 'content-research-stack',
    title: 'Search Intent & Content Strategy Pack',
    tagline: 'Satisfy search intent with in-depth briefs, case studies, and clear topical authority maps.',
    description: 'Move past thin AI content farms. Build authoritative editorial content briefs and extract compelling proof points.',
    badge: 'CONTENT SUITE',
    resourceSlugs: [
      'seo-content-brief-architect',
      'b2b-case-study-extractor',
      'positioning-canvas-synthesizer',
    ],
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
  {
    id: 'solo-marketer-starter-pack',
    slug: 'solo-marketer-starter-pack',
    title: 'Solo Marketer Speed Pack',
    tagline: 'The 4 essential tools a solo founder or lone marketer needs to compete with an entire agency.',
    description: 'Cover positioning, copywriting, email onboarding, and CRO without burning weeks on manual setup.',
    badge: 'SOLO OPERATOR',
    resourceSlugs: [
      'positioning-canvas-synthesizer',
      'headline-power-variant-engine',
      'email-lifecycle-sequencer',
      'pricing-page-optimizer',
    ],
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
  },
];
