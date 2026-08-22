import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { Search, Download, Filter, Calendar, Clock, ArrowUpDown } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    const matchesDate = !dateFilter || record.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Notes'];
    const rows = filteredRecords.map(r => [
      r.date,
      r.employeeId,
      `"${r.employeeName}"`,
      r.checkIn || 'N/A',
      r.checkOut || 'N/A',
      r.workingHours,
      r.status,
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Attendance_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
      {/* Header Filters Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isAdmin ? 'Organization Attendance Logs' : 'My Attendance History'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {filteredRecords.length} recorded entries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee / ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 font-medium"
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
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 font-medium"
          />

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Check In</th>
              <th className="px-6 py-3.5">Check Out</th>
              <th className="px-6 py-3.5">Hours</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-xs">
                  No attendance records found matching the filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map(record => (
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
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {record.checkIn}
                      </span>
                    ) : (
                      <span className="text-slate-400">--:--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {record.checkOut ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {record.checkOut}
                      </span>
                    ) : (
                      <span className="text-slate-400">--:--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap font-mono">
                    {record.workingHours ? `${record.workingHours}h` : '0h'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={record.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
