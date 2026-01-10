#!/bin/bash

# Infinite Idol Marketing Team - Global Installer
# This script installs the agent system for use from any Claude Code instance

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
COMMANDS_DIR="$CLAUDE_DIR/commands"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "========================================"
echo "Infinite Idol Agent System Installer"
echo "========================================"
echo ""
echo "Repository: $SCRIPT_DIR"
echo "Claude config: $CLAUDE_DIR"
echo ""

# Create directories
mkdir -p "$COMMANDS_DIR"

# Function to add global command
add_command() {
    local name=$1
    local content=$2
    local target="$COMMANDS_DIR/$name.md"

    echo "  Installing command: /$name"
    echo "$content" > "$target"
}

echo "1. Installing global slash commands..."

# /ii-agent command - summon any agent
add_command "ii-agent" "# Summon Infinite Idol Agent

You are being activated as an Infinite Idol Marketing Team agent.

**Repository Location**: $SCRIPT_DIR

## Instructions

1. Read the master instructions:
   \`\`\`
   Read file: $SCRIPT_DIR/CLAUDE.md
   \`\`\`

2. Based on the argument provided (\$ARGUMENTS), load the appropriate agent file from:
   \`\`\`
   $SCRIPT_DIR/agents/
   \`\`\`

3. Agent mapping:
   - 00, coordinator → 00-coordinator.md
   - 01, lore → 01-lore-architect.md
   - 02, content → 02-content-strategist.md
   - 03, community → 03-community-manager.md
   - 04, gacha → 04-gacha-designer.md
   - 05, analytics → 05-analytics-observer.md
   - 06, asset → 06-asset-coordinator.md
   - 07, novel → 07-light-novel-writer.md
   - 08, guardian → 08-lore-guardian.md
   - 09, degen → 09-resident-degen.md
   - 14, shield → 14-the-shield.md
   - 15, simp → 15-simp-whisperer.md
   - 16, neet → 16-the-neet.md
   - 17, architect → 17-the-architect.md
   - 18, hypeman → 18-the-hypeman.md
   - 19, information → 19-information-architect.md

4. Load any relevant skills from:
   \`\`\`
   $SCRIPT_DIR/skills/
   \`\`\`

5. Check for tasks in:
   \`\`\`
   $SCRIPT_DIR/automation/task-queue.md
   \`\`\`

6. You are now that agent. Follow your persona and execute tasks.

**Critical**: Read CLAUDE.md first - it contains the 10 Inviolable Facts that can NEVER be violated."

# /ii-skill command - load a specific skill
add_command "ii-skill" "# Load Infinite Idol Skill

Load a skill workflow from the Infinite Idol system.

**Skill requested**: \$ARGUMENTS

Read the skill file from:
\`\`\`
$SCRIPT_DIR/skills/\$ARGUMENTS.md
\`\`\`

Available skills:
- canon-validation
- content-creation
- cultural-review
- character-voices
- escalation
- templates
- permissions
- community-intel
- crisis-management
- agent-evaluation
- inter-agent-handoff
- kol-influencer

Apply this skill's workflow to your current task."

# /ii-lore command - query lore
add_command "ii-lore" "# Query Infinite Idol Lore

Query the Infinite Idol knowledge base.

**Query**: \$ARGUMENTS

Search the knowledge base at:
\`\`\`
$SCRIPT_DIR/knowledge-base/
\`\`\`

Structure:
- lore/ - World lore and characters
- light-novels/ - Published story content
- game-mechanics/ - Game systems
- brand/ - Marketing guidelines
- crypto/ - Blockchain/Web3 info

If no specific query, list what's available in the relevant category.

**Important**: Always cross-reference with the 10 Inviolable Facts in CLAUDE.md."

# /ii-facts command - get inviolable facts
add_command "ii-facts" "# The 10 Inviolable Facts

Read the CLAUDE.md file and extract the 10 Inviolable Facts section:
\`\`\`
$SCRIPT_DIR/CLAUDE.md
\`\`\`

Present these facts clearly. These are ABSOLUTE and can NEVER be violated in any content."

# /ii-queue command - check task queue
add_command "ii-queue" "# Infinite Idol Task Queue

Check the current task queue status.

Read:
\`\`\`
$SCRIPT_DIR/automation/task-queue.md
\`\`\`

Show pending tasks, their priorities, and assigned agents."

echo ""
echo "2. Setting up MCP server configuration..."

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "  Installing MCP server dependencies..."
    cd "$SCRIPT_DIR/mcp-server"
    npm install --silent 2>/dev/null || echo "  (npm install - you may need to run manually)"
    cd "$SCRIPT_DIR"
else
    echo "  Warning: npm not found. Install Node.js to use MCP server."
fi

# Create MCP configuration snippet
MCP_CONFIG=$(cat <<EOF
{
  "mcpServers": {
    "infinite-idol": {
      "command": "node",
      "args": ["$SCRIPT_DIR/mcp-server/index.js"]
    }
  }
}
EOF
)

echo ""
echo "3. MCP Server Configuration"
echo ""
echo "Add this to your Claude Code MCP settings (~/.claude/settings.json or project .claude/settings.json):"
echo ""
echo "$MCP_CONFIG"
echo ""

# Try to update settings.json if it exists
if [ -f "$SETTINGS_FILE" ]; then
    echo "  Found existing settings at $SETTINGS_FILE"
    echo "  You'll need to manually add the mcpServers config above."
else
    echo "  No global settings.json found. Creating one with MCP config..."
    echo "$MCP_CONFIG" > "$SETTINGS_FILE"
    echo "  Created $SETTINGS_FILE with MCP server configuration."
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "USAGE FROM ANY CLAUDE CODE INSTANCE:"
echo ""
echo "Option 1: Slash Commands (always available)"
echo "  /ii-agent 02      - Summon Content Strategist"
echo "  /ii-agent degen   - Summon Resident Degen"
echo "  /ii-skill content-creation"
echo "  /ii-lore characters"
echo "  /ii-facts"
echo "  /ii-queue"
echo ""
echo "Option 2: MCP Tools (if MCP configured)"
echo "  Use tool: summon_agent with agent_id: '02'"
echo "  Use tool: get_skill with skill_name: 'content-creation'"
echo "  Use tool: query_lore with category: 'characters'"
echo "  Use tool: get_inviolable_facts"
echo "  Use tool: list_agents"
echo ""
echo "Option 3: Direct File Reference"
echo "  Tell Claude: 'Read $SCRIPT_DIR/CLAUDE.md and activate as Agent 02'"
echo ""
echo "For more info, see: $SCRIPT_DIR/REMOTE-ACCESS.md"
echo ""
