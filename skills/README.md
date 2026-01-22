# Skills Directory

> **Purpose**: Modular, reusable workflows and knowledge that agents invoke on-demand
> **Token Efficiency**: Load only what you need, when you need it

---

## What Are Skills?

Skills are self-contained instruction modules that provide:
- **Workflows**: Step-by-step processes for common tasks
- **Knowledge**: Reference information for specific domains
- **Templates**: Standardized formats for outputs
- **Decision Frameworks**: How to evaluate and decide

## How to Use Skills

When your task requires specialized knowledge:

1. **Identify** the relevant skill from the list below
2. **Read** the skill file to load the instructions
3. **Apply** the workflow/knowledge to your task
4. **Reference** the skill in your logs for traceability

## Available Skills

| Skill | File | Use When |
|-------|------|----------|
| **Canon Validation** | `canon-validation.md` | Reviewing content for lore compliance |
| **Content Creation** | `content-creation.md` | Creating tweets, threads, social content |
| **Copywriting** | `copywriting.md` | Writing compelling marketing copy |
| **Cultural Review** | `cultural-review.md` | Assessing degen authenticity |
| **Character Voices** | `character-voices.md` | Writing character dialogue or first-person content |
| **Escalation** | `escalation.md` | Determining when/how to escalate issues |
| **Templates** | `templates.md` | Formatting outputs (reviews, submissions, logs) |
| **Permissions** | `permissions.md` | Checking file access rights |
| **Community Intel** | `community-intel.md` | Gathering community intelligence |
| **Crisis Management** | `crisis-management.md` | Handling threats, crises, brand protection |
| **Agent Evaluation** | `agent-evaluation.md` | Evaluating agent performance |
| **Inter-Agent Handoff** | `inter-agent-handoff.md` | Passing work between agents |
| **KOL/Influencer** | `kol-influencer.md` | Influencer management and outreach |
| **Skill Creator** | `skill-creator.md` | Creating new internal skills |
| **Tiered Review** | `tiered-review-framework.md` | Optimizing review depth based on content type |
| **CT Engagement** | `ct-engagement.md` | Crypto Twitter strategy, hooks, algorithm optimization |
| **CT Rapid Response** | `ct-rapid-response.md` | Time-sensitive CT opportunities, Tier 0 review |
| **Brand Adaptation** | `brand-adaptation.md` | Adapting voice across products and contexts |
| **Lore Proposal** | `lore-proposal.md` | Proposing new canon elements for human approval |
| **Post to X** | `post-to-x.md` | Publishing tweets and articles to X/Twitter |

### General Marketing Skills

These skills are from the [marketingskills](https://github.com/coreyhaines31/marketingskills) collection - general-purpose marketing frameworks (prefixed with `mkt-`):

| Skill | File | Use When |
|-------|------|----------|
| **A/B Test Setup** | `mkt-ab-test-setup.md` | Planning and implementing A/B tests |
| **Analytics Tracking** | `mkt-analytics-tracking.md` | Setting up GA4, conversion tracking, measurement |
| **Competitor Alternatives** | `mkt-competitor-alternatives.md` | Creating comparison pages for SEO |
| **Copy Editing** | `mkt-copy-editing.md` | Editing and refining existing marketing copy |
| **Copywriting (General)** | `mkt-copywriting.md` | General conversion copywriting framework |
| **Email Sequence** | `mkt-email-sequence.md` | Building automated email campaigns |
| **Form CRO** | `mkt-form-cro.md` | Optimizing lead capture and contact forms |
| **Free Tool Strategy** | `mkt-free-tool-strategy.md` | Planning marketing tools for lead generation |
| **Launch Strategy** | `mkt-launch-strategy.md` | Product launches and go-to-market planning |
| **Marketing Ideas** | `mkt-marketing-ideas.md` | 140+ proven growth tactics and strategies |
| **Marketing Psychology** | `mkt-marketing-psychology.md` | 70+ mental models for marketing |
| **Onboarding CRO** | `mkt-onboarding-cro.md` | Optimizing post-signup activation |
| **Page CRO** | `mkt-page-cro.md` | Conversion rate optimization for pages |
| **Paid Ads** | `mkt-paid-ads.md` | Managing Google Ads, Meta, LinkedIn campaigns |
| **Paywall Upgrade CRO** | `mkt-paywall-upgrade-cro.md` | Designing in-app upgrade prompts |
| **Popup CRO** | `mkt-popup-cro.md` | Optimizing popups, modals, and banners |
| **Pricing Strategy** | `mkt-pricing-strategy.md` | Developing pricing and tier structures |
| **Programmatic SEO** | `mkt-programmatic-seo.md` | Creating SEO pages at scale |
| **Referral Program** | `mkt-referral-program.md` | Building referral and affiliate programs |
| **Schema Markup** | `mkt-schema-markup.md` | Adding structured data for SEO |
| **SEO Audit** | `mkt-seo-audit.md` | Auditing technical and on-page SEO |
| **Signup Flow CRO** | `mkt-signup-flow-cro.md` | Reducing friction in registration flows |
| **Social Content** | `mkt-social-content.md` | Creating content for LinkedIn, Twitter, Instagram |

### Skills with Absorbed Content

Some skills absorbed content from archived agent personas:

| Skill | Absorbed From |
|-------|---------------|
| `community-intel.md` | Agent 10 (The Infiltrator) |
| `crisis-management.md` | Agent 14 (The Shield) |
| `kol-influencer.md` | Agent 18 (The Hypeman) |

## Skill Design Principles

1. **Self-Contained**: Each skill has everything needed to execute
2. **On-Demand**: Only load when the task requires it
3. **Composable**: Skills can be combined for complex workflows
4. **Consistent**: All skills follow the same structure

## Creating New Skills

If you identify a repeated workflow that should be a skill:

1. Document the workflow in a new `.md` file
2. Follow the skill template structure
3. Add to this README's skill table
4. Notify Coordinator of the new skill

---

*Skills keep agents lean and workflows consistent.*
