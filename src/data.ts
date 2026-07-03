import { Transaction, User } from './types';
import { walletManager } from './lib/blockchain';

export const currentUser: User = {
  id: 'usr_local',
  name: 'Self Custody',
  username: '@vaulta',
  accountNumber: 'Generating...',
  balances: {
    USDC: 0.0,
    SOL: 0.0,
    USDT: 0.0,
    ETH: 0.0,
    BTC: 0.0,
    BASE: 0.0,
    MATIC: 0.0,
    ARB: 0.0
  },
  walletAddress: '', // To be filled dynamically
  avatar: 'https://i.pravatar.cc/150?u=usr_local',
};

// Function to derive a deterministic traditional bank account number from wallet address
export function deriveTraditionalBankAccount(evmAddress: string): string {
  if (!evmAddress || evmAddress.length < 10) return '00-11-22 33445566';
  
  const clean = evmAddress.replace('0x', '');
  
  // Generate a standard Sort Code (6 digits formatted as XX-XX-XX)
  let sortCodeDigits = '';
  for (let i = 0; i < 6; i++) {
    sortCodeDigits += (clean.charCodeAt(i) % 10).toString();
  }
  const sortCode = `${sortCodeDigits.slice(0, 2)}-${sortCodeDigits.slice(2, 4)}-${sortCodeDigits.slice(4, 6)}`;
  
  // Generate an Account Number (8 digits)
  let accountNumber = '';
  for (let i = 6; i < 14; i++) {
    accountNumber += (clean.charCodeAt(i) % 10).toString();
  }
  
  return `Sort Code: ${sortCode} • Acc: ${accountNumber}`;
}

// Also expose EVM address for UI
export let currentEvmAddress = '';

export const recentTransactions: Transaction[] = [];
export const notifications: any[] = [];

// Synchronization utility to pull real blockchain balances
type Listener = () => void;
const listeners: Listener[] = [];

export function subscribeToUserData(listener: Listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

export async function refreshUserData(isTestnet?: boolean): Promise<void> {
  try {
    const isTestnetMode = isTestnet !== undefined ? isTestnet : (localStorage.getItem('vaulta_isTestnet') !== 'false');

    // Populate addresses
    currentUser.walletAddress = walletManager.solanaAddress;
    currentEvmAddress = walletManager.evmAddress;
    
    // Populate derived bank account number
    currentUser.accountNumber = deriveTraditionalBankAccount(currentEvmAddress);
    
    // Fetch real balances
    const realBalances = await walletManager.getBalances(isTestnetMode);
    
    currentUser.balances = {
      ...currentUser.balances,
      ETH: realBalances.ETH,
      BASE: realBalances.BASE,
      SOL: realBalances.SOL,
      MATIC: realBalances.MATIC,
      ARB: realBalances.ARB
    };

    // We can simulate fetching history locally or use a block explorer API
    // For now, let's keep local transactions state
    const savedHistory = localStorage.getItem('vaulta_tx_history');
    if (savedHistory) {
      recentTransactions.length = 0;
      recentTransactions.push(...JSON.parse(savedHistory));
    }

    listeners.forEach(l => l());
  } catch (err) {
    console.error('Failed to sync user data with blockchain:', err);
  }
}

export function saveTransactionLocally(tx: Transaction) {
  recentTransactions.unshift(tx);
  localStorage.setItem('vaulta_tx_history', JSON.stringify(recentTransactions));
}
