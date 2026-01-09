"""
Task Router - Intelligent Agent Assignment
Infinite Idol Marketing Team

Automatically assigns tasks to appropriate agents based on task type and agent availability.
"""

import sqlite3
from typing import Optional, Dict, Any


class TaskRouter:
    """Routes tasks to appropriate agents"""

    def __init__(self, db_path: str = "automation/task-queue.db"):
        self.db_path = db_path

    def assign_agent(self, task_type: str, content_type: Optional[str] = None) -> int:
        """
        Determine which agent should handle task

        Args:
            task_type: Type of task (content, review, asset, etc.)
            content_type: Specific content type (tweet, discord, banner, etc.)

        Returns:
            Agent number (0-9)
        """
        # Content tasks route by content type
        if task_type == 'content':
            if content_type in ['tweet', 'thread']:
                return 2  # Agent 02 (Content Strategist)
            elif content_type in ['discord', 'event', 'community']:
                return 3  # Agent 03 (Community Manager)
            elif content_type in ['banner', 'gacha', 'seasonal']:
                return 4  # Agent 04 (Gacha Designer)
            elif content_type in ['novel', 'chapter', 'story']:
                return 7  # Agent 07 (Light Novel Writer)
            else:
                # Default to Content Strategist
                return 2

        # Asset tasks always go to Asset Coordinator
        elif task_type == 'asset':
            return 6  # Agent 06 (Asset Coordinator)

        # Research/lore tasks
        elif task_type == 'lore':
            return 1  # Agent 01 (Lore Architect)

        # Analytics tasks
        elif task_type == 'analytics':
            return 5  # Agent 05 (Analytics Observer)

        # Coordination tasks
        elif task_type == 'coordination':
            return 0  # Agent 00 (Coordinator)

        # Default: Escalate to coordinator
        return 0

    def check_agent_availability(self, agent_number: int) -> bool:
        """
        Check if agent has capacity for new task

        Args:
            agent_number: Agent to check (0-9)

        Returns:
            True if agent available, False if at capacity
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT current_active_tasks, max_concurrent_tasks
            FROM agents WHERE agent_number = ?
        """, (agent_number,))

        row = cursor.fetchone()
        conn.close()

        if not row:
            return False

        current, max_allowed = row
        return current < max_allowed

    def get_agent_workload(self, agent_number: int) -> Dict[str, Any]:
        """
        Get current workload for agent

        Args:
            agent_number: Agent to check (0-9)

        Returns:
            Dictionary with workload metrics
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Get active tasks
        cursor.execute("""
            SELECT COUNT(*) FROM tasks
            WHERE assigned_agent = ? AND status IN ('pending', 'in_progress')
        """, (agent_number,))

        active_tasks = cursor.fetchone()[0]

        # Get pending reviews
        cursor.execute("""
            SELECT COUNT(*) FROM reviews
            WHERE reviewer_agent = ? AND status = 'pending'
        """, (agent_number,))

        pending_reviews = cursor.fetchone()[0]

        # Get agent capacity
        cursor.execute("""
            SELECT current_active_tasks, max_concurrent_tasks
            FROM agents WHERE agent_number = ?
        """, (agent_number,))

        row = cursor.fetchone()
        current, max_allowed = row if row else (0, 3)

        conn.close()

        return {
            'agent_number': agent_number,
            'active_tasks': active_tasks,
            'pending_reviews': pending_reviews,
            'current_load': current,
            'max_capacity': max_allowed,
            'availability_pct': ((max_allowed - current) / max_allowed * 100) if max_allowed > 0 else 0
        }

    def get_all_workloads(self) -> Dict[int, Dict[str, Any]]:
        """Get workload for all agents"""
        return {i: self.get_agent_workload(i) for i in range(10)}

    def increment_agent_load(self, agent_number: int):
        """Increment agent's active task count"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE agents
            SET current_active_tasks = current_active_tasks + 1
            WHERE agent_number = ?
        """, (agent_number,))

        conn.commit()
        conn.close()

    def decrement_agent_load(self, agent_number: int):
        """Decrement agent's active task count"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE agents
            SET current_active_tasks = CASE
                WHEN current_active_tasks > 0 THEN current_active_tasks - 1
                ELSE 0
            END
            WHERE agent_number = ?
        """, (agent_number,))

        conn.commit()
        conn.close()


if __name__ == "__main__":
    print("Testing Task Router...")

    router = TaskRouter()

    # Test agent assignment
    print("\nTesting agent assignment:")
    test_cases = [
        ('content', 'tweet'),
        ('content', 'discord'),
        ('content', 'banner'),
        ('asset', None),
        ('lore', None),
    ]

    for task_type, content_type in test_cases:
        agent = router.assign_agent(task_type, content_type)
        print(f"  {task_type}/{content_type} → Agent {agent:02d}")

    # Test workload check
    print("\nAgent workloads:")
    workloads = router.get_all_workloads()
    for agent_num, workload in workloads.items():
        print(f"  Agent {agent_num:02d}: {workload['active_tasks']} tasks, "
              f"{workload['pending_reviews']} reviews, "
              f"{workload['availability_pct']:.0f}% available")

    print("\nTask Router test complete!")
