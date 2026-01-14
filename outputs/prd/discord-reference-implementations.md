# Discord Bot Reference Implementations

> **Purpose:** Curated list of GitHub projects and best practices for implementing IKA'S SIMP WARS Discord bot
> **Date:** 2026-01-14

---

## Gacha System References

### Top Recommendations

| Repository | Stars | Tech Stack | Key Features |
|------------|-------|------------|--------------|
| [katarina_bot](https://github.com/Dartv/katarina_bot) | - | TypeScript 96.9% | Purpose-built Discord gacha bot |
| [Amusement Club 2.0](https://github.com/Amusement-Cafe/amusementclub2.0) | - | Node.js/Oceanic | Community-sourced card game, CDN for cards, sharding support via Ayano |
| [Pokestar](https://github.com/ewei068/pokestar) | - | Node.js + Python | Pity system, rate-up banners, economy integration |
| [JettBot](https://github.com/mbaula/JettBot) | - | Discord.js + Sequelize | Valorant skin gacha + economy + gambling |
| [GachaBot](https://github.com/sjkd23/GachaBot) | - | TypeScript + PostgreSQL | Cross-server card collection, user-created cards |

### Gacha Implementation Patterns

**From Pokestar:**
```
Banner Rates by Pokeball Type:
- Pokeball:   70% Common / 25% Rare / 4% Epic / 1% Legendary
- Greatball:  30% / 55% / 12% / 3%
- Ultraball:  0% / 45% / 50% / 5%
- Masterball: 0% / 0% / 90% / 10%
```

**Key Learnings:**
- Use ephemeral responses for individual pulls (reduces channel spam)
- Only announce SSR/rare pulls publicly
- Implement pity system to guarantee progression
- Rate-up mechanics increase specific card rates by ~50%
- Store card images on CDN, not in database

---

## Points/Leaderboard System References

### Top Recommendations

| Repository | Tech Stack | Key Features |
|------------|------------|--------------|
| [better-discord-ranking-system](https://github.com/Tomato6966/better-discord-ranking-system) | Discord.js + Enmap + Canvacord | Visual rank cards, 50-user leaderboards |
| [DiscordPointsBot](https://github.com/ThePadna/DiscordPointsBot) | Discord.js | Simple points tracking + leaderboards |
| [SQLite Points Guide](https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/sqlite-based-points-system.md) | better-sqlite3 | Comprehensive tutorial |

### SQLite Schema Pattern

```sql
CREATE TABLE scores (
  id TEXT PRIMARY KEY,  -- Composite: guildId + odId
  user TEXT,
  guild TEXT,
  points INTEGER,
  level INTEGER
);

CREATE UNIQUE INDEX idx_scores_id ON scores (id);
```

**Performance Pragmas:**
```sql
PRAGMA synchronous = 1;
PRAGMA journal_mode = wal;
```

### Level Calculation Formula

```javascript
const level = Math.floor(0.1 * Math.sqrt(points));
```

This creates a curve where:
- Level 1: 100 points
- Level 10: 10,000 points
- Level 50: 250,000 points

---

## Auto-Setup (Roles/Channels) References

### Top Recommendations

| Repository | Tech Stack | Key Features |
|------------|------------|--------------|
| [Auto-Role-Channel-Bot-Discord](https://github.com/AnikBeris/Auto-Role-Channel-Bot-Discord) | Python | Auto-creates roles with permissions, channel structures |
| [Discord-Role-Assignment-Bot](https://github.com/scba6/Discord-Role-Assignment-Bot) | - | Button-based role assignment, faction/class roles |

### Permission Tier Pattern

```python
ROLES = {
    "PLAYER": {
        "permissions": ["read_messages", "send_messages", "voice_connect"],
        "color": 0x00FF00
    },
    "MOD": {
        "permissions": ["kick_members", "manage_messages"],
        "color": 0xFF8C00
    },
    "ADM": {
        "permissions": ["administrator"],
        "color": 0xFF0000
    }
}
```

**Best Practice:** Externalize config to `config.json`, not hardcoded.

---

## Redis Caching Patterns

### From [Advanced Discord.js Redis Guide](https://dev.to/en3sis/advanced-discord-js-cache-apis-requests-with-redis-4d8a)

**Core Functions:**
```typescript
// Set with TTL (1 hour default)
const cacheSetTTL = async (key: string, value: any, ttl = 3600) => {
  return await redis.setex(key, ttl, JSON.stringify(value));
};

// Get with JSON parsing
const cacheGet = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

// Fetch with cache fallback
const fetchWithCache = async (key: string, fetchFn: () => Promise<any>, ttl = 3600) => {
  const cached = await cacheGet(key);
  if (cached) return cached;

  const fresh = await fetchFn();
  await cacheSetTTL(key, fresh, ttl);
  return fresh;
};
```

### Rate Limit Synchronization (from [Xenon Bot](https://blog.xenon.bot/handling-rate-limits-at-scale-fb7b453cb235))

```typescript
// Before each Discord API request:
const rateLimitKey = `ratelimit:${endpoint}`;
const isLimited = await redis.get(rateLimitKey);

if (isLimited) {
  const ttl = await redis.ttl(rateLimitKey);
  throw new Error(`Rate limited. Retry in ${ttl}s`);
}

// After hitting a 429:
await redis.setex(rateLimitKey, retryAfter, '1');
```

---

## Scaling Best Practices

### From [Discord-Bots-At-Scale](https://github.com/shitcorp/Discord-Bots-At-Scale)

**Memory Optimization (Discord.js):**
```javascript
const client = new Client({
  makeCache: Options.cacheWithLimits({
    MessageManager: 25,      // Down from 200
    PresenceManager: 0,      // Disable unless needed
    ReactionManager: 0,      // Disable unless needed
  }),
  sweepers: {
    messages: {
      interval: 43200,       // 12 hours
      lifetime: 21600,       // 6 hours
    },
  },
});
```

**Critical Warning:** "Without changing these settings a memory leak is guaranteed to occur!"

**Sharding Thresholds:**
- Start planning at ~2,000 guilds
- Required at 2,500+ guilds
- Aim for ~1 shard per 1,000 guilds

**Gateway Intents:** Only request intents you actually use to reduce event processing.

---

## UI/Embed Design Patterns

### Pagination Libraries for Discord.js v14

| Package | Key Features |
|---------|--------------|
| [@devraelfreeze/discordjs-pagination](https://github.com/devRael1/discordjs-pagination) | Fast skip, page travel, ephemeral support |
| [discordjs-v14-pagination](https://github.com/JavascriptSimp/discordjs-v14-pagination) | 2/4 button modes, footer placeholders |
| [customizable-discordjs-pagination](https://www.npmjs.com/package/customizable-discordjs-pagination) | Select menu support, full customization |

### Embed Character Limits

| Field | Limit |
|-------|-------|
| Author name | 256 chars |
| Title | 256 chars |
| Description | 4096 chars |
| Field name | 256 chars |
| Field value | 1024 chars |
| Footer | 2048 chars |
| Total embed | 6000 chars |

**Tip:** "Inline fields may not display as inline if the thumbnail and/or image is too big."

### Component Templates

**[DiscordJS-V14-Bot-Template](https://github.com/TFAGaming/DiscordJS-V14-Bot-Template):**
- Modular command/component/event handlers
- Button and select menu patterns
- Component customId routing

**[discord.js-v14-v2-template](https://github.com/ZarScape/discord.js-v14-v2-template):**
- New Components V2 system
- MediaGallery (carousels)
- ContainerBuilder for complex layouts

---

## Database Schema Patterns

### User Economy (from JettBot/Sequelize pattern)

```typescript
// models/User.ts
const User = sequelize.define('User', {
  discordId: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastDaily: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// models/Inventory.ts
const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: DataTypes.STRING(20),
  itemId: DataTypes.STRING(50),
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});
```

### Faction War Aggregation

```sql
-- Weekly faction score aggregation
SELECT
  faction,
  SUM(points_earned) as total_score,
  COUNT(DISTINCT user_id) as participants
FROM faction_activity
WHERE week_number = :currentWeek
GROUP BY faction
ORDER BY total_score DESC;
```

---

## Anti-Patterns to Avoid

### From Research

| Don't | Why | Do Instead |
|-------|-----|------------|
| Per-message DB writes | Rate limits, performance | Redis counters, batch persist |
| Unlimited message cache | Memory leak guaranteed | Set `messageCacheMaxSize: 25` |
| Real-time role updates | ~1000/day Discord limit | Daily reconciliation job |
| Hardcoded IDs in code | Can't deploy to new servers | Database lookup via resource key |
| 5 separate bots | Same rate limits, 5x maintenance | Single modular bot |
| Reactions for large votes | Pagination at 100/request | Use buttons or slash commands |
| Storing snowflakes as numbers | JS can't handle them | Store as strings |

---

## Recommended Architecture

Based on research, the optimal architecture for IKA'S SIMP WARS:

```
┌─────────────────────────────────────────────────────────┐
│                    Discord Gateway                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 InfiniteIdolBot (Node.js)                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   Commands   │ │   Events    │ │    Jobs     │       │
│  │  /gacha      │ │ messageCreate│ │ persistPoints│      │
│  │  /faction    │ │ interactionCreate│ │ syncRoles │    │
│  │  /devotion   │ │ guildMemberAdd│ │ ikaMessages│       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                         │                               │
│  ┌─────────────────────────────────────────────┐       │
│  │              Service Layer                   │       │
│  │  gacha.service │ devotion.service │ setup   │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Redis     │     │ PostgreSQL  │     │    CDN      │
│  Counters   │     │  User Data  │     │ Card Images │
│  Rate Limits│     │  Inventory  │     │             │
│  Leaderboard│     │  Factions   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Sources

### Gacha Systems
- [GachaBot](https://github.com/sjkd23/GachaBot) - TypeScript + PostgreSQL
- [Amusement Club 2.0](https://github.com/Amusement-Cafe/amusementclub2.0) - Large-scale card game
- [Pokestar](https://github.com/ewei068/pokestar) - Pity system, banners
- [JettBot](https://github.com/mbaula/JettBot) - Economy + gacha + gambling
- [katarina_bot](https://github.com/Dartv/katarina_bot) - TypeScript gacha bot

### Points/Leaderboards
- [better-discord-ranking-system](https://github.com/Tomato6966/better-discord-ranking-system)
- [SQLite Points System Guide](https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/sqlite-based-points-system.md)
- [DiscordPointsBot](https://github.com/ThePadna/DiscordPointsBot)

### Auto-Setup
- [Auto-Role-Channel-Bot-Discord](https://github.com/AnikBeris/Auto-Role-Channel-Bot-Discord)
- [Discord-Role-Assignment-Bot](https://github.com/scba6/Discord-Role-Assignment-Bot)

### Scaling & Caching
- [Discord-Bots-At-Scale](https://github.com/shitcorp/Discord-Bots-At-Scale) - Whitepaper
- [Redis Caching Guide](https://dev.to/en3sis/advanced-discord-js-cache-apis-requests-with-redis-4d8a)
- [Xenon Rate Limit Handling](https://blog.xenon.bot/handling-rate-limits-at-scale-fb7b453cb235)

### UI/Components
- [discordjs-pagination](https://github.com/devRael1/discordjs-pagination)
- [DiscordJS-V14-Bot-Template](https://github.com/TFAGaming/DiscordJS-V14-Bot-Template)
- [discord.js-v14-v2-template](https://github.com/ZarScape/discord.js-v14-v2-template)
- [Embed Builder](https://github.com/Glitchii/embedbuilder)

### Discord Official
- [Rate Limits Documentation](https://discord.com/developers/docs/topics/rate-limits)
- [Using Roles for Engagement](https://discord.com/community/using-roles-to-increase-engagement)

---

**END OF REFERENCE DOCUMENT**
