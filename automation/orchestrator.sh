#!/bin/bash
# Infinite Idol Marketing Team - Local Agent Orchestrator
# Run this script to execute agent sessions locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check for Claude Code
check_claude() {
    if ! command -v claude &> /dev/null; then
        echo -e "${RED}Error: Claude Code CLI not found.${NC}"
        echo "Install with: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
}

# Check for API key
check_api_key() {
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${YELLOW}Warning: ANTHROPIC_API_KEY not set.${NC}"
        echo "Set it with: export ANTHROPIC_API_KEY=your-key"
        exit 1
    fi
}

# Display help
show_help() {
    echo -e "${PURPLE}Infinite Idol Marketing Team - Agent Orchestrator${NC}"
    echo ""
    echo "Usage: ./orchestrator.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  run <agent>      Run a specific agent (e.g., 00-coordinator)"
    echo "  queue            Process the task queue with the coordinator"
    echo "  pipeline         Run the full content pipeline"
    echo "  daily            Run daily coordination routine"
    echo "  review           Run review pipeline (Agent 08 + 09)"
    echo "  all              Run all agents in sequence"
    echo "  status           Show current queue status"
    echo "  help             Show this help message"
    echo ""
    echo "Agents:"
    echo "  00-coordinator      Marketing Director - Orchestration"
    echo "  01-lore-architect   World Builder - Canon management"
    echo "  02-content-strategist Marketing Lead - Content creation"
    echo "  03-community-manager Engagement - Discord/community"
    echo "  04-gacha-designer   Seasonal Content - Banners/monetization"
    echo "  05-analytics-observer Performance Tracking - Metrics"
    echo "  06-asset-coordinator Creative Assets - Prompts"
    echo "  07-light-novel-writer Narrative - Story development"
    echo "  08-lore-guardian    Canon Validator - Verification"
    echo "  09-resident-degen   Cultural Enforcer - Trend/auth"
    echo ""
    echo "Examples:"
    echo "  ./orchestrator.sh run 02-content-strategist"
    echo "  ./orchestrator.sh daily"
    echo "  ./orchestrator.sh queue"
}

# Build agent prompt
build_prompt() {
    local agent=$1
    local task=$2

    cat << EOF
You are activating as an Infinite Idol marketing agent.

CRITICAL: First read CLAUDE.md completely.

Agent: ${agent}
Task: ${task:-Process your pending tasks from automation/task-queue.md}

Follow the Session Startup Protocol:
1. Read CLAUDE.md completely
2. Read your agent persona file: agents/${agent}.md
3. Check automation/task-queue.md for your assigned tasks
4. Execute your responsibilities based on your role
5. Update task-queue.md - mark tasks as IN_PROGRESS, then COMPLETE
6. Log your activity in logs/agent-activity.md
7. If you create content, mark it for review by Agent 08 and 09
8. Commit your changes when done

Priority Order:
- P0 tasks first (immediate)
- P1 tasks next (within 24h)
- P2 tasks after (within 48h)
- P3 tasks last (this week)

After completing work:
- Update task status in task-queue.md
- Create follow-up tasks for other agents if needed
- Add any escalations to reviews/pending-human-review.md
- Commit and push your changes

IMPORTANT: Work autonomously. Make decisions within your authority.
Escalate to human review only for items listed in CLAUDE.md escalation triggers.
EOF
}

# Run a specific agent
run_agent() {
    local agent=$1
    local task=$2

    echo -e "${BLUE}Starting agent session: ${agent}${NC}"
    echo -e "${YELLOW}Task: ${task:-Process pending tasks}${NC}"
    echo ""

    cd "$PROJECT_ROOT"

    local prompt=$(build_prompt "$agent" "$task")

    # Run Claude Code with the prompt
    claude --print "$prompt"

    echo ""
    echo -e "${GREEN}Agent session complete: ${agent}${NC}"
}

# Process the task queue
process_queue() {
    echo -e "${PURPLE}Processing task queue...${NC}"
    run_agent "00-coordinator" "Process all agent task queues. Review pending tasks, update priorities, and ensure pipeline is flowing."
}

# Run content pipeline
run_pipeline() {
    echo -e "${PURPLE}Running content pipeline...${NC}"
    echo ""

    echo -e "${BLUE}Step 1: Content creation (Agent 02)${NC}"
    run_agent "02-content-strategist" "Create pending content from task queue"

    echo ""
    echo -e "${BLUE}Step 2: Canon review (Agent 08)${NC}"
    run_agent "08-lore-guardian" "Review all draft content for canon compliance"

    echo ""
    echo -e "${BLUE}Step 3: Cultural review (Agent 09)${NC}"
    run_agent "09-resident-degen" "Cultural review all content awaiting approval"

    echo ""
    echo -e "${BLUE}Step 4: Final approval (Agent 00)${NC}"
    run_agent "00-coordinator" "Final review and scheduling of approved content"

    echo ""
    echo -e "${GREEN}Content pipeline complete!${NC}"
}

# Run daily coordination
run_daily() {
    local hour=$(date +%H)

    echo -e "${PURPLE}Running daily coordination (Hour: ${hour})${NC}"

    if [ "$hour" -lt 12 ]; then
        # Morning routine
        run_agent "00-coordinator" "Morning coordination: Review overnight activity, check queues, set daily priorities"
    elif [ "$hour" -lt 18 ]; then
        # Afternoon routine
        run_agent "00-coordinator" "Afternoon check: Review content pipeline progress, unblock any stuck tasks"
    else
        # Evening routine
        run_agent "00-coordinator" "Evening wrap-up: Review day's progress, prepare tomorrow's priorities"
    fi
}

# Run review pipeline
run_review() {
    echo -e "${PURPLE}Running review pipeline...${NC}"

    echo -e "${BLUE}Canon review (Agent 08)${NC}"
    run_agent "08-lore-guardian" "Review all pending content for canon compliance"

    echo ""
    echo -e "${BLUE}Cultural review (Agent 09)${NC}"
    run_agent "09-resident-degen" "Cultural review all content that passed canon check"
}

# Run all agents
run_all() {
    echo -e "${PURPLE}Running all agents in sequence...${NC}"
    echo -e "${YELLOW}This will take a while!${NC}"
    echo ""

    local agents=(
        "00-coordinator"
        "01-lore-architect"
        "02-content-strategist"
        "03-community-manager"
        "04-gacha-designer"
        "05-analytics-observer"
        "06-asset-coordinator"
        "07-light-novel-writer"
        "08-lore-guardian"
        "09-resident-degen"
    )

    for agent in "${agents[@]}"; do
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════${NC}"
        run_agent "$agent"
        echo -e "${BLUE}═══════════════════════════════════════${NC}"
    done

    echo ""
    echo -e "${GREEN}All agent sessions complete!${NC}"
}

# Show queue status
show_status() {
    echo -e "${PURPLE}Current Task Queue Status${NC}"
    echo ""

    cd "$PROJECT_ROOT"

    echo -e "${YELLOW}Pending Tasks:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| PENDING \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${BLUE}In Progress:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| IN_PROGRESS \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${RED}Blocked:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| BLOCKED \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${YELLOW}Awaiting Review:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| REVIEW \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${GREEN}Recently Completed:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| COMPLETE \|" automation/task-queue.md 2>/dev/null | head -5 || echo "  None"
}

# Main entry point
main() {
    check_claude
    check_api_key

    case "${1:-help}" in
        run)
            if [ -z "$2" ]; then
                echo -e "${RED}Error: Please specify an agent${NC}"
                echo "Usage: ./orchestrator.sh run <agent-name>"
                exit 1
            fi
            run_agent "$2" "$3"
            ;;
        queue)
            process_queue
            ;;
        pipeline)
            run_pipeline
            ;;
        daily)
            run_daily
            ;;
        review)
            run_review
            ;;
        all)
            run_all
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
