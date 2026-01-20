"""Main Textual App for Infinite Idol TUI Dashboard."""

from datetime import datetime
from typing import Dict, List, Any

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.widgets import Header, Footer

from .data.loader import DataLoader
from .theme import CSS


class InfiniteIdolApp(App):
    """Infinite Idol Agent Command Center TUI Application."""

    CSS = CSS

    TITLE = "🎯 INFINITE IDOL - Agent Command Center"

    BINDINGS = [
        Binding("1", "switch_screen('dashboard')", "Dashboard", show=True, priority=True),
        Binding("2", "switch_screen('agents')", "Agents", show=False),
        Binding("3", "switch_screen('content')", "Content", show=False),
        Binding("4", "switch_screen('reviews')", "Reviews", show=False),
        Binding("5", "switch_screen('lore')", "Lore", show=False),
        Binding("6", "switch_screen('logs')", "Logs", show=False),
        Binding("r", "refresh_data", "Refresh", show=True, priority=True),
        Binding("ctrl+k", "show_command_palette", "Commands", show=False),
        Binding("slash", "show_command_palette", "Commands", show=False),
        Binding("question_mark", "show_help", "Help", show=True),
        Binding("q", "quit", "Quit", show=True, priority=True),
    ]

    def __init__(self):
        """Initialize the application."""
        super().__init__()
        self.data_loader = DataLoader()
        self.state = {
            'tasks': [],
            'activities': [],
            'content': [],
            'stats': {},
            'last_update': None,
            'loading': False
        }

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header(show_clock=True)
        yield Footer()

    def on_mount(self) -> None:
        """Called when app is mounted."""
        # Load initial data
        self.refresh_data()

        # Install screens
        from .screens.dashboard import DashboardScreen

        self.install_screen(DashboardScreen(self.state), name="dashboard")

        # Switch to dashboard
        self.push_screen("dashboard")

    def action_switch_screen(self, screen_name: str) -> None:
        """Switch to a different screen.

        Args:
            screen_name: Name of the screen to switch to
        """
        try:
            # For MVP, only dashboard is implemented
            if screen_name == "dashboard":
                self.push_screen(screen_name)
            else:
                self.notify(
                    f"{screen_name.title()} screen coming soon!",
                    title="Not Implemented",
                    severity="information",
                    timeout=2
                )
        except Exception as e:
            self.notify(
                f"Error switching screen: {e}",
                title="Error",
                severity="error"
            )

    def action_refresh_data(self) -> None:
        """Refresh all data from markdown files."""
        self.refresh_data()
        self.notify("Data refreshed", title="Success", timeout=1)

    def action_show_command_palette(self) -> None:
        """Show the command palette."""
        # For MVP, show a simple notification
        self.notify(
            "Command palette coming soon! Use number keys 1-6 for navigation.",
            title="Commands",
            severity="information",
            timeout=3
        )

    def action_show_help(self) -> None:
        """Show help overlay."""
        help_text = """
KEYBOARD SHORTCUTS:

Navigation:
  1-6   - Switch screens (Dashboard, Agents, Content, Reviews, Lore, Logs)
  Tab   - Navigate within screen
  ↑↓←→  - Navigate lists/grids
  Enter - Select/activate item

Actions:
  r     - Refresh data
  Ctrl+K or /  - Command palette
  ?     - Show this help
  q     - Quit

Dashboard:
  View stats, agent grid, activity feed, and daily report
  Click agents to summon them

Note: MVP includes Dashboard screen only.
Full implementation coming soon!
"""
        self.notify(
            help_text,
            title="Help",
            timeout=10
        )

    def refresh_data(self) -> None:
        """Load all data from markdown files."""
        try:
            self.state['loading'] = True

            # Load tasks
            self.state['tasks'] = self.data_loader.load_task_queue()

            # Load activities
            self.state['activities'] = self.data_loader.load_activity_log()

            # Load content
            self.state['content'] = self.data_loader.load_content_files()

            # Calculate stats
            self.state['stats'] = self.data_loader.calculate_stats(self.state['tasks'])

            # Update timestamp
            self.state['last_update'] = datetime.now()

            self.state['loading'] = False

            # Refresh the current screen if it's the dashboard
            if hasattr(self, 'screen') and self.screen.name == "dashboard":
                self.screen.refresh_data(self.state)

        except Exception as e:
            self.state['loading'] = False
            self.notify(
                f"Error loading data: {e}",
                title="Error",
                severity="error"
            )
