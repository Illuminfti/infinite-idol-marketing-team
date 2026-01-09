"""Activity feed widget for displaying recent activities."""

from textual.app import ComposeResult
from textual.containers import VerticalScroll
from textual.widgets import Static


class ActivityFeed(VerticalScroll):
    """A scrollable feed of recent activities."""

    DEFAULT_CSS = """
    ActivityFeed {
        border: solid $primary;
        background: $surface;
        padding: 1;
        height: 100%;
    }

    ActivityFeed .activity-item {
        color: $text;
        padding: 0 1;
    }

    ActivityFeed .activity-time {
        color: $text-muted;
    }

    ActivityFeed .activity-agent {
        color: $primary;
        text-style: bold;
    }

    ActivityFeed .feed-title {
        text-style: bold;
        color: $primary;
        padding: 0 0 1 0;
    }

    ActivityFeed .empty-state {
        color: $text-muted;
        text-align: center;
        padding: 2;
    }
    """

    def __init__(self, activities: list = None, *args, **kwargs):
        """Initialize the activity feed.

        Args:
            activities: List of activity dictionaries
            *args: Positional arguments for VerticalScroll
            **kwargs: Keyword arguments for VerticalScroll
        """
        super().__init__(*args, **kwargs)
        self.activities = activities or []

    def compose(self) -> ComposeResult:
        """Compose the activity feed."""
        yield Static("📝 Live Activity", classes="feed-title")

        if not self.activities:
            yield Static("No recent activities", classes="empty-state")
        else:
            # Show most recent activities first (last 20)
            recent = self.activities[-20:] if len(self.activities) > 20 else self.activities
            recent = reversed(recent)  # Most recent first

            for activity in recent:
                date = activity.get('date', '')
                time = activity.get('time', '')
                agent = activity.get('agent', 'Unknown')
                activity_type = activity.get('type', '')
                summary = activity.get('summary', '')

                # Format the activity line
                text = f"[dim]{time}[/dim] [b]{agent}[/b]"
                if summary:
                    text += f" - {summary}"
                elif activity_type:
                    text += f" - {activity_type}"

                yield Static(text, classes="activity-item")

    def update_activities(self, activities: list) -> None:
        """Update the activity feed with new activities.

        Args:
            activities: List of activity dictionaries
        """
        self.activities = activities

        # Remove all existing activity items
        for child in list(self.query(".activity-item")):
            child.remove()
        for child in list(self.query(".empty-state")):
            child.remove()

        if not self.activities:
            self.mount(Static("No recent activities", classes="empty-state"))
        else:
            # Show most recent activities first (last 20)
            recent = self.activities[-20:] if len(self.activities) > 20 else self.activities
            recent = list(reversed(recent))  # Most recent first

            for activity in recent:
                date = activity.get('date', '')
                time = activity.get('time', '')
                agent = activity.get('agent', 'Unknown')
                activity_type = activity.get('type', '')
                summary = activity.get('summary', '')

                # Format the activity line
                text = f"[dim]{time}[/dim] [b]{agent}[/b]"
                if summary:
                    text += f" - {summary}"
                elif activity_type:
                    text += f" - {activity_type}"

                self.mount(Static(text, classes="activity-item"))
