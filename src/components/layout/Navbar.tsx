import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  UserCheck, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  Menu,
  Shield,
  User,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: string) => void;
  currentTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const { currentUser, isAdmin, loginAsDemo, logout, verifyEmail } = useAuth();
  const { notifications, unreadNotifsCount, markNotificationAsRead, markAllNotificationsAsRead, resetDemoData } = useHRData();

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'payroll':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-odoo-800 to-odoo-600 flex items-center justify-center text-white shadow-md shadow-odoo-800/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-display">
                  Day<span className="text-odoo-700 dark:text-odoo-400">flow</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-odoo-800/10 text-odoo-800 dark:text-odoo-300 dark:bg-odoo-800/30">
                  HRMS
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 dark:text-slate-400 leading-none">
                Every workday, perfectly aligned.
              </p>
            </div>
          </div>
        </div>

        {/* Center / Action Bar: Role Switcher Demo Pills */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => loginAsDemo('ADMIN_HR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isAdmin
                ? 'bg-white dark:bg-slate-900 text-odoo-800 dark:text-odoo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin / HR</span>
          </button>
          <button
            onClick={() => loginAsDemo('EMPLOYEE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isAdmin
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Employee</span>
          </button>
        </div>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick email verification trigger if unverified */}
          {currentUser && !currentUser.isEmailVerified && (
            <button
              onClick={verifyEmail}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              title="Click to simulate email verification"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Verify Email</span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            title="Reset to factory demo database"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h4>
                    {unreadNotifsCount > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-odoo-700 dark:text-odoo-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">No notifications yet</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.link) {
                            onNavigate(notif.link.replace('/', ''));
                            setShowNotifs(false);
                          }
                        }}
                        className={`py-3 px-2 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                          !notif.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/20 opacity-75'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex-shrink-0 mt-0.5">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-normal text-slate-600 dark:text-slate-300'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-odoo-700 dark:bg-odoo-400 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-odoo-700/20"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || 'Guest'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>{currentUser?.role === 'ADMIN_HR' ? 'HR Director' : 'Employee'}</span>
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-slide-up">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge status={currentUser?.role || 'EMPLOYEE'} size="sm" />
                    {currentUser?.isEmailVerified ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>My Profile & Documents</span>
                </button>

                <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      loginAsDemo('ADMIN_HR');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-odoo-700" />
                    <span>Switch to HR Admin</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('EMPLOYEE');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Switch to Employee</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
