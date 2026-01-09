#!/usr/bin/env python3
"""
Main Orchestration Engine
Infinite Idol Marketing Team

Central controller that coordinates all automation components.
"""

import sqlite3
import time
import signal
import sys
from typing import Dict, Any, Optional
from datetime import datetime
import threading

from event_bus import Event, EventType, get_event_bus
from webhook_processor import WebhookProcessor
from task_router import TaskRouter
from sla_monitor import SLAMonitor


class Orchestrator:
    """Main orchestration controller"""

    def __init__(self, db_path: str = "automation/task-queue.db"):
        self.db_path = db_path
        self.running = False

        print("[Orchestrator] Initializing...")

        # Initialize components
        self.event_bus = get_event_bus(db_path)
        self.webhook_processor = WebhookProcessor(db_path)
        self.task_router = TaskRouter(db_path)
        self.sla_monitor = SLAMonitor(db_path)

        # SLA monitoring thread
        self.sla_thread: Optional[threading.Thread] = None

        print("[Orchestrator] Initialized ✓")

    def start(self):
        """Start the orchestration engine"""
        if self.running:
            print("[Orchestrator] Already running")
            return

        self.running = True
        print("[Orchestrator] Starting orchestration engine...")

        # Start SLA monitoring in background thread
        self.start_sla_monitoring()

        print("[Orchestrator] Orchestration engine started ✓")
        print("[Orchestrator] Event bus active with handlers:")
        for event_type, handlers in self.event_bus.list_subscriptions().items():
            print(f"  {event_type}: {', '.join(handlers)}")

    def stop(self):
        """Stop the orchestration engine"""
        if not self.running:
            return

        print("\n[Orchestrator] Stopping orchestration engine...")
        self.running = False

        # Stop SLA monitoring thread
        if self.sla_thread and self.sla_thread.is_alive():
            self.sla_thread.join(timeout=2)

        print("[Orchestrator] Orchestration engine stopped")

    def start_sla_monitoring(self, interval_minutes: int = 15):
        """Start SLA monitoring in background thread"""

        def monitor_loop():
            print(f"[Orchestrator] SLA monitoring started (interval: {interval_minutes}min)")
            while self.running:
                try:
                    self.sla_monitor.run_checks()
                except Exception as e:
                    print(f"[Orchestrator] ERROR in SLA monitoring: {e}")

                # Sleep in small intervals to allow quick shutdown
                for _ in range(interval_minutes * 60):
                    if not self.running:
                        break
                    time.sleep(1)

        self.sla_thread = threading.Thread(target=monitor_loop, daemon=True)
        self.sla_thread.start()

    def create_task(
        self,
        title: str,
        task_type: str,
        content_type: Optional[str] = None,
        priority: int = 2,
        description: Optional[str] = None,
        review_tier: Optional[int] = None
    ) -> int:
        """
        Create a new task

        Args:
            title: Task title
            task_type: Type of task (content, review, asset, etc.)
            content_type: Specific content type (tweet, discord, etc.)
            priority: 0=P0, 1=P1, 2=P2, 3=P3
            description: Task description
            review_tier: Review tier (1=Novel, 2=Established, 3=Repeatable)

        Returns:
            Task ID
        """
        # Route to appropriate agent
        agent_number = self.task_router.assign_agent(task_type, content_type)

        # Get agent info
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT agent_name FROM agents WHERE agent_number = ?", (agent_number,))
        agent_name = cursor.fetchone()[0]

        # Generate task code
        cursor.execute("SELECT COUNT(*) FROM tasks")
        task_count = cursor.fetchone()[0]
        task_code = f"{task_type.upper()}-{task_count + 1:03d}"

        # Insert task
        cursor.execute("""
            INSERT INTO tasks (
                task_code, title, description, task_type, content_type,
                status, priority, assigned_agent, assigned_agent_name, review_tier
            ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        """, (
            task_code, title, description, task_type, content_type,
            priority, agent_number, agent_name, review_tier
        ))

        task_id = cursor.lastrowid
        conn.commit()
        conn.close()

        print(f"[Orchestrator] Created task {task_code} (ID: {task_id}) for Agent {agent_number:02d}")

        # Increment agent workload
        self.task_router.increment_agent_load(agent_number)

        # Publish task created event
        self.event_bus.publish(Event(
            event_type=EventType.TASK_CREATED,
            payload={
                'task_id': task_id,
                'task_code': task_code,
                'agent_number': agent_number,
                'priority': priority
            },
            source='orchestrator'
        ))

        return task_id

    def mark_task_started(self, task_id: int):
        """Mark task as in progress"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE tasks
            SET status = 'in_progress', started_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (task_id,))

        conn.commit()
        conn.close()

        self.event_bus.publish(Event(
            event_type=EventType.TASK_STARTED,
            payload={'task_id': task_id},
            source='orchestrator'
        ))

        print(f"[Orchestrator] Task {task_id} started")

    def mark_task_completed(self, task_id: int, output_file: Optional[str] = None):
        """Mark task as completed - triggers automated review creation"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE tasks
            SET status = 'complete', completed_at = CURRENT_TIMESTAMP,
                output_file_path = ?
            WHERE id = ?
        """, (output_file, task_id))

        # Decrement agent workload
        cursor.execute("SELECT assigned_agent FROM tasks WHERE id = ?", (task_id,))
        agent_number = cursor.fetchone()[0]

        conn.commit()
        conn.close()

        self.task_router.decrement_agent_load(agent_number)

        # Publish task completed event (webhook processor will handle reviews)
        self.event_bus.publish(Event(
            event_type=EventType.TASK_COMPLETED,
            payload={'task_id': task_id, 'output_file': output_file},
            source='orchestrator'
        ))

        print(f"[Orchestrator] Task {task_id} completed")

    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get summary for dashboard"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Task counts by status
        cursor.execute("""
            SELECT status, COUNT(*) FROM tasks GROUP BY status
        """)
        task_counts = dict(cursor.fetchall())

        # Review counts by status
        cursor.execute("""
            SELECT status, COUNT(*) FROM reviews GROUP BY status
        """)
        review_counts = dict(cursor.fetchall())

        # Agent workloads
        workloads = self.task_router.get_all_workloads()

        conn.close()

        return {
            'timestamp': datetime.now().isoformat(),
            'tasks': task_counts,
            'reviews': review_counts,
            'agent_workloads': workloads
        }

    def run_interactive(self):
        """Run orchestrator in interactive mode"""
        self.start()

        print("\n" + "="*60)
        print("INFINITE IDOL ORCHESTRATION ENGINE - INTERACTIVE MODE")
        print("="*60)
        print("\nCommands:")
        print("  status    - Show system status")
        print("  tasks     - List recent tasks")
        print("  events    - Show recent events")
        print("  sla       - Check SLA violations")
        print("  test      - Create test task")
        print("  quit      - Stop orchestrator")
        print("\n")

        try:
            while self.running:
                try:
                    cmd = input("orchestrator> ").strip().lower()

                    if cmd == 'quit' or cmd == 'exit':
                        break
                    elif cmd == 'status':
                        self.show_status()
                    elif cmd == 'tasks':
                        self.show_tasks()
                    elif cmd == 'events':
                        self.show_events()
                    elif cmd == 'sla':
                        self.check_sla()
                    elif cmd == 'test':
                        self.create_test_task()
                    elif cmd == '':
                        continue
                    else:
                        print(f"Unknown command: {cmd}")

                except KeyboardInterrupt:
                    print("\nUse 'quit' to exit")
                except EOFError:
                    break

        finally:
            self.stop()

    def show_status(self):
        """Show system status"""
        summary = self.get_dashboard_summary()
        print("\n=== SYSTEM STATUS ===")
        print(f"Timestamp: {summary['timestamp']}")
        print(f"\nTasks: {summary['tasks']}")
        print(f"Reviews: {summary['reviews']}")
        print(f"\nAgent Workloads:")
        for agent_num, wl in summary['agent_workloads'].items():
            print(f"  Agent {agent_num:02d}: {wl['active_tasks']} tasks, "
                  f"{wl['pending_reviews']} reviews "
                  f"({wl['availability_pct']:.0f}% available)")

    def show_tasks(self):
        """Show recent tasks"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT task_code, title, status, priority, assigned_agent_name
            FROM tasks
            ORDER BY created_at DESC
            LIMIT 10
        """)

        print("\n=== RECENT TASKS ===")
        for row in cursor.fetchall():
            print(f"  {row['task_code']}: {row['title']} - {row['status']} "
                  f"(P{row['priority']}, {row['assigned_agent_name']})")

        conn.close()

    def show_events(self):
        """Show recent events"""
        events = self.event_bus.get_events(limit=10)
        print("\n=== RECENT EVENTS ===")
        for event in events:
            print(f"  {event.timestamp.strftime('%H:%M:%S')} - {event.event_type} "
                  f"from {event.source}")

    def check_sla(self):
        """Check SLA violations"""
        summary = self.sla_monitor.run_checks()
        print(f"\n=== SLA CHECK ===")
        print(f"Review violations: {summary['review_violations']}")
        print(f"Task violations: {summary['task_violations']}")

        if summary['reviews']:
            print("\nReview SLA violations:")
            for review in summary['reviews']:
                print(f"  Task {review['task_code']}: {review['review_type']} review "
                      f"({review['hours_over']:.1f}h over threshold)")

        if summary['tasks']:
            print("\nTask SLA violations:")
            for task in summary['tasks']:
                print(f"  {task['task_code']}: {task['hours_over']:.1f}h over threshold")

    def create_test_task(self):
        """Create a test task"""
        task_id = self.create_task(
            title="Test Task - Automated Creation",
            task_type="content",
            content_type="tweet",
            priority=2,
            description="Test task created via orchestrator",
            review_tier=2
        )
        print(f"\nCreated test task ID: {task_id}")


def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n[Orchestrator] Shutting down...")
    sys.exit(0)


if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)

    # Create and run orchestrator
    orchestrator = Orchestrator()

    if len(sys.argv) > 1 and sys.argv[1] == 'daemon':
        # Run as daemon (scheduled checks only)
        orchestrator.start()
        print("[Orchestrator] Running in daemon mode (Ctrl+C to stop)")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            orchestrator.stop()
    else:
        # Run in interactive mode
        orchestrator.run_interactive()
