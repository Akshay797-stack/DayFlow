import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { StatCard } from '../common/StatCard';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  DollarSign, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const HRAnalytics: React.FC = () => {
  const { employees, attendance, leaves, payroll } = useHRData();

  // 1. Attendance breakdown data (Last 5 workdays)
  const attendanceTrendData = [
    { day: 'Mon (Aug 18)', present: 96, leave: 4, halfDay: 0 },
    { day: 'Tue (Aug 19)', present: 92, leave: 8, halfDay: 0 },
    { day: 'Wed (Aug 20)', present: 95, leave: 5, halfDay: 0 },
    { day: 'Thu (Aug 21)', present: 88, leave: 4, halfDay: 8 },
    { day: 'Fri (Aug 22)', present: 90, leave: 10, halfDay: 0 },
  ];

  // 2. Leave utilization pie data
  const totalPaid = leaves.filter(l => l.leaveType === 'PAID').reduce((sum, l) => sum + l.totalDays, 0) || 7;
  const totalSick = leaves.filter(l => l.leaveType === 'SICK').reduce((sum, l) => sum + l.totalDays, 0) || 4;
  const totalCasual = leaves.filter(l => l.leaveType === 'CASUAL').reduce((sum, l) => sum + l.totalDays, 0) || 2;
  const totalUnpaid = leaves.filter(l => l.leaveType === 'UNPAID').reduce((sum, l) => sum + l.totalDays, 0) || 1;

  const leavePieData = [
    { name: 'Paid Leave', value: totalPaid, color: '#714B67' },
    { name: 'Sick Leave', value: totalSick, color: '#f43f5e' },
    { name: 'Casual Leave', value: totalCasual, color: '#00A09D' },
    { name: 'Unpaid Leave', value: totalUnpaid, color: '#64748b' },
  ];

  // 3. Department Headcount & Payroll Spend
  const deptData = [
    { name: 'Engineering', count: 1, budget: 14750 },
    { name: 'HR', count: 1, budget: 19000 },
    { name: 'Design & UX', count: 1, budget: 13300 },
    { name: 'Infrastructure', count: 1, budget: 16000 },
    { name: 'Marketing', count: 1, budget: 12600 },
  ];

  const totalMonthlyPayroll = payroll.reduce((acc, p) => p.month === 'July' ? acc + p.netPay : acc, 0) || 64872;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          subtitle="All active enterprise personnel"
          icon={Users}
          iconColor="text-odoo-800 dark:text-odoo-300"
          iconBg="bg-odoo-800/10 dark:bg-odoo-800/20"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Avg Attendance Rate"
          value="94.2%"
          subtitle="Standard 8-hour workday compliance"
          icon={Clock}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-500/10 dark:bg-teal-500/20"
          trend={{ value: '2.5%', isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={leaves.filter(l => l.status === 'PENDING').length}
          subtitle="Leave & time-off applications"
          icon={CalendarDays}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10 dark:bg-amber-500/20"
        />
        <StatCard
          title="Monthly Payroll"
          value={`$${totalMonthlyPayroll.toLocaleString()}`}
          subtitle="Net monthly compensation budget"
          icon={DollarSign}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
          trend={{ value: '4%', isPositive: true }}
        />
      </div>

      {/* Charts Row 1: Attendance Trends & Leave Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Workforce Attendance Compliance (%)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily percentage of staff present vs on approved leave
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Target: 90%+
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A09D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00A09D" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="leaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="present" name="Present %" stroke="#00A09D" strokeWidth={2.5} fillOpacity={1} fill="url(#presentGrad)" />
                <Area type="monotone" dataKey="leave" name="Leave %" stroke="#714B67" strokeWidth={2} fillOpacity={1} fill="url(#leaveGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Category Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Leave Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of total leave days requested by category
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leavePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leavePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {leavePieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <strong className="text-slate-900 dark:text-white">{item.value}d</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Department Payroll Spending Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Departmental Payroll Allocation ($)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monthly compensation investment across organizational units
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Monthly Budget']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="budget" name="Payroll Expenditure" fill="#714B67" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
