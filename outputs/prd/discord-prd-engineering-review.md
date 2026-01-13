# Engineering Review: IKA'S SIMP WARS PRD

> **Reviewer:** Senior Engineer Perspective
> **Date:** 2026-01-13
> **Status:** Technical Feasibility Audit
> **Verdict:** Mostly Feasible with Significant Caveats

---

## Executive Summary

The PRD v2 is creative and culturally on-point, but demonstrates a **product-first, engineering-later** mentality that will cause problems in implementation. Several proposed features either misunderstand Discord's technical limitations or underestimate the complexity of building them at scale.

**Overall Assessment:** 70% of this is buildable. 30% needs redesign or scoping down.

---

## Discord Platform Constraints (Reality Check)

### Hard Limits You Can't Ignore

| Resource | Limit | PRD Assumption | Status |
|----------|-------|----------------|--------|
| **Roles per server** | 250 | ~15-20 roles proposed | ✅ Fine |
| **Channels per server** | 500 | ~30 channels proposed | ✅ Fine |
| **Members per server** | 250,000 (can request increase) | 25,000-50,000 target | ✅ Fine |
| **Categories per server** | 50 | 6 proposed | ✅ Fine |
| **Slash commands per bot** | 50 | Not specified | ⚠️ Need to budget |
| **API rate limit (global)** | 50 req/sec | Unaddressed | ❌ Critical issue |
| **Role edits** | ~1000/24hr | High-frequency role changes proposed | ⚠️ Risk |
| **Message length** | 2000 chars | Long Ika messages proposed | ⚠️ Need to chunk |
| **Webhook rate** | 5 req/2 sec per webhook | Unaddressed | ⚠️ Affects scheduled messages |

### Rate Limiting: The Silent Killer

The PRD proposes:
- Points tracking per message (1 point/message, cap 100/day)
- Real-time leaderboard updates
- Automatic role assignment based on point thresholds
- Bot responses to gacha pulls
- Daily scheduled messages across multiple channels

**Problem:** At 25,000 members with 15,000+ messages/day, tracking each message and updating user points will generate **thousands of database writes and potential API calls per minute**.

**The Math:**
- 15,000 messages/day = 625 messages/hour = ~10 messages/minute average
- Peak hours could see 50-100+ messages/minute
- Each message triggers: point calculation, DB write, threshold check, potential role update
- Role updates are rate-limited to ~1000/24hr

**At scale, you will hit rate limits within hours of launch.**

---

## Feature-by-Feature Technical Audit

### 1. Devotion Points System

**PRD Spec:**
> "Message activity: 1/message, Cap: 100/day"

**Engineering Reality:**

| Issue | Severity | Details |
|-------|----------|---------|
| Per-message tracking | HIGH | Cannot make API calls per message at scale |
| Real-time point display | MEDIUM | Expensive to compute on-demand |
| Role auto-assignment | HIGH | Role edit rate limits (~1000/day) |

**Recommendation:**
- **Batch processing**: Aggregate message counts every 5-15 minutes, not per-message
- **Async role updates**: Queue role changes, process in batches respecting rate limits
- **Cache leaderboards**: Pre-compute, don't calculate on-demand
- **Daily role reconciliation**: Update roles once per day, not in real-time

**Revised Architecture:**
```
Message Event → Increment counter in Redis (no API call)
Every 5 min → Batch write counters to DB
Every 1 hour → Recalculate leaderboards
Every 24 hours → Reconcile roles against point thresholds
```

### 2. Gacha Simulator

**PRD Spec:**
> "10K+ gacha pulls/day"
> "Pull results posted publicly in #gacha-salt"
> "Bot roasts bad pulls automatically"

**Engineering Reality:**

| Issue | Severity | Details |
|-------|----------|---------|
| 10K messages/day to one channel | HIGH | Will trigger rate limits, spam filters |
| Automated responses per pull | HIGH | 10K bot responses = rate limit death |
| Collection tracking | MEDIUM | DB design needs thought |

**The Problem:** If every pull posts to #gacha-salt AND the bot responds with a roast, you're looking at 20K+ bot messages per day to a single channel. Discord will:
1. Rate limit your bot
2. Potentially flag the channel for spam
3. Make the channel unusable due to message velocity

**Recommendation:**
- **Pull results via ephemeral responses**: Use Discord's ephemeral messages (only visible to user) for most pulls
- **Public posts for SSR only**: Only announce rare pulls to #gacha-salt
- **Batch roasts**: Aggregate "today's worst luck" posts rather than per-pull roasts
- **Use embeds wisely**: Rich embeds look better but count toward rate limits same as messages

**Revised Flow:**
```
User: /gacha pull 10
Bot: [Ephemeral] Your pulls: C, C, R, C, C, C, C, C, R, C (no SSR, rip)
     [Public in #gacha-salt only if SSR]: 🎉 @User pulled SSR Dark Mode Ika!
```

### 3. Faction System & Wars

**PRD Spec:**
> "Players choose a faction on join"
> "Factions compete weekly"

**Engineering Reality:**

| Issue | Severity | Details |
|-------|----------|---------|
| Faction role assignment | LOW | 3 roles, manageable |
| Faction score tracking | MEDIUM | Need aggregation logic |
| Cross-faction permissions | LOW | Standard Discord permissions |

**This is actually well-designed.** Three faction roles is fine. Weekly competitions with manual/semi-manual scoring is feasible.

**Recommendations:**
- Use role-based channel permissions (native Discord feature)
- Store faction membership in DB, role is just UI
- Aggregate scores server-side, display via bot command

✅ **Feasible as designed**

### 4. Headpat Roulette

**PRD Spec:**
> "Join pool by reacting to daily message"
> "One winner selected randomly"
> "Winner gets special role for 24 hours"

**Engineering Reality:**

| Issue | Severity | Details |
|-------|----------|---------|
| Reaction tracking | MEDIUM | Discord's reaction API has limits |
| Random selection | LOW | Trivial |
| 24-hour role | MEDIUM | Need scheduled task to remove |

**Reaction Limits:**
- Bots can fetch reactions, but large numbers (1000+) require pagination
- At 25K members, if 10% react, that's 2,500 reactions to process
- Reaction fetch is paginated at 100 per request = 25 API calls minimum

**Recommendation:**
- Use a button or slash command instead of reactions for scale
- `/headpat enter` is cleaner than reaction-based
- Store entrants in DB, not via Discord API
- Use scheduled tasks (cron) to select winner and remove role after 24hr

**Revised Flow:**
```
9 PM: Bot posts "Headpat Roulette is OPEN! /headpat enter to join"
Users: /headpat enter (bot responds ephemerally: "You're in!")
9:30 PM: Bot runs selection from DB entries
Bot: "@Winner got today's headpat! 💜" + assigns role
Next day 9:30 PM: Scheduled job removes role, new roulette begins
```

### 5. Simp Speedrun Challenges

**PRD Spec:**
> "First to react to Ika's daily post - Instant"
> "Most creative compliment in 60 seconds"

**Engineering Reality:**

| Issue | Severity | Details |
|-------|----------|---------|
| "First to react" tracking | HIGH | Race conditions, API latency |
| 60-second challenges | MEDIUM | Timing accuracy matters |
| Judging "creative" | N/A | Requires human moderation |

**"First Simp" Problem:**
Discord's event system has latency. Two users reacting within 100ms may appear in different order depending on:
- Their network latency to Discord
- Discord's internal processing
- Your bot's event receipt timing

You cannot guarantee fairness for "first to react" competitions at scale.

**Recommendation:**
- Change to "first 10 to react get points" instead of single winner
- Or use slash commands with timestamps from your server
- 60-second challenges: Use bot timer, but expect ~1-2 second accuracy variance

### 6. Leaderboard System

**PRD Spec:**
> "Public leaderboard updated daily"

**This is correct!** Daily updates are sensible.

**But also:**
> "Leaderboard movement - Daily changes"

**Implementation:**
- Store all point data in your database, NOT in Discord
- Generate leaderboard images/embeds on schedule
- Cache results, don't compute on every `/leaderboard` command
- Consider pagination for large leaderboards

✅ **Feasible as designed**

### 7. Cosplay Closet (Outfit Voting)

**PRD Spec:**
> "Three options presented, community votes, winning outfit revealed"

**Engineering Reality:**

Discord has **native poll support** now! Use it.

**Recommendation:**
- Use Discord's built-in poll feature (added 2024)
- Polls support up to 10 options
- Native vote counting, no bot overhead
- Results visible in real-time

✅ **Feasible - Use native polls**

### 8. Channel Structure

**PRD proposes ~30 channels across 6 categories**

✅ **Well within limits (500 channels, 50 categories)**

**Minor recommendations:**
- VIP channels gated by roles: Standard Discord permissions
- Consider thread-heavy approach for some high-volume channels
- Threads have 1,000 active limit but auto-archive helps

---

## Bot Architecture Review

### PRD Proposes 5 Separate Bots

| Bot | PRD Function |
|-----|--------------|
| IkaBot | Personality, scheduled messages |
| GachaBot | Gacha system |
| DevotionBot | Points, leaderboards, roles |
| FactionBot | War tracking |
| EventBot | Daily challenges, timers |

### Why This Is Wrong

**Problem:** This is over-engineering that creates operational complexity without benefit.

**Reality:**
- Each bot shares the same rate limits per-guild
- 5 bots = 5x the maintenance, 5x the failure points
- Most Discord bot frameworks handle this in a single codebase with modules

**Recommendation: One Bot, Multiple Modules**

```
InfiniteIdolBot/
├── modules/
│   ├── ika_personality.py      # Scheduled messages, voice lines
│   ├── gacha.py                # Pull simulation, collection
│   ├── devotion.py             # Points tracking, leaderboards
│   ├── factions.py             # Faction management, wars
│   ├── events.py               # Challenges, roulette
│   └── admin.py                # Moderation, management
├── services/
│   ├── database.py             # PostgreSQL/MongoDB connection
│   ├── cache.py                # Redis for counters/leaderboards
│   └── scheduler.py            # Scheduled tasks (APScheduler)
└── main.py
```

**Benefits:**
- Single deployment
- Shared database connection
- Shared rate limit handling
- Easier debugging
- Lower hosting costs

---

## Database Design Considerations

The PRD doesn't specify data architecture. Here's what you need:

### Core Entities

```sql
-- Users (linked to Discord)
users (
    id SERIAL PRIMARY KEY,
    discord_id BIGINT UNIQUE NOT NULL,
    faction_id INT REFERENCES factions(id),
    devotion_points INT DEFAULT 0,
    daily_messages_today INT DEFAULT 0,
    last_daily_reset TIMESTAMP,
    pre_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
)

-- Gacha Collections
gacha_inventory (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    card_id VARCHAR(50) NOT NULL,  -- e.g., "ika_swimsuit_ssr"
    obtained_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, card_id)  -- Or allow dupes if that's the design
)

-- Faction Scores (per-week)
faction_scores (
    id SERIAL PRIMARY KEY,
    faction_id INT REFERENCES factions(id),
    week_number INT NOT NULL,
    score INT DEFAULT 0,
    UNIQUE(faction_id, week_number)
)

-- Event Entries (for roulette, etc.)
event_entries (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    user_id INT REFERENCES users(id),
    entered_at TIMESTAMP DEFAULT NOW()
)
```

### Caching Layer (Redis)

```
# Real-time counters (batch to DB periodically)
user:{discord_id}:messages_today = 47
user:{discord_id}:points_pending = 47

# Leaderboard cache
leaderboard:overall = [sorted set of user_ids by points]
leaderboard:faction:pink_pilled = [sorted set]

# Rate limit tracking
ratelimit:role_updates_today = 847
```

---

## Critical Missing Pieces

### 1. Discord ↔ Pre-Registration Verification

**PRD mentions:**
> "User verification: Link Discord ↔ pre-reg account"

**But doesn't specify how.** This is actually complex:

**Option A: OAuth Flow**
- User visits your website
- "Connect Discord" button triggers OAuth
- You get their Discord ID, link to pre-reg account
- Bot can now verify them in Discord

**Option B: Verification Code**
- User pre-registers, gets unique code
- User runs `/verify CODE` in Discord
- Bot validates code against pre-reg database

**Option C: Wallet Signature**
- User connects wallet to Discord bot
- Bot verifies wallet matches pre-reg wallet
- More crypto-native but higher friction

**Recommendation:** Option A or B. Option C is overkill for a pre-reg campaign.

### 2. Scheduled Message Delivery

**PRD assumes:**
> "9 AM: Ika morning greeting"
> "9 PM: Headpat Roulette"

**Implementation needed:**
- Scheduler (APScheduler, Celery, or cron)
- Timezone handling (what timezone is "9 AM"?)
- Failure recovery (what if bot is down at 9 AM?)
- Message variation (don't post same message daily)

### 3. Moderation at Scale

**PRD mentions:**
> "#fan-fic — (controversial, monitored)"
> "Sunday: Minimal moderation, chaos encouraged"

**But with 25K members:**
- You need AutoMod rules configured
- You need human moderators (volunteers or paid)
- You need escalation procedures
- "Chaos encouraged" can become "harassment enabled" fast

**Recommendation:**
- Set up Discord AutoMod from day one
- Recruit 5-10 volunteer mods before launch
- Define "chaos" boundaries explicitly
- Have a crisis response plan

---

## Revised Technical Requirements

### Minimum Viable Implementation

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Bot** | discord.py or discord.js | Single bot, modular architecture |
| **Database** | PostgreSQL | User data, collections, scores |
| **Cache** | Redis | Counters, leaderboards, rate tracking |
| **Scheduler** | APScheduler / node-cron | Timed events, role reconciliation |
| **Backend API** | FastAPI / Express | Pre-reg verification, admin tools |
| **Hosting** | Railway / Render / VPS | Bot + DB + Redis |

### Estimated Development Time

| Feature | Complexity | Estimate |
|---------|------------|----------|
| Core bot framework | Medium | 1 week |
| Points system (batched) | Medium | 3-4 days |
| Gacha simulator | Medium | 4-5 days |
| Faction system | Low | 2 days |
| Leaderboards | Medium | 2-3 days |
| Scheduled messages | Low | 1-2 days |
| Headpat roulette | Low | 1 day |
| Voting/polls | Low | 1 day (use native) |
| Pre-reg verification | Medium | 2-3 days |
| Testing & polish | High | 1 week |
| **Total** | | **4-5 weeks** |

**Note:** This assumes an experienced Discord bot developer. Double the estimate for someone learning as they go.

---

## Summary: What to Fix

### Critical (Must Fix)

| Issue | Fix |
|-------|-----|
| Per-message point tracking | Batch to every 5-15 minutes |
| 5 separate bots | Consolidate to 1 modular bot |
| Gacha spam to channel | Use ephemeral messages, public only for SSR |
| Role updates | Daily reconciliation, not real-time |
| "First Simp" race condition | Change to "first 10" or use timestamps |

### Important (Should Fix)

| Issue | Fix |
|-------|-----|
| No verification flow specified | Define OAuth or code-based linking |
| No DB architecture | Design schema before implementation |
| Reaction-based roulette | Use slash commands for scale |
| No moderation plan | Define before launch |

### Nice to Have (Can Defer)

| Issue | Fix |
|-------|-----|
| 5 leaderboard categories | Start with 1-2, expand later |
| Daily content schedule | Start with 2-3 touchpoints, not 7 |
| Complex faction war scoring | Start with simple weekly totals |

---

## Conclusion

The PRD is strong on product vision but weak on technical reality. The core ideas are sound and buildable, but the implementation details assume Discord is more flexible than it actually is.

**Recommended next steps:**
1. Hire/assign an experienced Discord bot developer
2. Build a technical design doc addressing rate limits
3. Prototype the points system in isolation first
4. Start with MVP (points + gacha + factions) before adding roulette/speedruns
5. Plan for 10K members first, scale to 25K+ after validation

**The fun parts of this PRD are achievable. The technical parts need work.**

---

## Sources

- [Discord Rate Limits Documentation](https://discord.com/developers/docs/topics/rate-limits)
- [Discord Server Caps and Limits](https://support.discord.com/hc/en-us/articles/33694251638295-Discord-Account-Caps-Server-Caps-and-More)
- [Discord Webhooks Rate Limits](https://birdie0.github.io/discord-webhooks-guide/other/rate_limits.html)
- [Discord Embedded App SDK](https://github.com/discord/embedded-app-sdk)
- [Discord.js Rate Limit Handling](https://deepwiki.com/discordjs/discord.js/5.3-rate-limits-and-api-optimization)
- [Discord Bot Role Automation Best Practices](https://github.com/scba6/Discord-Role-Assignment-Bot)

---

**END OF ENGINEERING REVIEW**
