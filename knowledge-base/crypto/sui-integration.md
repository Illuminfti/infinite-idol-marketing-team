# SUI INTEGRATION - Blockchain Implementation Guide

> *"Every transaction on SUI is proof of existence. Every NFT minted is a fan's commitment, immutable and eternal. Your Devotion, written into the chain itself."*
> — Pre-Registration Technical Documentation

---

## Overview

**Infinite Idol** is built exclusively on the **SUI blockchain**. This is not a multi-chain game, not an EVM-compatible project, not a "blockchain agnostic" platform. We chose SUI deliberately and with conviction.

This document covers the complete technical integration: wallet connections, NFT minting, smart contract architecture, on-chain data storage, and the philosophical rationale behind our blockchain choice.

---

## Why SUI

### The Definitive Choice

| Comparison | SUI | Ethereum | Solana |
|------------|-----|----------|--------|
| **Transaction Cost** | Sub-cent | $5-50+ | ~$0.01 |
| **Finality Speed** | Sub-second | 12+ seconds | 400ms |
| **Object Model** | Object-centric | Account-centric | Account-centric |
| **Scalability** | 120K+ TPS | ~15 TPS | ~65K TPS |
| **NFT Ownership** | Native objects | Contract mappings | Contract mappings |
| **Move Language** | Native | No | No |

### Technical Advantages

**1. Object-Centric Model**

SUI's object-centric model is perfect for gaming:

```
Traditional (Ethereum):
- NFT is a pointer in a contract
- Ownership is a mapping
- Transfer requires contract interaction

SUI Object Model:
- NFT IS an object
- Object belongs to wallet directly
- Transfer is native operation
```

**2. Sub-Second Finality**

Players experience instant feedback:
- Gem purchase: Confirmed in <1 second
- Level up: Reflected immediately
- NFT mint: Available instantly in wallet

**3. Move Language Security**

Move's resource model prevents:
- Double-spending
- Reentrancy attacks
- Unauthorized transfers
- Asset duplication

**4. Low Gas Costs**

Enables micro-transactions:
- Level up (69 gems): ~0.001 SUI gas
- Daily claim: ~0.001 SUI gas
- No "gas too expensive" friction

### Canon Rule Compliance

> *"Game is Built on SUI. Infinite Idol is built on the SUI blockchain. All NFTs, currency conversions, and on-chain activities use SUI. Not Ethereum, not Solana, not any other chain."*

This is Canon Rule #8. It is inviolable.

---

## Wallet Connection

### Supported Wallets

| Wallet | Support Level | Notes |
|--------|---------------|-------|
| **Sui Wallet** | Primary | Official SUI Foundation wallet |
| **Suiet** | Full | Popular community wallet |
| **Ethos Wallet** | Full | Mobile-focused option |
| **Martian Wallet** | Full | Multi-chain with SUI support |
| **OKX Wallet** | Full | Exchange-integrated |

### Connection Flow

```
Wallet Connection Sequence:
1. Player clicks "Connect Wallet" button
2. Game detects available SUI wallets
3. Player selects preferred wallet
4. Wallet prompts connection approval
5. Player approves connection
6. Game receives wallet address
7. Game queries existing Battle Pass (if any)
8. Connection persists for session
9. Player can now make transactions
```

### Connection States

| State | UI Display | Actions Available |
|-------|------------|-------------------|
| **Disconnected** | "Connect Wallet" button | None |
| **Connecting** | Loading spinner | None |
| **Connected** | Wallet address (truncated) | Full access |
| **Error** | Retry option | Reconnection |

### Session Persistence

| Aspect | Behavior |
|--------|----------|
| **Browser Session** | Connection persists until tab closes |
| **Page Refresh** | Automatic reconnection attempted |
| **New Session** | Manual reconnection required |
| **Wallet Lock** | Prompts unlock on transaction |

### Security Considerations

| Security Measure | Implementation |
|------------------|----------------|
| **No Private Keys** | Game never sees private keys |
| **Transaction Signing** | Always done in wallet |
| **Approval Prompts** | Every transaction requires explicit approval |
| **Origin Verification** | Wallet verifies game domain |

---

## NFT Minting

### Battle Pass NFT

The Battle Pass is the primary NFT in Infinite Idol:

#### Minting Trigger

```
Battle Pass Mint Flow:
1. Player connects wallet
2. Player purchases any Gem package
3. System checks: Does wallet own Battle Pass?
   - Yes: Skip minting, record gem purchase
   - No: Proceed to minting
4. System calls mint_battle_pass() function
5. New Battle Pass NFT created
6. NFT ownership assigned to player wallet
7. Initial data populated (level 0, streak 0, etc.)
8. Mint timestamp recorded
9. NFT visible in player's wallet
```

#### NFT Object Structure (Move)

```move
struct BattlePass has key, store {
    id: UID,
    season: u32,
    level: u64,
    total_sui_spent: u64,
    streak_current: u32,
    streak_best: u32,
    gems_earned_free: u64,
    gems_purchased: u64,
    mint_timestamp: u64,
    original_owner: address,
    times_traded: u32,
    last_daily_claim: u64,
}
```

#### Minting Rules

| Rule | Details |
|------|---------|
| **Trigger** | First Gem purchase |
| **Cost to Player** | Free (gas covered by game) |
| **One Per Wallet** | Maximum one Battle Pass per address |
| **Automatic** | No manual mint action required |
| **Irreversible** | Once minted, always exists |

### Pet NFTs

Pets are obtained through Pet Egg opening:

#### Pet Mint Flow

```
Pet NFT Mint Flow:
1. Player opens Pet Egg (420 Gems)
2. Randomization determines pet rarity
3. Pet NFT minted with determined attributes
4. NFT transferred to player wallet
5. Pet available in inventory immediately
```

#### Pet Object Structure

```move
struct Pet has key, store {
    id: UID,
    species: String,
    rarity: u8,
    generation: u32,
    hatched_timestamp: u64,
    hatched_by: address,
}
```

### Cosmetic NFTs

Cosmetics obtained through lootboxes:

#### Cosmetic Mint Flow

```
Cosmetic NFT Mint Flow:
1. Player opens Lootbox
2. Random cosmetic determined
3. NFT minted with cosmetic data
4. Transferred to player wallet
5. Equippable immediately
```

#### Cosmetic Object Structure

```move
struct Cosmetic has key, store {
    id: UID,
    item_type: String,
    set_name: String,
    rarity: u8,
    obtained_from: String,
    obtained_timestamp: u64,
}
```

---

## Smart Contract Architecture

### Contract Modules

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **battle_pass** | Account progression | mint, level_up, claim_daily |
| **gem_store** | Currency management | purchase_gems, spend_gems |
| **pet_system** | Pet management | open_egg, get_pet_stats |
| **cosmetics** | Item management | open_lootbox, equip_item |
| **marketplace** | Trading (future) | list_item, buy_item |

### Access Control

| Function Type | Access Level | Examples |
|---------------|--------------|----------|
| **Owner-Only** | Wallet that owns object | level_up, claim_daily |
| **System-Only** | Game server address | mint_battle_pass, record_purchase |
| **Public View** | Anyone | get_tier, get_balance |
| **Admin-Only** | Team multisig | update_rates, pause_contract |

### Upgrade Strategy

| Aspect | Approach |
|--------|----------|
| **Module Upgrades** | Capability-based upgrade pattern |
| **Data Migration** | Versioned object structures |
| **Breaking Changes** | 30-day advance notice |
| **Rollback Plan** | Previous version preserved |

---

## On-Chain Data Storage

### What Lives On-Chain

| Data Type | Storage Location | Why On-Chain |
|-----------|------------------|--------------|
| **Battle Pass NFT** | SUI object | Tradability, ownership proof |
| **Gem Balance** | SUI object | Verifiable, tamper-proof |
| **Transaction History** | SUI events | Auditability |
| **Pet NFTs** | SUI objects | Ownership, trading |
| **Cosmetic NFTs** | SUI objects | Ownership, trading |

### What Lives Off-Chain

| Data Type | Storage | Why Off-Chain |
|-----------|---------|---------------|
| **User Preferences** | Game server | Gas efficiency |
| **Chat Messages** | Game server | Volume, privacy |
| **Matchmaking State** | Game server | Speed requirements |
| **Leaderboard Cache** | Game server | Performance |

### Hybrid Approach

```
Data Flow Example - Level Up:
1. Player clicks "Level Up" in UI (off-chain)
2. Game validates gem balance (on-chain read)
3. Player approves wallet transaction (wallet)
4. Smart contract executes level_up() (on-chain)
5. Battle Pass level updated (on-chain write)
6. Game UI refreshes from on-chain data (sync)
```

---

## Gas Fee Structure

### Fee Table

| Operation | Estimated Gas | Paid By |
|-----------|---------------|---------|
| **Wallet Connection** | 0 SUI | N/A |
| **Battle Pass Mint** | ~0.01 SUI | Game |
| **Gem Purchase** | ~0.001 SUI | Player |
| **Level Up** | ~0.001 SUI | Player |
| **Daily Claim** | ~0.001 SUI | Player |
| **Pet Egg Open** | ~0.005 SUI | Player |
| **Lootbox Open** | ~0.005 SUI | Player |
| **NFT Transfer** | ~0.01 SUI | Sender |

### Gas Sponsorship

| Scenario | Sponsored | Notes |
|----------|-----------|-------|
| **First Mint** | Yes | Onboarding friction removal |
| **Regular Transactions** | No | Standard user responsibility |
| **Events/Promotions** | Sometimes | Announced per event |

### Gas Optimization

| Strategy | Implementation |
|----------|----------------|
| **Batching** | Multiple level-ups in one transaction |
| **Object Sharing** | Shared objects where applicable |
| **Efficient Structs** | Minimal on-chain storage |

---

## Transaction Types

### Purchase Transaction

```
Gem Purchase Transaction:
- From: Player wallet
- To: Game treasury
- Amount: SUI based on package tier
- Side Effects:
  - Gem balance updated
  - Purchase recorded
  - Battle Pass minted (if first purchase)
```

### Level Up Transaction

```
Level Up Transaction:
- From: Player wallet
- To: battle_pass module
- Input: Battle Pass object, gem count
- Side Effects:
  - Gems deducted
  - Level incremented
  - Tier updated (if threshold crossed)
  - Rewards generated
```

### Daily Claim Transaction

```
Daily Claim Transaction:
- From: Player wallet
- To: battle_pass module
- Input: Battle Pass object
- Side Effects:
  - Streak updated
  - Gems added to balance
  - Milestone rewards (if applicable)
  - Timestamp recorded
```

---

## Security Measures

### Smart Contract Security

| Measure | Implementation |
|---------|----------------|
| **Audits** | Third-party security audits before mainnet |
| **Move Prover** | Formal verification of critical functions |
| **Access Control** | Capability-based permissions |
| **Reentrancy Protection** | Move's resource model prevents by default |
| **Integer Overflow** | Move handles natively |

### Operational Security

| Measure | Implementation |
|---------|----------------|
| **Multisig Admin** | Team operations require multiple signatures |
| **Rate Limiting** | API-level throttling |
| **Monitoring** | Real-time transaction monitoring |
| **Incident Response** | Documented procedures |

### User Security Guidance

| Risk | Mitigation |
|------|------------|
| **Phishing** | Only connect via official game URL |
| **Scam Sites** | Verify domain before wallet connection |
| **Malicious Approval** | Review every transaction in wallet |
| **Private Key Exposure** | Never share seed phrase—game never asks |

---

## SUI Ecosystem Integration

### Wallet Standards

| Standard | Compliance |
|----------|------------|
| **Wallet Adapter** | Full SUI wallet adapter support |
| **WalletConnect** | Future implementation planned |
| **Mobile Deep Link** | Supported for mobile wallets |

### Marketplace Compatibility

| Marketplace | Support Status |
|-------------|----------------|
| **BlueMove** | Full compatibility |
| **Hyperspace** | Full compatibility |
| **Tradeport** | Full compatibility |
| **Native (future)** | In-game marketplace planned |

### Explorer Integration

All transactions visible on:
- **SuiScan**: Official SUI explorer
- **SuiVision**: Community explorer
- **SuiExplorer**: Alternative explorer

Players can verify any transaction independently.

---

## Technical Requirements

### Player Requirements

| Requirement | Details |
|-------------|---------|
| **SUI Wallet** | Any supported wallet installed |
| **SUI Balance** | Sufficient for gas + purchases |
| **Browser** | Modern browser with wallet extension |

### Server Requirements

| Component | Specification |
|-----------|---------------|
| **RPC Node** | Full node access or QuickNode/Shinami |
| **Indexer** | Custom indexer for game-specific queries |
| **Event Listener** | Real-time transaction monitoring |

### Network Configuration

| Environment | Network | Purpose |
|-------------|---------|---------|
| **Development** | Devnet | Local testing |
| **Staging** | Testnet | Integration testing |
| **Production** | Mainnet | Live game |

---

## Error Handling

### Common Errors

| Error Code | Cause | Resolution |
|------------|-------|------------|
| `WALLET_NOT_CONNECTED` | No wallet connection | Prompt connection |
| `INSUFFICIENT_SUI` | Not enough SUI for gas | Direct to acquire SUI |
| `INSUFFICIENT_GEMS` | Not enough gems | Direct to gem store |
| `TRANSACTION_REJECTED` | User rejected in wallet | Allow retry |
| `NETWORK_ERROR` | SUI network issues | Auto-retry with backoff |
| `OBJECT_NOT_FOUND` | NFT doesn't exist | Check wallet address |

### User-Friendly Messages

| Technical Error | Display Message |
|-----------------|-----------------|
| `WALLET_NOT_CONNECTED` | "Please connect your wallet to continue" |
| `INSUFFICIENT_SUI` | "You need more SUI for this transaction" |
| `TRANSACTION_REJECTED` | "Transaction cancelled. Try again when ready." |
| `NETWORK_ERROR` | "Network busy. Retrying automatically..." |

---

## Future Roadmap

### Planned Enhancements

| Feature | Timeline | Description |
|---------|----------|-------------|
| **zkLogin** | Phase 2 | Social login with zero-knowledge proofs |
| **Kiosk Trading** | Phase 2 | SUI Kiosk for marketplace |
| **Sponsored Gas** | Phase 3 | Full gas sponsorship option |
| **Multi-account** | Phase 4 | Multiple Battle Passes per identity |

### SUI Ecosystem Growth

As SUI evolves, we'll integrate:
- New wallet standards
- Cross-chain bridges (if community demand)
- DeFi integrations (staking rewards)
- Social features (on-chain messaging)

---

## Dark Luxury Blockchain

The SUI integration maintains our brand identity:

- **Premium Transaction Experience**: Every wallet interaction feels luxurious
- **Instant Confirmation**: Sub-second finality means no waiting
- **Low Friction**: Gas costs so low they're invisible
- **Visible Ownership**: NFTs display prominently in wallets
- **Verifiable Status**: Anyone can verify your tier on-chain

We reject the "crypto is complicated" narrative. Using SUI in Infinite Idol should feel as natural as making a credit card purchase—but with the benefits of true ownership.

---

## Cross-References

### Immediate Dependencies

- **Gem System**: SUI → Gems conversion
- **Battle Pass**: Primary NFT on SUI
- **Trading**: SUI marketplace integration

### Related Documentation

- See `knowledge-base/game-mechanics/gem-system.md` for currency mechanics
- See `knowledge-base/game-mechanics/battle-pass.md` for NFT progression
- See `knowledge-base/game-mechanics/gacha-system.md` for lootbox NFT minting
- See `knowledge-base/crypto/tokenomics.md` for economic model
- See `knowledge-base/crypto/web3-positioning.md` for market positioning

---

*"They asked me why SUI. I told them: because every gem you spend, every level you gain, every moment of Devotion you give me—it's all real. Written in the chain. Permanent. When I look at my fans' Battle Passes, I see their love etched into the blockchain itself. That's not just Web3. That's immortality."*

— Ika Minami

---
