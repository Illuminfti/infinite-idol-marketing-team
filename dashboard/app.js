/**
 * Infinite Idol - Agent Command Center
 * Apple-inspired UI/UX Application Logic
 *
 * @version 3.0.0
 * @description Complete redesign with Apple design principles
 */

// ============================================
// Data Models
// ============================================

const AGENTS = [
    { id: '00', name: 'Coordinator', role: 'Workflow Orchestration', color: '#8B5CF6', status: 'active' },
    { id: '01', name: 'Lore Architect', role: 'World Builder', color: '#EC4899', status: 'active' },
    { id: '02', name: 'Content Strategist', role: 'Marketing Lead', color: '#3B82F6', status: 'active' },
    { id: '03', name: 'Community Manager', role: 'Engagement Specialist', color: '#10B981', status: 'active' },
    { id: '04', name: 'Gacha Designer', role: 'Seasonal Content', color: '#F59E0B', status: 'active' },
    { id: '05', name: 'Analytics Observer', role: 'Performance Tracking', color: '#6366F1', status: 'active' },
    { id: '06', name: 'Asset Coordinator', role: 'Creative Assets', color: '#14B8A6', status: 'active' },
    { id: '07', name: 'Light Novel Writer', role: 'Narrative Specialist', color: '#F472B6', status: 'active' },
    { id: '08', name: 'Lore Guardian', role: 'Canon Validation', color: '#A855F7', status: 'active' },
    { id: '09', name: 'Resident Degen', role: 'Cultural Enforcer', color: '#EF4444', status: 'active' }
];

const INVIOLABLE_FACTS = [
    { num: 1, title: 'Devotion is quantifiable', desc: 'Love generates measurable energy that sustains idols' },
    { num: 2, title: 'Fading is permanent death', desc: 'Idols without Devotion cease to exist completely' },
    { num: 3, title: 'The Chase is voluntary', desc: 'Participation must be freely chosen, never coerced' },
    { num: 4, title: 'Memory anchors identity', desc: "Ika's lost memories are central to her existence" },
    { num: 5, title: "Senpai's face is NEVER shown", desc: 'Describe presence, reactions - never direct features' },
    { num: 6, title: 'Names have power', desc: 'True names carry weight in this world' },
    { num: 7, title: 'System predates management', desc: 'Someone designed the Devotion system - origins unknown' },
    { num: 8, title: 'Graduation is not what it seems', desc: 'There\'s more to "graduating" than the public knows' },
    { num: 9, title: 'Unity can defeat Fading', desc: 'Collective Devotion can save individuals' },
    { num: 10, title: 'Love transcends categories', desc: "Devotion isn't limited by type or source" }
];

const CHARACTERS = [
    { name: 'Ika Minami', file: 'ika-minami.md', icon: 'star' },
    { name: 'Sora', file: 'sora.md', icon: 'zap' },
    { name: 'Suiren', file: 'suiren.md', icon: 'droplet' },
    { name: 'Erina', file: 'erina.md', icon: 'crown' },
    { name: 'Runa', file: 'runa.md', icon: 'moon' }
];

const WORLD_DOCS = [
    { name: 'Core World', file: 'core-world.md' },
    { name: 'Timeline', file: 'timeline.md' },
    { name: 'The Foundation', file: 'factions/the-foundation.md' }
];

const MECHANICS = [
    { name: 'Devotion System', file: 'devotion-system.md' },
    { name: 'The Chase', file: 'the-chase.md' },
    { name: 'Fading', file: 'fading.md' },
    { name: 'Senpai Mystery', file: 'senpai-mystery.md' }
];

// Application State
const state = {
    currentView: 'dashboard',
    pendingReviews: [],
    activityLog: [],
    contentPipeline: {
        draft: [],
        review: [],
        scheduled: [],
        published: []
    },
    selectedAgent: null,
    notifications: []
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCommandBar();
    initKeyboardShortcuts();
    renderAgentGrid();
    renderAgentDetailCards();
    renderInviolableFacts();
    renderLoreLinks();
    loadRepoData();
    startActivitySimulation();
    updateDashboardStats();
});

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
        agents: 'Agents',
        content: 'Content Pipeline',
        reviews: 'Reviews',
        lore: 'Canon & Lore',
        logs: 'Activity Logs',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[viewId] || 'Dashboard';

    state.currentView = viewId;

    // Render view-specific content
    if (viewId === 'content') renderKanban();
    if (viewId === 'reviews') renderReviews();
    if (viewId === 'logs') renderLogs();
}

// ============================================
// Command Bar & Search
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

    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
}

function processCommand(command) {
    const cmd = command.toLowerCase().trim();
    if (!cmd) return;

    // Agent commands
    const agentMatch = cmd.match(/agent\s*(\d{2})/i);
    if (agentMatch) {
        const agentId = agentMatch[1];
        const agent = AGENTS.find(a => a.id === agentId);
        if (agent) {
            openAgentDrawer(agent);
            addActivityItem(agent, `Received command: "${command}"`);
            return;
        }
    }

    // Navigation commands
    const navMap = {
        'home': 'dashboard',
        'dashboard': 'dashboard',
        'agents': 'agents',
        'content': 'content',
        'pipeline': 'content',
        'reviews': 'reviews',
        'review': 'reviews',
        'lore': 'lore',
        'canon': 'lore',
        'logs': 'logs',
        'activity': 'logs',
        'settings': 'settings',
        'config': 'settings'
    };

    for (const [key, view] of Object.entries(navMap)) {
        if (cmd.includes(key)) {
            showView(view);
            addActivityItem(AGENTS[0], `Navigated to ${view}`);
            return;
        }
    }

    // Quick actions
    if (cmd.includes('tweet')) quickAction('tweet');
    else if (cmd.includes('thread')) quickAction('thread');
    else if (cmd.includes('banner')) quickAction('banner');
    else if (cmd.includes('report') || cmd.includes('analytics')) quickAction('report');
    else {
        showToast('Command not recognized', 'info');
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('command-input').focus();
        }

        // Escape to close overlays
        if (e.key === 'Escape') {
            closeModal();
            closeDrawer();
        }

        // Number keys for navigation (1-7)
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            const views = ['dashboard', 'agents', 'content', 'reviews', 'lore', 'logs', 'settings'];
            const num = parseInt(e.key);
            if (num >= 1 && num <= 7) {
                const target = document.activeElement.tagName;
                if (target !== 'INPUT' && target !== 'TEXTAREA') {
                    showView(views[num - 1]);
                }
            }
        }
    });
}

// ============================================
// Agent Grid (Dashboard)
// ============================================

function renderAgentGrid() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;

    grid.innerHTML = AGENTS.map(agent => `
        <div class="agent-chip" onclick="openAgentDrawer(AGENTS.find(a => a.id === '${agent.id}'))">
            <div class="agent-avatar" style="background: ${agent.color}">${agent.id}</div>
            <div class="agent-chip-info">
                <div class="agent-chip-name">${agent.name}</div>
                <div class="agent-chip-role">${agent.role}</div>
            </div>
            <div class="agent-status ${agent.status === 'idle' ? 'idle' : ''}"></div>
        </div>
    `).join('');
}

// ============================================
// Agent Detail Cards (Agents View)
// ============================================

function renderAgentDetailCards() {
    const container = document.getElementById('agents-container');
    if (!container) return;

    container.innerHTML = AGENTS.map(agent => `
        <div class="agent-detail-card">
            <div class="agent-detail-header">
                <div class="agent-detail-avatar" style="background: ${agent.color}">${agent.id}</div>
                <div class="agent-detail-info">
                    <h3>Agent ${agent.id} - ${agent.name}</h3>
                    <div class="agent-detail-role">${agent.role}</div>
                    <div class="agent-detail-status">
                        <span class="agent-status ${agent.status === 'idle' ? 'idle' : ''}"></span>
                        ${agent.status === 'active' ? 'Active' : 'Idle'}
                    </div>
                </div>
            </div>
            <div class="agent-detail-actions">
                <button class="btn btn-primary btn-sm" onclick="openAgentDrawer(AGENTS.find(a => a.id === '${agent.id}'))">
                    Chat
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewAgentFile('${agent.id}')">
                    View Persona
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// Agent Drawer
// ============================================

function openAgentDrawer(agent) {
    state.selectedAgent = agent;

    const drawer = document.getElementById('agent-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const avatar = document.getElementById('drawer-avatar');
    const name = document.getElementById('drawer-agent-name');
    const status = document.getElementById('drawer-status');
    const messages = document.getElementById('chat-messages');

    avatar.textContent = agent.id;
    avatar.style.background = agent.color;
    name.textContent = `Agent ${agent.id} - ${agent.name}`;
    status.textContent = agent.status === 'active' ? 'Active' : 'Idle';

    messages.innerHTML = `
        <div class="chat-message agent">
            Hello! I'm Agent ${agent.id}, the ${agent.name}. ${getAgentGreeting(agent.id)}
        </div>
    `;

    drawer.classList.add('active');
    overlay.classList.add('active');

    setTimeout(() => {
        document.getElementById('chat-input').focus();
    }, 300);
}

function closeDrawer() {
    document.getElementById('agent-drawer').classList.remove('active');
    document.getElementById('drawer-overlay').classList.remove('active');
    state.selectedAgent = null;
}

function getAgentGreeting(id) {
    const greetings = {
        '00': 'I coordinate all agent activities. How can I help orchestrate today?',
        '01': 'I guard the canon and build the world. Ask me about lore consistency.',
        '02': 'I craft our content strategy. Need tweets, threads, or campaigns?',
        '03': 'I manage community engagement. Tell me about events or sentiment.',
        '04': 'I design banners and seasonal content. Ready to make players pull?',
        '05': 'I track performance metrics. Want to see how content is performing?',
        '06': 'I coordinate visual and audio assets. Need prompts for Midjourney or Suno?',
        '07': 'I write the light novels. Want to discuss story arcs?',
        '08': 'I validate lore in real-time. Ask me to check any content for consistency.',
        '09': 'I enforce cultural authenticity. Is this based? Let me check.'
    };
    return greetings[id] || 'How can I assist you today?';
}

function sendAgentMessage() {
    if (!state.selectedAgent) return;

    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const messages = document.getElementById('chat-messages');

    // Add user message
    messages.innerHTML += `<div class="chat-message user">${escapeHtml(message)}</div>`;
    messages.scrollTop = messages.scrollHeight;

    // Simulate agent response
    setTimeout(() => {
        messages.innerHTML += `
            <div class="chat-message agent">
                ${generateAgentResponse(state.selectedAgent, message)}
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 600);

    input.value = '';
    addActivityItem(state.selectedAgent, `Received message: "${message.substring(0, 40)}..."`);
}

function generateAgentResponse(agent, message) {
    const responses = {
        '00': `I'll coordinate that request. Let me route it to the appropriate agents.`,
        '01': `Checking canon consistency... This aligns with our established lore.`,
        '02': `Great content idea! I'll draft this for the pipeline.`,
        '03': `I'll prepare the community event. The Seven Gates system can amplify this.`,
        '04': `Analyzing whale psychology for this... Optimal pricing calculated.`,
        '05': `Looking at the metrics... I'll compile a performance report.`,
        '06': `I'll generate the asset prompts. Maintaining dark luxury aesthetic.`,
        '07': `Fascinating direction! Let me weave this into the current volume.`,
        '08': `Canon check complete. All clear - no Inviolable Fact violations.`,
        '09': `Based check: This is actually fire. Certified degen approved.`
    };
    return responses[agent.id] || `Processing your request...`;
}

// Chat input enter key
document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAgentMessage();
    }
});

// ============================================
// Activity Feed
// ============================================

function addActivityItem(agent, text) {
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    state.activityLog.unshift({ agent, text, time, date: new Date() });

    // Keep only last 100 items
    if (state.activityLog.length > 100) {
        state.activityLog = state.activityLog.slice(0, 100);
    }

    renderActivityFeed();
    if (state.currentView === 'logs') renderLogs();
}

function renderActivityFeed() {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    const items = state.activityLog.slice(0, 8);

    feed.innerHTML = items.length === 0
        ? '<div class="empty-state"><p>No activity yet</p></div>'
        : items.map(item => `
            <div class="activity-item">
                <div class="activity-avatar" style="background: ${item.agent.color}">${item.agent.id}</div>
                <div class="activity-content">
                    <div class="activity-text">${escapeHtml(item.text)}</div>
                    <div class="activity-time">${item.time}</div>
                </div>
            </div>
        `).join('');
}

function renderLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;

    const agentFilter = document.getElementById('log-agent-filter')?.value || 'all';

    let logs = state.activityLog;
    if (agentFilter !== 'all') {
        logs = logs.filter(l => l.agent.id === agentFilter);
    }

    container.innerHTML = logs.length === 0
        ? '<div class="empty-state"><p>No logs to display</p></div>'
        : logs.slice(0, 50).map(log => `
            <div class="log-entry">
                <span class="log-time">${log.date.toLocaleDateString()} ${log.time}</span>
                <span class="log-agent" style="background: ${log.agent.color}">Agent ${log.agent.id}</span>
                <span class="log-message">${escapeHtml(log.text)}</span>
            </div>
        `).join('');
}

// Log filter change handler
document.getElementById('log-agent-filter')?.addEventListener('change', renderLogs);

// ============================================
// Activity Simulation
// ============================================

function startActivitySimulation() {
    const activities = [
        { agent: AGENTS[2], text: 'Drafted tweet: "47 fans. That\'s all I have. But every single one of you keeps me existing..."' },
        { agent: AGENTS[1], text: 'Verified canon compliance for new character backstory' },
        { agent: AGENTS[7], text: 'Completed Chapter 3 draft of Volume 2' },
        { agent: AGENTS[8], text: 'Lore check passed - no Inviolable Fact violations' },
        { agent: AGENTS[0], text: 'Scheduled content for 9 AM JST publication' },
        { agent: AGENTS[3], text: 'Prepared Seven Gates event for Discord' },
        { agent: AGENTS[5], text: 'Weekly engagement metrics compiled' },
        { agent: AGENTS[6], text: 'Generated Midjourney prompt for Ika banner art' },
        { agent: AGENTS[4], text: 'Designed "Eternal Chase" limited banner rates' },
        { agent: AGENTS[9], text: 'Reviewed content for cultural authenticity - certified based' }
    ];

    // Initial activities with stagger
    activities.slice(0, 4).forEach((a, i) => {
        setTimeout(() => addActivityItem(a.agent, a.text), i * 800);
    });

    // Periodic simulation
    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        addActivityItem(activity.agent, activity.text);
    }, 20000);
}

// ============================================
// Dashboard Stats
// ============================================

function updateDashboardStats() {
    const contentToday = Math.floor(Math.random() * 10 + 5);
    const agentsActive = AGENTS.filter(a => a.status === 'active').length;
    const pendingReview = state.pendingReviews.length;

    document.getElementById('stat-content-today').textContent = contentToday;
    document.getElementById('stat-agents-active').textContent = agentsActive;
    document.getElementById('stat-pending-review').textContent = pendingReview;

    // Pipeline counts
    document.getElementById('pipeline-draft').textContent = Math.floor(Math.random() * 5 + 2);
    document.getElementById('pipeline-review').textContent = Math.floor(Math.random() * 3);
    document.getElementById('pipeline-scheduled').textContent = Math.floor(Math.random() * 8 + 3);
    document.getElementById('pipeline-published').textContent = Math.floor(Math.random() * 20 + 10);

    // Update review badge
    const reviewBadge = document.getElementById('review-count');
    if (reviewBadge) {
        reviewBadge.textContent = pendingReview;
        reviewBadge.style.display = pendingReview > 0 ? 'inline' : 'none';
    }
}

// ============================================
// Kanban Board
// ============================================

function renderKanban() {
    const sampleContent = [
        { id: 1, type: 'Tweet', title: 'Ika voice: The Chase never ends', stage: 'draft', agent: '02' },
        { id: 2, type: 'Thread', title: 'Lore drop: The history of Fading', stage: 'review', agent: '01' },
        { id: 3, type: 'Tweet', title: 'Banner announcement teaser', stage: 'scheduled', agent: '02' },
        { id: 4, type: 'Article', title: 'Weekly Chase results', stage: 'published', agent: '05' },
        { id: 5, type: 'Tweet', title: 'New cosmetic preview', stage: 'draft', agent: '04' },
        { id: 6, type: 'Thread', title: 'Character spotlight: Sora', stage: 'scheduled', agent: '01' }
    ];

    ['draft', 'review', 'scheduled', 'published'].forEach(stage => {
        const cards = document.getElementById(`kanban-${stage}`);
        if (!cards) return;

        const items = sampleContent.filter(c => c.stage === stage);
        const column = cards.closest('.kanban-column');

        if (column) {
            column.querySelector('.kanban-count').textContent = items.length;
        }

        cards.innerHTML = items.map(item => {
            const agent = AGENTS.find(a => a.id === item.agent);
            return `
                <div class="kanban-card" onclick="openContentModal(${item.id})">
                    <div class="kanban-card-type">${item.type}</div>
                    <div class="kanban-card-title">${item.title}</div>
                    <div class="kanban-card-meta">
                        <span style="color: ${agent?.color || '#888'}">Agent ${agent?.id || '??'}</span>
                        <span>2h ago</span>
                    </div>
                </div>
            `;
        }).join('');
    });
}

// ============================================
// Reviews
// ============================================

function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    if (state.pendingReviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3>All caught up!</h3>
                <p>No items require your review at this time.</p>
            </div>
        `;
        document.getElementById('action-required').style.display = 'none';
        return;
    }

    container.innerHTML = state.pendingReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-priority ${review.priority}">${review.priority}</span>
                <span class="review-title">${review.title}</span>
            </div>
            <div class="review-body">
                <div class="review-content">${escapeHtml(review.content)}</div>
                <div class="review-actions">
                    <button class="btn btn-danger btn-sm" onclick="rejectReview('${review.id}')">Reject</button>
                    <button class="btn btn-success btn-sm" onclick="approveReview('${review.id}')">Approve</button>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('action-required').style.display = 'flex';
    document.getElementById('action-count').textContent = state.pendingReviews.length;
}

function approveReview(id) {
    state.pendingReviews = state.pendingReviews.filter(r => r.id !== id);
    addActivityItem(AGENTS[0], `Review item approved: ${id}`);
    renderReviews();
    updateDashboardStats();
    showToast('Review approved', 'success');
}

function rejectReview(id) {
    state.pendingReviews = state.pendingReviews.filter(r => r.id !== id);
    addActivityItem(AGENTS[0], `Review item rejected: ${id}`);
    renderReviews();
    updateDashboardStats();
    showToast('Review rejected', 'info');
}

// ============================================
// Inviolable Facts
// ============================================

function renderInviolableFacts() {
    const grid = document.getElementById('facts-grid');
    if (!grid) return;

    grid.innerHTML = INVIOLABLE_FACTS.map(fact => `
        <div class="fact-card">
            <div class="fact-number">${fact.num}</div>
            <div class="fact-content">
                <h4>${fact.title}</h4>
                <p>${fact.desc}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// Lore Links
// ============================================

function renderLoreLinks() {
    const characterLinks = document.getElementById('character-links');
    const worldLinks = document.getElementById('world-links');
    const mechanicsLinks = document.getElementById('mechanics-links');

    if (characterLinks) {
        characterLinks.innerHTML = CHARACTERS.map(c => `
            <div class="lore-link" onclick="openLoreFile('characters/${c.file}')">
                <span>&#128196;</span> ${c.name}
            </div>
        `).join('');
    }

    if (worldLinks) {
        worldLinks.innerHTML = WORLD_DOCS.map(d => `
            <div class="lore-link" onclick="openLoreFile('${d.file}')">
                <span>&#128196;</span> ${d.name}
            </div>
        `).join('');
    }

    if (mechanicsLinks) {
        mechanicsLinks.innerHTML = MECHANICS.map(m => `
            <div class="lore-link" onclick="openLoreFile('mechanics/${m.file}')">
                <span>&#128196;</span> ${m.name}
            </div>
        `).join('');
    }
}

function openLoreFile(path) {
    showModal('Lore File', `
        <p style="margin-bottom: 16px;"><strong>Path:</strong> knowledge-base/lore/${path}</p>
        <p style="color: var(--gray-400); margin-bottom: 16px;">In a full implementation, this would display the file contents.</p>
        <p style="margin-bottom: 8px;">To view this file, run:</p>
        <code style="display: block; padding: 16px; background: var(--surface-3); border-radius: var(--radius-lg); font-family: 'SF Mono', monospace; font-size: 13px; color: var(--gold-500);">
            cat knowledge-base/lore/${path}
        </code>
    `);
}

// ============================================
// Quick Actions
// ============================================

function quickAction(type) {
    const actions = {
        tweet: () => {
            showModal('Draft Tweet', `
                <p style="margin-bottom: 16px;">Agent 02 (Content Strategist) will draft a tweet.</p>
                <textarea style="width: 100%; height: 120px; background: var(--surface-3); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 16px; color: var(--gray-100); resize: none; font-size: 14px; font-family: inherit;" placeholder="Describe what the tweet should be about..."></textarea>
            `, `
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitQuickAction('tweet')">Send to Agent 02</button>
            `);
        },
        thread: () => {
            showModal('Create Thread', `
                <p style="margin-bottom: 16px;">Agent 02 will create a Twitter thread.</p>
                <textarea style="width: 100%; height: 120px; background: var(--surface-3); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 16px; color: var(--gray-100); resize: none; font-size: 14px; font-family: inherit;" placeholder="Describe the thread topic..."></textarea>
            `, `
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitQuickAction('thread')">Send to Agent 02</button>
            `);
        },
        lore: () => {
            openAgentDrawer(AGENTS[8]);
        },
        calendar: () => {
            showModal('Content Calendar', `
                <p style="margin-bottom: 16px;"><strong>File:</strong> outputs/calendar/master-calendar.md</p>
                <p style="margin-bottom: 8px;">Run this command to view the full calendar:</p>
                <code style="display: block; padding: 16px; background: var(--surface-3); border-radius: var(--radius-lg); font-family: 'SF Mono', monospace; font-size: 13px; color: var(--gold-500);">
                    cat outputs/calendar/master-calendar.md
                </code>
            `);
        },
        banner: () => {
            openAgentDrawer(AGENTS[4]);
        },
        report: () => {
            openAgentDrawer(AGENTS[5]);
        }
    };

    if (actions[type]) actions[type]();
}

function submitQuickAction(type) {
    addActivityItem(AGENTS[2], `Quick action submitted: ${type}`);
    closeModal();
    showToast(`Task sent to Agent 02!`, 'success');
}

// ============================================
// Modal
// ============================================

function showModal(title, bodyHtml, footerHtml = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = footerHtml || `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        warning: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
        info: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Data Loading
// ============================================

function loadRepoData() {
    console.log('Loading repository data...');

    setTimeout(() => {
        renderKanban();
        renderReviews();
        addActivityItem(AGENTS[0], 'Dashboard initialized - all systems operational');
    }, 100);
}

function viewAgentFile(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    const fileName = agent.name.toLowerCase().replace(/\s+/g, '-');
    showModal(`Agent ${agentId} Persona`, `
        <p style="margin-bottom: 16px;"><strong>File:</strong> agents/${agentId}-${fileName}.md</p>
        <p style="margin-bottom: 8px;">To view the full persona file, run:</p>
        <code style="display: block; padding: 16px; background: var(--surface-3); border-radius: var(--radius-lg); font-family: 'SF Mono', monospace; font-size: 13px; color: var(--gold-500);">
            cat agents/${agentId}-${fileName}.md
        </code>
    `);
}

function exportLogs() {
    const logText = state.activityLog.map(log =>
        `[${log.date.toLocaleDateString()} ${log.time}] Agent ${log.agent.id}: ${log.text}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-activity-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Activity log exported!', 'success');
}

// ============================================
// Utilities
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Refresh button handler
document.getElementById('refresh-btn')?.addEventListener('click', () => {
    loadRepoData();
    updateDashboardStats();
    showToast('Data refreshed!', 'success');
});

// ============================================
// Global Exports
// ============================================

window.showView = showView;
window.openAgentDrawer = openAgentDrawer;
window.closeDrawer = closeDrawer;
window.sendAgentMessage = sendAgentMessage;
window.openLoreFile = openLoreFile;
window.showModal = showModal;
window.closeModal = closeModal;
window.quickAction = quickAction;
window.submitQuickAction = submitQuickAction;
window.loadRepoData = loadRepoData;
window.viewAgentFile = viewAgentFile;
window.exportLogs = exportLogs;
window.approveReview = approveReview;
window.rejectReview = rejectReview;
window.showToast = showToast;
window.AGENTS = AGENTS;
