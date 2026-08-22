export type UserRole = 'ADMIN_HR' | 'EMPLOYEE';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID' | 'CASUAL';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PayrollStatus = 'PAID' | 'PENDING' | 'PROCESSING';

export interface SalaryStructure {
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number;
  workingHoursPerDay: number;
  breakTimeHours: number;
  // Computed Salary Components (Auto-updated based on Monthly Wage)
  baseSalary: number; // 50.00% of wage
  hra: number; // 50.00% of Basic salary
  standardAllowance: number; // 16.67% of Basic
  performanceBonus: number; // 8.33% of Basic
  leaveTravelAllowance: number; // 8.33% of Basic
  fixedAllowance: number; // Remainder to match total monthly wage
  conveyance: number;
  specialAllowance: number;
  bonus: number;
  // Provident Fund (PF) Contribution
  providentFund: number; // Employee PF (12.00% of Basic)
  employerPF: number; // Employer PF (12.00% of Basic)
  // Tax Deductions
  professionalTax: number; // e.g. 200.00
  currency: string;
}

export interface PrivateInfo {
  dateOfBirth?: string;
  residingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  // Bank & Statutory Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  uanNumber?: string;
}

export interface EmployeeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'Resume' | 'ID Proof' | 'Contract' | 'Tax Form' | 'Certificate' | 'Other';
  uploadDate: string;
  size: string;
  fileUrl?: string;
}

export interface LeaveCategoryBalance {
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveBalance {
  paid: LeaveCategoryBalance;
  sick: LeaveCategoryBalance;
  casual: LeaveCategoryBalance;
  unpaid: { used: number };
}

export interface Employee {
  id: string;
  employeeId: string; // EMP-1001
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentType: EmploymentType;
  managerName: string;
  isEmailVerified: boolean;
  salaryStructure: SalaryStructure;
  documents: EmployeeDocument[];
  leaveBalance: LeaveBalance;
  // Wireframe Profile Info
  about?: string;
  whatILoveAboutJob?: string;
  interestsAndHobbies?: string;
  skills?: string[];
  certifications?: EmployeeCertification[];
  privateInfo?: PrivateInfo;
  bio?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "09:00 AM" or "10:00"
  checkOut: string | null; // e.g. "07:00 PM" or "19:00"
  workingHours: number; // in hours e.g. 9.0
  extraHours: number; // in hours e.g. 1.0 (overtime when work hours > 8.0)
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  adminComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  // Attendance-based payable day calculation
  totalWorkingDays: number;
  presentDays: number;
  paidLeaveDays: number;
  unpaidDays: number;
  payableDays: number;
  // Salary Breakdown
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  pf: number;
  tax: number;
  lopDeduction: number; // Loss of Pay Deduction for unpaid/missing days
  totalDeductions: number;
  netPay: number;
  status: PayrollStatus;
  paymentDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string | 'ALL';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'leave' | 'attendance' | 'payroll';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuthState {
  user: Employee | null;
  isAuthenticated: boolean;
  token: string | null;
}
