# Remote Access: Infinite Idol Agents from Any Repository

This guide explains how to summon Infinite Idol agents, skills, and knowledge from any Claude Code instance, even when working in a completely different repository.

---

## Quick Start

### Option 1: Run the Installer (Recommended)

```bash
# From the infinite-idol-marketing-team directory
./install-global.sh
```

This installs global slash commands and configures the MCP server.

---

## Access Methods

### Method A: Global Slash Commands

After running the installer, these commands work from **any directory**:

| Command | Description |
|---------|-------------|
| `/ii-agent 02` | Summon Content Strategist |
| `/ii-agent degen` | Summon Resident Degen |
| `/ii-skill content-creation` | Load a skill workflow |
| `/ii-lore characters` | Query the knowledge base |
| `/ii-facts` | Get the 10 Inviolable Facts |
| `/ii-queue` | Check task queue status |

**Agent IDs:**
- `00` / `coordinator` - Marketing Director
- `01` / `lore` - Lore Architect
- `02` / `content` - Content Strategist
- `03` / `community` - Community Manager
- `04` / `gacha` - Gacha Designer
- `05` / `analytics` - Analytics Observer
- `06` / `asset` - Asset Coordinator
- `07` / `novel` - Light Novel Writer
- `08` / `guardian` - Lore Guardian
- `09` / `degen` - Resident Degen
- `14` / `shield` - The Shield (Crisis)
- `15` / `simp` - Simp Whisperer
- `16` / `neet` - The NEET
- `17` / `architect` - The Architect
- `18` / `hypeman` - The Hypeman
- `19` / `information` - Information Architect

---

### Method B: MCP Server (Most Powerful)

The MCP server exposes rich tools for agent interaction.

#### Setup

1. Install dependencies:
   ```bash
   cd /path/to/infinite-idol-marketing-team/mcp-server
   npm install
   ```

2. Add to your Claude Code settings (`~/.claude/settings.json`):
   ```json
   {
     "mcpServers": {
       "infinite-idol": {
         "command": "node",
         "args": ["/path/to/infinite-idol-marketing-team/mcp-server/index.js"]
       }
     }
   }
   ```

3. Restart Claude Code.

#### Available MCP Tools

| Tool | Description |
|------|-------------|
| `summon_agent` | Activate an agent with full context |
| `get_skill` | Load a specific skill workflow |
| `query_lore` | Query knowledge base by category |
| `get_inviolable_facts` | Get the 10 absolute rules |
| `list_agents` | List all available agents |
| `get_task_queue` | Check current tasks |

#### Example Usage

```
Use the summon_agent tool with:
- agent_id: "02"
- include_skills: ["content-creation", "cultural-review"]
```

---

### Method C: Direct File Reference

Simply tell Claude to read the files directly:

```
Read /home/user/infinite-idol-marketing-team/CLAUDE.md and
/home/user/infinite-idol-marketing-team/agents/02-content-strategist.md
then operate as that agent.
```

---

### Method D: Git Submodule

Add the repo as a submodule to other projects:

```bash
# In your other repo
git submodule add git@github.com:yourorg/infinite-idol-marketing-team.git .idol-agents

# Then reference in that project's CLAUDE.md:
# "For agent personas, see .idol-agents/agents/"
```

---

### Method E: Include in CLAUDE.md

In another project's CLAUDE.md, add:

```markdown
## External Agent System

For content creation tasks, load the Infinite Idol agent system:
- Master instructions: /home/user/infinite-idol-marketing-team/CLAUDE.md
- Agents: /home/user/infinite-idol-marketing-team/agents/
- Skills: /home/user/infinite-idol-marketing-team/skills/

Use /ii-agent <number> to activate.
```

---

## MCP Resources

The MCP server also exposes resources you can read:

| Resource URI | Description |
|--------------|-------------|
| `infinite-idol://claude.md` | Master instructions |
| `infinite-idol://agents/00` | Coordinator persona |
| `infinite-idol://agents/02` | Content Strategist persona |
| `infinite-idol://skills/content-creation` | Content creation skill |

---

## Examples

### Example 1: Write a Tweet from Another Repo

You're in a different codebase but need Ika's voice:

```
/ii-agent 02

Now write a tweet about the new gacha banner.
```

### Example 2: Check Lore Compliance

You're writing content elsewhere and need to verify it:

```
/ii-facts

Does this content violate any facts?
[your content here]
```

### Example 3: Load Just a Skill

You want the cultural review framework without full agent activation:

```
/ii-skill cultural-review

Review this content for degen authenticity.
```

### Example 4: Full Agent with Skills (MCP)

```
Use the summon_agent tool:
- agent_id: "09"
- include_skills: ["cultural-review", "content-creation"]

Then review this tweet for DS rating.
```

---

## Troubleshooting

### Commands not found
Run the installer: `./install-global.sh`

### MCP server not connecting
1. Check the path in settings.json is correct
2. Ensure Node.js is installed
3. Run `npm install` in the mcp-server directory
4. Restart Claude Code

### Agent can't find files
The installer hardcodes absolute paths. If you move the repo:
1. Run `./install-global.sh` again
2. Or update paths in `~/.claude/commands/ii-*.md`

### Permission errors
```bash
chmod +x install-global.sh
chmod +x mcp-server/index.js
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Other Repository                     │
│                                                              │
│  Claude Code Instance                                        │
│  ├─ Global Commands (~/.claude/commands/ii-*.md)             │
│  └─ MCP Server (infinite-idol)                               │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              infinite-idol-marketing-team/                   │
│                                                              │
│  ├─ CLAUDE.md          (master instructions)                 │
│  ├─ agents/            (20 agent personas)                   │
│  ├─ skills/            (12 modular workflows)                │
│  ├─ knowledge-base/    (lore, mechanics, brand)              │
│  ├─ mcp-server/        (MCP server implementation)           │
│  └─ automation/        (task queue, orchestration)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

| Method | Best For | Setup Required |
|--------|----------|----------------|
| Global Commands | Quick access | Run installer once |
| MCP Server | Rich tool integration | Install + configure |
| Direct Reference | One-off use | None |
| Git Submodule | Project integration | Git setup |
| CLAUDE.md Include | Permanent reference | Edit file |

**Recommended**: Run `./install-global.sh` for both global commands and MCP setup.

---

*"Every idol runs. Every fan watches. The agents answer from anywhere."*
