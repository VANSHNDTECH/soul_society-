import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgMap = {
    success: 'bg-emerald-900/90 text-white border-emerald-700',
    info: 'bg-stone-900/90 text-white border-stone-700',
    warning: 'bg-amber-900/90 text-white border-amber-700',
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border ${bgMap[toast.type]}`}>
        {iconMap[toast.type]}
        <div className="text-sm font-medium leading-relaxed pr-2">{toast.message}</div>
      </div>
    </div>
  );
};
