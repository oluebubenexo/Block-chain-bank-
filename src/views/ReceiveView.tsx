import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Share, Check } from 'lucide-react';
import { currentUser, currentEvmAddress } from '../data';
import { useNetwork } from '../context/NetworkContext';

export function ReceiveView({ onBack }: { onBack: () => void }) {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedEvmAddress, setCopiedEvmAddress] = useState(false);
  const { isTestnet } = useNetwork();

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(currentUser.accountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleCopyAddress = () => {
    if (currentUser.walletAddress) {
      navigator.clipboard.writeText(currentUser.walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleCopyEvmAddress = () => {
    if (currentEvmAddress) {
      navigator.clipboard.writeText(currentEvmAddress);
      setCopiedEvmAddress(true);
      setTimeout(() => setCopiedEvmAddress(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
       {/* Header */}
       <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 relative">
        <button onClick={onBack} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Receive Funds</h2>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center justify-center pb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-6 w-full max-w-sm flex flex-col items-center shadow-sm border border-gray-200 relative overflow-hidden"
        >
          {/* QR Code Graphic representing their actual address */}
          <div className="w-40 h-40 bg-white/40 border border-gray-200 rounded-2xl mb-6 p-4 flex items-center justify-center relative shadow-xs">
             <div className="grid grid-cols-5 grid-rows-5 gap-1.5 w-full h-full opacity-80">
               {[...Array(25)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm ${
                      (i * 7 + 13) % 5 === 0 || (i + 3) % 4 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                        ? 'glass-panel border border-gray-200' 
                        : 'bg-transparent'
                    }`}
                  />
               ))}
             </div>
             {/* Styling standard QR layout anchors */}
             <div className="absolute top-4 left-4 w-9 h-9 border-4 border-gray-900 rounded-lg bg-white/40 flex items-center justify-center">
               <div className="w-3 h-3 glass-panel border border-gray-200 rounded-xs"></div>
             </div>
             <div className="absolute top-4 right-4 w-9 h-9 border-4 border-gray-900 rounded-lg bg-white/40 flex items-center justify-center">
               <div className="w-3 h-3 glass-panel border border-gray-200 rounded-xs"></div>
             </div>
             <div className="absolute bottom-4 left-4 w-9 h-9 border-4 border-gray-900 rounded-lg bg-white/40 flex items-center justify-center">
               <div className="w-3 h-3 glass-panel border border-gray-200 rounded-xs"></div>
             </div>
          </div>

          <h3 className="text-gray-900 text-xl font-bold mb-1">{currentUser.name}</h3>
          <p className="text-gray-500 text-xs font-semibold mb-6">{currentUser.username}</p>
          
          <div className="w-full space-y-3">
            {/* Account identifier */}
            <div className="w-full bg-white/40 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Account Number</p>
                <p className="text-gray-900 text-sm font-bold tracking-tight">{currentUser.accountNumber}</p>
              </div>
              <button 
                onClick={handleCopyAcc}
                className="w-8 h-8 glass-panel rounded-full flex items-center justify-center shadow-xs border border-gray-200 text-gray-900 active:scale-90 cursor-pointer"
              >
                {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              </button>
            </div>

            {/* Live EVM Wallet Address */}
            <div className="w-full bg-white/40 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="overflow-hidden mr-2">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">EVM Networks (ETH, Base)</p>
                <p className="text-gray-900 text-xs font-mono font-semibold truncate">
                  {currentEvmAddress || 'Generating...'}
                </p>
              </div>
              <button 
                onClick={handleCopyEvmAddress}
                className="w-8 h-8 glass-panel rounded-full flex items-center justify-center shadow-xs border border-gray-200 text-gray-900 active:scale-90 cursor-pointer shrink-0"
              >
                {copiedEvmAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              </button>
            </div>

            {/* Live Solana Wallet Address */}
            <div className="w-full bg-white/40 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="overflow-hidden mr-2">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Solana Network</p>
                <p className="text-gray-900 text-xs font-mono font-semibold truncate">
                  {currentUser.walletAddress || 'Generating...'}
                </p>
              </div>
              <button 
                onClick={handleCopyAddress}
                className="w-8 h-8 glass-panel rounded-full flex items-center justify-center shadow-xs border border-gray-200 text-gray-900 active:scale-90 cursor-pointer shrink-0"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 w-full mt-6">
            <button className="flex-1 glass-panel border border-gray-200 hover:bg-gray-100 text-gray-900 text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
              <Share className="w-4 h-4" />
              Share Details
            </button>
          </div>
        </motion.div>
        
        <p className="text-gray-400 text-[10px] font-bold mt-6 text-center max-w-[240px]">
          Funds sent to these addresses on {isTestnet ? 'Testnet' : 'Mainnet'} will arrive instantly via decentralized non-custodial blockchain.
        </p>
      </div>
    </div>
  );
}
