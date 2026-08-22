import React, { useState, useEffect } from 'react';
import { Employee, SalaryStructure } from '../../types';
import { useHRData } from '../../context/HRDataContext';
import { Modal } from '../common/Modal';
import { DollarSign, Save, ShieldCheck } from 'lucide-react';

interface SalaryStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const SalaryStructureModal: React.FC<SalaryStructureModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const { updateSalaryStructure } = useHRData();

  const [formData, setFormData] = useState<SalaryStructure>({
    monthlyWage: 50000,
    yearlyWage: 600000,
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8,
    breakTimeHours: 1,
    baseSalary: 25000,
    hra: 12500,
    standardAllowance: 4167,
    performanceBonus: 2082.5,
    leaveTravelAllowance: 2082.5,
    fixedAllowance: 4168,
    conveyance: 500,
    specialAllowance: 800,
    providentFund: 3000,
    employerPF: 3000,
    professionalTax: 200,
    bonus: 2082.5,
    currency: 'INR'
  });

  useEffect(() => {
    if (employee?.salaryStructure) {
      setFormData(employee.salaryStructure);
    }
  }, [employee]);

  const handleChange = (field: keyof SalaryStructure, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const gross = formData.monthlyWage || (formData.baseSalary + formData.hra + (formData.conveyance || 0) + (formData.specialAllowance || 0) + (formData.bonus || 0));
  const deductions = formData.providentFund + formData.professionalTax;
  const net = gross - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    updateSalaryStructure(employee.employeeId, formData);
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Salary Structure"
      subtitle={`Admin Compensation Control for ${employee.name} (${employee.employeeId})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Base Salary ($) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.baseSalary}
              onChange={e => handleChange('baseSalary', Number(e.target.value))}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              House Rent Allowance (HRA) ($) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.hra}
              onChange={e => handleChange('hra', Number(e.target.value))}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Conveyance Allowance ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.conveyance}
              onChange={e => handleChange('conveyance', Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Special Allowance ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.specialAllowance}
              onChange={e => handleChange('specialAllowance', Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Provident Fund (PF) ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.providentFund}
              onChange={e => handleChange('providentFund', Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Professional Tax & Withholding ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.professionalTax}
              onChange={e => handleChange('professionalTax', Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Performance Incentive / Bonus ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.bonus}
              onChange={e => handleChange('bonus', Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Calculated Gross:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">${gross.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Total Deductions:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">-${deductions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
            <span className="text-odoo-800 dark:text-odoo-300">Estimated Net Pay:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">${net.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Structure</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
