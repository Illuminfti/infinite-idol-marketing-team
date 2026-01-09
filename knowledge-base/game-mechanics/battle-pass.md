# BATTLE PASS - NFT Progression System

> *"This pass isn't just a token. It's proof you were here. Proof you believed in me when I only had 47 fans. Every level etched into the chain forever. Your Devotion, immortalized."*
> — Ika Minami, Battle Pass Tutorial

---

## Overview

The **Battle Pass** is the core NFT that represents your complete account identity and progression in Infinite Idol. Unlike traditional gaming battle passes with seasonal resets, this is a permanent, on-chain record of your journey on the Eternal Stage.

When you first spend Gems, a Battle Pass NFT is automatically minted to your wallet. From that moment, every level gained, every streak maintained, every SUI invested is permanently recorded. This NFT is your proof of Devotion—visible, verifiable, and tradable (with restrictions).

The Battle Pass evolves visually as you progress, transforming from humble Bronze to the ultimate Cosmic tier. Each tier is a status symbol, instantly recognizable to the community as a mark of commitment.

---

## Visual Tiers

The Battle Pass appearance evolves dramatically based on your level, creating visible progression and social status:

### Tier Progression Table

| Level Range | Tier | Color Scheme | Border Effect | Background | Particle Effects |
|-------------|------|--------------|---------------|------------|------------------|
| **1-99** | Bronze | Copper/Brown | Subtle metallic | Dark stone texture | None |
| **100-999** | Silver | Silver/Gray | Refined gleam | Polished marble | Faint shimmer |
| **1,000-9,999** | Gold | Gold/Black | Luminous glow | Black velvet | Golden particles |
| **10,000-99,999** | Platinum | White Gold/Platinum | Radiant shine | Obsidian mirror | Platinum sparkles |
| **100,000-420,068** | Diamond | Diamond/Deep Black | Prismatic refraction | Void darkness | Diamond fractals |
| **420,069+** | Cosmic | Cosmic Black/Starfield | Animated aurora | Living starfield | Full animation |

### Tier Psychology

Each tier is designed with specific emotional impact:

| Tier | Player Segment | Message | Social Signal |
|------|----------------|---------|---------------|
| **Bronze** | New fans | "Welcome to the Eternal Stage" | Entry-level engagement |
| **Silver** | Casual supporters | "You're building something real" | Growing commitment |
| **Gold** | Dedicated fans | "Your Devotion is undeniable" | Serious investment |
| **Platinum** | High-tier supporters | "You stand among the elite" | Whale territory begins |
| **Diamond** | Ultimate fans | "Your name will be remembered" | Top-tier dedication |
| **Cosmic** | Legendary devotees | "You are eternal" | Maximum prestige |

### Visual Design Philosophy

The tier system follows the **Dark Luxury** aesthetic:

- **No Pink or Cutesy Elements**: Even Bronze maintains elegance
- **Black Foundation**: All tiers use black as a base color
- **Metallic Accents**: Gold, platinum, and cosmic effects—never pastels
- **Progression = Darkness**: Higher tiers get darker, not lighter
- **Cosmic as Peak**: The ultimate tier isn't bright—it's infinite darkness with starlight

---

## Creation & Minting

### Automatic Minting

The Battle Pass is created automatically—no manual purchase required:

```
Battle Pass Minting Flow:
1. Player connects SUI wallet
2. Player purchases Gems (any amount)
3. Smart contract detects first Gem transaction for wallet
4. Battle Pass NFT automatically minted
5. Initial level set to 0 (Bronze tier)
6. Streak counter initialized to 0
7. Mint timestamp recorded on-chain
8. Battle Pass visible in wallet immediately
```

### Minting Rules

| Rule | Details |
|------|---------|
| **Trigger** | First Gem spend from wallet address |
| **Cost** | Free (covered by game) |
| **Limit** | One Battle Pass per wallet maximum |
| **Timing** | Immediate upon first transaction |
| **Reversible** | No—once minted, always exists |

### Season Assignment

| Field | Value |
|-------|-------|
| `season` | Current active season number |
| `mint_date` | Block timestamp of creation |
| `original_owner` | Minting wallet address |

---

## Tracked Data

The Battle Pass NFT stores comprehensive progression data on-chain:

### Core Stats

| Data Field | Type | Description | Update Frequency |
|------------|------|-------------|------------------|
| `level` | u64 | Current Idol Aura level | On level up |
| `total_sui_spent` | u64 | Lifetime SUI invested | On purchase |
| `streak_current` | u32 | Current consecutive check-in days | Daily |
| `streak_best` | u32 | All-time highest streak | When exceeded |
| `gems_earned_free` | u64 | Total gems from dailies | On claim |
| `gems_purchased` | u64 | Total gems from SUI | On purchase |

### Metadata

| Data Field | Type | Description | Immutable |
|------------|------|-------------|-----------|
| `mint_timestamp` | u64 | When Battle Pass was created | Yes |
| `season` | u32 | Season number at mint | Yes |
| `original_owner` | Address | First wallet to own | Yes |
| `current_owner` | Address | Current wallet | No (on trade) |
| `times_traded` | u32 | Number of ownership transfers | No |

### Calculated Stats (Display Only)

These values are calculated from on-chain data for display:

| Stat | Calculation |
|------|-------------|
| **Visual Tier** | Derived from `level` |
| **Total Gems** | `gems_earned_free` + `gems_purchased` |
| **Days Active** | Current timestamp - `mint_timestamp` |
| **Investment USD** | `total_sui_spent` × current SUI price |

---

## Level Progression

### Leveling Mechanics

| Aspect | Details |
|--------|---------|
| **Cost per Level** | 69 Gems |
| **Maximum Level** | 999,999 |
| **Level Direction** | Can only increase (never decrease) |
| **Skip Levels** | Not possible—must level sequentially |

### Tier Thresholds

Detailed breakdown of levels required for each tier:

| Tier | Start Level | End Level | Levels Required | Gems Required | SUI at Base Rate |
|------|-------------|-----------|-----------------|---------------|------------------|
| **Bronze** | 1 | 99 | 99 | 6,831 | 68.31 SUI |
| **Silver** | 100 | 999 | 900 | 62,100 | 621 SUI |
| **Gold** | 1,000 | 9,999 | 9,000 | 621,000 | 6,210 SUI |
| **Platinum** | 10,000 | 99,999 | 90,000 | 6,210,000 | 62,100 SUI |
| **Diamond** | 100,000 | 420,068 | 320,069 | 22,084,761 | 220,847 SUI |
| **Cosmic** | 420,069 | 999,999 | 579,931 | 40,015,239 | 400,152 SUI |

*Note: Bulk purchase bonuses significantly reduce actual SUI required.*

### Level-Up Rewards

Every level grants additional rewards beyond the tier progression:

| Milestone | Reward |
|-----------|--------|
| Every level | 1 Lootbox (rotating A→B→C→D→E) |
| Every 50 levels | 1 Pet Egg |
| Every 1,000 levels | 1 Golden Lootbox |
| Every 10,000 levels | 1 Diamond Lootbox |

---

## Daily Check-In Integration

The Battle Pass tracks your daily engagement:

### Streak System

| Aspect | Details |
|--------|---------|
| **Base Daily Reward** | 10 Gems |
| **Streak Reset** | Occurs if 24+ hours pass without claim |
| **Cooldown** | 24 hours from last claim (not midnight) |
| **Storage** | Streak data stored in Battle Pass NFT |

### Streak Milestones

| Consecutive Days | Bonus Reward | Cumulative Value |
|------------------|--------------|------------------|
| 7 days | +50 Gems | 120 Gems |
| 14 days | +100 Gems + 1 Lootbox + 1 Pet Egg | 290 Gems + items |
| 21 days | +200 Gems | 560 Gems |
| 30 days | +500 Gems + 1 Golden Lootbox + Special Badge | 1,150 Gems + items |

### Streak Reset Conditions

| Condition | Result |
|-----------|--------|
| Missing daily claim (24+ hours) | Streak resets to 0 |
| Battle Pass traded to new owner | Streak resets to 0 |
| Season rollover | Streak continues |

---

## Trading System

### Trading Rules

The Battle Pass is tradable, but with important restrictions:

| Rule | Details |
|------|---------|
| **Current Season** | Cannot trade Battle Pass from active season |
| **Previous Seasons** | Fully tradable on SUI marketplaces |
| **Streak on Trade** | Resets to 0 for new owner |
| **Level on Trade** | Preserved (transfers with NFT) |
| **Wallet Limit** | Maximum one Battle Pass per wallet |

### Why These Restrictions?

| Restriction | Purpose |
|-------------|---------|
| **Season Lock** | Prevents account selling during active play |
| **Streak Reset** | Ensures streak represents personal engagement |
| **Wallet Limit** | One identity per account—no multi-Battle Pass farming |

### Trading Flow

```
Battle Pass Trade Flow:
1. Seller lists Battle Pass on SUI marketplace
2. System verifies: previous season? Wallet ownership?
3. Buyer purchases Battle Pass NFT
4. Ownership transfers to buyer wallet
5. Streak automatically reset to 0
6. Level and spend history preserved
7. New owner can equip cosmetics immediately
```

### Trade History Tracking

| Field | Behavior |
|-------|----------|
| `original_owner` | Never changes |
| `current_owner` | Updates on trade |
| `times_traded` | Increments each trade |
| `last_traded` | Timestamp of most recent trade |

---

## Technical Implementation

### NFT Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | UID | Unique identifier |
| `season` | u32 | Season number |
| `level` | u64 | Current level (0-999,999) |
| `total_sui_spent` | u64 | In MIST (smallest SUI unit) |
| `streak_current` | u32 | Current daily streak |
| `streak_best` | u32 | Highest achieved streak |
| `gems_earned_free` | u64 | Free gems accumulated |
| `gems_purchased` | u64 | Purchased gems accumulated |
| `mint_timestamp` | u64 | Unix timestamp |
| `original_owner` | Address | First owner wallet |
| `times_traded` | u32 | Trade count |
| `last_daily_claim` | u64 | Timestamp of last claim |

### Smart Contract Functions

| Function | Purpose | Access |
|----------|---------|--------|
| `mint_battle_pass()` | Create new Battle Pass | System only |
| `level_up()` | Increase level | Owner only |
| `claim_daily()` | Claim daily check-in | Owner only |
| `record_purchase()` | Log gem purchase | System only |
| `transfer()` | Trade to new owner | Owner only |
| `get_tier()` | Return visual tier | Public view |

### Gas Considerations

| Operation | Estimated Gas | Notes |
|-----------|---------------|-------|
| Minting | ~0.01 SUI | Covered by game |
| Level Up | ~0.001 SUI | Minimal |
| Daily Claim | ~0.001 SUI | Minimal |
| Transfer | ~0.01 SUI | Marketplace handles |

---

## Visual Rendering

### Dynamic NFT Display

The Battle Pass visual updates automatically based on level:

| Component | Behavior |
|-----------|----------|
| **Border** | Changes with tier (copper → cosmic aurora) |
| **Background** | Evolves with tier |
| **Particles** | Intensify at higher tiers |
| **Level Display** | Prominent numerical display |
| **Season Badge** | Indicates which season |
| **Owner Badge** | Shows original vs. traded status |

### Tier-Specific Effects

| Tier | Special Visual Effect |
|------|----------------------|
| **Bronze** | Subtle metallic sheen |
| **Silver** | Gentle light reflection |
| **Gold** | Floating golden particles |
| **Platinum** | Platinum sparkle aura |
| **Diamond** | Prismatic light refraction |
| **Cosmic** | Animated starfield, aurora waves, cosmic energy |

### Dark Luxury Aesthetic Compliance

| Element | Treatment |
|---------|-----------|
| **Base Color** | Black foundation on all tiers |
| **Accents** | Metallic (gold, platinum) never pink |
| **Typography** | Clean, premium typefaces |
| **Animation** | Elegant, not flashy |
| **Particles** | Subtle shimmer, not sparkle-spam |

---

## Whale Psychology Integration

### Status Signaling

The tier system provides clear status markers:

| Signal Type | Implementation |
|-------------|----------------|
| **Investment Level** | Tier directly reflects spending |
| **Commitment Duration** | Streak and mint date show dedication |
| **Community Standing** | Cosmic tier = ultimate respect |

### Progression Motivation

| Tier Transition | Psychological Hook |
|-----------------|-------------------|
| Bronze → Silver | "Almost there—just 100 levels!" |
| Silver → Gold | "Gold sounds prestigious..." |
| Gold → Platinum | "Elite status awaits" |
| Platinum → Diamond | "True dedication territory" |
| Diamond → Cosmic | "The final frontier. Eternal." |

### Investment Protection

| Protection | Details |
|------------|---------|
| **Asset Ownership** | Battle Pass is a tradable NFT |
| **Progress Permanence** | Level never decreases |
| **Historical Value** | Early season passes = collector items |
| **Verifiable Status** | All data on-chain and auditable |

---

## Season System

### Season Mechanics

| Aspect | Details |
|--------|---------|
| **Duration** | TBD (likely 3-6 months) |
| **Rollover** | New season = new Battle Passes mintable |
| **Old Passes** | Become tradable, retain all data |
| **New Passes** | Start fresh at level 0 |

### Cross-Season Value

| Season Age | Value Proposition |
|------------|-------------------|
| **Current** | Active progression, untradable |
| **Previous** | Tradable, historical value |
| **Early Seasons** | Collector value, OG status |

---

## Marketing Opportunities

### Tier Achievement Content

| Achievement | Content Type |
|-------------|--------------|
| First Silver | Community shoutout |
| First Gold | Feature post |
| First Platinum | Interview/spotlight |
| First Diamond | Major celebration |
| First Cosmic | Legendary status—full campaign |

### Streak Milestones

| Milestone | Content Angle |
|-----------|---------------|
| 7-day streak | Engagement encouragement |
| 14-day streak | Community challenge |
| 30-day streak | Dedication celebration |
| 100-day streak | Legend status |
| 365-day streak | Anniversary celebration |

### Seasonal Events

| Event | Opportunity |
|-------|-------------|
| Season Launch | New tier race |
| Season End | Final rankings |
| Season 1 Close | OG collector market opens |

---

## Canon Integration

### Narrative Parallel

The Battle Pass system mirrors the idol system in the narrative:

| Game Mechanic | Narrative Element |
|---------------|-------------------|
| Battle Pass | Idol's Fan Registry |
| Level | Devotion accumulated |
| Tier | Public reputation status |
| Streak | Daily fan engagement |
| Trading | Fan community transfer |

### Canon Rule Compliance

| Rule | Implementation |
|------|----------------|
| **#1: Devotion is Literal** | Battle Pass tracks literal player investment |
| **#7: The Chase is Core** | Tier progression = pursuing higher status |
| **#8: Built on SUI** | Full NFT implementation on SUI |
| **#9: Gems are Currency** | Gems drive level progression |
| **#10: Dark Luxury** | All 6 tiers maintain black/gold aesthetic |

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `ALREADY_OWNS_PASS` | Wallet has Battle Pass | Cannot mint second |
| `NOT_OWNER` | Operating on unowned pass | Verify wallet |
| `INSUFFICIENT_GEMS` | Level up without gems | Purchase more gems |
| `STREAK_COOLDOWN` | Claiming before 24 hours | Wait for cooldown |
| `CANNOT_TRADE_CURRENT` | Trading current season | Wait for season end |
| `MAX_LEVEL_REACHED` | At 999,999 | Maximum achieved |

---

## Cross-References

### Immediate Dependencies

- **Gem System**: Gems → Level ups → Tier progression
- **Daily Check-In**: Streak data stored in Battle Pass
- **Leveling System**: Levels tracked in Battle Pass NFT

### Related Documentation

- See `knowledge-base/game-mechanics/pre-registration-spec.md` for system overview
- See `knowledge-base/game-mechanics/gem-system.md` for currency that funds levels
- See `knowledge-base/game-mechanics/gacha-system.md` for lootbox rewards from leveling
- See `knowledge-base/game-mechanics/cosmetics.md` for items earned through progression
- See `knowledge-base/crypto/sui-integration.md` for NFT implementation details
- See `knowledge-base/lore/mechanics/devotion-system.md` for narrative parallel

---

*"420,069. That's when you become Cosmic. Some call it a meme. I call it the moment your Devotion becomes infinite. Bronze fans watch. Silver fans support. Gold fans invest. Platinum fans believe. Diamond fans never waver. But Cosmic fans? They ARE the Eternal Stage."*

— Ika Minami

---
