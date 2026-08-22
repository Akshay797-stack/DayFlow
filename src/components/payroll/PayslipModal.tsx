import React from 'react';
import { PayrollRecord, Employee } from '../../types';
import { Modal } from '../common/Modal';
import { generatePayslipPDF } from '../../services/pdfGenerator';
import { Download, FileText, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
  employee?: Employee;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payroll,
  employee
}) => {
  if (!payroll) return null;

  const handleDownload = () => {
    generatePayslipPDF(payroll, employee);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salary Statement & Payslip"
      subtitle={`Payment Period: ${payroll.month} ${payroll.year}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Company & Employee Summary Header */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-odoo-800 to-odoo-900 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight font-display">DAYFLOW HRMS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/20">Official Slip</span>
              </div>
              <p className="text-xs text-odoo-100 mt-1">Enterprise Human Resource & Payroll Division</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-odoo-200 block">Statement Reference</span>
              <span className="text-xs font-mono font-bold">DF-PAY-{payroll.id.toUpperCase().slice(-8)}</span>
            </div>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Employee Name</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{payroll.employeeName}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Employee ID</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{payroll.employeeId}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Designation</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{employee?.designation || 'Specialist'}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Status</span>
            <div className="mt-0.5">
              <Badge status={payroll.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center justify-between">
              <span>Gross Earnings</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">${payroll.grossSalary.toLocaleString()}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Special & Conveyance</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Performance Bonus</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.bonus.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center justify-between">
              <span>Total Deductions</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">${payroll.totalDeductions.toLocaleString()}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Provident Fund (PF)</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.pf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Professional Tax & Withholding</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">${payroll.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Other Deductions</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Highlight Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Net Payable Take-Home Salary
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Directly deposited to registered bank account on {payroll.paymentDate}
            </p>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
            ${payroll.netPay.toLocaleString()}
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Payslip</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
