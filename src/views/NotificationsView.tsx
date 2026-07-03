import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { notifications } from '../data';

export function NotificationsView({ onBack }: { onBack: () => void }) {
  
  useEffect(() => {
    return () => {
      notifications.forEach(n => n.unread = false);
    };
  }, []);
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'receive': return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
      case 'send': return <ArrowUpRight className="w-5 h-5 text-gray-900" />;
      case 'alert': return <Bell className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
      <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 sticky top-0 bg-white/80 backdrop-blur-md">
        <button onClick={onBack} className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
      </div>

      <div className="px-6 pt-2 space-y-3 pb-6">
        {notifications.map((notif, i) => (
          <motion.div 
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel shadow-sm border border-gray-200 p-4 rounded-2xl flex gap-4 ${notif.unread ? 'border-l-4 border-l-emerald-500' : ''}`}
          >
            <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center shrink-0">
              {getIcon(notif.type)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">{notif.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
