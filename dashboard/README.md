# Infinite Idol Dashboard - Command Center

Version 2.0.0 - Now with Terminal UI!

## 🆕 Terminal UI (Primary Interface)

The Infinite Idol dashboard is now available as a terminal UI (TUI) for seamless integration with Claude Code workflows.

**Launch the TUI:**
```bash
python dashboard/tui_app.py
```

Or install and use the command:
```bash
cd dashboard
pip install -e .
idol-dashboard
```

**See [TUI_GUIDE.md](./TUI_GUIDE.md) for complete documentation.**

---

## Legacy Web Dashboard (Deprecated)

The original web dashboard (v4.0.0) is still available but deprecated in favor of the terminal UI.

**To use the legacy web dashboard:** See the [Legacy Web Dashboard](#legacy-web-dashboard-v400) section below.

---

## Features

### ✅ Real Data Integration
- Parses actual task queue from `automation/task-queue.md`
- Reads agent activity log from `logs/agent-activity.md`
- Displays real content from `outputs/content/`
- All data is live and reflects the current repository state

### 📊 Daily Status Report
- Last 24 hours activity summary
- Tasks completed breakdown
- Content created count
- Reviews completed
- Agent activity by agent
- Current blockers
- Next priority actions (P0/P1 tasks)

### 🎯 Key Views

1. **Dashboard** - Overview with stats, agent grid, activity feed, and daily report
2. **Agents** - Detailed agent cards with tasks and recent activity
3. **Content Pipeline** - Kanban board showing tasks by status
4. **Reviews** - Content items awaiting your approval
5. **Activity Logs** - Complete history of agent actions
6. **Canon & Lore** - The 10 Inviolable Facts reference

### 🔥 Agent Summoning
- Click "Summon Agent" to get activation commands
- Copy `/agent XX` commands to use in Claude Code
- View agent tasks and recent activity in drawer

### ⚡ Quick Actions
- **Cmd/Ctrl + K**: Open command bar
- **Cmd/Ctrl + R**: Refresh all data
- **ESC**: Close modals/drawers

### 🔄 Data Refresh
- Click refresh button in top bar
- Auto-refresh on page focus (optional)
- Manual refresh via command bar: `/refresh`

---

## Legacy Web Dashboard (v4.0.0)

> **Note**: The web dashboard is deprecated. Please use the [Terminal UI](#-terminal-ui-primary-interface) instead.

### Usage (Web Dashboard)

#### Option 1: Python Server (Recommended)

```bash
# From the project root
cd dashboard
python3 -m http.server 8000

# Open browser to:
# http://localhost:8000
```

#### Option 2: Node/NPM Server

```bash
# If you have Node.js
npx serve dashboard -p 8000

# Open browser to:
# http://localhost:8000
```

#### Option 3: PHP Server

```bash
# If you have PHP
cd dashboard
php -S localhost:8000

# Open browser to:
# http://localhost:8000
```

#### Option 4: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Open dashboard/index.html
3. Right-click and select "Open with Live Server"

## Commands

Type these in the command bar (Cmd/Ctrl + K):

- `/agent XX` - Summon a specific agent (e.g., `/agent 02`)
- `/queue` - Show task queue
- `/queue process` - Get command to process queue
- `/refresh` - Refresh all data
- `dashboard` - Go to dashboard
- `agents` - Go to agents view
- `content` - Go to content pipeline
- `reviews` - Go to reviews
- `logs` - Go to activity logs
- `lore` - Go to canon & lore

## Troubleshooting

### Data Not Loading

If you see "Error loading data" or empty sections:

1. **Check you're using a local server** (not file:// protocol)
   - The dashboard needs to fetch files, which requires HTTP
   - Use one of the server options above

2. **Verify file paths are correct**
   - The dashboard expects to be in `/dashboard/` directory
   - Files should be at `../automation/task-queue.md`, etc.

3. **Check browser console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Common issues: CORS errors, 404s on files

### Refresh Not Working

- Hard refresh: Cmd/Ctrl + Shift + R
- Clear cache and reload
- Check that files have been updated

### Styles Look Broken

- Ensure styles.css is in the same directory
- Hard refresh browser
- Check browser DevTools console for CSS errors

## Architecture

### Data Flow

```
Repository Files (*.md)
    ↓
fetch() API calls
    ↓
Markdown Parsers
    ↓
Application State
    ↓
View Renderers
    ↓
DOM Updates
```

### Key Functions

- `loadAllData()` - Fetches all data from files
- `parseTaskQueue()` - Parses task-queue.md into task objects
- `parseActivityLog()` - Parses agent-activity.md into activity objects
- `renderDailyStatusReport()` - Generates 24h status report
- `updateDashboardStats()` - Updates all statistics
- `summonAgent()` - Shows agent activation commands

### File Structure

```
dashboard/
├── index.html          # Main HTML structure
├── app.js              # Application logic (v4.0.0)
├── styles.css          # Dark luxury design system
└── README.md           # This file
```

## Development

### Adding New Features

1. **New Data Source**: Add parser function and call in `loadAllData()`
2. **New View**: Add HTML section and render function
3. **New Command**: Add to `processCommand()` function
4. **New Style**: Follow existing CSS variable patterns

### Design Principles

- **Dark Luxury**: Black and gold color scheme
- **Apple-inspired**: Clean, clear, focused
- **Data-driven**: All information from real files
- **Responsive**: Works on desktop and mobile

## 5 Key Questions Answered

### 1. How does the dashboard read real data?
Client-side JavaScript uses `fetch()` to load markdown files, then parses them with regex into structured objects. State is maintained in memory and updated on refresh.

### 2. How do you trigger agent processing?
Click "Summon Agent" buttons to get copy-able `/agent XX` commands. Use these in Claude Code to activate agents. The dashboard provides the command, you execute it.

### 3. What's in the daily status report?
- Activities from last 24 hours
- Tasks completed by agent
- Content created count
- Reviews done
- Current blockers with details
- Next P0/P1 priority actions

### 4. How do you review content?
Navigate to "Reviews" view to see all draft/review content. Click "View Full" to see complete content with markdown rendering. Click "Approve" when ready.

### 5. How does data synchronization work?
- Manual "Refresh" button (primary method)
- Auto-refresh on page focus (optional)
- Cmd/Ctrl + R keyboard shortcut
- `/refresh` command in command bar
- Updates timestamp shown in reports

## Credits

Built with:
- **TUI**: Python Textual framework with dark luxury aesthetic
- **Web (Legacy)**: Vanilla JavaScript with CSS Custom Properties

**Current Version**: 2.0.0 (Terminal UI)
**Legacy Version**: 4.0.0 (Web Dashboard)
**Last Updated**: 2026-01-09
**Status**: TUI Active ✅ | Web Deprecated ⚠️

---

*"Every idol runs. Every fan watches. The agents never sleep."*
