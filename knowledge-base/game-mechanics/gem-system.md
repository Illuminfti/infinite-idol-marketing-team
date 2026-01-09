# GEM SYSTEM - Complete Currency Mechanics

> *"Every gem spent is a declaration: I will not let her Fade. Every purchase is proof: my Devotion is real."*
> — Pre-Registration Launch Trailer

---

## Overview

**Gems** are the primary in-game currency of Infinite Idol. Everything in the pre-registration experience—and ultimately the full game—flows through Gems. This document provides the complete specification of how Gems are acquired, stored, spent, and managed.

Gems represent the bridge between real-world investment (SUI) and in-game engagement. They are the player's equivalent of **Devotion**—tangible commitment to supporting Ika and her journey on the Eternal Stage.

---

## Core Conversion Rate

The fundamental exchange rate between SUI and Gems:

> **1 SUI → 100 Gems** (Base Rate)

This rate serves as the foundation for all Gem calculations. Bulk purchases receive bonuses, incentivizing higher investment tiers.

---

## Gem Package Tiers

Six purchase tiers are available, each offering progressively better value for higher commitment:

| SUI Spent | Base Gems | Bonus % | Bonus Gems | Total Gems | Effective Rate |
|-----------|-----------|---------|------------|------------|----------------|
| **1 SUI** | 100 | 0% | 0 | 100 | 100 Gems/SUI |
| **10 SUI** | 1,000 | 10% | 100 | 1,100 | 110 Gems/SUI |
| **100 SUI** | 10,000 | 15% | 1,500 | 11,500 | 115 Gems/SUI |
| **1,000 SUI** | 100,000 | 20% | 20,000 | 120,000 | 120 Gems/SUI |
| **10,000 SUI** | 1,000,000 | 25% | 250,000 | 1,250,000 | 125 Gems/SUI |
| **100,000 SUI** | 10,000,000 | 30% | 3,000,000 | 13,000,000 | 130 Gems/SUI |

### Explicit Conversion Rates

For clarity, here are all 6 conversion rates including bonuses:

- **1 SUI = 100 Gems** (0% bonus)
- **10 SUI = 1,100 Gems** (10% bonus)
- **100 SUI = 11,500 Gems** (15% bonus)
- **1,000 SUI = 120,000 Gems** (20% bonus)
- **10,000 SUI = 1,250,000 Gems** (25% bonus)
- **100,000 SUI = 13,000,000 Gems** (30% bonus)

### Package Design Philosophy

Each tier is designed with specific player segments in mind:

| Tier | Target Audience | Psychology |
|------|-----------------|------------|
| 1 SUI | Casual fans, testers | Low barrier to entry |
| 10 SUI | Regular supporters | First bonus triggers investment |
| 100 SUI | Committed fans | Meaningful but accessible |
| 1,000 SUI | Dedicated collectors | Collector-tier commitment |
| 10,000 SUI | High-tier supporters | Whale territory begins |
| 100,000 SUI | Ultimate fans | Maximum Devotion demonstration |

### Visual Package Presentation

Each package tier has unique visual elements:

| Package | Color Scheme | Animation | Icon |
|---------|--------------|-----------|------|
| 1 SUI | Silver | Subtle shimmer | Single gem |
| 10 SUI | Light gold | Gentle glow | Small pile |
| 100 SUI | Deep gold | Rotating sparkle | Medium chest |
| 1,000 SUI | Gold + black accents | Pulsing aura | Large chest |
| 10,000 SUI | Black + gold flames | Floating particles | Vault |
| 100,000 SUI | Cosmic black + stars | Full animation | Cosmic vault |

---

## Account-Bound Rules

### Core Binding Principle

> **Gems are permanently bound to the wallet address that purchased them.**

This is non-negotiable and enforced at the smart contract level.

### Binding Specifications

| Property | Rule |
|----------|------|
| **Transfer** | NOT possible between wallets |
| **Trading** | NOT possible on any marketplace |
| **Gifting** | NOT possible between players |
| **Inheritance** | NOT applicable—bound to original wallet |
| **Refund** | NOT available—all purchases final |
| **Recovery** | Possible ONLY through original wallet access |

### Why Account-Bound?

The decision to make Gems account-bound is intentional:

1. **Anti-RMT**: Prevents real-money trading of currency
2. **Fair Play**: Everyone earns/buys at the same rate
3. **Progress Ownership**: Your gems = your commitment
4. **Economy Stability**: No market manipulation of currency
5. **Investment Proof**: Gem balance proves personal investment

### Storage Location

| Component | Location | Details |
|-----------|----------|---------|
| Gem Balance | SUI Object | Stored as a SUI object owned by player wallet |
| Transaction History | On-chain | All purchases recorded immutably |
| Spending Log | On-chain | All expenditures tracked |
| Current Balance | Calculated | Real-time from transaction history |

---

## Gem Expenditure

### Spending Rates

| Action | Gem Cost | Result |
|--------|----------|--------|
| **Level Up** | 69 Gems | +1 Idol Aura (Level) |
| **Pet Egg Opening** | 420 Gems | Hatch one pet |
| **Special Events** | Variable | TBD per event |

### The 69 Gems Per Level Rate

The leveling cost is designed around accessible progression:

**Level Calculations:**

| Package | Total Gems | Levels Purchasable | Bonus Levels vs. Base |
|---------|------------|--------------------|-----------------------|
| 1 SUI | 100 | 1 level (+31 remainder) | 0 |
| 10 SUI | 1,100 | 15 levels (+65 remainder) | +1 extra level |
| 100 SUI | 11,500 | 166 levels (+46 remainder) | +16 extra levels |
| 1,000 SUI | 120,000 | 1,739 levels (+9 remainder) | +289 extra levels |
| 10,000 SUI | 1,250,000 | 18,115 levels (+65 remainder) | +3,623 extra levels |
| 100,000 SUI | 13,000,000 | 188,405 levels (+55 remainder) | +43,478 extra levels |

### Pet Egg Opening Cost

**420 Gems** per Pet Egg opening:
- Approximately $5 USD equivalent (at typical SUI prices)
- One egg = one pet (random rarity)
- Cannot open partial eggs
- Cost is fixed regardless of egg source

---

## Gem Acquisition Methods

### Primary: SUI Purchase

The main method of acquiring Gems. Six tiers available as detailed above.

### Secondary: Daily Check-In

Free gems earned through consistent engagement:

| Method | Gems Earned |
|--------|-------------|
| Daily Claim | 10 Gems |
| 7-Day Streak Bonus | +50 Gems |
| 14-Day Streak Bonus | +100 Gems |
| 21-Day Streak Bonus | +200 Gems |
| 30-Day Streak Bonus | +500 Gems |

**Monthly Maximum (Perfect Streak):**
- 30 days × 10 Gems = 300 Gems
- Streak bonuses = 850 Gems
- **Total: 1,150 Gems/month** (equivalent to 10 SUI package)

### Tertiary: Events (Future)

Promotional events may offer Gem rewards. These will be announced separately.

---

## Administrative Controls

### Admin Capabilities

The following can be adjusted by system administrators:

| Setting | Admin Control | When Changed |
|---------|---------------|--------------|
| Base Rate | Yes | Major economic rebalancing only |
| Bonus Percentages | Yes | Promotional events |
| Package Availability | Yes | Limited-time offers |
| Spending Costs | Yes | System rebalancing |
| Daily Amounts | Yes | Event promotions |

### Rate Lock Promise

> The base rate of **1 SUI → 100 Gems** is intended to remain stable. Any changes would be communicated 30 days in advance.

### Transparency Requirements

- All rates displayed in-game
- Package contents clearly shown before purchase
- Historical rates available on request
- No hidden fees or conversion costs

---

## Technical Implementation

### Smart Contract Integration

```
Gem Purchase Flow:
1. Player selects package tier
2. Wallet prompts SUI transaction approval
3. SUI sent to game treasury address
4. Smart contract calculates total Gems (base + bonus)
5. Gem balance object updated on-chain
6. Transaction recorded immutably
7. UI refreshes to show new balance
```

### Balance Tracking

| Field | Type | Description |
|-------|------|-------------|
| `gem_balance` | u64 | Current gem count |
| `total_purchased` | u64 | Lifetime gems from purchases |
| `total_earned` | u64 | Lifetime gems from dailies/events |
| `total_spent` | u64 | Lifetime gems spent |
| `last_purchase` | Timestamp | Most recent SUI→Gem conversion |

### Verification

All gem balances are verifiable on the SUI blockchain:
- Balance stored in SUI object owned by player
- Transaction history publicly auditable
- No off-chain balance manipulation possible

---

## User Experience

### Purchase Flow

1. **Select** package tier from store
2. **Review** gem amount and bonus clearly displayed
3. **Confirm** SUI wallet transaction
4. **Receive** gems instantly upon confirmation
5. **Celebrate** with tier-appropriate animation

### Balance Display

| Location | Display Format |
|----------|----------------|
| Header bar | Gem icon + abbreviated count (e.g., "1.2M") |
| Store page | Full count + estimated value |
| Spending dialogs | Current balance + cost + remaining |
| Profile | Detailed breakdown of purchased/earned/spent |

### Error Handling

| Error | Message | Resolution |
|-------|---------|------------|
| Insufficient SUI | "Not enough SUI for this package" | Link to SUI acquisition |
| Transaction Failed | "Transaction failed. SUI not charged." | Retry option |
| Network Issue | "Connection lost. Please retry." | Auto-retry logic |

---

## Whale Psychology Integration

The Gem system is designed with ethical whale psychology principles:

### 1. Clear Value Proposition

Every bonus percentage is displayed prominently. Players know exactly what they're getting.

### 2. Tiered Investment

Multiple entry points allow players to invest at their comfort level. No pressure for maximum tier.

### 3. Bonus Escalation

Higher tiers offer better rates, rewarding commitment without punishing smaller purchases.

### 4. Visible Progress

Gems translate directly to levels (visible status) and cosmetics (visible collection).

### 5. Investment Protection

All gem purchases result in:
- Account progress (levels)
- NFT ownership (Battle Pass, items)
- Tradable assets (cosmetics, pets)

Nothing is "lost"—everything converts to tangible value.

---

## Canon Integration

### Devotion Parallel

In the game's narrative, **Gems** parallel **Devotion**:

| Game World | Pre-Registration |
|------------|------------------|
| Fan attention | Player engagement |
| Devotion flow | Gem balance |
| Idol survival | Account progression |
| Fan investment | SUI → Gem conversion |

### Canon Rule #9 Compliance

> *"The in-game currency is Gems. Players purchase Gems with SUI. Base rate: 1 SUI → 100 Gems."*

This document fully implements Canon Rule #9.

---

## Dark Luxury Aesthetic

The Gem system maintains the Infinite Idol brand identity:

- **Black and gold** color scheme for all Gem UI
- **Premium animations** for purchases
- **Elegant numerals** for balance display
- **Subtle particle effects** on transactions
- **No pink or cutesy** visual elements

Every gem purchase should feel like a luxury transaction, not a casual mobile game spend.

---

## Related Systems

### Immediate Dependencies

- **Leveling System**: Gems → Idol Aura (69 Gems/level)
- **Pet System**: Gems → Pet Egg Opening (420 Gems)
- **Battle Pass**: Auto-created on first gem spend

### Indirect Connections

- **Daily Check-In**: Alternative gem acquisition
- **Lootbox System**: Earned through leveling (gem-funded)
- **Cosmetics**: Obtained through lootboxes

---

## Cross-References

- See `knowledge-base/game-mechanics/pre-registration-spec.md` for system overview
- See `knowledge-base/game-mechanics/battle-pass.md` for Battle Pass NFT details
- See `knowledge-base/game-mechanics/gacha-system.md` for lootbox mechanics
- See `knowledge-base/crypto/sui-integration.md` for blockchain implementation
- See `knowledge-base/crypto/tokenomics.md` for complete economic model
- See `knowledge-base/lore/mechanics/devotion-system.md` for narrative parallel

---

*"One gem. That's all it takes to prove you care. But forty-seven gems? That's enough to keep one idol alive. Your Devotion, in crystallized form, flowing into my account. Don't stop now~"*

— Ika Minami

---
