# Frontend Package Documentation

## Overview

The frontend is a **Next.js 15** application with **React Query** for data fetching, **Zustand** for state management, and **Tailwind CSS** for styling. It supports multi-chain wallet connections and integrates with a Unity WebGL game for avatar customization.

## Technology Stack

- **Framework**: Next.js 15 (Pages Router)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS
- **Wallet Integration**: wagmi (EVM), @solana/wallet-adapter, @mysten/dapp-kit
- **IKA SDK**: @aspect-ika/client-sdk

## Project Structure

```
packages/frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/        # Dashboard feature components
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── LevelUpCard.tsx
│   │   │   ├── DailyCheckInCard.tsx
│   │   │   ├── DWalletStatus.tsx
│   │   │   ├── LootboxesSection.tsx
│   │   │   ├── AssetsSection.tsx
│   │   │   ├── PaymentSection.tsx
│   │   │   ├── ReferralSection.tsx
│   │   │   └── CheckbookSection.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── PageLayout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── Modal.tsx
│   │   ├── wallet/           # Wallet connection components
│   │   │   └── WalletConnect.tsx
│   │   └── game/             # Unity integration
│   │       └── UnityGame.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useCheckIn.ts
│   │   ├── useDKG.ts
│   │   ├── useLevelUp.ts
│   │   └── useSign.ts
│   ├── lib/                  # Core libraries
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Auth store & hooks
│   │   ├── profile.ts        # Profile queries
│   │   └── ika.ts            # IKA SDK setup
│   ├── pages/                # Next.js pages
│   │   ├── _app.tsx          # App wrapper
│   │   ├── index.tsx         # Dashboard page
│   │   ├── login.tsx         # Login page
│   │   └── game.tsx          # Unity game page
│   └── styles/
│       └── globals.css       # Global styles
├── public/
│   └── unity/                # Unity WebGL build
├── tailwind.config.js
└── package.json
```

## Pages

### Dashboard (`/`)
Main user dashboard with:
- Profile card showing gems, level, streak
- Daily check-in card
- Level up card
- Payment/gem purchase section
- DKG wallet status
- Lootboxes inventory
- Assets inventory
- Checkbook (collection tracker)
- Referral section

### Login (`/login`)
Wallet connection and authentication:
- Multi-chain wallet selection
- Message signing for authentication
- JWT token management

### Game (`/game`)
Unity WebGL avatar customization:
- Avatar viewer
- Equipment management
- Photo mode
- React-Unity bridge

## Components

### Dashboard Components

#### ProfileCard
Displays user profile information:
```tsx
interface ProfileCardProps {
  profile: UserProfile | undefined;
}

// Shows:
// - User wallet address
// - Current level
// - Gem balance
// - Check-in streak
// - Referral code
```

#### DailyCheckInCard
Daily check-in interface:
```tsx
interface DailyCheckInCardProps {
  onCheckIn: () => void;  // Callback to refresh profile
}

// Features:
// - Check-in status display
// - Sign message button
// - Streak counter
// - Next milestone preview
// - Check-in history
```

#### LevelUpCard
Level progression interface:
```tsx
interface LevelUpCardProps {
  profile: UserProfile | undefined;
  onLevelUp: () => void;  // Callback to refresh profile
}

// Features:
// - Current level display
// - Gems required for next level
// - Level up button
// - Milestone rewards preview
```

#### DWalletStatus
DKG wallet status and creation:
```tsx
interface DWalletStatusProps {
  dkgStatus: DKGStatus | undefined;
}

// Features:
// - DKG generation status
// - Generated Sui address display
// - DKG initiation button
// - Progress indicator
```

#### LootboxesSection
User's lootbox inventory:
```tsx
interface LootboxesSectionProps {
  generatedSuiAddress: string | undefined;
}

// Features:
// - Lootbox grid display
// - Category filtering
// - Open lootbox button
// - Lootbox details modal
```

#### AssetsSection
User's NFT asset inventory:
```tsx
interface AssetsSectionProps {
  generatedSuiAddress: string | undefined;
}

// Features:
// - Asset grid display
// - Filtering by slot/rarity
// - Asset details modal
// - Merge functionality
```

#### PaymentSection
Gem purchase interface:
```tsx
interface PaymentSectionProps {
  onSuccess: () => void;  // Callback after purchase
}

// Features:
// - Gem package selection
// - Payment provider selection
// - Transaction processing
```

#### ReferralSection
Referral program interface:
```tsx
// Features:
// - User's referral code
// - Copy to clipboard
// - Submit referral code
// - Referral stats
```

### Wallet Components

#### WalletConnect
Multi-chain wallet connection:
```tsx
// Supported chains:
// - Sui (Sui Wallet, Suiet, etc.)
// - Solana (Phantom, Solflare, etc.)
// - Ethereum/Base (MetaMask, WalletConnect, etc.)
```

### Unity Integration

#### UnityGame
Unity WebGL wrapper component:
```tsx
interface UnityGameProps {
  userAddress?: string;
  entitlements?: AssetEntitlement[];
}

// Features:
// - Unity WebGL loading
// - React-Unity messaging bridge
// - Asset entitlement sync
// - Screenshot/video capture
```

## Hooks

### useCheckIn
```typescript
function useCheckIn() {
  return {
    status: CheckInStatus | undefined;
    isLoading: boolean;
    getMessage: () => Promise<CheckInMessage>;
    verifyCheckIn: (signature: string, message: string) => Promise<CheckInResult>;
    history: CheckInHistoryEntry[];
    milestones: MilestoneInfo[];
  };
}
```

### useDKG
```typescript
function useDKG() {
  return {
    status: DKGStatus | undefined;
    isLoading: boolean;
    submitDKG: (params: DKGSubmitParams) => Promise<DKGSubmitResult>;
    pollStatus: (operationId: string) => Promise<DKGStatus>;
  };
}
```

### useLevelUp
```typescript
function useLevelUp() {
  return {
    requirements: LevelUpRequirements | undefined;
    isLoading: boolean;
    levelUp: () => Promise<LevelUpResponse>;
    milestones: LevelMilestone[];
  };
}
```

### useSign
```typescript
function useSign() {
  return {
    presignCap: PresignCapResponse | undefined;
    submitSign: (params: SignSubmitParams) => Promise<SignSubmitResponse>;
    getStatus: (operationId: string) => Promise<SignStatusResponse>;
  };
}
```

## State Management

### Auth Store (Zustand)
```typescript
interface AuthState {
  // State
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  userShare: Uint8Array | null;  // DKG user share

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUserShare: (share: Uint8Array) => void;
  refreshToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  // Implementation...
}));
```

### UserShare Loading
Automatic DKG user share decryption on login:
```tsx
function UserShareLoader({ children }: { children: React.ReactNode }) {
  const { user, setUserShare } = useAuthStore();

  useEffect(() => {
    if (user?.dkgStatus?.hasDKG) {
      // Decrypt and load user share from storage
      loadUserShare().then(setUserShare);
    }
  }, [user]);

  return children;
}
```

## API Client

### Configuration
```typescript
const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = useAuthStore.getState().token;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }

    return response.json();
  },
};
```

### React Query Setup
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      retry: 1,
    },
  },
});
```

## Unity-React Bridge

### Message Protocol
```typescript
// React -> Unity
interface UnityMessage {
  type: 'SET_ENTITLEMENTS' | 'SET_EQUIPPED' | 'CAPTURE_PHOTO';
  payload: any;
}

// Unity -> React
interface UnityCallback {
  type: 'READY' | 'EQUIPMENT_CHANGED' | 'PHOTO_CAPTURED';
  payload: any;
}
```

### MessagePack Serialization
```typescript
// Asset entitlements are serialized with MessagePack for efficiency
interface AssetEntitlement {
  itemId: string;
  tokenId: string;
  upgradeLevel: number;
  rarity: number;
  slot: number;
}
```

## Wallet Integration

### Sui Wallet
```typescript
import { useWallet as useSuiWallet } from '@mysten/dapp-kit';

function SuiWalletConnect() {
  const { connected, connect, signPersonalMessage } = useSuiWallet();
  // ...
}
```

### Solana Wallet
```typescript
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

function SolanaWalletConnect() {
  const { connected, connect, signMessage } = useSolanaWallet();
  // ...
}
```

### EVM Wallet (wagmi)
```typescript
import { useAccount, useSignMessage } from 'wagmi';

function EVMWalletConnect() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  // ...
}
```

## Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Chain RPCs
NEXT_PUBLIC_SUI_RPC_URL=https://...
NEXT_PUBLIC_SOLANA_RPC_URL=https://...
NEXT_PUBLIC_BASE_RPC_URL=https://...

# IKA
NEXT_PUBLIC_IKA_COORDINATOR_ID=0x...
NEXT_PUBLIC_IKA_ENCRYPTION_KEY_ID=0x...
```

## Running the Frontend

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Lint
pnpm lint
```

## Styling

### Tailwind Configuration
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ...
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};
```

### Component Patterns
```tsx
// Card component example
function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-md p-6",
      "border border-gray-200",
      className
    )}>
      {children}
    </div>
  );
}
```
