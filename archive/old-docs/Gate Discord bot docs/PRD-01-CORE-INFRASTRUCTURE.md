# PRD-01: Core Infrastructure

**Depends on:** Nothing (start here)
**Enables:** All other PRDs

---

## Scope

This PRD covers the foundational systems that every other feature depends on:
- Discord bot setup and connection
- Database schema and operations
- Environment configuration
- Channel and role auto-setup
- Basic event handling

---

## 1. Technology Requirements

### 1.1 Runtime
- Node.js 18+
- npm or bun for package management

### 1.2 Dependencies
```json
{
  "discord.js": "^14.x",
  "better-sqlite3": "^9.x",
  "@anthropic-ai/sdk": "^0.x",
  "dotenv": "^16.x"
}
```

### 1.3 Discord Bot Setup
1. Create application at Discord Developer Portal
2. Create bot under application
3. Enable **all** Privileged Gateway Intents:
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT
   - PRESENCE INTENT
4. Generate invite URL with permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Add Reactions
   - Use Slash Commands
   - Manage Roles
   - Manage Channels

---

## 2. Environment Configuration

### 2.1 Required Variables
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
```

### 2.2 Optional Variables
```env
# Auto-setup behavior
AUTO_SETUP_ON_JOIN=true

# Manual channel IDs (if not using auto-setup)
GUILD_ID=
WAITING_ROOM_ID=
CHAMBER_1_ID=
CHAMBER_2_ID=
CHAMBER_3_ID=
CHAMBER_4_ID=
CHAMBER_5_ID=
CHAMBER_6_ID=
INNER_SANCTUM_ID=
OFFERINGS_CHANNEL_ID=
VOWS_CHANNEL_ID=

# Manual role IDs (if not using auto-setup)
LOST_SOUL_ROLE_ID=
GATE_1_ROLE_ID=
GATE_2_ROLE_ID=
GATE_3_ROLE_ID=
GATE_4_ROLE_ID=
GATE_5_ROLE_ID=
GATE_6_ROLE_ID=
GATE_7_ROLE_ID=
ASCENDED_ROLE_ID=
MOD_ROLE_ID=

# AI (required for Ika responses)
ANTHROPIC_API_KEY=your_key
IKA_AI_ENABLED=true

# Puzzle answers (keep secret)
GATE_2_ANSWERS=answer1,answer2,answer3
GATE_4_ANSWERS=answer1,answer2

# Testing
TEST_MODE=false
```

### 2.3 Config Loader (`src/config.js`)
```javascript
require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,

  // Channels
  waitingRoomId: process.env.WAITING_ROOM_ID,
  chamber1Id: process.env.CHAMBER_1_ID,
  // ... etc

  // Roles
  lostSoulRoleId: process.env.LOST_SOUL_ROLE_ID,
  gate1RoleId: process.env.GATE_1_ROLE_ID,
  // ... etc

  // AI
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  ika: {
    enabled: process.env.IKA_AI_ENABLED === 'true',
    passiveChance: parseFloat(process.env.IKA_PASSIVE_CHANCE || '0.35'),
  },

  // Puzzle answers
  gate2Answers: (process.env.GATE_2_ANSWERS || '').split(',').map(a => a.trim().toLowerCase()),
  gate4Answers: (process.env.GATE_4_ANSWERS || '').split(',').map(a => a.trim().toLowerCase()),

  // Testing
  testMode: process.env.TEST_MODE === 'true',
};
```

---

## 3. Database Schema

### 3.1 Core Tables

**users** - Main user tracking
```sql
CREATE TABLE users (
  discord_id TEXT PRIMARY KEY,
  username TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Gate timestamps (NULL = not completed)
  gate_1_at DATETIME,
  gate_2_at DATETIME,
  gate_2_answer TEXT,
  gate_3_at DATETIME,
  gate_3_url TEXT,
  gate_4_at DATETIME,
  gate_5_started_at DATETIME,
  gate_5_messages_sent INTEGER DEFAULT 0,
  gate_5_at DATETIME,
  gate_5_reason TEXT,
  gate_6_at DATETIME,
  gate_6_type TEXT,
  gate_6_content TEXT,
  gate_7_at DATETIME,
  gate_7_vow TEXT,

  -- Status
  ascended_at DATETIME,
  total_time_seconds INTEGER,
  last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Referral
  referred_by TEXT,
  invite_count INTEGER DEFAULT 0,
  invite_code TEXT UNIQUE,

  -- Attempt tracking
  gate_2_attempts INTEGER DEFAULT 0,
  gate_4_attempts INTEGER DEFAULT 0
);
```

**ika_memory** - Per-user relationship data
```sql
CREATE TABLE ika_memory (
  user_id TEXT PRIMARY KEY,
  username TEXT,

  -- Cached journey data
  why_they_came TEXT,
  their_vow TEXT,
  their_memory_answer TEXT,

  -- Relationship
  interaction_count INTEGER DEFAULT 0,
  last_interaction DATETIME,
  relationship_level TEXT DEFAULT 'new',
  intimacy_stage INTEGER DEFAULT 1,

  -- Memory
  remembered_facts TEXT DEFAULT '[]',
  inside_jokes TEXT DEFAULT '[]',
  nickname TEXT,

  -- Engagement
  daily_streak INTEGER DEFAULT 0,
  last_daily_checkin DATE,

  -- DM settings
  dms_enabled INTEGER DEFAULT 1,
  dm_failures INTEGER DEFAULT 0
);
```

**firsts** - First completions per gate
```sql
CREATE TABLE firsts (
  gate_number INTEGER PRIMARY KEY,
  discord_id TEXT,
  username TEXT,
  completed_at DATETIME
);
```

### 3.2 Gate-Specific Tables

**gate5_schedule** - Timed DM scheduling
```sql
CREATE TABLE gate5_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
  message_number INTEGER,
  scheduled_for DATETIME,
  sent INTEGER DEFAULT 0,
  sent_at DATETIME
);
```

**offerings** - Gate 6 submissions
```sql
CREATE TABLE offerings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
  username TEXT,
  type TEXT,
  content TEXT,
  message_id TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved INTEGER DEFAULT 0,
  approved_by TEXT,
  approved_at DATETIME
);
```

**vows** - Gate 7 submissions
```sql
CREATE TABLE vows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
  username TEXT,
  vow TEXT,
  message_id TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved INTEGER DEFAULT 0,
  approved_by TEXT,
  approved_at DATETIME
);
```

### 3.3 Required Indexes
```sql
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_ascended ON users(ascended_at) WHERE ascended_at IS NOT NULL;
CREATE INDEX idx_memory_user ON ika_memory(user_id);
CREATE INDEX idx_gate5_pending ON gate5_schedule(sent, scheduled_for);
```

### 3.4 Database Operations (`src/database.js`)

**Security: Column Allowlists**
```javascript
const ALLOWED_USER_COLUMNS = new Set([
  'username', 'gate_1_at', 'gate_2_at', 'gate_2_answer',
  // ... all valid columns
]);

function isValidColumn(column, allowlist) {
  return typeof column === 'string' && allowlist.has(column);
}
```

**Core Operations**
```javascript
const userOps = {
  getOrCreate(discordId, username) { /* ... */ },
  get(discordId) { /* ... */ },
  update(discordId, field, value) { /* with allowlist check */ },
  completeGate(discordId, gateNumber, extraData) { /* ... */ },
  hasCompletedGate(discordId, gateNumber) { /* ... */ },
  getCurrentGate(discordId) { /* returns highest + 1 */ },
  reset(discordId) { /* full reset */ },
};
```

---

## 4. Discord Client Setup

### 4.1 Entry Point (`src/index.js`)
```javascript
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

// Load commands
// Load events

client.login(config.token);
```

### 4.2 Event Handler Structure
```
src/events/
├── ready.js           # Bot startup
├── messageCreate.js   # Message handling (Gate 1, AI responses)
├── interactionCreate.js # Slash commands, buttons, modals
└── guildMemberAdd.js  # New member handling
```

### 4.3 Command Registration (`deploy-commands.js`)
```javascript
const { REST, Routes } = require('discord.js');
const config = require('./src/config');

const commands = [
  // Gate commands
  { name: 'memory', description: 'Gate 2: Remember what was lost' },
  { name: 'confess', description: 'Gate 3: Declare your devotion' },
  // ... etc
];

const rest = new REST().setToken(config.token);
await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
```

---

## 5. Auto-Setup System

### 5.1 Channel Creation
When bot joins a server (or `/setup` is run):

```javascript
const CHANNELS_TO_CREATE = [
  { name: 'waiting-room', topic: 'Say her name to begin' },
  { name: 'chamber-1', topic: 'The Memory awaits' },
  { name: 'chamber-2', topic: 'Confess your devotion' },
  { name: 'chamber-3', topic: 'Find where she lives' },
  { name: 'chamber-4', topic: 'Endure the absence' },
  { name: 'chamber-5', topic: 'Create your offering' },
  { name: 'chamber-6', topic: 'Speak your vow' },
  { name: 'inner-sanctum', topic: 'She is here' },
  { name: 'offerings', topic: 'Archive of devotion' },
  { name: 'vows', topic: 'Eternal promises' },
];
```

### 5.2 Role Creation
```javascript
const ROLES_TO_CREATE = [
  { name: 'Lost Soul', color: '#808080' },
  { name: 'Gate 1', color: '#FFB6C1' },
  { name: 'Gate 2', color: '#9B59B6' },
  { name: 'Gate 3', color: '#E74C3C' },
  { name: 'Gate 4', color: '#3498DB' },
  { name: 'Gate 5', color: '#1a1a2e' },
  { name: 'Gate 6', color: '#F1C40F' },
  { name: 'Gate 7', color: '#000000' },
  { name: 'Ascended', color: '#FFD700' },
  { name: 'Moderator', color: '#E91E63' },
];
```

### 5.3 Permission Overrides
Each chamber restricts access:
```javascript
// chamber-1: only Gate 1+ can see
await channel.permissionOverwrites.create(gate1Role, { ViewChannel: true });
await channel.permissionOverwrites.create(guild.roles.everyone, { ViewChannel: false });
```

---

## 6. Definition of Done

- [ ] Bot connects to Discord successfully
- [ ] Database initializes with all tables
- [ ] Environment variables load correctly
- [ ] Auto-setup creates channels and roles
- [ ] Basic event handlers respond (ready, messageCreate)
- [ ] Slash commands register with Discord
- [ ] User records create on first interaction

---

## 7. Files to Create

| File | Purpose |
|------|---------|
| `src/index.js` | Entry point |
| `src/config.js` | Environment loader |
| `src/database.js` | SQLite operations |
| `src/events/ready.js` | Startup handler |
| `src/events/messageCreate.js` | Message handler |
| `src/events/interactionCreate.js` | Interaction router |
| `src/commands/setup.js` | Server setup command |
| `deploy-commands.js` | Command registration |
| `.env.example` | Environment template |
| `package.json` | Dependencies |

---

*Once this PRD is complete, you can build PRD-02 (Gates) and PRD-03 (AI) in parallel.*
