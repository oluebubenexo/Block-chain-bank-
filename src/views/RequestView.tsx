import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, User as UserIcon } from 'lucide-react';
import { currentUser } from '../data';

export function RequestView({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const [step, setStep] = useState<'requester' | 'amount' | 'confirm'>('requester');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0');

  const handleAmountInput = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else if (amount === '0.') {
      setAmount('0.' + num);
    } else if (amount.includes('.') && amount.split('.')[1].length >= 2) {
      return;
    } else if (amount.replace('.', '').length >= 6 && num !== '0') {
      return;
    } else {
      setAmount(amount + num);
    }
  };

  const handleRequest = () => {
    setTimeout(onComplete, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
      <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 relative">
        <button onClick={step === 'requester' ? onBack : () => setStep(step === 'amount' ? 'requester' : 'amount')} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {step === 'requester' ? 'Request Money' : step === 'amount' ? 'Enter Amount' : 'Confirm'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 'requester' && (
          <motion.div
            key="requester"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col"
          >
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Name, @username, or Account #"
                className="w-full glass-panel shadow-sm border border-gray-200 text-gray-900 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium placeholder:text-gray-400"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && recipient) setStep('amount');
                }}
              />
            </div>

            <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Recent Contacts</h3>
            <div className="space-y-2">
              {['Marcus Wong', 'Sarah Jenkins'].map((name, i) => (
                <button 
                  key={name}
                  onClick={() => { setRecipient(name); setStep('amount'); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/60 rounded-xl transition-colors text-left border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-[10px] text-gray-500">001166{(2000 + i * 42).toString().padStart(4, '0')}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'amount' && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-between pb-6"
          >
            <div className="flex flex-col items-center mt-8">
              <div className="glass-panel shadow-sm border border-gray-200 px-3 py-1.5 rounded-full mb-6">
                <p className="text-xs font-medium text-gray-500">From: <span className="text-gray-900">{recipient || 'Marcus Wong'}</span></p>
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                <span className="text-3xl text-gray-400">$</span>
                <span className="text-5xl font-semibold tracking-tighter text-gray-900">{amount}</span>
              </div>
            </div>

            <div className="w-full px-6 mt-auto">
              <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mx-auto mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleAmountInput(num.toString())}
                    className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-medium active:bg-white/40 transition-colors text-gray-900"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => { 
                    if(amount.includes('.')) return;
                    setAmount(amount + '.');
                  }}
                  className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-medium active:bg-white/40 transition-colors text-gray-900"
                >
                  .
                </button>
                <button
                  onClick={() => handleAmountInput('0')}
                  className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-medium active:bg-white/40 transition-colors text-gray-900"
                >
                  0
                </button>
                <button
                  onClick={() => setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0')}
                  className="h-14 rounded-xl flex items-center justify-center text-gray-500 active:text-gray-900 transition-colors font-medium text-sm"
                >
                  Del
                </button>
              </div>

              <button 
                onClick={() => setStep('confirm')}
                disabled={amount === '0' || amount === '0.'}
                className="w-full bg-purple-600 text-gray-900 text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:bg-white/80 disabled:text-gray-400"
              >
                Review Request
              </button>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col pt-6 pb-6"
          >
            <div className="glass-panel shadow-sm border border-gray-200 rounded-3xl p-6 text-center mb-6">
               <p className="text-xs text-gray-500 font-medium mb-3">You are requesting</p>
               <h2 className="text-4xl font-semibold mb-6 text-gray-900">${amount}</h2>
               
               <div className="flex items-center justify-between py-3 border-b border-gray-200 text-sm">
                 <span className="text-gray-500">From</span>
                 <span className="font-medium text-gray-900">{recipient || 'Marcus Wong'}</span>
               </div>
               
               <div className="flex items-center justify-between py-3 text-sm">
                 <span className="text-gray-500">Note</span>
                 <span className="font-medium text-gray-400 italic">Optional</span>
               </div>
            </div>

            <button 
                onClick={handleRequest}
                className="mt-auto w-full glass-panel border border-gray-200 text-gray-900 text-sm font-semibold py-3.5 rounded-xl active:scale-95 transition-transform"
              >
                Send Request
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
