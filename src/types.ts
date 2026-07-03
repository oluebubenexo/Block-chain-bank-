export type Currency = 'USDC' | 'SOL' | 'USDT' | 'ETH' | 'BTC' | 'BASE' | 'MATIC' | 'ARB';

export type BlockchainNetwork = 'Solana' | 'Ethereum' | 'Bitcoin' | 'Base' | 'Polygon' | 'Arbitrum';

export type User = {
  id: string;
  name: string;
  username: string;
  accountNumber: string;
  balances: Record<Currency, number>;
  avatar?: string;
  walletAddress?: string;
};

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  type: 'send' | 'receive' | 'deposit';
  amount: number;
  currency: Currency;
  network?: BlockchainNetwork;
  date: string;
  status: TransactionStatus;
  recipientName?: string;
  senderName?: string;
  notes?: string;
  blockchainRef?: string;
};
