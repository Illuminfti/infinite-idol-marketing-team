"""
Event Bus - Inter-Agent Communication System
Infinite Idol Marketing Team

Handles event publishing, subscription, and routing for autonomous agent coordination.
"""

from typing import Callable, Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
import json
import sqlite3
from pathlib import Path


@dataclass
class Event:
    """Event object for inter-agent communication"""
    event_type: str
    payload: Dict[str, Any]
    source: str
    timestamp: datetime = field(default_factory=datetime.now)
    event_id: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert event to dictionary for serialization"""
        return {
            'event_type': self.event_type,
            'payload': self.payload,
            'source': self.source,
            'timestamp': self.timestamp.isoformat(),
            'event_id': self.event_id
        }

    def to_json(self) -> str:
        """Convert event to JSON string"""
        return json.dumps(self.to_dict())


class EventBus:
    """Central event bus for agent coordination"""

    def __init__(self, db_path: str = "automation/task-queue.db"):
        self.db_path = db_path
        self.subscribers: Dict[str, List[Callable]] = {}
        self.event_log: List[Event] = []
        self._ensure_event_log_table()

    def _ensure_event_log_table(self):
        """Create event_log table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS event_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                payload TEXT NOT NULL,
                source TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()

    def subscribe(self, event_type: str, handler: Callable[[Event], None]):
        """
        Register a handler for specific event type

        Args:
            event_type: Type of event to subscribe to
            handler: Function to call when event occurs
        """
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []

        self.subscribers[event_type].append(handler)
        print(f"[EventBus] Subscribed to {event_type}: {handler.__name__}")

    def publish(self, event: Event) -> int:
        """
        Publish event to all subscribers

        Args:
            event: Event to publish

        Returns:
            Event ID from database
        """
        # Store in memory
        self.event_log.append(event)

        # Store in database
        event_id = self._log_to_db(event)
        event.event_id = event_id

        print(f"[EventBus] Published {event.event_type} from {event.source}")

        # Route to subscribers
        if event.event_type in self.subscribers:
            for handler in self.subscribers[event.event_type]:
                try:
                    handler(event)
                except Exception as e:
                    print(f"[EventBus] ERROR in handler {handler.__name__}: {e}")
                    # Log error but continue processing other handlers

        return event_id

    def _log_to_db(self, event: Event) -> int:
        """Log event to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO event_log (event_type, payload, source, timestamp)
            VALUES (?, ?, ?, ?)
        """, (
            event.event_type,
            json.dumps(event.payload),
            event.source,
            event.timestamp
        ))

        event_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return event_id

    def get_events(
        self,
        event_type: Optional[str] = None,
        since: Optional[datetime] = None,
        source: Optional[str] = None,
        limit: int = 100
    ) -> List[Event]:
        """
        Query event log

        Args:
            event_type: Filter by event type
            since: Filter by timestamp
            source: Filter by source
            limit: Maximum number of events to return

        Returns:
            List of matching events
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        query = "SELECT id, event_type, payload, source, timestamp FROM event_log WHERE 1=1"
        params = []

        if event_type:
            query += " AND event_type = ?"
            params.append(event_type)

        if since:
            query += " AND timestamp >= ?"
            params.append(since)

        if source:
            query += " AND source = ?"
            params.append(source)

        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)

        cursor.execute(query, params)

        events = []
        for row in cursor.fetchall():
            event_id, event_type, payload_json, source, timestamp = row
            events.append(Event(
                event_type=event_type,
                payload=json.loads(payload_json),
                source=source,
                timestamp=datetime.fromisoformat(timestamp),
                event_id=event_id
            ))

        conn.close()
        return events

    def clear_memory_log(self):
        """Clear in-memory event log (database log persists)"""
        self.event_log = []

    def get_subscriber_count(self, event_type: str) -> int:
        """Get number of subscribers for event type"""
        return len(self.subscribers.get(event_type, []))

    def list_subscriptions(self) -> Dict[str, List[str]]:
        """List all subscriptions"""
        return {
            event_type: [handler.__name__ for handler in handlers]
            for event_type, handlers in self.subscribers.items()
        }


# Global event bus instance
_event_bus: Optional[EventBus] = None


def get_event_bus(db_path: str = "automation/task-queue.db") -> EventBus:
    """Get or create global event bus instance"""
    global _event_bus
    if _event_bus is None:
        _event_bus = EventBus(db_path)
    return _event_bus


# Event type constants
class EventType:
    """Standard event types"""
    TASK_CREATED = "task.created"
    TASK_STARTED = "task.started"
    TASK_COMPLETED = "task.completed"
    TASK_BLOCKED = "task.blocked"
    TASK_ESCALATED = "task.escalated"

    REVIEW_REQUESTED = "review.requested"
    REVIEW_COMPLETED = "review.completed"
    REVIEW_APPROVED = "review.approved"
    REVIEW_REJECTED = "review.rejected"

    DEPENDENCY_RESOLVED = "dependency.resolved"

    SLA_EXCEEDED = "sla.exceeded"

    CONTENT_SCHEDULED = "content.scheduled"
    CONTENT_PUBLISHED = "content.published"

    AGENT_ACTIVATED = "agent.activated"
    AGENT_SESSION_END = "agent.session_end"


if __name__ == "__main__":
    # Test the event bus
    print("Testing Event Bus...")

    bus = get_event_bus()

    # Define test handler
    def test_handler(event: Event):
        print(f"  Handler received: {event.event_type} with payload {event.payload}")

    # Subscribe to test event
    bus.subscribe("test.event", test_handler)

    # Publish test event
    event = Event(
        event_type="test.event",
        payload={"message": "Hello from Event Bus"},
        source="test_script"
    )

    event_id = bus.publish(event)
    print(f"  Event published with ID: {event_id}")

    # Query events
    recent = bus.get_events(event_type="test.event", limit=5)
    print(f"  Found {len(recent)} recent events")

    # List subscriptions
    subs = bus.list_subscriptions()
    print(f"  Active subscriptions: {subs}")

    print("Event Bus test complete!")
