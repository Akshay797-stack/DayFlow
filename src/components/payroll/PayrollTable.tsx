import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { PayrollRecord, Employee } from '../../types';
import { Badge } from '../common/Badge';
import { PayslipModal } from './PayslipModal';
import { SalaryStructureModal } from './SalaryStructureModal';
import { generatePayslipPDF } from '../../services/pdfGenerator';
import { Search, Download, Eye, Settings, Play, Sparkles, DollarSign } from 'lucide-react';

interface PayrollTableProps {
  records: PayrollRecord[];
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ records }) => {
  const { isAdmin, currentUser } = useAuth();
  const { employees, runMonthlyPayroll } = useHRData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // Modals state
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const months = ['ALL', 'August', 'July', 'June', 'May'];

  const filteredRecords = records.filter(r => {
    // If not admin, only show currentUser records
    if (!isAdmin && currentUser && r.employeeId !== currentUser.employeeId) {
      return false;
    }
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === 'ALL' || r.month.toLowerCase() === selectedMonth.toLowerCase();
    return matchesSearch && matchesMonth;
  });

  const handleRunBatch = () => {
    runMonthlyPayroll('August', 2026);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Table Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAdmin ? 'Enterprise Payroll Management' : 'My Salary & Compensation'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin
                ? 'Review salary structures, run monthly payroll disbursements, and issue slips'
                : 'Read-only visibility of monthly earnings, deductions, and downloadable PDF payslips'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search payroll..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>

            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
            >
              {months.map(m => (
                <option key={m} value={m}>
                  {m === 'ALL' ? 'All Months' : `${m} 2026`}
                </option>
              ))}
            </select>

            {/* Run Monthly Batch for Admin */}
            {isAdmin && (
              <button
                onClick={handleRunBatch}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">Run Payroll Batch</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Period</th>
                <th className="px-6 py-3.5">Gross Pay</th>
                <th className="px-6 py-3.5">Deductions (PF/Tax)</th>
                <th className="px-6 py-3.5">Net Take-Home</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Payslip Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No payroll entries found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => {
                  const emp = employees.find(e => e.employeeId === record.employeeId);

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {emp && (
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {record.employeeName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {record.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                        {record.month} {record.year}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white font-mono">
                        ${record.grossSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-rose-600 dark:text-rose-400 font-mono">
                        -${record.totalDeductions.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ${record.netPay.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={record.status} size="sm" />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActivePayslip(record)}
                            title="View digital payslip"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => generatePayslipPDF(record, emp)}
                            title="Download PDF statement"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>

                          {isAdmin && emp && (
                            <button
                              onClick={() => setEditingEmployee(emp)}
                              title="Edit Salary Structure"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-odoo-50 hover:bg-odoo-100 dark:bg-odoo-950/40 dark:hover:bg-odoo-900/50 text-odoo-700 dark:text-odoo-300 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              <Settings className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {activePayslip && (
        <PayslipModal
          isOpen={!!activePayslip}
          onClose={() => setActivePayslip(null)}
          payroll={activePayslip}
          employee={employees.find(e => e.employeeId === activePayslip.employeeId)}
        />
      )}

      {/* Salary Structure Editor Modal */}
      {editingEmployee && (
        <SalaryStructureModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
        />
      )}
    </>
  );
};
