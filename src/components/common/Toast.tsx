import React from 'react';
import { useHRData } from '../../context/HRDataContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, setToast } = useHRData();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toastMessage.type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100';
      case 'error':
        return 'border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100';
      default:
        return 'border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${getBg()}`}
      >
        {getIcon()}
        <p className="text-xs font-semibold flex-1 leading-snug">
          {toastMessage.message}
        </p>
        <button
          onClick={() => setToast(null)}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};
