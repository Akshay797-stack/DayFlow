import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { AttendanceRecord } from '../types';
import { CheckInWidget } from '../components/attendance/CheckInWidget';
import { WeeklyCalendar } from '../components/attendance/WeeklyCalendar';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { Clock } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { attendance } = useHRData();

  const [activeView, setActiveView] = useState<'both' | 'calendar' | 'table'>('both');

  // Filter records if not admin
  const visibleRecords = isAdmin
    ? attendance
    : attendance.filter((a: AttendanceRecord) => a.employeeId === currentUser?.employeeId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>{isAdmin ? 'Organization Attendance Management' : 'My Attendance & Punch Terminal'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Real-time attendance tracking, weekly timesheets, and exportable employee logs'
              : 'Punch in/out for your workday, view active shift timer, and track your logged hours'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <button
            onClick={() => setActiveView('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'both'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'calendar'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Weekly Timesheet
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'table'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Logs Table
          </button>
        </div>
      </div>

      {/* Terminal Widget */}
      <CheckInWidget />

      {/* Weekly Timesheet Calendar */}
      {(activeView === 'both' || activeView === 'calendar') && (
        <WeeklyCalendar
          records={visibleRecords}
          employeeId={!isAdmin ? currentUser?.employeeId : undefined}
        />
      )}

      {/* Attendance Logs Table */}
      {(activeView === 'both' || activeView === 'table') && (
        <AttendanceTable records={visibleRecords} />
      )}
    </div>
  );
};
