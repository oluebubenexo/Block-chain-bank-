const fs = require('fs');
let content = fs.readFileSync('src/views/SendView.tsx', 'utf8');

content = content.replace(/bg-white/g, 'glass-panel');
content = content.replace(/bg-gray-50/g, 'bg-white/5');
content = content.replace(/bg-gray-100/g, 'bg-white/10');
content = content.replace(/border-gray-100/g, 'border-white/10');
content = content.replace(/border-gray-50/g, 'border-white/5');
content = content.replace(/border-gray-200/g, 'border-white/20');
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-700/g, 'text-white/90');
content = content.replace(/text-gray-500/g, 'text-white/60');
content = content.replace(/text-gray-400/g, 'text-white/50');
content = content.replace(/text-gray-800/g, 'text-white/80');

fs.writeFileSync('src/views/SendView.tsx', content);
