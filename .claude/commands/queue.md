# Task Queue Command

View and manage the agent task queue.

## Usage
/queue [action]

Actions:
- /queue - Show current queue status
- /queue add <agent> <task> - Add a new task
- /queue process - Process pending tasks as coordinator

## Instructions

When this command is run with argument: $ARGUMENTS

### If no argument or "status":
Read automation/task-queue.md and provide a summary:
1. Count tasks by status (PENDING, IN_PROGRESS, BLOCKED, REVIEW, COMPLETE)
2. List P0 tasks that need immediate attention
3. List any BLOCKED tasks and what they're waiting for
4. Show the dependency chain for pending work

### If "add":
Add a new task to automation/task-queue.md:
1. Parse the agent and task from the remaining arguments
2. Generate a unique task ID (AGENT-XXX format)
3. Set appropriate priority based on urgency keywords
4. Add to the correct agent's queue section
5. Commit the change

### If "process":
Activate as Agent 00 (Coordinator) and:
1. Review all pending tasks across all queues
2. Identify any blockers or dependencies
3. Update task statuses as appropriate
4. Assign any unassigned work
5. Log coordination activity
