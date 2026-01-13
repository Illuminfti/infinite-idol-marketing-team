# IKA'S SIMP WARS — Implementation Specification

> **Document Type:** Claude Code Implementation-Ready Specification
> **Version:** 3.0 (Engineering-Reviewed, Claude-Optimized)
> **Last Updated:** 2026-01-13

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

**Key Constraint:** All features must respect Discord's rate limits (50 req/sec global, ~1000 role edits/day).

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
│   │   ├── gacha/
│   │   │   ├── gacha.service.ts    # Pull logic, rates, collection
│   │   │   ├── gacha.types.ts      # Card types, rarity enums
│   │   │   └── banners.ts          # Banner definitions
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

model ScheduledMessage {
  id          Int      @id @default(autoincrement())

  messageKey  String   @unique @db.VarChar(50)  // "morning_greeting", "late_night"
  channelId   String   @db.VarChar(20)

  content     String   @db.Text
  cronPattern String   @db.VarChar(50)  // "0 9 * * *" = 9 AM daily
  timezone    String   @db.VarChar(50)  // "UTC"

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
}

export interface PullResult {
  card: GachaCardDefinition;
  isNew: boolean;       // First time pulling this card
  isDuplicate: boolean; // Already owned
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
  roleId: string;
  perks: string[];
}

export const DEVOTION_TIERS: DevotionTier[] = [
  { name: 'Casual Enjoyer', threshold: 100, roleId: '', perks: ['Basic access'] },
  { name: 'Interested Party', threshold: 500, roleId: '', perks: ['#fan-art access'] },
  { name: 'Registered Simp', threshold: 1000, roleId: '', perks: ['Full game access'] },
  { name: 'Dedicated Devotee', threshold: 2500, roleId: '', perks: ['VIP channel access'] },
  { name: 'Obsessed', threshold: 5000, roleId: '', perks: ['Ika notice priority'] },
  { name: 'Down Bad', threshold: 10000, roleId: '', perks: ['Direct Ika message'] },
  { name: 'Terminal Simp', threshold: 25000, roleId: '', perks: ['Name in credits'] },
  { name: 'Legendary Simp', threshold: 50000, roleId: '', perks: ['Custom role'] },
];
```

```typescript
// src/modules/faction/faction.types.ts

export enum Faction {
  PINK_PILLED = 'PINK_PILLED',
  DARK_DEVOTEES = 'DARK_DEVOTEES',
  CHAOS_AGENTS = 'CHAOS_AGENTS',
}

export const FACTION_INFO: Record<Faction, {
  name: string;
  emoji: string;
  roleId: string;
  channelId: string;
  color: number;  // Discord color int
  description: string;
}> = {
  [Faction.PINK_PILLED]: {
    name: 'Pink Pilled',
    emoji: '🌸',
    roleId: '',  // Set in config
    channelId: '',
    color: 0xFF69B4,
    description: 'Pure devotion, wholesome energy. Ika can do no wrong.',
  },
  [Faction.DARK_DEVOTEES]: {
    name: 'Dark Devotees',
    emoji: '🖤',
    roleId: '',
    channelId: '',
    color: 0x2F3136,
    description: 'Obsessive, competitive, ruthless. If I can\'t have her attention, NO ONE CAN.',
  },
  [Faction.CHAOS_AGENTS]: {
    name: 'Chaos Agents',
    emoji: '⚡',
    roleId: '',
    channelId: '',
    color: 0xFFD700,
    description: 'Chaotic neutral, shitposters. We\'re just here for the content.',
  },
};
```

---

## Implementation Tasks

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
**Outcome:** `/leaderboard` with cached results

**Steps:**
1. Create leaderboard cache job (hourly rebuild)
2. Store top 100 in Redis sorted set
3. Create `/leaderboard` command reading from cache
4. Support category filter (overall, faction, gacha)

**Acceptance Criteria:**
- Leaderboard loads from cache, not DB query
- Shows top 10 with user's rank if not in top 10
- Faction filter shows only faction members

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
import { prisma } from '../../services/database';
import { Rarity, GachaCardDefinition, BannerDefinition, PullResult } from './gacha.types';
import { CARDS } from './cards';
import { getCurrentBanner } from './banners';

export async function pull(discordId: string, count: number = 1): Promise<PullResult[]> {
  const banner = getCurrentBanner();
  const results: PullResult[] = [];

  // Get user's existing cards
  const existingCards = await prisma.gachaCard.findMany({
    where: { user: { discordId } },
    select: { cardId: true },
  });
  const ownedCardIds = new Set(existingCards.map(c => c.cardId));

  for (let i = 0; i < count; i++) {
    const rarity = rollRarity(banner.rates);
    const card = rollCard(banner, rarity);
    const isNew = !ownedCardIds.has(card.id);

    results.push({
      card,
      isNew,
      isDuplicate: !isNew,
    });

    // Add to owned set for subsequent pulls in batch
    ownedCardIds.add(card.id);
  }

  // Persist new cards to database
  const newCards = results.filter(r => r.isNew);
  if (newCards.length > 0) {
    const user = await prisma.user.upsert({
      where: { discordId },
      create: { discordId },
      update: {},
    });

    await prisma.gachaCard.createMany({
      data: newCards.map(r => ({
        userId: user.id,
        cardId: r.card.id,
        rarity: r.card.rarity,
      })),
      skipDuplicates: true,
    });
  }

  return results;
}

function rollRarity(rates: BannerDefinition['rates']): Rarity {
  const roll = Math.random();
  let cumulative = 0;

  for (const [rarity, rate] of Object.entries(rates)) {
    cumulative += rate;
    if (roll < cumulative) return rarity as Rarity;
  }

  return Rarity.COMMON; // Fallback
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
import { logger } from '../services/logger';
import { env } from '../config/env';

const MAX_ROLE_UPDATES_PER_DAY = 900; // Leave buffer under 1000 limit
const DELAY_BETWEEN_UPDATES_MS = 100; // Rate limit safety

export async function syncRolesJob(client: Client): Promise<void> {
  logger.info('Starting daily role sync');

  const guild = await client.guilds.fetch(env.DISCORD_GUILD_ID);

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

      // Get Discord member
      let member: GuildMember;
      try {
        member = await guild.members.fetch(user.discordId);
      } catch {
        // User left server, skip
        continue;
      }

      // Get all tier role IDs
      const allTierRoleIds = DEVOTION_TIERS
        .map(t => t.roleId)
        .filter(Boolean);

      // Remove incorrect tier roles
      const rolesToRemove = allTierRoleIds.filter(
        roleId => roleId !== correctTier.roleId && member.roles.cache.has(roleId)
      );

      for (const roleId of rolesToRemove) {
        await member.roles.remove(roleId);
        updatesPerformed++;
        await sleep(DELAY_BETWEEN_UPDATES_MS);
      }

      // Add correct tier role if missing
      if (!member.roles.cache.has(correctTier.roleId)) {
        await member.roles.add(correctTier.roleId);
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

---

## Environment Variables

```bash
# .env.example

# Discord
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_server_id

# Channels
GACHA_SALT_CHANNEL_ID=channel_for_ssr_announcements
IKA_SPEAKS_CHANNEL_ID=channel_for_scheduled_messages
ANNOUNCEMENTS_CHANNEL_ID=channel_for_milestones

# Roles (tier roles, faction roles)
ROLE_CASUAL_ENJOYER=role_id
ROLE_INTERESTED_PARTY=role_id
ROLE_REGISTERED_SIMP=role_id
ROLE_DEDICATED_DEVOTEE=role_id
ROLE_OBSESSED=role_id
ROLE_DOWN_BAD=role_id
ROLE_TERMINAL_SIMP=role_id
ROLE_LEGENDARY_SIMP=role_id

ROLE_PINK_PILLED=role_id
ROLE_DARK_DEVOTEES=role_id
ROLE_CHAOS_AGENTS=role_id

ROLE_HEADPAT_WINNER=role_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/infinite_idol

# Redis
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
TZ=UTC
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

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Redis accessible from bot host
- [ ] Discord bot invited with correct permissions
- [ ] Slash commands registered
- [ ] Channel IDs configured
- [ ] Role IDs configured
- [ ] Scheduled jobs enabled
- [ ] Error logging configured (Sentry/similar)
- [ ] Monitoring set up (uptime checks)

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
