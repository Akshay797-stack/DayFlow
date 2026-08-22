export type UserRole = 'ADMIN_HR' | 'EMPLOYEE';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID' | 'CASUAL';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PayrollStatus = 'PAID' | 'PENDING' | 'PROCESSING';

export interface SalaryStructure {
  baseSalary: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  providentFund: number;
  professionalTax: number;
  bonus: number;
  currency: string;
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
  checkIn: string | null; // e.g. "09:02 AM"
  checkOut: string | null; // e.g. "06:05 PM"
  workingHours: number; // in hours e.g. 8.5
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
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  pf: number;
  tax: number;
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
