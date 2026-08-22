import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { LeaveType } from '../../types';
import { Modal } from '../common/Modal';
import { Calendar, Clock, AlertTriangle, Send } from 'lucide-react';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { applyLeave } = useHRData();

  const [leaveType, setLeaveType] = useState<LeaveType>('PAID');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Calculate days difference
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();

  // Check quota
  const getRemainingQuota = () => {
    if (!currentUser) return 0;
    const key = leaveType.toLowerCase() as 'paid' | 'sick' | 'casual';
    if (currentUser.leaveBalance && currentUser.leaveBalance[key]) {
      return currentUser.leaveBalance[key].remaining;
    }
    return 999; // Unlimited for unpaid
  };

  const remainingQuota = getRemainingQuota();
  const isQuotaExceeded = leaveType !== 'UNPAID' && totalDays > remainingQuota;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select valid start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be prior to start date.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason or remarks for your leave request.');
      return;
    }
    if (isQuotaExceeded) {
      setError(`You have only ${remainingQuota} days of ${leaveType} leave remaining. Please adjust dates or apply for Unpaid leave.`);
      return;
    }

    applyLeave(leaveType, startDate, endDate, totalDays, reason);
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave / Time-Off"
      subtitle="Submit a formal leave request for HR approval"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Leave Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Leave Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['PAID', 'SICK', 'CASUAL', 'UNPAID'] as LeaveType[]).map(type => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setLeaveType(type);
                  setError(null);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  leaveType === type
                    ? 'border-odoo-800 bg-odoo-800 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'PAID' && 'Paid Leave'}
                {type === 'SICK' && 'Sick Leave'}
                {type === 'CASUAL' && 'Casual Leave'}
                {type === 'UNPAID' && 'Unpaid Leave'}
              </button>
            ))}
          </div>
          {leaveType !== 'UNPAID' && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Available Balance: <strong className="text-odoo-700 dark:text-odoo-400">{remainingQuota} days</strong>
            </p>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>
        </div>

        {/* Total Working Days Summary Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-odoo-700 dark:text-odoo-400" />
            <span>Total Duration:</span>
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600">
            {totalDays} Day{totalDays > 1 ? 's' : ''}
          </span>
        </div>

        {/* Reason / Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reason & Remarks *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Attending family function, medical appointment, vacation..."
            value={reason}
            onChange={e => {
              setReason(e.target.value);
              setError(null);
            }}
            required
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Leave Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
