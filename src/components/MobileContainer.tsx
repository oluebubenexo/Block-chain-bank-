import React from 'react';

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-[100dvh] font-sans relative">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
