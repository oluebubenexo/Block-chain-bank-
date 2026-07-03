const fs = require('fs');
let content = fs.readFileSync('src/views/AuthView.tsx', 'utf8');
content = content.replace(
  /className=\{`w-4 h-4 rounded-full \$\{isLoading \? 'animate-pulse bg-emerald-500' : i < pin.length \? 'glass-panel border border-gray-200' : 'bg-white\/80'\}`\}/g,
  'className={`w-4 h-4 rounded-full ${isLoading ? \'animate-pulse bg-emerald-500\' : i < pin.length ? \'bg-gray-800\' : \'bg-gray-200\'}`}'
);
fs.writeFileSync('src/views/AuthView.tsx', content);
