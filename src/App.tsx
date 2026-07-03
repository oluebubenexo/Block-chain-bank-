import React, { useState, useEffect } from 'react';
import { MobileContainer } from './components/MobileContainer';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { SendView } from './views/SendView';
import { ReceiveView } from './views/ReceiveView';
import { WalletView } from './views/WalletView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { TransferView } from './views/TransferView';
import { RequestView } from './views/RequestView';
import { ScannerView } from './views/ScannerView';
import { NotificationsView } from './views/NotificationsView';
import { Home, Wallet, Clock, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { refreshUserData } from './data';
import { NetworkProvider } from './context/NetworkContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'send' | 'receive' | 'history' | 'wallet' | 'settings' | 'profile' | 'transfer' | 'request' | 'scanner' | 'notifications'>('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserData();
      const interval = setInterval(refreshUserData, 8000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Set initial state
    window.history.replaceState({ view: 'dashboard' }, '', '#dashboard');
    
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: typeof currentView) => {
    if (view !== currentView) {
      window.history.pushState({ view }, '', `#${view}`);
      setCurrentView(view);
    }
  };

  const navigateBack = () => {
    window.history.back();
  };

  return (
    <NetworkProvider>
      <MobileContainer>
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <AuthView key="auth" onLogin={() => setIsAuthenticated(true)} />
          ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-[100dvh] bg-transparent relative text-gray-900"
          >
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {currentView === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <DashboardView onNavigate={navigateTo} />
                  </motion.div>
                )}
                {currentView === 'send' && (
                  <motion.div key="send" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <SendView onBack={navigateBack} onComplete={() => navigateTo('dashboard')} onNavigate={navigateTo} />
                  </motion.div>
                )}
                {currentView === 'receive' && (
                  <motion.div key="receive" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <ReceiveView onBack={navigateBack} />
                  </motion.div>
                )}
                {currentView === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <ProfileView onBack={navigateBack} />
                  </motion.div>
                )}
                {currentView === 'transfer' && (
                  <motion.div key="transfer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <TransferView onBack={navigateBack} onNavigate={navigateTo} />
                  </motion.div>
                )}
                {currentView === 'request' && (
                  <motion.div key="request" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <RequestView onBack={navigateBack} onComplete={() => navigateTo('dashboard')} />
                  </motion.div>
                )}
                {currentView === 'scanner' && (
                  <motion.div key="scanner" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-20">
                    <ScannerView onBack={navigateBack} />
                  </motion.div>
                )}
                {currentView === 'notifications' && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="absolute inset-0 z-20">
                    <NotificationsView onBack={navigateBack} />
                  </motion.div>
                )}
                {currentView === 'wallet' && (
                  <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <WalletView />
                  </motion.div>
                )}
                {currentView === 'history' && (
                  <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <HistoryView />
                  </motion.div>
                )}
                {currentView === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <SettingsView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            {['dashboard', 'wallet', 'history', 'settings'].includes(currentView) && (
              <div className="glass-panel border-t border-gray-200 flex items-center justify-around px-2 py-1 shrink-0 z-50 relative pb-5 sm:pb-3">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`p-2 flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-widest uppercase">Home</span>
                </button>
                <button 
                  onClick={() => navigateTo('history')}
                  className={`p-2 flex flex-col items-center gap-1 transition-colors ${currentView === 'history' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-widest uppercase">History</span>
                </button>
                <button 
                  onClick={() => navigateTo('wallet')}
                  className={`p-2 flex flex-col items-center gap-1 transition-colors ${currentView === 'wallet' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-widest uppercase">Asset</span>
                </button>
                <button 
                  onClick={() => navigateTo('settings')}
                  className={`p-2 flex flex-col items-center gap-1 transition-colors ${currentView === 'settings' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-widest uppercase">Settings</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </MobileContainer>
    </NetworkProvider>
  );
}
