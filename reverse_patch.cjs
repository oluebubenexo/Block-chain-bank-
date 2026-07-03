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
  'src/views/AuthView.tsx',
  'src/views/DashboardView.tsx',
  'src/views/SendView.tsx',
  'src/App.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Revert text colors
    content = content.replace(/text-white\/90/g, 'text-gray-800');
    content = content.replace(/text-white\/80/g, 'text-gray-700');
    content = content.replace(/text-white\/70/g, 'text-gray-600');
    content = content.replace(/text-white\/60/g, 'text-gray-500');
    content = content.replace(/text-white\/50/g, 'text-gray-400');
    content = content.replace(/text-white\/40/g, 'text-gray-400');
    content = content.replace(/text-white/g, 'text-gray-900');

    // Revert backgrounds and borders
    content = content.replace(/bg-white\/5(?!\d)/g, 'bg-white/40');
    content = content.replace(/bg-white\/10/g, 'bg-white/60');
    content = content.replace(/bg-white\/20/g, 'bg-white/80');
    content = content.replace(/border-white\/5/g, 'border-gray-100');
    content = content.replace(/border-white\/10/g, 'border-gray-200');
    content = content.replace(/border-white\/20/g, 'border-gray-200');

    fs.writeFileSync(file, content);
  }
});
