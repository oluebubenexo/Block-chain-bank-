const fs = require('fs');
let content = fs.readFileSync('src/views/DashboardView.tsx', 'utf8');

// Replace bg-gray-900 / bg-white with glass-panel classes and adjust text colors
content = content.replace(
  'className="bg-gray-900 rounded-[2rem] p-6 mb-6 relative overflow-hidden shadow-xl"',
  'className="glass-panel rounded-[2rem] p-6 mb-6 relative overflow-hidden shadow-2xl border border-white/20"'
);

content = content.replace(
  'className="flex-1 overflow-y-auto no-scrollbar pb-20 relative bg-gray-50"',
  'className="flex-1 overflow-y-auto no-scrollbar pb-20 relative bg-transparent text-white"'
);

content = content.replace(
  'className="flex justify-between items-center px-6 pt-12 pb-6"',
  'className="flex justify-between items-center px-6 pt-12 pb-6 bg-transparent"'
);

content = content.replace(
  /text-gray-900/g,
  'text-white'
);

content = content.replace(
  /text-gray-700/g,
  'text-white/90'
);

content = content.replace(
  /text-gray-500/g,
  'text-white/60'
);

content = content.replace(
  /text-gray-400/g,
  'text-white/50'
);

content = content.replace(
  /bg-white/g,
  'glass-panel'
);

content = content.replace(
  /bg-gray-50/g,
  'bg-white/5'
);

content = content.replace(
  /bg-gray-100/g,
  'bg-white/10'
);

content = content.replace(
  /border-gray-100/g,
  'border-white/10'
);

content = content.replace(
  /border-gray-50/g,
  'border-white/5'
);

fs.writeFileSync('src/views/DashboardView.tsx', content);
