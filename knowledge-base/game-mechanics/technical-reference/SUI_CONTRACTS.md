# Sui Smart Contracts Documentation

## Overview

The Sui package (`infinite_idol`) contains Move smart contracts for NFT management, lootbox systems, cross-chain signing integration with IKA, and treasury management.

## Contract Architecture

```
packages/sui/
├── sources/
│   ├── interface.move       # Main entry point & admin functions
│   ├── state.move           # Core state management
│   ├── acl.move             # Access control
│   ├── allowed_versions.move # Version gating
│   ├── constants.move       # System constants
│   ├── nfts/
│   │   ├── asset.move       # NFT asset struct & logic
│   │   ├── lootbox.move     # Lootbox struct
│   │   ├── asset_registry.move
│   │   ├── lootbox_registry.move
│   │   ├── lootbox_config.move
│   │   └── id_manager.move  # Item ID management
│   ├── systems/
│   │   ├── pity_system.move # Pity/mercy system
│   │   ├── merge_config.move # Asset merging
│   │   └── treasury.move    # SUI/IKA treasury
│   ├── cross_chain.move     # IKA dWallet integration
│   └── events.move          # Event definitions
├── tests/                   # Unit tests
└── Move.toml                # Package manifest
```

## Core Structs

### State
```move
public struct State has key, store {
    id: UID,
}

public struct StateV1 has key, store {
    id: UID,
    id_manager: IDManager,        // Item ID pools
    lootbox_config: LootboxConfig, // Rarity chances
    pity_system: PitySystem,       // Pity tracking
    asset_registry: AssetRegistry, // Asset metadata
    lootbox_registry: LootboxRegistry,
    treasury: Treasury,            // Payment coins
    merge_config: MergeConfig,     // Merge settings
    cross_chain: CrossChain,       // dWallet integration
}
```

### Asset (NFT)
```move
public struct Asset has key, store {
    id: UID,
    token_id: u64,           // Unique token ID
    metadata: Metadata,       // Item metadata
    upgrade_level: u8,        // 0 = base, 1 = +, 2 = ++
}

public struct Metadata has copy, drop, store {
    id: ID,                   // Item definition ID
    slot: u8,                 // Equipment slot
    name: String,             // Item name
    rarity: u8,               // Rarity tier
    attributes: VecMap<String, String>,
}
```

### LockedAsset
```move
public struct LockedAsset has key, store {
    id: UID,
    asset: Asset,
    locked_at: u64,           // Timestamp
}
```

### Lootbox
```move
public struct Lootbox has key, store {
    id: UID,
    category: u8,             // 0-3
    attributes: VecMap<String, String>,
    token_id: u64,
}

// Categories:
// 0 = Regular Box
// 1 = Golden Box
// 2 = Diamond Box
// 3 = Pet Egg
```

## Slots & Rarities

### Equipment Slots
```move
// slot values:
// 0 = Set (full outfit)
// 1 = Accessory
// 9 = Pet
```

### Rarity Tiers
```move
// rarity values:
// 0 = Common
// 1 = Uncommon
// 2 = Epic
// 3 = Mythic
// 4 = Limited
```

## Public Functions

### User Functions

#### `open_lootbox`
Opens a lootbox and mints a random asset:
```move
entry fun open_lootbox(
    self: &mut State,
    av: &AV,                  // Allowed versions
    lootbox: Lootbox,
    random: &Random,          // Sui random source
    clock: &Clock,
    ctx: &mut TxContext,
)
```

Process:
1. Determine if it's a pet egg or item lootbox
2. Increment pity counter for sender
3. Check pity thresholds for guaranteed rewards
4. Generate random rarity (or use pity reward)
5. Select random item from rarity pool
6. Mint asset and transfer to sender
7. Burn lootbox

#### `lock_asset`
Locks an asset (prevents trading):
```move
public fun lock_asset(
    _self: &mut State,
    av: &AV,
    asset: Asset,
    clock: &Clock,
    ctx: &mut TxContext,
)
```

#### `unlock_asset`
Unlocks a previously locked asset:
```move
public fun unlock_asset(
    _self: &mut State,
    av: &AV,
    locked_asset: LockedAsset,
    clock: &Clock,
    ctx: &mut TxContext,
)
```

#### `burn_asset`
Destroys an asset:
```move
public fun burn_asset(
    self: &mut State,
    av: &AV,
    asset: Asset,
    clock: &Clock,
    ctx: &mut TxContext,
)
```

#### `merge_assets`
Combines multiple assets to upgrade:
```move
public fun merge_assets(
    self: &mut State,
    av: &AV,
    main_asset: &mut Asset,   // Asset to upgrade
    assets: vector<Asset>,     // Assets to consume
    clock: &Clock,
    ctx: &mut TxContext,
)
```

Requirements:
- All assets must have same `item_id`
- All assets must have same `upgrade_level`
- Cannot merge pets (slot 9)
- Number of assets must match `merge_items_required` config

#### `pay`
Make a SUI payment to treasury:
```move
public fun pay(
    self: &mut State,
    av: &AV,
    payment: Coin<SUI>,
    ctx: &TxContext,
)
```

## Admin Functions

### Asset Management

#### `mint_lootbox`
Mint a lootbox to a recipient:
```move
public fun mint_lootbox(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    category: u8,
    clock: &Clock,
    recipient: address,
    request: u64,             // Request ID for tracking
    ctx: &mut TxContext,
)
```

#### `mint_asset`
Mint an asset directly:
```move
public fun mint_asset(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    item_id: ID,              // Which item to mint
    clock: &Clock,
    recipient: address,
    ctx: &mut TxContext,
)
```

#### `add_item_metadata`
Register new item type:
```move
public fun add_item_metadata(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    item_id: ID,
    name: String,
    slot: u8,
    rarity: u8,
    _: &mut TxContext,
)
```

#### `disable_item` / `enable_item`
Remove/add item from lootbox pool:
```move
public fun disable_item(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    item_id: ID,
    rarity: u8,
    _: &TxContext,
)
```

### Lootbox Configuration

#### `add_lootbox_type_to_rarity_chances_vec`
Configure drop rates:
```move
public fun add_lootbox_type_to_rarity_chances_vec(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    lootbox_type: u8,
    rarity_chances: vector<u64>,  // Chances per rarity
    _: &TxContext,
)
```

Example rarity chances (out of 10000):
- Common: 5000 (50%)
- Uncommon: 3000 (30%)
- Epic: 1500 (15%)
- Mythic: 450 (4.5%)
- Limited: 50 (0.5%)

### Pity System

#### `add_item_pity_threshold`
Set guaranteed drops at certain counts:
```move
public fun add_item_pity_threshold(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    threshold: u64,           // e.g., 50 opens
    guaranteed_rarity: u8,    // e.g., Epic (2)
    _: &TxContext,
)
```

### Cross-Chain (IKA/dWallet)

#### `add_dwallet_cap`
Register dWallet for user:
```move
public fun add_dwallet_cap(
    self: &mut State,
    coordinator: &mut DWalletCoordinator,
    _: &AdminWitness<INTERFACE>,
    address: vector<u8>,      // User's source chain address
    dwallet_network_encryption_key_id: ID,
    encrypted_user_share_and_proof: vector<u8>,
    user_dkg_message: vector<u8>,
    user_public_output: vector<u8>,
    session_identifier: vector<u8>,
    encryption_key_address: address,
    signer_public_key: vector<u8>,
    request: u64,
    ctx: &mut TxContext,
)
```

#### `sign`
Sign a cross-chain message:
```move
public fun sign(
    self: &mut State,
    coordinator: &mut DWalletCoordinator,
    _: &AdminWitness<INTERFACE>,
    message: vector<u8>,      // Blake2b hash (32 bytes)
    message_centralized_signature: vector<u8>,
    signer: vector<u8>,       // Public key
    request: u64,
    ctx: &mut TxContext,
): (ID, vector<u8>)           // (signature_id, new_presign_cap_bcs)
```

### Treasury Management

#### `remove_from_treasury`
Withdraw specific amount:
```move
public fun remove_from_treasury(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
)
```

#### `add_ika_payment` / `add_sui_payment`
Fund payment pools for IKA operations:
```move
public fun add_ika_payment(
    self: &mut State,
    _: &AdminWitness<INTERFACE>,
    payment: Coin<IKA>,
    _: &TxContext,
)
```

## Events

```move
// Asset events
public fun asset_minted(
    recipient: address,
    slot: u8,
    item_id: ID,
    rarity: u8,
    timestamp: u64,
    asset_id: ID,
    token_id: u64,
)

public fun asset_burned(...)
public fun asset_locked(...)
public fun asset_unlocked(...)
public fun assets_merged(...)

// Lootbox events
public fun lootbox_minted(...)
public fun lootbox_burned(...)

// Pity events
public fun pity_reward_triggered(...)

// Cross-chain events
public fun dwallet_cap_added(...)
public fun cross_chain_signed(...)

// Treasury events
public fun treasury_sui_added(...)
public fun treasury_sui_removed(...)
```

## Access Control

### AdminWitness
Admin operations require an `AdminWitness` capability:
```move
public struct AdminWitness<phantom T> has drop {}
```

This is created through the ACL module and controls who can execute admin functions.

### Version Gating
All public functions check package version:
```move
av.get_allowed_versions().assert_pkg_version();
```

This allows controlled upgrades without breaking existing objects.

## Deployment

### Move.toml
```toml
[package]
name = "infinite_idol"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "..." }
ika = { git = "https://github.com/aspect-ika/ika-move.git", subdir = "packages/ika", rev = "..." }
ika_dwallet_2pc_mpc = { git = "https://github.com/aspect-ika/ika-move.git", subdir = "packages/ika_dwallet_2pc_mpc", rev = "..." }

[addresses]
infinite_idol = "0x0"
```

### Build & Publish
```bash
# Build
sui move build

# Test
sui move test

# Publish
sui client publish --gas-budget 100000000
```

## Integration with Backend

The backend calls these contracts through:
1. **Admin transaction execution** - Minting, signing, DKG
2. **Event indexing** - Tracking asset ownership
3. **State queries** - Checking configurations

Example admin execution:
```typescript
// Backend builds and executes admin transaction
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::interface::mint_lootbox`,
  arguments: [
    tx.object(STATE_ID),
    tx.object(adminWitness),
    tx.pure.u8(category),
    tx.object(CLOCK_ID),
    tx.pure.address(recipient),
    tx.pure.u64(requestId),
  ],
});
```
