import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Edit3, QrCode, CreditCard, Shield, HelpCircle, LogOut } from 'lucide-react';
import { currentUser } from '../data';

export function ProfileView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
      <div className="px-6 pt-8 pb-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
      </div>

      <div className="px-6 pb-6">
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img src={currentUser.avatar} alt="Profile" className="w-20 h-20 rounded-full bg-white/80 border-4 border-white shadow-sm" />
            <button className="absolute bottom-0 right-0 w-7 h-7 glass-panel border border-gray-200 text-gray-900 rounded-full flex items-center justify-center shadow-sm">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{currentUser.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{currentUser.username}</p>
          <div className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Verified Account
          </div>
        </div>

        <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Account Details</h3>
        <div className="glass-panel rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-white/40 transition-colors border-b border-gray-200 text-left">
            <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">My QR Code</p>
              <p className="text-[10px] text-gray-500">Share to receive funds</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-white/40 transition-colors text-left">
            <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Account Limits</p>
              <p className="text-[10px] text-gray-500">$50,000 / day</p>
            </div>
          </button>
        </div>

        <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Support</h3>
        <div className="glass-panel rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-white/40 transition-colors text-left">
            <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Help Center</p>
              <p className="text-[10px] text-gray-500">Get support</p>
            </div>
          </button>
        </div>
        
        <button className="w-full mt-6 flex items-center justify-center gap-2 p-3 text-red-500 text-sm font-semibold hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
