const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="flex-1 flex flex-col h-full bg-gray-50 relative"',
  'className="flex-1 flex flex-col h-[100dvh] bg-transparent relative text-white"'
);

content = content.replace(
  'className="bg-white border-t border-gray-200 flex items-center justify-around px-2 py-1 shrink-0 z-50 relative pb-5 sm:pb-3"',
  'className="glass-panel mx-4 mb-6 rounded-2xl flex items-center justify-around px-4 py-3 shrink-0 z-50 relative"'
);

content = content.replace(
  /className={`p-2 flex flex-col items-center gap-0\.5 transition-colors \${currentView === '(.*?)' \? 'text-emerald-600' : 'text-gray-400 hover:text-gray-900'}`}/g,
  'className={`p-2 flex flex-col items-center gap-1 transition-colors ${currentView === \'$1\' ? \'text-white\' : \'text-white/40 hover:text-white/80\'}`}'
);

content = content.replace(
  /<span className="text-\[9px\] font-medium">(.*?)<\/span>/g,
  '<span className="text-[10px] font-medium tracking-widest uppercase">$1</span>'
);

content = content.replace(
  /initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}/g,
  'initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}'
);

fs.writeFileSync('src/App.tsx', content);
