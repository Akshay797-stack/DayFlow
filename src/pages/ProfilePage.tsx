import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { ProfileView } from '../components/profile/ProfileView';
import { UserCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeSelectedEmployee } = useHRData();

  // Show active selected employee (if HR selected someone from directory) or logged in user
  const displayEmployee = activeSelectedEmployee || currentUser;

  if (!displayEmployee) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400">No profile selected to view.</p>
      </div>
    );
  }

  const isSelf = currentUser?.id === displayEmployee.id || currentUser?.employeeId === displayEmployee.employeeId;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>{isSelf ? 'My Employee Profile & Credentials' : `${displayEmployee.name}'s Profile (Admin View)`}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSelf
              ? 'Manage your personal contact info, view salary configuration, and access verified documents'
              : `Review and modify talent profile data for ${displayEmployee.employeeId}`}
          </p>
        </div>
      </div>

      <ProfileView employee={displayEmployee} isSelf={isSelf} />
    </div>
  );
};
