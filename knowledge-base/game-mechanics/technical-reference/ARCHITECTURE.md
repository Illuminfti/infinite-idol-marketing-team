# System Architecture

## Overview

Infinite Idol is a multi-chain Web3 gaming platform that combines traditional gaming elements with blockchain-based ownership of in-game assets. The system uses IKA's dWallet technology for cross-chain signing capabilities.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────┬───────────────────────┬───────────────────────────────┤
│    Frontend     │      Admin Panel      │         Unity Game            │
│   (Next.js)     │      (Next.js)        │         (WebGL)               │
│                 │                       │                               │
│ - Dashboard     │ - User management     │ - Avatar customization        │
│ - Wallet auth   │ - Asset management    │ - Photo mode                  │
│ - Check-ins    │ - Transaction exec    │ - Animation system            │
│ - Level ups     │ - Lootbox config      │ - Collection viewing          │
│ - Payments      │ - Pity thresholds     │ - React bridge integration    │
└────────┬────────┴───────────┬───────────┴───────────────┬───────────────┘
         │                    │                           │
         │           REST API (JWT Auth)                  │
         │                    │                           │
┌────────┴────────────────────┴───────────────────────────┴───────────────┐
│                             API LAYER                                    │
│                         Backend (Hono.js)                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Auth     │  │    User     │  │   Admin     │  │   Public    │    │
│  │   Module    │  │   Module    │  │   Module    │  │   Module    │    │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤    │
│  │ - Login     │  │ - Profile   │  │ - Tx Exec   │  │ - Health    │    │
│  │ - Verify    │  │ - DKG       │  │ - Assets    │  │ - Checkbook │    │
│  │ - Logout    │  │ - Sign      │  │ - Lootbox   │  │ - Indexing  │    │
│  │ - Refresh   │  │ - Check-in  │  │ - Pity      │  │             │    │
│  │             │  │ - Leveling  │  │ - Users     │  │             │    │
│  │             │  │ - Referral  │  │             │  │             │    │
│  │             │  │ - Payment   │  │             │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Operation Queue System                       │   │
│  │  - SIGN: Cross-chain signing via IKA                            │   │
│  │  - DKG: Distributed Key Generation                              │   │
│  │  - ISSUE_LOOTBOX: Mint lootboxes to users                       │   │
│  │  - MINT_ASSET: Mint assets directly                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────┬────────────────────────┬───────────────────────┬───────────────┘
         │                        │                       │
         │                        │                       │
┌────────┴────────┐    ┌──────────┴──────────┐    ┌──────┴────────────────┐
│   PostgreSQL    │    │    IKA Network      │    │   Blockchain RPCs     │
│   (Prisma ORM)  │    │    (dWallet MPC)    │    │                       │
├─────────────────┤    ├─────────────────────┤    ├───────────────────────┤
│ - Users         │    │ - DKG Coordinator   │    │ - Sui RPC             │
│ - Wallets       │    │ - Presign Caps      │    │ - Ethereum/Base RPC   │
│ - Operations    │    │ - Cross-chain Sign  │    │ - Solana RPC          │
│ - Payments      │    │ - Gas Pool Sponsor  │    │                       │
│ - Assets        │    │                     │    │                       │
│ - CheckIns      │    │                     │    │                       │
│ - Referrals     │    │                     │    │                       │
└─────────────────┘    └─────────────────────┘    └───────────────────────┘
```

## Data Flow Diagrams

### 1. Authentication Flow

```
User                Frontend              Backend               Blockchain
 │                     │                     │                      │
 │──Connect Wallet────►│                     │                      │
 │                     │──Get Challenge─────►│                      │
 │                     │◄─Challenge Message──│                      │
 │◄─Sign Message───────│                     │                      │
 │──Signature─────────►│                     │                      │
 │                     │──Verify Sig────────►│                      │
 │                     │                     │──Verify on-chain────►│
 │                     │                     │◄─Valid──────────────│
 │                     │                     │──Create/Find User   │
 │                     │                     │──Generate JWT       │
 │                     │◄─JWT + User Data───│                      │
 │◄─Authenticated──────│                     │                      │
```

### 2. DKG (Distributed Key Generation) Flow

```
User               Frontend               Backend               IKA Network
 │                     │                     │                      │
 │──Request DKG───────►│                     │                      │
 │                     │──Submit DKG────────►│                      │
 │                     │                     │──Generate Keys──────►│
 │                     │                     │──Request DKG─────────►│
 │                     │                     │◄─DWallet Cap─────────│
 │                     │                     │──Create Presign─────►│
 │                     │                     │◄─Presign Cap────────│
 │                     │                     │──Store DKG Data     │
 │                     │◄─DKG Complete──────│                      │
 │◄─New Sui Address────│                     │                      │
```

### 3. Cross-Chain Signing Flow

```
User               Frontend               Backend               IKA Network       Target Chain
 │                     │                     │                      │                    │
 │──Build TX──────────►│                     │                      │                    │
 │                     │──Submit Sign───────►│                      │                    │
 │                     │                     │──Sign Request───────►│                    │
 │                     │                     │                      │──MPC Sign          │
 │                     │                     │◄─Signature───────────│                    │
 │                     │                     │──Sponsor Gas         │                    │
 │                     │                     │──Execute TX──────────────────────────────►│
 │                     │                     │◄─TX Digest──────────────────────────────│
 │                     │◄─TX Result─────────│                      │                    │
 │◄─Success────────────│                     │                      │                    │
```

### 4. Lootbox Opening Flow

```
User               Frontend               Sui Contract             Backend
 │                     │                      │                       │
 │──Open Lootbox──────►│                      │                       │
 │                     │──Call open_lootbox──►│                       │
 │                     │                      │──Generate Random     │
 │                     │                      │──Check Pity System   │
 │                     │                      │──Select Item         │
 │                     │                      │──Mint Asset          │
 │                     │                      │──Burn Lootbox        │
 │                     │                      │──Emit Events         │
 │                     │◄─Asset Received──────│                       │
 │                     │                      │───────Events─────────►│
 │                     │                      │                       │──Index Asset
 │◄─New Asset──────────│                      │                       │
```

## Database Schema Overview

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │     Wallet      │     │   DWalletGen    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │◄───┐│ id              │     │ id              │
│ twitter         │    ││ address         │◄────│ walletId        │
│ discord         │    ││ chain           │     │ status          │
│ telegram        │    ││ isPrimary       │     │ generatedSuiAddr│
│ gems            │    └│ userId          │────►│ dwalletCapId    │
│ level           │     │ dwalletGenId    │     │ sessionId       │
│ currentStreak   │     └─────────────────┘     └─────────────────┘
│ referralCode    │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DailyCheckIn  │     │    Operation    │     │     Payment     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ userId          │     │ type            │     │ userId          │
│ checkInDate     │     │ status          │     │ amount          │
│ streakDay       │     │ walletId        │     │ gems            │
│ gemsEarned      │     │ requestData     │     │ status          │
│ signature       │     │ txDigest        │     │ provider        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Asset Management

```
┌─────────────────┐     ┌─────────────────┐
│     Asset       │     │  AssetMetadata  │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ userId          │     │ itemId          │◄────┐
│ tokenId         │────►│ slot            │     │
│ metadataId      │     │ name            │     │
│ upgradeLevel    │     │ rarity          │     │
│ rarity          │     │ description     │     │
│ slot            │     │ imageUrl        │     │
└─────────────────┘     │ isDisabled      │     │
                        └─────────────────┘     │
                                                │
┌─────────────────┐     ┌─────────────────┐     │
│   Lootbox       │     │ LootboxConfig   │     │
├─────────────────┤     ├─────────────────┤     │
│ id              │     │ category        │     │
│ tokenId         │     │ rarityChances   │─────┘
│ category        │     │ isActive        │
│ ownerId         │     └─────────────────┘
└─────────────────┘
```

## Security Architecture

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh tokens stored securely
- Signature verification for all wallet operations
- Rate limiting on sensitive endpoints

### Authorization
- Role-based access control (User, Admin)
- Admin-only endpoints protected by separate auth
- Operation queue prevents unauthorized blockchain calls

### Blockchain Security
- All transactions executed through backend (no exposed private keys)
- IKA dWallet for secure cross-chain signing
- Gas pool sponsorship prevents user fund theft
- Presign capability rotation after each signing

## Scalability Considerations

### Backend
- Stateless API design for horizontal scaling
- Operation queue for async blockchain operations
- Connection pooling for database
- Caching layer for frequently accessed data

### Blockchain
- Sui's parallel execution for high throughput
- Gas pool for sponsored transactions
- Event-driven indexing for efficient data sync

### Frontend
- React Query for efficient data fetching and caching
- Zustand for lightweight state management
- Lazy loading for Unity WebGL component
