# Admin Package Documentation

## Overview

The Admin package is a **Next.js** application providing administrative capabilities for managing the Infinite Idol platform. It allows admins to execute blockchain transactions, manage users, configure lootboxes, and monitor system operations.

## Technology Stack

- **Framework**: Next.js (App Router)
- **UI**: React, Tailwind CSS
- **Authentication**: API Key-based
- **API Communication**: REST to Backend

## Project Structure

```
packages/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── transactions/         # Transaction management
│   │   ├── users/                # User management
│   │   ├── operations/           # Operation queue
│   │   ├── lootbox/              # Lootbox configuration
│   │   ├── pity/                 # Pity system config
│   │   └── assets/               # Asset management
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── transactions/
│   │   │   └── TransactionExecutor.tsx
│   │   ├── users/
│   │   │   └── UserTable.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Table.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── api.ts                # Admin API client
│   │   └── auth.ts               # Auth helpers
│   └── types/
│       └── index.ts
├── public/
├── tailwind.config.js
└── package.json
```

## Features

### 1. Dashboard
Overview of system metrics:
- Total users
- Pending operations
- Recent transactions
- System health status

### 2. Transaction Execution
Execute blockchain transactions for pending operations:
- DKG requests
- Sign requests
- Lootbox minting
- Asset minting

### 3. User Management
View and manage users:
- User list with search
- User details
- Wallet information
- DKG status
- Operation history

### 4. Operation Queue
Monitor and manage operations:
- View pending operations
- Execute individual operations
- Batch execution
- Error tracking

### 5. Lootbox Configuration
Configure lootbox drop rates:
- Rarity chances per lootbox type
- Enable/disable lootbox types
- View current configuration

### 6. Pity System Configuration
Manage pity thresholds:
- Item lootbox pity thresholds
- Pet egg pity thresholds
- Guaranteed rarity at thresholds

### 7. Asset Management
Manage item metadata:
- Add new items
- Edit existing items
- Enable/disable items from pools
- View item details

## API Integration

### Admin API Client
```typescript
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const adminApi = {
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}/admin${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-API-Key': ADMIN_API_KEY,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`);
    }

    return response.json();
  },

  // Transaction execution
  async executeTransaction(operationId: string) {
    return this.fetch('/tx/execute', {
      method: 'POST',
      body: JSON.stringify({ operationId }),
    });
  },

  // Users
  async getUsers(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.fetch(`/users?${query}`);
  },

  async getUser(userId: string) {
    return this.fetch(`/users/${userId}`);
  },

  // Operations
  async getOperations(params?: { status?: string; type?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.fetch(`/operations?${query}`);
  },

  // Lootbox config
  async getLootboxConfig() {
    return this.fetch('/lootbox/config');
  },

  async updateLootboxConfig(config: LootboxConfigUpdate) {
    return this.fetch('/lootbox/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  // Pity config
  async getPityConfig() {
    return this.fetch('/pity/config');
  },

  async addPityThreshold(threshold: PityThresholdInput) {
    return this.fetch('/pity/threshold', {
      method: 'POST',
      body: JSON.stringify(threshold),
    });
  },

  async removePityThreshold(type: 'item' | 'pet', threshold: number) {
    return this.fetch('/pity/threshold', {
      method: 'DELETE',
      body: JSON.stringify({ type, threshold }),
    });
  },

  // Assets
  async getAssetMetadata(params?: { slot?: number; rarity?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.fetch(`/assets/metadata?${query}`);
  },

  async addAssetMetadata(metadata: AssetMetadataInput) {
    return this.fetch('/assets/metadata', {
      method: 'POST',
      body: JSON.stringify(metadata),
    });
  },

  async disableAsset(itemId: string, rarity: number) {
    return this.fetch('/assets/disable', {
      method: 'POST',
      body: JSON.stringify({ itemId, rarity }),
    });
  },

  async enableAsset(itemId: string, rarity: number) {
    return this.fetch('/assets/enable', {
      method: 'POST',
      body: JSON.stringify({ itemId, rarity }),
    });
  },
};
```

## Components

### TransactionExecutor
Execute pending operations:
```tsx
interface TransactionExecutorProps {
  operation: Operation;
  onSuccess: () => void;
}

export function TransactionExecutor({ operation, onSuccess }: TransactionExecutorProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  async function handleExecute() {
    setIsExecuting(true);
    try {
      const result = await adminApi.executeTransaction(operation.id);
      setResult(result);
      onSuccess();
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{operation.type}</h3>
          <p className="text-sm text-gray-500">ID: {operation.id}</p>
        </div>
        <span className={`badge badge-${operation.status.toLowerCase()}`}>
          {operation.status}
        </span>
      </div>

      <pre className="bg-gray-100 p-2 rounded text-sm mb-4">
        {JSON.stringify(operation.requestData, null, 2)}
      </pre>

      <Button
        onClick={handleExecute}
        disabled={isExecuting || operation.status !== 'PENDING'}
        loading={isExecuting}
      >
        Execute Transaction
      </Button>

      {result && (
        <div className={`mt-4 p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          {result.success ? (
            <>
              <p className="text-green-800">Transaction successful!</p>
              {result.txDigest && <p className="text-sm">TX: {result.txDigest}</p>}
            </>
          ) : (
            <p className="text-red-800">Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### UserTable
Display user list:
```tsx
interface UserTableProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export function UserTable({ users, onSelectUser }: UserTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Wallet</th>
          <th>Level</th>
          <th>Gems</th>
          <th>DKG Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id.slice(0, 8)}...</td>
            <td>{user.wallets[0]?.address.slice(0, 10)}...</td>
            <td>{user.level}</td>
            <td>{user.gems}</td>
            <td>
              <span className={`badge badge-${user.dkgStatus}`}>
                {user.dkgStatus || 'None'}
              </span>
            </td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <Button size="sm" onClick={() => onSelectUser(user)}>
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### LootboxConfigEditor
Edit lootbox drop rates:
```tsx
interface LootboxConfigEditorProps {
  config: LootboxConfig;
  onSave: (config: LootboxConfig) => Promise<void>;
}

export function LootboxConfigEditor({ config, onSave }: LootboxConfigEditorProps) {
  const [editedConfig, setEditedConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);

  const lootboxTypes = [
    { id: 0, name: 'Regular Box' },
    { id: 1, name: 'Golden Box' },
    { id: 2, name: 'Diamond Box' },
    { id: 3, name: 'Pet Egg' },
  ];

  const rarities = ['Common', 'Uncommon', 'Epic', 'Mythic', 'Limited'];

  function handleChanceChange(typeId: number, rarityIndex: number, value: number) {
    setEditedConfig(prev => ({
      ...prev,
      [typeId]: prev[typeId].map((v, i) => i === rarityIndex ? value : v),
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(editedConfig);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {lootboxTypes.map(type => (
        <div key={type.id} className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">{type.name}</h3>
          <div className="grid grid-cols-5 gap-4">
            {rarities.map((rarity, index) => (
              <div key={rarity}>
                <label className="block text-sm mb-1">{rarity}</label>
                <input
                  type="number"
                  value={editedConfig[type.id]?.[index] ?? 0}
                  onChange={e => handleChanceChange(type.id, index, Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                  min={0}
                  max={10000}
                />
                <span className="text-xs text-gray-500">
                  {((editedConfig[type.id]?.[index] ?? 0) / 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} loading={isSaving}>
        Save Configuration
      </Button>
    </div>
  );
}
```

### PityConfigEditor
Edit pity thresholds:
```tsx
export function PityConfigEditor() {
  const [itemThresholds, setItemThresholds] = useState<PityThreshold[]>([]);
  const [petThresholds, setPetThresholds] = useState<PityThreshold[]>([]);
  const [newThreshold, setNewThreshold] = useState({ threshold: 0, rarity: 2 });
  const [activeType, setActiveType] = useState<'item' | 'pet'>('item');

  async function handleAddThreshold() {
    await adminApi.addPityThreshold({
      type: activeType,
      threshold: newThreshold.threshold,
      guaranteedRarity: newThreshold.rarity,
    });
    // Refresh thresholds
  }

  async function handleRemoveThreshold(threshold: number) {
    await adminApi.removePityThreshold(activeType, threshold);
    // Refresh thresholds
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={activeType === 'item' ? 'primary' : 'secondary'}
          onClick={() => setActiveType('item')}
        >
          Item Lootbox Pity
        </Button>
        <Button
          variant={activeType === 'pet' ? 'primary' : 'secondary'}
          onClick={() => setActiveType('pet')}
        >
          Pet Egg Pity
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Current Thresholds</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Opens</th>
              <th>Guaranteed Rarity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeType === 'item' ? itemThresholds : petThresholds).map(t => (
              <tr key={t.threshold}>
                <td>{t.threshold}</td>
                <td>{['Common', 'Uncommon', 'Epic', 'Mythic', 'Limited'][t.guaranteedRarity]}</td>
                <td>
                  <Button size="sm" variant="danger" onClick={() => handleRemoveThreshold(t.threshold)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Add New Threshold</h3>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Opens Until Trigger</label>
            <input
              type="number"
              value={newThreshold.threshold}
              onChange={e => setNewThreshold(prev => ({ ...prev, threshold: Number(e.target.value) }))}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Guaranteed Rarity</label>
            <select
              value={newThreshold.rarity}
              onChange={e => setNewThreshold(prev => ({ ...prev, rarity: Number(e.target.value) }))}
              className="border rounded px-2 py-1"
            >
              <option value={0}>Common</option>
              <option value={1}>Uncommon</option>
              <option value={2}>Epic</option>
              <option value={3}>Mythic</option>
              <option value={4}>Limited</option>
            </select>
          </div>
          <Button onClick={handleAddThreshold}>Add Threshold</Button>
        </div>
      </div>
    </div>
  );
}
```

## Pages

### Dashboard (`/`)
```tsx
export default function DashboardPage() {
  const { data: stats } = useQuery(['admin-stats'], adminApi.getStats);

  return (
    <AdminLayout>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers} />
        <StatCard title="Pending Operations" value={stats?.pendingOperations} />
        <StatCard title="Today's Check-ins" value={stats?.todayCheckIns} />
        <StatCard title="Active DKG Wallets" value={stats?.activeDkgWallets} />
      </div>
    </AdminLayout>
  );
}
```

### Operations (`/operations`)
```tsx
export default function OperationsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { data: operations, refetch } = useQuery(
    ['operations', statusFilter],
    () => adminApi.getOperations({ status: statusFilter })
  );

  return (
    <AdminLayout>
      <h1>Operation Queue</h1>

      <div className="mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="space-y-4">
        {operations?.map(op => (
          <TransactionExecutor
            key={op.id}
            operation={op}
            onSuccess={refetch}
          />
        ))}
      </div>
    </AdminLayout>
  );
}
```

## Environment Variables

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Admin authentication
ADMIN_API_KEY=your-admin-api-key

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
```

## Running the Admin Panel

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Lint
pnpm lint
```

## Security Considerations

1. **API Key Protection**: Never expose admin API key in client-side code
2. **Access Control**: Implement IP whitelisting if possible
3. **Audit Logging**: All admin actions should be logged
4. **Rate Limiting**: Prevent abuse of admin endpoints
5. **Two-Factor Auth**: Consider adding 2FA for sensitive operations

## Backend Admin Endpoints

The admin panel communicates with these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/tx/execute` | POST | Execute blockchain transaction |
| `/admin/users` | GET | List users |
| `/admin/users/:id` | GET | Get user details |
| `/admin/operations` | GET | List operations |
| `/admin/lootbox/config` | GET/POST | Lootbox configuration |
| `/admin/pity/threshold` | POST/DELETE | Pity thresholds |
| `/admin/assets/metadata` | GET/POST | Asset metadata |
| `/admin/assets/disable` | POST | Disable asset |
| `/admin/assets/enable` | POST | Enable asset |
