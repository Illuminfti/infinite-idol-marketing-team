"""Theme and styling for Infinite Idol TUI Dashboard.

Defines dark luxury color scheme and Textual CSS.
"""

# Agent definitions
AGENTS = [
    {"id": "00", "name": "Coordinator", "abbr": "COR", "role": "Marketing Director", "color": "#8B5CF6"},
    {"id": "01", "name": "Lore Architect", "abbr": "LOR", "role": "Worldbuilding Specialist", "color": "#EC4899"},
    {"id": "02", "name": "Content Strategist", "abbr": "CON", "role": "Social Media Lead", "color": "#3B82F6"},
    {"id": "03", "name": "Community Manager", "abbr": "COM", "role": "Discord & Engagement", "color": "#10B981"},
    {"id": "04", "name": "Gacha Designer", "abbr": "GAC", "role": "Seasonal Content", "color": "#F59E0B"},
    {"id": "05", "name": "Analytics Observer", "abbr": "ANA", "role": "Performance Tracking", "color": "#6366F1"},
    {"id": "06", "name": "Asset Coordinator", "abbr": "ASS", "role": "Creative Assets", "color": "#14B8A6"},
    {"id": "07", "name": "Resident Degen", "abbr": "DEG", "role": "Cultural Enforcer", "color": "#F472B6"},
    {"id": "08", "name": "Novel Guardian", "abbr": "NOV", "role": "Canon Guardian", "color": "#A855F7"},
    {"id": "09", "name": "Automator", "abbr": "GUA", "role": "Automation", "color": "#EF4444"},
]

# Textual CSS for the application
CSS = """
/* Global styles */
Screen {
    background: #0A0A0B;
}

/* Header */
.header {
    dock: top;
    height: 3;
    background: #1A1A1D;
    color: #D4AF37;
    content-align: center middle;
}

.header-title {
    text-style: bold;
    color: #D4AF37;
}

/* Status bar */
.status-bar {
    dock: bottom;
    height: 1;
    background: #1A1A1D;
    color: #A3A3A3;
}

/* Stat cards */
.stat-card {
    border: solid #D4AF37;
    background: #232326;
    height: 5;
    padding: 0 1;
    margin: 0 1;
}

.stat-card-value {
    text-style: bold;
    color: #D4AF37;
    content-align: center middle;
}

.stat-card-label {
    color: #E5E5E5;
    content-align: center middle;
}

/* Agent grid */
.agent-grid {
    padding: 1;
    background: #1A1A1D;
    border: solid #D4AF37;
}

.agent-button {
    height: 3;
    min-width: 15;
    text-style: bold;
    border: solid #737373;
}

.agent-button:hover {
    border: solid #D4AF37;
    text-style: bold;
}

.agent-button:focus {
    border: solid #D4AF37;
    text-style: bold;
}

/* Agent-specific colors */
.agent-00 { background: #8B5CF6; color: white; }
.agent-01 { background: #EC4899; color: white; }
.agent-02 { background: #3B82F6; color: white; }
.agent-03 { background: #10B981; color: white; }
.agent-04 { background: #F59E0B; color: white; }
.agent-05 { background: #6366F1; color: white; }
.agent-06 { background: #14B8A6; color: white; }
.agent-07 { background: #F472B6; color: white; }
.agent-08 { background: #A855F7; color: white; }
.agent-09 { background: #EF4444; color: white; }

/* Activity feed */
.activity-feed {
    border: solid #D4AF37;
    background: #1A1A1D;
    padding: 1;
}

.activity-item {
    color: #E5E5E5;
}

.activity-time {
    color: #A3A3A3;
}

.activity-agent {
    color: #D4AF37;
    text-style: bold;
}

/* Panels */
.panel {
    border: solid #D4AF37;
    background: #1A1A1D;
    padding: 1;
    margin: 1;
}

.panel-title {
    text-style: bold;
    color: #D4AF37;
}

/* Daily report */
.daily-report {
    border: solid #D4AF37;
    background: #1A1A1D;
    padding: 1;
}

.report-section {
    color: #E5E5E5;
    padding: 1 0;
}

.report-heading {
    text-style: bold;
    color: #D4AF37;
}

/* Content pipeline */
.kanban-column {
    border: solid #737373;
    background: #1A1A1D;
    padding: 1;
    width: 1fr;
}

.kanban-column-header {
    text-style: bold;
    color: #D4AF37;
    content-align: center middle;
}

.kanban-card {
    border: solid #737373;
    background: #232326;
    padding: 1;
    margin: 1 0;
}

.kanban-card:hover {
    border: solid #D4AF37;
}

/* Priority badges */
.priority-p0 { color: #EF4444; text-style: bold; }
.priority-p1 { color: #F59E0B; text-style: bold; }
.priority-p2 { color: #3B82F6; text-style: bold; }
.priority-p3 { color: #A3A3A3; }

/* Status badges */
.status-pending { color: #F59E0B; }
.status-in_progress { color: #3B82F6; }
.status-review { color: #EC4899; }
.status-complete { color: #22C55E; }
.status-blocked { color: #EF4444; }

/* Data table */
DataTable {
    background: #1A1A1D;
    border: solid #D4AF37;
}

DataTable > .datatable--header {
    background: #232326;
    color: #D4AF37;
    text-style: bold;
}

DataTable > .datatable--cursor {
    background: #8B5CF6 30%;
}

DataTable > .datatable--hover {
    background: #D4AF37 20%;
}

/* Loading spinner */
LoadingIndicator {
    color: #D4AF37;
}

/* Input fields */
Input {
    border: solid #737373;
    background: #1A1A1D;
    color: #E5E5E5;
}

Input:focus {
    border: solid #D4AF37;
}

/* Buttons */
Button {
    border: solid #D4AF37;
    background: #232326;
    color: #E5E5E5;
}

Button:hover {
    background: #D4AF37;
    color: #0A0A0B;
    text-style: bold;
}

Button.-primary {
    background: #D4AF37;
    color: #0A0A0B;
    text-style: bold;
}

Button.-primary:hover {
    background: #B8972E;
}

/* Container */
.container {
    background: #0A0A0B;
    padding: 1;
}

/* Scrollbars */
Vertical {
    background: #1A1A1D;
}

Horizontal {
    background: #1A1A1D;
}

/* Help modal */
.help-modal {
    align: center middle;
    background: #0A0A0B 80%;
}

.help-content {
    border: solid #D4AF37;
    background: #1A1A1D;
    padding: 2;
    width: 80;
    height: 30;
}

.help-title {
    text-style: bold;
    color: #D4AF37;
    content-align: center middle;
}

.help-section {
    color: #E5E5E5;
    padding: 1 0;
}

.help-key {
    color: #D4AF37;
    text-style: bold;
}

/* Command palette */
.command-palette {
    align: center top;
    background: #0A0A0B 80%;
}

.command-input {
    border: solid #D4AF37;
    background: #1A1A1D;
    color: #E5E5E5;
    padding: 1;
    width: 60;
}

.command-results {
    border: solid #D4AF37;
    background: #1A1A1D;
    width: 60;
    max-height: 20;
}

.command-item {
    padding: 1;
    color: #E5E5E5;
}

.command-item:hover {
    background: #D4AF37 30%;
}

.command-item.-selected {
    background: #D4AF37;
    color: #0A0A0B;
    text-style: bold;
}
"""


def get_agent_by_id(agent_id: str) -> dict:
    """Get agent information by ID.

    Args:
        agent_id: Agent ID (e.g., "02")

    Returns:
        Agent dictionary or None if not found
    """
    for agent in AGENTS:
        if agent["id"] == agent_id:
            return agent
    return None


def get_priority_class(priority: str) -> str:
    """Get CSS class for priority badge.

    Args:
        priority: Priority string (P0, P1, P2, P3)

    Returns:
        CSS class name
    """
    priority_lower = priority.lower()
    if 'p0' in priority_lower:
        return 'priority-p0'
    elif 'p1' in priority_lower:
        return 'priority-p1'
    elif 'p2' in priority_lower:
        return 'priority-p2'
    else:
        return 'priority-p3'


def get_status_class(status: str) -> str:
    """Get CSS class for status badge.

    Args:
        status: Status string

    Returns:
        CSS class name
    """
    status_lower = status.lower().replace(' ', '_')
    return f'status-{status_lower}'
