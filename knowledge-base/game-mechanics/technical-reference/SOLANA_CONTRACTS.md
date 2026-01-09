# Solana Programs Documentation

## Overview

The Solana package contains an **Anchor** program for treasury management on the Solana blockchain. It handles SOL payments and admin-controlled withdrawals.

## Technology Stack

- **Framework**: Anchor 0.30+
- **Language**: Rust
- **Runtime**: Solana BPF

## Project Structure

```
packages/solana/
├── programs/
│   └── treasury/
│       ├── src/
│       │   └── lib.rs        # Main program logic
│       └── Cargo.toml
├── tests/
│   └── treasury.ts           # Integration tests
├── Anchor.toml               # Anchor configuration
├── Cargo.toml                # Workspace config
└── README.md
```

## Treasury Program

### Program ID
```rust
declare_id!("5xNXKg15TaXK74QRedKFd1ehPhxHTYXmsQ4DvKRzVaKX");
```

### Account Structure

#### Treasury Account (State PDA)
```rust
#[account]
#[derive(InitSpace)]
pub struct Treasury {
    /// The admin who can withdraw funds
    pub admin: Pubkey,
    /// Total SOL received in lamports
    pub total_payments_received: u64,
    /// Number of payments received
    pub payment_count: u64,
    /// Treasury PDA bump seed
    pub bump: u8,
    /// Vault PDA bump seed
    pub vault_bump: u8,
}
```

Seeds: `["treasury"]`

#### Vault Account (SOL Storage PDA)
A simple SystemAccount PDA that holds the actual SOL.

Seeds: `["vault", treasury.key()]`

### Instructions

#### `initialize`
Set up the treasury (one-time):
```rust
pub fn initialize(ctx: Context<Initialize>) -> Result<()>
```

**Accounts:**
```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Treasury::INIT_SPACE,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        seeds = [b"vault", treasury.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

#### `pay`
Make a payment to the treasury:
```rust
pub fn pay(ctx: Context<Pay>, amount: u64) -> Result<()>
```

**Accounts:**
```rust
#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        seeds = [b"vault", treasury.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

**Logic:**
```rust
pub fn pay(ctx: Context<Pay>, amount: u64) -> Result<()> {
    require!(amount > 0, TreasuryError::ZeroPayment);

    // Transfer SOL from payer to vault
    let transfer_instruction = Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.vault.to_account_info(),
    };

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction,
    );

    transfer(cpi_context, amount)?;

    // Update stats
    let treasury = &mut ctx.accounts.treasury;
    treasury.total_payments_received = treasury
        .total_payments_received
        .checked_add(amount)
        .ok_or(TreasuryError::Overflow)?;
    treasury.payment_count = treasury
        .payment_count
        .checked_add(1)
        .ok_or(TreasuryError::Overflow)?;

    emit!(PaymentReceived {
        payer: ctx.accounts.payer.key(),
        amount,
        total_payments: treasury.total_payments_received,
        payment_count: treasury.payment_count,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
```

#### `withdraw`
Withdraw specific amount (admin only):
```rust
pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()>
```

**Accounts:**
```rust
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        seeds = [b"treasury"],
        bump = treasury.bump,
        has_one = admin @ TreasuryError::Unauthorized
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        seeds = [b"vault", treasury.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    /// CHECK: Recipient can be any account
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

**Logic:**
```rust
pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, TreasuryError::ZeroPayment);

    let vault_balance = ctx.accounts.vault.lamports();
    require!(vault_balance >= amount, TreasuryError::InsufficientBalance);

    // Ensure vault stays rent-exempt after withdrawal
    let rent = Rent::get()?;
    let min_balance = rent.minimum_balance(0);
    require!(
        vault_balance.saturating_sub(amount) >= min_balance,
        TreasuryError::WithdrawalWouldBreakRentExemption
    );

    // Transfer from vault PDA using PDA signer
    let treasury_key = ctx.accounts.treasury.key();
    let vault_bump = ctx.accounts.treasury.vault_bump;
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vault",
        treasury_key.as_ref(),
        &[vault_bump]
    ]];

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    emit!(PaymentWithdrawn {
        admin: ctx.accounts.admin.key(),
        recipient: ctx.accounts.recipient.key(),
        amount,
        remaining_balance: ctx.accounts.vault.lamports(),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
```

#### `withdraw_all`
Withdraw all available funds:
```rust
pub fn withdraw_all(ctx: Context<Withdraw>) -> Result<()>
```

Keeps minimum rent-exempt balance in vault to prevent account closure.

#### `transfer_admin`
Transfer admin rights:
```rust
pub fn transfer_admin(ctx: Context<TransferAdmin>, new_admin: Pubkey) -> Result<()>
```

### Events

```rust
#[event]
pub struct TreasuryInitialized {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PaymentReceived {
    pub payer: Pubkey,
    pub amount: u64,
    pub total_payments: u64,
    pub payment_count: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentWithdrawn {
    pub admin: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub remaining_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct AllPaymentsWithdrawn {
    pub admin: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct AdminTransferred {
    pub old_admin: Pubkey,
    pub new_admin: Pubkey,
    pub timestamp: i64,
}
```

### Errors

```rust
#[error_code]
pub enum TreasuryError {
    #[msg("Payment amount must be greater than zero")]
    ZeroPayment,
    #[msg("Insufficient balance in treasury")]
    InsufficientBalance,
    #[msg("Only admin can perform this action")]
    Unauthorized,
    #[msg("Invalid admin address")]
    InvalidAdmin,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Withdrawal would make vault non-rent-exempt")]
    WithdrawalWouldBreakRentExemption,
}
```

## Security Considerations

### Rent Exemption
The vault maintains minimum rent-exempt balance:
```rust
let rent = Rent::get()?;
let min_balance = rent.minimum_balance(0);
require!(
    vault_balance.saturating_sub(amount) >= min_balance,
    TreasuryError::WithdrawalWouldBreakRentExemption
);
```

### Admin Verification
Anchor's `has_one` constraint verifies admin:
```rust
#[account(
    has_one = admin @ TreasuryError::Unauthorized
)]
pub treasury: Account<'info, Treasury>,
```

### Overflow Protection
All arithmetic uses checked operations:
```rust
treasury.total_payments_received
    .checked_add(amount)
    .ok_or(TreasuryError::Overflow)?
```

## Deployment

### Anchor.toml
```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
treasury = "5xNXKg15TaXK74QRedKFd1ehPhxHTYXmsQ4DvKRzVaKX"

[programs.mainnet]
treasury = "5xNXKg15TaXK74QRedKFd1ehPhxHTYXmsQ4DvKRzVaKX"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### Build & Deploy

```bash
# Build
anchor build

# Test
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Verify
anchor verify <PROGRAM_ID>
```

### Initialize Treasury

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Treasury } from "../target/types/treasury";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.Treasury as Program<Treasury>;

// Derive PDAs
const [treasuryPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("treasury")],
  program.programId
);

const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), treasuryPda.toBuffer()],
  program.programId
);

// Initialize
await program.methods
  .initialize()
  .accounts({
    treasury: treasuryPda,
    vault: vaultPda,
    admin: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

## Integration with Backend

### Make Payment
```typescript
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const connection = new Connection(RPC_URL);
const program = new anchor.Program(idl, PROGRAM_ID, provider);

// Derive PDAs
const [treasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("treasury")],
  program.programId
);

const [vaultPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), treasuryPda.toBuffer()],
  program.programId
);

// Build payment instruction
const ix = await program.methods
  .pay(new anchor.BN(amount))
  .accounts({
    treasury: treasuryPda,
    vault: vaultPda,
    payer: userWallet,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .instruction();

// Return instruction for user to sign
return ix;
```

### Listen for Payments
```typescript
import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const connection = new Connection(RPC_URL, "confirmed");
const program = new anchor.Program(idl, PROGRAM_ID, provider);

// Subscribe to PaymentReceived events
const listener = program.addEventListener(
  "PaymentReceived",
  (event, slot) => {
    console.log("Payment received:", {
      payer: event.payer.toString(),
      amount: event.amount.toString(),
      timestamp: event.timestamp.toString(),
    });

    // Credit user gems
    creditUserGems(event.payer.toString(), event.amount);
  }
);

// Later: remove listener
program.removeEventListener(listener);
```

### Admin Withdrawal
```typescript
const adminKeypair = Keypair.fromSecretKey(/* admin secret */);

await program.methods
  .withdraw(new anchor.BN(amount))
  .accounts({
    treasury: treasuryPda,
    vault: vaultPda,
    recipient: recipientAddress,
    admin: adminKeypair.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([adminKeypair])
  .rpc();
```

## Testing

### TypeScript Tests
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Treasury } from "../target/types/treasury";
import { expect } from "chai";

describe("treasury", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Treasury as Program<Treasury>;

  let treasuryPda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;

  before(async () => {
    [treasuryPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), treasuryPda.toBuffer()],
      program.programId
    );
  });

  it("Initializes treasury", async () => {
    await program.methods
      .initialize()
      .accounts({
        treasury: treasuryPda,
        vault: vaultPda,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const treasury = await program.account.treasury.fetch(treasuryPda);
    expect(treasury.admin.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
    expect(treasury.totalPaymentsReceived.toNumber()).to.equal(0);
  });

  it("Accepts payments", async () => {
    const paymentAmount = anchor.web3.LAMPORTS_PER_SOL;

    await program.methods
      .pay(new anchor.BN(paymentAmount))
      .accounts({
        treasury: treasuryPda,
        vault: vaultPda,
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const treasury = await program.account.treasury.fetch(treasuryPda);
    expect(treasury.totalPaymentsReceived.toNumber()).to.equal(paymentAmount);
    expect(treasury.paymentCount.toNumber()).to.equal(1);
  });

  it("Allows admin withdrawal", async () => {
    const recipient = anchor.web3.Keypair.generate();
    const withdrawAmount = anchor.web3.LAMPORTS_PER_SOL / 2;

    await program.methods
      .withdraw(new anchor.BN(withdrawAmount))
      .accounts({
        treasury: treasuryPda,
        vault: vaultPda,
        recipient: recipient.publicKey,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const recipientBalance = await provider.connection.getBalance(
      recipient.publicKey
    );
    expect(recipientBalance).to.equal(withdrawAmount);
  });
});
```

### Run Tests
```bash
# Run all tests
anchor test

# Run specific test
anchor test -- --grep "Accepts payments"

# Run with verbose logging
anchor test -- --verbose
```
