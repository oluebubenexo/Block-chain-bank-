import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRightLeft, Globe, ChevronRight } from 'lucide-react';

export function TransferView({ onBack, onNavigate }: { onBack: () => void, onNavigate: (view: string) => void }) {
  const [step, setStep] = useState<'network' | 'amount'>('network');

  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
      <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 relative">
        <button onClick={step === 'amount' ? () => setStep('network') : onBack} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Transfer</h2>
      </div>

      <div className="px-6 pt-4 flex-1 flex flex-col">
        {step === 'network' ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">Choose Transfer Network</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate('send')}
                className="w-full glass-panel p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-gray-900 transition-colors">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900">Vaulta to Vaulta</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Instant & free transfers between Vaulta users</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </button>

              <button 
                onClick={() => setStep('amount')}
                className="w-full glass-panel p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-gray-900 transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900">Vaulta to Other Network</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Send to external crypto wallets or banks</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col items-center justify-center text-center pb-20">
            <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-[250px]">
              Transferring amounts via these networks is currently under development.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
