import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { LeaveRequest, LeaveStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Check, X, MessageSquare, Calendar, User, Search, Filter } from 'lucide-react';

interface LeaveRequestTableProps {
  leaves: LeaveRequest[];
  onOpenApplyModal?: () => void;
}

export const LeaveRequestTable: React.FC<LeaveRequestTableProps> = ({ leaves, onOpenApplyModal }) => {
  const { isAdmin } = useAuth();
  const { reviewLeave } = useHRData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Review Modal State
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<LeaveStatus>('APPROVED');
  const [adminComment, setAdminComment] = useState<string>('');

  const filteredLeaves = leaves.filter(l => {
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (leave: LeaveRequest, action: LeaveStatus) => {
    setReviewingLeave(leave);
    setReviewAction(action);
    setAdminComment(action === 'APPROVED' ? 'Approved. Please ensure handoffs are complete.' : 'Unable to approve due to team staffing constraints.');
  };

  const handleConfirmReview = () => {
    if (!reviewingLeave) return;
    reviewLeave(reviewingLeave.id, reviewAction, adminComment);
    setReviewingLeave(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAdmin ? 'Leave & Time-Off Approvals' : 'My Leave Applications'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin
                ? 'Review, approve, or reject employee leave requests'
                : 'Track the status and history of your requested time-off'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requests..."
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
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Apply Button for employees */}
            {onOpenApplyModal && (
              <button
                onClick={onOpenApplyModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>+ Apply Time-Off</span>
              </button>
            )}
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Leave Type</th>
                <th className="px-6 py-3.5">Date Range</th>
                <th className="px-6 py-3.5">Days</th>
                <th className="px-6 py-3.5">Reason</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions / Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map(leave => (
                  <tr
                    key={leave.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={leave.employeeAvatar}
                          alt={leave.employeeName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {leave.employeeName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {leave.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={leave.leaveType} size="sm" />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {leave.startDate} → {leave.endDate}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Applied on {leave.appliedOn}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white font-mono">
                      {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                        {leave.reason}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={leave.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isAdmin && leave.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReview(leave, 'APPROVED')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReview(leave, 'REJECTED')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-xs transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : leave.adminComment ? (
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 italic block">
                            "{leave.adminComment}"
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            by {leave.reviewedBy || 'HR'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {leave.status === 'PENDING' ? 'Awaiting Review' : 'No comments'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Comment Modal */}
      {reviewingLeave && (
        <Modal
          isOpen={!!reviewingLeave}
          onClose={() => setReviewingLeave(null)}
          title={`${reviewAction === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request`}
          subtitle={`For ${reviewingLeave.employeeName} (${reviewingLeave.totalDays} days of ${reviewingLeave.leaveType} leave)`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">Reason submitted:</p>
              <p className="text-slate-600 dark:text-slate-300 mt-1 italic">"{reviewingLeave.reason}"</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Comments & Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={adminComment}
                onChange={e => setAdminComment(e.target.value)}
                placeholder="Enter feedback for employee..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReviewingLeave(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  reviewAction === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                Confirm {reviewAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
