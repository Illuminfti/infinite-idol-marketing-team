# BATTLE PASS - NFT Progression System

> *"This pass isn't just a token. It's proof you were here. Proof you believed in me when I had almost nothing. Every level etched into the chain forever. Your Devotion, immortalized."*
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

## Cross-Chain Wallet System (DKG Integration)

The Battle Pass is directly tied to **dWallet** (Distributed Wallet) generation for cross-chain capabilities:

### DKG Requirement for Progression

**Key Milestone**: Reaching certain progression levels **requires** DKG wallet generation:

| Trigger | Requirement | Purpose |
|---------|-------------|---------|
| **Level 50** | DKG wallet generation | Unlock cross-chain features |
| **Level 100** | DKG wallet active | Silver tier access |
| **Level 1,000** | Presign capability enabled | Advanced features |

**Why Tie to Battle Pass:**
- **Progressive onboarding**: Users don't need DKG immediately
- **Value demonstration**: Users understand what they're getting before DKG
- **Security awareness**: Time to learn about distributed keys before using them
- **Feature gating**: Advanced features require cross-chain capabilities

### DKG Generation Flow

**When Level 50 is Reached:**

1. **Frontend Notification**: "Unlock cross-chain capabilities! Generate your dWallet"
2. **User Initiates DKG**: Click "Generate dWallet" button
3. **Backend Submission**: Submit DKG operation to Sui smart contract
4. **IKA Network Processing**: Distributed key generation across network nodes
5. **dWallet Address Created**: New Sui address generated (no exposed private key)
6. **Battle Pass Updated**: `dWallet_address` field populated
7. **Progression Unlocked**: Can now level past 50

**Without DKG**: Users are **soft-locked** at level 50 until they generate dWallet.

### dWallet Features Unlocked

| Feature | Level Requirement | DKG Status | Capability |
|---------|-------------------|------------|------------|
| **Basic Progression** | 1-49 | Not required | Level up, earn lootboxes |
| **Cross-Chain Features** | 50+ | Required | Multi-chain signing |
| **Advanced Gameplay** | 100+ | Required + Active | Future gameplay mechanics |
| **Presign Operations** | 1,000+ | Presign enabled | High-frequency transactions |

### Technical Integration

**Battle Pass NFT Field:**
```move
public struct BattlePass has key, store {
    id: UID,
    level: u64,
    dWallet_address: Option<address>,  // Populated after DKG
    dWallet_generated_at: Option<u64>, // Timestamp
    // ... other fields
}
```

**Level-Up Check:**
```move
public fun level_up(pass: &mut BattlePass) {
    if (pass.level >= 50 && option::is_none(&pass.dWallet_address)) {
        abort E_DKG_REQUIRED  // Cannot level past 50 without DKG
    }
    pass.level = pass.level + 1;
}
```

**Database Tracking:**
```typescript
User {
  id: UUID,
  battlePassId: UUID,
  dWalletAddress: String?,
  dWalletGeneratedAt: DateTime?,
  dWalletStatus: "NOT_GENERATED" | "PENDING" | "COMPLETED" | "FAILED",
}

DWalletGeneration {
  id: UUID,
  userId: UUID,
  battlePassLevel: Int,       // Level when DKG initiated
  status: String,
  dWalletAddress: String?,
  ikaTxHash: String?,         // IKA network transaction
  createdAt: DateTime,
  completedAt: DateTime?,
}
```

### User Experience

**Level 49 → 50 Transition:**
- **Before DKG**: "Level up to 50! (dWallet generation required)"
- **Button State**: "Generate dWallet" (highlighted, glowing)
- **After Click**: Processing animation (30-60 seconds typical)
- **On Success**: "dWallet generated! Cross-chain features unlocked!"
- **Level 50 Complete**: Continue normal progression

**Messaging:**
> *"You've reached level 50. Your Devotion has earned you cross-chain capabilities. Generate your distributed wallet to continue The Chase across all blockchains."*

---

## Daily Check-In Integration

The Battle Pass tracks daily check-in streaks, directly impacting progression and rewards:

### Daily Check-In Mechanics

**Core Concept**: Sign a message daily to prove you're actively engaged.

| Action | Requirement | Reward |
|--------|-------------|--------|
| **Daily Check-In** | Sign message with wallet | Base 10 gems |
| **Streak Milestone** | Consecutive days | Bonus gems + lootboxes |
| **Perfect Month** | 30-day streak | Golden Lootbox |
| **100-Day Streak** | 100 consecutive days | Diamond Lootbox |

### Streak Tracking

**Battle Pass Fields:**
```move
public struct BattlePass has key, store {
    // ... existing fields
    streak_current: u32,        // Current consecutive check-ins
    streak_best: u32,           // All-time best streak
    last_checkin: u64,          // Timestamp of last check-in
    total_checkins: u64,        // Lifetime check-ins
}
```

**Streak Rules:**
- **Check-in Window**: 24 hours from last check-in
- **Grace Period**: None (miss a day = streak resets to 0)
- **Max Streak**: Unlimited
- **Retroactive**: Cannot claim missed days
- **Time Zone**: Based on UTC midnight

### Gem Rewards by Streak

| Streak Length | Daily Gems | Bonus | Milestone Reward |
|---------------|------------|-------|------------------|
| 1-6 days | 10 | - | - |
| 7 days | 10 | +20 | 7-day streak badge |
| 8-13 days | 12 | - | - |
| 14 days | 12 | +50 | Standard Lootbox |
| 15-29 days | 15 | - | - |
| 30 days | 15 | +100 | Golden Lootbox |
| 31-99 days | 20 | - | - |
| 100 days | 20 | +500 | Diamond Lootbox |
| 101-364 days | 25 | - | - |
| 365 days | 25 | +1,000 | Anniversary Exclusive |

**Monthly Maximum (Perfect 30-day streak):**
- Base gems: 30 days × 15 avg = ~450 gems
- Milestones: 7-day (20) + 14-day (50) + 30-day (100) = 170 gems
- Potential pet egg: 420 gems from 30-day lootbox
- **Total: ~1,150 gems/month** (with perfect attendance)

### Message Signing Verification

**Check-In Flow:**

1. **User Clicks "Check In"**: Frontend displays daily prompt
2. **Wallet Signature Request**: User signs message with wallet
   - Message: `"Infinite Idol Daily Check-In: [timestamp] [user_id]"`
3. **Backend Verification**:
   - Verify signature matches wallet
   - Verify timestamp is within check-in window
   - Verify not already checked in today
4. **Streak Update**:
   - If within 24 hours: `streak_current += 1`
   - If missed window: `streak_current = 1` (reset)
   - If new best: `streak_best = streak_current`
5. **Reward Credit**:
   - Base gems awarded
   - Milestone bonus if applicable
   - Lootbox minted if milestone
6. **Battle Pass Update**: On-chain update to streak fields

**Security:**
- Signature prevents botting (must control wallet)
- Timestamp prevents replay attacks
- Server-side verification prevents manipulation
- Battle Pass on-chain record is source of truth

### Streak Reset Scenarios

| Scenario | Streak Behavior |
|----------|-----------------|
| **Miss 1 Day** | Reset to 0, start fresh next check-in |
| **Trade Battle Pass** | Streak resets to 0 (new owner starts fresh) |
| **Check In Twice Same Day** | Rejected, no reward |
| **Network Downtime** | Manual admin restoration (rare) |

### Database Schema

**DailyCheckIn Table:**
```sql
DailyCheckIn {
  id: UUID,
  userId: UUID,
  battlePassId: UUID,
  checkinDate: Date,
  timestamp: DateTime,
  signature: String,          // Wallet signature
  streakLength: Int,          // Streak at time of check-in
  gemsAwarded: Int,
  bonusGemsAwarded: Int,
  lootboxAwarded: Boolean,
  createdAt: DateTime,
}
```

**Battle Pass Streak Summary:**
```sql
BattlePassStreak {
  battlePassId: UUID,
  currentStreak: Int,
  bestStreak: Int,
  lastCheckinDate: Date,
  totalCheckins: Int,
  longestStreakStartDate: Date,
  longestStreakEndDate: Date,
}
```

### Milestone Notifications

**In-App Notifications:**
- **3-day streak**: "Keep it going! 🔥"
- **7-day streak**: "One week strong! +20 bonus gems"
- **14-day streak**: "Two weeks of Devotion! Standard Lootbox earned"
- **30-day streak**: "Perfect month! Golden Lootbox unlocked 🎁"
- **100-day streak**: "LEGENDARY. Diamond Lootbox + Cosmic respect"

**Community Celebrations:**
- First user to 365-day streak: Major community announcement
- Monthly perfect streak leaderboard
- Streak recovery tips after reset

### Visual Indicators

**Battle Pass Display:**
- **Flame Icon**: Shows current streak (e.g., "🔥 47 days")
- **Best Streak Badge**: Displayed prominently (e.g., "Best: 182 days")
- **Next Milestone**: Progress bar (e.g., "23/30 days to Golden Lootbox")
- **Check-In Reminder**: Pulsing notification if not checked in today

---

## Technical Implementation

### Battle Pass NFT Structure (Sui Move)

```move
public struct BattlePass has key, store {
    id: UID,

    // Core Progression
    level: u64,                    // Current level (0-999,999)

    // Investment Tracking
    total_sui_spent: u64,          // Lifetime SUI purchases
    gems_earned_free: u64,         // Gems from check-ins
    gems_purchased: u64,           // Gems from SUI

    // Streak Data
    streak_current: u32,           // Current consecutive check-ins
    streak_best: u32,              // All-time best streak
    last_checkin: u64,             // Timestamp of last check-in
    total_checkins: u64,           // Lifetime check-ins

    // Cross-Chain Integration
    dWallet_address: Option<address>,  // Generated dWallet (level 50+)
    dWallet_generated_at: Option<u64>, // DKG timestamp

    // Metadata
    mint_timestamp: u64,           // When pass was created
    season: u32,                   // Season number at mint
    original_owner: address,       // First owner
    times_traded: u32,             // Trade count

    // Flexible Attributes
    attributes: VecMap<String, String>,  // Additional metadata
}
```

### Smart Contract Functions

**Level Up:**
```move
public entry fun level_up(
    pass: &mut BattlePass,
    gems: Coin<GEM>,              // Must be exactly 69 gems
    clock: &Clock,
    ctx: &TxContext,
) {
    // Verify DKG requirement at level 50
    if (pass.level >= 50 && option::is_none(&pass.dWallet_address)) {
        abort E_DKG_REQUIRED
    }

    // Verify gem amount
    assert!(coin::value(&gems) == 69, E_INSUFFICIENT_GEMS);

    // Increment level
    pass.level = pass.level + 1;

    // Burn gems
    coin::destroy_zero(gems);

    // Emit event
    event::emit(LevelUp { pass_id: object::id(pass), new_level: pass.level });
}
```

**Daily Check-In:**
```move
public entry fun check_in(
    pass: &mut BattlePass,
    clock: &Clock,
    ctx: &TxContext,
) {
    let current_time = clock::timestamp_ms(clock);
    let last_check = pass.last_checkin;

    // Verify 24-hour cooldown
    assert!(current_time >= last_check + 86_400_000, E_CHECKIN_COOLDOWN);

    // Check if streak continues (within 24-48 hour window)
    if (current_time <= last_check + 172_800_000) {
        pass.streak_current = pass.streak_current + 1;
    } else {
        pass.streak_current = 1;  // Reset streak
    };

    // Update best streak
    if (pass.streak_current > pass.streak_best) {
        pass.streak_best = pass.streak_current;
    };

    // Update counters
    pass.last_checkin = current_time;
    pass.total_checkins = pass.total_checkins + 1;

    // Emit event (backend handles gem reward)
    event::emit(CheckIn {
        pass_id: object::id(pass),
        streak: pass.streak_current,
        timestamp: current_time,
    });
}
```

**Link dWallet:**
```move
public entry fun link_dwallet(
    pass: &mut BattlePass,
    dwallet_address: address,
    admin_cap: &AdminCap,  // Only admin can link after DKG
) {
    assert!(option::is_none(&pass.dWallet_address), E_DWALLET_ALREADY_LINKED);
    pass.dWallet_address = option::some(dwallet_address);
    pass.dWallet_generated_at = option::some(clock::timestamp_ms(clock));
}
```

### Backend API Endpoints

**User Endpoints:**
- `POST /battlepass/levelup` - Level up (costs 69 gems)
- `POST /battlepass/checkin` - Daily check-in (sign message)
- `GET /battlepass/:id` - Get Battle Pass data
- `GET /battlepass/streak` - Get current streak info
- `POST /dwallet/generate` - Initiate DKG generation

**Admin Endpoints:**
- `POST /admin/battlepass/mint` - Manual mint (emergency)
- `POST /admin/battlepass/reset-streak` - Reset streak (support)
- `POST /admin/dwallet/link` - Link generated dWallet to pass
- `GET /admin/streaks/leaderboard` - View top streaks

### Database Tracking

**BattlePass Table (Off-Chain Mirror):**
```sql
BattlePass {
  id: UUID,
  userId: UUID,
  tokenId: BigInt,           // On-chain NFT ID
  level: Int,
  visualTier: String,        // Bronze/Silver/Gold/Platinum/Diamond/Cosmic

  streakCurrent: Int,
  streakBest: Int,
  lastCheckinDate: Date,
  totalCheckins: Int,

  dWalletAddress: String?,
  dWalletGeneratedAt: DateTime?,

  totalSuiSpent: Decimal,
  gemsEarnedFree: Int,
  gemsPurchased: Int,

  mintTimestamp: DateTime,
  season: Int,
  originalOwner: String,
  currentOwner: String,
  timesTraded: Int,

  createdAt: DateTime,
  updatedAt: DateTime,
}
```

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

## Technical Reference

For developers and deep technical implementation details:

**Smart Contracts:**
- [SUI_CONTRACTS.md](./technical-reference/SUI_CONTRACTS.md) - Move contracts, BattlePass NFT struct, level-up functions, check-in logic
- [BACKEND.md](./technical-reference/BACKEND.md) - REST API endpoints, database schema, streak tracking, DKG integration

**Architecture:**
- [ARCHITECTURE.md](./technical-reference/ARCHITECTURE.md) - System architecture, dWallet integration flows, data synchronization

---

## Related Documentation

### Core Systems
- [gem-system.md](./gem-system.md) - Currency that funds leveling, dWallet payment integration
- [gacha-system.md](./gacha-system.md) - Lootbox rewards from leveling milestones
- [cosmetics.md](./cosmetics.md) - Items earned through progression
- [cross-chain-architecture.md](./cross-chain-architecture.md) - dWallet deep-dive, DKG process
- [pre-registration-spec.md](./pre-registration-spec.md) - Complete system overview

### Additional Context
- See `knowledge-base/crypto/sui-integration.md` for NFT implementation details
- See `knowledge-base/lore/mechanics/devotion-system.md` for narrative parallel

---

*"420,069. That's when you become Cosmic. Some call it a meme. I call it the moment your Devotion becomes infinite. Bronze fans watch. Silver fans support. Gold fans invest. Platinum fans believe. Diamond fans never waver. But Cosmic fans? They ARE the Eternal Stage."*

— Ika Minami

---
