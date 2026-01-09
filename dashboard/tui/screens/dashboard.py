"""Dashboard screen for the Infinite Idol TUI."""

from datetime import datetime
from textual.app import ComposeResult
from textual.containers import Container, Horizontal, Vertical, VerticalScroll
from textual.screen import Screen
from textual.widgets import Static

from ..widgets.stat_card import StatCard
from ..widgets.agent_grid import AgentGrid
from ..widgets.activity_feed import ActivityFeed


class DashboardScreen(Screen):
    """Main dashboard screen showing stats, agents, and activity."""

    DEFAULT_CSS = """
    DashboardScreen {
        background: $background;
    }

    DashboardScreen .stats-container {
        height: auto;
        padding: 1;
    }

    DashboardScreen .main-content {
        height: 1fr;
        padding: 0 1;
    }

    DashboardScreen .left-panel {
        width: 60%;
        height: 100%;
    }

    DashboardScreen .right-panel {
        width: 40%;
        height: 100%;
        padding: 0 0 0 1;
    }

    DashboardScreen .daily-report {
        border: solid $primary;
        background: $surface;
        padding: 1;
        height: 1fr;
        margin: 1 0 0 0;
    }

    DashboardScreen .report-title {
        text-style: bold;
        color: $primary;
        padding: 0 0 1 0;
    }

    DashboardScreen .report-content {
        color: $text;
    }

    DashboardScreen .report-section {
        padding: 1 0;
    }

    DashboardScreen .report-heading {
        text-style: bold;
        color: $primary;
    }
    """

    def __init__(self, state: dict, *args, **kwargs):
        """Initialize the dashboard screen.

        Args:
            state: Application state dictionary
            *args: Positional arguments for Screen
            **kwargs: Keyword arguments for Screen
        """
        super().__init__(*args, **kwargs)
        self.state = state

    def compose(self) -> ComposeResult:
        """Compose the dashboard screen."""
        # Stats row
        with Horizontal(classes="stats-container"):
            stats = self.state.get('stats', {})
            yield StatCard("📊", str(stats.get('tasks_total', 0)), "Total Tasks", id="stat-total")
            yield StatCard("⏳", str(stats.get('tasks_pending', 0)), "Pending", id="stat-pending")
            yield StatCard("🔄", str(stats.get('tasks_in_progress', 0)), "In Progress", id="stat-in-progress")
            yield StatCard("✅", str(stats.get('tasks_complete', 0)), "Complete", id="stat-complete")

        # Main content area
        with Horizontal(classes="main-content"):
            # Left panel - Agent grid and daily report
            with Vertical(classes="left-panel"):
                yield AgentGrid(
                    self.state.get('tasks', []),
                    id="agent-grid"
                )
                yield self._create_daily_report()

            # Right panel - Activity feed
            with Vertical(classes="right-panel"):
                yield ActivityFeed(
                    self.state.get('activities', []),
                    id="activity-feed"
                )

    def _create_daily_report(self) -> VerticalScroll:
        """Create the daily report panel.

        Returns:
            VerticalScroll container with daily report
        """
        container = VerticalScroll(classes="daily-report")

        # Title
        title = Static("📈 Last 24 Hours Report", classes="report-title")
        container.mount(title)

        # Get data
        tasks = self.state.get('tasks', [])
        activities = self.state.get('activities', [])
        stats = self.state.get('stats', {})

        # Summary section
        summary_text = f"""[b]Activity Summary:[/b]
• Total Tasks: {stats.get('tasks_total', 0)}
• Pending: {stats.get('tasks_pending', 0)}
• In Progress: {stats.get('tasks_in_progress', 0)}
• Complete: {stats.get('tasks_complete', 0)}
• Blocked: {stats.get('tasks_blocked', 0)}

• Recent Activities: {len(activities)}
"""
        summary = Static(summary_text, classes="report-content")
        container.mount(summary)

        # Agent activity breakdown
        agent_counts = {}
        for activity in activities[-20:]:  # Last 20 activities
            agent = activity.get('agent', 'Unknown')
            agent_counts[agent] = agent_counts.get(agent, 0) + 1

        if agent_counts:
            breakdown_text = "\n[b]Agent Activity Breakdown:[/b]\n"
            for agent, count in sorted(agent_counts.items(), key=lambda x: x[1], reverse=True):
                breakdown_text += f"• {agent}: {count} actions\n"

            breakdown = Static(breakdown_text, classes="report-content")
            container.mount(breakdown)

        # Blockers section
        blocked_tasks = [t for t in tasks if t.get('status', '').lower() == 'blocked']
        if blocked_tasks:
            blockers_text = "\n[b]🚫 Blockers:[/b]\n"
            for task in blocked_tasks[:5]:  # Show first 5
                task_id = task.get('id', 'N/A')
                task_name = task.get('task', 'Unknown')
                agent = task.get('agent', 'N/A')
                blockers_text += f"• [{task_id}] {task_name} (Agent {agent})\n"

            blockers = Static(blockers_text, classes="report-content")
            container.mount(blockers)

        # Priority actions
        priority_tasks = [t for t in tasks if t.get('status', '').lower() in ['pending', 'in_progress']
                         and 'P0' in t.get('priority', '').upper() or 'P1' in t.get('priority', '').upper()]
        priority_tasks = sorted(priority_tasks, key=lambda t: (t.get('priority', 'P9'), t.get('due', '')))

        if priority_tasks:
            priority_text = "\n[b]🎯 Priority Actions:[/b]\n"
            for task in priority_tasks[:5]:  # Show first 5
                task_id = task.get('id', 'N/A')
                priority = task.get('priority', 'N/A')
                task_name = task.get('task', 'Unknown')
                agent = task.get('agent', 'N/A')
                priority_text += f"• [{priority}] {task_name} (Agent {agent})\n"

            priority = Static(priority_text, classes="report-content")
            container.mount(priority)

        # Last update
        last_update = self.state.get('last_update')
        if last_update:
            update_text = f"\n[dim]Last updated: {last_update.strftime('%Y-%m-%d %H:%M:%S')}[/dim]"
            update = Static(update_text, classes="report-content")
            container.mount(update)

        return container

    def on_agent_grid_agent_clicked(self, message: AgentGrid.AgentClicked) -> None:
        """Handle agent button click.

        Args:
            message: The agent clicked message
        """
        agent = message.agent
        summon_cmd = f"/agent {agent['id']}"

        # Show notification with summon command
        self.app.notify(
            f"Agent {agent['id']} - {agent['name']}\n"
            f"Role: {agent['role']}\n"
            f"\n"
            f"To summon in Claude Code, use:\n"
            f"{summon_cmd}\n"
            f"\n"
            f"(Command copied to clipboard)",
            title=f"🎯 Summon Agent {agent['id']}",
            timeout=5
        )

        # Try to copy to clipboard (may not work in all terminals)
        try:
            import pyperclip
            pyperclip.copy(summon_cmd)
        except:
            # Clipboard not available, that's OK
            pass

    def refresh_data(self, state: dict) -> None:
        """Refresh the dashboard with new data.

        Args:
            state: Updated application state
        """
        self.state = state

        # Update stat cards
        stats = state.get('stats', {})
        self.query_one("#stat-total", StatCard).update_value(str(stats.get('tasks_total', 0)))
        self.query_one("#stat-pending", StatCard).update_value(str(stats.get('tasks_pending', 0)))
        self.query_one("#stat-in-progress", StatCard).update_value(str(stats.get('tasks_in_progress', 0)))
        self.query_one("#stat-complete", StatCard).update_value(str(stats.get('tasks_complete', 0)))

        # Update agent grid
        self.query_one("#agent-grid", AgentGrid).update_tasks(state.get('tasks', []))

        # Update activity feed
        self.query_one("#activity-feed", ActivityFeed).update_activities(state.get('activities', []))

        # Recreate daily report
        old_report = self.query_one(".daily-report")
        new_report = self._create_daily_report()
        old_report.remove()
        self.query_one(".left-panel").mount(new_report)
