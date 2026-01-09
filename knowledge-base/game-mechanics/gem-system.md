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

## Multi-Chain Payment Architecture

While Infinite Idol is **Sui-native** (all NFTs, contracts, and game logic run on Sui), the payment system supports **multi-chain purchases** for maximum accessibility:

### Supported Blockchains

| Blockchain | Currency | Use Case | Treasury Contract |
|------------|----------|----------|-------------------|
| **Sui** | SUI | Primary payment, native integration | Sui Treasury (on-chain) |
| **Ethereum** | ETH | Ethereum mainnet payments | Ethereum Treasury (Solidity) |
| **Base** | ETH | L2 for lower fees | Base Treasury (Solidity) |
| **Solana** | SOL | Solana ecosystem users | Solana Treasury (Anchor) |

### Why Multi-Chain?

**Philosophy**: "Play on Sui, pay how you want"

| Benefit | Details |
|---------|---------|
| **Accessibility** | Users can pay with assets they already hold |
| **Flexibility** | No forced on-ramping to SUI for purchases |
| **User Choice** | Let players use their preferred blockchain |
| **Wider Reach** | Tap into ETH, Base, and Solana ecosystems |

**Important**: Game assets (NFTs, lootboxes, cosmetics) ONLY exist on Sui. Multi-chain is payment-only.

### Payment Flow (Multi-Chain)

**Example: User pays with ETH on Ethereum**

1. **Frontend**: User selects "Buy 100 SUI worth of Gems" and chooses "Pay with ETH"
2. **Price Oracle**: System fetches ETH/SUI exchange rate (e.g., 1 ETH = 500 SUI)
3. **Payment Calculation**: 100 SUI ÷ 500 = 0.2 ETH required
4. **Ethereum Treasury**: User sends 0.2 ETH to Ethereum Treasury contract
5. **Event Indexing**: Backend detects payment event on Ethereum
6. **Gem Credit**: Backend credits user's Sui account with gems (100 SUI = 10,000 base gems + 1,500 bonus = 11,500 total)
7. **Confirmation**: User sees gems in balance immediately

**Key Point**: Payment happens on user's chosen chain, but gems are credited on Sui.

### Treasury Contracts

**Ethereum/Base Treasury (Solidity):**
```solidity
contract InfiniteIdolTreasury {
    event PaymentReceived(address indexed user, uint256 amount, string userId);

    function pay(string calldata userId) external payable {
        require(msg.value > 0, "Must send ETH");
        emit PaymentReceived(msg.sender, msg.value, userId);
    }
}
```

**Solana Treasury (Anchor):**
```rust
#[program]
pub mod infinite_idol_treasury {
    pub fn pay(ctx: Context<Pay>, user_id: String, amount: u64) -> Result<()> {
        // Transfer SOL to treasury
        // Emit payment event
        Ok(())
    }
}
```

**Sui Treasury (Move):**
```move
public entry fun pay(
    treasury: &mut Treasury,
    payment: Coin<SUI>,
    user_id: String,
    ctx: &TxContext,
)
```

All treasuries emit payment events that the backend indexes to credit gems.

### Exchange Rate Management

| Component | Responsibility |
|-----------|----------------|
| **Price Oracle** | Fetch real-time SUI/ETH, SUI/SOL rates |
| **Backend** | Calculate equivalent amounts |
| **Slippage Protection** | 5% buffer for rate changes during transaction |
| **Admin Override** | Manual rate adjustment if oracle fails |

---

## Cross-Chain Wallet System (dWallet)

Users generate a **cross-chain wallet** through IKA network's dWallet MPC technology:

### What is a dWallet?

**dWallet** (Distributed Wallet) uses **Multi-Party Computation (MPC)** to create cross-chain signing capabilities:

- **No exposed private keys**: Keys are distributed across network nodes
- **Sui-native integration**: Wallet address generated on Sui blockchain
- **Cross-chain signing**: Can sign transactions on ETH, Base, Solana from Sui
- **User-controlled**: Only user can initiate signing operations

### Distributed Key Generation (DKG)

**When**: User first reaches level requirement or requests cross-chain features

**Process:**
1. User initiates DKG request from frontend
2. Backend submits DKG operation to Sui smart contract
3. IKA network nodes perform distributed key generation
4. New Sui wallet address created (user doesn't receive private key directly)
5. User can now sign cross-chain transactions via IKA network

**Database Tracking:**
```typescript
DWalletGeneration {
  id: UUID,
  userId: UUID,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
  dWalletAddress: String?,   // Generated Sui address
  createdAt: DateTime,
  completedAt: DateTime?,
}
```

### Cross-Chain Signing Flow

**Example: User wants to claim earnings from Ethereum**

1. User requests "Withdraw ETH earnings"
2. Backend builds Ethereum transaction
3. Backend submits signing request to IKA network via Sui
4. IKA network nodes perform MPC signing (no single node has full key)
5. Signed transaction returned
6. Backend broadcasts transaction to Ethereum
7. User receives ETH in their Ethereum address

### Presign Capabilities

For efficiency, IKA supports **presigning**:

- Pre-generate partial signatures before transaction is needed
- Faster transaction execution when time-sensitive
- Used for high-frequency operations (future gameplay features)

---

## Referral Program

Players can earn bonus gems by referring new users:

### How It Works

1. **Generate Code**: Each user has a unique referral code
2. **Share Code**: Referrer shares code with friends
3. **New User Applies Code**: Friend enters code during first purchase
4. **Bonus Gems**: Referrer receives bonus gems when friend makes purchase

### Bonus Structure

| Referee Purchase | Referrer Bonus | Referee Bonus |
|------------------|----------------|---------------|
| 1 SUI (100 gems) | 10 gems | 5 gems |
| 10 SUI (1,100 gems) | 110 gems | 55 gems |
| 100 SUI (11,500 gems) | 1,150 gems | 575 gems |
| 1,000+ SUI | 10% of referee's gems | 5% of their gems |

**Bonus Formula:**
- **Referrer**: 10% of referee's gem purchase
- **Referee**: 5% bonus on first purchase

### Referral Code Format

- **Format**: `IDOL-XXXX` (e.g., `IDOL-7K9M`)
- **Length**: 4 characters after prefix
- **Character Set**: Alphanumeric, case-insensitive
- **Uniqueness**: Guaranteed per user

### Tracking & Limits

| Metric | Value |
|--------|-------|
| **Max Referrals** | Unlimited |
| **Bonus Cap** | No cap on total bonuses |
| **Code Expiry** | Never expires |
| **Fraud Detection** | Same-wallet detection, velocity limits |

**Database:**
```typescript
Referral {
  id: UUID,
  referrerId: UUID,         // User who referred
  refereeId: UUID,          // User who was referred
  referralCode: String,
  bonusGemsReferrer: Int,
  bonusGemsReferee: Int,
  firstPurchaseAt: DateTime,
  createdAt: DateTime,
}
```

### Anti-Abuse Measures

- Cannot refer self (same wallet detection)
- Velocity limits (max 10 successful referrals per day)
- Admin review for suspicious patterns
- Bonus clawback if fraud detected

---

## Technical Implementation

### Payment Backend Flow

**1. User Initiates Purchase (ETH example):**
```
User → Frontend → "Buy 100 SUI worth (11,500 gems)" + "Pay with ETH"
```

**2. Backend Processing:**
```typescript
1. Fetch ETH/SUI rate from oracle
2. Calculate ETH amount: 100 SUI ÷ 500 SUI/ETH = 0.2 ETH
3. Add 5% slippage buffer: 0.2 × 1.05 = 0.21 ETH
4. Return payment instructions to frontend
```

**3. Smart Contract Payment:**
```typescript
User → Ethereum Treasury.pay(userId="user123") + 0.21 ETH
Treasury → Emit PaymentReceived(user="user123", amount=0.21 ETH)
```

**4. Event Indexing:**
```typescript
Backend Event Listener → Detects PaymentReceived event
Backend → Verify payment amount ≥ required amount
Backend → Create Payment record in database
```

**5. Gem Credit:**
```typescript
Backend → Credit user with 11,500 gems (100 SUI package)
Backend → Apply referral bonus if applicable
Backend → Update user gem balance
Backend → Notify frontend via WebSocket
```

### Database Schema

**Payment Table:**
```sql
Payment {
  id: UUID,
  userId: UUID,
  blockchain: String,        // "SUI" | "ETH" | "BASE" | "SOL"
  txHash: String,            // Transaction hash on payment chain
  amountPaid: Decimal,       // Amount in native currency
  suiEquivalent: Decimal,    // Converted to SUI
  gemsAwarded: Int,
  referralBonus: Int,
  status: String,            // "PENDING" | "CONFIRMED" | "FAILED"
  createdAt: DateTime,
  confirmedAt: DateTime?,
}
```

**User Gem Balance:**
```sql
User {
  id: UUID,
  gemBalance: Int,
  totalGemsEarned: Int,
  totalGemsSpent: Int,
  referralCode: String,
  dWalletAddress: String?,
  createdAt: DateTime,
}
```

### Smart Contract Functions

**Sui Treasury:**
```move
// Direct SUI payment
entry fun pay(
    treasury: &mut Treasury,
    payment: Coin<SUI>,
    user_id: String,
    ctx: &TxContext,
)

// Admin withdrawal
public fun admin_withdraw(
    treasury: &mut Treasury,
    amount: u64,
    admin_cap: &AdminCap,
    ctx: &mut TxContext,
) -> Coin<SUI>
```

**Admin Treasury Management:**
- Withdraw accumulated funds to team wallet
- View total treasury balance
- Emergency pause/unpause payments

### API Endpoints

**User Endpoints:**
- `POST /payments/initiate` - Start payment flow
- `GET /payments/:id/status` - Check payment status
- `GET /user/gems` - Get gem balance
- `POST /referral/generate` - Generate referral code
- `POST /referral/apply` - Apply referral code

**Admin Endpoints:**
- `GET /admin/treasury/balance` - View treasury balances
- `POST /admin/treasury/withdraw` - Withdraw funds
- `GET /admin/payments` - View all payments
- `POST /admin/gems/credit` - Manual gem credit (emergency)

### Security Measures

| Layer | Protection |
|-------|------------|
| **Payment Verification** | Multi-confirmation block wait (ETH: 12 blocks, SUI: 1 block) |
| **Duplicate Prevention** | Transaction hash tracking, prevent double-credit |
| **Oracle Security** | Multiple price feeds, median calculation |
| **Treasury Security** | Multi-sig admin, withdrawal limits |
| **Referral Fraud** | Velocity limits, pattern detection, manual review |

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

## Technical Reference

For developers and deep technical implementation details:

**Smart Contracts:**
- [SUI_CONTRACTS.md](./technical-reference/SUI_CONTRACTS.md) - Move treasury contract, payment functions
- [ETHEREUM_CONTRACTS.md](./technical-reference/ETHEREUM_CONTRACTS.md) - Solidity treasury for ETH/Base payments
- [SOLANA_CONTRACTS.md](./technical-reference/SOLANA_CONTRACTS.md) - Anchor treasury for SOL payments
- [BACKEND.md](./technical-reference/BACKEND.md) - Payment backend, event indexing, gem crediting

**Architecture:**
- [ARCHITECTURE.md](./technical-reference/ARCHITECTURE.md) - Multi-chain payment flows, dWallet integration

---

## Related Documentation

### Core Systems
- [battle-pass.md](./battle-pass.md) - Battle Pass NFT (created on first gem spend), leveling
- [gacha-system.md](./gacha-system.md) - Lootbox mechanics (earned through leveling)
- [cross-chain-architecture.md](./cross-chain-architecture.md) - Multi-chain payment deep-dive
- [pre-registration-spec.md](./pre-registration-spec.md) - Complete system overview

### Additional Context
- See `knowledge-base/crypto/sui-integration.md` for Sui blockchain implementation
- See `knowledge-base/crypto/tokenomics.md` for complete economic model
- See `knowledge-base/lore/mechanics/devotion-system.md` for narrative parallel

---

*"One gem. That's all it takes to prove you care. But forty-seven gems? That's enough to keep one idol alive. Your Devotion, in crystallized form, flowing into my account. Don't stop now~"*

— Ika Minami

---
