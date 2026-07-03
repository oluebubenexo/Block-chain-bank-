import { ethers } from 'ethers';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const NETWORKS = {
  Ethereum: {
    mainnet: 'https://cloudflare-eth.com',
    testnet: 'https://rpc2.sepolia.org',
    chainId: 1,
    testnetChainId: 11155111,
    currency: 'ETH'
  },
  Base: {
    mainnet: 'https://mainnet.base.org',
    testnet: 'https://sepolia.base.org',
    chainId: 8453,
    testnetChainId: 84532,
    currency: 'ETH' // Base uses ETH
  },
  Polygon: {
    mainnet: 'https://polygon-rpc.com',
    testnet: 'https://rpc-amoy.polygon.technology',
    chainId: 137,
    testnetChainId: 80002,
    currency: 'MATIC'
  },
  Arbitrum: {
    mainnet: 'https://arb1.arbitrum.io/rpc',
    testnet: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 42161,
    testnetChainId: 421614,
    currency: 'ETH'
  },
  Solana: {
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.devnet.solana.com',
    currency: 'SOL'
  }
};

export class NonCustodialWallet {
  private evmWallet: ethers.Wallet;
  private solanaKeypair: Keypair;

  constructor() {
    // Check if we have saved keys
    let evmPk = localStorage.getItem('vaulta_evm_pk');
    let solPk = localStorage.getItem('vaulta_sol_pk');

    if (!evmPk) {
      const hdWallet = ethers.Wallet.createRandom();
      this.evmWallet = new ethers.Wallet(hdWallet.privateKey);
      localStorage.setItem('vaulta_evm_pk', this.evmWallet.privateKey);
    } else {
      this.evmWallet = new ethers.Wallet(evmPk);
    }

    if (!solPk) {
      this.solanaKeypair = Keypair.generate();
      localStorage.setItem('vaulta_sol_pk', JSON.stringify(Array.from(this.solanaKeypair.secretKey)));
    } else {
      const secretKey = new Uint8Array(JSON.parse(solPk));
      this.solanaKeypair = Keypair.fromSecretKey(secretKey);
    }
  }

  get evmAddress() {
    return this.evmWallet.address;
  }

  get solanaAddress() {
    return this.solanaKeypair.publicKey.toString();
  }

  async getBalances(isTestnet: boolean) {
    const balances = {
      ETH: 0,
      BASE: 0,
      SOL: 0,
      USDC: 0,
      USDT: 0,
      BTC: 0,
      MATIC: 0,
      ARB: 0
    };

    try {
      // Fetch ETH
      const ethProvider = new ethers.JsonRpcProvider(isTestnet ? NETWORKS.Ethereum.testnet : NETWORKS.Ethereum.mainnet);
      const ethBal = await ethProvider.getBalance(this.evmAddress);
      balances.ETH = parseFloat(ethers.formatEther(ethBal));

      // Fetch Base ETH
      const baseProvider = new ethers.JsonRpcProvider(isTestnet ? NETWORKS.Base.testnet : NETWORKS.Base.mainnet);
      const baseBal = await baseProvider.getBalance(this.evmAddress);
      balances.BASE = parseFloat(ethers.formatEther(baseBal));

      // Fetch Polygon MATIC
      const polyProvider = new ethers.JsonRpcProvider(isTestnet ? NETWORKS.Polygon.testnet : NETWORKS.Polygon.mainnet);
      const polyBal = await polyProvider.getBalance(this.evmAddress);
      balances.MATIC = parseFloat(ethers.formatEther(polyBal));

      // Fetch Arbitrum ETH
      const arbProvider = new ethers.JsonRpcProvider(isTestnet ? NETWORKS.Arbitrum.testnet : NETWORKS.Arbitrum.mainnet);
      const arbBal = await arbProvider.getBalance(this.evmAddress);
      balances.ARB = parseFloat(ethers.formatEther(arbBal));

      // Fetch Solana
      const solConnection = new Connection(isTestnet ? NETWORKS.Solana.testnet : NETWORKS.Solana.mainnet);
      const solBal = await solConnection.getBalance(this.solanaKeypair.publicKey);
      balances.SOL = solBal / LAMPORTS_PER_SOL;

    } catch (e) {
      console.error('Failed to fetch real balances', e);
    }
    
    return balances;
  }

  async sendEvmTransaction(networkName: 'Ethereum' | 'Base' | 'Polygon' | 'Arbitrum', to: string, amount: string, isTestnet: boolean) {
    const rpc = isTestnet ? NETWORKS[networkName].testnet : NETWORKS[networkName].mainnet;
    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = this.evmWallet.connect(provider);

    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });

    return tx.hash;
  }

  async sendSolanaTransaction(to: string, amount: number, isTestnet: boolean) {
    const rpc = isTestnet ? NETWORKS.Solana.testnet : NETWORKS.Solana.mainnet;
    const connection = new Connection(rpc, 'confirmed');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.solanaKeypair.publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [this.solanaKeypair]
    );

    return signature;
  }
}

export const walletManager = new NonCustodialWallet();
