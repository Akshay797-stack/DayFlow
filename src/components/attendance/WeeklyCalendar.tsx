import React from 'react';
import { AttendanceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Clock, CheckCircle2 } from 'lucide-react';

interface WeeklyCalendarProps {
  records: AttendanceRecord[];
  employeeId?: string;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ records, employeeId }) => {
  // Generate last 7 days from current date (Aug 22, 2026 backwards or current week)
  const getDaysArray = () => {
    const days = [];
    const baseDate = new Date('2026-08-22');
    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }
    return days;
  };

  const days = getDaysArray();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Weekly Timesheet Grid
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily breakdown of hours logged and attendance statuses
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present
          </span>
          <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Leave
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Half-day
          </span>
        </div>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map(d => {
          const matchedRecord = records.find(
            r => r.date === d.date && (!employeeId || r.employeeId === employeeId)
          );

          return (
            <div
              key={d.date}
              className={`p-3.5 rounded-2xl border transition-all ${
                d.isToday
                  ? 'border-odoo-700 dark:border-odoo-500 bg-odoo-50/40 dark:bg-odoo-950/20 shadow-xs ring-1 ring-odoo-700/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${d.isToday ? 'text-odoo-800 dark:text-odoo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  {d.dayName}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${d.isToday ? 'bg-odoo-700 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {d.dayNumber} {d.month}
                </span>
              </div>

              <div className="mt-3 min-h-[58px] flex flex-col justify-between">
                {matchedRecord ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge status={matchedRecord.status} size="sm" />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                        {matchedRecord.workingHours}h
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                      {matchedRecord.checkIn ? (
                        <div className="flex items-center justify-between">
                          <span>{matchedRecord.checkIn}</span>
                          <span>{matchedRecord.checkOut || 'In progress'}</span>
                        </div>
                      ) : (
                        <span>{matchedRecord.notes || 'Full Day Off'}</span>
                      )}
                    </div>
                  </>
                ) : d.isWeekend ? (
                  <div className="text-center py-3">
                    <span className="text-[11px] font-medium text-slate-400">Weekend Off</span>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <span className="text-[11px] font-medium text-slate-400">No punch data</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
