# Content Pipeline Command

Run the content creation and review pipeline.

## Usage
/pipeline [stage]

Stages:
- /pipeline - Run full pipeline
- /pipeline create - Content creation only (Agent 02)
- /pipeline review - Review cycle only (Agent 08 + 09)
- /pipeline approve - Final approval (Agent 00)

## Instructions

When this command is run with argument: $ARGUMENTS

### Full Pipeline (no argument):

Execute the complete content pipeline in sequence:

1. **Content Creation (Agent 02)**
   - Read agents/02-content-strategist.md
   - Process CONTENT-* tasks from task-queue.md
   - Create content in outputs/content/tweets/ or outputs/content/threads/
   - Mark content as ready for review

2. **Canon Review (Agent 08)**
   - Read agents/08-lore-guardian.md
   - Review all draft content against:
     - 10 Inviolable Facts
     - Character profiles
     - Published light novels
   - Mark as CANON_APPROVED or NEEDS_REVISION

3. **Cultural Review (Agent 09)**
   - Read agents/09-resident-degen.md
   - Review approved content for:
     - Cultural authenticity
     - Trend freshness
     - Degen energy level
   - Mark as BASED or CRINGE (with notes)

4. **Final Approval (Agent 00)**
   - Read agents/00-coordinator.md
   - Review all approved content
   - Schedule on master-calendar.md
   - Update task-queue.md with completions

### Stage-specific runs:
Only execute the specified stage of the pipeline.

After each stage, commit changes with appropriate message.
