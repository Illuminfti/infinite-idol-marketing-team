#!/bin/bash
# Infinite Idol Marketing Team - Agent Orchestrator
# Uses Claude Code CLI with your existing subscription

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/orchestrator.log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Check for Claude Code
check_claude() {
    if ! command -v claude &> /dev/null; then
        echo -e "${RED}Error: Claude Code CLI not found.${NC}"
        echo "Install with: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    log "${GREEN}Claude Code CLI found${NC}"
}

# Display help
show_help() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  Infinite Idol Marketing Team - Agent Orchestrator${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Usage: ./orchestrator.sh [COMMAND] [OPTIONS]"
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo "  run <agent>      Run a specific agent"
    echo "  queue            Process task queue (coordinator)"
    echo "  pipeline         Run full content pipeline"
    echo "  review           Run review pipeline (Agent 08 + 09)"
    echo "  daily            Run daily coordination"
    echo "  daemon           Run as background daemon (scheduled)"
    echo "  status           Show queue status"
    echo "  help             Show this help"
    echo ""
    echo -e "${CYAN}Agents:${NC}"
    echo "  00, coordinator     Marketing Director"
    echo "  01, lore            Lore Architect"
    echo "  02, content         Content Strategist"
    echo "  03, community       Community Manager"
    echo "  04, gacha           Gacha Designer"
    echo "  05, analytics       Analytics Observer"
    echo "  06, asset           Asset Coordinator"
    echo "  07, novel           Light Novel Writer"
    echo "  08, guardian        Lore Guardian"
    echo "  09, degen           Resident Degen"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  ./orchestrator.sh run 02"
    echo "  ./orchestrator.sh pipeline"
    echo "  ./orchestrator.sh daemon start"
    echo ""
}

# Resolve agent name from number or alias
resolve_agent() {
    case "$1" in
        00|coordinator) echo "00-coordinator" ;;
        01|lore) echo "01-lore-architect" ;;
        02|content) echo "02-content-strategist" ;;
        03|community) echo "03-community-manager" ;;
        04|gacha) echo "04-gacha-designer" ;;
        05|analytics) echo "05-analytics-observer" ;;
        06|asset) echo "06-asset-coordinator" ;;
        07|novel) echo "07-light-novel-writer" ;;
        08|guardian) echo "08-lore-guardian" ;;
        09|degen) echo "09-resident-degen" ;;
        *) echo "$1" ;;
    esac
}

# Build agent prompt
build_prompt() {
    local agent=$1
    local task=$2

    cat << EOF
You are activating as an Infinite Idol marketing agent. Work autonomously.

FIRST: Read CLAUDE.md completely.

Agent: ${agent}
Task: ${task:-Process your pending tasks from automation/task-queue.md}

Session Protocol:
1. Read CLAUDE.md (master instructions)
2. Read agents/${agent}.md (your persona)
3. Check automation/task-queue.md for your tasks
4. Execute tasks in priority order (P0 → P1 → P2 → P3)
5. Update task status as you work (PENDING → IN_PROGRESS → COMPLETE)
6. Log activity in logs/agent-activity.md
7. Commit changes when done

For content creation:
- Create content in outputs/content/tweets/ or outputs/content/threads/
- Add review tasks for Agent 08 (canon) and Agent 09 (cultural)

Escalate to reviews/pending-human-review.md only for:
- Canon conflicts
- New canon proposals
- Strategy changes
- Budget decisions

Work autonomously. Make decisions within your authority.
EOF
}

# Run a specific agent
run_agent() {
    local agent_input=$1
    local task=$2
    local agent=$(resolve_agent "$agent_input")

    log "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    log "${BLUE}Starting agent: ${agent}${NC}"
    log "${YELLOW}Task: ${task:-Process pending tasks}${NC}"
    log "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    cd "$PROJECT_ROOT"

    local prompt=$(build_prompt "$agent" "$task")

    # Run Claude Code - uses your existing subscription auth
    claude --print "$prompt"

    log "${GREEN}Agent session complete: ${agent}${NC}"
}

# Process the task queue
process_queue() {
    log "${PURPLE}Processing task queue...${NC}"
    run_agent "00-coordinator" "Review all agent task queues. Check for blocked tasks, update priorities, ensure content pipeline is flowing. Process any P0 tasks immediately."
}

# Run content pipeline
run_pipeline() {
    log "${PURPLE}Running content pipeline...${NC}"
    echo ""

    log "${CYAN}Step 1/4: Content Creation${NC}"
    run_agent "02-content-strategist" "Create pending content from task queue. Focus on P0 and P1 tasks."

    echo ""
    log "${CYAN}Step 2/4: Canon Review${NC}"
    run_agent "08-lore-guardian" "Review all draft content for canon compliance. Check against 10 Inviolable Facts."

    echo ""
    log "${CYAN}Step 3/4: Cultural Review${NC}"
    run_agent "09-resident-degen" "Cultural review all canon-approved content. Mark as BASED or provide revision notes."

    echo ""
    log "${CYAN}Step 4/4: Final Approval${NC}"
    run_agent "00-coordinator" "Final review and schedule all approved content to master-calendar.md"

    echo ""
    log "${GREEN}Content pipeline complete!${NC}"
}

# Run daily coordination
run_daily() {
    local hour=$(date +%H)

    log "${PURPLE}Daily coordination (Hour: ${hour})${NC}"

    if [ "$hour" -lt 12 ]; then
        run_agent "00-coordinator" "Morning coordination: Review queues, set priorities, check for blockers"
    elif [ "$hour" -lt 18 ]; then
        run_agent "00-coordinator" "Afternoon check: Review content pipeline progress, unblock tasks"
    else
        run_agent "00-coordinator" "Evening wrap-up: Summarize day's progress, prep tomorrow's priorities"
    fi
}

# Run review pipeline
run_review() {
    log "${PURPLE}Running review pipeline...${NC}"

    log "${CYAN}Canon Review (Agent 08)${NC}"
    run_agent "08-lore-guardian" "Review all pending content for canon compliance"

    echo ""
    log "${CYAN}Cultural Review (Agent 09)${NC}"
    run_agent "09-resident-degen" "Cultural review all canon-approved content"
}

# Run all agents
run_all() {
    log "${PURPLE}Running all agents...${NC}"
    log "${YELLOW}This will take a while!${NC}"

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
        run_agent "$agent"
    done

    log "${GREEN}All agent sessions complete!${NC}"
}

# Show queue status
show_status() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  Task Queue Status${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    cd "$PROJECT_ROOT"

    echo -e "${RED}P0 - CRITICAL:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \| P0" automation/task-queue.md 2>/dev/null | grep -v COMPLETE || echo "  None"

    echo ""
    echo -e "${YELLOW}PENDING:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| PENDING \|" automation/task-queue.md 2>/dev/null | head -10 || echo "  None"

    echo ""
    echo -e "${BLUE}IN PROGRESS:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| IN_PROGRESS \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${RED}BLOCKED:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| BLOCKED \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${CYAN}AWAITING REVIEW:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| REVIEW \|" automation/task-queue.md 2>/dev/null || echo "  None"

    echo ""
    echo -e "${GREEN}RECENTLY COMPLETED:${NC}"
    grep -E "^\| [A-Z]+-[0-9]+ \|.*\| COMPLETE \|" automation/task-queue.md 2>/dev/null | tail -5 || echo "  None"
    echo ""
}

# Daemon mode - run on schedule
DAEMON_PID_FILE="/tmp/infinite-idol-daemon.pid"

daemon_start() {
    if [ -f "$DAEMON_PID_FILE" ]; then
        local pid=$(cat "$DAEMON_PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Daemon already running (PID: $pid)${NC}"
            return
        fi
    fi

    echo -e "${GREEN}Starting daemon...${NC}"

    (
        while true; do
            local hour=$(date +%H)
            local minute=$(date +%M)

            # Run at 9 AM, 6 PM, 9 PM (local time)
            if [ "$minute" = "00" ]; then
                if [ "$hour" = "09" ]; then
                    log "Daemon: Morning coordination"
                    cd "$PROJECT_ROOT" && ./automation/orchestrator.sh daily >> "$LOG_FILE" 2>&1
                elif [ "$hour" = "18" ]; then
                    log "Daemon: Evening review"
                    cd "$PROJECT_ROOT" && ./automation/orchestrator.sh review >> "$LOG_FILE" 2>&1
                elif [ "$hour" = "21" ]; then
                    log "Daemon: Night queue processing"
                    cd "$PROJECT_ROOT" && ./automation/orchestrator.sh queue >> "$LOG_FILE" 2>&1
                fi
            fi

            sleep 60
        done
    ) &

    echo $! > "$DAEMON_PID_FILE"
    echo -e "${GREEN}Daemon started (PID: $(cat $DAEMON_PID_FILE))${NC}"
    echo "Logs: $LOG_FILE"
    echo ""
    echo "Schedule:"
    echo "  9 AM  - Daily coordination"
    echo "  6 PM  - Review pipeline"
    echo "  9 PM  - Queue processing"
}

daemon_stop() {
    if [ -f "$DAEMON_PID_FILE" ]; then
        local pid=$(cat "$DAEMON_PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            rm "$DAEMON_PID_FILE"
            echo -e "${GREEN}Daemon stopped${NC}"
        else
            rm "$DAEMON_PID_FILE"
            echo -e "${YELLOW}Daemon was not running${NC}"
        fi
    else
        echo -e "${YELLOW}No daemon running${NC}"
    fi
}

daemon_status() {
    if [ -f "$DAEMON_PID_FILE" ]; then
        local pid=$(cat "$DAEMON_PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${GREEN}Daemon running (PID: $pid)${NC}"
            echo "Log file: $LOG_FILE"
            echo ""
            echo "Recent activity:"
            tail -10 "$LOG_FILE" 2>/dev/null || echo "  No recent activity"
        else
            echo -e "${YELLOW}Daemon not running (stale PID file)${NC}"
        fi
    else
        echo -e "${YELLOW}Daemon not running${NC}"
    fi
}

# Main entry point
main() {
    check_claude

    case "${1:-help}" in
        run)
            if [ -z "$2" ]; then
                echo -e "${RED}Error: Specify an agent${NC}"
                echo "Usage: ./orchestrator.sh run <agent>"
                echo "Example: ./orchestrator.sh run 02"
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
        daemon)
            case "${2:-status}" in
                start) daemon_start ;;
                stop) daemon_stop ;;
                status) daemon_status ;;
                *) echo "Usage: ./orchestrator.sh daemon [start|stop|status]" ;;
            esac
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
