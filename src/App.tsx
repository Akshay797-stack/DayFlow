import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRDataProvider } from './context/HRDataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavesPage } from './pages/LeavesPage';
import { PayrollPage } from './pages/PayrollPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

import { Sparkles, Shield, User, ArrowRight, CheckCircle2, AlertCircle, Clock, FileCheck, DollarSign, Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, verifyEmail } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // If user is not logged in, render the production landing / sign-in screen
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-odoo-700 selection:text-white relative overflow-hidden font-sans">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-odoo-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Landing Top Header */}
        <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-odoo-800 via-odoo-700 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-odoo-800/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">
                Day<span className="text-odoo-400">flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest ml-2 px-1.5 py-0.5 rounded bg-odoo-800/30 text-odoo-300">
                HRMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2 rounded-xl bg-odoo-800 hover:bg-odoo-700 text-white text-xs font-bold shadow-md shadow-odoo-800/30 transition-all hover:scale-105"
            >
              Register Account
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-odoo-300 mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Dayflow HRMS • Every workday, perfectly aligned.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
            Streamline your entire <br />
            <span className="bg-gradient-to-r from-odoo-300 via-purple-300 to-teal-300 bg-clip-text text-transparent">
              Human Resource Lifecycle
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-5 leading-relaxed">
            Digital employee onboarding, live shift attendance punch terminals, automated leave governance workflows, and verified PDF payroll compensation engines.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-odoo-800 hover:bg-odoo-700 text-white font-bold text-xs shadow-lg shadow-odoo-800/25 transition-all hover:scale-105"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all hover:scale-105"
            >
              <span>Create New Account</span>
            </button>
          </div>

          {/* Enterprise Capabilities Highlights */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-odoo-800/20 text-odoo-400 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Shift Attendance Terminal</h4>
              <p className="text-[11px] text-slate-400">Live duration timer, daily target gauge, and CSV export logs.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Leave Governance</h4>
              <p className="text-[11px] text-slate-400">Quota balances, instant review triage, and reviewer feedback.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <DollarSign className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Payroll & Salary Slips</h4>
              <p className="text-[11px] text-slate-400">Batch salary run and verified PDF payslip generation.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500 relative z-10">
          <p>© 2026 Dayflow Human Resource Management System. Production Enterprise Suite.</p>
        </footer>

        {/* Modals */}
        {isLoginOpen && (
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitchToRegister={() => setIsRegisterOpen(true)}
          />
        )}
        {isRegisterOpen && (
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            onSwitchToLogin={() => setIsLoginOpen(true)}
          />
        )}
      </div>
    );
  }

  // Render main application view
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 font-sans">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={setCurrentTab}
        currentTab={currentTab}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
          {/* Email verification reminder banner if unverified */}
          {!currentUser.isEmailVerified && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong>Email Verification Required:</strong> Please verify your enterprise email address ({currentUser.email}) to unlock full profile features.
                </span>
              </div>
              <button
                onClick={verifyEmail}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition-colors ml-4 flex-shrink-0"
              >
                Verify Now
              </button>
            </div>
          )}

          <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
            {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
            {currentTab === 'employees' && <EmployeesPage onNavigate={setCurrentTab} />}
            {currentTab === 'attendance' && <AttendancePage />}
            {currentTab === 'leaves' && <LeavesPage />}
            {currentTab === 'payroll' && <PayrollPage />}
            {currentTab === 'profile' && <ProfilePage />}
            {currentTab === 'analytics' && <AnalyticsPage />}
          </div>
        </main>
      </div>

      {/* Toast alerts */}
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HRDataProvider>
        <AppContent />
      </HRDataProvider>
    </AuthProvider>
  );
};

export default App;
