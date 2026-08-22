import React from 'react';
import { AttendanceStatus, LeaveStatus, PayrollStatus, UserRole } from '../../types';

interface BadgeProps {
  status: AttendanceStatus | LeaveStatus | PayrollStatus | UserRole | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getStyles = () => {
    switch (status) {
      // Attendance
      case 'PRESENT':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'ABSENT':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'HALF_DAY':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'LEAVE':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';

      // Leave
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

      // Payroll
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

      // Roles
      case 'ADMIN_HR':
        return 'bg-odoo-800/10 text-odoo-800 dark:text-odoo-300 border-odoo-800/30';
      case 'EMPLOYEE':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';

      // Leave types
      case 'PAID':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'SICK':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'CASUAL':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 'UNPAID':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const formatText = (text: string) => {
    if (text === 'ADMIN_HR') return 'HR Admin';
    if (text === 'EMPLOYEE') return 'Employee';
    if (text === 'HALF_DAY') return 'Half Day';
    return text.charAt(0) + text.slice(1).toLowerCase();
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${getStyles()} ${sizeClasses[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {formatText(status)}
    </span>
  );
};
