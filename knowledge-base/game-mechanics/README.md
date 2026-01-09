# Game Mechanics Documentation

> *"Every system. Every number. Every rule that keeps us running. This is how The Chase works."*
> — Ika Minami, System Architecture Brief

---

## Overview

This directory contains comprehensive documentation for all Infinite Idol game mechanics, systems, and technical implementation details. Documentation is organized into **unified marketing + technical docs** (main folder) and **deep technical reference** (technical-reference subfolder).

**For Agents**: Start with the main documentation files below. Reference technical docs when you need implementation details.

**For Developers**: Read both layers - unified docs for context, technical reference for specifications.

---

## Core Game Systems

### 🎰 Lootbox & Rewards System
**[gacha-system.md](./gacha-system.md)**
- Lootbox types and categories (0-3: Regular/Golden/Diamond/Pet Egg)
- 5-tier rarity system (Common/Uncommon/Epic/Mythic/Limited)
- Drop rates and probability tables
- Pity/mercy system (guaranteed rewards)
- Time-locked content releases
- Blockchain random generation
- **Technical**: Smart contracts, admin controls

### 👗 Cosmetics & NFT Assets
**[cosmetics.md](./cosmetics.md)**
- 864-item collection (outfit sets + accessories + pets)
- Equipment slots (0=Set, 1=Accessory, 9=Pet)
- Asset merging & upgrading system (base, +, ++)
- NFT structure and metadata
- Trading and locking mechanics
- Burn system for duplicates
- **Technical**: Asset registry, ID management

### 💎 Gem Economy & Payments
**[gem-system.md](./gem-system.md)**
- Currency system (1 SUI = 100 Gems)
- Multi-chain payment architecture (Sui/ETH/SOL)
- Purchase tiers and bonuses
- Cross-chain signing (dWallet/DKG)
- Referral program
- Account-bound gem mechanics
- **Technical**: Treasury contracts, payment flows

### 🏆 Battle Pass & Progression
**[battle-pass.md](./battle-pass.md)**
- NFT-based progression system
- Visual tier evolution (Bronze → Cosmic)
- Leveling costs (69 gems per level)
- DKG wallet generation for progression
- Daily check-in integration
- Streak tracking and rewards
- **Technical**: Cross-chain wallet system

### 🎮 Avatar Customization
**[avatar-customization.md](./avatar-customization.md)** *(coming soon)*
- Unity WebGL photo mode
- Equipment management UI
- Collection viewing and filtering
- Screenshot/video capture
- React-Unity communication bridge
- **Technical**: MessagePack serialization

### 🌐 Cross-Chain Architecture
**[cross-chain-architecture.md](./cross-chain-architecture.md)** *(coming soon)*
- Why Sui is primary (NFTs, contracts, game logic)
- Multi-chain payment support (ETH/Base, Solana treasuries)
- IKA network dWallet system
- Distributed Key Generation (DKG)
- MPC signing coordination
- **Technical**: Cross-chain signing flows

### 📅 Daily Check-In System
**[battle-pass.md](./battle-pass.md#daily-check-in-integration)**
- Streak mechanics and milestones
- Gem rewards (base 10, up to 1,150/month)
- Message signing verification
- Database tracking
- **Technical**: DailyCheckIn table structure

### 📊 Complete System Overview
**[pre-registration-spec.md](./pre-registration-spec.md)**
- Master overview of all 16+ interconnected systems
- Economic flow diagrams
- Admin dashboard capabilities
- Security & authentication
- Database architecture
- Marketing implications

---

## Technical Reference

**For deep technical implementation details, contract specifications, API endpoints, and developer documentation:**

### [technical-reference/](./technical-reference/)

| File | Description |
|------|-------------|
| **[README.md](./technical-reference/README.md)** | Technical docs overview |
| **[ARCHITECTURE.md](./technical-reference/ARCHITECTURE.md)** | System-wide architecture, data flows, tech stack |
| **[SUI_CONTRACTS.md](./technical-reference/SUI_CONTRACTS.md)** | Move smart contracts (NFTs, lootboxes, pity, merging) |
| **[ETHEREUM_CONTRACTS.md](./technical-reference/ETHEREUM_CONTRACTS.md)** | Solidity contracts for ETH/Base treasury |
| **[SOLANA_CONTRACTS.md](./technical-reference/SOLANA_CONTRACTS.md)** | Anchor program for Solana treasury |
| **[BACKEND.md](./technical-reference/BACKEND.md)** | REST API, endpoints, database, Prisma ORM |
| **[FRONTEND.md](./technical-reference/FRONTEND.md)** | Next.js, React Query, Zustand, wallet integration |
| **[UNITY.md](./technical-reference/UNITY.md)** | WebGL avatar game, MessagePack, asset sync |
| **[ADMIN.md](./technical-reference/ADMIN.md)** | Admin dashboard, ops, config management |

---

## Quick Reference Tables

### Rarity System (5 Tiers)
| Tier | Name | Numeric | Standard Drop Rate |
|------|------|---------|-------------------|
| 0 | Common | 0 | 60% |
| 1 | Uncommon | 1 | 25% |
| 2 | Epic | 2 | 10% |
| 3 | Mythic | 3 | 4% |
| 4 | Limited | 4 | 1% |

*Note: Drop rates vary by lootbox type (Golden/Diamond have boosted rates)*

### Lootbox Categories
| Category | Numeric | Type | Special Features |
|----------|---------|------|------------------|
| 0 | Regular | Standard family boxes | Base drop rates |
| 1 | Golden | Premium | 2× Legendary chance (6%) |
| 2 | Diamond | Ultra Premium | 3× Legendary chance (9%) |
| 3 | Pet Egg | Pet-specific | Pet-only drops |

### Equipment Slots
| Slot | Numeric | Type | Description |
|------|---------|------|-------------|
| 0 | Set | Outfit piece | Head/Chest/Arms/Legs/Feet/Back |
| 1 | Accessory | Accessory | Hats, glasses, jewelry |
| 9 | Pet | Pet companion | Non-mergeable |

### Asset Upgrade Levels
| Level | Display | Merge Requirement |
|-------|---------|-------------------|
| 0 | Base | - |
| 1 | + | Multiple base assets |
| 2 | ++ | Multiple + assets |

*Note: Pets (slot 9) cannot be merged*

---

## Key Numbers

| Metric | Value | Context |
|--------|-------|---------|
| **Gem Conversion** | 1 SUI = 100 Gems | Base exchange rate |
| **Level Cost** | 69 Gems | Per level-up |
| **Total Items** | 864 | 720 outfit + 144 accessory |
| **Outfit Sets** | 30 | 5 families × 6 sets |
| **Daily Check-In Base** | 10 Gems | Base reward per day |
| **Max Monthly Free Gems** | 1,150 | With perfect streak |
| **Rarity Tiers** | 5 | Common → Limited |
| **Lootbox Categories** | 4 | Regular/Golden/Diamond/Pet |

---

## Documentation Standards

All game mechanics documentation follows this structure:
1. **Opening Quote** - Ika Minami perspective
2. **Overview** - Marketing-focused introduction
3. **Mechanics** - Gameplay systems and rules
4. **Technical Implementation** - Developer specifications
5. **Cross-References** - Links to related docs

### Cross-Reference Format
- Main docs link to each other for context
- Technical implementation sections link to technical-reference/
- All docs maintain both marketing narrative and technical accuracy

---

## For Agent Reference

### Agent 04 (Gacha Designer) - Primary Owner
- **Read/Write**: All main game mechanics files
- **Read-Only**: technical-reference/ folder
- **Primary Focus**: Lootbox design, economy balancing, cosmetic curation

### All Other Agents
- **Read**: All game mechanics documentation
- **Write**: Via proposals to Coordinator or Gacha Designer
- **Escalate**: Technical questions to Gacha Designer or human

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-09 | Unified marketing + technical docs. Added 5-tier rarity system, pity system, multi-chain architecture. Moved technical docs to technical-reference/. |
| 1.0 | 2025-12 | Initial marketing-focused documentation. 4-tier rarity system. |

---

*"Every number has a reason. Every system serves The Chase. Now you know how we run."*
