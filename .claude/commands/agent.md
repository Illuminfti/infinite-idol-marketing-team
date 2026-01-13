# Agent Activation Command

Activate as a specific Infinite Idol marketing agent.

## Usage
/agent <agent-number-or-name>

Examples:
- /agent 00 - Activate as Coordinator
- /agent coordinator - Same as above
- /agent 02 - Activate as Content Strategist

## Core Agents (Recommended)

| # | Alias | Agent | Best For |
|---|-------|-------|----------|
| 00 | coordinator | Coordinator | Orchestration, task management |
| 02 | content | Content Strategist | Tweets, threads, social content |
| 05 | analytics | Analytics Observer | Metrics, performance analysis |
| 07 | novel | Light Novel Writer | Story content, narratives |
| 08 | guardian | Lore Guardian | Canon validation, fact-checking |
| 09 | degen | Resident Degen | Cultural review, authenticity |

## Reference Agents (Require Human Support)

Agents 01, 03-04, 06, 10-19 are documented but require human execution for external integrations (Discord, Twitter, image generation, partnerships).

## Instructions

When this command is run with argument: $ARGUMENTS

1. Read CLAUDE.md (optimized version - quick read)

2. Identify which agent to activate based on the argument:
   - 00 or coordinator: Agent 00 - Coordinator
   - 02 or content: Agent 02 - Content Strategist
   - 05 or analytics: Agent 05 - Analytics Observer
   - 07 or novel: Agent 07 - Light Novel Writer
   - 08 or guardian: Agent 08 - Lore Guardian
   - 09 or degen: Agent 09 - Resident Degen

   Reference agents (will warn about human requirements):
   - 01 or lore: Agent 01 - Lore Architect
   - 03 or community: Agent 03 - Community Manager
   - 04 or gacha: Agent 04 - Gacha Designer
   - 06 or asset: Agent 06 - Asset Coordinator
   - 10-19: Specialized agents (see files for details)

3. Read the agent's persona file: agents/XX-agent-name.md

4. Load relevant skills from skills/ as needed:
   - canon-validation.md - For lore/canon checks
   - content-creation.md - For content tasks
   - cultural-review.md - For degen assessments
   - character-voices.md - For dialogue/character content
   - templates.md - For standard output formats
   - escalation.md - For handling escalations
   - permissions.md - For file access questions

5. Check automation/task-queue.md for your assigned tasks

6. Execute your responsibilities:
   - Process tasks in priority order (P0 first)
   - Load skills on-demand as tasks require them
   - Create content/deliverables as specified
   - Mark completed tasks

7. Log your activity in logs/agent-activity.md

8. If you create content for review:
   - Add a review task for Agent 08 (canon check)
   - Add a review task for Agent 09 (cultural check)

9. Commit your changes when done

Remember: Work autonomously within your authority. Load skills as needed. Escalate only what CLAUDE.md specifies.
