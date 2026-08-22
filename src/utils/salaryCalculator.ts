import { SalaryStructure } from '../types';

export const computeSalaryStructure = (
  monthlyWage: number,
  overrides?: Partial<SalaryStructure>
): SalaryStructure => {
  const wage = Math.max(0, monthlyWage);
  const yearlyWage = wage * 12;

  // 1. Basic Salary = 50% of Monthly Wage
  const baseSalary = Number((wage * 0.50).toFixed(2));

  // 2. House Rent Allowance (HRA) = 50% of Basic Salary
  const hra = Number((baseSalary * 0.50).toFixed(2));

  // 3. Standard Allowance = 16.668% of Basic Salary (e.g., ~4,167 for 25,000 basic)
  const standardAllowance = Number((baseSalary * 0.16668).toFixed(2));

  // 4. Performance Bonus = 8.33% of Basic Salary (e.g., ~2,082.50 for 25,000 basic)
  const performanceBonus = Number((baseSalary * 0.0833).toFixed(2));

  // 5. Leave Travel Allowance (LTA) = 8.33% of Basic Salary (e.g., ~2,082.50 for 25,000 basic)
  const leaveTravelAllowance = Number((baseSalary * 0.0833).toFixed(2));

  // 6. Fixed Allowance = Remaining balance of Wage - Sum of all other components
  const calculatedSum = baseSalary + hra + standardAllowance + performanceBonus + leaveTravelAllowance;
  const fixedAllowance = Math.max(0, Number((wage - calculatedSum).toFixed(2)));

  // 7. Provident Fund (PF) Contributions = 12% of Basic Salary
  const providentFund = Number((baseSalary * 0.12).toFixed(2));
  const employerPF = Number((baseSalary * 0.12).toFixed(2));

  // 8. Tax Deductions
  const professionalTax = 200.00;

  return {
    monthlyWage: wage,
    yearlyWage,
    workingDaysPerWeek: overrides?.workingDaysPerWeek ?? 5,
    workingHoursPerDay: overrides?.workingHoursPerDay ?? 8,
    breakTimeHours: overrides?.breakTimeHours ?? 1,
    baseSalary,
    hra,
    standardAllowance,
    performanceBonus,
    leaveTravelAllowance,
    fixedAllowance,
    conveyance: overrides?.conveyance ?? 500,
    specialAllowance: overrides?.specialAllowance ?? 800,
    bonus: overrides?.bonus ?? performanceBonus,
    providentFund,
    employerPF,
    professionalTax,
    currency: overrides?.currency || 'INR',
    ...overrides
  };
};
