import React from 'react';
import { Info } from 'lucide-react';
import { useApp } from '../../state/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-full bg-neutral-900 border border-neutral-700 text-neutral-100 text-xs px-3.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-150">
      <Info className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="flex-1 font-mono leading-tight">{toastMessage}</span>
    </div>
  );
};
