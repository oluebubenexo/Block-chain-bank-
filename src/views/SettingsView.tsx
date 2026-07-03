import React, { useState } from 'react';
import { Shield, Bell, Lock, Smartphone, Key, Globe, EyeOff, ChevronRight, Fingerprint, Activity, Clock, Laptop, Server } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

export function SettingsView() {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const { isTestnet, setIsTestnet } = useNetwork();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-white/40 h-full">
      <div className="px-6 pt-8 pb-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="px-6 space-y-6">
        {/* Security */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Security</h3>
          <div className="glass-panel rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Biometric Authentication</p>
                  <p className="text-[10px] text-gray-500">Face ID / Touch ID</p>
                </div>
              </div>
              <button 
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${biometricsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 glass-panel rounded-full absolute top-0.5 transition-all ${biometricsEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Auth (2FA)</p>
                  <p className="text-[10px] text-gray-500">Authenticator App / SMS</p>
                </div>
              </div>
              <button 
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${mfaEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 glass-panel rounded-full absolute top-0.5 transition-all ${mfaEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-white/40 transition-colors border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 text-left">Change PIN</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-white/40 transition-colors border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 text-left">Device Management</p>
                  <p className="text-[10px] text-gray-500 text-left">Verified devices & sessions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-white/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 text-left">Security Log</p>
                  <p className="text-[10px] text-gray-500 text-left">Recent account activity</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Preferences</h3>
          <div className="glass-panel rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-[10px] text-gray-500">Transfers & alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 glass-panel rounded-full absolute top-0.5 transition-all ${notificationsEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>

            <button className="w-full flex items-center justify-between p-3 hover:bg-white/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 text-left">Currency</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">USD</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Network & Blockchain */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Network & Blockchain</h3>
          <div className="glass-panel rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center text-gray-900">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Testnet Mode</p>
                  <p className="text-[10px] text-gray-500">Use live blockchain Testnets (Sepolia, Devnet)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTestnet(!isTestnet)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isTestnet ? 'bg-amber-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 glass-panel rounded-full absolute top-0.5 transition-all ${isTestnet ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
            
            {!isTestnet && (
              <div className="p-3 bg-red-50 border-l-2 border-red-500">
                <p className="text-[10px] font-medium text-red-600 uppercase tracking-wide">Warning</p>
                <p className="text-xs text-red-800 mt-1">You are connected to Mainnet. All transactions are real and irreversible.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
