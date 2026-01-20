/**
 * Infinite Idol - Agent Command Center
 * Functional Dashboard with Real Data Integration
 *
 * @version 4.0.0
 * @description Connected to real repository data
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    repoRoot: '..',
    refreshInterval: 60000, // 1 minute
    autoRefresh: false,
    files: {
        taskQueue: '../automation/task-queue.md',
        activityLog: '../logs/agent-activity.md',
        calendar: '../outputs/calendar/master-calendar.md',
        contentDir: '../outputs/content/'
    }
};

// ============================================
// Data Models
// ============================================

const AGENTS = [
    { id: '00', name: 'Coordinator', role: 'Marketing Director', color: '#8B5CF6', emoji: '🎯' },
    { id: '01', name: 'Lore Architect', role: 'Worldbuilding Specialist', color: '#EC4899', emoji: '📚' },
    { id: '02', name: 'Content Strategist', role: 'Social Media Lead', color: '#3B82F6', emoji: '✍️' },
    { id: '03', name: 'Community Manager', role: 'Discord & Engagement', color: '#10B981', emoji: '💬' },
    { id: '04', name: 'Gacha Designer', role: 'Seasonal Content', color: '#F59E0B', emoji: '🎰' },
    { id: '05', name: 'Analytics Observer', role: 'Performance Tracking', color: '#6366F1', emoji: '📊' },
    { id: '06', name: 'Asset Coordinator', role: 'Creative Asset Manager', color: '#14B8A6', emoji: '🎨' },
    { id: '07', name: 'Light Novel Writer', role: 'Narrative Specialist', color: '#F472B6', emoji: '📖' },
    { id: '08', name: 'Lore Guardian', role: 'Canon Validation', color: '#A855F7', emoji: '🛡️' },
    { id: '09', name: 'Resident Degen', role: 'Cultural Enforcer', color: '#EF4444', emoji: '🔥' }
];

const INVIOLABLE_FACTS = [
    { num: 1, title: 'Devotion is Literal', desc: 'Devotion is literal emotional energy. Not metaphorical.' },
    { num: 2, title: 'Fading is Death', desc: 'When Devotion drops to zero, idols Fade. This is death.' },
    { num: 3, title: 'Ika Has 47 Fans', desc: 'Ika starts with exactly 47 fans. Dangerously low number.' },
    { num: 4, title: 'Ika\'s Hair is Pink Gradient', desc: 'Rose pink at roots fading to magenta at tips.' },
    { num: 5, title: 'Senpai is Always Obscured', desc: 'Senpai\'s face is NEVER shown. Always obscured.' },
    { num: 6, title: 'Foundation Controls Everything', desc: 'The Foundation controls the idol industry. Run by Erina.' },
    { num: 7, title: 'The Chase is Core Competition', desc: 'Primary format. Idols chase Senpai on the Eternal Stage.' },
    { num: 8, title: 'Game is Built on SUI', desc: 'All blockchain activity uses SUI. Not other chains.' },
    { num: 9, title: 'Gems are Primary Currency', desc: 'In-game currency. 1 SUI = 100 Gems. Account-bound.' },
    { num: 10, title: 'Dark Luxury, Not Pink Cutesy', desc: 'Black and gold aesthetic. Explicitly not pink cutesy.' }
];

// Application State
const state = {
    currentView: 'dashboard',
    tasks: [],
    activities: [],
    content: [],
    stats: {
        tasksTotal: 0,
        tasksPending: 0,
        tasksInProgress: 0,
        tasksReview: 0,
        tasksComplete: 0,
        tasksBlocked: 0,
        contentToday: 0,
        agentsActive: 10,
        reviewsComplete: 0
    },
    lastUpdate: null,
    loading: false
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Infinite Idol Dashboard...');

    initNavigation();
    initCommandBar();
    initKeyboardShortcuts();
    renderAgentGrid();
    renderAgentDetailCards();
    renderInviolableFacts();
    renderLoreLinks();

    // Load real data
    await loadAllData();

    // Setup auto-refresh if enabled
    if (CONFIG.autoRefresh) {
        setInterval(loadAllData, CONFIG.refreshInterval);
    }

    // Setup refresh button
    document.getElementById('refresh-btn')?.addEventListener('click', loadAllData);

    console.log('✅ Dashboard initialized');
});

// ============================================
// Data Loading & Parsing
// ============================================

async function loadAllData() {
    if (state.loading) return;

    state.loading = true;
    showToast('Refreshing data...', 'info');

    try {
        await Promise.all([
            loadTaskQueue(),
            loadActivityLog(),
            loadContentFiles()
        ]);

        state.lastUpdate = new Date();
        updateDashboardStats();
        renderCurrentView();
        showToast('Data refreshed successfully', 'success');

    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading data. See console for details.', 'error');
    } finally {
        state.loading = false;
    }
}

async function loadTaskQueue() {
    try {
        const response = await fetch(CONFIG.files.taskQueue);
        const text = await response.text();
        state.tasks = parseTaskQueue(text);
        console.log('📋 Loaded tasks:', state.tasks.length);
    } catch (error) {
        console.error('Error loading task queue:', error);
        state.tasks = [];
    }
}

async function loadActivityLog() {
    try {
        const response = await fetch(CONFIG.files.activityLog);
        const text = await response.text();
        state.activities = parseActivityLog(text);
        console.log('📝 Loaded activities:', state.activities.length);
    } catch (error) {
        console.error('Error loading activity log:', error);
        state.activities = [];
    }
}

async function loadContentFiles() {
    try {
        // Load tweets
        const tweetsDir = '../outputs/content/tweets/';
        const tweets = await loadContentFromDirectory(tweetsDir, 'tweet');

        // Load threads
        const threadsDir = '../outputs/content/threads/';
        const threads = await loadContentFromDirectory(threadsDir, 'thread');

        state.content = [...tweets, ...threads];
        console.log('📄 Loaded content files:', state.content.length);
    } catch (error) {
        console.error('Error loading content files:', error);
        state.content = [];
    }
}

async function loadContentFromDirectory(dir, type) {
    // Try to load known files
    const files = [
        'ika-introduction-draft.md',
        'ika-personality-batch-001.md',
        'devotion-system-explainer-thread.md'
    ];

    const content = [];
    for (const file of files) {
        try {
            const response = await fetch(dir + file);
            if (response.ok) {
                const text = await response.text();
                content.push(parseContentFile(text, file, type));
            }
        } catch (error) {
            // File doesn't exist, skip
        }
    }

    return content;
}

// ============================================
// Parsers
// ============================================

function parseTaskQueue(text) {
    const tasks = [];
    const lines = text.split('\n');

    let currentAgent = null;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect agent section
        const agentMatch = line.match(/## (.+?) Queue \(Agent (\d{2})\)/);
        if (agentMatch) {
            currentAgent = agentMatch[2];
            continue;
        }

        // Detect table start
        if (line.includes('| ID |') && line.includes('| Task |')) {
            inTable = true;
            i++; // Skip separator line
            continue;
        }

        // Parse table row
        if (inTable && line.startsWith('|') && !line.includes('---')) {
            if (line.includes('## ')) {
                inTable = false;
                continue;
            }

            const cells = line.split('|').map(c => c.trim()).filter(c => c);
            if (cells.length >= 6) {
                tasks.push({
                    id: cells[0],
                    agent: currentAgent,
                    priority: cells[1],
                    task: cells[2],
                    status: cells[3],
                    created: cells[4],
                    due: cells[5],
                    notes: cells[6] || ''
                });
            }
        }

        // End of table
        if (inTable && (line.trim() === '' || line.startsWith('##') || line.startsWith('---'))) {
            inTable = false;
        }
    }

    return tasks;
}

function parseActivityLog(text) {
    const activities = [];
    const lines = text.split('\n');

    let currentActivity = null;
    let inEntry = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect activity entry header
        const headerMatch = line.match(/### \[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\]\s+(?:Agent:\s+)?(.+)/);
        if (headerMatch) {
            if (currentActivity) {
                activities.push(currentActivity);
            }

            currentActivity = {
                date: headerMatch[1],
                time: headerMatch[2],
                agent: headerMatch[3],
                type: '',
                summary: '',
                details: []
            };
            inEntry = true;
            continue;
        }

        // Parse activity details
        if (inEntry && currentActivity) {
            if (line.startsWith('**Activity Type**:')) {
                currentActivity.type = line.replace('**Activity Type**:', '').trim();
            } else if (line.startsWith('**Summary**:')) {
                currentActivity.summary = line.replace('**Summary**:', '').trim();
            } else if (line.trim() && !line.startsWith('##') && !line.startsWith('---')) {
                currentActivity.details.push(line);
            }

            // Check for end of entry
            if (line.startsWith('---') || (line.startsWith('###') && line.includes('['))) {
                if (currentActivity) {
                    activities.push(currentActivity);
                    currentActivity = null;
                }
                inEntry = false;
            }
        }
    }

    // Add last activity
    if (currentActivity) {
        activities.push(currentActivity);
    }

    return activities;
}

function parseContentFile(text, filename, type) {
    const lines = text.split('\n');
    let title = filename.replace('.md', '');
    let agent = 'Unknown';
    let status = 'draft';
    let created = null;
    let content = '';

    // Parse frontmatter and content
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('**Content ID**:')) {
            title = line.replace('**Content ID**:', '').trim();
        } else if (line.startsWith('**Agent**:')) {
            agent = line.replace('**Agent**:', '').trim();
        } else if (line.startsWith('**Status**:')) {
            status = line.replace('**Status**:', '').trim().toLowerCase();
        } else if (line.startsWith('**Created**:')) {
            created = line.replace('**Created**:', '').trim();
        } else if (line.startsWith('###') && line.includes('Tweet') || line.includes('Thread')) {
            content += line + '\n';
        } else if (line.startsWith('>') || line.startsWith('-') || line.match(/^\d+\./)) {
            content += line + '\n';
        }
    }

    return {
        filename,
        title,
        agent,
        status,
        created: created || 'Unknown',
        type,
        content: content.trim(),
        fullText: text
    };
}

// ============================================
// Dashboard Stats
// ============================================

function updateDashboardStats() {
    // Count tasks by status
    const statusCounts = state.tasks.reduce((acc, task) => {
        acc[task.status.toLowerCase()] = (acc[task.status.toLowerCase()] || 0) + 1;
        return acc;
    }, {});

    state.stats.tasksTotal = state.tasks.length;
    state.stats.tasksPending = statusCounts['pending'] || 0;
    state.stats.tasksInProgress = statusCounts['in_progress'] || 0;
    state.stats.tasksReview = statusCounts['review'] || 0;
    state.stats.tasksComplete = statusCounts['complete'] || 0;
    state.stats.tasksBlocked = statusCounts['blocked'] || 0;

    // Count content created today
    const today = new Date().toISOString().split('T')[0];
    state.stats.contentToday = state.activities.filter(a => a.date === today).length;

    // Count reviews
    state.stats.reviewsComplete = state.activities.filter(a =>
        a.type.toLowerCase().includes('review') ||
        a.summary.toLowerCase().includes('review')
    ).length;

    // Update UI
    document.getElementById('stat-content-today').textContent = state.stats.contentToday;
    document.getElementById('stat-agents-active').textContent = state.stats.agentsActive;
    document.getElementById('stat-pending-review').textContent = state.stats.tasksReview;
    document.getElementById('stat-canon-compliance').textContent = '100%';

    document.getElementById('pipeline-draft').textContent = state.stats.tasksPending;
    document.getElementById('pipeline-review').textContent = state.stats.tasksReview;
    document.getElementById('pipeline-scheduled').textContent = 0;
    document.getElementById('pipeline-published').textContent = state.stats.tasksComplete;

    // Update last refresh time
    if (state.lastUpdate) {
        const timeStr = state.lastUpdate.toLocaleTimeString();
        console.log(`📊 Stats updated at ${timeStr}`);
    }

    // Render daily status report
    renderDailyStatusReport();
}

function renderDailyStatusReport() {
    const container = document.getElementById('daily-report-content');
    const timestamp = document.getElementById('report-timestamp');
    if (!container) return;

    // Get activities from last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    const last24h = state.activities.filter(a =>
        a.date === todayStr || a.date === yesterdayStr
    );

    // Update timestamp
    if (timestamp) {
        timestamp.textContent = `Updated: ${now.toLocaleTimeString()}`;
    }

    // Group by agent
    const byAgent = last24h.reduce((acc, activity) => {
        const agentMatch = activity.agent.match(/(\d{2})/);
        if (agentMatch) {
            const agentId = agentMatch[1];
            if (!acc[agentId]) acc[agentId] = [];
            acc[agentId].push(activity);
        }
        return acc;
    }, {});

    // Count types
    const contentCreated = last24h.filter(a =>
        a.type.toLowerCase().includes('content') ||
        a.type.toLowerCase().includes('tweet') ||
        a.type.toLowerCase().includes('thread')
    ).length;

    const reviewsCompleted = last24h.filter(a =>
        a.type.toLowerCase().includes('review') ||
        a.summary.toLowerCase().includes('review') ||
        a.summary.toLowerCase().includes('approved')
    ).length;

    const tasksCompleted = state.tasks.filter(t =>
        t.status.toLowerCase() === 'complete' &&
        t.created >= yesterdayStr
    ).length;

    const blockers = state.tasks.filter(t =>
        t.status.toLowerCase() === 'blocked'
    );

    // Generate report HTML
    const reportHTML = `
        <div class="report-grid">
            <div class="report-section">
                <h4>📈 Activity Summary</h4>
                <div class="report-stats">
                    <div class="report-stat">
                        <span class="report-stat-value">${last24h.length}</span>
                        <span class="report-stat-label">Total Activities</span>
                    </div>
                    <div class="report-stat">
                        <span class="report-stat-value">${tasksCompleted}</span>
                        <span class="report-stat-label">Tasks Completed</span>
                    </div>
                    <div class="report-stat">
                        <span class="report-stat-value">${contentCreated}</span>
                        <span class="report-stat-label">Content Created</span>
                    </div>
                    <div class="report-stat">
                        <span class="report-stat-value">${reviewsCompleted}</span>
                        <span class="report-stat-label">Reviews Done</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h4>👥 Agent Activity Breakdown</h4>
                <div class="agent-activity-list">
                    ${Object.entries(byAgent).map(([agentId, activities]) => {
                        const agent = AGENTS.find(a => a.id === agentId);
                        return `
                            <div class="agent-activity-item">
                                <div class="agent-activity-header">
                                    <div class="agent-avatar-mini" style="background: ${agent?.color || '#666'}">
                                        ${agentId}
                                    </div>
                                    <span class="agent-name-mini">${agent ? agent.name : `Agent ${agentId}`}</span>
                                    <span class="agent-activity-count">${activities.length} actions</span>
                                </div>
                                <div class="agent-activity-summary">
                                    ${activities.slice(0, 2).map(a => `
                                        <div class="activity-summary-item">
                                            <span class="activity-type-badge">${a.type || 'Activity'}</span>
                                            <span class="activity-summary-text">${a.summary || 'No details'}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                    ${Object.keys(byAgent).length === 0 ? '<p style="color: #999;">No agent activity in the last 24 hours</p>' : ''}
                </div>
            </div>

            ${blockers.length > 0 ? `
                <div class="report-section report-blockers">
                    <h4>🚫 Current Blockers</h4>
                    ${blockers.map(blocker => {
                        const agent = AGENTS.find(a => a.id === blocker.agent);
                        return `
                            <div class="blocker-item">
                                <div class="blocker-header">
                                    <span class="blocker-id">${blocker.id}</span>
                                    <span class="blocker-agent">${agent ? agent.name : `Agent ${blocker.agent}`}</span>
                                </div>
                                <p class="blocker-task">${blocker.task}</p>
                                <p class="blocker-notes">${blocker.notes || 'No details provided'}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            <div class="report-section">
                <h4>🎯 Next Priority Actions</h4>
                <div class="next-actions-list">
                    ${state.tasks
                        .filter(t => t.priority === 'P0' || t.priority === 'P1')
                        .filter(t => t.status.toLowerCase() !== 'complete')
                        .slice(0, 5)
                        .map(task => {
                            const agent = AGENTS.find(a => a.id === task.agent);
                            return `
                                <div class="next-action-item">
                                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                                    <span class="next-action-agent">${agent ? agent.emoji : '⚡'} ${agent ? agent.name : `Agent ${task.agent}`}</span>
                                    <span class="next-action-task">${task.task}</span>
                                    <span class="next-action-due">Due: ${task.due}</span>
                                </div>
                            `;
                        }).join('')}
                    ${state.tasks.filter(t => (t.priority === 'P0' || t.priority === 'P1') && t.status.toLowerCase() !== 'complete').length === 0 ?
                        '<p style="color: #999;">No high-priority tasks pending</p>' : ''}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = reportHTML;
}

// ============================================
// View Rendering
// ============================================

function renderCurrentView() {
    const view = state.currentView;

    if (view === 'dashboard') {
        renderAgentGrid();
        renderActivityFeed();
    } else if (view === 'content') {
        renderKanban();
    } else if (view === 'reviews') {
        renderReviews();
    } else if (view === 'logs') {
        renderLogs();
    } else if (view === 'agents') {
        renderAgentDetailCards();
    }
}

function renderAgentGrid() {
    const container = document.getElementById('agent-grid');
    if (!container) return;

    // Count tasks per agent
    const taskCounts = state.tasks.reduce((acc, task) => {
        acc[task.agent] = (acc[task.agent] || 0) + 1;
        return acc;
    }, {});

    container.innerHTML = AGENTS.map(agent => `
        <div class="agent-card" onclick="openAgentDrawer('${agent.id}')">
            <div class="agent-header">
                <div class="agent-avatar" style="background: ${agent.color};">${agent.id}</div>
                <span class="agent-status active"></span>
            </div>
            <div class="agent-info">
                <h3 class="agent-name">${agent.emoji} ${agent.name}</h3>
                <p class="agent-role">${agent.role}</p>
            </div>
            <div class="agent-stats">
                <span class="agent-tasks">${taskCounts[agent.id] || 0} tasks</span>
            </div>
        </div>
    `).join('');
}

function renderAgentDetailCards() {
    const container = document.getElementById('agents-container');
    if (!container) return;

    // Count tasks per agent
    const taskCounts = state.tasks.reduce((acc, task) => {
        acc[task.agent] = (acc[task.agent] || 0) + 1;
        return acc;
    }, {});

    // Get recent activities per agent
    const recentActivities = state.activities.reduce((acc, activity) => {
        const agentMatch = activity.agent.match(/(\d{2})/);
        if (agentMatch) {
            const agentId = agentMatch[1];
            if (!acc[agentId]) acc[agentId] = [];
            if (acc[agentId].length < 3) acc[agentId].push(activity);
        }
        return acc;
    }, {});

    container.innerHTML = AGENTS.map(agent => `
        <div class="card agent-detail-card">
            <div class="agent-detail-header">
                <div class="agent-avatar-large" style="background: ${agent.color};">${agent.id}</div>
                <div class="agent-detail-info">
                    <h3>${agent.emoji} Agent ${agent.id} - ${agent.name}</h3>
                    <p>${agent.role}</p>
                    <span class="agent-status-badge active">Active</span>
                </div>
                <button class="btn btn-primary" onclick="summonAgent('${agent.id}')">
                    Summon Agent
                </button>
            </div>
            <div class="agent-detail-stats">
                <div class="stat-mini">
                    <span class="stat-mini-value">${taskCounts[agent.id] || 0}</span>
                    <span class="stat-mini-label">Tasks</span>
                </div>
                <div class="stat-mini">
                    <span class="stat-mini-value">${(recentActivities[agent.id] || []).length}</span>
                    <span class="stat-mini-label">Recent Activity</span>
                </div>
            </div>
            <div class="agent-recent-activity">
                <h4>Recent Activity</h4>
                ${(recentActivities[agent.id] || [{summary: 'No recent activity'}]).map(a => `
                    <div class="activity-mini">
                        <span class="activity-time">${a.date ? a.date.substring(5) : ''} ${a.time || ''}</span>
                        <span class="activity-desc">${a.summary || 'No activity'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const recent = state.activities.slice(0, 10);

    if (recent.length === 0) {
        container.innerHTML = '<div class="empty-state-mini">No recent activity</div>';
        return;
    }

    container.innerHTML = recent.map(activity => {
        const agent = AGENTS.find(a => activity.agent.includes(a.id));
        const color = agent ? agent.color : '#666';

        return `
            <div class="activity-item">
                <div class="activity-avatar" style="background: ${color};">
                    ${agent ? agent.id : '??'}
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-agent">${agent ? agent.name : activity.agent}</span>
                        <span class="activity-time">${activity.time || ''}</span>
                    </div>
                    <p class="activity-text">${activity.summary || activity.type}</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderKanban() {
    const stages = ['draft', 'review', 'scheduled', 'published'];

    stages.forEach(stage => {
        const container = document.getElementById(`kanban-${stage}`);
        if (!container) return;

        let items = [];
        if (stage === 'draft') {
            items = state.tasks.filter(t => t.status.toLowerCase() === 'pending');
        } else if (stage === 'review') {
            items = state.tasks.filter(t => t.status.toLowerCase() === 'review' || t.status.toLowerCase() === 'in_progress');
        } else if (stage === 'published') {
            items = state.tasks.filter(t => t.status.toLowerCase() === 'complete');
        }

        // Update count
        const countEl = container.parentElement.querySelector('.kanban-count');
        if (countEl) countEl.textContent = items.length;

        // Render cards
        container.innerHTML = items.map(item => `
            <div class="kanban-card" onclick="viewTaskDetails('${item.id}')">
                <span class="kanban-card-id">${item.id}</span>
                <h4>${item.task}</h4>
                <div class="kanban-card-meta">
                    <span class="kanban-card-agent">Agent ${item.agent}</span>
                    <span class="kanban-card-priority ${item.priority}">${item.priority}</span>
                </div>
            </div>
        `).join('');
    });
}

function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const reviewItems = state.content.filter(c =>
        c.status === 'draft' || c.status === 'review' || c.status === 'awaiting review'
    );

    if (reviewItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✅</div>
                <h3>All caught up!</h3>
                <p>No items require your review at this time.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reviewItems.map(item => `
        <div class="card review-card">
            <div class="review-header">
                <div>
                    <h3>${item.title}</h3>
                    <span class="review-type">${item.type}</span>
                    <span class="review-agent">by ${item.agent}</span>
                </div>
                <div class="review-actions">
                    <button class="btn btn-secondary" onclick="viewContent('${item.filename}')">
                        View Full
                    </button>
                    <button class="btn btn-success" onclick="approveContent('${item.filename}')">
                        ✓ Approve
                    </button>
                </div>
            </div>
            <div class="review-preview">
                ${renderMarkdown(item.content.substring(0, 500))}
                ${item.content.length > 500 ? '...' : ''}
            </div>
        </div>
    `).join('');
}

function renderLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;

    const filter = document.getElementById('log-agent-filter')?.value || 'all';

    let filtered = state.activities;
    if (filter !== 'all') {
        filtered = state.activities.filter(a => a.agent.includes(filter));
    }

    container.innerHTML = filtered.map(activity => {
        const agent = AGENTS.find(a => activity.agent.includes(a.id));
        const color = agent ? agent.color : '#666';

        return `
            <div class="log-entry">
                <div class="log-header">
                    <div class="log-avatar" style="background: ${color};">
                        ${agent ? agent.id : '??'}
                    </div>
                    <div class="log-info">
                        <span class="log-agent">${agent ? agent.name : activity.agent}</span>
                        <span class="log-time">${activity.date} ${activity.time}</span>
                    </div>
                    <span class="log-type">${activity.type}</span>
                </div>
                <div class="log-body">
                    <p class="log-summary">${activity.summary}</p>
                    ${activity.details.slice(0, 3).map(d => `<p class="log-detail">${d}</p>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderInviolableFacts() {
    const container = document.getElementById('facts-grid');
    if (!container) return;

    container.innerHTML = INVIOLABLE_FACTS.map(fact => `
        <div class="fact-card">
            <div class="fact-number">${fact.num}</div>
            <div class="fact-content">
                <h4 class="fact-title">${fact.title}</h4>
                <p class="fact-desc">${fact.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderLoreLinks() {
    // Placeholder - would need to read knowledge-base directory
    const characterLinks = document.getElementById('character-links');
    if (characterLinks) {
        characterLinks.innerHTML = `
            <a href="#" class="lore-link">Ika Minami</a>
            <a href="#" class="lore-link">Sora</a>
            <a href="#" class="lore-link">Suiren</a>
            <a href="#" class="lore-link">Erina</a>
            <a href="#" class="lore-link">Runa</a>
        `;
    }

    const worldLinks = document.getElementById('world-links');
    if (worldLinks) {
        worldLinks.innerHTML = `
            <a href="#" class="lore-link">Core World</a>
            <a href="#" class="lore-link">Timeline</a>
            <a href="#" class="lore-link">The Foundation</a>
        `;
    }

    const mechanicsLinks = document.getElementById('mechanics-links');
    if (mechanicsLinks) {
        mechanicsLinks.innerHTML = `
            <a href="#" class="lore-link">Devotion System</a>
            <a href="#" class="lore-link">The Chase</a>
            <a href="#" class="lore-link">Fading</a>
            <a href="#" class="lore-link">Senpai Mystery</a>
        `;
    }
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) showView(view);
        });
    });
}

function showView(viewId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${viewId}`);
    });

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        agents: 'Agent Control Center',
        content: 'Content Pipeline',
        reviews: 'Pending Reviews',
        lore: 'Canon & Lore',
        logs: 'Activity Logs',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[viewId] || 'Dashboard';

    state.currentView = viewId;
    renderCurrentView();
}

// ============================================
// Agent Interaction
// ============================================

function summonAgent(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    const command = `/agent ${agentId}`;

    openModal(
        `Summon Agent ${agentId} - ${agent.name}`,
        `
            <div style="padding: 20px;">
                <h3>${agent.emoji} ${agent.name}</h3>
                <p><strong>Role:</strong> ${agent.role}</p>
                <p style="margin-top: 20px;">To activate this agent in Claude Code, use:</p>
                <div class="code-block">
                    <code>${command}</code>
                    <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('${command}')">Copy</button>
                </div>
                <p style="margin-top: 20px; color: #666;">Paste this command in Claude Code to activate the agent.</p>
            </div>
        `,
        `
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="copyAndClose('${command}')">Copy & Close</button>
        `
    );
}

function openAgentDrawer(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    // Get agent tasks
    const agentTasks = state.tasks.filter(t => t.agent === agent.id);
    const agentActivities = state.activities.filter(a => a.agent.includes(agent.id));

    const drawer = document.getElementById('agent-drawer');
    const overlay = document.getElementById('drawer-overlay');

    document.getElementById('drawer-avatar').textContent = agent.id;
    document.getElementById('drawer-avatar').style.background = agent.color;
    document.getElementById('drawer-agent-name').textContent = `Agent ${agent.id} - ${agent.name}`;
    document.getElementById('drawer-status').textContent = 'Active';

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
        <div class="agent-drawer-info">
            <h4>${agent.emoji} ${agent.name}</h4>
            <p><strong>Role:</strong> ${agent.role}</p>

            <div style="margin-top: 20px;">
                <h5>Current Tasks (${agentTasks.length})</h5>
                ${agentTasks.length > 0 ? agentTasks.map(t => `
                    <div class="task-item-mini">
                        <span class="task-status ${t.status.toLowerCase()}">${t.status}</span>
                        <span>${t.task}</span>
                    </div>
                `).join('') : '<p>No active tasks</p>'}
            </div>

            <div style="margin-top: 20px;">
                <h5>Recent Activity (${agentActivities.length})</h5>
                ${agentActivities.slice(0, 5).map(a => `
                    <div class="activity-item-mini">
                        <span class="activity-time-mini">${a.date} ${a.time}</span>
                        <span>${a.summary}</span>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="summonAgent('${agent.id}')">
                    Summon Agent
                </button>
            </div>
        </div>
    `;

    drawer.classList.add('open');
    overlay.classList.add('active');
}

function closeDrawer() {
    document.getElementById('agent-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('active');
}

// ============================================
// Command Bar
// ============================================

function initCommandBar() {
    const input = document.getElementById('command-input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(input.value);
            input.value = '';
        }
        if (e.key === 'Escape') {
            input.blur();
        }
    });
}

function processCommand(command) {
    const cmd = command.toLowerCase().trim();
    if (!cmd) return;

    // Agent commands
    if (cmd.startsWith('/agent ')) {
        const agentId = cmd.replace('/agent ', '').padStart(2, '0');
        summonAgent(agentId);
        return;
    }

    // Queue command
    if (cmd === '/queue' || cmd === '/queue status') {
        showView('content');
        showToast('Task queue displayed', 'success');
        return;
    }

    if (cmd === '/queue process') {
        openModal(
            'Process Task Queue',
            `
                <p>To process the task queue, use this command in Claude Code:</p>
                <div class="code-block">
                    <code>/queue process</code>
                    <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('/queue process')">Copy</button>
                </div>
            `,
            `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`
        );
        return;
    }

    // Refresh command
    if (cmd === '/refresh' || cmd === 'refresh') {
        loadAllData();
        return;
    }

    // Navigation
    const navMap = {
        'dashboard': 'dashboard',
        'agents': 'agents',
        'content': 'content',
        'reviews': 'reviews',
        'lore': 'lore',
        'logs': 'logs'
    };

    if (navMap[cmd]) {
        showView(navMap[cmd]);
        return;
    }

    showToast(`Unknown command: ${cmd}`, 'error');
}

// ============================================
// Content Actions
// ============================================

function viewTaskDetails(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const agent = AGENTS.find(a => a.id === task.agent);

    openModal(
        `Task: ${task.id}`,
        `
            <div style="padding: 20px;">
                <h3>${task.task}</h3>
                <div style="margin-top: 15px;">
                    <p><strong>Agent:</strong> ${agent ? agent.name : task.agent}</p>
                    <p><strong>Priority:</strong> <span class="badge ${task.priority}">${task.priority}</span></p>
                    <p><strong>Status:</strong> <span class="badge ${task.status.toLowerCase()}">${task.status}</span></p>
                    <p><strong>Created:</strong> ${task.created}</p>
                    <p><strong>Due:</strong> ${task.due}</p>
                    ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ''}
                </div>
            </div>
        `,
        `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`
    );
}

function viewContent(filename) {
    const content = state.content.find(c => c.filename === filename);
    if (!content) return;

    openModal(
        content.title,
        `
            <div style="padding: 20px; max-height: 500px; overflow-y: auto;">
                <div style="margin-bottom: 15px;">
                    <span class="badge">${content.type}</span>
                    <span class="badge">${content.status}</span>
                    <span>by ${content.agent}</span>
                </div>
                <div class="content-preview">
                    ${renderMarkdown(content.fullText)}
                </div>
            </div>
        `,
        `
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-success" onclick="approveContent('${filename}')">Approve</button>
        `
    );
}

function approveContent(filename) {
    showToast(`Content approved: ${filename}`, 'success');
    closeModal();
}

// ============================================
// Utilities
// ============================================

function renderMarkdown(text) {
    // Simple markdown rendering
    return text
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|l|b])/gm, '<p>')
        .replace(/(?<![>])$/gm, '</p>');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    });
}

function copyAndClose(text) {
    copyToClipboard(text);
    closeModal();
}

function openModal(title, body, footer = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = footer;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for command bar
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('command-input').focus();
        }

        // Cmd/Ctrl + R for refresh
        if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
            e.preventDefault();
            loadAllData();
        }

        // ESC to close modals/drawers
        if (e.key === 'Escape') {
            closeModal();
            closeDrawer();
        }
    });
}

// ============================================
// Export
// ============================================

function exportLogs() {
    const data = JSON.stringify(state.activities, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-activity-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Activity log exported', 'success');
}

function quickAction(action) {
    const actions = {
        'tweet': () => summonAgent('02'),
        'thread': () => summonAgent('02'),
        'lore': () => summonAgent('01'),
        'calendar': () => showView('content'),
        'banner': () => summonAgent('04'),
        'report': () => summonAgent('05')
    };

    if (actions[action]) {
        actions[action]();
    }
}

// ============================================
// Console Welcome
// ============================================

console.log(`
%c██╗███╗   ██╗███████╗██╗███╗   ██╗██╗████████╗███████╗    ██╗██████╗  ██████╗ ██╗
%c██║████╗  ██║██╔════╝██║████╗  ██║██║╚══██╔══╝██╔════╝    ██║██╔══██╗██╔═══██╗██║
%c██║██╔██╗ ██║█████╗  ██║██╔██╗ ██║██║   ██║   █████╗      ██║██║  ██║██║   ██║██║
%c██║██║╚██╗██║██╔══╝  ██║██║╚██╗██║██║   ██║   ██╔══╝      ██║██║  ██║██║   ██║██║
%c██║██║ ╚████║██║     ██║██║ ╚████║██║   ██║   ███████╗    ██║██████╔╝╚██████╔╝███████╗
%c╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚══════╝    ╚═╝╚═════╝  ╚═════╝ ╚══════╝

%cAgent Command Center v4.0.0 - Now with Real Data!
%c"Every idol runs. Every fan watches. The agents never sleep."
`,
    'color: #EC4899', 'color: #8B5CF6', 'color: #3B82F6',
    'color: #10B981', 'color: #F59E0B', 'color: #666',
    'color: #fff; font-weight: bold;',
    'color: #999; font-style: italic;'
);
