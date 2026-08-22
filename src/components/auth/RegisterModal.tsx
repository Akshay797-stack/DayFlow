import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { Shield, User, Lock, Mail, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const { signup } = useAuth();

  const [employeeId, setEmployeeId] = useState('EMP-' + Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [department, setDepartment] = useState('Engineering');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !employeeId) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters with security compliance.');
      return;
    }

    setLoading(true);
    setError(null);
    const res = await signup({
      employeeId,
      name,
      email,
      role,
      password,
      department
    });
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed.');
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Dayflow Account"
      subtitle="Register as an Employee or HR Administrator"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Account Role *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                role === 'EMPLOYEE'
                  ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN_HR')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                role === 'ADMIN_HR'
                  ? 'border-odoo-800 bg-odoo-800 text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HR Admin</span>
            </button>
          </div>
        </div>

        {/* Employee ID & Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value.toUpperCase())}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Alex Smith"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Enterprise Email *
          </label>
          <input
            type="email"
            placeholder="alex.smith@dayflow.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Department
          </label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          >
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design & UX">Design & UX</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Growth & Marketing">Growth & Marketing</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Password (Min. 6 characters) *
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
        </button>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-odoo-700 dark:text-odoo-400 font-bold hover:underline"
          >
            Sign In here
          </button>
        </div>
      </form>
    </Modal>
  );
};
