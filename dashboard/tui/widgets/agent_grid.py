"""Agent grid widget for displaying and summoning agents."""

from textual.app import ComposeResult
from textual.containers import Grid
from textual.widgets import Button
from textual.message import Message

from ..theme import AGENTS


class AgentGrid(Grid):
    """A grid of agent buttons for summoning."""

    DEFAULT_CSS = """
    AgentGrid {
        grid-size: 5 2;
        grid-gutter: 1;
        padding: 1;
        background: $surface;
        border: solid $primary;
        height: auto;
    }

    AgentGrid Button {
        height: 3;
        min-width: 15;
        text-style: bold;
        border: solid $panel;
    }

    AgentGrid Button:hover {
        border: solid $primary;
    }

    AgentGrid Button:focus {
        border: solid $primary;
    }
    """

    class AgentClicked(Message):
        """Message sent when an agent button is clicked."""

        def __init__(self, agent: dict) -> None:
            """Initialize the message.

            Args:
                agent: The agent dictionary
            """
            self.agent = agent
            super().__init__()

    def __init__(self, tasks: list = None, *args, **kwargs):
        """Initialize the agent grid.

        Args:
            tasks: List of tasks to count per agent
            *args: Positional arguments for Grid
            **kwargs: Keyword arguments for Grid
        """
        super().__init__(*args, **kwargs)
        self.tasks = tasks or []

    def compose(self) -> ComposeResult:
        """Compose the agent grid."""
        # Count tasks per agent
        task_counts = {}
        for task in self.tasks:
            agent_id = task.get('agent')
            if agent_id:
                task_counts[agent_id] = task_counts.get(agent_id, 0) + 1

        # Create button for each agent
        for agent in AGENTS:
            task_count = task_counts.get(agent['id'], 0)
            label = f"{agent['id']} {agent['abbr']}"
            if task_count > 0:
                label += f" ({task_count})"

            button = Button(
                label,
                id=f"agent-{agent['id']}",
                classes=f"agent-button agent-{agent['id']}"
            )
            button.agent = agent  # Store agent data on button
            yield button

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button press.

        Args:
            event: The button pressed event
        """
        if hasattr(event.button, 'agent'):
            self.post_message(self.AgentClicked(event.button.agent))

    def update_tasks(self, tasks: list) -> None:
        """Update the task counts on buttons.

        Args:
            tasks: List of tasks
        """
        self.tasks = tasks

        # Count tasks per agent
        task_counts = {}
        for task in self.tasks:
            agent_id = task.get('agent')
            if agent_id:
                task_counts[agent_id] = task_counts.get(agent_id, 0) + 1

        # Update button labels
        for agent in AGENTS:
            task_count = task_counts.get(agent['id'], 0)
            label = f"{agent['id']} {agent['abbr']}"
            if task_count > 0:
                label += f" ({task_count})"

            button = self.query_one(f"#agent-{agent['id']}", Button)
            button.label = label
