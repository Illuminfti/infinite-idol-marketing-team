# Infinite Idol TUI Dashboard - User Guide

Terminal UI dashboard for the Infinite Idol AI agent team command center.

## Installation

### Prerequisites

- Python 3.9 or higher
- pip package manager

### Install from source

```bash
cd dashboard
pip install -e .
```

This will install the `idol-dashboard` command globally.

### Install dependencies only

```bash
pip install textual>=0.50.0 rich>=13.0.0
```

## Launching the TUI

### Using installed command

```bash
idol-dashboard
```

### Running directly

```bash
python dashboard/tui_app.py
```

## Keyboard Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `1` | Dashboard screen (default) |
| `2` | Agents screen (coming soon) |
| `3` | Content pipeline (coming soon) |
| `4` | Reviews queue (coming soon) |
| `5` | Lore reference (coming soon) |
| `6` | Activity logs (coming soon) |
| `Tab` | Navigate between panels |
| `Shift+Tab` | Navigate backwards |
| `↑↓←→` | Navigate within lists/grids |
| `Enter` | Select/activate item |

### Actions

| Key | Action |
|-----|--------|
| `r` | Refresh data from markdown files |
| `Ctrl+K` or `/` | Open command palette (coming soon) |
| `?` | Show help overlay |
| `q` | Quit application |

## Dashboard Screen

The main dashboard shows:

### Stats Row (Top)

Four stat cards displaying:
- **Total Tasks**: All tasks in the queue
- **Pending**: Tasks not yet started
- **In Progress**: Tasks currently being worked on
- **Complete**: Finished tasks

### Agent Grid (Left)

10 agent buttons in a 5x2 grid:
- Agent 00 (Coordinator) - Purple
- Agent 01 (Lore Architect) - Pink
- Agent 02 (Content Strategist) - Blue
- Agent 03 (Community Manager) - Green
- Agent 04 (Gacha Designer) - Amber
- Agent 05 (Analytics Observer) - Indigo
- Agent 06 (Asset Coordinator) - Teal
- Agent 07 (Resident Degen) - Light Pink
- Agent 08 (Novel Guardian) - Purple
- Agent 09 (Automator) - Red

Each button shows:
- Agent ID and abbreviation
- Task count (if > 0)

Click an agent button to:
- View agent details
- Copy summon command (`/agent XX`) to clipboard

### Activity Feed (Right)

Scrollable feed of recent activities showing:
- Timestamp
- Agent name
- Activity summary

Most recent activities appear at the top. Shows last 20 activities.

### Daily Report (Bottom Left)

24-hour summary including:

**Activity Summary:**
- Task breakdown by status
- Recent activity count

**Agent Activity Breakdown:**
- Per-agent action counts
- Sorted by most active

**Blockers:**
- Tasks currently blocked
- Agent responsible
- Task ID and description

**Priority Actions:**
- Next P0/P1 tasks
- Sorted by priority and due date
- Shows first 5 high-priority items

## Claude Code Integration

The TUI is designed to work alongside Claude Code in split terminal panes.

### Recommended Terminal Layout

```
┌─────────────────────────────────────┐
│ TUI Dashboard (idol-dashboard)      │
│ Live monitoring and agent overview  │
├─────────────────────────────────────┤
│ Claude Code Session (claude)        │
│ Active agent work                   │
└─────────────────────────────────────┘
```

### Workflow

1. Launch TUI in one terminal: `idol-dashboard`
2. Launch Claude Code in another: `claude`
3. Use TUI to monitor system state
4. Click agent in TUI to get summon command
5. Paste command in Claude Code: `/agent 02`
6. Work on tasks while monitoring TUI
7. Press `r` in TUI to refresh data

## Data Sources

The TUI reads markdown files from the repository:

- **Tasks**: `/automation/task-queue.md`
- **Activities**: `/logs/agent-activity.md`
- **Content**: `/outputs/content/tweets/` and `/outputs/content/threads/`

## Customization

### Theme

The TUI uses a dark luxury aesthetic:
- Background: Black (#0A0A0B)
- Accents: Gold (#D4AF37)
- 10 distinct agent colors
- High contrast for readability

Colors are defined in `dashboard/tui/theme.py`.

### Agent Colors

Each agent has a unique color for quick visual identification:

| Agent | Color | Hex |
|-------|-------|-----|
| 00 | Purple | #8B5CF6 |
| 01 | Pink | #EC4899 |
| 02 | Blue | #3B82F6 |
| 03 | Green | #10B981 |
| 04 | Amber | #F59E0B |
| 05 | Indigo | #6366F1 |
| 06 | Teal | #14B8A6 |
| 07 | Light Pink | #F472B6 |
| 08 | Purple | #A855F7 |
| 09 | Red | #EF4444 |

## Troubleshooting

### TUI won't start

**Error:** `ModuleNotFoundError: No module named 'textual'`

**Solution:** Install dependencies:
```bash
pip install textual rich
```

### No data showing

**Error:** All stats show 0, no activities

**Solution:**
- Ensure markdown files exist in correct locations
- Check file permissions
- Press `r` to manually refresh

### Agent buttons don't copy to clipboard

**Note:** Clipboard functionality requires `pyperclip`:
```bash
pip install pyperclip
```

If clipboard doesn't work, the summon command is still shown in the notification.

### Colors look wrong

**Issue:** Colors appear incorrect or washed out

**Solution:**
- Use a terminal with 256-color support or better
- Try iTerm2 (macOS), Windows Terminal, or modern terminal emulators
- Ensure terminal color scheme doesn't conflict

## MVP Status (v1.0)

### Implemented ✅

- Dashboard screen with live data
- Stat cards (Total, Pending, In Progress, Complete)
- Agent grid with color coding
- Activity feed with recent actions
- Daily report with:
  - Activity summary
  - Agent breakdown
  - Blockers section
  - Priority actions
- Data loading from markdown files
- Refresh functionality
- Agent summoning
- Keyboard navigation
- Help overlay

### Coming Soon 🚧

- Agents screen (detailed agent view)
- Content pipeline screen (Kanban board)
- Reviews queue screen
- Activity logs screen (filterable)
- Lore reference screen
- Command palette (Ctrl+K)
- Auto-refresh option
- File watching for live updates
- Agent detail modals
- Task filtering and search

## Development

### Project Structure

```
dashboard/
├── tui_app.py              # Entry point
├── tui/
│   ├── app.py              # Main App class
│   ├── theme.py            # Colors and CSS
│   ├── data/
│   │   └── loader.py       # Data loading/parsing
│   ├── widgets/
│   │   ├── stat_card.py    # Stat displays
│   │   ├── agent_grid.py   # Agent grid
│   │   └── activity_feed.py # Activity feed
│   └── screens/
│       └── dashboard.py    # Dashboard screen
└── setup.py                # Installation config
```

### Running in development

```bash
python dashboard/tui_app.py
```

### Testing data loading

```python
from tui.data.loader import DataLoader

loader = DataLoader()
tasks = loader.load_task_queue()
activities = loader.load_activity_log()
stats = loader.calculate_stats(tasks)

print(f"Loaded {len(tasks)} tasks")
print(f"Loaded {len(activities)} activities")
print(f"Stats: {stats}")
```

## Support

For issues, feature requests, or questions:

1. Check this guide first
2. Review `/CLAUDE.md` for agent system context
3. Check `/README.md` for project overview
4. Ask your human operator

## Version History

### 2.0.0 (Current)

- Initial terminal UI release
- Replaces web dashboard and Tkinter app
- MVP with dashboard screen
- Dark luxury aesthetic
- Claude Code integration
- Real-time data from markdown files

---

**"Every idol runs. Every fan watches. The agents never sleep."**

*Infinite Idol - Web3 Gacha Game on SUI*
