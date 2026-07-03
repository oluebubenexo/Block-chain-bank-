const fs = require('fs');
const glob = require('glob');

const files = [
  'src/views/ReceiveView.tsx',
  'src/views/HistoryView.tsx',
  'src/views/WalletView.tsx',
  'src/views/SettingsView.tsx',
  'src/views/ProfileView.tsx',
  'src/views/TransferView.tsx',
  'src/views/RequestView.tsx',
  'src/views/ScannerView.tsx',
  'src/views/NotificationsView.tsx',
  'src/views/AuthView.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // We only replace exact words to avoid messing up tailwind arbitrary values if any
    content = content.replace(/bg-white/g, 'glass-panel');
    content = content.replace(/bg-gray-50/g, 'bg-white/5');
    content = content.replace(/bg-gray-100/g, 'bg-white/10');
    content = content.replace(/bg-gray-200/g, 'bg-white/20');
    content = content.replace(/bg-gray-800/g, 'glass-panel border border-white/20');
    content = content.replace(/bg-gray-900/g, 'glass-panel border border-white/20');
    
    content = content.replace(/border-gray-50/g, 'border-white/5');
    content = content.replace(/border-gray-100/g, 'border-white/10');
    content = content.replace(/border-gray-200/g, 'border-white/20');
    
    content = content.replace(/text-gray-900/g, 'text-white');
    content = content.replace(/text-gray-800/g, 'text-white/90');
    content = content.replace(/text-gray-700/g, 'text-white/80');
    content = content.replace(/text-gray-600/g, 'text-white/70');
    content = content.replace(/text-gray-500/g, 'text-white/60');
    content = content.replace(/text-gray-400/g, 'text-white/50');

    // Make outer containers transparent
    content = content.replace(/bg-gray-50/g, 'bg-transparent text-white');

    fs.writeFileSync(file, content);
  }
});
