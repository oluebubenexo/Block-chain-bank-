import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { currentUser, recentTransactions, notifications, refreshUserData, subscribeToUserData } from '../data';
import { ArrowUpRight, ArrowDownLeft, QrCode, Send, Plus, Bell, ChevronDown, Check, Eye, EyeOff, ArrowRightLeft, ScanLine, HelpCircle, Loader2, Copy, ArrowLeft } from 'lucide-react';
import { Transaction, Currency } from '../types';
import { useNetwork } from '../context/NetworkContext';

export function DashboardView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { isTestnet } = useNetwork();
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'GBP' | 'USDC'>('USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  useEffect(() => {
    const unsubscribe = subscribeToUserData(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    return unsubscribe;
  }, []);
  
  const hasUnread = notifications.some(n => n.unread);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencies: ('USD' | 'GBP' | 'USDC')[] = ['USD', 'GBP', 'USDC'];

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUser.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUser.accountNumber;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const totalUsd = (currentUser.balances.USDC || 0) + 
                   (currentUser.balances.USDT || 0) + 
                   ((currentUser.balances.SOL || 0) * 145.20) +
                   ((currentUser.balances.ETH || 0) * 3500.0) +
                   ((currentUser.balances.BTC || 0) * 65000.0) +
                   ((currentUser.balances.BASE || 0) * 1.0);

  const formatBalanceVal = (val: number) => {
    if (selectedCurrency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(val);
    } else if (selectedCurrency === 'GBP') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
      }).format(val * 0.78);
    } else if (selectedCurrency === 'USDC') {
      return val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' USDC';
    }
    return '';
  };

  const getDisplayBalance = () => {
    return formatBalanceVal(totalUsd);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatCurrency = (amount: number, currency?: string) => {
    if (currency === 'SOL') {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' SOL';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTxIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-5 h-5 text-gray-900" />;
      case 'receive': return <ArrowDownLeft className="w-5 h-5 text-gray-900" />;
      case 'deposit': return <Plus className="w-5 h-5 text-gray-900" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-white/40 h-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={() => onNavigate('profile')} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer">
          <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt="Profile" className="w-8 h-8 rounded-full bg-gray-200" />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-gray-500 font-semibold">{currentUser.name}</p>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${isTestnet ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isTestnet ? 'Testnet' : 'Mainnet'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{currentUser.username}</p>
          </div>
        </button>
        <button onClick={() => onNavigate('notifications')} className="w-8 h-8 rounded-full glass-panel shadow-sm border border-gray-200 flex items-center justify-center relative text-gray-900 active:scale-95 transition-transform cursor-pointer">
          <Bell className="w-4 h-4" />
          {hasUnread && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white"></span>}
        </button>
      </div>

      {/* Balance Card */}
      <div className="px-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 relative overflow-visible z-20 shadow-sm border border-emerald-500/10"
        >
          {/* Premium Background Layer with Overflow Clipping for Glows */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
            {/* Base subtle green gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-emerald-50/20 to-white/95" />
            
            {/* Top Right Slow Pulsing Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.12, 0.22, 0.12]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"
            />

            {/* Bottom Left Slow Pulsing Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.12, 1],
                opacity: [0.05, 0.12, 0.05]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-300 rounded-full blur-3xl"
            />
          </div>
          
          <div className="flex items-center justify-between mb-2 relative z-30">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 font-semibold">Total Balance</p>
              <button 
                onClick={() => setIsBalanceHidden(!isBalanceHidden)} 
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/60 hover:bg-gray-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-gray-900">{selectedCurrency}</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-28 glass-panel border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    {currencies.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCurrency(c);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/40 transition-colors text-left cursor-pointer"
                      >
                        <span className={`text-xs font-bold ${selectedCurrency === c ? 'text-emerald-600' : 'text-gray-900'}`}>{c}</span>
                        {selectedCurrency === c && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 relative z-10 text-gray-900">
            {isBalanceHidden ? '****' : getDisplayBalance()}
          </h2>
          
          <div className="flex items-start justify-between relative z-10 mt-3 border-t border-gray-100 pt-3">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold bg-white/40 px-2 py-0.5 rounded border border-gray-200">
                Account Name
              </span>
              <p className="text-xs font-bold text-gray-800 mt-1">{currentUser.name}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 font-semibold bg-white/40 px-2 py-0.5 rounded border border-gray-200">
                Account Number
              </span>
              <button
                id="copy-account-btn"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-gray-800 mt-1 hover:text-gray-900 transition-colors cursor-pointer group"
                title="Copy Account Number"
              >
                <span>{currentUser.accountNumber}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="flex justify-between gap-1 sm:gap-4">
          <button 
            onClick={() => onNavigate('receive')} 
            className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 glass-panel shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center text-teal-600 hover:border-teal-100 transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Receive</span>
          </button>

          <button 
            onClick={() => onNavigate('transfer')} 
            className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 glass-panel shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center text-indigo-600 hover:border-indigo-100 transition-colors">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Transfer</span>
          </button>
          
          <button 
            onClick={() => onNavigate('request')}
            className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 glass-panel shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center text-purple-500 hover:border-purple-100 transition-colors">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Request</span>
          </button>
          
          <button 
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 glass-panel shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center text-orange-500 hover:border-orange-100 transition-colors">
              <ScanLine className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Scan</span>
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button onClick={() => onNavigate('history')} className="text-xs font-bold text-emerald-600 hover:opacity-80 transition-opacity cursor-pointer">See All</button>
        </div>

        <div className="space-y-3">
          {recentTransactions.slice(0, 2).map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between glass-panel shadow-sm border border-gray-200 p-3 rounded-xl cursor-pointer hover:border-emerald-100 transition-all"
              onClick={() => setSelectedTx(tx)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center">
                  {getTxIcon(tx.type)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {tx.type === 'send' ? tx.recipientName : tx.type === 'receive' ? tx.senderName : 'Deposit'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'receive' || tx.type === 'deposit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{tx.currency}</p>
              </div>
            </motion.div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-8 glass-panel border border-gray-200 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-semibold">No recent activity yet</p>
            </div>
          )}
        </div>
      </div>


      <AnimatePresence>
        {selectedTx && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 z-30 bg-[#f6f8fd] flex flex-col h-full overflow-y-auto no-scrollbar"
          >
            <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 sticky top-0 bg-white/80 backdrop-blur-md">
              <button onClick={() => setSelectedTx(null)} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
            </div>
            
            <div className="px-6 py-6 flex flex-col items-center">
              <div className="w-16 h-16 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center mb-4">
                {getTxIcon(selectedTx.type)}
              </div>
              <h3 className={`text-3xl font-semibold mb-1 ${selectedTx.type === 'receive' || selectedTx.type === 'deposit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                {selectedTx.type === 'send' ? '-' : '+'}{formatCurrency(selectedTx.amount, selectedTx.currency)}
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-8">{new Date(selectedTx.date).toLocaleString()}</p>
              
              <div className="w-full glass-panel rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-medium">Status</span>
                  <span className="text-xs font-semibold text-emerald-600 capitalize bg-emerald-50 px-2.5 py-1 rounded-md">{selectedTx.status}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-medium">Type</span>
                  <span className="text-xs font-semibold text-gray-900 capitalize">{selectedTx.type}</span>
                </div>
                {selectedTx.type === 'send' && (
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-medium">Recipient</span>
                    <span className="text-xs font-semibold text-gray-900">{selectedTx.recipientName}</span>
                  </div>
                )}
                {selectedTx.type === 'receive' && (
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-medium">Sender</span>
                    <span className="text-xs font-semibold text-gray-900">{selectedTx.senderName}</span>
                  </div>
                )}
                {selectedTx.notes && (
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-medium">Note</span>
                    <span className="text-xs font-medium text-gray-900 text-right max-w-[150px]">{selectedTx.notes}</span>
                  </div>
                )}
              </div>
              
              <div className="w-full glass-panel rounded-2xl shadow-sm border border-gray-200 p-5 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-600 bg-white/40 px-2 py-1 rounded">{selectedTx.id}</span>
                    <button className="text-gray-400 hover:text-gray-900 active:scale-95" onClick={() => navigator.clipboard.writeText(selectedTx.id)}><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Blockchain Ref</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-600 bg-white/40 px-2 py-1 rounded truncate max-w-[150px]">
                      {selectedTx.blockchainRef ? (
                        selectedTx.blockchainRef.length > 12 
                          ? `${selectedTx.blockchainRef.substring(0,6)}...${selectedTx.blockchainRef.substring(selectedTx.blockchainRef.length - 6)}` 
                          : selectedTx.blockchainRef
                      ) : 'None / Ledger Only'}
                    </span>
                    {selectedTx.blockchainRef && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedTx.blockchainRef || '')}
                        className="text-gray-400 hover:text-gray-900 active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
