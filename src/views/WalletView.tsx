import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { currentUser, currentEvmAddress, refreshUserData, subscribeToUserData } from '../data';
import { ArrowUpRight, ArrowDownLeft, Plus, Wallet as WalletIcon, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

export function WalletView() {
  const { isTestnet } = useNetwork();
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedSol, setCopiedSol] = useState(false);
  const [copiedEvm, setCopiedEvm] = useState(false);
  
  useEffect(() => {
    const unsubscribe = subscribeToUserData(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    return unsubscribe;
  }, []);
  
  const solPrice = 145.20;
  
  const calculateTotalUsd = () => {
    return (currentUser.balances.USDC || 0) + 
           (currentUser.balances.USDT || 0) + 
           ((currentUser.balances.SOL || 0) * 145.20) +
           ((currentUser.balances.ETH || 0) * 3500.0) +
           ((currentUser.balances.BTC || 0) * 65000.0) +
           ((currentUser.balances.BASE || 0) * 1.0) +
           ((currentUser.balances.MATIC || 0) * 0.5) +
           ((currentUser.balances.ARB || 0) * 1.0);
  };

  const formatUsd = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getPrice = (curr: string) => {
    switch(curr) {
      case 'SOL': return 145.20;
      case 'ETH': return 3500.0;
      case 'BTC': return 65000.0;
      case 'MATIC': return 0.50;
      case 'ARB': return 1.0;
      case 'USDC':
      case 'USDT':
      case 'BASE':
      default: return 1.0;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserData(isTestnet);
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleRefresh();
  }, [isTestnet]);

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-white/40 h-full">
      <div className="px-6 pt-8 pb-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Assets</h2>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className={`p-2 rounded-full glass-panel shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 mb-8">
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 font-medium">Total Portfolio Value</p>
            <button
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              title={isBalanceHidden ? "Show balances" : "Hide balances"}
            >
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <h2 className="text-3xl font-semibold  text-gray-900 mb-2">
            {isBalanceHidden ? '$****' : formatUsd(calculateTotalUsd())}
          </h2>
        </div>

        {/* Wallet Addresses */}
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Wallet Addresses</h3>
          
          <div className="glass-panel rounded-xl p-3 shadow-sm border border-gray-200 flex justify-between items-center">
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">EVM Networks (ETH, Base, Polygon)</p>
              <p className="text-xs font-mono text-gray-800 truncate pr-4 mt-0.5">{currentEvmAddress || 'Generating...'}</p>
            </div>
            <button onClick={() => copyToClipboard(currentEvmAddress, setCopiedEvm)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
              {copiedEvm ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="glass-panel rounded-xl p-3 shadow-sm border border-gray-200 flex justify-between items-center">
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Solana Network</p>
              <p className="text-xs font-mono text-gray-800 truncate pr-4 mt-0.5">{currentUser.walletAddress || 'Generating...'}</p>
            </div>
            <button onClick={() => copyToClipboard(currentUser.walletAddress, setCopiedSol)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
              {copiedSol ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-3">Your Assets</h3>
        
        <div className="space-y-3">
          {(['ETH', 'SOL', 'BASE', 'MATIC', 'ARB', 'USDC', 'USDT', 'BTC'] as const).map(curr => {
            const bal = currentUser.balances[curr as any] || 0;
            // hide 0 balances to save space, but always show ETH and SOL
            if (bal === 0 && curr !== 'ETH' && curr !== 'SOL') return null; 
            
            const usdValue = bal * getPrice(curr);
            
            return (
              <div key={curr} className="glass-panel rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center font-bold text-gray-800 text-xs border border-gray-200">
                    {curr}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{curr === 'USDC' || curr === 'USDT' ? 'USD Coin' : curr === 'BTC' ? 'Bitcoin' : curr === 'ETH' ? 'Ethereum' : curr === 'SOL' ? 'Solana' : curr === 'MATIC' ? 'Polygon' : curr === 'ARB' ? 'Arbitrum' : 'Base'}</p>
                    <p className="text-[10px] text-gray-500">{curr}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold  text-gray-900">
                    {isBalanceHidden ? '$****' : formatUsd(usdValue)}
                  </p>
                  <p className="text-[10px] text-gray-500 ">
                    {isBalanceHidden ? `**** ${curr}` : `${bal.toLocaleString(undefined, {maximumFractionDigits: 6})} ${curr}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
