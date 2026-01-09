# GACHA SYSTEM - Complete Lootbox Mechanics

> *"Every box you open is another roll in The Chase. The odds are published. The thrill is real. And we guarantee you'll get rare rewards. That's not pity—that's promise."*
> — Ika Minami, Lootbox Tutorial

---

## Overview

The **Gacha System** is the core reward mechanism of Infinite Idol's pre-registration experience. Lootboxes are NFT containers earned through progression milestones—never purchased directly. Opening a lootbox burns the NFT and creates new cosmetic item NFTs based on published probability tables.

This system is designed around transparent odds, time-gated content releases, and the thrill of the chase—echoing the narrative's core premise where idols pursue Senpai across the Eternal Stage.

---

## Rarity Tiers

All lootbox contents follow a unified 5-tier rarity system:

| Tier | Rarity | Numeric | Drop Chance | Visual Treatment | Description |
|------|--------|---------|-------------|------------------|-------------|
| 0 | **Common** | 0 | 55% | Silver border, subtle shimmer | Basic designs, foundational pieces |
| 1 | **Uncommon** | 1 | 25% | Bronze border, warm glow | Enhanced details, refined aesthetics |
| 2 | **Epic** | 2 | 13% | Purple border, particle effects | Special effects, unique patterns |
| 3 | **Mythic** | 3 | 6% | Gold + black flames, animated | Rare exclusive designs, high prestige |
| 4 | **Limited** | 4 | 1% | Black + gold explosion, full animation | Ultra-premium exclusive designs, ultimate prestige |

### Rarity Philosophy

The 55/25/13/6/1 distribution is intentional:

| Rarity | Purpose | Player Psychology |
|--------|---------|-------------------|
| Common (55%) | Collection building | Satisfying progress, completionism fuel |
| Uncommon (25%) | Excitement spikes | "Better than common!" dopamine |
| Epic (13%) | Goal creation | Pursuit targets, collection prestige |
| Mythic (6%) | Premium pulls | Rare chase goal, strong flex material |
| Limited (1%) | Dream pulls | Ultimate chase goal, maximum prestige |

---

## Lootbox Types

### Standard Family Boxes (A-E)

Five distinct lootbox families, each containing cosmetics from their respective set:

| Box Type | Cosmetic Family | Content Focus |
|----------|-----------------|---------------|
| **A Box** | A-family sets | 6 outfit sets (Head, Chest, Arms, Legs, Feet, Back) |
| **B Box** | B-family sets | 6 outfit sets (Head, Chest, Arms, Legs, Feet, Back) |
| **C Box** | C-family sets | 6 outfit sets (Head, Chest, Arms, Legs, Feet, Back) |
| **D Box** | D-family sets | 6 outfit sets (Head, Chest, Arms, Legs, Feet, Back) |
| **E Box** | E-family sets | 6 outfit sets (Head, Chest, Arms, Legs, Feet, Back) |

Each family contains 6 complete outfit sets × 6 pieces = 36 items per family.

### Premium Boxes

Higher-tier lootboxes with improved odds:

| Box Type | Category | Source | Improved Odds | Special Features |
|----------|----------|--------|---------------|------------------|
| **Golden Lootbox** | 1 | 1,000-level milestones, 30-day streaks | Boosted Mythic/Limited rates | Any family cosmetics |
| **Diamond Lootbox** | 2 | 10,000-level milestones, Prestige Burn (40,000) | Heavily boosted rare rates | Any family + exclusive items |

### Golden Lootbox Odds

| Rarity | Standard Chance | Golden Chance |
|--------|-----------------|---------------|
| Common | 55% | 35% |
| Uncommon | 25% | 28% |
| Epic | 13% | 20% |
| Mythic | 6% | 14% |
| Limited | 1% | 3% |

### Diamond Lootbox Odds

| Rarity | Standard Chance | Diamond Chance |
|--------|-----------------|----------------|
| Common | 55% | 20% |
| Uncommon | 25% | 25% |
| Epic | 13% | 25% |
| Mythic | 6% | 22% |
| Limited | 1% | 8% |

---

## Time-Locked Releases

Content is staggered to maintain long-term engagement and create anticipation:

| Box Type | Availability | Days After Launch |
|----------|--------------|-------------------|
| **A Box** | Day 1 | 0 |
| **B Box** | 3 weeks after launch | 21 |
| **C Box** | 6 weeks after launch | 42 |
| **D Box** | 9 weeks after launch | 63 |
| **E Box** | 12 weeks after launch | 84 |

### Time-Lock Philosophy

| Purpose | Implementation |
|---------|----------------|
| **Sustained Engagement** | New content every 3 weeks keeps players returning |
| **Content Calendar** | Marketing can build anticipation for each unlock |
| **Collection Pacing** | Prevents collection completion burnout |
| **Community Events** | Each unlock is a celebration opportunity |
| **Whale Pacing** | Even maximum spenders must wait for full collection |

### Pre-Unlock Behavior

If a player earns a B, C, D, or E Box before its unlock date:

- Box is **stored in inventory** as unopenable NFT
- Box displays **countdown timer** to unlock
- Box is **tradable** even while locked
- Box can be **burned** (but why would you?)

---

## Lootbox Acquisition

### Primary Source: Level Milestones

Every level grants one lootbox, cycling through families:

| Level | Box Type | Level | Box Type |
|-------|----------|-------|----------|
| 1 | A Box | 6 | A Box |
| 2 | B Box | 7 | B Box |
| 3 | C Box | 8 | C Box |
| 4 | D Box | 9 | D Box |
| 5 | E Box | 10 | E Box |

**Cycling Pattern:** A → B → C → D → E → A → B → C → D → E → ...

This ensures equal distribution across all families regardless of total levels.

### Secondary Sources

| Source | Box Type | Frequency |
|--------|----------|-----------|
| Every 1,000 levels | Golden Lootbox | Milestone reward |
| Every 10,000 levels | Diamond Lootbox | Milestone reward |
| 14-day check-in streak | Standard Lootbox (random family) | Once per streak completion |
| 30-day check-in streak | Golden Lootbox | Once per streak completion |
| Prestige Burn (4,000) | Golden Lootbox | One-time reward |
| Prestige Burn (40,000) | Diamond Lootbox | One-time reward |
| Regular Burn (4 duplicates) | Standard Lootbox (same family) | Repeatable |

---

## Opening Mechanics

### Opening Process

```
Lootbox Opening Flow:
1. Player selects lootbox from inventory
2. Confirmation prompt shows box type and odds
3. Animation plays (tier-appropriate)
4. Randomness calculated (blockchain + server + timestamp)
5. Lootbox NFT burned (destroyed permanently)
6. Cosmetic item NFT minted to player wallet
7. Result displayed with rarity-appropriate fanfare
8. Item automatically added to inventory
```

### Opening Rules

| Rule | Details |
|------|---------|
| **One at a Time** | Cannot bulk-open (creates anticipation) |
| **No Refunds** | Burned lootbox cannot be recovered |
| **No Rerolls** | Result is final upon opening |
| **Instant Minting** | New item NFT created immediately |
| **Duplicate Possible** | Same item can drop multiple times |

### Visual Feedback by Rarity

| Rarity | Animation | Sound | Screen Effect |
|--------|-----------|-------|---------------|
| Common | Quick silver burst | Subtle chime | Minimal |
| Uncommon | Bronze glow + spark | Warm sting | Bronze rim glow |
| Epic | Purple beam + particles | Dramatic fanfare | Screen shake |
| Mythic | Gold + black flames | Epic orchestral | Intense glow + shake |
| Limited | Black fire + gold explosion | Ultimate orchestral climax | Full screen takeover |

---

## Burn System Integration

Duplicate items can be recycled into new chances:

### Standard Burn

| Input | Output | Notes |
|-------|--------|-------|
| 4 duplicate items (same family) | 1 Lootbox (same family) | Items must be unequipped |
| 5 duplicate pets | 1 Pet Egg | Pets must be unequipped |

### Prestige Burn Milestones

| Lifetime Burns | Reward | One-Time Only |
|----------------|--------|---------------|
| 4,000 items burned | 1 Golden Lootbox | Yes |
| 40,000 items burned | 1 Diamond Lootbox | Yes |

### Burn Philosophy

The burn system creates:

1. **Duplicate Value**: No pull is truly wasted
2. **Collection Recycling**: Excess items have purpose
3. **Secondary Pursuit**: Prestige milestones add goals
4. **Economy Circulation**: Items leave supply through burning

---

## Randomness & Fairness

### Verifiable Random Generation

All lootbox outcomes use provably fair randomness:

| Component | Source | Purpose |
|-----------|--------|---------|
| Server Seed | Game server | Prevents client manipulation |
| Blockchain Hash | SUI block | Prevents server manipulation |
| Timestamp | Opening time | Adds temporal entropy |
| Player Seed | Wallet signature | Player participation |

**Combined Seed:** `SHA256(server_seed + block_hash + timestamp + player_signature)`

### On-Chain Transparency

| Data | Storage | Verifiable |
|------|---------|------------|
| Published Odds | On-chain contract | Always |
| Opening Results | Transaction history | Always |
| Historical Rates | Aggregatable from chain | Always |
| Server Seed (revealed) | Post-opening publication | After result |

### Pity/Mercy System

Infinite Idol implements a **transparent pity system** to guarantee rare rewards:

**How It Works:**
- Every lootbox opening increments your pity counter for that category
- Admin-configurable thresholds trigger guaranteed rewards
- Example: Opening 50 Regular boxes without an Epic guarantees an Epic on the 50th
- Pity counters are tracked per user, per lootbox category
- Counter resets when you receive the guaranteed reward

**Player Benefits:**
- **Guaranteed Progress**: Never stuck with only common drops forever
- **Transparent Thresholds**: You know when your guaranteed reward is coming
- **Per-Category Tracking**: Each lootbox type (Regular/Golden/Diamond/Pet) has independent counters
- **Fair Chase**: Combines luck with guaranteed milestones

**Example Thresholds** (admin-configurable):
| Lootbox Category | Guaranteed Reward | Opens Required |
|------------------|-------------------|----------------|
| Regular Box | Epic (Tier 2) | 50 |
| Regular Box | Mythic (Tier 3) | 150 |
| Golden Box | Mythic (Tier 3) | 75 |
| Diamond Box | Limited (Tier 4) | 50 |

> *"The Chase is unpredictable, but we don't let you run forever empty-handed. That's the difference between cruel chance and exciting pursuit."*
> — Ika Minami on the pity system

---

## Whale Psychology Design

### Ethical Whale Integration

The gacha system acknowledges whale investment while maintaining fair play:

| Principle | Implementation |
|-----------|----------------|
| **Transparent Odds** | All rates displayed before opening |
| **No Direct Purchase** | Lootboxes cannot be bought with SUI |
| **Effort-Based** | Must progress (level) to earn boxes |
| **Tradable Assets** | All items can be sold if desired |
| **No Power Advantage** | All items are purely cosmetic |

### Value Protection

| Protection | Details |
|------------|---------|
| **NFT Ownership** | Every item is a tradable asset |
| **No Loss** | Duplicates convert to new chances via burn |
| **Market Value** | Rare items have marketplace value |
| **Collection Worth** | Complete sets have collector value |

### Investment Visibility

| Investment Level | Visible Status |
|------------------|----------------|
| Casual | Mix of Common/Rare items |
| Dedicated | Ultra Rare collection pieces |
| Whale | Legendary items equipped |
| Ultimate | Full collection completion |

---

## Collection System

### Total Collection Size

| Category | Count |
|----------|-------|
| Outfit Sets | 30 total (6 per family × 5 families) |
| Items per Set | 6 (Head, Chest, Arms, Legs, Feet, Back) |
| Total Outfit Pieces | 180 |
| Accessory Types | 3 (Neck, L Wrist, R Wrist) |
| Accessories per Rarity | 12 |
| Total Accessories | 36 |
| **Grand Total Items** | 216+ |

### Collection Tracking

The **Checkbook** system tracks:

- All possible items (visible as silhouettes)
- Owned items (fully visible)
- Duplicate counts
- Set completion progress
- Rarity distribution

### Set Completion Bonuses

*Future consideration—not in initial pre-registration*

---

## Content Seasons

### Seasonal Rotation

The lootbox system is designed for seasonal content updates:

| Element | Current Season | Future Seasons |
|---------|----------------|----------------|
| Family Sets (A-E) | Launch content | New sets per season |
| Lootbox Types | 7 types (5 standard + 2 premium) | Potential new tiers |
| Rarity Odds | Fixed per season | May adjust per season |
| Time-Locks | 12-week full unlock | Reset each season |

### Cross-Season Items

| Item Source | Cross-Season Behavior |
|-------------|----------------------|
| Standard items | Archived after season |
| Legendary items | Permanently rare |
| Golden/Diamond exclusives | Never return |
| Pet variants | Per-season exclusivity |

---

## Technical Implementation

### Lootbox Categories (Numeric System)

Lootboxes use numeric categories in the smart contract:

| Category | Numeric Value | Player-Facing Name | Description |
|----------|---------------|-------------------|-------------|
| 0 | `category: 0` | Regular Box (A/B/C/D/E) | Standard family-specific lootboxes |
| 1 | `category: 1` | Golden Lootbox | Premium with boosted rates |
| 2 | `category: 2` | Diamond Lootbox | Ultra-premium with best rates |
| 3 | `category: 3` | Pet Egg | Pet-specific lootbox |

**Family Boxes (Category 0):**
- Internally use attributes to distinguish A/B/C/D/E families
- All category 0, differentiated by metadata
- Cycle through families in level rewards

### Lootbox NFT Structure (Sui Move)

```move
public struct Lootbox has key, store {
    id: UID,
    category: u8,              // 0-3 (Regular/Golden/Diamond/Pet)
    attributes: VecMap<String, String>,  // Family, season, etc.
    token_id: u64,             // Unique lootbox ID
}
```

| Field | Type | Description |
|-------|------|-------------|
| `category` | u8 | Numeric category (0-3) |
| `attributes` | VecMap | Metadata (family, unlock time, season) |
| `token_id` | u64 | Unique identifier |

### Rarity System (Numeric Values)

Smart contract uses numeric rarity values:

| Rarity Name | Numeric Value | Contract Representation |
|-------------|---------------|------------------------|
| Common | 0 | `rarity: 0` |
| Uncommon | 1 | `rarity: 1` |
| Epic | 2 | `rarity: 2` |
| Mythic | 3 | `rarity: 3` |
| Limited | 4 | `rarity: 4` |

### Blockchain Random Generation

Lootbox opening uses **Sui Random** for provably fair outcomes:

```move
entry fun open_lootbox(
    self: &mut State,
    av: &AV,
    lootbox: Lootbox,
    random: &Random,          // Sui's on-chain randomness source
    clock: &Clock,
    ctx: &mut TxContext,
)
```

**Randomness Components:**
- **Sui Random Object**: Blockchain-native random source (no off-chain manipulation)
- **Clock**: Timestamp for additional entropy
- **Transaction Context**: User signature + gas + sender address

**Process Flow:**
1. Extract category from lootbox (0-3)
2. Increment user's pity counter for this category
3. Check if pity threshold reached → guarantee rare drop
4. If no pity trigger: Query Sui Random for rarity selection
5. Select random item ID from chosen rarity pool
6. Mint Asset NFT with selected item + rarity
7. Burn Lootbox NFT
8. Transfer Asset to user

### Pity System Implementation

**Database Tracking:**
```typescript
// Per-user, per-category pity counters
PityCounter {
  userId: string,
  lootboxCategory: number,  // 0-3
  opensSinceEpic: number,
  opensSinceMythic: number,
  opensSinceLimited: number,
}
```

**Smart Contract Logic:**
1. `open_lootbox()` increments pity counter before random roll
2. Check thresholds:
   - If `opensSinceEpic >= EPIC_THRESHOLD` → guarantee Epic (rarity 2)
   - If `opensSinceMythic >= MYTHIC_THRESHOLD` → guarantee Mythic (rarity 3)
   - If `opensSinceLimited >= LIMITED_THRESHOLD` → guarantee Limited (rarity 4)
3. On guaranteed drop: Reset appropriate counter(s)
4. On natural rare drop: Reset counter for that tier + lower tiers

**Admin Configuration:**
```move
public struct PitySystem has store {
    thresholds: VecMap<u8, VecMap<u8, u64>>,
    // thresholds[category][rarity] = opens_required
}
```

Admins can adjust thresholds per category per rarity:
- `thresholds[0][2] = 50` → Regular boxes guarantee Epic at 50 opens
- `thresholds[1][3] = 75` → Golden boxes guarantee Mythic at 75 opens

### Opening Transaction Flow

| Step | Action | Smart Contract Function | Gas Cost |
|------|--------|-------------------------|----------|
| 1 | Verify box ownership | `ctx.sender()` check | Minimal |
| 2 | Check unlock time | Compare `clock.timestamp()` vs attributes | Minimal |
| 3 | Increment pity counter | `pity_system.increment()` | Minimal |
| 4 | Check pity thresholds | `pity_system.check_threshold()` | Minimal |
| 5 | Generate randomness | `random.generate_u8()` | Moderate |
| 6 | Select item from pool | `id_manager.get_random_item()` | Minimal |
| 7 | Burn lootbox NFT | `object::delete(lootbox.id)` | Minimal |
| 8 | Mint item NFT | `asset::mint()` | Moderate |
| 9 | Record pity reset | `pity_system.reset()` if threshold hit | Minimal |
| 10 | Transfer asset to user | `transfer::public_transfer()` | Minimal |

### Asset Output Structure

```move
public struct Asset has key, store {
    id: UID,
    token_id: u64,           // Unique asset ID
    metadata: Metadata,       // Item details
    upgrade_level: u8,        // 0 (base), 1 (+), 2 (++)
}

public struct Metadata has copy, drop, store {
    id: ID,                   // Item definition ID
    slot: u8,                 // 0=Set, 1=Accessory, 9=Pet
    name: String,
    rarity: u8,               // 0-4
    attributes: VecMap<String, String>,
}
```

### Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `BOX_LOCKED` | Opening before unlock timestamp | Wait for unlock time |
| `NOT_OWNER` | Opening box not in wallet | Verify ownership via wallet connect |
| `INVALID_CATEGORY` | Category not 0-3 | Contact support (shouldn't happen) |
| `EMPTY_ITEM_POOL` | No items available for rarity | Admin must register items |
| `NETWORK_ERROR` | Connection lost | Retry transaction |

### Database Schema

**Lootbox Table:**
```sql
Lootbox {
  id: UUID,
  userId: UUID,
  category: Int,          // 0-3
  family: String?,        // For category 0 only
  unlockTimestamp: DateTime,
  season: Int,
  createdAt: DateTime,
}
```

**Pity Tracking Table:**
```sql
PityCounter {
  id: UUID,
  userId: UUID,
  lootboxCategory: Int,   // 0-3
  opensSinceEpic: Int,
  opensSinceMythic: Int,
  opensSinceLimited: Int,
  lastOpened: DateTime,
}
```

### Admin Operations

**Smart Contract Functions:**
- `admin_set_pity_threshold(category: u8, rarity: u8, threshold: u64)` - Configure pity
- `admin_register_item(rarity: u8, slot: u8, metadata: Metadata)` - Add new items
- `admin_disable_item(item_id: ID)` - Remove from drop pool
- `admin_set_lootbox_config(category: u8, rarity_weights: vector<u64>)` - Adjust drop rates
- `admin_mint_lootbox(user: address, category: u8)` - Direct lootbox grant

**Backend API Endpoints:**
- `POST /admin/lootbox/mint` - Mint lootbox to user
- `GET /admin/pity/status/:userId` - View user's pity counters
- `POST /admin/pity/reset/:userId/:category` - Reset pity counter (emergency)

---

## Marketing Opportunities

### Content Calendar Integration

| Event | Timing | Content Focus |
|-------|--------|---------------|
| B Box Unlock | Week 3 | Countdown, teasers, community celebration |
| C Box Unlock | Week 6 | Mid-season hype, collection progress |
| D Box Unlock | Week 9 | Late additions, completionist push |
| E Box Unlock | Week 12 | Final unlock, collection completion race |

### Community Engagement

| Opportunity | Format |
|-------------|--------|
| Legendary Pull Celebrations | RT/quote player posts |
| Set Completion Achievements | Profile badges/shoutouts |
| Burn Milestone Recognition | Prestige announcements |
| First Cosmic Tier | Major community celebration |

### Streamer/Content Creator Potential

| Content Type | Engagement Driver |
|--------------|-------------------|
| Opening videos | Reaction content, odds visualization |
| Collection showcases | Goal-setting for viewers |
| Odds analysis | Community education |
| Trading content | Marketplace activity |

---

## Canon Integration

### Narrative Parallel

The lootbox system mirrors The Chase itself:

| Game Mechanic | Narrative Element |
|---------------|-------------------|
| Opening lootbox | Competing in The Chase |
| Common drop | Average Chase result |
| Legendary drop | Almost catching Senpai |
| Collection completion | Ultimate idol status |
| Burn system | Converting failure into new chances |

### Canon Rule Compliance

| Rule | Implementation |
|------|----------------|
| #7: The Chase is Core | Lootbox pursuit = Chase pursuit |
| #8: Built on SUI | All NFTs on SUI blockchain |
| #9: Gems are Currency | Gems fund leveling → Lootboxes |
| #10: Dark Luxury | Premium animations, black/gold UI |

---

## Dark Luxury Aesthetic

The gacha experience maintains brand identity:

| Element | Treatment |
|---------|-----------|
| UI Colors | Black background, gold accents |
| Animations | Elegant, premium feel |
| Particle Effects | Subtle shimmer, not flashy |
| Sound Design | Orchestral, dramatic |
| Typography | Clean, luxury typefaces |

**No Cutesy Elements:**
- No chibi celebration animations
- No kawaii sound effects
- No pink sparkle effects
- No cartoon celebration stickers

---

## Technical Reference

For developers and deep technical implementation details:

**Smart Contracts:**
- [SUI_CONTRACTS.md](./technical-reference/SUI_CONTRACTS.md) - Move contracts, lootbox/asset structs, pity system, admin functions
- [BACKEND.md](./technical-reference/BACKEND.md) - REST API endpoints, database schema, pity tracking

**Architecture:**
- [ARCHITECTURE.md](./technical-reference/ARCHITECTURE.md) - System architecture, data flows, randomness implementation

---

## Related Documentation

### Core Systems
- [cosmetics.md](./cosmetics.md) - Items obtained from lootboxes, asset details
- [gem-system.md](./gem-system.md) - Currency that funds leveling → lootboxes
- [battle-pass.md](./battle-pass.md) - Level tracking NFT, progression system
- [pre-registration-spec.md](./pre-registration-spec.md) - Complete system overview

### Additional Context
- See `knowledge-base/crypto/sui-integration.md` for blockchain NFT implementation
- See `knowledge-base/lore/mechanics/the-chase.md` for narrative parallel
- See `knowledge-base/brand/dark-luxury-guide.md` for aesthetic guidelines

---

*"1%. That's the Limited chance. Some would call it impossible. But we also promise you'll never run empty-handed—the pity system guarantees progress. The Chase has rules now. Fair rules. That's what makes the pursuit worth everything."*

— Ika Minami

---
