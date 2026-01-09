"""
SLA Monitor - Review and Task Time Tracking
Infinite Idol Marketing Team

Monitors review times, task durations, and escalates when SLAs are exceeded.
"""

import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Any
from event_bus import Event, EventType, get_event_bus


class SLAMonitor:
    """Monitors and enforces SLAs for reviews and tasks"""

    # SLA thresholds in hours
    SLA_CANON_REVIEW = 2.0  # Tier 1 canon reviews
    SLA_CULTURAL_REVIEW_T1 = 2.0  # Tier 1 cultural reviews
    SLA_CULTURAL_REVIEW_T2 = 1.0  # Tier 2 cultural reviews
    SLA_COORDINATOR_REVIEW = 0.5  # All coordinator reviews

    SLA_P0_TASK = 24.0  # P0 tasks must complete in 24 hours
    SLA_P1_TASK = 72.0  # P1 tasks must complete in 72 hours

    def __init__(self, db_path: str = "automation/task-queue.db"):
        self.db_path = db_path
        self.event_bus = get_event_bus(db_path)

    def check_review_slas(self) -> List[Dict[str, Any]]:
        """
        Find reviews exceeding SLA

        Returns:
            List of reviews that have exceeded SLA
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT r.id, r.task_id, r.review_type, r.reviewer_agent,
                   (julianday('now') - julianday(r.requested_at)) * 24 as hours_pending,
                   t.review_tier, t.task_code
            FROM reviews r
            JOIN tasks t ON r.task_id = t.id
            WHERE r.status = 'pending'
        """)

        exceeded = []

        for row in cursor.fetchall():
            review_data = dict(row)
            review_type = review_data['review_type']
            hours_pending = review_data['hours_pending']
            tier = review_data['review_tier']

            # Determine SLA threshold
            threshold = None

            if review_type == 'canon' and tier == 1:
                threshold = self.SLA_CANON_REVIEW
            elif review_type == 'cultural' and tier == 1:
                threshold = self.SLA_CULTURAL_REVIEW_T1
            elif review_type == 'cultural' and tier == 2:
                threshold = self.SLA_CULTURAL_REVIEW_T2
            elif review_type == 'coordinator':
                threshold = self.SLA_COORDINATOR_REVIEW

            if threshold and hours_pending > threshold:
                review_data['threshold'] = threshold
                review_data['hours_over'] = hours_pending - threshold
                exceeded.append(review_data)

                # Publish SLA exceeded event
                self.event_bus.publish(Event(
                    event_type=EventType.SLA_EXCEEDED,
                    payload={
                        'review_id': review_data['id'],
                        'task_id': review_data['task_id'],
                        'task_code': review_data['task_code'],
                        'review_type': review_type,
                        'reviewer_agent': review_data['reviewer_agent'],
                        'hours_pending': hours_pending,
                        'threshold': threshold,
                        'severity': 'review_sla'
                    },
                    source='sla_monitor'
                ))

        conn.close()
        return exceeded

    def check_task_slas(self) -> List[Dict[str, Any]]:
        """
        Find tasks exceeding completion SLA

        Returns:
            List of tasks that have exceeded SLA
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, task_code, priority, assigned_agent, assigned_agent_name,
                   (julianday('now') - julianday(created_at)) * 24 as hours_open
            FROM tasks
            WHERE status IN ('pending', 'in_progress', 'blocked')
        """)

        exceeded = []

        for row in cursor.fetchall():
            task_data = dict(row)
            priority = task_data['priority']
            hours_open = task_data['hours_open']

            threshold = None

            # Check priority-based SLAs
            if priority == 0 and hours_open > self.SLA_P0_TASK:
                threshold = self.SLA_P0_TASK
            elif priority == 1 and hours_open > self.SLA_P1_TASK:
                threshold = self.SLA_P1_TASK

            if threshold:
                task_data['threshold'] = threshold
                task_data['hours_over'] = hours_open - threshold
                exceeded.append(task_data)

                # Publish escalation event
                self.event_bus.publish(Event(
                    event_type=EventType.TASK_ESCALATED,
                    payload={
                        'task_id': task_data['id'],
                        'task_code': task_data['task_code'],
                        'priority': priority,
                        'hours_open': hours_open,
                        'threshold': threshold,
                        'reason': f"P{priority} task exceeds {threshold} hour SLA",
                        'severity': 'task_sla'
                    },
                    source='sla_monitor'
                ))

        conn.close()
        return exceeded

    def run_checks(self) -> Dict[str, Any]:
        """
        Run all SLA checks

        Returns:
            Summary of SLA violations
        """
        print("[SLAMonitor] Running SLA checks...")

        review_violations = self.check_review_slas()
        task_violations = self.check_task_slas()

        summary = {
            'timestamp': datetime.now().isoformat(),
            'review_violations': len(review_violations),
            'task_violations': len(task_violations),
            'reviews': review_violations,
            'tasks': task_violations
        }

        if review_violations or task_violations:
            print(f"[SLAMonitor] VIOLATIONS FOUND:")
            print(f"  Reviews: {len(review_violations)}")
            print(f"  Tasks: {len(task_violations)}")
        else:
            print(f"[SLAMonitor] All SLAs within threshold ✓")

        return summary

    def get_review_time_stats(self) -> Dict[str, Any]:
        """Get statistics on review completion times"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT review_type,
                   COUNT(*) as total_reviews,
                   AVG(review_time_minutes) as avg_time_minutes,
                   MIN(review_time_minutes) as min_time_minutes,
                   MAX(review_time_minutes) as max_time_minutes
            FROM reviews
            WHERE status IN ('approved', 'rejected') AND review_time_minutes IS NOT NULL
            GROUP BY review_type
        """)

        stats = {}
        for row in cursor.fetchall():
            review_type, total, avg_time, min_time, max_time = row
            stats[review_type] = {
                'total_reviews': total,
                'avg_time_minutes': round(avg_time, 1) if avg_time else None,
                'min_time_minutes': min_time,
                'max_time_minutes': max_time
            }

        conn.close()
        return stats


if __name__ == "__main__":
    print("Testing SLA Monitor...")

    monitor = SLAMonitor()

    print("\nRunning SLA checks:")
    summary = monitor.run_checks()

    print(f"\nSummary:")
    print(f"  Timestamp: {summary['timestamp']}")
    print(f"  Review violations: {summary['review_violations']}")
    print(f"  Task violations: {summary['task_violations']}")

    print("\nReview time statistics:")
    stats = monitor.get_review_time_stats()
    for review_type, data in stats.items():
        print(f"  {review_type}: avg {data['avg_time_minutes']}min, "
              f"range {data['min_time_minutes']}-{data['max_time_minutes']}min")

    print("\nSLA Monitor test complete!")
