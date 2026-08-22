import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { AttendanceRecord, LeaveRequest, Employee } from '../types';
import { StatCard } from '../components/common/StatCard';
import { CheckInWidget } from '../components/attendance/CheckInWidget';
import { LeaveBalanceCards } from '../components/leaves/LeaveBalanceCards';
import { ApplyLeaveModal } from '../components/leaves/ApplyLeaveModal';
import { Badge } from '../components/common/Badge';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  DollarSign, 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Calendar
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const { employees, attendance, leaves, reviewLeave, setActiveSelectedEmployee } = useHRData();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const presentTodayCount = attendance.filter((a: AttendanceRecord) => a.date === todayStr && a.status === 'PRESENT').length;
  const pendingLeaves = leaves.filter((l: LeaveRequest) => l.status === 'PENDING');
  const totalEmployees = employees.length;

  const upcomingHolidays = [
    { name: 'Labor Day', date: 'Sept 7, 2026', daysAway: '16 days away', type: 'Public Holiday' },
    { name: 'Autumn Equinox', date: 'Sept 22, 2026', daysAway: '31 days away', type: 'Optional' },
    { name: 'Thanksgiving Break', date: 'Nov 26, 2026', daysAway: '96 days away', type: 'Company Wide' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-odoo-900 via-odoo-800 to-teal-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                {isAdmin ? 'HR Operations Command Center' : 'Employee Workspace'}
              </span>
              <span className="text-xs text-odoo-200">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Good day, {currentUser?.name}! ✨
            </h1>
            <p className="text-xs sm:text-sm text-odoo-100 mt-1.5 leading-relaxed">
              {isAdmin
                ? `You have ${pendingLeaves.length} pending leave approvals and ${presentTodayCount} personnel checked in today across all departments.`
                : `Your attendance terminal is active. Check in for your shift, apply for time-off, or review your monthly salary statements.`}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onNavigate('employees')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-odoo-900 hover:bg-odoo-50 text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <Users className="w-4 h-4 text-odoo-800" />
                  <span>Manage Employees</span>
                </button>
                <button
                  onClick={() => onNavigate('payroll')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Run Payroll</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-odoo-900 hover:bg-odoo-50 text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <CalendarDays className="w-4 h-4 text-odoo-800" />
                  <span>Apply for Leave</span>
                </button>
                <button
                  onClick={() => onNavigate('payroll')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4" />
                  <span>My Payslips</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-odoo-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isAdmin ? "Total Employees" : "My Department"}
          value={isAdmin ? totalEmployees : (currentUser?.department || 'Engineering')}
          subtitle={isAdmin ? "5 Departments Active" : `Manager: ${currentUser?.managerName || 'Sarah Jenkins'}`}
          icon={Users}
          iconColor="text-odoo-800 dark:text-odoo-300"
          iconBg="bg-odoo-800/10 dark:bg-odoo-800/20"
          onClick={() => onNavigate('employees')}
        />
        <StatCard
          title="Present Today"
          value={`${presentTodayCount} / ${totalEmployees}`}
          subtitle="Checked-in via terminal"
          icon={Clock}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-500/10 dark:bg-teal-500/20"
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title={isAdmin ? "Pending Approvals" : "Paid Leave Balance"}
          value={isAdmin ? pendingLeaves.length : `${currentUser?.leaveBalance?.paid?.remaining || 13} days`}
          subtitle={isAdmin ? "Action required by HR" : "Available to book"}
          icon={CalendarDays}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          onClick={() => onNavigate('leaves')}
        />
        <StatCard
          title={isAdmin ? "Monthly Payroll" : "My Net Take-Home"}
          value={isAdmin ? "$64,872" : `$${currentUser?.salaryStructure ? (currentUser.salaryStructure.baseSalary + currentUser.salaryStructure.hra + currentUser.salaryStructure.conveyance + currentUser.salaryStructure.specialAllowance + currentUser.salaryStructure.bonus - currentUser.salaryStructure.providentFund - currentUser.salaryStructure.professionalTax).toLocaleString() : '12,660'}`}
          subtitle={isAdmin ? "July 2026 Disbursed" : "Disbursed on 28th of month"}
          icon={DollarSign}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
          onClick={() => onNavigate('payroll')}
        />
      </div>

      {/* Main Shift Attendance Terminal Widget */}
      <CheckInWidget />

      {/* HR Admin Specific Section */}
      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Leave Approvals Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Pending Leave Approvals</span>
                  {pendingLeaves.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {pendingLeaves.length} urgent
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review and make approval decisions directly from dashboard
                </p>
              </div>
              <button
                onClick={() => onNavigate('leaves')}
                className="text-xs font-bold text-odoo-700 dark:text-odoo-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
                  <p className="text-[11px] text-slate-400">No pending leave requests awaiting approval.</p>
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((leave: LeaveRequest) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={leave.employeeAvatar}
                        alt={leave.employeeName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {leave.employeeName}
                          </p>
                          <Badge status={leave.leaveType} size="sm" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {leave.startDate} to {leave.endDate} ({leave.totalDays} days) • {leave.department}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 italic line-clamp-1">
                          "{leave.reason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => reviewLeave(leave.id, 'APPROVED', 'Approved via quick dashboard triage.')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => reviewLeave(leave.id, 'REJECTED', 'Declined due to schedule conflict.')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Employee Switcher Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Employee Quick View
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Directory
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Select any employee to view their detailed profile, salary, or timesheet:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {employees.map((emp: Employee) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setActiveSelectedEmployee(emp);
                      onNavigate('profile');
                    }}
                    className="p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-odoo-700/40 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {emp.designation}
                        </p>
                      </div>
                    </div>
                    <Badge status={emp.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('employees')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors text-center"
            >
              Open Full Directory →
            </button>
          </div>
        </div>
      ) : (
        /* Employee Specific Section */
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                My Leave Quotas & Balances
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="text-xs font-bold text-odoo-700 dark:text-odoo-400 hover:underline"
              >
                + Request Time-Off
              </button>
            </div>
            <LeaveBalanceCards balance={currentUser?.leaveBalance} />
          </div>

          {/* Company Holidays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-odoo-700 dark:text-odoo-400" />
                <span>Upcoming Company Holidays</span>
              </h3>
              <div className="space-y-3">
                {upcomingHolidays.map(hol => (
                  <div
                    key={hol.name}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{hol.name}</p>
                      <p className="text-[11px] text-slate-400">{hol.date} • {hol.type}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-odoo-700 dark:text-odoo-400 bg-odoo-50 dark:bg-odoo-950/40 px-2.5 py-1 rounded-lg">
                      {hol.daysAway}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Workplace Guidelines & Shortcuts</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                  <p><strong>Check-In Policy:</strong> Punch in within 15 minutes of your shift start (09:00 AM) to maintain 100% on-time rating.</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-odoo-700 mt-1.5 flex-shrink-0" />
                  <p><strong>Leave Advance Notice:</strong> Please submit Planned Paid Leaves at least 3 business days in advance for smooth project coverage.</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <p><strong>Payroll Statements:</strong> Digital payslips are generated on the final working day of each month and available under the Payroll tab.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <ApplyLeaveModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
};
