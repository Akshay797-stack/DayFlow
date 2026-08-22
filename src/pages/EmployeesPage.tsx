import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { Employee } from '../types';
import { Badge } from '../components/common/Badge';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  UserPlus, 
  Eye, 
  Edit3, 
  CheckCircle2 
} from 'lucide-react';

interface EmployeesPageProps {
  onNavigate: (tab: string) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onNavigate }) => {
  const { isAdmin, currentUser } = useAuth();
  const { employees, setActiveSelectedEmployee } = useHRData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const departments = ['ALL', 'Engineering', 'Human Resources', 'Design & UX', 'Infrastructure', 'Growth & Marketing'];

  const filteredEmployees = employees.filter((emp: Employee) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  const handleSelectEmployee = (emp: Employee) => {
    setActiveSelectedEmployee(emp);
    onNavigate('profile');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>{isAdmin ? 'Employee Directory & Talent Management' : 'Dayflow Team Directory'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all enterprise team members, roles, and profiles ({employees.length} total staff)
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              alert('To register a new employee with secure credentials, use the Sign Up workflow or registration modal.');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, department or EMP ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
          />
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-odoo-800 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dept === 'ALL' ? 'All Depts' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp: Employee) => {
          const isCurrentUserCard = !!(currentUser && (
            emp.id === currentUser.id ||
            emp.employeeId?.toUpperCase() === currentUser.employeeId?.toUpperCase() ||
            emp.email?.toLowerCase() === currentUser.email?.toLowerCase()
          ));
          const avatarUrl = isCurrentUserCard && currentUser.avatar ? currentUser.avatar : emp.avatar;
          const displayName = isCurrentUserCard && currentUser.name ? currentUser.name : emp.name;
          const displayDesignation = isCurrentUserCard && currentUser.designation ? currentUser.designation : emp.designation;
          const displayRole = isCurrentUserCard && currentUser.role ? currentUser.role : emp.role;

          return (
            <div
              key={emp.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 shadow-sm hover:border-odoo-700/50 dark:hover:border-odoo-500/50 card-interactive flex flex-col justify-between ${
                isCurrentUserCard 
                  ? 'border-odoo-700/40 dark:border-odoo-500/40 ring-1 ring-odoo-700/20' 
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div>
                {/* Card Header: Avatar & Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      {emp.isEmailVerified && (
                        <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900" title="Verified">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {displayName}
                      </h3>
                      <p className="text-xs font-semibold text-odoo-700 dark:text-odoo-400">
                        {displayDesignation}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {emp.employeeId}
                      </span>
                    </div>
                  </div>

                  <Badge status={displayRole} size="sm" />
                </div>

              {/* Details List */}
              <div className="space-y-2 py-3 border-t border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {emp.joiningDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-1 flex items-center gap-2">
              <button
                onClick={() => handleSelectEmployee(emp)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Full Profile</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setEditingEmp(emp)}
                  title="Admin Edit"
                  className="p-2 rounded-xl bg-odoo-50 hover:bg-odoo-100 dark:bg-odoo-950/40 dark:hover:bg-odoo-900/50 text-odoo-800 dark:text-odoo-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      </div>

      {/* Edit Modal */}
      {editingEmp && (
        <EditProfileModal
          isOpen={!!editingEmp}
          onClose={() => setEditingEmp(null)}
          employee={editingEmp}
        />
      )}
    </div>
  );
};
