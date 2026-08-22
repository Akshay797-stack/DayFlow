import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  UserCircle,
  BarChart3,
  Play,
  Square,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { hasPunchedInToday, hasPunchedOutToday, todayAttendance, punchIn, punchOut, leaves } = useHRData();

  const pendingLeavesCount = leaves.filter(l => l.status === 'PENDING').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'employees',
      label: isAdmin ? 'Employee Directory' : 'Team Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance & Logs',
      icon: Clock,
      badge: todayAttendance?.checkIn && !todayAttendance?.checkOut ? 'Active' : null,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'leaves',
      label: 'Leaves & Time-Off',
      icon: CalendarDays,
      badge: isAdmin && pendingLeavesCount > 0 ? `${pendingLeavesCount} New` : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
    },
    {
      id: 'payroll',
      label: isAdmin ? 'Payroll & Salaries' : 'My Salary & Slips',
      icon: DollarSign,
      badge: null,
    },
    {
      id: 'profile',
      label: 'My Profile & Docs',
      icon: UserCircle,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: 'Insights',
      badgeColor: 'bg-odoo-800/10 text-odoo-800 dark:text-odoo-300 dark:bg-odoo-800/30',
    },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner on Top */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-odoo-800 via-odoo-700 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-odoo-800/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
                  Day<span className="text-odoo-700 dark:text-odoo-400">flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-odoo-800/10 text-odoo-800 dark:text-odoo-300 dark:bg-odoo-800/30">
                  Odoo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Enterprise HR Suite
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-odoo-800 text-white shadow-md shadow-odoo-800/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'opacity-100 text-white' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Quick Punch-In / Punch-Out Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    hasPunchedInToday && !hasPunchedOutToday
                      ? 'bg-emerald-500 animate-pulse'
                      : hasPunchedOutToday
                      ? 'bg-blue-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Today's Shift
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {todayAttendance?.checkIn || '--:--'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {!hasPunchedInToday ? (
                <button
                  onClick={punchIn}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Punch In</span>
                </button>
              ) : !hasPunchedOutToday ? (
                <button
                  onClick={punchOut}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Punch Out</span>
                </button>
              ) : (
                <div className="w-full text-center py-1.5 px-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  Shift Finished ({todayAttendance?.workingHours}h)
                </div>
              )}
            </div>
          </div>

          {/* User mini badge */}
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  {currentUser?.employeeId}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-odoo-800/10 text-odoo-800 dark:text-odoo-300">
              {isAdmin ? 'Admin' : 'Emp'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
