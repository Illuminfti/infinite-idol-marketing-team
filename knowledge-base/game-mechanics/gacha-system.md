# GACHA SYSTEM - Complete Lootbox Mechanics

> *"Every box you open is another roll in The Chase. The odds are published. The thrill is real. And somewhere in that 3%... your Legendary awaits."*
> — Ika Minami, Lootbox Tutorial

---

## Overview

The **Gacha System** is the core reward mechanism of Infinite Idol's pre-registration experience. Lootboxes are NFT containers earned through progression milestones—never purchased directly. Opening a lootbox burns the NFT and creates new cosmetic item NFTs based on published probability tables.

This system is designed around transparent odds, time-gated content releases, and the thrill of the chase—echoing the narrative's core premise where idols pursue Senpai across the Eternal Stage.

---

## Rarity Tiers

All lootbox contents follow a unified rarity system:

| Rarity | Drop Chance | Visual Treatment | Description |
|--------|-------------|------------------|-------------|
| **Common** | 60% | Silver border, subtle shimmer | Basic designs, foundational pieces |
| **Rare** | 25% | Gold border, gentle glow | Enhanced details, refined aesthetics |
| **Ultra Rare** | 12% | Purple border, particle effects | Special effects, unique patterns |
| **Legendary** | 3% | Black + gold flames, full animation | Premium exclusive designs, ultimate prestige |

### Rarity Philosophy

The 60/25/12/3 distribution is intentional:

| Rarity | Purpose | Player Psychology |
|--------|---------|-------------------|
| Common (60%) | Collection building | Satisfying progress, completionism fuel |
| Rare (25%) | Excitement spikes | "Better than common!" dopamine |
| Ultra Rare (12%) | Goal creation | Pursuit targets, collection prestige |
| Legendary (3%) | Dream pulls | Ultimate chase goal, flex material |

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

| Box Type | Source | Improved Odds | Special Features |
|----------|--------|---------------|------------------|
| **Golden Lootbox** | 1,000-level milestones, 30-day streaks | 2× Legendary chance (6%) | Any family cosmetics |
| **Diamond Lootbox** | 10,000-level milestones, Prestige Burn (40,000) | 3× Legendary chance (9%) | Any family + exclusive items |

### Golden Lootbox Odds

| Rarity | Standard Chance | Golden Chance |
|--------|-----------------|---------------|
| Common | 60% | 45% |
| Rare | 25% | 30% |
| Ultra Rare | 12% | 19% |
| Legendary | 3% | 6% |

### Diamond Lootbox Odds

| Rarity | Standard Chance | Diamond Chance |
|--------|-----------------|----------------|
| Common | 60% | 30% |
| Rare | 25% | 35% |
| Ultra Rare | 12% | 26% |
| Legendary | 3% | 9% |

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
| Rare | Gold particle spiral | Triumphant sting | Golden rim glow |
| Ultra Rare | Purple beam + particles | Dramatic fanfare | Screen shake |
| Legendary | Black fire + gold explosion | Epic orchestral | Full screen takeover |

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

### No Pity System

Infinite Idol uses **pure randomness** with no pity timer:

- Every pull has exactly the published odds
- No guaranteed drops after X pulls
- No soft pity or hard pity mechanics
- Pure gacha experience

> *This aligns with the narrative: The Chase is never guaranteed. Senpai cannot be caught through persistence alone.*

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

### Lootbox NFT Structure

| Field | Type | Description |
|-------|------|-------------|
| `box_type` | String | A/B/C/D/E/Golden/Diamond |
| `family` | String | Cosmetic family (standard boxes) |
| `unlock_timestamp` | u64 | When box can be opened |
| `season` | u32 | Season number |
| `mintable_rarities` | Array | Possible rarity outcomes |
| `is_opened` | bool | Always false (burned on open) |

### Opening Transaction

| Step | Action | Gas Cost |
|------|--------|----------|
| 1 | Verify box ownership | Minimal |
| 2 | Check unlock time | Minimal |
| 3 | Generate randomness | Moderate |
| 4 | Burn lootbox NFT | Minimal |
| 5 | Mint item NFT | Moderate |
| 6 | Record result on-chain | Minimal |

### Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `BOX_LOCKED` | Opening before unlock date | Wait for unlock |
| `NOT_OWNER` | Opening box not in wallet | Verify ownership |
| `ALREADY_OPENED` | Attempting to open twice | N/A (impossible) |
| `NETWORK_ERROR` | Connection lost | Retry logic |

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

## Cross-References

### Immediate Dependencies

- **Leveling System**: Levels → Lootboxes
- **Gem System**: Gems → Levels → Lootboxes
- **Item System**: Lootboxes → Cosmetics
- **Burn System**: Duplicates → New Lootboxes

### Related Documentation

- See `knowledge-base/game-mechanics/pre-registration-spec.md` for system overview
- See `knowledge-base/game-mechanics/gem-system.md` for currency that funds levels
- See `knowledge-base/game-mechanics/battle-pass.md` for level tracking NFT
- See `knowledge-base/game-mechanics/cosmetics.md` for items obtained from lootboxes
- See `knowledge-base/crypto/sui-integration.md` for NFT implementation
- See `knowledge-base/lore/mechanics/the-chase.md` for narrative parallel

---

*"3%. That's the Legendary chance. Some call it cruel. I call it honest. Every idol on the Eternal Stage knows the odds are against them. We chase anyway. That's what makes the catch worth everything."*

— Ika Minami

---
