-- Infinite Idol Marketing Team - Task Queue Database Schema
-- Version: 1.0
-- Date: 2026-01-09
-- Purpose: Production-ready task management system

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Tasks table - Core task tracking
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_code TEXT UNIQUE NOT NULL,  -- e.g., "CONTENT-001", "LORE-002"
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL,  -- "content", "review", "asset", "coordination", "research"
    content_type TEXT,  -- "tweet", "thread", "discord", "banner", etc.
    status TEXT NOT NULL DEFAULT 'pending',  -- "pending", "in_progress", "blocked", "review", "complete", "cancelled"
    priority INTEGER NOT NULL DEFAULT 2,  -- 0=P0 (critical), 1=P1 (high), 2=P2 (normal), 3=P3 (low)

    -- Agent assignment
    assigned_agent INTEGER NOT NULL,  -- 0-9 for agents 00-09
    assigned_agent_name TEXT NOT NULL,

    -- Review tier (for content tasks)
    review_tier INTEGER,  -- 1=Novel, 2=Established, 3=Repeatable, NULL=N/A

    -- Timing
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    deadline TIMESTAMP,
    estimated_hours REAL,

    -- Content references
    output_file_path TEXT,  -- Path to created content file
    content_id TEXT,  -- e.g., "TWEET-001", "THREAD-002"

    -- Dependencies (stored as comma-separated task IDs for simplicity, or use junction table)
    blocked_by TEXT,  -- Comma-separated list of task_code values

    -- Metadata
    notes TEXT,
    created_by TEXT DEFAULT 'system',

    -- Indexes for common queries
    FOREIGN KEY (assigned_agent) REFERENCES agents(agent_number)
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_agent ON tasks(assigned_agent);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_content_id ON tasks(content_id);

-- ===========================================
-- AGENTS TABLE
-- ===========================================

CREATE TABLE agents (
    agent_number INTEGER PRIMARY KEY,  -- 0-9
    agent_name TEXT NOT NULL,
    agent_role TEXT NOT NULL,
    persona_file TEXT NOT NULL,

    -- Capacity tracking
    max_concurrent_tasks INTEGER DEFAULT 3,
    current_active_tasks INTEGER DEFAULT 0,

    -- Performance metrics
    total_tasks_completed INTEGER DEFAULT 0,
    total_tasks_cancelled INTEGER DEFAULT 0,
    avg_completion_time_hours REAL,
    approval_rate REAL,  -- Percentage of tasks approved first time

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_active TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert all 10 agents
INSERT INTO agents (agent_number, agent_name, agent_role, persona_file) VALUES
(0, 'Coordinator', 'Marketing Director', 'agents/00-coordinator.md'),
(1, 'Lore Architect', 'Worldbuilding Specialist', 'agents/01-lore-architect.md'),
(2, 'Content Strategist', 'Social Media Lead', 'agents/02-content-strategist.md'),
(3, 'Community Manager', 'Discord & Engagement', 'agents/03-community-manager.md'),
(4, 'Gacha Designer', 'Seasonal Content', 'agents/04-gacha-designer.md'),
(5, 'Analytics Observer', 'Performance Tracking', 'agents/05-analytics-observer.md'),
(6, 'Asset Coordinator', 'Creative Asset Manager', 'agents/06-asset-coordinator.md'),
(7, 'Light Novel Writer', 'Narrative', 'agents/07-light-novel-writer.md'),
(8, 'Lore Guardian', 'Canon Review', 'agents/08-lore-guardian.md'),
(9, 'Resident Degen', 'Cultural Enforcer', 'agents/09-resident-degen.md');

-- ===========================================
-- REVIEWS TABLE
-- ===========================================

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    review_type TEXT NOT NULL,  -- "canon", "cultural", "coordinator", "human"
    reviewer_agent INTEGER NOT NULL,

    status TEXT NOT NULL DEFAULT 'pending',  -- "pending", "approved", "rejected", "escalated"

    -- Review content
    review_notes TEXT,
    issues_found TEXT,  -- JSON array of issues
    ds_rating REAL,  -- Degeneracy Scale rating (0-4) if cultural review

    -- Timing
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    review_time_minutes INTEGER,

    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (reviewer_agent) REFERENCES agents(agent_number)
);

CREATE INDEX idx_reviews_task ON reviews(task_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_agent);

-- ===========================================
-- TASK DEPENDENCIES TABLE
-- ===========================================

CREATE TABLE task_dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,  -- Task that is blocked
    depends_on_task_id INTEGER NOT NULL,  -- Task that must complete first

    dependency_type TEXT DEFAULT 'blocks',  -- "blocks", "requires", "informs"
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id),

    UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_deps_task ON task_dependencies(task_id);
CREATE INDEX idx_deps_depends_on ON task_dependencies(depends_on_task_id);

-- ===========================================
-- TASK HISTORY / AUDIT LOG
-- ===========================================

CREATE TABLE task_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,

    -- Change tracking
    field_changed TEXT NOT NULL,  -- "status", "assigned_agent", "priority", etc.
    old_value TEXT,
    new_value TEXT,

    -- Who/when
    changed_by TEXT NOT NULL,  -- "agent_02", "human", "system"
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Context
    reason TEXT,

    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_history_task ON task_history(task_id);
CREATE INDEX idx_history_changed_at ON task_history(changed_at);

-- ===========================================
-- AGENT ACTIVITY LOG
-- ===========================================

CREATE TABLE agent_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_number INTEGER NOT NULL,

    activity_type TEXT NOT NULL,  -- "session_start", "session_end", "task_complete", "review_submit", etc.
    task_id INTEGER,  -- NULL if not task-specific

    description TEXT,
    files_modified TEXT,  -- JSON array of file paths

    -- Timing
    activity_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,  -- Group activities by session

    FOREIGN KEY (agent_number) REFERENCES agents(agent_number),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_activity_agent ON agent_activity(agent_number);
CREATE INDEX idx_activity_timestamp ON agent_activity(activity_timestamp);
CREATE INDEX idx_activity_session ON agent_activity(session_id);

-- ===========================================
-- CONTENT CALENDAR TABLE
-- ===========================================

CREATE TABLE calendar_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Content details
    content_id TEXT UNIQUE NOT NULL,  -- "TWEET-001", etc.
    task_id INTEGER,  -- Link to task that created this
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,  -- "tweet", "thread", "discord", etc.

    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    timezone TEXT DEFAULT 'JST',

    -- Status
    status TEXT DEFAULT 'scheduled',  -- "scheduled", "published", "cancelled"
    published_at TIMESTAMP,

    -- Content pillars
    pillar TEXT,  -- "ika_voice", "lore_drops", "founder_hype", "community"

    -- Platform
    platform TEXT NOT NULL,  -- "twitter", "discord", "blog", etc.
    platform_post_id TEXT,  -- ID from platform after posting

    -- Performance (populated after publishing)
    likes INTEGER,
    retweets INTEGER,
    comments INTEGER,
    impressions INTEGER,
    engagement_rate REAL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE INDEX idx_calendar_scheduled_date ON calendar_items(scheduled_date);
CREATE INDEX idx_calendar_content_type ON calendar_items(content_type);
CREATE INDEX idx_calendar_pillar ON calendar_items(pillar);
CREATE INDEX idx_calendar_status ON calendar_items(status);

-- ===========================================
-- WEBHOOKS / EVENT TRIGGERS TABLE
-- ===========================================

CREATE TABLE webhook_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Trigger configuration
    trigger_event TEXT NOT NULL,  -- "task_complete", "review_approved", "deadline_approaching", etc.
    condition_sql TEXT,  -- SQL WHERE clause for conditional triggers

    -- Action configuration
    action_type TEXT NOT NULL,  -- "create_task", "send_notification", "update_status", etc.
    action_config TEXT NOT NULL,  -- JSON configuration for action

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP,
    trigger_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT DEFAULT 'system'
);

-- ===========================================
-- EXAMPLE WEBHOOK TRIGGERS
-- ===========================================

-- Trigger Agent 08 canon review when Agent 02 completes content
INSERT INTO webhook_triggers (trigger_event, action_type, action_config) VALUES
('task_complete', 'create_review_task',
 '{"condition": "task_type == ''content'' AND review_tier IN (1,2)",
   "create": {"review_type": "canon", "reviewer_agent": 8}}');

-- Trigger Agent 09 cultural review when Agent 02 completes content (parallel with Agent 08)
INSERT INTO webhook_triggers (trigger_event, action_type, action_config) VALUES
('task_complete', 'create_review_task',
 '{"condition": "task_type == ''content'' AND review_tier IN (1,2)",
   "create": {"review_type": "cultural", "reviewer_agent": 9}}');

-- Trigger Agent 00 coordinator approval when BOTH reviews complete
INSERT INTO webhook_triggers (trigger_event, action_type, action_config) VALUES
('all_reviews_complete', 'create_review_task',
 '{"create": {"review_type": "coordinator", "reviewer_agent": 0}}');

-- Escalate if review time exceeds 4 hours
INSERT INTO webhook_triggers (trigger_event, action_type, action_config) VALUES
('review_sla_exceeded', 'create_notification',
 '{"threshold_hours": 4,
   "notify": ["agent_00", "human"],
   "message": "Review SLA exceeded - escalation required"}');

-- ===========================================
-- PERFORMANCE METRICS VIEW
-- ===========================================

CREATE VIEW agent_performance_summary AS
SELECT
    a.agent_number,
    a.agent_name,
    COUNT(CASE WHEN t.status = 'complete' THEN 1 END) as tasks_completed,
    COUNT(CASE WHEN t.status IN ('pending', 'in_progress') THEN 1 END) as tasks_active,
    COUNT(CASE WHEN t.status = 'blocked' THEN 1 END) as tasks_blocked,
    AVG(CASE WHEN t.status = 'complete'
        THEN (julianday(t.completed_at) - julianday(t.started_at)) * 24
        END) as avg_completion_hours,
    AVG(CASE WHEN r.status = 'approved' THEN 1.0
             WHEN r.status = 'rejected' THEN 0.0 END) * 100 as approval_rate_pct
FROM agents a
LEFT JOIN tasks t ON a.agent_number = t.assigned_agent
LEFT JOIN reviews r ON a.agent_number = r.reviewer_agent
GROUP BY a.agent_number, a.agent_name;

-- ===========================================
-- TASK QUEUE VIEW (PRIORITY SORTED)
-- ===========================================

CREATE VIEW task_queue_view AS
SELECT
    t.task_code,
    t.title,
    t.status,
    t.priority,
    CASE t.priority
        WHEN 0 THEN 'P0 (Critical)'
        WHEN 1 THEN 'P1 (High)'
        WHEN 2 THEN 'P2 (Normal)'
        WHEN 3 THEN 'P3 (Low)'
    END as priority_label,
    t.assigned_agent_name,
    t.deadline,
    t.review_tier,
    t.content_type,
    GROUP_CONCAT(td.depends_on_task_id) as blocked_by_tasks,
    julianday('now') - julianday(t.created_at) as days_open
FROM tasks t
LEFT JOIN task_dependencies td ON t.id = td.task_id AND td.is_resolved = FALSE
GROUP BY t.id
ORDER BY t.priority ASC, t.deadline ASC;

-- ===========================================
-- CALENDAR VIEW (UPCOMING WEEK)
-- ===========================================

CREATE VIEW calendar_upcoming_week AS
SELECT
    c.content_id,
    c.title,
    c.scheduled_date,
    c.scheduled_time,
    c.content_type,
    c.pillar,
    c.platform,
    c.status,
    t.task_code as source_task,
    t.assigned_agent_name as creator
FROM calendar_items c
LEFT JOIN tasks t ON c.task_id = t.id
WHERE c.scheduled_date BETWEEN DATE('now') AND DATE('now', '+7 days')
AND c.status = 'scheduled'
ORDER BY c.scheduled_date, c.scheduled_time;

-- ===========================================
-- FUNCTIONS / PROCEDURES (as SQL comments - implement in Python)
-- ===========================================

-- FUNCTION: auto_create_review_tasks(task_id)
-- When a content task completes:
-- 1. Check review_tier
-- 2. If tier 1 or 2: Create canon + cultural review tasks (parallel)
-- 3. If tier 3: Create coordinator review only
-- 4. Link reviews to original task

-- FUNCTION: check_dependencies_resolved(task_id)
-- When a task completes:
-- 1. Find all tasks that depend on this task
-- 2. Mark dependencies as resolved
-- 3. If task has no remaining unresolved dependencies, change status from BLOCKED to PENDING
-- 4. Trigger notification to assigned agent

-- FUNCTION: calculate_agent_workload(agent_number)
-- Return current workload for capacity planning:
-- - Active tasks
-- - Pending reviews
-- - Estimated hours remaining
-- - Availability status

-- FUNCTION: auto_escalate_overdue(hours_threshold)
-- Find tasks/reviews exceeding SLA:
-- - Reviews pending > 4 hours → notify Agent 00
-- - P0 tasks pending > 24 hours → notify human
-- - P1 tasks pending > 72 hours → notify Agent 00

-- ===========================================
-- MIGRATION FROM MARKDOWN
-- ===========================================

-- To populate database from existing task-queue.md:
-- 1. Parse markdown file
-- 2. Extract task data (code, title, status, agent, priority)
-- 3. INSERT into tasks table
-- 4. Parse dependencies from "Blocked by" notes
-- 5. INSERT into task_dependencies table
-- 6. Run integrity checks

-- Example Python pseudocode:
-- def migrate_from_markdown(md_file):
--     tasks = parse_markdown_tasks(md_file)
--     for task in tasks:
--         db.execute("INSERT INTO tasks (...) VALUES (...)")
--         if task.dependencies:
--             for dep in task.dependencies:
--                 db.execute("INSERT INTO task_dependencies (...)")
--     db.commit()

-- ===========================================
-- MAINTENANCE QUERIES
-- ===========================================

-- Get all blocked tasks and why
-- SELECT t.task_code, t.title, td.depends_on_task_id, dt.status
-- FROM tasks t
-- JOIN task_dependencies td ON t.id = td.task_id
-- JOIN tasks dt ON td.depends_on_task_id = dt.id
-- WHERE t.status = 'blocked' AND td.is_resolved = FALSE;

-- Get agent workload
-- SELECT assigned_agent_name, status, COUNT(*) as task_count
-- FROM tasks
-- WHERE status IN ('pending', 'in_progress', 'blocked')
-- GROUP BY assigned_agent_name, status;

-- Get review bottlenecks
-- SELECT reviewer_agent, review_type, COUNT(*) as pending_count,
--        AVG((julianday('now') - julianday(requested_at)) * 24) as avg_wait_hours
-- FROM reviews
-- WHERE status = 'pending'
-- GROUP BY reviewer_agent, review_type
-- HAVING avg_wait_hours > 2
-- ORDER BY avg_wait_hours DESC;

-- Get content calendar coverage
-- SELECT DATE(scheduled_date) as date,
--        COUNT(*) as pieces_scheduled,
--        GROUP_CONCAT(content_type) as types
-- FROM calendar_items
-- WHERE scheduled_date BETWEEN DATE('now') AND DATE('now', '+14 days')
-- GROUP BY DATE(scheduled_date)
-- ORDER BY date;

-- ===========================================
-- PERFORMANCE OPTIMIZATION
-- ===========================================

-- Enable Write-Ahead Logging for better concurrency
PRAGMA journal_mode=WAL;

-- Set cache size (10MB)
PRAGMA cache_size=-10000;

-- Enable foreign keys
PRAGMA foreign_keys=ON;

-- ===========================================
-- END OF SCHEMA
-- ===========================================

-- Version: 1.0
-- Last Updated: 2026-01-09
-- Compatible with: SQLite 3.31+
-- Required Python libraries: sqlite3 (built-in)
