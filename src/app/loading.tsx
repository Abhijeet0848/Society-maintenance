import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loading-spinner"></div>
      <p className="text-primary font-bold animate-pulse text-sm uppercase tracking-widest">Loading SocietyPro...</p>
    </div>
  );
}
