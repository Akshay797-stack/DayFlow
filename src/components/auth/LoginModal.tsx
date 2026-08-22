import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Shield, User, Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister
}) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Invalid credentials.');
    } else {
      onClose();
    }
  };

  const handleDemoClick = (role: 'ADMIN_HR' | 'EMPLOYEE') => {
    loginAsDemo(role);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to Dayflow HRMS"
      subtitle="Enter your enterprise credentials or use 1-click Demo"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* 1-Click Demo Login Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-odoo-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-odoo-100 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-odoo-700 dark:text-odoo-400" />
            <span>Hackathon Quick-Access Demos:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN_HR')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HR Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('EMPLOYEE')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Or Sign In with Email
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@dayflow.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>New employee? </span>
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-odoo-700 dark:text-odoo-400 font-bold hover:underline"
          >
            Create your account
          </button>
        </div>
      </div>
    </Modal>
  );
};
