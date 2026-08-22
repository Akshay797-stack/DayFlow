import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';
import { PayrollRecord } from '../types';
import { PayrollTable } from '../components/payroll/PayrollTable';
import { StatCard } from '../components/common/StatCard';
import { DollarSign, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { payroll } = useHRData();

  const currentMonthPay = payroll.find((p: PayrollRecord) => p.employeeId === currentUser?.employeeId && p.month === 'August') 
    || payroll.find((p: PayrollRecord) => p.employeeId === currentUser?.employeeId)
    || payroll[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-odoo-700 dark:text-odoo-400" />
            <span>{isAdmin ? 'Corporate Payroll & Compensation Engine' : 'My Payroll & Salary Slips'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Administer salary components, issue verified payslips, and execute monthly disbursements'
              : 'Read-only visibility of your earnings breakdown, tax deductions, and downloadable PDF statements'}
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isAdmin ? "Total Monthly Payroll" : "My Gross Earnings"}
          value={isAdmin ? "$64,872" : `$${currentMonthPay?.grossSalary.toLocaleString() || '14,750'}`}
          subtitle={isAdmin ? "Across 5 departments" : "Base + HRA + Allowances"}
          icon={DollarSign}
          iconColor="text-odoo-800 dark:text-odoo-300"
          iconBg="bg-odoo-800/10 dark:bg-odoo-800/20"
        />
        <StatCard
          title={isAdmin ? "Average Net Salary" : "Net Take-Home Pay"}
          value={isAdmin ? "$12,974" : `$${currentMonthPay?.netPay.toLocaleString() || '12,660'}`}
          subtitle={isAdmin ? "Per employee average" : "Direct deposit to bank"}
          icon={TrendingUp}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-500/10 dark:bg-teal-500/20"
        />
        <StatCard
          title={isAdmin ? "Tax & PF Withholdings" : "Total Deductions"}
          value={isAdmin ? "$10,778" : `-$${currentMonthPay?.totalDeductions.toLocaleString() || '2,090'}`}
          subtitle="Provident Fund + Tax"
          icon={ShieldAlert}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-500/10 dark:bg-rose-500/20"
        />
        <StatCard
          title="Disbursement Schedule"
          value="28th Monthly"
          subtitle="Next payout: Aug 28, 2026"
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
        />
      </div>

      {/* Main Table */}
      <PayrollTable records={payroll} />
    </div>
  );
};
