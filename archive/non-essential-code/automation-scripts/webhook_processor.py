"""
Webhook Processor - Automated Task Routing
Infinite Idol Marketing Team

Translates events into automated actions (create tasks, send notifications, update status).
"""

import sqlite3
import json
from typing import Dict, Any, Optional, List
from datetime import datetime
from event_bus import Event, EventBus, EventType, get_event_bus


class WebhookProcessor:
    """Processes events and triggers automated actions"""

    def __init__(self, db_path: str = "automation/task-queue.db"):
        self.db_path = db_path
        self.event_bus = get_event_bus(db_path)
        self.register_handlers()

    def register_handlers(self):
        """Subscribe to events that trigger webhooks"""
        print("[WebhookProcessor] Registering event handlers...")

        self.event_bus.subscribe(EventType.TASK_COMPLETED, self.on_task_completed)
        self.event_bus.subscribe(EventType.REVIEW_COMPLETED, self.on_review_completed)
        self.event_bus.subscribe(EventType.DEPENDENCY_RESOLVED, self.on_dependency_resolved)

        print("[WebhookProcessor] Handlers registered")

    def on_task_completed(self, event: Event):
        """Handle task completion - create review tasks if needed"""
        task_id = event.payload.get('task_id')
        if not task_id:
            print(f"[WebhookProcessor] ERROR: task.completed event missing task_id")
            return

        print(f"[WebhookProcessor] Processing task completion: {task_id}")

        # Get task details
        task = self.get_task(task_id)
        if not task:
            print(f"[WebhookProcessor] ERROR: Task {task_id} not found")
            return

        # If content task, create review tasks based on tier
        if task['task_type'] == 'content':
            self.create_review_tasks(task)

        # Check if this resolves dependencies
        self.check_and_resolve_dependencies(task_id)

    def on_review_completed(self, event: Event):
        """Handle review completion - check if all reviews done"""
        task_id = event.payload.get('task_id')
        review_type = event.payload.get('review_type')
        status = event.payload.get('status')

        print(f"[WebhookProcessor] Review {review_type} completed for task {task_id}: {status}")

        # Get all reviews for this task
        reviews = self.get_reviews_for_task(task_id)

        # Check if all pending reviews are complete
        pending = [r for r in reviews if r['status'] == 'pending']

        if not pending:
            print(f"[WebhookProcessor] All reviews complete for task {task_id}")

            # Check if coordinator review exists
            has_coordinator = any(r['review_type'] == 'coordinator' for r in reviews)

            if not has_coordinator:
                # Create coordinator review task
                print(f"[WebhookProcessor] Creating coordinator review for task {task_id}")
                self.create_review_task(task_id, 'coordinator', reviewer_agent=0)
            else:
                # All reviews including coordinator done - mark task complete
                print(f"[WebhookProcessor] All reviews approved, marking task complete")
                self.mark_task_complete(task_id)

    def on_dependency_resolved(self, event: Event):
        """Handle dependency resolution"""
        task_id = event.payload.get('task_id')
        print(f"[WebhookProcessor] Dependency resolved for task {task_id}")
        # Additional logic if needed

    def create_review_tasks(self, task: Dict[str, Any]):
        """Create appropriate review tasks based on content tier"""
        task_id = task['id']
        review_tier = task.get('review_tier')

        print(f"[WebhookProcessor] Creating review tasks for task {task_id}, tier {review_tier}")

        if review_tier == 1:
            # Tier 1: Full review (canon + cultural + coordinator)
            print(f"  Creating Tier 1 reviews (canon + cultural in parallel)")
            self.create_review_task(task_id, 'canon', reviewer_agent=8)
            self.create_review_task(task_id, 'cultural', reviewer_agent=9)

        elif review_tier == 2:
            # Tier 2: Streamlined (cultural + coordinator)
            print(f"  Creating Tier 2 reviews (cultural only, skipping canon)")
            self.create_review_task(task_id, 'cultural', reviewer_agent=9)

        elif review_tier == 3:
            # Tier 3: Coordinator spot-check only
            print(f"  Creating Tier 3 review (coordinator spot-check)")
            self.create_review_task(task_id, 'coordinator', reviewer_agent=0)

    def create_review_task(self, task_id: int, review_type: str, reviewer_agent: int):
        """Insert review record into database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO reviews (task_id, review_type, reviewer_agent, status, requested_at)
            VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP)
        """, (task_id, review_type, reviewer_agent))

        review_id = cursor.lastrowid
        conn.commit()
        conn.close()

        print(f"[WebhookProcessor] Created review {review_id}: {review_type} for task {task_id}")

        # Publish review requested event
        self.event_bus.publish(Event(
            event_type=EventType.REVIEW_REQUESTED,
            payload={
                'review_id': review_id,
                'task_id': task_id,
                'review_type': review_type,
                'reviewer_agent': reviewer_agent
            },
            source='webhook_processor'
        ))

    def check_and_resolve_dependencies(self, completed_task_id: int):
        """Find and unblock tasks that depend on completed task"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Find tasks blocked by this completed task
        cursor.execute("""
            SELECT task_id FROM task_dependencies
            WHERE depends_on_task_id = ? AND is_resolved = FALSE
        """, (completed_task_id,))

        blocked_tasks = cursor.fetchall()

        for (task_id,) in blocked_tasks:
            # Mark dependency resolved
            cursor.execute("""
                UPDATE task_dependencies
                SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP
                WHERE task_id = ? AND depends_on_task_id = ?
            """, (task_id, completed_task_id))

            # Check if task has any remaining unresolved dependencies
            cursor.execute("""
                SELECT COUNT(*) FROM task_dependencies
                WHERE task_id = ? AND is_resolved = FALSE
            """, (task_id,))

            remaining = cursor.fetchone()[0]

            if remaining == 0:
                # Unblock task
                cursor.execute("""
                    UPDATE tasks SET status = 'pending'
                    WHERE id = ? AND status = 'blocked'
                """, (task_id,))

                print(f"[WebhookProcessor] Unblocked task {task_id}")

                # Publish dependency resolved event
                self.event_bus.publish(Event(
                    event_type=EventType.DEPENDENCY_RESOLVED,
                    payload={'task_id': task_id},
                    source='webhook_processor'
                ))

        conn.commit()
        conn.close()

    def mark_task_complete(self, task_id: int):
        """Mark task as complete after all reviews pass"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE tasks
            SET status = 'complete', completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (task_id,))

        conn.commit()
        conn.close()

        print(f"[WebhookProcessor] Marked task {task_id} as complete")

    def get_task(self, task_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve task details from database"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM tasks WHERE id = ?
        """, (task_id,))

        row = cursor.fetchone()
        conn.close()

        if row:
            return dict(row)
        return None

    def get_reviews_for_task(self, task_id: int) -> List[Dict[str, Any]]:
        """Get all reviews for a task"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM reviews WHERE task_id = ?
        """, (task_id,))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]


if __name__ == "__main__":
    print("Testing Webhook Processor...")

    processor = WebhookProcessor()

    print("\nWebhook Processor initialized and ready!")
    print("  Subscriptions:", processor.event_bus.list_subscriptions())

    # Test event
    print("\nPublishing test task.completed event...")
    processor.event_bus.publish(Event(
        event_type=EventType.TASK_COMPLETED,
        payload={
            'task_id': 1,
            'output_file': 'test.md'
        },
        source='test_script'
    ))

    print("\nWebhook Processor test complete!")
