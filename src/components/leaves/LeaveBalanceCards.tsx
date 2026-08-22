import React from 'react';
import { LeaveBalance } from '../../types';
import { Plane, HeartPulse, Coffee, AlertCircle } from 'lucide-react';

interface LeaveBalanceCardsProps {
  balance?: LeaveBalance;
}

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ balance }) => {
  if (!balance) return null;

  const categories = [
    {
      title: 'Paid Leave',
      icon: Plane,
      used: balance.paid.used,
      total: balance.paid.total,
      remaining: balance.paid.remaining,
      color: 'from-purple-600 to-indigo-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgLight: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200/60 dark:border-purple-800/40',
    },
    {
      title: 'Sick Leave',
      icon: HeartPulse,
      used: balance.sick.used,
      total: balance.sick.total,
      remaining: balance.sick.remaining,
      color: 'from-rose-600 to-pink-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgLight: 'bg-rose-50 dark:bg-rose-950/20',
      borderColor: 'border-rose-200/60 dark:border-rose-800/40',
    },
    {
      title: 'Casual / Personal',
      icon: Coffee,
      used: balance.casual.used,
      total: balance.casual.total,
      remaining: balance.casual.remaining,
      color: 'from-teal-600 to-emerald-600',
      textColor: 'text-teal-600 dark:text-teal-400',
      bgLight: 'bg-teal-50 dark:bg-teal-950/20',
      borderColor: 'border-teal-200/60 dark:border-teal-800/40',
    },
    {
      title: 'Unpaid Leave',
      icon: AlertCircle,
      used: balance.unpaid.used,
      total: null,
      remaining: null,
      color: 'from-slate-600 to-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
      bgLight: 'bg-slate-50 dark:bg-slate-800/40',
      borderColor: 'border-slate-200/60 dark:border-slate-700/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map(cat => {
        const Icon = cat.icon;
        const percent = cat.total ? Math.round((cat.used / cat.total) * 100) : 0;

        return (
          <div
            key={cat.title}
            className={`p-5 rounded-2xl border ${cat.borderColor} ${cat.bgLight} shadow-sm card-interactive relative overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {cat.title}
              </span>
              <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs ${cat.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {cat.remaining !== null ? cat.remaining : cat.used}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">
                  {cat.remaining !== null ? 'days left' : 'days taken'}
                </span>
              </div>

              {cat.total !== null && (
                <span className="text-xs font-semibold text-slate-400">
                  {cat.used} / {cat.total} used
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {cat.total !== null && (
              <div className="mt-3">
                <div className="w-full h-2 bg-slate-200/80 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
