# PRD-07: Administration & Testing Systems

## Document Info
- **Scope**: Admin commands, setup automation, testing panel, debug tools
- **Depends On**: PRD-01 (Infrastructure), PRD-02 (Gates), PRD-03 (Ika AI)
- **Priority**: P1 (Required for deployment and maintenance)

---

## 1. Server Setup System

One-click server setup that creates all channels, roles, and permissions automatically.

### 1.1 Setup Command (`/setup`)

```
/setup run       - Run full automatic setup
/setup status    - Check if setup is complete
/setup invite    - Get bot invite URL with permissions
/setup gateway   - Post gateway message to channel
/setup chamber   - Post gate chamber entry message
```

**Permission**: Administrator only (`PermissionFlagsBits.Administrator`)

### 1.2 Auto-Created Roles

The setup creates 10 roles in order (bottom to top for hierarchy):

| Key | Name | Color | Hoist | Purpose |
|-----|------|-------|-------|---------|
| `lostSoul` | ♱ Lost Soul | #808080 (Gray) | No | New members |
| `gate1` | ♰ Gate I | #4a0000 | No | Gate 1 complete |
| `gate2` | ♰ Gate II | #5c0000 | No | Gate 2 complete |
| `gate3` | ♰ Gate III | #6e0000 | No | Gate 3 complete |
| `gate4` | ♰ Gate IV | #800000 | No | Gate 4 complete |
| `gate5` | ♰ Gate V | #920000 | No | Gate 5 complete |
| `gate6` | ♰ Gate VI | #a40000 | No | Gate 6 complete |
| `gate7` | ♰ Gate VII | #b60000 | No | Gate 7 complete |
| `ascended` | ✧ Ascended ✧ | #ff69b4 (Pink) | Yes | All gates done |
| `mod` | ♱ Keeper | #9932cc (Orchid) | Yes | Moderators |

### 1.3 Auto-Created Channels

Creates category `♰ THE SEVEN GATES ♰` with channels:

| Key | Name | Access | Purpose |
|-----|------|--------|---------|
| `waitingRoom` | ✧･waiting-room | Everyone | Starting point |
| `chamber1` | ♰･chamber-i | Gate 1+ | Gate 1 rituals |
| `chamber2` | ♰･chamber-ii | Gate 2+ | Gate 2 rituals |
| `chamber3` | ♰･chamber-iii | Gate 3+ | Gate 3 rituals |
| `chamber4` | ♰･chamber-iv | Gate 4+ | Gate 4 rituals |
| `chamber5` | ♰･chamber-v | Gate 5+ | Gate 5 rituals |
| `chamber6` | ♰･chamber-vi | Gate 6+ | Gate 6 rituals |
| `innerSanctum` | ♡･inner-sanctum | Ascended | Post-ascension |
| `offerings` | ♱･offerings-archive | Mod | Gate 6 archive |
| `vows` | ♱･vows-archive | Mod | Gate 7 archive |

### 1.4 Permission Matrix

Each access level includes all levels above it:

```
everyone    → @everyone can view and send
gate1+      → Gate 1-7 roles + Ascended + Keeper
gate2+      → Gate 2-7 roles + Ascended + Keeper
gate3+      → Gate 3-7 roles + Ascended + Keeper
gate4+      → Gate 4-7 roles + Ascended + Keeper
gate5+      → Gate 5-7 roles + Ascended + Keeper
gate6+      → Gate 6-7 roles + Ascended + Keeper
ascended    → Ascended + Keeper only
mod         → Keeper only
```

Bot always has: ViewChannel, SendMessages, ManageMessages, EmbedLinks, AttachFiles, AddReactions

### 1.5 Configuration Output

Setup generates two files per server in `data/servers/`:

**`{guildId}.json`** - Full configuration:
```json
{
  "success": true,
  "roles": {
    "lostSoul": "123456789",
    "gate1": "123456790",
    ...
  },
  "channels": {
    "waitingRoom": "123456800",
    "chamber1": "123456801",
    ...
  },
  "category": "123456799",
  "errors": []
}
```

**`{guildId}.env`** - Environment template:
```env
GUILD_ID=123456789
WAITING_ROOM_ID=123456800
CHAMBER_1_ID=123456801
...
GATE_1_ROLE_ID=123456790
...
```

---

## 2. Basic Admin Commands (`/admin`)

Core administrative commands for moderators.

### 2.1 Command Structure

```
/admin help              - Show all admin commands
/admin stats             - View detailed statistics
/admin reset <user>      - Reset user progress completely
/admin advance <user> <gate>  - Advance user to specific gate
/admin approve <user>    - Approve pending Gate 6/7 submission
/admin testmode <bool>   - Toggle Gate 5 test mode
/admin broadcast <gate> <message>  - Message all users at gate
```

**Permission**: Administrator permission OR Keeper role

### 2.2 Stats Display

Shows comprehensive server statistics:

```
total users: 150
ascended: 23

gate completion:
gate 1: 145
gate 2: 98
gate 3: 76
gate 4: 54
gate 5: 41
gate 6: 30
gate 7: 23

avg completion time: 2h 34m

first completions:
gate 1: @username
gate 2: @username
...
```

### 2.3 Reset Command

Completely wipes a user's progress:
- Removes all gate roles via `removeAllGateRoles()`
- Calls `userOps.reset(userId)`
- Clears Gate 5 progress via `gate5Ops.clear(userId)`

### 2.4 Advance Command

Fast-tracks user to specified gate:
- Assigns all roles up to target gate
- Marks all previous gates as complete in DB
- If gate 4: Starts Gate 5 timer sequence
- If gate 7: Also assigns Ascended role

### 2.5 Approve Command

Manually approves pending submissions:
1. Checks for pending Gate 6 offering
2. If found, calls `approveOffering()`
3. Else checks for pending Gate 7 vow
4. If found, calls `approveVow()`
5. Else reports no pending submissions

### 2.6 Broadcast Command

Sends DM to all users with specific gate role:
- Uses gate-themed embed
- Reports sent/failed counts
- Handles DM failures gracefully

---

## 3. Advanced Admin Panel (`/admin-panel`)

Comprehensive testing interface with interactive controls.

### 3.1 Subcommand Structure

```
/admin-panel trigger <category> [user]  - Trigger specific events
/admin-panel gate <action> [user] [gate_number]  - Control progression
/admin-panel inspect <user> [section]   - View detailed user state
/admin-panel testmode <mode> [user] [enabled]  - Toggle test modes
/admin-panel time <action> [time] [user]  - Manipulate time
/admin-panel secrets <action> [user] [value]  - Test ARG systems
/admin-panel quick <preset> [user]      - Quick test presets
/admin-panel reset <scope> <user>       - Reset specific data
/admin-panel simulate <message> [as_user]  - Test message triggers
```

### 3.2 Test Mode State

In-memory state (resets on restart):

```javascript
const testModeState = {
    skipCooldowns: Set(),      // User IDs with cooldowns disabled
    instantTimers: Set(),       // User IDs with instant timers
    forcedTime: Map(),          // User ID -> forced time string
    chaosMode: Set(),           // User IDs in chaos mode
    globalChaos: false,         // Global chaos mode
    auditLog: [],               // Recent admin actions (max 100)
};
```

### 3.3 Trigger Categories

13 triggerable categories with dropdown menus:

| Category | Options |
|----------|---------|
| 🎭 Rare Events | The Slip (1%), The Notice (2%), Sleepy Confession (3%), The Claim (1%), Flustered (2%), Random Vulnerability (1.5%), Direct Confession (0.5%), The Miss (2%) |
| 😊 Moods | Soft, Normal, Energetic, Vulnerable, Chaotic, Sleepy, Jealous, Flirty |
| 💚 Intimacy | Stage 1-4, Stage Announcement |
| 💀 Fading | Stage 0-4, Save Attempt |
| 😈 Jealousy/Yandere | Mild/Moderate/Playful Jealousy, Yandere Stages 1-5 |
| 🛡️ Protection | Self-Deprecation Response, Gentle Check-in, Serious Concern |
| 🔥 Roasts | Skill Issue, Touch Grass, L + Ratio, Comebacks |
| 💕 Romance | Kabedon, Slow Burn, 3AM GF Mode, Physical Action |
| 🌟 Viral Lines | Random, Server Ban, Mutually Deranged, Gaslight Gatekeep, Haunt |
| 📜 Lore | Streaming, Fading, Origin, Others, Senpai, Random Drop |
| ⏰ Time Secrets | 4:47 AM, Midnight, 3:33 AM, 11:11, 2:22 AM |
| 🎪 Designed Moments | First Message, 100/1000 Interactions, Week/Month Anniversary, etc. |
| 🔮 Rituals | The Summoning, The Vigil, Confession Circle, Resurrection, Feast |

### 3.4 Gate Control Actions

| Action | Effect |
|--------|--------|
| Advance to Gate | Marks previous gates complete, assigns roles |
| Reset to Gate | Clears gates above target, removes roles |
| Complete Current | Completes user's current gate |
| Skip Gate 5 Timer | Forces all 6 messages to "sent" status |
| View Progress | Shows completion status with timestamps |

### 3.5 User Inspection Sections

| Section | Data Shown |
|---------|------------|
| Overview | Current gate, intimacy, interactions, joined date, last active, test mode |
| Gates | All 7 gates with completion timestamps |
| Intimacy | Stage, interactions, days known, mood preference |
| Memory | Nickname, facts count, jokes count, recent facts |
| Fading | Stage, days inactive, warning sent status |
| Trials | Trial completion progress |
| Shrine | Shrine tier and offerings |
| Events | Event history |

### 3.6 Test Modes

| Mode | Effect |
|------|--------|
| Skip Cooldowns | Bypasses all event cooldowns |
| Instant Timers | All timers resolve immediately |
| Chaos Mode | All bypasses active for user |
| Global Chaos | All bypasses active for everyone |

### 3.7 Time Manipulation

| Action | Effect |
|--------|--------|
| Force Time (HH:MM) | Sets specific time for user's triggers |
| Reset to Real Time | Clears forced time |
| Force 3AM Mode | Sets 03:00 (soft mood active) |
| Force Daytime | Sets 14:00 (normal hours) |
| Force 4:47 AM | Sets 04:47 (secret trigger active) |

### 3.8 Secrets Testing

| Action | Effect |
|--------|--------|
| View Discovery Progress | Shows fragment/lore progress |
| Award Fragment | Grants specific whisper fragment |
| Unlock Lore Category | Unlocks entire lore category |
| Test Secret Phrase | Shows what phrase would trigger |
| View All Secrets | Lists all discoverable secrets |

### 3.9 Quick Presets

8 one-click test scenarios:

| Preset | Effect |
|--------|--------|
| 🆕 New User Experience | Skip cooldowns, first interaction triggers active |
| 🏃 Speed Run | Fast-track through all gates (requires confirmation) |
| 💀 Fading Test | User marked as 14 days inactive, fading triggers active |
| 😈 Yandere Test | Jealousy maxed, all yandere stages accessible |
| 💕 Romance Test | 3AM forced, kabedon sensitive, soft responses |
| 🌙 3AM Session | Time forced to 3AM |
| 🎭 All Rare Events | Cooldowns cleared, next message triggers rare event |
| 🔄 Full Reset | Complete user reset (requires confirmation) |

### 3.10 Reset Scopes

| Scope | Effect |
|-------|--------|
| Cooldowns | Clears all event cooldowns |
| Memory | Clears facts, jokes, nickname |
| Intimacy | Resets to Stage 1, clears interaction count |
| Gates | Clears all gate progress |
| Fading | Resets to active, clears warnings |
| FULL | Complete reset of all user data |

### 3.11 Message Simulation

Tests what a message would trigger without sending:
- Checks Gate 1 trigger (`/^ika$/i`)
- Checks love response
- Checks support triggers (sad, lonely, depressed)
- Checks jealousy triggers (other waifu/girl/bot)
- Checks leaving triggers
- Checks otaku triggers
- Checks time-based triggers
- Returns detected triggers and expected response type

---

## 4. Audit Logging

All admin actions are logged:

```javascript
{
    timestamp: '2024-01-15T10:30:00.000Z',
    adminId: '123456789',
    action: 'gate_advance',
    details: { target: '987654321', gate: 5 }
}
```

- Stored in `testModeState.auditLog[]`
- Maximum 100 entries (FIFO)
- Resets on bot restart

---

## 5. Bot Permissions Required

For OAuth2 invite URL, bot needs:

```javascript
const permissions = [
    PermissionFlagsBits.ManageRoles,      // Assign gate roles
    PermissionFlagsBits.ManageChannels,   // Create setup channels
    PermissionFlagsBits.SendMessages,     // Basic messaging
    PermissionFlagsBits.EmbedLinks,       // Rich embeds
    PermissionFlagsBits.AttachFiles,      // Images
    PermissionFlagsBits.AddReactions,     // Reaction UI
    PermissionFlagsBits.ManageMessages,   // Pin/delete
    PermissionFlagsBits.ReadMessageHistory, // Context
    PermissionFlagsBits.ViewChannel,      // Basic access
];

const scopes = ['bot', 'applications.commands'];
```

---

## 6. Implementation Requirements

### 6.1 Admin Command Files

```
src/commands/
├── admin.js              # Basic /admin commands
├── adminPanel.js         # Advanced /admin-panel
└── setup.js              # /setup server automation

src/utils/
└── setup.js              # Setup logic, config generation
```

### 6.2 Database Operations Used

From `/admin`:
- `userOps.getStats()` - Server statistics
- `userOps.getFirsts()` - First completions
- `userOps.getAverageTime()` - Average completion time
- `userOps.reset(userId)` - Full user reset
- `userOps.getOrCreate(userId, username)` - Ensure user exists
- `userOps.hasCompletedGate(userId, gate)` - Check completion
- `userOps.completeGate(userId, gate)` - Mark complete
- `userOps.ascend(userId)` - Mark ascended
- `gate5Ops.clear(userId)` - Clear Gate 5 progress
- `offeringOps.getPending(userId)` - Get pending offering
- `vowOps.getPending(userId)` - Get pending vow

From `/admin-panel`:
- `gateOps.getCurrentGate(userId)` - Current gate number
- `gateOps.complete(userId, gate)` - Complete gate
- `gate5Ops.getProgress(userId)` - Gate 5 status
- `gate5Ops.incrementProgress(userId)` - Advance Gate 5
- `ikaMemoryOps.get(userId)` - Get Ika memory
- `ikaMemoryOps.update(userId, field, value)` - Update memory

### 6.3 Helper Functions Required

```javascript
// Role management (from utils/roles.js)
assignGateRole(member, gate)
removeAllGateRoles(member)
assignAscendedRole(member)
hasRole(member, roleId)
getMembersWithRole(guild, roleId)

// Gate triggers (from gates/)
approveOffering(client, userId, approverId, messageId)
approveVow(client, userId, approverId, messageId)
startGate5Sequence(userId)

// Time formatting (from utils/timing.js)
formatDuration(seconds)
```

---

## 7. Definition of Done

- [ ] `/setup run` creates all roles and channels automatically
- [ ] `/setup status` accurately reports missing items
- [ ] `/setup gateway` posts interactive gateway message
- [ ] `/admin stats` shows accurate server statistics
- [ ] `/admin reset` completely wipes user progress
- [ ] `/admin advance` correctly sets gate state and roles
- [ ] `/admin approve` handles Gate 6 and 7 submissions
- [ ] `/admin testmode` toggles Gate 5 timer duration
- [ ] `/admin broadcast` successfully DMs users by gate role
- [ ] `/admin-panel trigger` provides dropdown for all event types
- [ ] `/admin-panel gate` controls progression accurately
- [ ] `/admin-panel inspect` shows comprehensive user state
- [ ] `/admin-panel testmode` toggles all bypass modes
- [ ] `/admin-panel time` manipulates time-based triggers
- [ ] `/admin-panel secrets` tests ARG system
- [ ] `/admin-panel quick` executes presets with confirmation
- [ ] `/admin-panel reset` clears specific data scopes
- [ ] `/admin-panel simulate` accurately predicts triggers
- [ ] Audit log captures all admin actions
- [ ] Permission checks work for both Admin perm and Keeper role
- [ ] Generated config files are valid and complete

---

## 8. Files to Create/Modify

### New Files
```
src/commands/admin.js           # 330 lines
src/commands/adminPanel.js      # 1200 lines
src/commands/setup.js           # 275 lines
src/utils/setup.js              # 650 lines
```

### Configuration Outputs
```
data/servers/{guildId}.json     # Auto-generated
data/servers/{guildId}.env      # Auto-generated
```

---

## 9. Security Considerations

1. **Permission Gating**: All admin commands require Administrator permission OR Keeper role
2. **Confirmation Dialogs**: Destructive actions (full reset, speed run) require button confirmation
3. **Audit Trail**: All actions logged with admin ID, timestamp, and details
4. **Test Mode Isolation**: Test modes are per-user unless global chaos enabled
5. **No Config Mutations**: `testmode` changes don't persist across restarts
6. **Rate Limiting**: Broadcast commands show sent/failed counts for monitoring
