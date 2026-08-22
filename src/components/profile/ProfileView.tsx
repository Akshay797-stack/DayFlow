import React, { useState } from 'react';
import { Employee } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { DocumentManager } from './DocumentManager';
import { EditProfileModal } from './EditProfileModal';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Edit3, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';

interface ProfileViewProps {
  employee: Employee;
  isSelf?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ employee, isSelf = false }) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'job' | 'salary' | 'docs' | 'emergency'>('job');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const tabs = [
    { id: 'job', label: 'Job & Overview', icon: Briefcase },
    { id: 'salary', label: 'Salary Structure', icon: DollarSign },
    { id: 'docs', label: 'Documents Vault', icon: FileText, count: employee.documents?.length || 0 },
    { id: 'emergency', label: 'Emergency Info', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Banner with subtle geometric gradient */}
        <div className="h-36 bg-gradient-to-r from-odoo-900 via-odoo-800 to-teal-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        </div>

        {/* Profile Avatar & Info Row */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
                />
                {employee.isEmailVerified && (
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900" title="Verified Employee">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {employee.name}
                  </h2>
                  <Badge status={employee.role} size="sm" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-odoo-700 dark:text-odoo-400 mt-0.5">
                  {employee.designation} • {employee.department}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: {employee.employeeId}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Edit Profile (Admin)' : 'Edit Contact Info'}</span>
              </button>
            </div>
          </div>

          {/* Quick info badges row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{employee.address}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex overflow-x-auto gap-2 py-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-odoo-800 text-odoo-800 dark:text-odoo-300 dark:border-odoo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
        {/* Tab 1: Job & Overview */}
        {activeTab === 'job' && (
          <div className="space-y-6">
            {employee.bio && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About & Professional Bio</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  {employee.bio}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Employment Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Department</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-odoo-700 dark:text-odoo-400" />
                    {employee.department}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Joining Date</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-odoo-700 dark:text-odoo-400" />
                    {employee.joiningDate}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Employment Type</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                    {employee.employmentType}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Reporting Manager</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    {employee.managerName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Account Status</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Active in Good Standing
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Email Verification</span>
                  <span className={`text-xs font-bold mt-1 flex items-center gap-1.5 ${employee.isEmailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                    {employee.isEmailVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {employee.isEmailVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Salary Structure */}
        {activeTab === 'salary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Compensation Package Breakdown
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAdmin ? 'Full administrative view of monthly compensation components' : 'Read-only overview of your structured earnings and statutory deductions'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                  Monthly Earnings
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Base Salary</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Conveyance Allowance</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.conveyance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Special Allowance</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.specialAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-400">Target Bonus / Incentives</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.bonus.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3">
                  Monthly Deductions
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Provident Fund (PF / 401k)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.providentFund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Professional Tax & State Withholding</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">${employee.salaryStructure.professionalTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents Vault */}
        {activeTab === 'docs' && (
          <DocumentManager employee={employee} canEdit={true} />
        )}

        {/* Tab 4: Emergency Contacts */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Designated Emergency Contact
            </h4>
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 max-w-lg">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{employee.emergencyContact?.name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Relationship:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.emergencyContact?.relationship || 'Family'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Direct Phone:</span>
                  <span className="font-bold text-odoo-700 dark:text-odoo-400 font-mono">{employee.emergencyContact?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          employee={employee}
        />
      )}
    </div>
  );
};
