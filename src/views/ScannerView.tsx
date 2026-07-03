import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ScanLine } from 'lucide-react';

export function ScannerView({ onBack }: { onBack: () => void }) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col glass-panel border border-gray-200 h-full relative overflow-hidden">
      <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 relative">
        <button onClick={onBack} className="w-8 h-8 glass-panel/10 rounded-full flex items-center justify-center active:scale-95 text-gray-900 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Scan QR Code</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-64 h-64">
          {/* Scanner Frame */}
          <div className="absolute inset-0 border-2 border-gray-200 rounded-3xl"></div>
          
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl"></div>

          {scanning && (
            <motion.div 
              animate={{ y: [0, 256, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.5)] z-10"
            />
          )}

          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900 bg-black/50 backdrop-blur-sm rounded-3xl z-20">
              <ScanLine className="w-8 h-8 mb-2 text-emerald-500" />
              <p className="font-medium text-sm">QR Code Found</p>
              <button onClick={onBack} className="mt-4 bg-emerald-500 text-gray-900 px-6 py-2 rounded-xl text-sm font-semibold">Proceed</button>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-8">Align QR code within the frame to scan</p>
      </div>
    </div>
  );
}
