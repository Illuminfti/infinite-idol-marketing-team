# Specification: Infinite Idol Marketing Team Infrastructure Setup

## Overview

Set up a complete AI-powered marketing team infrastructure for **Infinite Idol**, a Web3 gacha game combining anime idol aesthetics with blockchain technology on SUI. This involves creating a comprehensive repository structure including: a knowledge base of all Infinite Idol lore, mechanics, and assets; seven specialized AI agent personas forming a marketing pipeline; workflow systems for content creation, community management, and campaign planning; output folders for generated content; and a feedback loop system for continuous improvement. The infrastructure will be populated from source materials already present in the repository (FULL_AUTO_CLAUDE_PROMPT.md and SOURCE_MATERIALS_APPENDIX.md).

## Workflow Type

**Type**: feature

**Rationale**: This is a greenfield infrastructure setup requiring creation of 40+ files and directories, with substantial content population from source materials. It involves no existing code to modify but extensive new content creation.

## Task Scope

### Services Involved
- **Marketing HQ Repository** (primary) - The complete folder structure and file system being created
- **Knowledge Base** (content) - Lore, game mechanics, brand guidelines extracted from source materials
- **Agent System** (documentation) - Seven AI agent persona definitions

### This Task Will:
- [ ] Create complete repository folder structure (40+ directories)
- [ ] Create CLAUDE.md master instructions file
- [ ] Create README.md project overview
- [ ] Create 7 agent persona files in `agents/` directory
- [ ] Populate knowledge-base/lore/ with world, characters, factions, mechanics content
- [ ] Create knowledge-base/game-mechanics/ files from pre-registration spec
- [ ] Create knowledge-base/brand/ guidelines files
- [ ] Create knowledge-base/crypto/ documentation
- [ ] Initialize outputs/ folder structure with .gitkeep files
- [ ] Initialize logs/ and reviews/ systems
- [ ] Set up master calendar template
- [ ] Create human review workflow templates

### Out of Scope:
- Actual content generation (tweets, threads, etc.) - that's for agents to do later
- Light novel full text (referenced but source files not provided in repository)
- External integrations (Discord, Twitter APIs)
- SUI blockchain development

## Service Context

### Marketing HQ Repository

**Tech Stack:**
- Language: Markdown
- Framework: None (documentation repository)
- Key directories: knowledge-base/, agents/, outputs/, logs/, reviews/

**Entry Point:** `CLAUDE.md` (all agents read this first)

**How to Run:**
```bash
# No runtime - this is a documentation/content repository
# Agents activate by reading CLAUDE.md then their persona file
```

**Port:** N/A

## Files to Modify

This is a greenfield setup - no existing files to modify.

## Files to Create

| File | Directory | What to Create |
|------|-----------|----------------|
| `CLAUDE.md` | root | Master instructions for all agents (project overview, agent system, file permissions, workflows, content guidelines, canon rules) |
| `README.md` | root | Human-readable project overview and quick start guide |
| `00-coordinator.md` | agents/ | Marketing Director agent persona |
| `01-lore-architect.md` | agents/ | Worldbuilding specialist agent persona |
| `02-content-strategist.md` | agents/ | Social media content agent persona |
| `03-community-manager.md` | agents/ | Discord/engagement agent persona |
| `04-gacha-designer.md` | agents/ | Seasonal content/banners agent persona |
| `05-analytics-observer.md` | agents/ | Performance tracking agent persona |
| `06-asset-coordinator.md` | agents/ | Suno/Midjourney prompts agent persona |
| `core-world.md` | knowledge-base/lore/ | Eternal Stage, Devotion, Fading, Tournament mechanics |
| `timeline.md` | knowledge-base/lore/ | Chronological events |
| `ika-minami.md` | knowledge-base/lore/characters/ | Protagonist profile |
| `sora.md` | knowledge-base/lore/characters/ | Speedster profile |
| `suiren.md` | knowledge-base/lore/characters/ | Prodigy profile |
| `erina.md` | knowledge-base/lore/characters/ | Antagonist profile |
| `runa.md` | knowledge-base/lore/characters/ | Network architect profile |
| `foundation-members.md` | knowledge-base/lore/characters/ | Arya, Opti, Bea, Zuri profiles |
| `supporting-cast.md` | knowledge-base/lore/characters/ | Momo, Akira, Niina, Ayaka profiles |
| `the-foundation.md` | knowledge-base/lore/factions/ | Antagonist organization details |
| `independents.md` | knowledge-base/lore/factions/ | Ika's faction details |
| `devotion-system.md` | knowledge-base/lore/mechanics/ | Fan energy power mechanics |
| `the-chase.md` | knowledge-base/lore/mechanics/ | Core competition format |
| `fading.md` | knowledge-base/lore/mechanics/ | What happens when idols lose fans |
| `senpai-mystery.md` | knowledge-base/lore/mechanics/ | The enigma of Senpai/Onii-chan |
| `volume-1-awakening.md` | knowledge-base/light-novels/ | Placeholder for Vol 1 (full text needed) |
| `volume-2-the-fall.md` | knowledge-base/light-novels/ | Placeholder for Vol 2 (full text needed) |
| `pre-registration-spec.md` | knowledge-base/game-mechanics/ | Complete pre-reg system |
| `gem-system.md` | knowledge-base/game-mechanics/ | Currency mechanics |
| `gacha-system.md` | knowledge-base/game-mechanics/ | Lootboxes, pets, items |
| `battle-pass.md` | knowledge-base/game-mechanics/ | NFT progression |
| `cosmetics.md` | knowledge-base/game-mechanics/ | Outfit sets and items |
| `voice-and-tone.md` | knowledge-base/brand/ | Communication guidelines |
| `visual-identity.md` | knowledge-base/brand/ | Colors, aesthetic guidelines |
| `target-audience.md` | knowledge-base/brand/ | Male otaku, crypto users profile |
| `competitors.md` | knowledge-base/brand/ | Genshin, Blue Archive, NIKKE analysis |
| `sui-integration.md` | knowledge-base/crypto/ | Blockchain specifics |
| `tokenomics.md` | knowledge-base/crypto/ | Gem packages, pricing |
| `web3-positioning.md` | knowledge-base/crypto/ | Differentiation from failed Web3 games |
| `master-calendar.md` | outputs/calendar/ | All scheduled content/events |
| `agent-activity.md` | logs/ | What each agent did |
| `decisions.md` | logs/ | Major decisions and rationale |
| `pending-human-review.md` | reviews/ | Items needing Sheran's approval |
| `approved.md` | reviews/ | Approved items log |
| `feedback.md` | reviews/ | Human feedback for learning |
| `.gitkeep` | outputs/content/tweets/ | Placeholder for tweet outputs |
| `.gitkeep` | outputs/content/threads/ | Placeholder for thread outputs |
| `.gitkeep` | outputs/content/articles/ | Placeholder for article outputs |
| `.gitkeep` | outputs/discord/events/ | Placeholder for Discord events |
| `.gitkeep` | outputs/discord/seven-gates/ | Placeholder for Seven Gates content |
| `.gitkeep` | outputs/seasons/ | Placeholder for seasonal content |
| `.gitkeep` | outputs/music/suno-prompts/ | Placeholder for Suno prompts |
| `.gitkeep` | outputs/art/midjourney-prompts/ | Placeholder for Midjourney prompts |

## Files to Reference

These files contain source materials to extract content from:

| File | Pattern to Copy |
|------|----------------|
| `FULL_AUTO_CLAUDE_PROMPT.md` | Complete folder structure, CLAUDE.md content, agent personas, brand guidelines |
| `SOURCE_MATERIALS_APPENDIX.md` | Lore bible (characters, world, mechanics), pre-registration specification |

## Patterns to Follow

### Agent Persona File Structure

From `FULL_AUTO_CLAUDE_PROMPT.md`:

```markdown
# Agent: [Role Name]

## Identity
[Brief description of who this agent is]

## Responsibilities
- [List of responsibilities]

## [Role-specific sections]
- Decision frameworks
- Output formats
- Workflows
```

**Key Points:**
- Each agent has clear identity and scope
- Responsibilities are actionable
- Output formats are specified
- Agents reference other files they need to read

### Knowledge Base Lore Structure

From `SOURCE_MATERIALS_APPENDIX.md`:

```markdown
# [Topic Name]

## Overview
[Brief summary]

## Details
[Full content with headers]

## Canon Implications
[What this affects in other files]
```

**Key Points:**
- Lore files should be self-contained but cross-referenced
- Include narrative context, not just facts
- Maintain consistent voice (self-aware, dark luxury)

### Game Mechanics Structure

From pre-registration spec in `SOURCE_MATERIALS_APPENDIX.md`:

```markdown
# [System Name]

## How It Works
[Clear explanation]

## Rules
- [Specific rules]

## Related Systems
- Links to other mechanics
```

**Key Points:**
- Technical accuracy is critical
- Include all numbers/values from source
- Explain whale psychology where relevant

## Requirements

### Functional Requirements

1. **Complete Folder Structure**
   - Description: Create all 40+ directories matching the spec
   - Acceptance: All directories exist with proper nesting

2. **CLAUDE.md Master File**
   - Description: Create comprehensive master instructions that all agents read first
   - Acceptance: Contains project overview, agent system, file permissions, workflows, content guidelines, canon rules

3. **Agent Persona Files**
   - Description: Create all 7 agent persona definitions
   - Acceptance: Each file contains identity, responsibilities, decision framework, output format

4. **Knowledge Base - Lore**
   - Description: Extract and organize world, character, faction, mechanics content
   - Acceptance: All lore files populated with content from source materials

5. **Knowledge Base - Game Mechanics**
   - Description: Create complete pre-registration system documentation
   - Acceptance: Gem system, gacha, battle pass, cosmetics fully documented

6. **Knowledge Base - Brand**
   - Description: Create voice/tone, visual identity, target audience, competitor analysis
   - Acceptance: All brand files contain actionable guidelines

7. **Output Infrastructure**
   - Description: Create outputs/ folder structure with proper organization
   - Acceptance: All output directories exist with .gitkeep files

8. **Review System**
   - Description: Create human review workflow and templates
   - Acceptance: pending-human-review.md, approved.md, feedback.md exist with templates

### Edge Cases

1. **Missing Light Novel Text** - Create placeholder files with instructions to add full text
2. **Incomplete Source Material** - Note gaps and mark as "TBD" where content is missing
3. **Cross-Reference Integrity** - Ensure all file references in CLAUDE.md match actual file paths

## Implementation Notes

### DO
- Follow exact folder structure from FULL_AUTO_CLAUDE_PROMPT.md
- Extract content verbatim from SOURCE_MATERIALS_APPENDIX.md where applicable
- Maintain dark luxury aesthetic in all content
- Include all numerical values from pre-registration spec
- Create .gitkeep files in all empty directories
- Use consistent markdown formatting across all files

### DON'T
- Create actual generated content (tweets, etc.) - that's for agents
- Deviate from the specified folder structure
- Make up lore or mechanics not in source materials
- Use cutesy/pink aesthetic language
- Skip any agent persona files
- Forget to initialize the review system templates

## Development Environment

### Start Services

```bash
# No services to start - this is a documentation repository
# Verification: Check that all files exist
find . -type f -name "*.md" | wc -l  # Should be 45+ files
```

### Required Files
- `FULL_AUTO_CLAUDE_PROMPT.md` - Source material (already exists)
- `SOURCE_MATERIALS_APPENDIX.md` - Source material (already exists)

## Success Criteria

The task is complete when:

1. [ ] All 40+ directories created per specification
2. [ ] CLAUDE.md exists with complete master instructions
3. [ ] README.md exists with project overview
4. [ ] All 7 agent persona files exist in agents/
5. [ ] All knowledge-base/lore/ files populated
6. [ ] All knowledge-base/game-mechanics/ files populated
7. [ ] All knowledge-base/brand/ files populated
8. [ ] All knowledge-base/crypto/ files populated
9. [ ] outputs/ folder structure exists with .gitkeep files
10. [ ] logs/ initialized with agent-activity.md and decisions.md
11. [ ] reviews/ initialized with all template files
12. [ ] master-calendar.md initialized
13. [ ] No broken cross-references between files
14. [ ] All content follows dark luxury aesthetic
15. [ ] File structure matches FULL_AUTO_CLAUDE_PROMPT.md exactly

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Structure Verification Tests
| Test | Command | What to Verify |
|------|---------|----------------|
| Directory count | `find . -type d | wc -l` | Should be 25+ directories |
| Markdown file count | `find . -name "*.md" | wc -l` | Should be 45+ files |
| .gitkeep count | `find . -name ".gitkeep" | wc -l` | Should be 8+ files |

### File Existence Tests
| Test | File | What to Verify |
|------|------|----------------|
| Master instructions | `CLAUDE.md` | File exists and is > 5000 characters |
| README | `README.md` | File exists with Quick Start section |
| Coordinator agent | `agents/00-coordinator.md` | File exists with Identity section |
| Lore architect agent | `agents/01-lore-architect.md` | File exists with Identity section |
| Content strategist agent | `agents/02-content-strategist.md` | File exists with Content Pillars |
| Community manager agent | `agents/03-community-manager.md` | File exists with Seven Gates |
| Gacha designer agent | `agents/04-gacha-designer.md` | File exists with Whale Psychology |
| Analytics observer agent | `agents/05-analytics-observer.md` | File exists with Metrics section |
| Asset coordinator agent | `agents/06-asset-coordinator.md` | File exists with Suno/Midjourney sections |

### Content Verification Tests
| Test | File | What to Verify |
|------|------|----------------|
| Core world lore | `knowledge-base/lore/core-world.md` | Contains Devotion, Fading, Chase sections |
| Ika character | `knowledge-base/lore/characters/ika-minami.md` | Contains pink gradient hair, 47 fans |
| Gem system | `knowledge-base/game-mechanics/gem-system.md` | Contains all 6 SUI→Gem conversion rates |
| Battle pass | `knowledge-base/game-mechanics/battle-pass.md` | Contains all 6 visual tiers (Bronze→Cosmic) |
| Voice and tone | `knowledge-base/brand/voice-and-tone.md` | Contains "shameless but genuine", "dark luxury" |
| Target audience | `knowledge-base/brand/target-audience.md` | Contains male otaku crypto users demographic |

### Cross-Reference Tests
| Test | Files | What to Verify |
|------|-------|----------------|
| Agent file references | `CLAUDE.md` → `agents/*.md` | All agent files referenced exist |
| Knowledge base references | `CLAUDE.md` → `knowledge-base/lore/core-world.md` | Core world file exists |
| Calendar reference | `CLAUDE.md` → `outputs/calendar/master-calendar.md` | Calendar file exists |

### Canon Consistency Tests
| Check | Source | What to Verify |
|-------|--------|----------------|
| Ika's hair color | All character references | Pink gradient (rose roots to magenta tips) |
| Devotion definition | All lore files | Literal emotional energy from fans |
| Fading mechanics | All references | Ceasing to exist when fans stop caring |
| Game blockchain | All game mechanics | SUI blockchain |
| 10 canon rules | `CLAUDE.md` | All 10 inviolable facts present |

### Browser Verification (Not Applicable)
N/A - This is a documentation repository with no frontend

### Database Verification (Not Applicable)
N/A - This is a documentation repository with no database

### QA Sign-off Requirements
- [ ] All directories created per specification
- [ ] All 45+ markdown files exist
- [ ] All 8+ .gitkeep files in empty directories
- [ ] CLAUDE.md contains all required sections
- [ ] All 7 agent files contain required sections
- [ ] All knowledge base files populated with source content
- [ ] No broken cross-references
- [ ] Canon consistency verified across all files
- [ ] Dark luxury aesthetic maintained (no pink/cutesy language)
- [ ] All numerical values from pre-registration spec accurate

## Execution Checklist

Implementation should follow this order:

1. **Phase 1: Structure** - Create all directories
2. **Phase 2: Core Files** - Create CLAUDE.md and README.md
3. **Phase 3: Agents** - Create all 7 agent persona files
4. **Phase 4: Lore** - Populate knowledge-base/lore/ from source materials
5. **Phase 5: Mechanics** - Populate knowledge-base/game-mechanics/
6. **Phase 6: Brand** - Populate knowledge-base/brand/
7. **Phase 7: Crypto** - Populate knowledge-base/crypto/
8. **Phase 8: Outputs** - Create outputs/ structure with .gitkeep files
9. **Phase 9: System** - Initialize logs/ and reviews/
10. **Phase 10: Verification** - Run all QA tests
