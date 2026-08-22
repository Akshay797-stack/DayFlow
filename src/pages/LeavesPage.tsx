import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { LeaveRequest } from '../types';
import { LeaveBalanceCards } from '../components/leaves/LeaveBalanceCards';
import { LeaveRequestTable } from '../components/leaves/LeaveRequestTable';
import { ApplyLeaveModal } from '../components/leaves/ApplyLeaveModal';
import { CalendarDays, Plus } from 'lucide-react';

export const LeavesPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { leaves } = useHRData();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // If employee, filter only user's leaves
  const visibleLeaves = isAdmin
    ? leaves
    : leaves.filter((l: LeaveRequest) => l.employeeId === currentUser?.employeeId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>{isAdmin ? 'Time-Off & Leave Governance' : 'Leave Management & Time-Off'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Approve or reject employee leave applications, monitor department quotas, and add comments'
              : 'Track your annual leave balances, submit time-off requests, and view approval status'}
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quotas / Balances Banner */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {isAdmin ? 'Standard Annual Leave Entitlements' : 'My Current Leave Entitlements'}
        </h3>
        <LeaveBalanceCards balance={currentUser?.leaveBalance} />
      </div>

      {/* Requests Table */}
      <LeaveRequestTable
        leaves={visibleLeaves}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
      />

      {/* Modal */}
      {isApplyModalOpen && (
        <ApplyLeaveModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
};
