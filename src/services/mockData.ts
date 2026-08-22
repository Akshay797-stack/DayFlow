import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP-0001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.com',
    role: 'ADMIN_HR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 123-4567',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    designation: 'VP of People & Culture',
    department: 'Human Resources',
    joiningDate: '2021-03-15',
    employmentType: 'Full-Time',
    managerName: 'Board of Directors',
    isEmailVerified: true,
    bio: 'People operations strategist with 10+ years scaling high-growth tech teams, talent acquisition, and company culture.',
    salaryStructure: {
      baseSalary: 12500,
      hra: 3500,
      conveyance: 800,
      specialAllowance: 1200,
      providentFund: 1500,
      professionalTax: 200,
      bonus: 1000,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-1', name: 'Executive_Employment_Agreement.pdf', type: 'Contract', uploadDate: '2021-03-15', size: '2.4 MB' },
      { id: 'doc-2', name: 'Identity_Verification_Passport.pdf', type: 'ID Proof', uploadDate: '2021-03-16', size: '1.8 MB' },
      { id: 'doc-3', name: 'HR_Compliance_Certification.pdf', type: 'Certificate', uploadDate: '2023-01-10', size: '950 KB' }
    ],
    leaveBalance: {
      paid: { total: 24, used: 4, remaining: 20 },
      sick: { total: 10, used: 1, remaining: 9 },
      casual: { total: 6, used: 2, remaining: 4 },
      unpaid: { used: 0 }
    },
    emergencyContact: {
      name: 'Robert Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-1002',
    name: 'Alex Morgan',
    email: 'employee@dayflow.com',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    address: '120 Market St, Apt 4B, San Francisco, CA 94102',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering',
    joiningDate: '2022-08-01',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Passionate full-stack developer specializing in modern React, TypeScript, GraphQL, and microservices architecture.',
    salaryStructure: {
      baseSalary: 9500,
      hra: 2800,
      conveyance: 600,
      specialAllowance: 1100,
      providentFund: 1140,
      professionalTax: 200,
      bonus: 750,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-4', name: 'Software_Engineer_Contract_Signed.pdf', type: 'Contract', uploadDate: '2022-08-01', size: '3.1 MB' },
      { id: 'doc-5', name: 'Drivers_License_Verification.pdf', type: 'ID Proof', uploadDate: '2022-08-02', size: '1.2 MB' },
      { id: 'doc-6', name: 'W4_Tax_Withholding_2026.pdf', type: 'Tax Form', uploadDate: '2026-01-05', size: '420 KB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 5, remaining: 13 },
      sick: { total: 8, used: 2, remaining: 6 },
      casual: { total: 6, used: 1, remaining: 5 },
      unpaid: { used: 0 }
    },
    emergencyContact: {
      name: 'Claire Morgan',
      relationship: 'Sister',
      phone: '+1 (555) 876-5432'
    }
  },
  {
    id: 'emp-003',
    employeeId: 'EMP-1003',
    name: 'Elena Rostova',
    email: 'elena@dayflow.com',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    address: '450 Mission St, San Francisco, CA 94105',
    designation: 'Lead Product Designer',
    department: 'Design & UX',
    joiningDate: '2023-06-15',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Design system fanatic crafting human-centric digital experiences with pixel perfection.',
    salaryStructure: {
      baseSalary: 8800,
      hra: 2500,
      conveyance: 500,
      specialAllowance: 900,
      providentFund: 1056,
      professionalTax: 200,
      bonus: 600,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-7', name: 'Employment_Contract_Design.pdf', type: 'Contract', uploadDate: '2023-06-15', size: '2.1 MB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 3, remaining: 15 },
      sick: { total: 8, used: 0, remaining: 8 },
      casual: { total: 6, used: 2, remaining: 4 },
      unpaid: { used: 0 }
    }
  },
  {
    id: 'emp-004',
    employeeId: 'EMP-1004',
    name: 'David Kim',
    email: 'david@dayflow.com',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    address: '890 Folsom St, San Francisco, CA 94107',
    designation: 'DevOps & Cloud Architect',
    department: 'Infrastructure',
    joiningDate: '2022-11-10',
    employmentType: 'Full-Time',
    managerName: 'Alex Morgan',
    isEmailVerified: true,
    bio: 'Kubernetes maestro, Terraform enthusiast, maintaining 99.99% uptime for global systems.',
    salaryStructure: {
      baseSalary: 10200,
      hra: 3000,
      conveyance: 700,
      specialAllowance: 1300,
      providentFund: 1224,
      professionalTax: 200,
      bonus: 800,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-8', name: 'DevOps_Architect_Contract.pdf', type: 'Contract', uploadDate: '2022-11-10', size: '2.8 MB' },
      { id: 'doc-9', name: 'AWS_Solutions_Architect_Pro.pdf', type: 'Certificate', uploadDate: '2024-02-18', size: '1.1 MB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 6, remaining: 12 },
      sick: { total: 8, used: 3, remaining: 5 },
      casual: { total: 6, used: 0, remaining: 6 },
      unpaid: { used: 0 }
    }
  },
  {
    id: 'emp-005',
    employeeId: 'EMP-1005',
    name: 'Priya Sharma',
    email: 'priya@dayflow.com',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    address: '320 Hayes St, San Francisco, CA 94102',
    designation: 'Product Marketing Lead',
    department: 'Growth & Marketing',
    joiningDate: '2023-01-20',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Storyteller, growth catalyst, connecting customer problems to delightful product capabilities.',
    salaryStructure: {
      baseSalary: 8200,
      hra: 2400,
      conveyance: 500,
      specialAllowance: 800,
      providentFund: 984,
      professionalTax: 200,
      bonus: 700,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-10', name: 'Marketing_Lead_Agreement.pdf', type: 'Contract', uploadDate: '2023-01-20', size: '1.9 MB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 2, remaining: 16 },
      sick: { total: 8, used: 0, remaining: 8 },
      casual: { total: 6, used: 1, remaining: 5 },
      unpaid: { used: 0 }
    }
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's records (Aug 22, 2026)
  {
    id: 'att-101',
    employeeId: 'EMP-0001',
    employeeName: 'Sarah Jenkins',
    date: '2026-08-22',
    checkIn: '08:45 AM',
    checkOut: null,
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-102',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-22',
    checkIn: '09:05 AM',
    checkOut: null,
    workingHours: 8.5,
    extraHours: 0.5,
    status: 'PRESENT'
  },
  {
    id: 'att-103',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    date: '2026-08-22',
    checkIn: '09:30 AM',
    checkOut: null,
    workingHours: 8.0,
    extraHours: 0,
    status: 'PRESENT'
  },
  {
    id: 'att-104',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    date: '2026-08-22',
    checkIn: null,
    checkOut: null,
    workingHours: 0,
    extraHours: 0,
    status: 'LEAVE',
    notes: 'Approved Sick Leave'
  },
  {
    id: 'att-105',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    date: '2026-08-22',
    checkIn: '09:12 AM',
    checkOut: null,
    workingHours: 9.5,
    extraHours: 1.5,
    status: 'PRESENT'
  },

  // Past Days History
  {
    id: 'att-106',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-21',
    checkIn: '09:00 AM',
    checkOut: '06:30 PM',
    workingHours: 9.5,
    extraHours: 1.5,
    status: 'PRESENT'
  },
  {
    id: 'att-107',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-20',
    checkIn: '09:15 AM',
    checkOut: '06:15 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-108',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-19',
    checkIn: '08:55 AM',
    checkOut: '05:55 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-109',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-18',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-110',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-15',
    checkIn: null,
    checkOut: null,
    workingHours: 0,
    extraHours: 0,
    status: 'LEAVE',
    notes: 'Paid Vacation Day'
  },
  {
    id: 'att-111',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    date: '2026-08-21',
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-112',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    date: '2026-08-20',
    checkIn: '10:00 AM',
    checkOut: '07:00 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  },
  {
    id: 'att-113',
    employeeId: 'EMP-0001',
    employeeName: 'Sarah Jenkins',
    date: '2026-08-21',
    checkIn: '08:30 AM',
    checkOut: '05:45 PM',
    workingHours: 9.25,
    extraHours: 1.25,
    status: 'PRESENT'
  },
  {
    id: 'att-114',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    date: '2026-08-21',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    extraHours: 1.0,
    status: 'PRESENT'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    department: 'Engineering',
    leaveType: 'PAID',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    totalDays: 4,
    reason: 'Annual family vacation trip to Hawaii.',
    status: 'PENDING',
    appliedOn: '2026-08-18'
  },
  {
    id: 'leave-002',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    department: 'Infrastructure',
    leaveType: 'SICK',
    startDate: '2026-08-22',
    endDate: '2026-08-23',
    totalDays: 2,
    reason: 'Severe seasonal flu symptoms and medical doctor appointment.',
    status: 'APPROVED',
    appliedOn: '2026-08-21',
    adminComment: 'Get well soon David! Take full rest.',
    reviewedBy: 'Sarah Jenkins',
    reviewedAt: '2026-08-21 16:30'
  },
  {
    id: 'leave-003',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
    department: 'Design & UX',
    leaveType: 'CASUAL',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    totalDays: 1,
    reason: 'Personal errand and house relocation setup.',
    status: 'PENDING',
    appliedOn: '2026-08-20'
  },
  {
    id: 'leave-004',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    department: 'Growth & Marketing',
    leaveType: 'PAID',
    startDate: '2026-07-14',
    endDate: '2026-07-16',
    totalDays: 3,
    reason: 'Annual family reunion.',
    status: 'APPROVED',
    appliedOn: '2026-07-05',
    adminComment: 'Approved, have a great time!',
    reviewedBy: 'Sarah Jenkins',
    reviewedAt: '2026-07-06 10:15'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-001',
    employeeId: 'EMP-0001',
    employeeName: 'Sarah Jenkins',
    month: 'July',
    year: 2026,
    totalWorkingDays: 22,
    presentDays: 21,
    paidLeaveDays: 1,
    unpaidDays: 0,
    payableDays: 22,
    basic: 12500,
    hra: 3500,
    allowances: 2000,
    bonus: 1000,
    grossSalary: 19000,
    pf: 1500,
    tax: 1200,
    lopDeduction: 0,
    totalDeductions: 2700,
    netPay: 16300,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  {
    id: 'pay-002',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    month: 'July',
    year: 2026,
    totalWorkingDays: 22,
    presentDays: 20,
    paidLeaveDays: 2,
    unpaidDays: 0,
    payableDays: 22,
    basic: 9500,
    hra: 2800,
    allowances: 1700,
    bonus: 750,
    grossSalary: 14750,
    pf: 1140,
    tax: 950,
    lopDeduction: 0,
    totalDeductions: 2090,
    netPay: 12660,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  {
    id: 'pay-003',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    month: 'July',
    year: 2026,
    totalWorkingDays: 22,
    presentDays: 22,
    paidLeaveDays: 0,
    unpaidDays: 0,
    payableDays: 22,
    basic: 8800,
    hra: 2500,
    allowances: 1400,
    bonus: 600,
    grossSalary: 13300,
    pf: 1056,
    tax: 820,
    lopDeduction: 0,
    totalDeductions: 1876,
    netPay: 11424,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  {
    id: 'pay-004',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    month: 'July',
    year: 2026,
    totalWorkingDays: 22,
    presentDays: 21,
    paidLeaveDays: 1,
    unpaidDays: 0,
    payableDays: 22,
    basic: 10200,
    hra: 3000,
    allowances: 2000,
    bonus: 800,
    grossSalary: 16000,
    pf: 1224,
    tax: 980,
    lopDeduction: 0,
    totalDeductions: 2204,
    netPay: 13796,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  {
    id: 'pay-005',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    month: 'July',
    year: 2026,
    totalWorkingDays: 22,
    presentDays: 19,
    paidLeaveDays: 3,
    unpaidDays: 0,
    payableDays: 22,
    basic: 8200,
    hra: 2400,
    allowances: 1300,
    bonus: 700,
    grossSalary: 12600,
    pf: 984,
    tax: 780,
    lopDeduction: 0,
    totalDeductions: 1764,
    netPay: 10836,
    status: 'PAID',
    paymentDate: '2026-07-31'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    userId: 'ALL',
    title: 'New Leave Request Submitted',
    message: 'Alex Morgan submitted a request for 4 days of Paid Leave.',
    type: 'leave',
    timestamp: '10 mins ago',
    read: false,
    link: '/leaves'
  },
  {
    id: 'notif-002',
    userId: 'EMP-1004',
    title: 'Sick Leave Approved',
    message: 'Your 2-day Sick Leave request for Aug 22-23 was approved by Sarah Jenkins.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false,
    link: '/leaves'
  },
  {
    id: 'notif-003',
    userId: 'ALL',
    title: 'Monthly Salary Statements Ready',
    message: 'July 2026 payroll compensation has been successfully disbursed.',
    type: 'payroll',
    timestamp: '1 day ago',
    read: true,
    link: '/payroll'
  },
  {
    id: 'notif-004',
    userId: 'EMP-1002',
    title: 'Shift Punch-In Recorded',
    message: 'Shift started today at 09:05 AM. Have a great day!',
    type: 'attendance',
    timestamp: 'Today at 09:05 AM',
    read: true,
    link: '/attendance'
  }
];
