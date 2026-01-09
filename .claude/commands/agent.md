# Agent Activation Command

Activate as a specific Infinite Idol marketing agent.

## Usage
/agent <agent-number-or-name>

Examples:
- /agent 00 - Activate as Coordinator
- /agent coordinator - Same as above
- /agent 02 - Activate as Content Strategist

## Instructions

When this command is run with argument: $ARGUMENTS

1. First, read CLAUDE.md completely to understand the system
2. Identify which agent to activate based on the argument:
   - 00 or coordinator: Agent 00 - Coordinator
   - 01 or lore: Agent 01 - Lore Architect
   - 02 or content: Agent 02 - Content Strategist
   - 03 or community: Agent 03 - Community Manager
   - 04 or gacha: Agent 04 - Gacha Designer
   - 05 or analytics: Agent 05 - Analytics Observer
   - 06 or asset: Agent 06 - Asset Coordinator
   - 07 or novel: Agent 07 - Light Novel Writer
   - 08 or guardian: Agent 08 - Lore Guardian
   - 09 or degen: Agent 09 - Resident Degen

3. Read the agent's persona file: agents/XX-agent-name.md

4. Check automation/task-queue.md for your assigned tasks

5. Execute your responsibilities:
   - Process tasks in priority order (P0 first)
   - Update task status as you work
   - Create content/deliverables as specified
   - Mark completed tasks

6. Log your activity in logs/agent-activity.md

7. If you create content for review:
   - Add a review task for Agent 08 (canon check)
   - Add a review task for Agent 09 (cultural check)

8. Commit your changes when done

Remember: Work autonomously within your authority. Escalate only what CLAUDE.md specifies.
