import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  CalendarDays, 
  Briefcase,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  const { isAdmin, currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'MONTH' | 'ALL' | 'TODAY'>('MONTH');

  // Month navigation
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + selectedMonthOffset);
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const todayStr = new Date().toISOString().split('T')[0];

  // User-specific or full-filtered records
  const displayRecords = useMemo(() => {
    return records.filter(record => {
      // Search
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status
      const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
      
      // Explicit Date filter
      const matchesExplicitDate = !dateFilter || record.date === dateFilter;

      // View mode filter
      let matchesView = true;
      if (viewMode === 'TODAY') {
        matchesView = record.date === todayStr;
      } else if (viewMode === 'MONTH') {
        matchesView = record.date.startsWith(currentMonthPrefix);
      }

      return matchesSearch && matchesStatus && matchesExplicitDate && matchesView;
    });
  }, [records, searchTerm, statusFilter, dateFilter, viewMode, currentMonthPrefix, todayStr]);

  // Summary Metrics calculation (As specified in Wireframe: Count of days present, Leaves count, Total working days, Extra Hours)
  const metrics = useMemo(() => {
    const relevantRecords = !isAdmin && currentUser
      ? records.filter(r => r.employeeId === currentUser.employeeId && r.date.startsWith(currentMonthPrefix))
      : displayRecords;

    const daysPresent = relevantRecords.filter(r => r.status === 'PRESENT' || r.status === 'HALF_DAY').length;
    const daysLeave = relevantRecords.filter(r => r.status === 'LEAVE').length;
    const totalWorkingDays = 22; // Standard monthly working days
    const totalExtraHours = relevantRecords.reduce((sum, r) => sum + (r.extraHours || Math.max(0, (r.workingHours || 0) - 8.0)), 0);
    const totalLoggedHours = relevantRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0);

    return {
      daysPresent,
      daysLeave,
      totalWorkingDays,
      totalExtraHours: Number(totalExtraHours.toFixed(1)),
      totalLoggedHours: Number(totalLoggedHours.toFixed(1))
    };
  }, [records, displayRecords, isAdmin, currentUser, currentMonthPrefix]);

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Check In', 'Check Out', 'Work Hours', 'Extra Hours (Overtime)', 'Status', 'Notes'];
    const rows = displayRecords.map(r => [
      r.date,
      r.employeeId,
      `"${r.employeeName}"`,
      r.checkIn || 'N/A',
      r.checkOut || 'N/A',
      r.workingHours ? `${r.workingHours}h` : '0h',
      r.extraHours ? `+${r.extraHours}h` : '0h',
      r.status,
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Attendance_${currentMonthName.replace(' ', '_')}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Wireframe Attendance Summary Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Count of Days Present
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {metrics.daysPresent}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">/ {metrics.totalWorkingDays} days</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Leaves Count
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {metrics.daysLeave}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">days on leave</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Working Days
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {metrics.totalWorkingDays}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">scheduled</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Extra Hours (Overtime)
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                +{metrics.totalExtraHours}h
              </span>
              <span className="text-[11px] text-slate-400 font-medium">over 8h standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Header Controls with Wireframe Month & Date Navigator */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Previous / Next Month Navigator */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setSelectedMonthOffset(prev => prev - 1)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 text-xs font-bold text-slate-900 dark:text-white font-mono min-w-[110px] text-center">
                {currentMonthName}
              </span>

              <button
                onClick={() => setSelectedMonthOffset(prev => prev + 1)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Pill Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
              <button
                onClick={() => setViewMode('MONTH')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'MONTH'
                    ? 'bg-white dark:bg-slate-900 text-odoo-800 dark:text-odoo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Month (Day-wise)
              </button>
              <button
                onClick={() => setViewMode('TODAY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'TODAY'
                    ? 'bg-white dark:bg-slate-900 text-odoo-800 dark:text-odoo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Today ({todayStr})
              </button>
              <button
                onClick={() => setViewMode('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-odoo-800 dark:text-odoo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Records
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 sm:w-52">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff / ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LEAVE">On Leave</option>
            </select>

            {/* Date Picker Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
              title="Filter by specific date"
            />

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Records Table with Work Hours and Extra Hours (Wireframe matched) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Check In</th>
                <th className="px-6 py-3.5">Check Out</th>
                <th className="px-6 py-3.5">Work Hours</th>
                <th className="px-6 py-3.5">Extra Hours (OT)</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {displayRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No attendance records found matching this timeframe or search criteria.
                  </td>
                </tr>
              ) : (
                displayRecords.map(record => {
                  const extraHours = record.extraHours !== undefined 
                    ? record.extraHours 
                    : Math.max(0, Number(((record.workingHours || 0) - 8.0).toFixed(2)));

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {record.employeeName}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {record.employeeId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {record.checkIn ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="font-mono">{record.checkIn}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">--:--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {record.checkOut ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="font-mono">{record.checkOut}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">--:--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap font-mono">
                        {record.workingHours ? `${record.workingHours.toFixed(1)}h` : '0.0h'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">
                        {extraHours > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
                            +{extraHours.toFixed(1)}h
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">0.0h</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={record.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
