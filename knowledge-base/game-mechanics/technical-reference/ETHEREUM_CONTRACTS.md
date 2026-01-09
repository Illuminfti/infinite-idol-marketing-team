# Ethereum Smart Contracts Documentation

## Overview

The Ethereum package contains a **Treasury** contract built with **Foundry** (Solidity). It handles ETH payments and admin withdrawals for the Ethereum/Base chains.

## Technology Stack

- **Framework**: Foundry
- **Solidity Version**: ^0.8.28
- **Dependencies**: OpenZeppelin Contracts

## Project Structure

```
packages/ethereum/
├── src/
│   └── Treasury.sol         # Main treasury contract
├── script/
│   └── Deploy.s.sol         # Deployment script
├── test/
│   └── Treasury.t.sol       # Contract tests
├── lib/
│   └── openzeppelin-contracts/
├── foundry.toml
└── README.md
```

## Treasury Contract

### Overview

The Treasury contract is a secure payment collection and withdrawal system with:
- Owner-controlled withdrawals
- Reentrancy protection
- Pausable functionality
- Two-step ownership transfer

### Contract Inheritance

```solidity
contract Treasury is Ownable2Step, ReentrancyGuard, Pausable
```

- **Ownable2Step**: Safe ownership transfer requiring acceptance
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause capability

### State Variables

```solidity
/// Total payments received (for tracking purposes)
uint256 public totalPaymentsReceived;

/// Number of payments received
uint256 public paymentCount;
```

### Events

```solidity
/// Emitted when a payment is received
event PaymentReceived(
    address indexed sender,
    uint256 amount,
    uint256 timestamp
);

/// Emitted when funds are withdrawn by admin
event PaymentWithdrawn(
    address indexed admin,
    address indexed recipient,
    uint256 amount,
    uint256 timestamp
);

/// Emitted when admin withdraws all funds
event AllPaymentsWithdrawn(
    address indexed admin,
    address indexed recipient,
    uint256 amount,
    uint256 timestamp
);
```

### Custom Errors

```solidity
/// Thrown when payment amount is zero
error ZeroPayment();

/// Thrown when withdrawal amount exceeds balance
error InsufficientBalance();

/// Thrown when recipient address is zero
error ZeroAddress();

/// Thrown when transfer fails
error TransferFailed();
```

### Constructor

```solidity
constructor(address initialOwner) Ownable(initialOwner) {
    if (initialOwner == address(0)) revert ZeroAddress();
}
```

### Public Functions

#### `receive()` / `fallback()`
Accept ETH payments:
```solidity
receive() external payable whenNotPaused {
    _processPayment();
}

fallback() external payable whenNotPaused {
    _processPayment();
}
```

#### `pay()`
Explicit payment function:
```solidity
function pay() external payable whenNotPaused {
    _processPayment();
}
```

### Admin Functions

#### `withdraw()`
Withdraw specific amount:
```solidity
function withdraw(
    address payable recipient,
    uint256 amount
) external onlyOwner nonReentrant {
    if (recipient == address(0)) revert ZeroAddress();
    if (amount == 0) revert ZeroPayment();
    if (address(this).balance < amount) revert InsufficientBalance();

    emit PaymentWithdrawn(msg.sender, recipient, amount, block.timestamp);

    (bool success, ) = recipient.call{value: amount}("");
    if (!success) revert TransferFailed();
}
```

#### `withdrawAll()`
Withdraw entire balance:
```solidity
function withdrawAll(
    address payable recipient
) external onlyOwner nonReentrant {
    if (recipient == address(0)) revert ZeroAddress();

    uint256 balance = address(this).balance;
    if (balance == 0) revert InsufficientBalance();

    emit AllPaymentsWithdrawn(msg.sender, recipient, balance, block.timestamp);

    (bool success, ) = recipient.call{value: balance}("");
    if (!success) revert TransferFailed();
}
```

#### `pause()` / `unpause()`
Emergency pause control:
```solidity
function pause() external onlyOwner {
    _pause();
}

function unpause() external onlyOwner {
    _unpause();
}
```

### View Functions

#### `getBalance()`
Get current treasury balance:
```solidity
function getBalance() external view returns (uint256) {
    return address(this).balance;
}
```

### Internal Functions

```solidity
function _processPayment() internal {
    if (msg.value == 0) revert ZeroPayment();

    totalPaymentsReceived += msg.value;
    paymentCount++;

    emit PaymentReceived(msg.sender, msg.value, block.timestamp);
}
```

## Security Features

### Reentrancy Protection
All withdrawal functions use `nonReentrant` modifier:
```solidity
function withdraw(...) external onlyOwner nonReentrant
```

### Two-Step Ownership Transfer
From OpenZeppelin's `Ownable2Step`:
```solidity
// Step 1: Current owner initiates transfer
function transferOwnership(address newOwner) public virtual override onlyOwner

// Step 2: New owner accepts
function acceptOwnership() public virtual
```

### Pausable
Emergency pause prevents new payments while allowing withdrawals:
```solidity
receive() external payable whenNotPaused  // Paused = no payments
function withdraw(...) external onlyOwner   // Not paused = always works
```

## Deployment

### Using Foundry Script

```solidity
// script/Deploy.s.sol
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/Treasury.sol";

contract DeployTreasury is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        Treasury treasury = new Treasury(owner);

        vm.stopBroadcast();

        console.log("Treasury deployed at:", address(treasury));
    }
}
```

### Deploy Commands

```bash
# Build
forge build

# Test
forge test

# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployTreasury \
    --rpc-url $BASE_SEPOLIA_RPC \
    --broadcast \
    --verify

# Deploy to Base Mainnet
forge script script/Deploy.s.sol:DeployTreasury \
    --rpc-url $BASE_RPC \
    --broadcast \
    --verify
```

## Testing

### Example Tests

```solidity
// test/Treasury.t.sol
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Treasury.sol";

contract TreasuryTest is Test {
    Treasury public treasury;
    address public owner = address(1);
    address public user = address(2);
    address public recipient = address(3);

    function setUp() public {
        vm.prank(owner);
        treasury = new Treasury(owner);
    }

    function testPay() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        treasury.pay{value: 0.5 ether}();

        assertEq(treasury.getBalance(), 0.5 ether);
        assertEq(treasury.totalPaymentsReceived(), 0.5 ether);
        assertEq(treasury.paymentCount(), 1);
    }

    function testWithdraw() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        treasury.pay{value: 1 ether}();

        vm.prank(owner);
        treasury.withdraw(payable(recipient), 0.5 ether);

        assertEq(treasury.getBalance(), 0.5 ether);
        assertEq(recipient.balance, 0.5 ether);
    }

    function testOnlyOwnerCanWithdraw() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        treasury.pay{value: 1 ether}();

        vm.prank(user);
        vm.expectRevert();
        treasury.withdraw(payable(user), 0.5 ether);
    }

    function testPausePreventsPay() public {
        vm.prank(owner);
        treasury.pause();

        vm.deal(user, 1 ether);
        vm.prank(user);
        vm.expectRevert();
        treasury.pay{value: 0.5 ether}();
    }
}
```

### Run Tests

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testPay

# Gas report
forge test --gas-report
```

## Integration with Backend

The backend interacts with the Treasury through:

### 1. Payment Verification
Verify payments via event logs:
```typescript
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

// Watch for payments
const unwatch = client.watchContractEvent({
  address: TREASURY_ADDRESS,
  abi: treasuryAbi,
  eventName: 'PaymentReceived',
  onLogs: (logs) => {
    for (const log of logs) {
      // Verify payment and credit gems
      creditUserGems(log.args.sender, log.args.amount);
    }
  },
});
```

### 2. Admin Withdrawals
Execute withdrawals via admin wallet:
```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);
const client = createWalletClient({
  account,
  chain: base,
  transport: http(RPC_URL),
});

await client.writeContract({
  address: TREASURY_ADDRESS,
  abi: treasuryAbi,
  functionName: 'withdraw',
  args: [recipientAddress, amount],
});
```

## Configuration

### foundry.toml
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.28"
optimizer = true
optimizer_runs = 200

[profile.default.fuzz]
runs = 256

[rpc_endpoints]
base = "${BASE_RPC_URL}"
base_sepolia = "${BASE_SEPOLIA_RPC_URL}"

[etherscan]
base = { key = "${BASESCAN_API_KEY}" }
base_sepolia = { key = "${BASESCAN_API_KEY}" }
```

## Gas Optimization

The contract is optimized for gas efficiency:
- Custom errors instead of require strings
- Minimal storage operations
- Efficient withdrawal patterns
- View functions for balance queries
