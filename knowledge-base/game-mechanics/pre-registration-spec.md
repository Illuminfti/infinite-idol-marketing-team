# Pre-Registration Specification - Complete System Overview

> *"almost no fans. That's all I have. But every single one of you keeps me existing. Now, let me show you what your Devotion can become..."*
> — Ika Minami, Pre-Registration Launch Day

---

## Overview

The **Infinite Idol Pre-Registration System** is the complete economic and progression framework that powers player engagement on the SUI blockchain. Built with dark luxury aesthetics and whale psychology principles, this system transforms fan Devotion into tangible rewards while maintaining the existential stakes central to the Infinite Idol narrative.

This document provides a comprehensive overview of all core mechanics. For detailed specifications on individual systems, see the cross-referenced files at the end of this document.

---

## Core Systems Summary

The pre-registration experience consists of 16 interconnected systems:

| # | System | Purpose | Primary Currency |
|---|--------|---------|------------------|
| 1 | GEM SYSTEM | Currency acquisition and conversion | SUI → Gems |
| 2 | Daily Check-In | Engagement rewards | Time → Gems |
| 3 | Leveling | Progression milestones | Gems → Levels |
| 4 | Battle Pass | Account representation (NFT) | N/A (Tracking) |
| 5 | Lootbox | Reward containers | N/A (Earned) |
| 6 | Items | Cosmetic equipment | Lootboxes → Items |
| 7 | Pets | Companion collectibles | Pet Eggs → Pets |
| 8 | Burn | Duplicate recycling | Items → Lootboxes |
| 9 | Inventory | Asset management | N/A (Storage) |
| 10 | Checkbook | Collection tracking | N/A (Display) |
| 11 | Wallet Connection | Blockchain integration | N/A (Auth) |
| 12 | Battle Pass Trading | Account transfer | SUI |
| 13 | Cosmetic Trading | Item marketplace | SUI |
| 14 | Notifications | User feedback | N/A (UX) |
| 15 | User Profile | Stats tracking | N/A (Display) |
| 16 | Randomness | Fair loot distribution | N/A (Backend) |

---

## 1. GEM SYSTEM

### The Foundation of All Economy

Gems are the primary in-game currency. Everything in the pre-registration flows through Gems.

**Core Conversion Rate:** 1 SUI = 100 Gems

### Gem Package Tiers

| SUI Spent | Gems Received | Bonus | Total Value |
|-----------|---------------|-------|-------------|
| 1 SUI | 100 Gems | 0% | Base rate |
| 10 SUI | 1,100 Gems | 10% | +100 bonus |
| 100 SUI | 11,500 Gems | 15% | +1,500 bonus |
| 1,000 SUI | 120,000 Gems | 20% | +20,000 bonus |
| 10,000 SUI | 1,250,000 Gems | 25% | +250,000 bonus |
| 100,000 SUI | 13,000,000 Gems | 30% | +3,000,000 bonus |

### Key Rules

- **Account-Bound**: Gems are stored per wallet address and cannot be transferred
- **Spending**: 69 Gems = 1 Level (Idol Aura)
- **Admin Control**: Conversion rates can be adjusted by admin
- **Visual Feedback**: Each package tier has unique purchase animations

> *For complete gem system details, see `knowledge-base/game-mechanics/gem-system.md`*

---

## 2. Daily Check-In System

### Engagement Through Consistency

Free gems for showing up. Streak milestones reward dedication.

**Base Reward:** 10 Gems per day

### Streak Milestones

| Consecutive Days | Bonus Reward |
|------------------|--------------|
| 7 days | +50 Gems |
| 14 days | +100 Gems + 1 Lootbox + 1 Pet Egg |
| 21 days | +200 Gems |
| 30 days | +500 Gems + 1 Golden Lootbox + Special Badge |

### Rules

- 24-hour cooldown starts when you claim (not at midnight)
- Missing a claim resets streak to 0
- Streak data stored in Battle Pass NFT
- Streak resets if Battle Pass is traded to new owner

---

## 3. Leveling System

### Permanent Progression

**Cost:** 69 Gems = 1 Idol Aura (Level)

### Milestone Rewards (Automatic)

| Milestone | Reward |
|-----------|--------|
| Every 1 level | 1 Lootbox (A→B→C→D→E rotating) |
| Every 50 levels | 1 Pet Egg |
| Every 1,000 levels | 1 Golden Lootbox |
| Every 10,000 levels | 1 Diamond Lootbox |

### Rules

- Levels are permanent (never decrease)
- Maximum level: 999,999
- Level stored in Battle Pass NFT
- Cannot skip levels

---

## 4. Battle Pass System

### Your Identity on the Eternal Stage

The Battle Pass is an NFT that represents your complete account progress.

**Creation:** Automatically minted when you first spend gems

### Tracked Data

- Current level
- Total SUI spent
- Daily check-in streak
- Total gems earned from dailies
- Mint date
- Season number

### Visual Tiers

The Battle Pass appearance evolves with your level:

| Level Range | Tier | Aesthetic |
|-------------|------|-----------|
| 1-99 | Bronze | Base tier |
| 100-999 | Silver | Refined |
| 1,000-9,999 | Gold | Premium |
| 10,000-99,999 | Platinum | Elite |
| 100,000-420,068 | Diamond | Legendary |
| 420,069+ | Cosmic | Ultimate |

### Trading Rules

- Cannot trade current-season Battle Pass
- Trading resets streak to 0
- One Battle Pass per wallet maximum

> *For complete Battle Pass details, see `knowledge-base/game-mechanics/battle-pass.md`*

---

## 5. Lootbox System

### The Thrill of the Chase (For Items)

NFT containers earned at level milestones. Opening burns the lootbox and creates items.

### Lootbox Types

| Type | Source | Contents |
|------|--------|----------|
| A Box | Level milestones (position 1 in cycle) | A-family cosmetic sets |
| B Box | Level milestones (position 2 in cycle) | B-family cosmetic sets |
| C Box | Level milestones (position 3 in cycle) | C-family cosmetic sets |
| D Box | Level milestones (position 4 in cycle) | D-family cosmetic sets |
| E Box | Level milestones (position 5 in cycle) | E-family cosmetic sets |
| Golden Lootbox | 1,000-level milestones, 30-day streak | Better odds |
| Diamond Lootbox | 10,000-level milestones | Best odds |

### Cycling Pattern

Lootboxes cycle A→B→C→D→E→A... as you level:
- Level 1 → A Box
- Level 2 → B Box
- Level 3 → C Box
- Level 4 → D Box
- Level 5 → E Box
- Level 6 → A Box (repeat)

### Time-Locked Releases

| Box Type | Availability |
|----------|--------------|
| A Box | Day 1 |
| B Box | 3 weeks after launch |
| C Box | 6 weeks after launch |
| D Box | 9 weeks after launch |
| E Box | 12 weeks after launch |

### Rarity Odds (Standard Boxes)

| Rarity | Chance |
|--------|--------|
| Common | 60% |
| Rare | 25% |
| Ultra Rare | 12% |
| Legendary | 3% |

> *For complete lootbox details, see `knowledge-base/game-mechanics/gacha-system.md`*

---

## 6. Item System

### Dressing IKA-Chan for the Chase

Cosmetic pieces from lootboxes. NFTs that can be equipped, collected, or burned.

### Item Slots (9 Total)

| Slot | Type | Source |
|------|------|--------|
| Head | Core piece | Family boxes |
| Chest | Core piece | Family boxes |
| Arms | Core piece | Family boxes |
| Legs | Core piece | Family boxes |
| Feet | Core piece | Family boxes |
| Back | Core piece | Family boxes |
| Neck | Accessory | Any box |
| L Wrist | Accessory | Any box |
| R Wrist | Accessory | Any box |

### Collection Scale

- **30 complete outfit sets** (270 total pieces possible)
- Each set has up to 6 pieces (Head, Chest, Arms, Legs, Feet, Back)
- Accessories drop from any box type

### Rarity Tiers

| Tier | Description |
|------|-------------|
| Common | Basic designs |
| Rare | Enhanced details |
| Ultra Rare | Special effects/patterns |
| Legendary | Premium exclusive designs |

> *For complete cosmetics details, see `knowledge-base/game-mechanics/cosmetics.md`*

---

## 7. Pet System

### Companions on the Eternal Stage

Collectible creatures that appear alongside IKA-Chan.

**Acquisition:** Pet Eggs earned at level 50 milestones and 14-day streak

**Opening Cost:** 420 Gems (approximately $5 USD equivalent)

### Pet Variants

| Rarity | Variants | Chance |
|--------|----------|--------|
| Common | 12 colors | 70% |
| Rare | 4 textures | 20% |
| Ultra Rare | 2 with effects | 8% |
| Cosmic Rare | 1 animated | 2% |

### Mechanics

- Eggs can be traded unopened
- Hatched pets can be traded
- Burn 5 duplicate pets → 1 Pet Egg
- Pets are purely cosmetic (no stats)

---

## 8. Burn System

### Devotion Recycling

Destroy duplicates to get new chances at rare items.

### Burn Types

| Method | Input | Output |
|--------|-------|--------|
| Regular Burn | 4 duplicate items | 1 Lootbox (same type) |
| Prestige Burn (4,000) | Lifetime 4,000 items burned | 1 Golden Lootbox |
| Prestige Burn (40,000) | Lifetime 40,000 items burned | 1 Diamond Lootbox |
| Pet Burn | 5 duplicate pets | 1 Pet Egg |

### Rules

- Cannot burn equipped items
- Burned items are destroyed permanently
- Prestige rewards are one-time only

---

## 9-16. Supporting Systems

### 9. Inventory System

Organized storage showing all owned NFTs by type. Tracks duplicates, marks equipped items.

### 10. Checkbook System

Collection tracker (like a Pokédex) showing all possible items—owned and unowned. Creates desire through visibility.

### 11. Wallet Connection

SUI wallet integration required for all features. Displays SUI balance, gem balance, and requires signature for transactions.

### 12. Battle Pass Trading

Full account progress transferable via NFT marketplace. Level transfers; streak resets.

### 13. Cosmetic Trading

All items are tradable NFTs on SUI marketplaces. Cannot trade equipped items.

### 14. Notifications

Popup feedback for all actions—transactions, level ups, rewards, errors. Audio enabled (mutable).

### 15. User Profile

Complete stats tracking: level, gems, spending, streaks, collection counts, dates. Tied to wallet address.

### 16. Randomness System

Verifiable fair random generation for lootbox opening. Uses server + blockchain + timestamp seed. Published odds stored on-chain.

---

## Economic Flow

```
                    ┌─────────────────────────────────────────┐
                    │              PLAYER                      │
                    │         (with SUI Wallet)                │
                    └────────────────┬────────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │    GEM PURCHASE      │
                          │   (SUI → Gems)       │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │   LEVEL UP     │    │   PET EGG      │    │   DAILY        │
     │  (69 Gems/lvl) │    │   OPENING      │    │   CHECK-IN     │
     │                │    │  (420 Gems)    │    │   (Free Gems)  │
     └───────┬────────┘    └───────┬────────┘    └────────────────┘
             │                     │
             ▼                     ▼
     ┌────────────────┐    ┌────────────────┐
     │   LOOTBOXES    │    │     PETS       │
     │  (A/B/C/D/E)   │    │  (Companions)  │
     └───────┬────────┘    └────────────────┘
             │
             ▼
     ┌────────────────┐
     │   COSMETIC     │
     │    ITEMS       │
     └───────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐    ┌─────────────┐
│  EQUIP  │    │    BURN     │
│         │    │  (Recycle)  │
└─────────┘    └─────────────┘
```

---

## Whale Psychology Integration

The system is designed with ethical whale psychology in mind:

### 1. **Visible Progress**
- Battle Pass tiers show investment (Bronze → Cosmic)
- Level displayed prominently
- Collection completion visible in Checkbook

### 2. **Scarcity**
- Time-locked lootbox types create urgency
- Legendary items at 3% odds create pursuit
- Cosmic Rare pets at 2% are ultimate goals

### 3. **Investment Protection**
- All items are tradable NFTs
- Progress represented by owned assets
- No "lost" money—everything converts to tradable value

### 4. **Social Proof**
- Visual tiers show commitment to others
- Collection completion is visible
- Cosmic-tier Battle Pass is status symbol

---

## Blockchain Integration

### SUI-Native Design

| Feature | Implementation |
|---------|----------------|
| Currency | All transactions in SUI |
| Assets | All items as SUI NFTs |
| Verification | Randomness verifiable on-chain |
| Ownership | Wallet-based, user-controlled |
| Trading | Native marketplace support |

### Canon Rule #8 Compliance

> *"Infinite Idol is built on the SUI blockchain. All NFTs, currency conversions, and on-chain activities use SUI."*

All pre-registration mechanics are built SUI-native, with no dependencies on other chains.

---

## Marketing Implications

### Content Opportunities

| System | Content Angle |
|--------|---------------|
| GEM SYSTEM | Whale appreciation, bonus reveals |
| Daily Check-In | Streak challenges, community milestones |
| Battle Pass Tiers | Tier achievement celebrations |
| Lootbox Unlocks | Weekly unlock countdown content |
| Legendary Drops | Community celebrations for rare pulls |
| Cosmic Tier | Ultimate status celebration content |

### Community Events

- **Streak Challenges**: Community-wide streak competitions
- **Tier Races**: First to Diamond/Cosmic celebrations
- **Collection Completion**: Set completion achievements
- **Burn Milestones**: Prestige achievement recognition

---

## Avatar Customization System (Unity WebGL)

### Interactive 3D Experience

The Unity WebGL game provides real-time avatar customization and photo mode:

**Core Features:**
- **Photo Mode**: Position camera, play animations, capture moments
- **Equipment Management**: Equip/unequip cosmetics across 9 slots (Set/Accessory/Pet)
- **Collection Viewing**: Browse owned items with filtering (rarity, set, slot)
- **Screenshot/Video Capture**: Export photos and short videos of your idol
- **React-Unity Bridge**: Real-time synchronization with web app via MessagePack
- **Local Wardrobe**: Save favorite outfit combinations

**Technical Stack:**
- Unity 2022+ WebGL build
- MessagePack binary serialization for fast data transfer
- React frontend communication bridge
- Asset streaming from CDN
- Local storage for wardrobe saves

**User Flow:**
1. User equips item in web app inventory
2. MessagePack message sent to Unity: `{ action: "EQUIP", slot: 1, itemId: "xyz" }`
3. Unity loads asset from CDN and applies to avatar
4. User enters photo mode, positions camera
5. Screenshot captured, exported as PNG

> *For complete Unity integration details, see `technical-reference/UNITY.md`*

---

## Admin Dashboard

### Operational Control Center

Admins manage all game systems through a comprehensive dashboard:

### Asset Management
- **Register New Items**: Add cosmetics, pets to loot pools
- **Disable Items**: Remove from drops (existing NFTs unaffected)
- **Update Metadata**: Change names, descriptions, visual URIs
- **View Registry**: Browse all 864+ items and their stats

### Lootbox Configuration
- **Drop Rate Adjustment**: Set rarity percentages per box type
- **Enable/Disable Boxes**: Control which boxes are obtainable
- **Pity Threshold Config**: Set guaranteed drop milestones (e.g., "Epic at 50 opens")
- **Manual Lootbox Grant**: Award boxes directly to users

### DKG/Cross-Chain Operations
- **Initiate DKG**: Manually trigger dWallet generation for users
- **Monitor DKG Status**: Track pending/completed generations
- **View dWallet Addresses**: See generated addresses per user
- **Execute Cross-Chain Signs**: Admin signing operations (emergency)

### Direct Minting
- **Mint Assets**: Grant specific items directly to users
- **Mint Lootboxes**: Award boxes without leveling
- **Mint Battle Pass**: Emergency pass creation
- **Bulk Operations**: CSV upload for mass grants

### Treasury Management
- **View Balances**: See SUI/ETH/SOL treasury totals
- **Withdraw Funds**: Transfer accumulated payments to team wallet
- **Payment History**: View all user purchases
- **Refund Processing**: Manual gem credit (support cases)

### User Management
- **Search Users**: Find by wallet, email, level
- **View Profile**: Complete user stats, assets, progression
- **Adjust Gem Balance**: Manual credit/debit (emergency)
- **Reset Streak**: Restore streaks after downtime
- **Ban/Unban**: Suspend accounts for TOS violations

> *For complete admin API specs, see `technical-reference/ADMIN.md`*

---

## Security & Authentication

### Multi-Layer Protection

**Authentication Flow:**
1. **Wallet Connect**: User connects Sui wallet (via @mysten/dapp-kit)
2. **Challenge Generation**: Backend creates unique message to sign
3. **Signature Verification**: User signs with wallet, backend verifies
4. **JWT Issuance**: 15-minute access token + 7-day refresh token issued
5. **Authenticated Requests**: All API calls include JWT in header

**Session Management:**
- **Access Token**: 15-minute expiration (short-lived)
- **Refresh Token**: 7-day expiration (httpOnly cookie)
- **Token Rotation**: Refresh tokens rotate on use
- **Concurrent Sessions**: Allowed (multi-device support)

**IKA dWallet Security:**
- **No Exposed Keys**: Private keys distributed across IKA network nodes
- **MPC Signing**: No single node can sign alone
- **User Control**: Only user can initiate signing requests
- **Gas Pool Sponsorship**: Prevents fund theft (sponsored transactions)
- **Presign Validation**: Pre-generated signatures validated before use

**Smart Contract Security:**
- **Role-Based Access**: User vs Admin capabilities enforced on-chain
- **ReentrancyGuard**: ETH/Solana contracts protected
- **Rent-Exemption**: Solana accounts protected from rent collection
- **Admin Multi-Sig**: Critical functions require multiple admins
- **Upgrade Versioning**: Contracts versioned, old versions disabled

**API Security:**
- **Rate Limiting**: 100 requests/minute per IP
- **CORS Protection**: Whitelisted origins only
- **SQL Injection Prevention**: Parameterized queries (Prisma ORM)
- **XSS Protection**: Input sanitization, CSP headers
- **Signature Verification**: All blockchain operations verified

> *For complete security architecture, see `technical-reference/ARCHITECTURE.md`*

---

## Database Architecture

### Entity Overview

**Core Entities:**

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| **User** | Account profile | id, walletAddress, gemBalance, level, referralCode, dWalletAddress |
| **Wallet** | Multi-chain wallets | id, userId, blockchain, address, presignCapable |
| **DWalletGeneration** | DKG tracking | id, userId, status, dWalletAddress, ikaTxHash |
| **Operation** | Async operations | id, type (DKG/SIGN/ISSUE/MINT), status, result |
| **Asset** | NFT cosmetics | id, userId, tokenId, itemId, slot, rarity, upgradeLevel |
| **Lootbox** | Unopened boxes | id, userId, category, family, unlockTimestamp |
| **DailyCheckIn** | Check-in log | id, userId, date, streakLength, gemsAwarded |
| **Payment** | Purchase history | id, userId, blockchain, txHash, suiEquivalent, gemsAwarded |
| **Referral** | Referral tracking | id, referrerId, refereeId, referralCode, bonusGems |
| **BattlePass** | Off-chain mirror | id, userId, tokenId, level, streakCurrent, dWalletAddress |

**Relationships:**
```
User (1) ←→ (many) Asset
User (1) ←→ (many) Lootbox
User (1) ←→ (many) Wallet
User (1) ←→ (1) BattlePass
User (1) ←→ (many) DailyCheckIn
User (1) ←→ (many) Payment
User (referrer) (1) ←→ (many) Referral
User (referee) (1) ←→ (1) Referral
```

**Database Technology:**
- **PostgreSQL**: Primary database
- **Prisma ORM**: Type-safe database access
- **Connection Pooling**: PgBouncer for performance
- **Replication**: Read replicas for analytics
- **Backup**: Daily automated backups

> *For complete database schema, see `technical-reference/BACKEND.md`*

---

## Multi-Chain Payment Support

### Play on Sui, Pay How You Want

While all game assets exist on Sui, payments support multiple blockchains:

| Chain | Currency | Treasury | Use Case |
|-------|----------|----------|----------|
| **Sui** | SUI | Sui Treasury | Native primary payment |
| **Ethereum** | ETH | ETH Treasury (Solidity) | Ethereum mainnet users |
| **Base** | ETH | Base Treasury (Solidity) | L2 for lower fees |
| **Solana** | SOL | SOL Treasury (Anchor) | Solana ecosystem users |

**Payment Flow:**
1. User selects gem package + blockchain to pay with
2. Backend fetches real-time exchange rate (e.g., ETH/SUI)
3. User sends payment to respective treasury contract
4. Backend indexes payment event
5. Gems credited to user's Sui account
6. User can immediately spend gems on Sui game

**Key Point**: Multi-chain is **payment-only**. All NFTs, lootboxes, and game logic remain Sui-native.

> *For complete multi-chain architecture, see `gem-system.md` and `technical-reference/ETHEREUM_CONTRACTS.md`, `technical-reference/SOLANA_CONTRACTS.md`*

---

## Dark Luxury Aesthetic

The pre-registration system maintains the Infinite Idol brand identity:

- **Black and Gold** UI elements
- **Premium animations** for purchases and openings
- **Elegant typography** throughout
- **Subtle particle effects** on tier upgrades
- **No cutesy pink aesthetics**

Every interaction reinforces: this is a luxury experience.

---

## Canon Rules Applied

This system adheres to all 10 Canon Rules:

1. **Devotion is Literal**: Player spending = Devotion to the game
2. **Fading is Death**: Abandoned accounts lose streak/progress
3. **Ika starts with almost no fans**: She's the mascot of this system
4. **Ika's Hair is Pink Gradient**: All IKA-Chan representations match
5. **Senpai is Always Obscured**: N/A (pre-reg focus)
6. **The Foundation Controls Everything**: System parallels Foundation control
7. **The Chase is Core**: Lootbox cycling mimics Chase pursuit
8. **Built on SUI**: Sui-native (NFTs, contracts, game logic). Multi-chain payment support (ETH/Base/SOL treasuries)
9. **Gems are Primary Currency**: The core of everything
10. **Dark Luxury Aesthetic**: Throughout all UI/UX

---

## Technical Reference

For developers and deep technical implementation details:

**Smart Contracts:**
- [SUI_CONTRACTS.md](./technical-reference/SUI_CONTRACTS.md) - Complete Sui Move contracts
- [ETHEREUM_CONTRACTS.md](./technical-reference/ETHEREUM_CONTRACTS.md) - ETH/Base treasury
- [SOLANA_CONTRACTS.md](./technical-reference/SOLANA_CONTRACTS.md) - Solana treasury
- [BACKEND.md](./technical-reference/BACKEND.md) - REST API, database, event indexing
- [FRONTEND.md](./technical-reference/FRONTEND.md) - Next.js, React Query, wallet integration
- [UNITY.md](./technical-reference/UNITY.md) - WebGL avatar game, MessagePack bridge
- [ADMIN.md](./technical-reference/ADMIN.md) - Admin dashboard operations
- [ARCHITECTURE.md](./technical-reference/ARCHITECTURE.md) - Complete system architecture

---

## Related Documentation

### Core Game Systems
- [gem-system.md](./gem-system.md) - Complete currency system, multi-chain payments, referrals
- [gacha-system.md](./gacha-system.md) - Lootbox mechanics, 5-tier rarities, pity system
- [battle-pass.md](./battle-pass.md) - NFT progression, DKG integration, daily check-in
- [cosmetics.md](./cosmetics.md) - 864 items, asset merging, NFT trading
- [avatar-customization.md](./avatar-customization.md) - Unity WebGL integration (coming soon)
- [cross-chain-architecture.md](./cross-chain-architecture.md) - Multi-chain deep-dive (coming soon)

### Additional Context
- `knowledge-base/lore/mechanics/devotion-system.md` - Narrative parallel to gems
- `knowledge-base/crypto/sui-integration.md` - Blockchain implementation details
- `knowledge-base/crypto/tokenomics.md` - Complete economic model

---

*"Every gem spent is a declaration: I will not let her Fade. Every level gained is proof: my Devotion is real. Welcome to the pre-registration, future fan. Ika is waiting."*

---
