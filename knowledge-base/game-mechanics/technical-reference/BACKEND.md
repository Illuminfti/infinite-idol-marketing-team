# Backend Package Documentation

## Overview

The backend is built with **Hono.js** (a lightweight web framework) and **Prisma ORM** for database management. It provides REST API endpoints for authentication, user management, blockchain operations, and gamification features.

## Technology Stack

- **Framework**: Hono.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Pino
- **Blockchain SDKs**: @mysten/sui, @solana/web3.js, viem
- **IKA Integration**: @aspect-ika/client

## Project Structure

```
packages/backend/
├── src/
│   ├── auth/               # Authentication module
│   │   ├── auth.routes.ts  # Auth endpoints
│   │   ├── auth.service.ts # Auth logic
│   │   ├── verify.ts       # Signature verification
│   │   └── middleware.ts   # JWT middleware
│   ├── user/               # User features
│   │   ├── profile/        # User profile management
│   │   ├── dkg/            # Distributed Key Generation
│   │   ├── sign/           # Cross-chain signing
│   │   ├── check-in/       # Daily check-in system
│   │   ├── leveling/       # Level up system
│   │   ├── referral/       # Referral program
│   │   ├── payment/        # Payment processing
│   │   └── routes.ts       # Combined user routes
│   ├── admin/              # Admin operations
│   │   ├── tx/             # Transaction execution
│   │   ├── pity/           # Pity system config
│   │   ├── lootbox/        # Lootbox configuration
│   │   └── routes.ts       # Admin routes
│   ├── public/             # Public endpoints
│   │   ├── checkbook/      # Public item collection
│   │   └── indexing/       # Blockchain event indexing
│   ├── utils/              # Utilities
│   │   ├── db.ts           # Prisma client
│   │   ├── logger.ts       # Pino logger
│   │   └── ika.ts          # IKA client setup
│   └── index.ts            # Entry point
├── prisma/
│   ├── schema/             # Prisma schema files
│   └── migrations/         # Database migrations
└── package.json
```

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate with wallet signature |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/refresh` | Refresh JWT token |
| GET | `/auth/me` | Get current user info |

#### Login Request
```typescript
interface LoginRequest {
  chain: "sui" | "solana" | "base";
  publicKey: string;
  signature: string;
  message: string;
}
```

### User Profile (`/user/profile`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get user profile |
| PATCH | `/user/profile` | Update profile |
| GET | `/user/profile/dkg-status` | Get DKG wallet status |

### DKG Operations (`/user/dkg`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/dkg/status` | Get DKG generation status |
| POST | `/user/dkg/submit` | Submit DKG request |
| GET | `/user/dkg/wallet` | Get generated wallet info |

#### DKG Submit Request
```typescript
interface DKGSubmitRequest {
  encryptedUserShareAndProof: string;  // Hex-encoded
  userDkgMessage: string;               // Hex-encoded
  userPublicOutput: string;             // Hex-encoded
  sessionIdentifier: string;            // Hex-encoded
  encryptionKeyAddress: string;         // Sui address
  signerPublicKey: string;              // Hex-encoded
}
```

### Cross-Chain Signing (`/user/sign`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/sign/presign` | Get presign capability |
| POST | `/user/sign/submit` | Submit sign request |
| GET | `/user/sign/status/:id` | Get operation status |

#### Sign Submit Request
```typescript
interface SignSubmitRequest {
  message: string;              // 32-byte blake2b hash (hex)
  originalTransaction: string;  // Full transaction bytes (hex)
  centralizedMessage?: string;  // Optional centralized signature
  reservationId?: string;       // Gas pool reservation
  acceptEncryptedShare?: boolean;
  encryptionKeySignature?: string;
}
```

### Daily Check-In (`/user/check-in`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/check-in/status` | Get check-in status |
| GET | `/user/check-in/message` | Get message to sign |
| POST | `/user/check-in/verify` | Verify and complete check-in |
| GET | `/user/check-in/history` | Get check-in history |
| GET | `/user/check-in/milestones` | Get milestone progress |

#### Check-In Status Response
```typescript
interface CheckInStatus {
  canCheckIn: boolean;
  hasCheckedInToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  expectedStreakDay: number;
  nextMilestone: MilestonePreview | null;
}
```

### Leveling System (`/user/leveling`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/leveling/requirements` | Get level up requirements |
| POST | `/user/leveling/level-up` | Perform level up |
| GET | `/user/leveling/milestones` | Get level milestones |
| GET | `/user/leveling/config` | Get leveling config |

#### Level Up Requirements
```typescript
interface LevelUpRequirements {
  canLevelUp: boolean;
  currentLevel: number;
  currentGems: number;
  gemsRequired: number;      // Default: 69
  hasDKG: boolean;
  dkgStatus: string | null;
  recipientAddress: string | null;
}
```

### Referral System (`/user/referral`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/referral/info` | Get referral info |
| GET | `/user/referral/stats` | Get detailed stats |
| POST | `/user/referral/submit` | Submit referral code |
| GET | `/user/referral/config` | Get referral config |

### Payment (`/user/payment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/payment/packages` | Get gem packages |
| POST | `/user/payment/create` | Create payment intent |
| POST | `/user/payment/confirm` | Confirm payment |
| GET | `/user/payment/history` | Get payment history |

### Admin Operations (`/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/tx/execute` | Execute blockchain transaction |
| GET | `/admin/users` | List users |
| GET | `/admin/operations` | List operations |
| POST | `/admin/lootbox/config` | Update lootbox config |
| POST | `/admin/pity/threshold` | Set pity threshold |

## Services

### AuthService
Handles wallet authentication across multiple chains:
- **Sui**: Ed25519 signature verification
- **Solana**: Ed25519 signature with Solana message format
- **Ethereum/Base**: EIP-191 personal sign verification

### DKGService
Manages Distributed Key Generation:
```typescript
class DKGService {
  // Get current DKG status for user
  async getStatus(userId: string): Promise<DKGStatusResponse>

  // Submit DKG request to IKA network
  async submitDKG(ctx: DKGOperationContext, input: DKGSubmitInput): Promise<DKGSubmitResponse>

  // Poll for DKG completion
  async pollDKGStatus(operationId: string): Promise<DKGStatusResponse>
}
```

### SignService
Handles cross-chain signing operations:
```typescript
class SignService {
  // Get presign capability for wallet
  async getPresignCap(walletId: string): Promise<GetPresignCapResponse>

  // Submit signing request
  async submitSign(ctx: SignOperationContext, input: SubmitSignInput): Promise<SignSubmitResponse>

  // Get operation status
  async getSignStatus(operationId: string): Promise<SignStatusResponse>
}
```

### CheckInService
Daily check-in gamification:
```typescript
class CheckInService {
  // Get current check-in status
  async getStatus(userId: string): Promise<CheckInStatus>

  // Get message to sign for check-in
  async getMessage(userId: string, domain?: string): Promise<CheckInMessageResponse>

  // Verify signature and complete check-in
  async verifyAndCheckIn(request: CheckInVerifyRequest): Promise<CheckInResult>

  // Get milestone progress
  async getMilestones(userId: string): Promise<MilestoneInfo[]>
}
```

### LevelingService
Level progression system:
```typescript
class LevelingService {
  // Check if user can level up
  async checkRequirements(userId: string): Promise<LevelUpRequirements>

  // Execute level up (deduct gems, award lootboxes)
  async levelUp(ctx: LevelUpContext): Promise<LevelUpResponse>

  // Get level milestones
  async getMilestones(): Promise<LevelMilestone[]>
}
```

### ReferralService
Referral program management:
```typescript
class ReferralService {
  // Get or generate referral code
  async getOrCreateReferralCode(userId: string): Promise<string>

  // Submit a referral code
  async submitReferralCode(userId: string, code: string): Promise<SubmitReferralCodeResult>

  // Apply bonus on gem purchase
  async applyReferralBonus(userId: string, baseGems: number, paymentId: string): Promise<ReferralBonusResult | null>
}
```

## Database Schema

### Key Models

```prisma
model User {
  id            String   @id @default(uuid())
  twitter       String?  @unique
  discord       String?  @unique
  telegram      String?  @unique
  gems          Int      @default(0)
  level         Int      @default(0)
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  referralCode  String?  @unique
  // Relations...
}

model Wallet {
  id                String   @id @default(uuid())
  address           String
  chain             Chain    // SUI, SOLANA, BASE
  isPrimary         Boolean  @default(false)
  currentPresignId  String?
  // Relations...
}

model DWalletGeneration {
  id                   String   @id @default(uuid())
  status               DKGStatus // PENDING, ACTIVE, FAILED
  generatedSuiAddress  String?
  dwalletCapId         String?
  dwalletId            String?
  // Relations...
}

model Operation {
  type      OperationType  // DKG, SIGN, ISSUE_LOOTBOX, MINT_ASSET
  status    OperationStatus // PENDING, PROCESSING, COMPLETED, FAILED
  walletId  String
  requestData Json
  txDigest  String?
  // Relations...
}
```

## Operation Types

### DKG Operation
Creates a distributed wallet on IKA network:
1. User initiates DKG from frontend
2. Backend creates Operation record
3. Admin executes via `/admin/tx/execute`
4. IKA network processes DKG
5. Generated Sui address stored in database

### SIGN Operation
Signs cross-chain transactions:
1. Frontend builds transaction
2. User submits sign request with message hash
3. Backend creates Operation and CrossChainTransaction
4. Admin executes signing via IKA
5. Signature returned, transaction executed

### ISSUE_LOOTBOX Operation
Mints lootboxes to users:
1. Triggered by level-up, check-in milestone, etc.
2. Operation created with recipient address
3. Admin executes minting on Sui
4. Lootbox transferred to user's Sui address

## Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# IKA Network
IKA_COORDINATOR_ID=0x...
IKA_NETWORK_ENCRYPTION_KEY_ID=0x...
IKA_GAS_POOL_ID=0x...

# Sui
SUI_RPC_URL=https://...
SUI_PACKAGE_ID=0x...
SUI_STATE_ID=0x...

# Admin
ADMIN_API_KEY=your-admin-api-key
```

## Error Handling

All services use custom error classes with error codes:
```typescript
class CheckInError extends Error {
  constructor(
    public code: CheckInErrorCode,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

enum CheckInErrorCode {
  USER_NOT_FOUND = "CHECK_IN_USER_NOT_FOUND",
  ALREADY_CHECKED_IN = "CHECK_IN_ALREADY_CHECKED_IN",
  INVALID_SIGNATURE = "CHECK_IN_INVALID_SIGNATURE",
  MAINTENANCE = "CHECK_IN_MAINTENANCE",
}
```

## Running the Backend

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Database operations
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio
```
