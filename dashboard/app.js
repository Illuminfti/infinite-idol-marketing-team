/**
 * Infinite Idol - Agent Command Center
 * Main Application JavaScript
 */

// ===========================================
// DATA MODELS
// ===========================================

const AGENTS = [
    { id: '00', name: 'Coordinator', role: 'Workflow Orchestration', color: '#8B5CF6', status: 'active' },
    { id: '01', name: 'Lore Architect', role: 'World Builder', color: '#EC4899', status: 'active' },
    { id: '02', name: 'Content Strategist', role: 'Marketing Lead', color: '#3B82F6', status: 'active' },
    { id: '03', name: 'Community Manager', role: 'Engagement Specialist', color: '#10B981', status: 'active' },
    { id: '04', name: 'Gacha Designer', role: 'Seasonal Content', color: '#F59E0B', status: 'idle' },
    { id: '05', name: 'Analytics Observer', role: 'Performance Tracking', color: '#6366F1', status: 'active' },
    { id: '06', name: 'Asset Coordinator', role: 'Creative Assets', color: '#14B8A6', status: 'idle' },
    { id: '07', name: 'Light Novel Writer', role: 'Narrative Specialist', color: '#F472B6', status: 'active' },
    { id: '08', name: 'Lore Guardian', role: 'Canon Validation', color: '#A855F7', status: 'active' }
];

const INVIOLABLE_FACTS = [
    { num: 1, title: 'Devotion is quantifiable', desc: 'Love generates measurable energy that sustains idols' },
    { num: 2, title: 'Fading is permanent death', desc: 'Idols without Devotion cease to exist completely - no resurrection' },
    { num: 3, title: 'The Chase is voluntary', desc: 'Participation must be freely chosen, never coerced' },
    { num: 4, title: 'Memory anchors identity', desc: "Ika's lost memories are central to her existence" },
    { num: 5, title: "Senpai's face is NEVER shown", desc: 'Describe presence, reactions - never direct facial features' },
    { num: 6, title: 'Names have power', desc: 'True names carry weight in this world' },
    { num: 7, title: 'The system predates current management', desc: 'Someone designed the Devotion system - origins mysterious' },
    { num: 8, title: 'Graduation is not what it seems', desc: 'There\'s more to "graduating" than the public knows' },
    { num: 9, title: 'Unity can defeat Fading', desc: 'Collective Devotion can save individuals' },
    { num: 10, title: 'Love transcends categories', desc: "Devotion isn't limited by type or source" }
];

const CHARACTERS = [
    { name: 'Ika Minami', file: 'ika-minami.md' },
    { name: 'Sora', file: 'sora.md' },
    { name: 'Suiren', file: 'suiren.md' },
    { name: 'Erina', file: 'erina.md' },
    { name: 'Runa', file: 'runa.md' }
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

// State
let state = {
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

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCommandBar();
    loadRepoData();
    renderAgentGrid();
    renderAgentCards();
    renderInviolableFacts();
    renderLoreLinks();
    startActivitySimulation();
    updateDashboardStats();
});

// ===========================================
// NAVIGATION
// ===========================================

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            showView(view);
        });
    });
}

function showView(viewId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${viewId}`);
    });

    state.currentView = viewId;
}

// ===========================================
// COMMAND BAR
// ===========================================

function initCommandBar() {
    const input = document.getElementById('command-input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(input.value);
            input.value = '';
        }
    });
}

function processCommand(command) {
    const cmd = command.toLowerCase();

    // Parse agent commands
    const agentMatch = cmd.match(/agent\s*(\d{2})/i);
    if (agentMatch) {
        const agentId = agentMatch[1];
        const agent = AGENTS.find(a => a.id === agentId);
        if (agent) {
            openAgentDrawer(agent);
            addActivityItem(agent, `Received command: "${command}"`);
        }
        return;
    }

    // Quick navigation
    if (cmd.includes('review')) showView('reviews');
    if (cmd.includes('content') || cmd.includes('pipeline')) showView('content');
    if (cmd.includes('agent')) showView('agents');
    if (cmd.includes('lore') || cmd.includes('canon')) showView('lore');
    if (cmd.includes('log')) showView('logs');

    // Add to activity
    addActivityItem(AGENTS[0], `Command executed: "${command}"`);
}

// ===========================================
// AGENT GRID (Dashboard)
// ===========================================

function renderAgentGrid() {
    const grid = document.getElementById('agent-grid');
    grid.innerHTML = AGENTS.map(agent => `
        <div class="agent-card" onclick="openAgentDrawer(AGENTS.find(a => a.id === '${agent.id}'))">
            <div class="agent-card-header">
                <div class="agent-avatar" style="background: ${agent.color}">${agent.id}</div>
                <div class="agent-info">
                    <div class="agent-name">${agent.name}</div>
                    <div class="agent-role">${agent.role}</div>
                </div>
                <div class="agent-status-dot ${agent.status === 'idle' ? 'idle' : ''}"></div>
            </div>
        </div>
    `).join('');
}

// ===========================================
// AGENT CARDS (Agents View)
// ===========================================

function renderAgentCards() {
    const container = document.getElementById('agents-container');
    container.innerHTML = AGENTS.map(agent => `
        <div class="agent-detail-card">
            <div class="agent-detail-header">
                <div class="agent-detail-avatar" style="background: ${agent.color}">${agent.id}</div>
                <div class="agent-detail-info">
                    <h3>Agent ${agent.id} - ${agent.name}</h3>
                    <div class="agent-detail-role">${agent.role}</div>
                    <div class="agent-detail-status">
                        <span class="agent-status-dot ${agent.status === 'idle' ? 'idle' : ''}"></span>
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

// ===========================================
// AGENT DRAWER
// ===========================================

function openAgentDrawer(agent) {
    state.selectedAgent = agent;
    document.getElementById('drawer-agent-name').textContent = `Agent ${agent.id} - ${agent.name}`;
    document.getElementById('agent-drawer').classList.add('active');

    // Show welcome message
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = `
        <div class="chat-message agent">
            Hello! I'm Agent ${agent.id}, the ${agent.name}. ${getAgentGreeting(agent.id)}
        </div>
    `;
}

function closeDrawer() {
    document.getElementById('agent-drawer').classList.remove('active');
    state.selectedAgent = null;
}

function getAgentGreeting(id) {
    const greetings = {
        '00': 'I coordinate all agent activities and ensure smooth operations. How can I help orchestrate today?',
        '01': 'I guard the canon and build the world. Ask me about lore, characters, or world consistency.',
        '02': 'I craft our content strategy. Need tweets, threads, or campaign ideas?',
        '03': 'I manage community engagement. Tell me about events or sentiment you want to address.',
        '04': 'I design banners and seasonal content. Ready to make players pull?',
        '05': 'I track performance metrics. Want to see how our content is performing?',
        '06': 'I coordinate visual and audio assets. Need Midjourney prompts or Suno directions?',
        '07': 'I write the light novels. Want to discuss story arcs or character development?',
        '08': 'I validate lore in real-time and expand canon. Ask me to check any content for consistency.'
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

    // Simulate agent response
    setTimeout(() => {
        messages.innerHTML += `
            <div class="chat-message agent">
                ${generateAgentResponse(state.selectedAgent, message)}
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 500);

    input.value = '';
    addActivityItem(state.selectedAgent, `Received message: "${message.substring(0, 50)}..."`);
}

function generateAgentResponse(agent, message) {
    const responses = {
        '00': `I'll coordinate that request. Let me route it to the appropriate agents and update the calendar.`,
        '01': `Checking canon consistency... This aligns with our established lore. The Devotion mechanics support this narrative.`,
        '02': `Great content idea! I'll draft this for the pipeline. Targeting 40% Ika voice as per our content pillars.`,
        '03': `I'll prepare the community event. The Seven Gates system can amplify engagement here.`,
        '04': `Analyzing whale psychology for this banner... Optimal pricing and rarity tiers calculated.`,
        '05': `Looking at the metrics... I'll compile a performance report with trend analysis.`,
        '06': `I'll generate the asset prompts. Maintaining dark luxury aesthetic with black and gold.`,
        '07': `Fascinating narrative direction! Let me weave this into the current volume while respecting the 10 Inviolable Facts.`,
        '08': `Canon check complete. All clear - no violations of the Inviolable Facts detected.`
    };
    return responses[agent.id] || `Processing your request...`;
}

// ===========================================
// INVIOLABLE FACTS
// ===========================================

function renderInviolableFacts() {
    const grid = document.getElementById('facts-grid');
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

// ===========================================
// LORE LINKS
// ===========================================

function renderLoreLinks() {
    document.getElementById('character-links').innerHTML = CHARACTERS.map(c => `
        <div class="lore-link" onclick="openLoreFile('characters/${c.file}')">
            <span>📄</span> ${c.name}
        </div>
    `).join('');

    document.getElementById('world-links').innerHTML = WORLD_DOCS.map(d => `
        <div class="lore-link" onclick="openLoreFile('${d.file}')">
            <span>📄</span> ${d.name}
        </div>
    `).join('');

    document.getElementById('mechanics-links').innerHTML = MECHANICS.map(m => `
        <div class="lore-link" onclick="openLoreFile('mechanics/${m.file}')">
            <span>📄</span> ${m.name}
        </div>
    `).join('');
}

function openLoreFile(path) {
    showModal('Lore File', `
        <p><strong>Path:</strong> knowledge-base/lore/${path}</p>
        <p class="text-muted">In a full implementation, this would display the file contents.</p>
        <p>To view this file, run:</p>
        <code style="display: block; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-md); margin-top: 10px;">
            cat knowledge-base/lore/${path}
        </code>
    `);
}

// ===========================================
// ACTIVITY FEED
// ===========================================

function addActivityItem(agent, text) {
    const time = new Date().toLocaleTimeString();
    state.activityLog.unshift({ agent, text, time });

    // Keep only last 100 items
    if (state.activityLog.length > 100) {
        state.activityLog = state.activityLog.slice(0, 100);
    }

    renderActivityFeed();
    renderLogs();
}

function renderActivityFeed() {
    const feed = document.getElementById('activity-feed');
    const items = state.activityLog.slice(0, 10);

    feed.innerHTML = items.map(item => `
        <div class="activity-item">
            <div class="activity-agent" style="background: ${item.agent.color}">${item.agent.id}</div>
            <div class="activity-content">
                <div class="activity-text">${escapeHtml(item.text)}</div>
                <div class="activity-time">${item.time}</div>
            </div>
        </div>
    `).join('');
}

function renderLogs() {
    const container = document.getElementById('logs-container');
    const agentFilter = document.getElementById('log-agent-filter').value;

    let logs = state.activityLog;
    if (agentFilter !== 'all') {
        logs = logs.filter(l => l.agent.id === agentFilter);
    }

    container.innerHTML = logs.slice(0, 50).map(log => `
        <div class="log-entry">
            <span class="log-time">${new Date().toLocaleDateString()} ${log.time}</span>
            <span class="log-agent" style="background: ${log.agent.color}">Agent ${log.agent.id}</span>
            <span class="log-message">${escapeHtml(log.text)}</span>
        </div>
    `).join('');
}

// Filter change handlers
document.getElementById('log-agent-filter')?.addEventListener('change', renderLogs);
document.getElementById('log-type-filter')?.addEventListener('change', renderLogs);

// ===========================================
// ACTIVITY SIMULATION
// ===========================================

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
        { agent: AGENTS[4], text: 'Designed "Eternal Chase" limited banner rates' }
    ];

    // Initial activities
    activities.slice(0, 5).forEach((a, i) => {
        setTimeout(() => addActivityItem(a.agent, a.text), i * 500);
    });

    // Periodic simulation
    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        addActivityItem(activity.agent, activity.text);
    }, 15000);
}

// ===========================================
// DASHBOARD STATS
// ===========================================

function updateDashboardStats() {
    document.getElementById('stat-content-today').textContent = Math.floor(Math.random() * 10 + 5);
    document.getElementById('stat-agents-active').textContent = AGENTS.filter(a => a.status === 'active').length;
    document.getElementById('stat-pending-review').textContent = state.pendingReviews.length;

    // Update pipeline counts
    document.getElementById('pipeline-draft').textContent = Math.floor(Math.random() * 5 + 2);
    document.getElementById('pipeline-review').textContent = Math.floor(Math.random() * 3);
    document.getElementById('pipeline-scheduled').textContent = Math.floor(Math.random() * 8 + 3);
    document.getElementById('pipeline-published').textContent = Math.floor(Math.random() * 20 + 10);
}

// ===========================================
// CONTENT PIPELINE (KANBAN)
// ===========================================

function renderKanban() {
    const sampleContent = [
        { id: 1, type: 'Tweet', title: 'Ika voice: The Chase never ends', stage: 'draft', agent: '02' },
        { id: 2, type: 'Thread', title: 'Lore drop: The history of Fading', stage: 'review', agent: '01' },
        { id: 3, type: 'Tweet', title: 'Banner announcement teaser', stage: 'scheduled', agent: '02' },
        { id: 4, type: 'Article', title: 'Weekly Chase results', stage: 'published', agent: '05' }
    ];

    ['draft', 'review', 'scheduled', 'published'].forEach(stage => {
        const cards = document.getElementById(`kanban-${stage}`);
        const items = sampleContent.filter(c => c.stage === stage);

        cards.innerHTML = items.map(item => {
            const agent = AGENTS.find(a => a.id === item.agent);
            return `
                <div class="kanban-card" onclick="openContentModal(${item.id})">
                    <div class="kanban-card-type">${item.type}</div>
                    <div class="kanban-card-title">${item.title}</div>
                    <div class="kanban-card-meta">
                        <span style="color: ${agent.color}">Agent ${agent.id}</span>
                        <span>2h ago</span>
                    </div>
                </div>
            `;
        }).join('');

        // Update count
        const column = cards.closest('.kanban-column');
        column.querySelector('.kanban-count').textContent = items.length;
    });
}

// Initialize kanban when switching to content view
document.querySelector('[data-view="content"]')?.addEventListener('click', renderKanban);

// ===========================================
// REVIEWS
// ===========================================

function renderReviews() {
    const container = document.getElementById('reviews-container');

    if (state.pendingReviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="no-reviews">
                <div class="empty-icon">✓</div>
                <h3>All caught up!</h3>
                <p>No items require your review at this time.</p>
            </div>
        `;
        document.getElementById('action-required').style.display = 'none';
        document.getElementById('review-count').textContent = '0';
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
    document.getElementById('review-count').textContent = state.pendingReviews.length;
}

function approveReview(id) {
    state.pendingReviews = state.pendingReviews.filter(r => r.id !== id);
    addActivityItem(AGENTS[0], `Review item approved: ${id}`);
    renderReviews();
    updateDashboardStats();
}

function rejectReview(id) {
    state.pendingReviews = state.pendingReviews.filter(r => r.id !== id);
    addActivityItem(AGENTS[0], `Review item rejected: ${id}`);
    renderReviews();
    updateDashboardStats();
}

// ===========================================
// MODALS
// ===========================================

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

// ===========================================
// QUICK ACTIONS
// ===========================================

function quickAction(type) {
    const actions = {
        tweet: () => {
            showModal('Draft Tweet', `
                <p>Agent 02 (Content Strategist) will draft a tweet.</p>
                <textarea style="width: 100%; height: 100px; background: var(--bg-tertiary); border: 1px solid var(--bg-elevated); border-radius: var(--radius-md); padding: 10px; color: var(--text-primary); resize: none;" placeholder="Describe what the tweet should be about..."></textarea>
            `, `
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitQuickAction('tweet')">Send to Agent 02</button>
            `);
        },
        thread: () => {
            showModal('Create Thread', `
                <p>Agent 02 will create a Twitter thread.</p>
                <textarea style="width: 100%; height: 100px; background: var(--bg-tertiary); border: 1px solid var(--bg-elevated); border-radius: var(--radius-md); padding: 10px; color: var(--text-primary); resize: none;" placeholder="Describe the thread topic..."></textarea>
            `, `
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitQuickAction('thread')">Send to Agent 02</button>
            `);
        },
        lore: () => {
            openAgentDrawer(AGENTS[8]); // Lore Guardian
            closeModal();
        },
        calendar: () => {
            showModal('Content Calendar', `
                <p>Viewing: <strong>outputs/calendar/master-calendar.md</strong></p>
                <p>Run this command to view the full calendar:</p>
                <code style="display: block; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-md); margin-top: 10px;">
                    cat outputs/calendar/master-calendar.md
                </code>
            `);
        },
        banner: () => {
            openAgentDrawer(AGENTS[4]); // Gacha Designer
            closeModal();
        },
        report: () => {
            openAgentDrawer(AGENTS[5]); // Analytics Observer
            closeModal();
        }
    };

    if (actions[type]) actions[type]();
}

function submitQuickAction(type) {
    addActivityItem(AGENTS[2], `Quick action submitted: ${type}`);
    closeModal();
    showNotification(`Task sent to Agent 02!`);
}

// ===========================================
// NOTIFICATIONS
// ===========================================

function showNotification(message) {
    // Simple alert for now - could be enhanced with toast notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gold);
        color: var(--bg-primary);
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===========================================
// DATA LOADING
// ===========================================

function loadRepoData() {
    // In a full implementation, this would fetch data from the repository
    // For now, we'll use sample data
    console.log('Loading repository data...');

    // Simulate loading
    setTimeout(() => {
        renderKanban();
        renderReviews();
        addActivityItem(AGENTS[0], 'Dashboard initialized - all systems nominal');
    }, 100);
}

function viewAgentFile(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    showModal(`Agent ${agentId} Persona`, `
        <p><strong>File:</strong> agents/${agentId}-${agent.name.toLowerCase().replace(' ', '-')}.md</p>
        <p>To view the full persona file, run:</p>
        <code style="display: block; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-md); margin-top: 10px;">
            cat agents/${agentId.padStart(2, '0')}-${agent.name.toLowerCase().replace(' ', '-')}.md
        </code>
    `);
}

function exportLogs() {
    const logText = state.activityLog.map(log =>
        `[${new Date().toLocaleDateString()} ${log.time}] Agent ${log.agent.id}: ${log.text}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-activity-log.txt';
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Activity log exported!');
}

// ===========================================
// UTILITIES
// ===========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K for command bar focus
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('command-input').focus();
    }

    // Escape to close drawers/modals
    if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
    }
});

// Refresh button
document.getElementById('refresh-btn')?.addEventListener('click', () => {
    loadRepoData();
    updateDashboardStats();
    showNotification('Data refreshed!');
});

// ===========================================
// EXPOSE GLOBAL FUNCTIONS
// ===========================================

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
window.AGENTS = AGENTS;
