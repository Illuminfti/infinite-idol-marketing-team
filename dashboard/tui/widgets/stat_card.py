"""Stat card widget for displaying statistics."""

from typing import Optional
from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Static


class StatCard(Container):
    """A card widget displaying a statistic.

    Shows an icon, value, and label in a bordered container.
    """

    DEFAULT_CSS = """
    StatCard {
        width: 1fr;
        height: 5;
        border: solid $primary;
        background: $surface;
        padding: 0 1;
    }

    StatCard .stat-value {
        text-style: bold;
        color: $primary;
        text-align: center;
        height: 3;
        content-align: center middle;
    }

    StatCard .stat-label {
        color: $text;
        text-align: center;
        height: 2;
        content-align: center middle;
    }
    """

    def __init__(
        self,
        icon: str,
        value: str,
        label: str,
        *,
        name: Optional[str] = None,
        id: Optional[str] = None,
        classes: Optional[str] = None,
    ):
        """Initialize the stat card.

        Args:
            icon: Emoji or icon to display
            value: The statistic value
            label: The statistic label
            name: Widget name
            id: Widget ID
            classes: CSS classes
        """
        super().__init__(name=name, id=id, classes=classes)
        self.icon = icon
        self.value_text = value
        self.label_text = label

    def compose(self) -> ComposeResult:
        """Compose the stat card."""
        yield Static(f"{self.icon} [b]{self.value_text}[/b]", classes="stat-value")
        yield Static(self.label_text, classes="stat-label")

    def update_value(self, value: str) -> None:
        """Update the stat value.

        Args:
            value: New value to display
        """
        self.value_text = value
        value_widget = self.query_one(".stat-value", Static)
        value_widget.update(f"{self.icon} [b]{value}[/b]")
