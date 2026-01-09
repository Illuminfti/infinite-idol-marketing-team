"""Data loader for Infinite Idol TUI Dashboard.

Loads and parses markdown files from the repository.
"""

import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional


class DataLoader:
    """Handles loading and parsing of markdown files."""

    def __init__(self, base_path: Optional[Path] = None):
        """Initialize the data loader.

        Args:
            base_path: Base path of the repository. Defaults to dashboard parent directory.
        """
        if base_path is None:
            # Default to parent of dashboard directory
            base_path = Path(__file__).parent.parent.parent.parent
        self.base_path = Path(base_path)

        self.task_queue_path = self.base_path / "automation" / "task-queue.md"
        self.activity_log_path = self.base_path / "logs" / "agent-activity.md"
        self.content_tweets_path = self.base_path / "outputs" / "content" / "tweets"
        self.content_threads_path = self.base_path / "outputs" / "content" / "threads"

    def load_task_queue(self) -> List[Dict[str, Any]]:
        """Load and parse the task queue.

        Returns:
            List of task dictionaries with keys: id, agent, priority, task,
            status, created, due, notes
        """
        try:
            if not self.task_queue_path.exists():
                return []

            text = self.task_queue_path.read_text(encoding='utf-8')
            return self._parse_task_queue(text)
        except Exception as e:
            print(f"Error loading task queue: {e}")
            return []

    def load_activity_log(self) -> List[Dict[str, Any]]:
        """Load and parse the activity log.

        Returns:
            List of activity dictionaries with keys: date, time, agent, type, summary
        """
        try:
            if not self.activity_log_path.exists():
                return []

            text = self.activity_log_path.read_text(encoding='utf-8')
            return self._parse_activity_log(text)
        except Exception as e:
            print(f"Error loading activity log: {e}")
            return []

    def load_content_files(self) -> List[Dict[str, Any]]:
        """Load content files from tweets and threads directories.

        Returns:
            List of content dictionaries with keys: path, type, status, metadata
        """
        content = []

        # Load tweets
        if self.content_tweets_path.exists():
            for file_path in self.content_tweets_path.glob("*.md"):
                try:
                    text = file_path.read_text(encoding='utf-8')
                    parsed = self._parse_content_file(text)
                    parsed['path'] = str(file_path.relative_to(self.base_path))
                    parsed['type'] = 'tweet'
                    content.append(parsed)
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

        # Load threads
        if self.content_threads_path.exists():
            for file_path in self.content_threads_path.glob("*.md"):
                try:
                    text = file_path.read_text(encoding='utf-8')
                    parsed = self._parse_content_file(text)
                    parsed['path'] = str(file_path.relative_to(self.base_path))
                    parsed['type'] = 'thread'
                    content.append(parsed)
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

        return content

    def _parse_task_queue(self, text: str) -> List[Dict[str, Any]]:
        """Parse task queue markdown.

        Adapted from desktop_app.py parse_task_queue method.
        """
        tasks = []
        lines = text.split('\n')

        current_agent = None
        in_table = False

        for i, line in enumerate(lines):
            # Detect agent section
            agent_match = re.search(r'## .+? Queue \(Agent (\d{2})\)', line)
            if agent_match:
                current_agent = agent_match.group(1)
                continue

            # Detect table start
            if '| ID |' in line and '| Task |' in line:
                in_table = True
                continue

            # Skip separator
            if in_table and '---' in line:
                continue

            # Parse table row
            if in_table and line.startswith('|'):
                if '##' in line:
                    in_table = False
                    continue

                cells = [c.strip() for c in line.split('|') if c.strip()]
                if len(cells) >= 6:
                    tasks.append({
                        'id': cells[0],
                        'agent': current_agent,
                        'priority': cells[1],
                        'task': cells[2],
                        'status': cells[3],
                        'created': cells[4],
                        'due': cells[5],
                        'notes': cells[6] if len(cells) > 6 else ''
                    })

            # End of table
            if in_table and (line.strip() == '' or line.startswith('##') or line.startswith('---')):
                in_table = False

        return tasks

    def _parse_activity_log(self, text: str) -> List[Dict[str, Any]]:
        """Parse activity log markdown.

        Adapted from desktop_app.py parse_activity_log method.
        """
        activities = []
        lines = text.split('\n')

        current_activity = None

        for line in lines:
            # Detect activity header
            header_match = re.search(r'### \[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\]\s+(?:Agent:\s+)?(.+)', line)
            if header_match:
                if current_activity:
                    activities.append(current_activity)

                current_activity = {
                    'date': header_match.group(1),
                    'time': header_match.group(2),
                    'agent': header_match.group(3),
                    'type': '',
                    'summary': ''
                }
                continue

            # Parse activity details
            if current_activity:
                if line.startswith('**Activity Type**:'):
                    current_activity['type'] = line.replace('**Activity Type**:', '').strip()
                elif line.startswith('**Summary**:'):
                    current_activity['summary'] = line.replace('**Summary**:', '').strip()

        if current_activity:
            activities.append(current_activity)

        return activities

    def _parse_content_file(self, text: str) -> Dict[str, Any]:
        """Parse a content file (tweet or thread).

        Extracts metadata from frontmatter or markdown structure.
        """
        metadata = {
            'status': 'draft',
            'title': '',
            'agent': '',
            'priority': '',
            'id': ''
        }

        lines = text.split('\n')
        for line in lines:
            # Try to extract metadata from markdown
            if line.startswith('**Status**:'):
                metadata['status'] = line.replace('**Status**:', '').strip().lower()
            elif line.startswith('**Agent**:'):
                metadata['agent'] = line.replace('**Agent**:', '').strip()
            elif line.startswith('**Priority**:'):
                metadata['priority'] = line.replace('**Priority**:', '').strip()
            elif line.startswith('**ID**:'):
                metadata['id'] = line.replace('**ID**:', '').strip()
            elif line.startswith('# '):
                # Use first heading as title if not found
                if not metadata['title']:
                    metadata['title'] = line.replace('#', '').strip()

        return metadata

    def calculate_stats(self, tasks: List[Dict[str, Any]]) -> Dict[str, int]:
        """Calculate statistics from tasks.

        Args:
            tasks: List of task dictionaries

        Returns:
            Dictionary with stat counts
        """
        stats = {
            'tasks_total': len(tasks),
            'tasks_pending': 0,
            'tasks_in_progress': 0,
            'tasks_review': 0,
            'tasks_complete': 0,
            'tasks_blocked': 0,
        }

        for task in tasks:
            status = task.get('status', '').lower()
            if status == 'pending':
                stats['tasks_pending'] += 1
            elif status == 'in_progress':
                stats['tasks_in_progress'] += 1
            elif status == 'review':
                stats['tasks_review'] += 1
            elif status == 'complete':
                stats['tasks_complete'] += 1
            elif status == 'blocked':
                stats['tasks_blocked'] += 1

        return stats

    def get_recent_activities(self, activities: List[Dict[str, Any]], hours: int = 24) -> List[Dict[str, Any]]:
        """Filter activities to recent ones.

        Args:
            activities: List of all activities
            hours: Number of hours to look back

        Returns:
            Filtered list of recent activities
        """
        # For now, return the last N activities (simplified)
        # In a full implementation, would parse timestamps and filter by time
        return activities[-20:] if len(activities) > 20 else activities
