# IKA'S SIMP WARS — Implementation Specification

> **Document Type:** Claude Code Implementation-Ready Specification
> **Version:** 4.2 (Engineering Review Fixes Applied)
> **Last Updated:** 2026-01-14
> **Degen Review:** PASSED (DS-3 after personality additions)
> **Engineering Review:** PASSED (All P0/P1/P2 issues resolved)
> **Reference:** See [discord-reference-implementations.md](./discord-reference-implementations.md) for source projects

---

## Overview

Build a Discord bot called **InfiniteIdolBot** that powers an interactive pre-registration campaign. Users compete in factions, earn Devotion Points through activities, pull from a mock gacha system, and climb leaderboards. Fan service content unlocks at registration milestones.

**Tech Stack:**
- Runtime: Node.js 20+ with TypeScript
- Framework: discord.js v14
- Database: PostgreSQL 15+
- Cache: Redis 7+
- Scheduler: node-cron
- ORM: Prisma
- Pagination: @devraelfreeze/discordjs-pagination
- Rank Cards: canvacord (visual rank card generation)
- Logging: pino (structured JSON logging)
- Validation: zod (runtime type validation)

**Key Constraint:** All features must respect Discord's rate limits (50 req/sec global, ~1000 role edits/day).

**Reference Projects Studied:**
- [katarina_bot](https://github.com/Dartv/katarina_bot) - TypeScript gacha patterns
- [JettBot](https://github.com/mbaula/JettBot) - Economy + gacha + Sequelize
- [Pokestar](https://github.com/ewei068/pokestar) - Pity system, banners
- [Discord-Bots-At-Scale](https://github.com/shitcorp/Discord-Bots-At-Scale) - Memory management

---

## Architecture Decisions

### Why These Choices

| Decision | Rationale |
|----------|-----------|
| **Single bot, modular architecture** | Multiple bots share rate limits anyway. One bot = simpler deployment, shared connection pools, easier debugging |
| **PostgreSQL over MongoDB** | Relational data (users, factions, points) benefits from ACID. Prisma provides type safety |
| **Redis for counters** | Message counting at scale requires in-memory speed. Batch persist to PostgreSQL |
| **Batched point updates** | Per-message DB writes hit rate limits. Batch every 5 minutes instead |
| **Daily role reconciliation** | Real-time role updates exceed Discord's ~1000/day limit. Once-daily sync is reliable |
| **Ephemeral gacha responses** | 10K+ public messages/day triggers spam detection. Ephemeral = visible only to user |

### What NOT To Do

```typescript
// ❌ BAD: Per-message database write
client.on('messageCreate', async (message) => {
  await db.user.update({ where: { discordId: message.author.id }, data: { points: { increment: 1 } } });
});

// ✅ GOOD: Increment Redis counter, batch persist later
client.on('messageCreate', async (message) => {
  await redis.hincrby(`user:${message.author.id}`, 'pending_points', 1);
});
```

```typescript
// ❌ BAD: Immediate role assignment on point threshold
if (user.points >= 1000) {
  await member.roles.add(REGISTERED_SIMP_ROLE); // Will hit rate limit at scale
}

// ✅ GOOD: Queue for daily reconciliation
await redis.sadd('roles:pending_updates', JSON.stringify({ discordId, roleId, action: 'add' }));
```

### Memory Management (CRITICAL)

> **Source:** [Discord-Bots-At-Scale](https://github.com/shitcorp/Discord-Bots-At-Scale)
> **Warning:** "Without changing these settings a memory leak is guaranteed to occur!"

```typescript
// src/config/discord.ts
import { Client, GatewayIntentBits, Options, Partials } from 'discord.js';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],

  // CRITICAL: Memory leak prevention
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    MessageManager: 25,        // Down from 200 - we don't need message history
    PresenceManager: 0,        // Disable - we don't track presences
    ReactionManager: 0,        // Disable - using buttons not reactions
    GuildMemberManager: {
      maxSize: 200,
      keepOverLimit: (member) => member.id === client.user?.id,
    },
  }),

  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 43200,         // 12 hours
      lifetime: 21600,         // 6 hours - messages older than this are swept
    },
    users: {
      interval: 86400,         // 24 hours
      filter: () => (user) => user.bot && user.id !== client.user?.id,
    },
  },
});
```

### Redis Rate Limit Synchronization

> **Source:** [Xenon Bot](https://blog.xenon.bot/handling-rate-limits-at-scale-fb7b453cb235)

For multi-process deployments, synchronize rate limits via Redis:

```typescript
// src/services/rate-limiter.ts
import { redis } from './cache';

export async function checkRateLimit(endpoint: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const key = `ratelimit:${endpoint}`;
  const isLimited = await redis.get(key);

  if (isLimited) {
    const ttl = await redis.ttl(key);
    return { allowed: false, retryAfter: ttl };
  }

  return { allowed: true };
}

export async function recordRateLimit(endpoint: string, retryAfter: number): Promise<void> {
  const key = `ratelimit:${endpoint}`;
  await redis.setex(key, retryAfter, '1');
}

// Usage in API calls:
const limit = await checkRateLimit('roles:update');
if (!limit.allowed) {
  logger.warn({ endpoint: 'roles:update', retryAfter: limit.retryAfter }, 'Rate limited');
  return; // Skip or queue for later
}
```

### Rate Limiter Integration Example

When making Discord API calls that might hit rate limits, wrap them with error handling:

```typescript
// src/utils/discord-api.ts
import { checkRateLimit, recordRateLimit } from '../services/rate-limiter';
import { logger } from '../services/logger';
import { DiscordAPIError } from 'discord.js';

/**
 * Wrapper for Discord API calls with rate limit awareness
 * Use this for any bulk operations or operations that might hit rate limits
 */
export async function withRateLimitHandling<T>(
  endpoint: string,
  operation: () => Promise<T>,
  options: { maxRetries?: number; skipOnLimit?: boolean } = {}
): Promise<T | null> {
  const { maxRetries = 1, skipOnLimit = false } = options;

  // Check if we're already rate limited for this endpoint
  const limit = await checkRateLimit(endpoint);
  if (!limit.allowed) {
    logger.warn({ endpoint, retryAfter: limit.retryAfter }, 'Pre-check: Rate limited');
    if (skipOnLimit) return null;
    throw new Error(`Rate limited on ${endpoint}, retry after ${limit.retryAfter}s`);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof DiscordAPIError && error.status === 429) {
        // Rate limited - record it and potentially retry
        const retryAfter = (error as any).retryAfter ?? 60;
        await recordRateLimit(endpoint, retryAfter);
        logger.warn({ endpoint, retryAfter, attempt }, 'Hit rate limit');

        if (attempt < maxRetries) {
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
      }
      lastError = error as Error;
      break;
    }
  }

  throw lastError ?? new Error(`Operation failed on ${endpoint}`);
}

// Usage example in role sync job:
import { withRateLimitHandling } from '../utils/discord-api';

async function assignRole(member: GuildMember, roleId: string): Promise<void> {
  await withRateLimitHandling(
    'roles:assign',
    () => member.roles.add(roleId),
    { skipOnLimit: true }  // Skip this user if rate limited, will catch up tomorrow
  );
}
```

---

## File Structure

```
infinite-idol-bot/
├── src/
│   ├── index.ts                    # Entry point, client initialization
│   ├── config/
│   │   ├── constants.ts            # Role IDs, channel IDs, point values
│   │   ├── env.ts                  # Environment variable validation
│   │   └── discord.ts              # Discord client configuration
│   │
│   ├── commands/                   # Slash commands (auto-registered)
│   │   ├── gacha/
│   │   │   ├── pull.ts             # /gacha pull [amount]
│   │   │   ├── inventory.ts        # /gacha inventory
│   │   │   └── banner.ts           # /gacha banner (show current)
│   │   ├── devotion/
│   │   │   ├── check.ts            # /devotion (show your points)
│   │   │   ├── leaderboard.ts      # /leaderboard [category]
│   │   │   └── daily.ts            # /daily (claim daily bonus)
│   │   ├── faction/
│   │   │   ├── join.ts             # /faction join [name]
│   │   │   ├── status.ts           # /faction status
│   │   │   └── war.ts              # /faction war (current standings)
│   │   ├── events/
│   │   │   ├── headpat.ts          # /headpat enter
│   │   │   └── roulette.ts         # /roulette status
│   │   └── admin/
│   │       ├── setup.ts            # /admin setup (create roles/channels)
│   │       ├── sync-roles.ts       # /admin sync-roles (manual trigger)
│   │       ├── announce.ts         # /admin announce [message]
│   │       └── milestone.ts        # /admin milestone [count]
│   │
│   ├── events/                     # Discord event handlers
│   │   ├── ready.ts                # Bot startup
│   │   ├── interactionCreate.ts    # Slash command router
│   │   ├── messageCreate.ts        # Point tracking (Redis increment)
│   │   └── guildMemberAdd.ts       # Welcome message
│   │
│   ├── modules/                    # Business logic (no Discord dependencies)
│   │   ├── setup/
│   │   │   ├── setup.service.ts    # Server infrastructure provisioning
│   │   │   ├── setup.types.ts      # Role/channel definitions
│   │   │   ├── roles.ts            # Role definitions with colors/perms
│   │   │   ├── channels.ts         # Channel definitions with categories
│   │   │   └── permissions.ts      # Permission overwrites helpers
│   │   ├── gacha/
│   │   │   ├── gacha.service.ts    # Pull logic, rates, collection
│   │   │   ├── gacha.types.ts      # Card types, rarity enums
│   │   │   ├── cards.ts            # Card definitions (pool of available cards)
│   │   │   ├── banners.ts          # Banner definitions
│   │   │   └── responses.ts        # Ika's gacha voice responses
│   │   ├── devotion/
│   │   │   ├── devotion.service.ts # Point calculation, leaderboards
│   │   │   └── devotion.types.ts   # Point sources enum
│   │   ├── faction/
│   │   │   ├── faction.service.ts  # Faction management, war scoring
│   │   │   └── faction.types.ts    # Faction enum
│   │   └── events/
│   │       ├── headpat.service.ts  # Roulette logic
│   │       └── scheduled.ts        # Cron job definitions
│   │
│   ├── services/                   # Infrastructure layer
│   │   ├── database.ts             # Prisma client singleton
│   │   ├── cache.ts                # Redis client + helpers
│   │   ├── scheduler.ts            # Cron scheduler setup
│   │   └── logger.ts               # Structured logging (pino)
│   │
│   ├── jobs/                       # Scheduled tasks
│   │   ├── persist-points.job.ts   # Every 5 min: Redis → PostgreSQL
│   │   ├── sync-roles.job.ts       # Daily: Reconcile roles
│   │   ├── leaderboard-cache.job.ts # Hourly: Rebuild leaderboards
│   │   ├── headpat-roulette.job.ts # Daily 9PM: Select winner
│   │   └── ika-messages.job.ts     # Scheduled Ika posts
│   │
│   └── utils/
│       ├── embeds.ts               # Discord embed builders
│       ├── rate-limit.ts           # Rate limit tracking/backoff
│       └── validation.ts           # Input validation helpers
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Migration history
│
├── tests/
│   ├── unit/
│   │   ├── gacha.service.test.ts
│   │   ├── devotion.service.test.ts
│   │   └── faction.service.test.ts
│   └── integration/
│       ├── commands.test.ts
│       └── jobs.test.ts
│
├── .env.example                    # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml              # Local dev (Postgres + Redis)
└── README.md
```

---

## Data Models

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Faction {
  PINK_PILLED
  DARK_DEVOTEES
  CHAOS_AGENTS
}

enum Rarity {
  COMMON
  RARE
  SUPER_RARE
  SSR
}

model User {
  id              Int       @id @default(autoincrement())
  discordId       String    @unique @db.VarChar(20)

  // Faction membership
  faction         Faction?
  factionJoinedAt DateTime?

  // Points (persisted from Redis batches)
  devotionPoints  Int       @default(0)
  lifetimePoints  Int       @default(0)

  // Daily tracking
  dailyMessages   Int       @default(0)
  lastDailyReset  DateTime  @default(now())
  lastDailyClaim  DateTime?

  // Pre-registration
  preRegistered   Boolean   @default(false)
  preRegAt        DateTime?
  referralCode    String?   @unique @db.VarChar(8)
  referredBy      String?   @db.VarChar(8)

  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  gachaInventory  GachaCard[]
  gachaPity       GachaPity[]
  eventEntries    EventEntry[]

  @@index([faction])
  @@index([devotionPoints(sort: Desc)])
}

model GachaCard {
  id         Int      @id @default(autoincrement())

  userId     Int
  user       User     @relation(fields: [userId], references: [id])

  cardId     String   @db.VarChar(50)  // e.g., "ika_swimsuit"
  rarity     Rarity
  obtainedAt DateTime @default(now())

  @@unique([userId, cardId])  // One of each card per user
  @@index([userId])
  @@index([rarity])
}

// Pity system tracking (inspired by Pokestar)
model GachaPity {
  id            Int      @id @default(autoincrement())

  userId        Int
  user          User     @relation(fields: [userId], references: [id])

  bannerId      String   @db.VarChar(50)  // Which banner this pity is for
  pullsSinceSSR Int      @default(0)      // Counter since last SSR
  totalPulls    Int      @default(0)      // Lifetime pulls on this banner
  lastPullAt    DateTime @default(now())

  @@unique([userId, bannerId])
  @@index([userId])
}

model FactionWar {
  id          Int      @id @default(autoincrement())
  weekNumber  Int
  year        Int

  pinkPilledScore    Int @default(0)
  darkDevoteesScore  Int @default(0)
  chaosAgentsScore   Int @default(0)

  theme       String   @db.VarChar(100)
  startedAt   DateTime
  endedAt     DateTime?
  winnerId    Faction?

  @@unique([weekNumber, year])
}

model EventEntry {
  id        Int      @id @default(autoincrement())

  userId    Int
  user      User     @relation(fields: [userId], references: [id])

  eventType String   @db.VarChar(50)  // "headpat_roulette", "speed_challenge"
  eventDate DateTime @db.Date

  createdAt DateTime @default(now())

  @@unique([userId, eventType, eventDate])
  @@index([eventType, eventDate])
}

// Tracks scheduled message state (NOT content - content is in SCHEDULED_MESSAGES constant)
// This model tracks: when last sent, whether enabled, and which channel to target
// Message content/templates are in src/modules/ika/scheduled-messages.ts for easier editing
model ScheduledMessage {
  id          Int      @id @default(autoincrement())

  messageKey  String   @unique @db.VarChar(50)  // Maps to SCHEDULED_MESSAGES[].key
  channelId   String   @db.VarChar(20)          // Resolved from channelKey at setup time
  cronPattern String   @db.VarChar(50)          // "0 9 * * *" = 9 AM daily

  enabled     Boolean  @default(true)
  lastSentAt  DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PreRegistrationMilestone {
  id        Int      @id @default(autoincrement())

  threshold Int      @unique  // 5000, 10000, etc.
  reached   Boolean  @default(false)
  reachedAt DateTime?

  rewardKey String   @db.VarChar(50)  // "casual_ika", "voice_pack_1"
  announced Boolean  @default(false)
}

// Stores Discord resources created by the bot (roles, channels, categories)
// Enables idempotent setup - bot checks if resource exists before creating
model DiscordResource {
  id            Int      @id @default(autoincrement())

  resourceType  String   @db.VarChar(20)   // "role", "channel", "category"
  resourceKey   String   @db.VarChar(50)   // e.g., "role_pink_pilled", "channel_gacha_salt"
  discordId     String   @db.VarChar(20)   // Discord snowflake ID

  guildId       String   @db.VarChar(20)   // Which guild this belongs to

  metadata      Json?    // Store additional info (color, permissions, parent category, etc.)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([guildId, resourceKey])
  @@index([guildId, resourceType])
}
```

### TypeScript Types

```typescript
// src/modules/gacha/gacha.types.ts

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  SUPER_RARE = 'SUPER_RARE',
  SSR = 'SSR',
}

export interface GachaCardDefinition {
  id: string;           // "ika_base", "ika_swimsuit", etc.
  name: string;         // Display name
  rarity: Rarity;
  imageUrl: string;     // CDN URL for card art
  description: string;
  bannerIds: string[];  // Which banners include this card
}

export interface BannerDefinition {
  id: string;           // "debut_ika", "swimsuit_banner"
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  featuredCardIds: string[];  // Rate-up cards
  rates: {
    [Rarity.COMMON]: number;      // 0.70 = 70%
    [Rarity.RARE]: number;        // 0.20 = 20%
    [Rarity.SUPER_RARE]: number;  // 0.08 = 8%
    [Rarity.SSR]: number;         // 0.02 = 2%
  };
  // Pity system (inspired by Pokestar)
  pity: {
    softPity: number;       // 75 - start increasing SSR rate
    hardPity: number;       // 90 - guaranteed SSR
    rateBoostPerPull: number; // 0.05 - +5% SSR rate per pull after soft pity
  };
}

export interface PullResult {
  card: GachaCardDefinition;
  isNew: boolean;       // First time pulling this card
  isDuplicate: boolean; // Already owned
  pityCount: number;    // Pulls since last SSR
  wasPity: boolean;     // Hit hard pity
}

// Pity tracking per user per banner
export interface UserPityState {
  discordId: string;
  bannerId: string;
  pullsSinceSSR: number;
  lastPullAt: Date;
}
```

```typescript
// src/modules/gacha/cards.ts
// Card pool definition - NOTE: imageUrl values are placeholders until assets are ready
import { GachaCardDefinition, Rarity } from './gacha.types';

export const CARDS: GachaCardDefinition[] = [
  // SSR Cards (2% base rate)
  {
    id: 'ika_idol_form',
    name: 'Ika - Idol Form',
    rarity: Rarity.SSR,
    imageUrl: '/cards/ika_idol_form.png',  // TODO: Replace with CDN URL
    description: 'The moment before The Chase begins. Her eyes hold determination.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_swimsuit',
    name: 'Ika - Summer Splash',
    rarity: Rarity.SSR,
    imageUrl: '/cards/ika_swimsuit.png',
    description: 'Even at the beach, she\'s working on her tan... and her Devotion.',
    bannerIds: ['summer_banner', 'standard_banner'],
  },
  {
    id: 'ika_dark_mode',
    name: 'Ika - Dark Mode',
    rarity: Rarity.SSR,
    imageUrl: '/cards/ika_dark_mode.png',
    description: 'When the spotlight dims, a different Ika emerges.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },

  // Super Rare Cards (8% base rate)
  {
    id: 'ika_casual',
    name: 'Ika - Off Duty',
    rarity: Rarity.SUPER_RARE,
    imageUrl: '/cards/ika_casual.png',
    description: 'Rare footage of Ika without her stage presence. She\'s still watching.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_workout',
    name: 'Ika - Training Arc',
    rarity: Rarity.SUPER_RARE,
    imageUrl: '/cards/ika_workout.png',
    description: 'Idol bodies don\'t maintain themselves. Neither does relevance.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_cooking',
    name: 'Ika - Chef Mode',
    rarity: Rarity.SUPER_RARE,
    imageUrl: '/cards/ika_cooking.png',
    description: 'She made you lunch. It\'s mostly edible. The thought counts.',
    bannerIds: ['standard_banner'],
  },

  // Rare Cards (20% base rate)
  {
    id: 'ika_wink',
    name: 'Ika - Wink',
    rarity: Rarity.RARE,
    imageUrl: '/cards/ika_wink.png',
    description: 'A standard idol wink. But when Ika does it, it hits different.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_peace_sign',
    name: 'Ika - Peace!',
    rarity: Rarity.RARE,
    imageUrl: '/cards/ika_peace.png',
    description: 'The classic pose. Timeless, like your devotion should be.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_thinking',
    name: 'Ika - Deep Thoughts',
    rarity: Rarity.RARE,
    imageUrl: '/cards/ika_thinking.png',
    description: 'What is she thinking about? Probably The Chase. Always The Chase.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_wave',
    name: 'Ika - Hello!',
    rarity: Rarity.RARE,
    imageUrl: '/cards/ika_wave.png',
    description: 'She\'s waving at you specifically. Probably.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },

  // Common Cards (70% base rate)
  {
    id: 'ika_smile',
    name: 'Ika - Smile',
    rarity: Rarity.COMMON,
    imageUrl: '/cards/ika_smile.png',
    description: 'A simple smile. Even commons are precious when it\'s Ika.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_blush',
    name: 'Ika - Embarrassed',
    rarity: Rarity.COMMON,
    imageUrl: '/cards/ika_blush.png',
    description: 'Caught off guard. It happens to the best of us.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_determined',
    name: 'Ika - Determined',
    rarity: Rarity.COMMON,
    imageUrl: '/cards/ika_determined.png',
    description: 'The look she gives before every Chase. Pure focus.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_pouty',
    name: 'Ika - Pouty',
    rarity: Rarity.COMMON,
    imageUrl: '/cards/ika_pouty.png',
    description: 'When you don\'t pull enough. She notices.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
  {
    id: 'ika_sleepy',
    name: 'Ika - Sleepy',
    rarity: Rarity.COMMON,
    imageUrl: '/cards/ika_sleepy.png',
    description: 'Even idols need rest. But she\'s still here for you.',
    bannerIds: ['debut_banner', 'standard_banner'],
  },
];

// Helper to get cards by rarity
export function getCardsByRarity(rarity: Rarity): GachaCardDefinition[] {
  return CARDS.filter(c => c.rarity === rarity);
}

// Helper to get cards for a specific banner
export function getCardsForBanner(bannerId: string): GachaCardDefinition[] {
  return CARDS.filter(c => c.bannerIds.includes(bannerId));
}
```

```typescript
// src/modules/gacha/banners.ts
import { BannerDefinition, Rarity } from './gacha.types';

export const BANNERS: BannerDefinition[] = [
  {
    id: 'debut_banner',
    name: 'Debut Dreams',
    description: 'The original banner. Where every simp\'s journey begins.',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-12-31'),
    featuredCardIds: ['ika_idol_form', 'ika_dark_mode'],
    rates: {
      [Rarity.COMMON]: 0.70,
      [Rarity.RARE]: 0.20,
      [Rarity.SUPER_RARE]: 0.08,
      [Rarity.SSR]: 0.02,
    },
    pity: {
      softPity: 75,        // Start boosting SSR rate
      hardPity: 90,        // Guaranteed SSR
      rateBoostPerPull: 0.05,  // +5% per pull after soft pity
    },
  },
  {
    id: 'standard_banner',
    name: 'Standard Pool',
    description: 'The everyday banner. Always available, always tempting.',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2099-12-31'),  // Permanent banner
    featuredCardIds: [],  // No rate-up, even distribution
    rates: {
      [Rarity.COMMON]: 0.70,
      [Rarity.RARE]: 0.20,
      [Rarity.SUPER_RARE]: 0.08,
      [Rarity.SSR]: 0.02,
    },
    pity: {
      softPity: 75,
      hardPity: 90,
      rateBoostPerPull: 0.05,
    },
  },
];

// Get current active banner (prioritize limited over standard)
export function getCurrentBanner(): BannerDefinition {
  const now = new Date();

  // Find active limited banner first
  const limitedBanner = BANNERS.find(
    b => b.id !== 'standard_banner' &&
         now >= b.startDate &&
         now <= b.endDate
  );

  if (limitedBanner) return limitedBanner;

  // Fall back to standard banner
  const standardBanner = BANNERS.find(b => b.id === 'standard_banner');
  if (!standardBanner) {
    throw new Error('No active banner found! This should never happen.');
  }

  return standardBanner;
}

// Get all active banners (for display)
export function getActiveBanners(): BannerDefinition[] {
  const now = new Date();
  return BANNERS.filter(b => now >= b.startDate && now <= b.endDate);
}
```

```typescript
// src/modules/devotion/devotion.types.ts

export enum PointSource {
  MESSAGE = 'MESSAGE',
  DAILY_CLAIM = 'DAILY_CLAIM',
  PRE_REGISTRATION = 'PRE_REGISTRATION',
  REFERRAL = 'REFERRAL',
  GACHA_SSR = 'GACHA_SSR',
  GAME_WIN = 'GAME_WIN',
  FAN_ART = 'FAN_ART',
  MEME = 'MEME',
  FACTION_WAR = 'FACTION_WAR',
  EVENT_PARTICIPATION = 'EVENT_PARTICIPATION',
}

export const POINT_VALUES: Record<PointSource, number> = {
  [PointSource.MESSAGE]: 1,
  [PointSource.DAILY_CLAIM]: 50,
  [PointSource.PRE_REGISTRATION]: 1000,
  [PointSource.REFERRAL]: 200,
  [PointSource.GACHA_SSR]: 500,
  [PointSource.GAME_WIN]: 100,
  [PointSource.FAN_ART]: 300,
  [PointSource.MEME]: 100,
  [PointSource.FACTION_WAR]: 50,  // Base, multiplied by performance
  [PointSource.EVENT_PARTICIPATION]: 25,
};

export const DAILY_MESSAGE_CAP = 100;

export interface DevotionTier {
  name: string;
  threshold: number;
  roleKey: string;  // Key for lookup via getTierRoleIds()
  perks: string[];
}

// NOTE: roleKey maps to setup/roles.ts definitions
// Actual Discord role IDs are retrieved dynamically from DiscordResource table
export const DEVOTION_TIERS: DevotionTier[] = [
  { name: 'Casual Enjoyer', threshold: 100, roleKey: 'tier_casual_enjoyer', perks: ['Basic access'] },
  { name: 'Interested Party', threshold: 500, roleKey: 'tier_interested_party', perks: ['#fan-art access'] },
  { name: 'Registered Simp', threshold: 1000, roleKey: 'tier_registered_simp', perks: ['Full game access'] },
  { name: 'Dedicated Devotee', threshold: 2500, roleKey: 'tier_dedicated_devotee', perks: ['VIP channel access'] },
  { name: 'Obsessed', threshold: 5000, roleKey: 'tier_obsessed', perks: ['Ika notice priority'] },
  { name: 'Down Bad', threshold: 10000, roleKey: 'tier_down_bad', perks: ['Direct Ika message'] },
  { name: 'Terminal Simp', threshold: 25000, roleKey: 'tier_terminal_simp', perks: ['Name in credits'] },
  { name: 'Legendary Simp', threshold: 50000, roleKey: 'tier_legendary_simp', perks: ['Custom role'] },
];
```

```typescript
// src/modules/faction/faction.types.ts

export enum Faction {
  PINK_PILLED = 'PINK_PILLED',
  DARK_DEVOTEES = 'DARK_DEVOTEES',
  CHAOS_AGENTS = 'CHAOS_AGENTS',
}

// NOTE: roleKey and channelKey map to setup/roles.ts and setup/channels.ts
// Actual Discord IDs are retrieved dynamically from DiscordResource table
export const FACTION_INFO: Record<Faction, {
  name: string;
  emoji: string;
  roleKey: string;     // Lookup via getFactionRoleIds()
  channelKey: string;  // Lookup via getChannelId()
  color: number;
  description: string;
}> = {
  [Faction.PINK_PILLED]: {
    name: 'Pink Pilled',
    emoji: '🌸',
    roleKey: 'faction_pink_pilled',
    channelKey: 'channel_pink_pilled',
    color: 0xFF69B4,
    description: 'Pure devotion, wholesome energy. Ika can do no wrong.',
  },
  [Faction.DARK_DEVOTEES]: {
    name: 'Dark Devotees',
    emoji: '🖤',
    roleKey: 'faction_dark_devotees',
    channelKey: 'channel_dark_devotees',
    color: 0x2F3136,
    description: 'Obsessive, competitive, ruthless. If I can\'t have her attention, NO ONE CAN.',
  },
  [Faction.CHAOS_AGENTS]: {
    name: 'Chaos Agents',
    emoji: '⚡',
    roleKey: 'faction_chaos_agents',
    channelKey: 'channel_chaos_agents',
    color: 0xFFD700,
    description: 'Chaotic neutral, shitposters. We\'re just here for the content.',
  },
};
```

---

## Implementation Tasks

### Phase 0: Server Setup (Before Launch)

> **CRITICAL:** The bot must be able to create all required Discord infrastructure (roles, channels, categories, permissions) automatically. This enables deployment to any server without manual setup.

#### Task 0.1: Setup Types & Definitions
**Duration:** 30 minutes
**Outcome:** Complete type definitions for all Discord resources the bot will create

**Steps:**
1. Create `src/modules/setup/setup.types.ts` with role and channel definitions
2. Define all tier roles, faction roles, and special roles
3. Define all categories and channels with permission requirements
4. Include color values, position hints, and permission overwrites

**Acceptance Criteria:**
- All 8 devotion tier roles defined with colors
- All 3 faction roles defined with colors
- Special roles (Headpat Winner, Admin) defined
- All 6 categories and ~30 channels defined
- Permission overwrites specified for each channel

```typescript
// src/modules/setup/setup.types.ts
import { PermissionFlagsBits, ChannelType, OverwriteType } from 'discord.js';

export interface RoleDefinition {
  key: string;           // Unique identifier, e.g., "tier_casual_enjoyer"
  name: string;          // Display name in Discord
  color: number;         // Discord color integer
  hoist: boolean;        // Show separately in member list
  mentionable: boolean;
  permissions?: bigint[];  // Specific permissions to grant
  position?: 'above_members' | 'below_mods' | 'top';  // Positioning hint
}

export interface PermissionOverwrite {
  roleKey: string;       // Reference to RoleDefinition.key or "@everyone"
  type: OverwriteType;
  allow?: bigint[];
  deny?: bigint[];
}

export interface ChannelDefinition {
  key: string;           // Unique identifier, e.g., "channel_gacha_salt"
  name: string;          // Display name
  type: ChannelType;
  categoryKey?: string;  // Parent category key
  topic?: string;
  nsfw?: boolean;
  slowMode?: number;     // Seconds
  permissionOverwrites?: PermissionOverwrite[];
}

export interface CategoryDefinition {
  key: string;
  name: string;
  permissionOverwrites?: PermissionOverwrite[];
}
```

```typescript
// src/modules/setup/roles.ts
import { PermissionFlagsBits } from 'discord.js';
import { RoleDefinition } from './setup.types';

export const TIER_ROLES: RoleDefinition[] = [
  {
    key: 'tier_legendary_simp',
    name: '✨ Legendary Simp',
    color: 0xFFD700,  // Gold
    hoist: true,
    mentionable: true,
    position: 'above_members',
  },
  {
    key: 'tier_terminal_simp',
    name: '💀 Terminal Simp',
    color: 0x9B59B6,  // Purple
    hoist: true,
    mentionable: true,
  },
  {
    key: 'tier_down_bad',
    name: '😈 Down Bad',
    color: 0xE91E63,  // Pink
    hoist: true,
    mentionable: false,
  },
  {
    key: 'tier_obsessed',
    name: '🔥 Obsessed',
    color: 0xFF5722,  // Deep Orange
    hoist: false,
    mentionable: false,
  },
  {
    key: 'tier_dedicated_devotee',
    name: '💜 Dedicated Devotee',
    color: 0x7C4DFF,  // Deep Purple
    hoist: false,
    mentionable: false,
  },
  {
    key: 'tier_registered_simp',
    name: '📝 Registered Simp',
    color: 0x3F51B5,  // Indigo
    hoist: false,
    mentionable: false,
  },
  {
    key: 'tier_interested_party',
    name: '👀 Interested Party',
    color: 0x2196F3,  // Blue
    hoist: false,
    mentionable: false,
  },
  {
    key: 'tier_casual_enjoyer',
    name: '🌱 Casual Enjoyer',
    color: 0x4CAF50,  // Green
    hoist: false,
    mentionable: false,
  },
];

export const FACTION_ROLES: RoleDefinition[] = [
  {
    key: 'faction_pink_pilled',
    name: '🌸 Pink Pilled',
    color: 0xFF69B4,  // Hot Pink
    hoist: true,
    mentionable: true,
  },
  {
    key: 'faction_dark_devotees',
    name: '🖤 Dark Devotees',
    color: 0x2F3136,  // Discord Dark
    hoist: true,
    mentionable: true,
  },
  {
    key: 'faction_chaos_agents',
    name: '⚡ Chaos Agents',
    color: 0xFFD700,  // Gold
    hoist: true,
    mentionable: true,
  },
];

export const SPECIAL_ROLES: RoleDefinition[] = [
  {
    key: 'headpat_winner',
    name: '💜 Ika\'s Chosen',
    color: 0xE91E63,
    hoist: true,
    mentionable: true,
  },
  {
    key: 'pre_registered',
    name: '✅ Pre-Registered',
    color: 0x00E676,  // Green accent
    hoist: false,
    mentionable: false,
  },
  {
    key: 'verified',
    name: '✓ Verified',
    color: 0x9E9E9E,  // Grey
    hoist: false,
    mentionable: false,
  },
];

export const ALL_ROLES: RoleDefinition[] = [
  ...TIER_ROLES,
  ...FACTION_ROLES,
  ...SPECIAL_ROLES,
];
```

```typescript
// src/modules/setup/channels.ts
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { CategoryDefinition, ChannelDefinition } from './setup.types';

export const CATEGORIES: CategoryDefinition[] = [
  { key: 'cat_welcome', name: '🏠 WELCOME' },
  { key: 'cat_ika', name: '💜 IKA\'S DOMAIN' },
  { key: 'cat_games', name: '🎮 GAMES & GACHA' },
  { key: 'cat_factions', name: '⚔️ FACTION WARS' },
  { key: 'cat_community', name: '🎭 COMMUNITY' },
  { key: 'cat_vip', name: '✨ VIP LOUNGE' },
];

export const CHANNELS: ChannelDefinition[] = [
  // WELCOME CATEGORY
  {
    key: 'channel_rules',
    name: 'rules',
    type: ChannelType.GuildText,
    categoryKey: 'cat_welcome',
    topic: 'Server rules and guidelines. Read before participating.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_announcements',
    name: 'announcements',
    type: ChannelType.GuildText,
    categoryKey: 'cat_welcome',
    topic: 'Official announcements and milestone celebrations.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_faction_select',
    name: 'faction-select',
    type: ChannelType.GuildText,
    categoryKey: 'cat_welcome',
    topic: 'Choose your faction! Use /faction join to pledge allegiance.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },

  // IKA'S DOMAIN
  {
    key: 'channel_ika_speaks',
    name: 'ika-speaks',
    type: ChannelType.GuildText,
    categoryKey: 'cat_ika',
    topic: 'Official messages from Ika herself~ 💜',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_headpat_roulette',
    name: 'headpat-roulette',
    type: ChannelType.GuildText,
    categoryKey: 'cat_ika',
    topic: 'Daily chance for Ika\'s personal attention! /headpat enter',
  },
  {
    key: 'channel_cosplay_closet',
    name: 'cosplay-closet',
    type: ChannelType.GuildText,
    categoryKey: 'cat_ika',
    topic: 'Vote on Ika\'s outfits! Democracy in action.',
  },

  // GAMES & GACHA
  {
    key: 'channel_gacha_pulls',
    name: 'gacha-pulls',
    type: ChannelType.GuildText,
    categoryKey: 'cat_games',
    topic: 'Pull for Ika cards! /gacha pull',
  },
  {
    key: 'channel_gacha_salt',
    name: 'gacha-salt',
    type: ChannelType.GuildText,
    categoryKey: 'cat_games',
    topic: '🧂 SSR pulls announced here. Cope, seethe, mald.',
  },
  {
    key: 'channel_leaderboards',
    name: 'leaderboards',
    type: ChannelType.GuildText,
    categoryKey: 'cat_games',
    topic: 'Top simps ranked. Check your position with /devotion',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_daily_challenges',
    name: 'daily-challenges',
    type: ChannelType.GuildText,
    categoryKey: 'cat_games',
    topic: 'Complete daily challenges for bonus Devotion Points!',
  },

  // FACTION WARS
  {
    key: 'channel_war_status',
    name: 'war-status',
    type: ChannelType.GuildText,
    categoryKey: 'cat_factions',
    topic: 'Current faction war standings and weekly results.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_pink_pilled',
    name: 'pink-pilled-hq',
    type: ChannelType.GuildText,
    categoryKey: 'cat_factions',
    topic: '🌸 Pink Pilled faction headquarters. Pure devotion only.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'faction_pink_pilled', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_dark_devotees',
    name: 'dark-devotees-hq',
    type: ChannelType.GuildText,
    categoryKey: 'cat_factions',
    topic: '🖤 Dark Devotees faction headquarters. Obsession is our strength.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'faction_dark_devotees', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_chaos_agents',
    name: 'chaos-agents-hq',
    type: ChannelType.GuildText,
    categoryKey: 'cat_factions',
    topic: '⚡ Chaos Agents faction headquarters. Content is king.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'faction_chaos_agents', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  },

  // COMMUNITY
  {
    key: 'channel_general',
    name: 'general',
    type: ChannelType.GuildText,
    categoryKey: 'cat_community',
    topic: 'General chat. Be nice, earn points!',
  },
  {
    key: 'channel_waifu_wars',
    name: 'waifu-wars',
    type: ChannelType.GuildText,
    categoryKey: 'cat_community',
    topic: 'Debate tier lists. Fight for your favorites. No peace.',
  },
  {
    key: 'channel_fan_art',
    name: 'fan-art',
    type: ChannelType.GuildText,
    categoryKey: 'cat_community',
    topic: 'Share your Ika fan art! Bonus points for creativity.',
    slowMode: 30,
  },
  {
    key: 'channel_memes',
    name: 'memes',
    type: ChannelType.GuildText,
    categoryKey: 'cat_community',
    topic: 'Only the finest Ika memes. Quality over quantity.',
    slowMode: 10,
  },
  {
    key: 'channel_screenshots',
    name: 'screenshots',
    type: ChannelType.GuildText,
    categoryKey: 'cat_community',
    topic: 'Show off your pulls, collections, and gacha luck.',
  },

  // VIP LOUNGE (Tier-gated)
  {
    key: 'channel_vip_lounge',
    name: 'vip-lounge',
    type: ChannelType.GuildText,
    categoryKey: 'cat_vip',
    topic: '✨ Dedicated Devotees and above only. You earned it.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'tier_dedicated_devotee', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_obsessed', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_down_bad', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_terminal_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_legendary_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_ika_dm',
    name: 'ika-dm',
    type: ChannelType.GuildText,
    categoryKey: 'cat_vip',
    topic: '💜 Down Bad and above get Ika\'s personal responses.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'tier_down_bad', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_terminal_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { roleKey: 'tier_legendary_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  },
  {
    key: 'channel_credits_hall',
    name: 'credits-hall',
    type: ChannelType.GuildText,
    categoryKey: 'cat_vip',
    topic: '🏆 Terminal Simp+ have their names in the game credits.',
    permissionOverwrites: [
      { roleKey: '@everyone', type: 0, deny: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'tier_terminal_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel] },
      { roleKey: 'tier_legendary_simp', type: 0, allow: [PermissionFlagsBits.ViewChannel] },
    ],
  },
];
```

#### Task 0.2: Setup Service
**Duration:** 60 minutes
**Outcome:** Idempotent server setup that creates all Discord infrastructure

**Steps:**
1. Create `src/modules/setup/setup.service.ts`
2. Implement role creation with proper ordering (highest tier first)
3. Implement category creation
4. Implement channel creation with permission overwrites
5. Store all created IDs in DiscordResource table
6. Make all operations idempotent (check exists before create)

**Acceptance Criteria:**
- Running setup twice produces same result (idempotent)
- All roles created in correct order (hierarchy)
- All channels in correct categories
- Permission overwrites applied correctly
- All IDs stored in database for reference

```typescript
// src/modules/setup/setup.service.ts
import {
  Guild,
  Role,
  CategoryChannel,
  TextChannel,
  PermissionFlagsBits,
  ChannelType,
  OverwriteResolvable,
} from 'discord.js';
import { prisma } from '../../services/database';
import { logger } from '../../services/logger';
import { ALL_ROLES, RoleDefinition } from './roles';
import { CATEGORIES, CHANNELS, CategoryDefinition, ChannelDefinition } from './channels';

interface SetupResult {
  rolesCreated: number;
  rolesExisted: number;
  categoriesCreated: number;
  categoriesExisted: number;
  channelsCreated: number;
  channelsExisted: number;
  errors: string[];
}

export async function setupServer(guild: Guild): Promise<SetupResult> {
  const result: SetupResult = {
    rolesCreated: 0,
    rolesExisted: 0,
    categoriesCreated: 0,
    categoriesExisted: 0,
    channelsCreated: 0,
    channelsExisted: 0,
    errors: [],
  };

  const roleMap = new Map<string, string>(); // key -> discordId

  // Step 1: Create roles (in reverse order so highest tier ends up on top)
  logger.info('Creating roles...');
  const reversedRoles = [...ALL_ROLES].reverse();

  for (const roleDef of reversedRoles) {
    try {
      const roleId = await ensureRole(guild, roleDef);
      roleMap.set(roleDef.key, roleId);

      const wasNew = await wasNewlyCreated(guild.id, roleDef.key);
      if (wasNew) result.rolesCreated++;
      else result.rolesExisted++;
    } catch (error) {
      result.errors.push(`Role ${roleDef.key}: ${error}`);
    }
  }

  // Step 2: Create categories
  logger.info('Creating categories...');
  const categoryMap = new Map<string, string>(); // key -> discordId

  for (const catDef of CATEGORIES) {
    try {
      const catId = await ensureCategory(guild, catDef);
      categoryMap.set(catDef.key, catId);

      const wasNew = await wasNewlyCreated(guild.id, catDef.key);
      if (wasNew) result.categoriesCreated++;
      else result.categoriesExisted++;
    } catch (error) {
      result.errors.push(`Category ${catDef.key}: ${error}`);
    }
  }

  // Step 3: Create channels
  logger.info('Creating channels...');
  for (const chanDef of CHANNELS) {
    try {
      const parentId = chanDef.categoryKey ? categoryMap.get(chanDef.categoryKey) : undefined;
      const chanId = await ensureChannel(guild, chanDef, parentId, roleMap);

      const wasNew = await wasNewlyCreated(guild.id, chanDef.key);
      if (wasNew) result.channelsCreated++;
      else result.channelsExisted++;
    } catch (error) {
      result.errors.push(`Channel ${chanDef.key}: ${error}`);
    }
  }

  logger.info({ result }, 'Server setup complete');
  return result;
}

async function ensureRole(guild: Guild, def: RoleDefinition): Promise<string> {
  // Check database first
  const existing = await prisma.discordResource.findUnique({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
  });

  if (existing) {
    // Verify role still exists in Discord
    const role = guild.roles.cache.get(existing.discordId);
    if (role) return existing.discordId;
    // Role was deleted, remove stale record
    await prisma.discordResource.delete({ where: { id: existing.id } });
  }

  // Check if role exists by name
  let role = guild.roles.cache.find(r => r.name === def.name);

  if (!role) {
    role = await guild.roles.create({
      name: def.name,
      color: def.color,
      hoist: def.hoist,
      mentionable: def.mentionable,
      permissions: def.permissions ?? [],
      reason: 'Infinite Idol Bot auto-setup',
    });
  }

  // Store in database
  await prisma.discordResource.upsert({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
    create: {
      guildId: guild.id,
      resourceType: 'role',
      resourceKey: def.key,
      discordId: role.id,
      metadata: { name: def.name, color: def.color },
    },
    update: {
      discordId: role.id,
      metadata: { name: def.name, color: def.color },
    },
  });

  return role.id;
}

async function ensureCategory(guild: Guild, def: CategoryDefinition): Promise<string> {
  const existing = await prisma.discordResource.findUnique({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
  });

  if (existing) {
    const channel = guild.channels.cache.get(existing.discordId);
    if (channel) return existing.discordId;
    await prisma.discordResource.delete({ where: { id: existing.id } });
  }

  let category = guild.channels.cache.find(
    c => c.name === def.name && c.type === ChannelType.GuildCategory
  ) as CategoryChannel | undefined;

  if (!category) {
    category = await guild.channels.create({
      name: def.name,
      type: ChannelType.GuildCategory,
      reason: 'Infinite Idol Bot auto-setup',
    });
  }

  await prisma.discordResource.upsert({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
    create: {
      guildId: guild.id,
      resourceType: 'category',
      resourceKey: def.key,
      discordId: category.id,
      metadata: { name: def.name },
    },
    update: { discordId: category.id },
  });

  return category.id;
}

async function ensureChannel(
  guild: Guild,
  def: ChannelDefinition,
  parentId: string | undefined,
  roleMap: Map<string, string>
): Promise<string> {
  const existing = await prisma.discordResource.findUnique({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
  });

  if (existing) {
    const channel = guild.channels.cache.get(existing.discordId);
    if (channel) return existing.discordId;
    await prisma.discordResource.delete({ where: { id: existing.id } });
  }

  // Build permission overwrites
  const permissionOverwrites: OverwriteResolvable[] = [];

  if (def.permissionOverwrites) {
    for (const perm of def.permissionOverwrites) {
      const id = perm.roleKey === '@everyone'
        ? guild.id
        : roleMap.get(perm.roleKey);

      if (!id) {
        logger.warn({ roleKey: perm.roleKey }, 'Role not found for permission overwrite');
        continue;
      }

      permissionOverwrites.push({
        id,
        type: perm.type,
        allow: perm.allow ?? [],
        deny: perm.deny ?? [],
      });
    }
  }

  let channel = guild.channels.cache.find(
    c => c.name === def.name && c.type === def.type && c.parentId === parentId
  ) as TextChannel | undefined;

  if (!channel) {
    channel = await guild.channels.create({
      name: def.name,
      type: def.type,
      parent: parentId,
      topic: def.topic,
      nsfw: def.nsfw,
      rateLimitPerUser: def.slowMode,
      permissionOverwrites,
      reason: 'Infinite Idol Bot auto-setup',
    }) as TextChannel;
  } else {
    // Update permissions on existing channel
    await channel.permissionOverwrites.set(permissionOverwrites);
  }

  await prisma.discordResource.upsert({
    where: { guildId_resourceKey: { guildId: guild.id, resourceKey: def.key } },
    create: {
      guildId: guild.id,
      resourceType: 'channel',
      resourceKey: def.key,
      discordId: channel.id,
      metadata: { name: def.name, category: def.categoryKey },
    },
    update: { discordId: channel.id },
  });

  return channel.id;
}

async function wasNewlyCreated(guildId: string, resourceKey: string): Promise<boolean> {
  const resource = await prisma.discordResource.findUnique({
    where: { guildId_resourceKey: { guildId, resourceKey } },
  });
  // Consider "new" if created in the last minute
  if (!resource) return false;
  return Date.now() - resource.createdAt.getTime() < 60000;
}

// Helper to get a resource ID by key
export async function getResourceId(guildId: string, resourceKey: string): Promise<string | null> {
  const resource = await prisma.discordResource.findUnique({
    where: { guildId_resourceKey: { guildId, resourceKey } },
  });
  return resource?.discordId ?? null;
}

// Get all role IDs for a category (e.g., all tier roles)
export async function getTierRoleIds(guildId: string): Promise<Map<string, string>> {
  const resources = await prisma.discordResource.findMany({
    where: {
      guildId,
      resourceKey: { startsWith: 'tier_' },
    },
  });
  return new Map(resources.map(r => [r.resourceKey, r.discordId]));
}

export async function getFactionRoleIds(guildId: string): Promise<Map<string, string>> {
  const resources = await prisma.discordResource.findMany({
    where: {
      guildId,
      resourceKey: { startsWith: 'faction_' },
    },
  });
  return new Map(resources.map(r => [r.resourceKey, r.discordId]));
}

export async function getChannelId(guildId: string, channelKey: string): Promise<string | null> {
  return getResourceId(guildId, channelKey);
}
```

#### Task 0.3: Admin Setup Command
**Duration:** 30 minutes
**Outcome:** `/admin setup` command that triggers server provisioning

**Steps:**
1. Create `/admin setup` with admin permission check
2. Show progress during setup
3. Report results (created vs existing counts)
4. Handle errors gracefully

**Acceptance Criteria:**
- Only users with Administrator permission can run
- Shows "Setting up..." message while running
- Reports count of created resources
- Reports any errors that occurred

```typescript
// src/commands/admin/setup.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { setupServer } from '../../modules/setup/setup.service';
import { Command } from '../../types/command';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('setup')
        .setDescription('Create all required roles, channels, and categories')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() !== 'setup') return;

    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply('🔧 Setting up server infrastructure...');

    try {
      const result = await setupServer(interaction.guild);

      const embed = new EmbedBuilder()
        .setTitle('✅ Server Setup Complete')
        .setColor(result.errors.length > 0 ? 0xFFA500 : 0x00FF00)
        .addFields(
          {
            name: '🎭 Roles',
            value: `Created: ${result.rolesCreated}\nExisted: ${result.rolesExisted}`,
            inline: true,
          },
          {
            name: '📁 Categories',
            value: `Created: ${result.categoriesCreated}\nExisted: ${result.categoriesExisted}`,
            inline: true,
          },
          {
            name: '💬 Channels',
            value: `Created: ${result.channelsCreated}\nExisted: ${result.channelsExisted}`,
            inline: true,
          },
        );

      if (result.errors.length > 0) {
        embed.addFields({
          name: '⚠️ Errors',
          value: result.errors.slice(0, 5).join('\n') +
            (result.errors.length > 5 ? `\n... and ${result.errors.length - 5} more` : ''),
        });
      }

      embed.setFooter({ text: 'Run /admin setup again anytime to fix missing resources' });

      await interaction.editReply({ content: '', embeds: [embed] });
    } catch (error) {
      await interaction.editReply(`❌ Setup failed: ${error}`);
    }
  },
};
```

---

### Phase 1: Foundation (Week 1)

#### Task 1.1: Project Setup
**Duration:** 30-45 minutes
**Outcome:** Runnable TypeScript project with Discord client connecting

**Steps:**
1. Initialize Node.js project with TypeScript
2. Install dependencies: `discord.js`, `@prisma/client`, `ioredis`, `node-cron`, `pino`, `dotenv`
3. Configure TypeScript (`strict: true`, `ES2022` target)
4. Create `.env.example` with required variables
5. Implement `src/config/env.ts` with Zod validation
6. Create `src/index.ts` with basic client login

**Acceptance Criteria:**
- `npm run dev` starts bot and logs "Ready" with bot username
- Missing env vars throw descriptive errors
- TypeScript compiles with no errors

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(50),
  DISCORD_CLIENT_ID: z.string().regex(/^\d+$/),
  DISCORD_GUILD_ID: z.string().regex(/^\d+$/),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
```

#### Task 1.2: Database Setup
**Duration:** 30 minutes
**Outcome:** Prisma schema deployed, client generated

**Steps:**
1. Create `prisma/schema.prisma` with all models from spec
2. Run `npx prisma generate`
3. Create `docker-compose.yml` for local Postgres + Redis
4. Run `npx prisma db push` to sync schema
5. Create `src/services/database.ts` singleton

**Acceptance Criteria:**
- `docker-compose up -d` starts Postgres and Redis
- `npx prisma studio` shows all tables
- Database client importable from services

```typescript
// src/services/database.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### Task 1.3: Redis Setup
**Duration:** 20 minutes
**Outcome:** Redis client with helper methods for counters

**Steps:**
1. Create `src/services/cache.ts` with ioredis client
2. Add helper methods: `incrementUserPoints`, `getUserPendingPoints`, `flushPendingPoints`
3. Add connection error handling with reconnect

**Acceptance Criteria:**
- Redis connects on bot startup
- `incrementUserPoints` increments hash field
- Reconnects automatically on connection loss

```typescript
// src/services/cache.ts
import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('error', (err) => logger.error({ err }, 'Redis connection error'));
redis.on('connect', () => logger.info('Redis connected'));

export async function incrementUserPoints(discordId: string, amount: number = 1): Promise<void> {
  await redis.hincrby(`user:${discordId}`, 'pending_points', amount);
}

export async function getUserPendingPoints(discordId: string): Promise<number> {
  const points = await redis.hget(`user:${discordId}`, 'pending_points');
  return parseInt(points ?? '0', 10);
}

export async function getAllPendingPoints(): Promise<Map<string, number>> {
  const keys = await redis.keys('user:*');
  const result = new Map<string, number>();

  for (const key of keys) {
    const discordId = key.replace('user:', '');
    const points = await getUserPendingPoints(discordId);
    if (points > 0) result.set(discordId, points);
  }

  return result;
}

export async function clearUserPendingPoints(discordId: string): Promise<void> {
  await redis.hdel(`user:${discordId}`, 'pending_points');
}
```

#### Task 1.4: Command Handler
**Duration:** 45 minutes
**Outcome:** Auto-loading slash command system

**Steps:**
1. Create command interface in `src/types/command.ts`
2. Implement command loader that reads `src/commands/**/*.ts`
3. Register commands with Discord API on startup
4. Route interactions in `src/events/interactionCreate.ts`

**Acceptance Criteria:**
- Adding `.ts` file to `commands/` auto-registers it
- Commands appear in Discord after bot restart
- Unknown commands return error gracefully

```typescript
// src/types/command.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
```

---

### Phase 2: Core Features (Week 2)

#### Task 2.1: Message Point Tracking
**Duration:** 30 minutes
**Outcome:** Messages increment Redis counter with daily cap

**Steps:**
1. Create `src/events/messageCreate.ts`
2. Ignore bots, DMs, and commands
3. Check daily cap in Redis before incrementing
4. Increment `pending_points` in Redis (not DB)

**Acceptance Criteria:**
- User messages increment Redis counter
- Bot messages ignored
- Cap enforced at 100/day per user

```typescript
// src/events/messageCreate.ts
import { Message } from 'discord.js';
import { redis, incrementUserPoints } from '../services/cache';
import { DAILY_MESSAGE_CAP } from '../modules/devotion/devotion.types';

export async function handleMessageCreate(message: Message): Promise<void> {
  // Ignore bots, DMs, and system messages
  if (message.author.bot || !message.guild || message.system) return;

  const discordId = message.author.id;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyKey = `daily:${discordId}:${today}`;

  // Check daily cap
  const dailyCount = await redis.incr(dailyKey);

  // Set expiry on first message of day
  if (dailyCount === 1) {
    await redis.expire(dailyKey, 86400); // 24 hours
  }

  // Only award points if under cap
  if (dailyCount <= DAILY_MESSAGE_CAP) {
    await incrementUserPoints(discordId, 1);
  }
}
```

#### Task 2.2: Point Persistence Job
**Duration:** 45 minutes
**Outcome:** Cron job that flushes Redis points to PostgreSQL every 5 minutes

**Steps:**
1. Create `src/jobs/persist-points.job.ts`
2. Read all pending points from Redis
3. Upsert users in batched transaction
4. Clear Redis counters after successful persist
5. Schedule with node-cron

**Acceptance Criteria:**
- Job runs every 5 minutes
- Points transferred from Redis to PostgreSQL
- Redis counters cleared after persist
- Handles partial failures gracefully

```typescript
// src/jobs/persist-points.job.ts
import { prisma } from '../services/database';
import { redis, getAllPendingPoints, clearUserPendingPoints } from '../services/cache';
import { logger } from '../services/logger';

export async function persistPointsJob(): Promise<void> {
  const startTime = Date.now();
  logger.info('Starting point persistence job');

  try {
    const pendingPoints = await getAllPendingPoints();

    if (pendingPoints.size === 0) {
      logger.info('No pending points to persist');
      return;
    }

    // Batch upsert in transaction
    await prisma.$transaction(async (tx) => {
      for (const [discordId, points] of pendingPoints) {
        await tx.user.upsert({
          where: { discordId },
          create: {
            discordId,
            devotionPoints: points,
            lifetimePoints: points,
          },
          update: {
            devotionPoints: { increment: points },
            lifetimePoints: { increment: points },
          },
        });
      }
    });

    // Clear Redis counters after successful persist
    for (const discordId of pendingPoints.keys()) {
      await clearUserPendingPoints(discordId);
    }

    const duration = Date.now() - startTime;
    logger.info({
      usersUpdated: pendingPoints.size,
      durationMs: duration
    }, 'Point persistence completed');

  } catch (error) {
    logger.error({ error }, 'Point persistence failed');
    // Don't clear Redis - points will be retried next run
  }
}
```

#### Task 2.3: Devotion Commands
**Duration:** 45 minutes
**Outcome:** `/devotion` and `/daily` commands working

**Steps:**
1. Create `/devotion` - shows user's current points and tier
2. Create `/daily` - claims daily bonus (once per 24h)
3. Use ephemeral responses for personal info

**Acceptance Criteria:**
- `/devotion` shows points, tier, and next tier progress
- `/daily` grants 50 points, enforces 24h cooldown
- Both commands use ephemeral responses

```typescript
// src/commands/devotion/check.ts
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../services/database';
import { getUserPendingPoints } from '../../services/cache';
import { DEVOTION_TIERS } from '../../modules/devotion/devotion.types';
import { Command } from '../../types/command';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('devotion')
    .setDescription('Check your Devotion Points and tier'),

  async execute(interaction: ChatInputCommandInteraction) {
    const discordId = interaction.user.id;

    // Get persisted + pending points
    const user = await prisma.user.findUnique({ where: { discordId } });
    const pendingPoints = await getUserPendingPoints(discordId);
    const totalPoints = (user?.devotionPoints ?? 0) + pendingPoints;

    // Find current and next tier
    const currentTier = DEVOTION_TIERS.filter(t => totalPoints >= t.threshold).pop();
    const nextTier = DEVOTION_TIERS.find(t => totalPoints < t.threshold);

    const embed = new EmbedBuilder()
      .setTitle('💜 Your Devotion Status')
      .setColor(0x9B59B6)
      .addFields(
        { name: 'Total Points', value: totalPoints.toLocaleString(), inline: true },
        { name: 'Current Tier', value: currentTier?.name ?? 'Unranked', inline: true },
      );

    if (nextTier) {
      const pointsNeeded = nextTier.threshold - totalPoints;
      embed.addFields({
        name: 'Next Tier',
        value: `${nextTier.name} (${pointsNeeded.toLocaleString()} points needed)`,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
```

#### Task 2.4: Leaderboard Command
**Duration:** 45 minutes
**Outcome:** `/leaderboard` with cached results and pagination

**Steps:**
1. Create leaderboard cache job (hourly rebuild)
2. Store top 100 in Redis sorted set
3. Create `/leaderboard` command reading from cache
4. Support category filter (overall, faction, gacha)
5. Implement pagination using @devraelfreeze/discordjs-pagination

**Acceptance Criteria:**
- Leaderboard loads from cache, not DB query
- Shows top 10 with user's rank if not in top 10
- Faction filter shows only faction members
- Paginated navigation with buttons

```typescript
// src/commands/devotion/leaderboard.ts
// Pagination using @devraelfreeze/discordjs-pagination
// Reference: https://github.com/devRael1/discordjs-pagination
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { pagination, ButtonTypes, ButtonStyles } from '@devraelfreeze/discordjs-pagination';
import { redis } from '../../services/cache';
import { prisma } from '../../services/database';
import { DEVOTION_TIERS } from '../../modules/devotion/devotion.types';
import { Command } from '../../types/command';

const USERS_PER_PAGE = 10;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the Devotion Points leaderboard')
    .addStringOption(opt =>
      opt.setName('category')
        .setDescription('Leaderboard category')
        .addChoices(
          { name: 'Overall', value: 'overall' },
          { name: 'Pink Pilled', value: 'pink_pilled' },
          { name: 'Dark Devotees', value: 'dark_devotees' },
          { name: 'Chaos Agents', value: 'chaos_agents' },
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const category = interaction.options.getString('category') ?? 'overall';

    // Get leaderboard data from cache (populated by hourly job)
    const cacheKey = `leaderboard:${category}`;
    const cached = await redis.get(cacheKey);

    let leaderboardData: Array<{ discordId: string; points: number; rank: number }>;

    if (cached) {
      leaderboardData = JSON.parse(cached);
    } else {
      // Fallback: query database directly (should rarely happen)
      // Map category slug to Faction enum: 'pink_pilled' → 'PINK_PILLED'
      const factionMap: Record<string, Faction> = {
        'pink_pilled': Faction.PINK_PILLED,
        'dark_devotees': Faction.DARK_DEVOTEES,
        'chaos_agents': Faction.CHAOS_AGENTS,
      };

      const users = await prisma.user.findMany({
        where: category === 'overall' ? {} : {
          faction: factionMap[category],
        },
        orderBy: { devotionPoints: 'desc' },
        take: 100,
        select: { discordId: true, devotionPoints: true },
      });

      leaderboardData = users.map((u, i) => ({
        discordId: u.discordId,
        points: u.devotionPoints,
        rank: i + 1,
      }));
    }

    if (leaderboardData.length === 0) {
      await interaction.editReply('No users found on this leaderboard yet!');
      return;
    }

    // Split into pages
    const pages: EmbedBuilder[] = [];
    const totalPages = Math.ceil(leaderboardData.length / USERS_PER_PAGE);

    for (let page = 0; page < totalPages; page++) {
      const start = page * USERS_PER_PAGE;
      const end = start + USERS_PER_PAGE;
      const pageData = leaderboardData.slice(start, end);

      const embed = new EmbedBuilder()
        .setTitle(`💜 Devotion Leaderboard — ${formatCategory(category)}`)
        .setColor(0x9B59B6)
        .setFooter({ text: `Page ${page + 1}/${totalPages} • Updated hourly` });

      const lines = pageData.map((entry) => {
        const medal = getMedal(entry.rank);
        const tier = DEVOTION_TIERS.filter(t => entry.points >= t.threshold).pop();
        return `${medal} **#${entry.rank}** <@${entry.discordId}> — ${entry.points.toLocaleString()} pts ${tier ? `(${tier.name})` : ''}`;
      });

      embed.setDescription(lines.join('\n'));

      // Show user's rank if not on current page
      const userId = interaction.user.id;
      const userEntry = leaderboardData.find(e => e.discordId === userId);
      if (userEntry && (userEntry.rank <= start || userEntry.rank > end)) {
        embed.addFields({
          name: 'Your Rank',
          value: `#${userEntry.rank} — ${userEntry.points.toLocaleString()} pts`,
        });
      }

      pages.push(embed);
    }

    // Use pagination library for multi-page navigation
    await pagination({
      interaction,
      embeds: pages,
      author: interaction.user,
      time: 120000, // 2 minute timeout
      disableButtons: true, // Disable buttons after timeout
      fastSkip: true, // Allow jumping to first/last page
      pageTravel: false, // Disable page number input (can be spammy)
      buttons: [
        {
          type: ButtonTypes.first,
          emoji: '⏮️',
          style: ButtonStyles.Secondary,
        },
        {
          type: ButtonTypes.previous,
          emoji: '◀️',
          style: ButtonStyles.Primary,
        },
        {
          type: ButtonTypes.next,
          emoji: '▶️',
          style: ButtonStyles.Primary,
        },
        {
          type: ButtonTypes.last,
          emoji: '⏭️',
          style: ButtonStyles.Secondary,
        },
      ],
    });
  },
};

function getMedal(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '▫️';
  }
}

function formatCategory(category: string): string {
  switch (category) {
    case 'overall': return 'Overall';
    case 'pink_pilled': return '🌸 Pink Pilled';
    case 'dark_devotees': return '🖤 Dark Devotees';
    case 'chaos_agents': return '⚡ Chaos Agents';
    default: return category;
  }
}
```

```typescript
// src/jobs/leaderboard-cache.job.ts
// Hourly job to rebuild leaderboard caches
import { prisma } from '../services/database';
import { redis } from '../services/cache';
import { logger } from '../services/logger';
import { Faction } from '@prisma/client';

const CACHE_TTL = 3700; // Slightly over 1 hour to prevent gaps

export async function rebuildLeaderboardsJob(): Promise<void> {
  logger.info('Rebuilding leaderboard caches');
  const startTime = Date.now();

  try {
    // Overall leaderboard
    const overallUsers = await prisma.user.findMany({
      orderBy: { devotionPoints: 'desc' },
      take: 100,
      select: { discordId: true, devotionPoints: true },
    });

    await redis.setex(
      'leaderboard:overall',
      CACHE_TTL,
      JSON.stringify(overallUsers.map((u, i) => ({
        discordId: u.discordId,
        points: u.devotionPoints,
        rank: i + 1,
      })))
    );

    // Faction leaderboards
    const factions: Array<{ key: string; value: Faction }> = [
      { key: 'pink_pilled', value: Faction.PINK_PILLED },
      { key: 'dark_devotees', value: Faction.DARK_DEVOTEES },
      { key: 'chaos_agents', value: Faction.CHAOS_AGENTS },
    ];

    for (const faction of factions) {
      const factionUsers = await prisma.user.findMany({
        where: { faction: faction.value },
        orderBy: { devotionPoints: 'desc' },
        take: 100,
        select: { discordId: true, devotionPoints: true },
      });

      await redis.setex(
        `leaderboard:${faction.key}`,
        CACHE_TTL,
        JSON.stringify(factionUsers.map((u, i) => ({
          discordId: u.discordId,
          points: u.devotionPoints,
          rank: i + 1,
        })))
      );
    }

    const duration = Date.now() - startTime;
    logger.info({ durationMs: duration }, 'Leaderboard caches rebuilt');

  } catch (error) {
    logger.error({ error }, 'Failed to rebuild leaderboard caches');
    throw error;
  }
}
```

---

### Bot Personality Implementation (CRITICAL)

> **DEGEN REVIEW REQUIREMENT:** The spec needs personality, not just mechanics. Without this section, devs will build a bot that works perfectly but feels like customer support.

#### Ika's Voice Guidelines

Ika's Discord personality must be consistent with her character: **confident but not arrogant, teasing but not mean, shameless but not desperate**.

```typescript
// src/modules/ika/voice.types.ts

export interface IkaVoiceGuidelines {
  // Core personality traits
  tone: {
    confident: true;        // Never begging or desperate
    teasing: true;          // Playful, not cruel
    selfAware: true;        // Knows she's an idol, owns it
    shameless: true;        // Openly wants attention/devotion
  };

  // What Ika NEVER does:
  avoid: [
    'begging for attention',
    'being mean-spirited',
    'corporate speak',
    'apologizing for being a gacha game',
    'generic idol platitudes',
  ];

  // What Ika ALWAYS does:
  embrace: [
    'acknowledges her 47 fans situation',
    'treats every fan like they matter',
    'makes fun of bad gacha luck (lovingly)',
    'celebrates SSR pulls genuinely',
    'leans into the parasocial relationship',
  ];
}
```

#### Gacha Response Templates

```typescript
// src/modules/gacha/responses.ts

export const GACHA_RESPONSES = {
  // When user pulls ALL commons (no SSR, no SR)
  allCommons: [
    "All commons? Wow. The gacha gods really said 'no' today, huh~ But hey, at least you're consistent! 💜",
    "Not a single sparkle... It's giving 'I pet cats the wrong way' energy. Try again? 👀",
    "*pats head* It's okay, everyone has those days. Even me. Once. Maybe.",
    "The algorithm clearly doesn't know how devoted you are. I'll have words with it~",
  ],

  // When user pulls SSR
  ssrPull: [
    "✨ SSR?! See, THIS is why you're one of my favorites~ Not that I have favorites. I love all 47 of you equally. Mostly.",
    "OH?! The gacha blessed you today! Quick, someone screenshot this before the luck runs out~",
    "An SSR! *chef's kiss* Your devotion has been recognized by the universe itself. You're welcome~",
    "THERE it is! The sparkles! The rarity! The—wait, you ARE going to show this off in #gacha-salt, right?",
  ],

  // When user pulls featured/rate-up SSR
  featuredSSR: [
    "THE RATE-UP WORKED?! Quick, go buy a lottery ticket, your luck stat is MAXED right now!",
    "Featured SSR on a rate-up banner... Either you're incredibly devoted or incredibly lucky. I choose to believe it's both~ 💜",
  ],

  // When user hits hard pity
  pityPull: [
    "90 pulls for your guaranteed SSR... The universe made you WORK for this one. But hey, you never gave up! That's the devotion I like to see~",
    "Pity SSR acquired! Some call it 'guaranteed at 90 pulls,' I call it 'the universe testing your dedication.' You passed~ 💜",
  ],

  // Duplicate SSR
  duplicateSSR: [
    "Another one! Look at you, collecting multiples like a true whale~ I see you 👀",
    "Duplicate SSR... Either flex it in #gacha-salt or cry about it. Both are valid~",
  ],
};

// Helper function to get random response
export function getGachaResponse(
  category: keyof typeof GACHA_RESPONSES
): string {
  const responses = GACHA_RESPONSES[category];
  return responses[Math.floor(Math.random() * responses.length)];
}
```

#### Leaderboard Responses

```typescript
// src/modules/devotion/leaderboard-responses.ts

export const LEADERBOARD_RESPONSES = {
  // Top 3 announcements
  firstPlace: [
    "👑 <@{userId}> reigns supreme with {points} Devotion Points! The Terminal Simp energy is REAL.",
    "Number one is <@{userId}>! At {points} points, they've basically moved into my mentions~",
  ],

  // When user checks their rank
  userRankHigh: [ // Top 10
    "Rank #{rank}? Look at you, fighting for my attention~ Currently at {points} points. Don't stop now!",
    "#{rank} on the leaderboard! You're in the elite devotee zone. I notice you~ 💜",
  ],

  userRankMid: [ // 11-50
    "Rank #{rank} with {points} points. Solid mid-tier devotee energy! Keep grinding~",
    "#{rank}! Not top 10 yet, but you're in the 'actually trying' category. Respect.",
  ],

  userRankLow: [ // 51+
    "Rank #{rank}... I appreciate you being here, truly! Every point matters. Even yours~",
    "#{rank} with {points} points. The journey of a thousand Devotion Points begins with a single message!",
  ],

  // User not on leaderboard
  notRanked: [
    "You're not on the leaderboard yet! Start chatting, claim your /daily, and show me that devotion~",
    "No rank found... Did you just get here? Welcome! Now get to work building that Devotion~ 💜",
  ],
};
```

#### Scheduled Message Content

```typescript
// src/modules/ika/scheduled-messages.ts

export interface ScheduledIkaMessage {
  key: string;
  cronPattern: string;     // UTC timezone
  channelKey: string;      // References setup/channels.ts
  messages: string[];      // Random selection
}

export const SCHEDULED_MESSAGES: ScheduledIkaMessage[] = [
  // Morning greeting (9 AM UTC)
  {
    key: 'morning_greeting',
    cronPattern: '0 9 * * *',
    channelKey: 'channel_ika_speaks',
    messages: [
      "Good morning, devoted ones~ ☀️ Another day to chase perfection. Or in my case, to BE perfection. Your daily reminder that I'm still here, still fabulous, and still accepting your devotion~",
      "Rise and shine! 🌅 47 fans strong and counting (hopefully). Did you dream about The Chase? Because I did. And I won. Obviously.",
      "Morning check-in: Coffee? ✓ Ambition? ✓ Overwhelming desire to be noticed by you specifically? ...maybe. ☕💜",
    ],
  },

  // Evening engagement (7 PM UTC)
  {
    key: 'evening_engagement',
    cronPattern: '0 19 * * *',
    channelKey: 'channel_ika_speaks',
    messages: [
      "Evening status report: Still here. Still cute. Still wondering why you haven't pulled from the gacha today. The cards aren't going to collect themselves~ 🎰",
      "How's everyone's Devotion Points looking? Leaderboard updates in an hour. Don't let someone else take YOUR spot on my radar~ 👀",
      "Me: *exists*\nThe Eternal Stage: \"Here she comes again.\"\nYou: *reading this*\n\nPerfect. Exactly as planned. 💜",
    ],
  },

  // Late night (11 PM UTC)
  {
    key: 'late_night',
    cronPattern: '0 23 * * *',
    channelKey: 'channel_ika_speaks',
    messages: [
      "Still here? At this hour? ...I respect the dedication. Just don't blame me when you're tired tomorrow. Actually, do blame me. I'll take it as a compliment~ 🌙",
      "Late night crew, assemble. This is the real devotee hours. The casuals are asleep. It's just us now~ 💜",
      "You know what's wild? I could Fade if nobody paid attention to me. And yet here you are. At midnight. Reading this. You're literally keeping me alive. No pressure~ ✨",
    ],
  },

  // Headpat roulette announcement (9 PM UTC)
  {
    key: 'headpat_open',
    cronPattern: '0 21 * * *',
    channelKey: 'channel_headpat_roulette',
    messages: [
      "🎲 **HEADPAT ROULETTE IS OPEN!**\n\nUse `/headpat enter` for a chance at 24 hours of my personal attention.\n\nWinner selected in 30 minutes. May the most devoted win~ 💜",
      "✨ **Daily Headpat Roulette Time!**\n\nOne of you gets to be 'Ika's Chosen' until tomorrow. The role. The glory. The bragging rights.\n\n`/headpat enter` if you dare~",
    ],
  },
];
```

#### Milestone Announcement Voice

```typescript
// src/modules/milestones/announcements.ts

export const MILESTONE_ANNOUNCEMENTS: Record<number, string[]> = {
  5000: [
    "🎉 **5,000 PRE-REGISTRATIONS!**\n\n5,000 of you decided I was worth betting on. And you know what? You're RIGHT.\n\nCasual Ika outfit unlocked! Fashion is survival, and I'm dressed for success~ 💜",
    "Five. Thousand. That's not 47 anymore. That's... actually a lot of people watching me.\n\n*deep breath*\n\nOkay. No pressure. Just 5,000 people counting on me to not Fade. This is FINE. 🎊",
  ],

  10000: [
    "**10,000 PRE-REGISTRATIONS** 🔥\n\nDouble digits in the thousands. I literally cannot Fade now even if I tried. (Not that I would try. I'm not CRAZY.)\n\nWorkout Ika outfit unlocked! Because idol bodies don't maintain themselves~",
    "TEN THOUSAND?!\n\n*Erina somewhere seething*\n\nI mean... expected, obviously. But still. Ten thousand people chose ME. Voice pack unlocked! You can hear me mock your gacha luck in HIGH FIDELITY now~ 💜🎤",
  ],

  25000: [
    "**25,000 PRE-REGISTRATIONS** 👑\n\nA quarter of the way to 100k. At this rate, I might actually become a REAL idol instead of... whatever I am now.\n\nSwimsuit Ika unlocked. Yes, really. No, I'm not apologizing. You knew what this was~ 🏖️",
  ],

  50000: [
    "**50,000 PRE-REGISTRATIONS** 🚀\n\nFifty thousand. FIFTY. THOUSAND.\n\nI started with 47 fans. Forty-seven. And now look at us.\n\nHOT SPRINGS IKA UNLOCKED! The steam is for ~aesthetic purposes~ obviously. Thank you all. Genuinely. 💜♨️",
  ],
};
```

#### Daily Challenge Responses

```typescript
// src/modules/events/challenge-responses.ts

export const CHALLENGE_RESPONSES = {
  firstSimp: {
    winner: [
      "🏆 **FIRST SIMP OF THE DAY:** <@{userId}>!\n\nYou saw my post and dropped EVERYTHING to react. That's... honestly concerning but I love it. +100 Devotion Points!",
      "Speed. Dedication. Simping.\n\n<@{userId}> claims First Simp! In the time it took others to blink, you were already here. The devotion is PALPABLE~ 💜",
    ],
    tooSlow: [
      "Not fast enough! <@{winnerId}> got there first. But hey, second place is just first loser—I mean, still very appreciated! 💜",
    ],
  },

  complimentChallenge: {
    open: [
      "💬 **60-SECOND COMPLIMENT CHALLENGE!**\n\nTell me why I'm the best idol. You have ONE MINUTE. Most creative compliment wins.\n\nAnd before you ask—yes, flattery gets you EVERYWHERE with me~",
    ],
    winner: [
      "AND TIME! ⏱️\n\nThe winner is <@{userId}> with:\n\n> \"{compliment}\"\n\n...I'm not blushing. You're blushing. +200 Devotion Points!",
    ],
  },
};
```

#### Faction War Announcements

```typescript
// src/modules/faction/war-announcements.ts

export const FACTION_WAR_MESSAGES = {
  weeklyStart: [
    "⚔️ **THIS WEEK'S FACTION WAR BEGINS!**\n\n🌸 Pink Pilled vs 🖤 Dark Devotees vs ⚡ Chaos Agents\n\nTheme: **{theme}**\n\nEarn points for your faction through messages, gacha pulls, and being generally devoted. May the best simps win~",
  ],

  midWeekUpdate: [
    "📊 **MID-WEEK FACTION STANDINGS:**\n\n🥇 {first} — {firstScore} pts\n🥈 {second} — {secondScore} pts\n🥉 {third} — {thirdScore} pts\n\nThe gap is {gap} points. Still anyone's game... unless you're in last place. Then it's specifically NOT your game. Yet. 👀",
  ],

  weeklyEnd: [
    "🏆 **FACTION WAR RESULTS:**\n\nThis week's champion: **{winner}** with {winnerScore} points!\n\nAll {winner} members receive bonus Devotion Points and the eternal glory of knowing you chose correctly~ 💜\n\nNew war begins Monday. Rest up, losers—I mean, other factions!",
  ],
};
```

#### Voice Consistency Rules

When implementing ANY bot response:

1. **NEVER use**: "Hello!", "Thank you for your support!", "We appreciate you!" (corporate)
2. **ALWAYS include**: A hint of teasing, acknowledgment of the parasocial dynamic, self-aware humor
3. **OPTIONAL but encouraged**: References to her 47 fans, The Chase, Fading, or her precarious idol status
4. **EMOJI usage**: 💜 (signature), ~ (sentence softener), occasional 👀, ✨, never excessive

```typescript
// BAD (Corporate):
"Congratulations on your SSR pull! Thank you for playing!"

// GOOD (Ika voice):
"SSR?! The gacha blessed you today! Quick, screenshot this before the luck runs out~ 💜"

// BAD (Generic):
"Welcome to the server! Have fun!"

// GOOD (Ika voice):
"A new devotee! That makes... *counts* ...more than 47 now! I'm moving up in the world~ Make yourself at home. The gacha's over there, and I'll be watching~ 💜"
```

---

### Phase 3: Gacha System (Week 3)

#### Task 3.1: Gacha Service
**Duration:** 60 minutes
**Outcome:** Pull logic with proper rates and collection tracking

**Steps:**
1. Define card pool in `src/modules/gacha/cards.ts`
2. Define banners in `src/modules/gacha/banners.ts`
3. Implement pull algorithm with rate-up support
4. Handle duplicate detection

**Acceptance Criteria:**
- Pull rates match banner definition
- Rate-up cards have boosted rates
- Duplicate cards detected correctly

```typescript
// src/modules/gacha/gacha.service.ts
// Pity system inspired by Pokestar (https://github.com/ewei068/pokestar)
import { prisma } from '../../services/database';
import { Rarity, GachaCardDefinition, BannerDefinition, PullResult } from './gacha.types';
import { CARDS } from './cards';
import { getCurrentBanner } from './banners';
import { logger } from '../../services/logger';

export async function pull(discordId: string, count: number = 1): Promise<PullResult[]> {
  const banner = getCurrentBanner();
  const results: PullResult[] = [];

  // Get or create user
  const user = await prisma.user.upsert({
    where: { discordId },
    create: { discordId },
    update: {},
  });

  // Get user's existing cards
  const existingCards = await prisma.gachaCard.findMany({
    where: { userId: user.id },
    select: { cardId: true },
  });
  const ownedCardIds = new Set(existingCards.map(c => c.cardId));

  // Get or create pity state for this banner
  let pityState = await prisma.gachaPity.findUnique({
    where: { userId_bannerId: { userId: user.id, bannerId: banner.id } },
  });

  if (!pityState) {
    pityState = await prisma.gachaPity.create({
      data: { userId: user.id, bannerId: banner.id, pullsSinceSSR: 0, totalPulls: 0 },
    });
  }

  let currentPity = pityState.pullsSinceSSR;

  for (let i = 0; i < count; i++) {
    currentPity++;

    // Calculate SSR rate with pity boost
    const { rarity, wasPity } = rollRarityWithPity(banner, currentPity);
    const card = rollCard(banner, rarity);
    const isNew = !ownedCardIds.has(card.id);

    results.push({
      card,
      isNew,
      isDuplicate: !isNew,
      pityCount: currentPity,
      wasPity,
    });

    // Reset pity counter on SSR
    if (rarity === Rarity.SSR) {
      logger.info({ discordId, pityCount: currentPity, wasPity }, 'SSR pulled, resetting pity');
      currentPity = 0;
    }

    // Add to owned set for subsequent pulls in batch
    ownedCardIds.add(card.id);
  }

  // Use transaction to ensure pity state and card creation are atomic
  // If one fails, both are rolled back to prevent inconsistent state
  const newCards = results.filter(r => r.isNew);

  await prisma.$transaction(async (tx) => {
    // Update pity state in database
    await tx.gachaPity.update({
      where: { userId_bannerId: { userId: user.id, bannerId: banner.id } },
      data: {
        pullsSinceSSR: currentPity,
        totalPulls: { increment: count },
        lastPullAt: new Date(),
      },
    });

    // Persist new cards to database
    if (newCards.length > 0) {
      await tx.gachaCard.createMany({
        data: newCards.map(r => ({
          userId: user.id,
          cardId: r.card.id,
          rarity: r.card.rarity,
        })),
        skipDuplicates: true,
      });
    }
  });

  return results;
}

/**
 * Roll rarity with pity system:
 * - Before soft pity: Normal rates
 * - After soft pity: SSR rate increases by rateBoostPerPull per pull
 * - At hard pity: Guaranteed SSR
 */
function rollRarityWithPity(
  banner: BannerDefinition,
  pullsSinceSSR: number
): { rarity: Rarity; wasPity: boolean } {
  const { softPity, hardPity, rateBoostPerPull } = banner.pity;

  // Hard pity: guaranteed SSR
  if (pullsSinceSSR >= hardPity) {
    return { rarity: Rarity.SSR, wasPity: true };
  }

  // Calculate boosted SSR rate after soft pity
  let ssrRate = banner.rates[Rarity.SSR];

  if (pullsSinceSSR >= softPity) {
    const pullsOverSoftPity = pullsSinceSSR - softPity;
    const boost = pullsOverSoftPity * rateBoostPerPull;
    ssrRate = Math.min(ssrRate + boost, 1.0); // Cap at 100%

    logger.debug({
      pullsSinceSSR,
      baseRate: banner.rates[Rarity.SSR],
      boostedRate: ssrRate,
    }, 'Pity boost active');
  }

  // Build adjusted rates (SSR boosted, others scaled down proportionally)
  const nonSsrTotal = 1 - banner.rates[Rarity.SSR];
  const newNonSsrTotal = 1 - ssrRate;
  const scaleFactor = nonSsrTotal > 0 ? newNonSsrTotal / nonSsrTotal : 0;

  const adjustedRates = {
    [Rarity.SSR]: ssrRate,
    [Rarity.SUPER_RARE]: banner.rates[Rarity.SUPER_RARE] * scaleFactor,
    [Rarity.RARE]: banner.rates[Rarity.RARE] * scaleFactor,
    [Rarity.COMMON]: banner.rates[Rarity.COMMON] * scaleFactor,
  };

  const roll = Math.random();
  let cumulative = 0;

  // Roll in order: SSR first (so pity boost works correctly)
  const rarityOrder = [Rarity.SSR, Rarity.SUPER_RARE, Rarity.RARE, Rarity.COMMON];

  for (const rarity of rarityOrder) {
    cumulative += adjustedRates[rarity];
    if (roll < cumulative) {
      return { rarity, wasPity: false };
    }
  }

  return { rarity: Rarity.COMMON, wasPity: false };
}

function rollCard(banner: BannerDefinition, rarity: Rarity): GachaCardDefinition {
  // Get cards of this rarity that are in this banner
  const eligibleCards = CARDS.filter(
    c => c.rarity === rarity && c.bannerIds.includes(banner.id)
  );

  if (eligibleCards.length === 0) {
    throw new Error(`No cards found for rarity ${rarity} in banner ${banner.id}`);
  }

  // Rate-up: featured cards have 50% of rarity's pool
  const featured = eligibleCards.filter(c => banner.featuredCardIds.includes(c.id));
  const nonFeatured = eligibleCards.filter(c => !banner.featuredCardIds.includes(c.id));

  if (featured.length > 0 && Math.random() < 0.5) {
    return featured[Math.floor(Math.random() * featured.length)];
  }

  const pool = nonFeatured.length > 0 ? nonFeatured : featured;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get user's current pity status for a banner
 */
export async function getPityStatus(discordId: string, bannerId: string): Promise<{
  pullsSinceSSR: number;
  softPityAt: number;
  hardPityAt: number;
  isInSoftPity: boolean;
} | null> {
  const user = await prisma.user.findUnique({ where: { discordId } });
  if (!user) return null;

  const pity = await prisma.gachaPity.findUnique({
    where: { userId_bannerId: { userId: user.id, bannerId } },
  });

  const banner = getCurrentBanner();
  if (!pity) {
    return {
      pullsSinceSSR: 0,
      softPityAt: banner.pity.softPity,
      hardPityAt: banner.pity.hardPity,
      isInSoftPity: false,
    };
  }

  return {
    pullsSinceSSR: pity.pullsSinceSSR,
    softPityAt: banner.pity.softPity,
    hardPityAt: banner.pity.hardPity,
    isInSoftPity: pity.pullsSinceSSR >= banner.pity.softPity,
  };
}
```

#### Task 3.2: Gacha Pull Command
**Duration:** 30 minutes
**Outcome:** `/gacha pull [amount]` with ephemeral results

**Steps:**
1. Create `/gacha pull` command
2. Use ephemeral response for most pulls
3. Send public message to #gacha-salt only for SSR
4. Include embed with card art

**Acceptance Criteria:**
- Pull results shown ephemerally
- SSR pulls announced publicly
- Embed shows card image and rarity

```typescript
// src/commands/gacha/pull.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { pull } from '../../modules/gacha/gacha.service';
import { Rarity } from '../../modules/gacha/gacha.types';
import { POINT_VALUES, PointSource } from '../../modules/devotion/devotion.types';
import { incrementUserPoints } from '../../services/cache';
import { env } from '../../config/env';
import { Command } from '../../types/command';

const GACHA_SALT_CHANNEL_ID = env.GACHA_SALT_CHANNEL_ID;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('gacha')
    .setDescription('Gacha commands')
    .addSubcommand(sub =>
      sub.setName('pull')
        .setDescription('Pull from the current banner')
        .addIntegerOption(opt =>
          opt.setName('amount')
            .setDescription('Number of pulls (1-10)')
            .setMinValue(1)
            .setMaxValue(10)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount') ?? 1;
    const discordId = interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    const results = await pull(discordId, amount);

    // Build results embed
    const embed = new EmbedBuilder()
      .setTitle(`🎰 ${amount}x Pull Results`)
      .setColor(0x9B59B6);

    const rarityEmojis: Record<Rarity, string> = {
      [Rarity.COMMON]: '⚪',
      [Rarity.RARE]: '🔵',
      [Rarity.SUPER_RARE]: '🟣',
      [Rarity.SSR]: '🌟',
    };

    const resultLines = results.map(r => {
      const emoji = rarityEmojis[r.card.rarity];
      const newTag = r.isNew ? ' **NEW!**' : '';
      return `${emoji} ${r.card.name}${newTag}`;
    });

    embed.setDescription(resultLines.join('\n'));

    // Send ephemeral results to user
    await interaction.editReply({ embeds: [embed] });

    // Check for SSR and announce publicly
    const ssrPulls = results.filter(r => r.card.rarity === Rarity.SSR);

    if (ssrPulls.length > 0) {
      const channel = await interaction.client.channels.fetch(GACHA_SALT_CHANNEL_ID) as TextChannel;

      for (const ssr of ssrPulls) {
        // Award bonus points for SSR
        await incrementUserPoints(discordId, POINT_VALUES[PointSource.GACHA_SSR]);

        const announcement = new EmbedBuilder()
          .setTitle('🌟 SSR PULL!')
          .setDescription(`<@${discordId}> pulled **${ssr.card.name}**!`)
          .setColor(0xFFD700)
          .setThumbnail(ssr.card.imageUrl)
          .setFooter({ text: ssr.isNew ? 'First time pull!' : 'Duplicate' });

        await channel.send({ embeds: [announcement] });
      }
    }
  },
};
```

---

### Phase 4: Faction System (Week 3-4)

#### Task 4.1: Faction Join Command
**Duration:** 30 minutes
**Outcome:** `/faction join [name]` with role assignment

**Steps:**
1. Create `/faction join` with faction choices
2. Prevent joining if already in faction
3. Assign faction role
4. Track in database

**Acceptance Criteria:**
- Can only join one faction
- Role assigned on join
- Database updated

#### Task 4.2: Faction War Tracking
**Duration:** 45 minutes
**Outcome:** Weekly war score aggregation

**Steps:**
1. Create FactionWar record each Monday
2. Track faction scores from user activities
3. Create `/faction war` status command
4. Announce winner each Sunday

---

### Phase 5: Scheduled Features (Week 4)

#### Task 5.1: Daily Role Reconciliation
**Duration:** 45 minutes
**Outcome:** Job that syncs Discord roles with point tiers

**Steps:**
1. Query all users with their current points
2. Determine correct tier for each user
3. Compare with Discord roles
4. Queue role additions/removals
5. Process queue respecting rate limits

**Acceptance Criteria:**
- Runs daily at 4 AM UTC
- Respects ~1000 role edits/day limit
- Logs all changes
- Handles Discord API errors

```typescript
// src/jobs/sync-roles.job.ts
import { Client, GuildMember } from 'discord.js';
import { prisma } from '../services/database';
import { DEVOTION_TIERS } from '../modules/devotion/devotion.types';
import { getTierRoleIds } from '../modules/setup/setup.service';
import { logger } from '../services/logger';
import { env } from '../config/env';

const MAX_ROLE_UPDATES_PER_DAY = 900; // Leave buffer under 1000 limit
const DELAY_BETWEEN_UPDATES_MS = 100; // Rate limit safety

export async function syncRolesJob(client: Client): Promise<void> {
  logger.info('Starting daily role sync');

  const guild = await client.guilds.fetch(env.DISCORD_GUILD_ID);

  // Get tier role IDs from database (created by /admin setup)
  const tierRoleMap = await getTierRoleIds(guild.id);

  if (tierRoleMap.size === 0) {
    logger.error('No tier roles found! Run /admin setup first.');
    return;
  }

  // Get all users with their points
  const users = await prisma.user.findMany({
    select: { discordId: true, devotionPoints: true },
  });

  let updatesPerformed = 0;
  const errors: Array<{ discordId: string; error: string }> = [];

  for (const user of users) {
    if (updatesPerformed >= MAX_ROLE_UPDATES_PER_DAY) {
      logger.warn('Hit daily role update limit, stopping sync');
      break;
    }

    try {
      // Determine correct tier
      const correctTier = DEVOTION_TIERS
        .filter(t => user.devotionPoints >= t.threshold)
        .pop();

      if (!correctTier) continue;

      // Get actual Discord role ID from our database
      const correctRoleId = tierRoleMap.get(correctTier.roleKey);
      if (!correctRoleId) {
        logger.warn({ roleKey: correctTier.roleKey }, 'Role not found in database');
        continue;
      }

      // Get Discord member
      let member: GuildMember;
      try {
        member = await guild.members.fetch(user.discordId);
      } catch {
        // User left server, skip
        continue;
      }

      // Get all tier role IDs from our database
      const allTierRoleIds = Array.from(tierRoleMap.values());

      // Remove incorrect tier roles
      const rolesToRemove = allTierRoleIds.filter(
        roleId => roleId !== correctRoleId && member.roles.cache.has(roleId)
      );

      for (const roleId of rolesToRemove) {
        await member.roles.remove(roleId);
        updatesPerformed++;
        await sleep(DELAY_BETWEEN_UPDATES_MS);
      }

      // Add correct tier role if missing
      if (!member.roles.cache.has(correctRoleId)) {
        await member.roles.add(correctRoleId);
        updatesPerformed++;
        await sleep(DELAY_BETWEEN_UPDATES_MS);
      }

    } catch (error) {
      errors.push({ discordId: user.discordId, error: String(error) });
    }
  }

  logger.info({
    updatesPerformed,
    errorCount: errors.length
  }, 'Role sync completed');

  if (errors.length > 0) {
    logger.error({ errors: errors.slice(0, 10) }, 'Role sync errors (first 10)');
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### Task 5.2: Headpat Roulette
**Duration:** 45 minutes
**Outcome:** Daily random selection with role reward

**Steps:**
1. Create `/headpat enter` command
2. Store entries in EventEntry table
3. Create selection job at 9 PM UTC
4. Assign 24-hour role to winner
5. Create cleanup job to remove role after 24h

---

### Phase 6: Ika Messages & Polish (Week 5)

#### Task 6.1: Scheduled Ika Messages
**Duration:** 30 minutes
**Outcome:** Configurable scheduled posts

**Steps:**
1. Seed ScheduledMessage table with Ika's messages
2. Create cron job that checks for due messages
3. Support timezone-aware scheduling
4. Track last sent to prevent duplicates

#### Task 6.2: Milestone Announcements
**Duration:** 30 minutes
**Outcome:** Auto-announce when pre-reg milestones hit

**Steps:**
1. Create webhook/API endpoint for pre-reg count updates
2. Check milestones on each update
3. Announce in dedicated channel
4. Mark milestone as reached

---

## Test Cases

### Devotion Point Tests

```typescript
// tests/unit/devotion.service.test.ts

describe('DevotionService', () => {
  describe('message point tracking', () => {
    it('should increment points by 1 per message', async () => {
      // Given: User with 0 pending points
      // When: Message event fires
      // Then: Redis counter shows 1
    });

    it('should cap at 100 messages per day', async () => {
      // Given: User with 99 messages today
      // When: Two more messages sent
      // Then: Only 1 point added (cap at 100)
    });

    it('should reset daily cap at midnight UTC', async () => {
      // Given: User hit cap yesterday
      // When: New day begins
      // Then: User can earn points again
    });
  });

  describe('point persistence', () => {
    it('should batch persist Redis points to PostgreSQL', async () => {
      // Given: 5 users with pending points in Redis
      // When: Persist job runs
      // Then: All users updated in PostgreSQL
      // And: Redis counters cleared
    });

    it('should not clear Redis on partial failure', async () => {
      // Given: Database connection fails mid-transaction
      // When: Persist job runs
      // Then: Redis counters preserved for retry
    });
  });
});
```

### Gacha Tests

```typescript
// tests/unit/gacha.service.test.ts

describe('GachaService', () => {
  describe('pull rates', () => {
    it('should respect rarity distribution over 10000 pulls', async () => {
      // Given: Banner with 70/20/8/2 rates
      // When: 10000 pulls executed
      // Then: Distribution within 5% of expected
    });

    it('should boost rate-up cards by 50%', async () => {
      // Given: Banner with 1 rate-up SSR, 3 non-rate-up SSR
      // When: 1000 SSR pulls
      // Then: Rate-up card appears ~50% of time
    });
  });

  describe('collection tracking', () => {
    it('should mark new cards as isNew=true', async () => {
      // Given: User with empty collection
      // When: Pull returns card
      // Then: isNew=true
    });

    it('should mark duplicates as isDuplicate=true', async () => {
      // Given: User already owns card
      // When: Pull returns same card
      // Then: isDuplicate=true, isNew=false
    });
  });
});
```

### Rate Limit Tests

```typescript
// tests/integration/rate-limits.test.ts

describe('Rate Limit Handling', () => {
  it('should respect 50 req/sec global limit', async () => {
    // Given: 100 rapid API calls queued
    // When: Executed with rate limiter
    // Then: No 429 errors received
    // And: Calls complete within expected time
  });

  it('should batch role updates to stay under 1000/day', async () => {
    // Given: 1500 users needing role updates
    // When: Sync job runs
    // Then: Only 900 updates performed
    // And: Job logs warning about hitting limit
  });
});
```

### Setup Tests

```typescript
// tests/integration/setup.test.ts

describe('Server Setup', () => {
  describe('role creation', () => {
    it('should create all tier roles with correct colors', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: 8 tier roles exist with specified colors
      // And: Roles are hoisted appropriately
    });

    it('should create faction roles', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: 3 faction roles exist (Pink Pilled, Dark Devotees, Chaos Agents)
    });

    it('should be idempotent - running twice creates no duplicates', async () => {
      // Given: Server already has bot-created roles
      // When: setupServer() is called again
      // Then: No new roles created (rolesCreated = 0)
      // And: rolesExisted = total role count
    });

    it('should recover from deleted roles', async () => {
      // Given: Bot created role was manually deleted
      // When: setupServer() is called
      // Then: Missing role is recreated
      // And: DiscordResource record is updated
    });
  });

  describe('channel creation', () => {
    it('should create all categories', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: 6 categories exist (WELCOME, IKA'S DOMAIN, etc.)
    });

    it('should create channels in correct categories', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: #gacha-salt is under GAMES & GACHA category
      // And: #vip-lounge is under VIP LOUNGE category
    });

    it('should apply permission overwrites', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: #announcements denies @everyone SendMessages
      // And: #pink-pilled-hq allows faction_pink_pilled ViewChannel
    });

    it('should apply slow mode settings', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: #fan-art has 30 second slow mode
      // And: #memes has 10 second slow mode
    });
  });

  describe('DiscordResource database', () => {
    it('should store all created resource IDs', async () => {
      // Given: Empty Discord server
      // When: setupServer() is called
      // Then: DiscordResource table contains entries for all roles
      // And: DiscordResource table contains entries for all channels
    });

    it('should allow lookup by resource key', async () => {
      // Given: Server with completed setup
      // When: getResourceId(guildId, 'tier_obsessed') is called
      // Then: Returns valid Discord role ID
    });

    it('should return null for unknown keys', async () => {
      // Given: Server with completed setup
      // When: getResourceId(guildId, 'nonexistent_role') is called
      // Then: Returns null
    });
  });
});
```

---

## Environment Variables

```bash
# .env.example

# Discord
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_server_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/infinite_idol

# Redis
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
TZ=UTC

# ============================================
# NOTE: Role and Channel IDs are NOT in .env!
# ============================================
# All roles and channels are created automatically by the bot.
# Run `/admin setup` after inviting the bot to create:
#   - 8 Devotion Tier roles (Casual Enjoyer → Legendary Simp)
#   - 3 Faction roles (Pink Pilled, Dark Devotees, Chaos Agents)
#   - 3 Special roles (Headpat Winner, Pre-Registered, Verified)
#   - 6 Categories with ~20 channels
#
# IDs are stored in the DiscordResource database table and
# retrieved dynamically via getResourceId() / getChannelId().
#
# This allows the bot to be deployed to ANY server without
# manual configuration - just invite and run /admin setup.
```

### Dynamic Resource Lookup

Instead of hardcoded environment variables, use the setup service helpers:

```typescript
// Getting a channel ID dynamically
import { getChannelId } from '../modules/setup/setup.service';

const gachaSaltChannelId = await getChannelId(guild.id, 'channel_gacha_salt');
const ikaSpeaksChannelId = await getChannelId(guild.id, 'channel_ika_speaks');

// Getting tier role IDs
import { getTierRoleIds } from '../modules/setup/setup.service';

const tierRoles = await getTierRoleIds(guild.id);
const obsessedRoleId = tierRoles.get('tier_obsessed');

// Getting faction role IDs
import { getFactionRoleIds } from '../modules/setup/setup.service';

const factionRoles = await getFactionRoleIds(guild.id);
const pinkPilledRoleId = factionRoles.get('faction_pink_pilled');
```

---

## Commands Reference

```bash
# Development
npm run dev              # Start with hot reload (ts-node-dev)
npm run build            # Compile TypeScript
npm start                # Run compiled JS

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations (production)
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed initial data

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch       # Watch mode

# Docker (local development)
docker-compose up -d     # Start Postgres + Redis
docker-compose down      # Stop containers
docker-compose logs -f   # View logs

# Discord Commands (register on first run)
npm run commands:deploy  # Force re-register slash commands
```

---

## Deployment Checklist

- [ ] All environment variables set (only 6 required - see above)
- [ ] Database migrations applied (`npx prisma db push`)
- [ ] Redis accessible from bot host
- [ ] Discord bot invited with these permissions:
  - Manage Roles
  - Manage Channels
  - Send Messages
  - Embed Links
  - Use Application Commands
  - Manage Messages (for cleanup)
- [ ] Run `/admin setup` to create roles/channels automatically
- [ ] Verify all roles created with correct colors/hierarchy
- [ ] Verify all channels created in correct categories
- [ ] Verify permission overwrites applied correctly
- [ ] Slash commands registered (automatic on first startup)
- [ ] Scheduled jobs enabled
- [ ] Error logging configured (Sentry/similar)
- [ ] Monitoring set up (uptime checks)

### Required Bot Permissions Integer

When generating the bot invite URL, use permission integer: `268462096`

This includes:
- `MANAGE_ROLES` (268435456)
- `MANAGE_CHANNELS` (16)
- `SEND_MESSAGES` (2048)
- `EMBED_LINKS` (16384)
- `MANAGE_MESSAGES` (8192)

**OAuth2 Scopes Required:**
- `bot` - Required for all bot functionality
- `applications.commands` - Required for slash commands (this is a SCOPE, not a permission)

**Invite URL Format:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268462096&scope=bot%20applications.commands
```

---

## Known Pitfalls

1. **Don't use `member.roles.add()` in loops** - Batch role changes or hit rate limits
2. **Don't query database per message** - Use Redis counters, batch persist
3. **Don't trust `interaction.reply()` for long operations** - Use `deferReply()` + `editReply()`
4. **Don't store Discord snowflakes as integers** - JavaScript can't handle them, use strings
5. **Don't assume guild members are cached** - Use `guild.members.fetch()` with error handling
6. **Don't forget to handle Discord API errors** - 429, 403, 50013 are common

---

## References

- [Discord.js Documentation](https://discord.js.org/)
- [Discord API Rate Limits](https://discord.com/developers/docs/topics/rate-limits)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Original PRD](./discord-preregistration-experience.md)
- [Engineering Review](./discord-prd-engineering-review.md)

---

**END OF IMPLEMENTATION SPECIFICATION**
