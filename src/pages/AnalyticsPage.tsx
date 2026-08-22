import React from 'react';
import { HRAnalytics } from '../components/analytics/HRAnalytics';
import { BarChart3, Download, Sparkles } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>HR Analytics & Executive Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data-driven insights on attendance rates, leave trends, headcount growth, and payroll spending
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full HR executive analytics report PDF / CSV...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      <HRAnalytics />
    </div>
  );
};
