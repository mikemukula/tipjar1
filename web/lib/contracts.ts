// ─── Deployed contract addresses ─────────────────────────────────────────────

export const TIPJAR_REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ??
  '0x9c69aa76f0D565eC514563E36bf9371ba7E74F05';

// GoodDollar G$ token on Celo Mainnet
export const G_DOLLAR_ADDRESS: `0x${string}` =
  '0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A';

// ─── TipJarRegistry ABI ───────────────────────────────────────────────────────

export const TIPJAR_REGISTRY_ABI = [
  // Registration
  {
    name: 'registerCreator',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'username', type: 'string' }],
    outputs: [],
  },
  {
    name: 'updateUsername',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newUsername', type: 'string' }],
    outputs: [],
  },
  {
    name: 'deactivate',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  // Tipping
  {
    name: 'sendTip',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'creatorUsername', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'message', type: 'string' },
    ],
    outputs: [],
  },
  // Views
  {
    name: 'getCreator',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'username', type: 'string' }],
    outputs: [
      { name: 'wallet', type: 'address' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    name: 'getUsernameByWallet',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'isRegistered',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  // Events
  {
    name: 'TipSent',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'creatorUsername', type: 'string', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'message', type: 'string', indexed: false },
    ],
  },
  {
    name: 'CreatorRegistered',
    type: 'event',
    inputs: [
      { name: 'wallet', type: 'address', indexed: true },
      { name: 'username', type: 'string', indexed: false },
    ],
  },
] as const;

// ─── ERC-20 ABI (minimal — approve + allowance + balanceOf) ──────────────────

export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;
