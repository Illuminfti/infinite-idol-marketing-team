# Infinite Idol - Comprehensive Documentation

A cross-chain Web3 gaming platform featuring NFT collectibles, lootboxes, and avatar customization built on Sui, Ethereum, Solana, and Unity.

## Repository Structure

```
infinite_idol/
├── packages/
│   ├── admin/          # Admin dashboard (Next.js)
│   ├── backend/        # API server (Hono + Prisma)
│   ├── ethereum/       # Ethereum smart contracts (Foundry)
│   ├── frontend/       # User dashboard (Next.js)
│   ├── solana/         # Solana programs (Anchor)
│   ├── sui/            # Sui Move contracts
│   └── unity/          # Unity WebGL game
└── docs/               # Documentation
```

## Packages Overview

| Package | Technology | Purpose |
|---------|-----------|---------|
| [Backend](./BACKEND.md) | Hono, Prisma, TypeScript | API server, authentication, operations |
| [Frontend](./FRONTEND.md) | Next.js, React Query, Tailwind | User dashboard & wallet integration |
| [Admin](./ADMIN.md) | Next.js, React | Administrative dashboard |
| [Sui Contracts](./SUI_CONTRACTS.md) | Move | NFTs, lootboxes, cross-chain signing |
| [Ethereum](./ETHEREUM_CONTRACTS.md) | Solidity, Foundry | Treasury management |
| [Solana](./SOLANA_CONTRACTS.md) | Anchor, Rust | Treasury management |
| [Unity](./UNITY.md) | C#, WebGL | Avatar customization game |

## Core Features

### 1. Multi-Chain Wallet Authentication
- Support for Sui, Solana, and Ethereum/Base wallets
- SIWE (Sign-In With Ethereum) and Solana signature verification
- JWT-based session management

### 2. Cross-Chain Signing (IKA/dWallet)
- Distributed Key Generation (DKG) for creating cross-chain wallets
- Presign capability for efficient signing operations
- Cross-chain transaction signing via IKA network

### 3. NFT & Lootbox System
- Four lootbox categories: Regular, Golden, Diamond, Pet Egg
- Five rarity tiers: Common, Uncommon, Epic, Mythic, Limited
- Asset slots: Set (0), Accessory (1), Pet (9)
- Pity system for guaranteed rare drops
- Asset merging/upgrading system

### 4. Gamification Features
- Daily check-in with streak tracking
- Leveling system with milestone rewards
- Referral program with bonus gems
- Gem economy for purchases and upgrades

### 5. Avatar Customization (Unity)
- WebGL-based avatar viewer
- Equipment/outfit management
- Photo mode with animations
- React bridge for Web3 integration

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │   Profile   │  │  Dashboard  │  │     Unity WebGL Game     │  │
│  │    Card     │  │   Cards     │  │   (Avatar Customization) │  │
│  └─────────────┘  └─────────────┘  └──────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ REST API
┌────────────────────────────┴─────────────────────────────────────┐
│                         Backend (Hono)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │    Auth     │  │     DKG     │  │     Operations Queue     │  │
│  │   Routes    │  │   Service   │  │   (Sign, Mint, etc.)     │  │
│  └─────────────┘  └─────────────┘  └──────────────────────────┘  │
└───────────┬────────────────┬─────────────────┬───────────────────┘
            │                │                 │
┌───────────┴────┐  ┌────────┴───────┐  ┌─────┴──────────────────┐
│   PostgreSQL   │  │   IKA Network  │  │    Multi-Chain RPC     │
│    (Prisma)    │  │   (dWallet)    │  │  (Sui/Eth/Solana)      │
└────────────────┘  └────────────────┘  └────────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL database
- Sui CLI (for Move contracts)
- Foundry (for Ethereum contracts)
- Anchor CLI (for Solana programs)
- Unity 2022+ (for game development)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env

# Generate Prisma client
pnpm --filter backend prisma:generate

# Run database migrations
pnpm --filter backend prisma:migrate

# Start development servers
pnpm dev
```

## Documentation Index

1. [Architecture Overview](./ARCHITECTURE.md)
2. [Backend API & Services](./BACKEND.md)
3. [Frontend Components](./FRONTEND.md)
4. [Admin Dashboard](./ADMIN.md)
5. [Sui Smart Contracts](./SUI_CONTRACTS.md)
6. [Ethereum Contracts](./ETHEREUM_CONTRACTS.md)
7. [Solana Programs](./SOLANA_CONTRACTS.md)
8. [Unity Game Integration](./UNITY.md)

## Tech Stack Summary

- **Backend**: Hono (Express-like), Prisma ORM, PostgreSQL, JWT, pino logger
- **Frontend**: Next.js 15, React Query, Zustand, Tailwind CSS, wagmi, @solana/web3.js
- **Smart Contracts**: Move (Sui), Solidity (Ethereum), Rust/Anchor (Solana)
- **Game Engine**: Unity with WebGL build, MessagePack serialization
- **Infrastructure**: IKA Network for cross-chain MPC signing
