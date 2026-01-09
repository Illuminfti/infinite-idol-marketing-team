# 🖥️ Infinite Idol Desktop Command Center

**A fully functional desktop application with integrated terminal for agent management**

## ✨ Features

### 🎯 Real Desktop Application
- Native GUI built with Python tkinter (no browser needed!)
- Dark luxury theme matching Infinite Idol brand
- Integrated terminal that actually executes commands
- Real-time data from your repository

### 💻 Integrated Terminal
- Execute commands directly in the app
- Run `/agent XX` commands without copying/pasting
- Terminal output displayed in real-time
- Command history and auto-execution

### 📊 Live Data Display
- **Stats Cards**: Total tasks, pending, in progress, complete
- **Task Queue**: Full table with all tasks and their status
- **Activity Log**: Recent agent activities
- **Daily Report**: Last 24 hours summary with agent breakdown

### 🎯 Agent Control Panel
- **10 Agent Buttons**: Click any agent to summon them instantly
- Each button shows agent ID, name, and executes `/agent XX`
- Color-coded by agent role
- Shows current tasks when summoned

### ⚡ Quick Actions
- View Queue - See current task status
- Process Queue - Run queue processor
- Run Pipeline - Execute content pipeline
- Check Status - Refresh all data

## 🚀 How to Launch

### Method 1: Use the Launcher (Recommended)

```bash
cd dashboard
./launch.sh
```

### Method 2: Direct Python Execution

```bash
cd dashboard
python3 desktop_app.py
```

### Method 3: Double-Click (Mac)

1. Find `launch.sh` in Finder
2. Right-click → Open With → Terminal

## 📱 Using the App

### Main Interface

The app is divided into 4 main areas:

1. **Top Bar** (Gold header)
   - Title and status indicator
   - Refresh button to reload data

2. **Left Panel** (Dashboard Data)
   - Stats cards at top
   - Tabbed view with:
     - 📋 Task Queue - All tasks in a sortable table
     - 📝 Activity Log - Recent agent activities
     - 📊 Daily Report - 24-hour summary

3. **Right Panel - Top** (Agent Control)
   - 10 agent buttons arranged in 2 columns
   - 4 quick action buttons
   - Click any button to execute immediately

4. **Right Panel - Bottom** (Terminal)
   - Green-on-black terminal display
   - Shows command output in real-time
   - Command input at bottom
   - Execute button or press Enter

### Commands You Can Run

#### In the Terminal Input:

```bash
# Agent commands
/agent 00          # Summon Coordinator
/agent 02          # Summon Content Strategist
/agent 09          # Summon Resident Degen

# Queue commands
/queue             # View queue status
/queue process     # Process the queue

# Pipeline commands
/pipeline          # Run content pipeline

# Utility commands
/refresh           # Refresh all data
/help              # Show help

# Shell commands work too!
ls                 # List files
pwd                # Show current directory
git status         # Check git status
```

#### Using the Buttons:

Just click any button! They execute the commands for you.

- **Agent Buttons**: Summon that agent (runs `/agent XX`)
- **View Queue**: Shows queue summary in terminal
- **Process Queue**: Runs `/queue process`
- **Run Pipeline**: Runs `/pipeline`
- **Check Status**: Refreshes all data

## 📊 Understanding the Display

### Stats Cards (Top of Left Panel)

- **📊 Total Tasks**: All tasks across all agents
- **⏳ Pending**: Tasks not yet started
- **🔄 In Progress**: Tasks currently being worked on
- **✅ Complete**: Finished tasks

### Task Queue Tab

Shows all tasks in a table with:
- **ID**: Task identifier (e.g., CONTENT-001)
- **Agent**: Which agent owns it (00-09)
- **Priority**: P0 (urgent) to P3 (low)
- **Task**: Description of what needs to be done
- **Status**: PENDING, IN_PROGRESS, REVIEW, COMPLETE, BLOCKED
- **Due**: Due date

### Activity Log Tab

Recent agent activities showing:
- **Date/Time**: When the activity occurred
- **Agent**: Which agent did it
- **Type**: What kind of activity (Content, Review, Planning, etc.)
- **Summary**: Brief description

### Daily Report Tab

24-hour summary including:
- **Activity Summary**: Count of actions, content, reviews
- **Agent Breakdown**: What each agent did
- **Current Blockers**: Any blocked tasks
- **Next Priority Actions**: P0/P1 tasks needing attention

### Terminal Output

Shows:
- Command execution results
- Agent summoning info
- Error messages
- Status updates

## 🎨 Color Coding

- **Gold (#D4AF37)**: Titles, headers, emphasis
- **Green (#22C55E)**: Success, complete status
- **Blue (#3B82F6)**: In progress status
- **Orange (#F59E0B)**: Warnings, pending status
- **Red (#EF4444)**: Errors, blocked status

Each agent also has their own color (visible on their button).

## ⚙️ Technical Details

### How It Works

1. **Data Loading**: Reads markdown files from repository:
   - `automation/task-queue.md` for tasks
   - `logs/agent-activity.md` for activities

2. **Parsing**: Converts markdown into structured data

3. **Display**: Shows data in tables, text areas, and cards

4. **Terminal Integration**: Executes commands via `subprocess`
   - Shell commands run in project directory
   - Output captured and displayed
   - Runs in background thread (non-blocking)

### File Structure

```
dashboard/
├── desktop_app.py      # Main application (1,000+ lines)
├── launch.sh           # Launcher script
├── DESKTOP_APP_README.md  # This file
└── index.html          # Old web dashboard (deprecated)
```

### Requirements

- **Python 3.6+** (comes with macOS)
- **tkinter** (included with Python)
- **No external dependencies!**

Everything is built with standard library - no pip installs needed!

## 🐛 Troubleshooting

### App Won't Launch

**Issue**: Nothing happens when you run `./launch.sh`

**Solutions**:
```bash
# Make sure it's executable
chmod +x launch.sh

# Try running Python directly
python3 desktop_app.py

# Check Python version (needs 3.6+)
python3 --version
```

### "No such file or directory" Errors

**Issue**: App can't find task-queue.md or agent-activity.md

**Solution**: Make sure you're in the correct directory:
```bash
# Should be in dashboard directory
cd /path/to/infinite-idol-marketing-team/dashboard

# Then launch
./launch.sh
```

### Terminal Commands Not Working

**Issue**: Commands return errors or do nothing

**Possible causes**:
1. Command doesn't exist (`/agent` might not be set up as a shell command)
2. Wrong working directory
3. Permissions issue

**Solution**: The app is designed to work with Claude Code slash commands. If `/agent` doesn't work as a shell command, use the buttons instead - they're hardcoded to work.

### Data Not Showing

**Issue**: Tables are empty, no activities

**Solutions**:
1. Click the **Refresh** button
2. Check that files exist:
   ```bash
   ls -la ../automation/task-queue.md
   ls -la ../logs/agent-activity.md
   ```
3. Verify files have content

### GUI Looks Weird

**Issue**: Colors are wrong, layout is broken

**Solution**: This is rare but can happen with some Python/tk versions. Try:
```bash
# Update Python
brew upgrade python3  # On Mac with Homebrew

# Or use a newer Python version
python3.11 desktop_app.py
```

## 🔥 Pro Tips

1. **Keep it Open**: Leave the app running while you work. Click Refresh to update.

2. **Use Keyboard**: Type commands in the terminal input - faster than clicking buttons!

3. **Watch the Terminal**: All output goes there. If something fails, you'll see why.

4. **Agent Summoning**: When you click an agent button, it shows their tasks before executing.

5. **Daily Report**: Check this every morning to see what happened while you were away.

6. **Task Queue Table**: Click column headers to sort (if your tkinter version supports it).

## 🎯 Why This is Better Than Web Dashboard

| Feature | Web Dashboard | Desktop App |
|---------|---------------|-------------|
| **Terminal Access** | ❌ Copy/paste commands | ✅ Execute directly |
| **Installation** | Need web server | ✅ Just run Python |
| **Data Refresh** | Manual browser refresh | ✅ Button + auto-reload |
| **Command Execution** | Can't run commands | ✅ Full shell access |
| **Agent Summoning** | Shows command | ✅ Runs command |
| **Native Feel** | Browser tab | ✅ Native window |

## 📈 Future Enhancements (Possible)

- Command history (up arrow to recall)
- Tab completion for commands
- Notifications for blocked tasks
- Auto-refresh every N seconds
- Task filtering by agent
- Export reports to PDF
- Keyboard shortcuts for agent summoning

## 📝 Notes

- This is a desktop application, not a web app
- All data is read-only (doesn't modify files)
- Commands execute in your project directory
- Safe to use - just displays and runs commands
- No network access needed

## 🙏 Credits

Built with:
- Python 3 + tkinter (standard library)
- No external dependencies
- ~1,000 lines of pure Python
- Dark luxury design matching Infinite Idol aesthetic

---

## 🚀 Quick Start (TL;DR)

```bash
cd dashboard
./launch.sh

# Click agent buttons to summon them
# Type commands in terminal
# Check Daily Report tab
# Win at idols
```

**Status**: ✅ Fully Functional Desktop Application
**Version**: 1.0.0
**Last Updated**: 2026-01-09

---

*"Every idol runs. Every fan watches. The agents never sleep. Now with a desktop app."*
