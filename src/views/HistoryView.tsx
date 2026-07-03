import React, { useState } from 'react';
import { motion } from 'motion/react';
import { recentTransactions } from '../data';
import { ArrowUpRight, ArrowDownLeft, Plus, Filter, Search, ArrowLeft, Copy } from 'lucide-react';
import { Transaction } from '../types';

export function HistoryView() {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTx = recentTransactions.filter(tx => {
    const matchesFilter = filter === 'all' ? true : 
      filter === 'send' ? tx.type === 'send' : 
      tx.type === 'receive' || tx.type === 'deposit';
      
    if (!matchesFilter) return false;
    
    if (searchQuery.trim() === '') return true;
    
    const query = searchQuery.toLowerCase();
    const name = tx.type === 'send' ? (tx.recipientName || '') : tx.type === 'receive' ? (tx.senderName || '') : 'deposit';
    const notes = tx.notes || '';
    
    return name.toLowerCase().includes(query) || notes.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredTx.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTx = filteredTx.slice(startIndex, startIndex + itemsPerPage);

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
      <div className="px-6 pt-8 pb-3 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">History</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full glass-panel shadow-sm border border-gray-200 text-gray-900 text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400"
          />
        </div>
        
        <div className="grid grid-cols-3 items-center w-full pb-1">
          <div className="flex justify-start">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'all' 
                  ? 'glass-panel border border-gray-200 text-gray-900' 
                  : 'glass-panel text-gray-600 border border-gray-200 hover:bg-white/40'
              }`}
            >
              All
            </button>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                setFilter('send');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'send' 
                  ? 'glass-panel border border-gray-200 text-gray-900' 
                  : 'glass-panel text-gray-600 border border-gray-200 hover:bg-white/40'
              }`}
            >
              Send
            </button>
          </div>

          <div className="flex justify-end items-center gap-1.5">
            <button
              onClick={() => {
                setFilter('receive');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'receive' 
                  ? 'glass-panel border border-gray-200 text-gray-900' 
                  : 'glass-panel text-gray-600 border border-gray-200 hover:bg-white/40'
              }`}
            >
              Receive
            </button>
            <button className="p-1.5 glass-panel text-gray-600 border border-gray-200 rounded-full hover:bg-white/40 transition-colors cursor-pointer" title="More Filters">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-3 space-y-3">
        {paginatedTx.map((tx, i) => (
          <motion.div 
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between glass-panel shadow-sm border border-gray-200 p-3 rounded-xl cursor-pointer hover:border-emerald-100 transition-colors"
            onClick={() => setSelectedTx(tx)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center">
                {getTxIcon(tx.type)}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {tx.type === 'send' ? tx.recipientName : tx.type === 'receive' ? tx.senderName : 'Deposit'}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold  ${tx.type === 'receive' || tx.type === 'deposit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 ">{tx.currency}</p>
            </div>
          </motion.div>
        ))}
        
        {paginatedTx.length === 0 && (
          <div className="text-center py-12 glass-panel border border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-400 font-semibold">No transactions found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 glass-panel border border-gray-200 mt-6 rounded-2xl mx-6 shadow-sm">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/40 border border-gray-200 text-gray-600 hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-emerald-600 text-gray-900 shadow-sm'
                      : 'bg-white/40 text-gray-600 border border-gray-200 hover:bg-white/60'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/40 border border-gray-200 text-gray-600 hover:bg-white/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {selectedTx && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
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
                  <button className="text-gray-400 hover:text-gray-900"><Copy className="w-3.5 h-3.5" /></button>
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
    </div>
  );
}
