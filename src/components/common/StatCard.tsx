import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-odoo-800 dark:text-odoo-300',
  iconBg = 'bg-odoo-800/10 dark:bg-odoo-800/20',
  trend,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm card-interactive ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 font-display">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} flex-shrink-0 shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative gradient corner blur */}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-odoo-800/5 to-teal-500/5 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};
