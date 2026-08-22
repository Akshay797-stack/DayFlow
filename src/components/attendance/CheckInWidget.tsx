import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { Clock, Play, Square, CheckCircle2, Calendar, TrendingUp, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CheckInWidget: React.FC = () => {
  const { currentUser } = useAuth();
  const { todayAttendance, hasPunchedInToday, hasPunchedOutToday, punchIn, punchOut } = useHRData();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Elapsed timer when active
  useEffect(() => {
    let timer: any;
    if (hasPunchedInToday && !hasPunchedOutToday && todayAttendance?.checkIn) {
      const calculateElapsed = () => {
        try {
          const now = new Date();
          const todayDateStr = now.toISOString().split('T')[0];
          // Simple parsing of checkIn string e.g. "09:05 AM"
          const checkInTimeStr = todayAttendance.checkIn!;
          const [t, mod] = checkInTimeStr.split(' ');
          let [h, m] = t.split(':').map(Number);
          if (mod === 'PM' && h < 12) h += 12;
          if (mod === 'AM' && h === 12) h = 0;

          const checkInDate = new Date(`${todayDateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
          const diffMs = Math.max(0, now.getTime() - checkInDate.getTime());
          setElapsedSeconds(Math.floor(diffMs / 1000));
        } catch {
          setElapsedSeconds(0);
        }
      };
      calculateElapsed();
      timer = setInterval(calculateElapsed, 1000);
    }
    return () => clearInterval(timer);
  }, [hasPunchedInToday, hasPunchedOutToday, todayAttendance]);

  const formatElapsed = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const loggedHours = todayAttendance?.workingHours || (elapsedSeconds / 3600);
  const progressPercent = Math.min(100, Math.round((loggedHours / 8) * 100));

  return (
    <div className="bg-gradient-to-br from-white via-white to-odoo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Live Digital Clock & Shift Status */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-odoo-800/10 text-odoo-800 dark:text-odoo-300 dark:bg-odoo-800/30">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Attendance Punch Terminal
            </span>
            {todayAttendance && (
              <Badge status={todayAttendance.status} size="sm" />
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {currentTime}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {currentDate}
          </p>

          {/* Time logs summary chips */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Check-In
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {todayAttendance?.checkIn || '--:--'}
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Check-Out
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {todayAttendance?.checkOut || '--:--'}
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Live Active Session
              </span>
              <span className="text-xs font-bold text-odoo-700 dark:text-odoo-400 font-mono">
                {hasPunchedInToday && !hasPunchedOutToday
                  ? formatElapsed(elapsedSeconds)
                  : `${todayAttendance?.workingHours || 0} hrs`}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Punch Action Button & Daily Target Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-8">
          {/* Working hours target indicator */}
          <div className="w-full sm:w-44 text-center sm:text-left">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Daily Target (8.0h)</span>
              <span className="text-odoo-800 dark:text-odoo-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-odoo-700 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Standard shift 09:00 - 18:00
            </p>
          </div>

          {/* Action Punch Button */}
          <div className="w-full sm:w-auto">
            {!hasPunchedInToday ? (
              <button
                onClick={punchIn}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Check In for Today</span>
              </button>
            ) : !hasPunchedOutToday ? (
              <button
                onClick={punchOut}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Check Out (End Shift)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Shift Completed for Today ({todayAttendance?.workingHours}h)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
