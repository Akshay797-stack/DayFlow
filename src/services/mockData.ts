import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP-0001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.com',
    role: 'ADMIN_HR',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
    designation: 'VP of People & Culture',
    department: 'Human Resources',
    joiningDate: '2022-01-15',
    employmentType: 'Full-Time',
    managerName: 'CEO Office',
    isEmailVerified: true,
    bio: 'HR strategist passionate about building empathetic company cultures and high-performance teams.',
    emergencyContact: {
      name: 'Michael Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 234-9999'
    },
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
      { id: 'doc-1', name: 'Executive_Employment_Agreement.pdf', type: 'Contract', uploadDate: '2022-01-15', size: '2.4 MB' },
      { id: 'doc-2', name: 'Passport_Verification.pdf', type: 'ID Proof', uploadDate: '2022-01-16', size: '1.8 MB' },
      { id: 'doc-3', name: 'W-4_Tax_Form_2026.pdf', type: 'Tax Form', uploadDate: '2026-01-05', size: '850 KB' }
    ],
    leaveBalance: {
      paid: { total: 20, used: 4, remaining: 16 },
      sick: { total: 10, used: 2, remaining: 8 },
      casual: { total: 8, used: 1, remaining: 7 },
      unpaid: { used: 0 }
    }
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-1002',
    name: 'Alex Morgan',
    email: 'employee@dayflow.com',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    phone: '+1 (555) 876-5432',
    address: '108 Market Street, Apt 12B, San Francisco, CA 94105',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering',
    joiningDate: '2023-03-01',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Software engineer focusing on modern web architectures, distributed systems, and delightful UX.',
    emergencyContact: {
      name: 'Robert Morgan',
      relationship: 'Father',
      phone: '+1 (555) 876-0000'
    },
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
      { id: 'doc-4', name: 'Senior_Engineer_Offer_Letter.pdf', type: 'Contract', uploadDate: '2023-03-01', size: '1.9 MB' },
      { id: 'doc-5', name: 'Alex_Morgan_Resume_2026.pdf', type: 'Resume', uploadDate: '2023-02-20', size: '420 KB' },
      { id: 'doc-6', name: 'Identity_Verification_Drivers_License.pdf', type: 'ID Proof', uploadDate: '2023-03-02', size: '1.2 MB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 5, remaining: 13 },
      sick: { total: 8, used: 2, remaining: 6 },
      casual: { total: 6, used: 1, remaining: 5 },
      unpaid: { used: 0 }
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
      sick: { total: 8, used: 1, remaining: 7 },
      casual: { total: 6, used: 0, remaining: 6 },
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
    designation: 'Cloud Infrastructure Architect',
    department: 'Infrastructure',
    joiningDate: '2023-08-01',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Kubernetes, Terraform, and cloud reliability engineering specialist.',
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
      { id: 'doc-8', name: 'Contract_DevOps.pdf', type: 'Contract', uploadDate: '2023-08-01', size: '1.7 MB' }
    ],
    leaveBalance: {
      paid: { total: 18, used: 6, remaining: 12 },
      sick: { total: 8, used: 3, remaining: 5 },
      casual: { total: 6, used: 2, remaining: 4 },
      unpaid: { used: 1 }
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
    address: '320 Howard St, San Francisco, CA 94105',
    designation: 'Growth & Product Marketing Lead',
    department: 'Growth & Marketing',
    joiningDate: '2024-02-10',
    employmentType: 'Full-Time',
    managerName: 'Sarah Jenkins',
    isEmailVerified: true,
    bio: 'Data-driven marketing strategist helping scale product discovery and global retention.',
    salaryStructure: {
      baseSalary: 8400,
      hra: 2400,
      conveyance: 500,
      specialAllowance: 800,
      providentFund: 1008,
      professionalTax: 200,
      bonus: 500,
      currency: 'USD'
    },
    documents: [
      { id: 'doc-9', name: 'Marketing_Agreement.pdf', type: 'Contract', uploadDate: '2024-02-10', size: '2.0 MB' }
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
    workingHours: 4.5,
    status: 'PRESENT'
  },
  {
    id: 'att-102',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-22',
    checkIn: '09:05 AM',
    checkOut: null,
    workingHours: 4.2,
    status: 'PRESENT'
  },
  {
    id: 'att-103',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    date: '2026-08-22',
    checkIn: '09:30 AM',
    checkOut: null,
    workingHours: 3.8,
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
    workingHours: 4.0,
    status: 'PRESENT'
  },
  // Yesterday's records (Aug 21, 2026)
  {
    id: 'att-091',
    employeeId: 'EMP-0001',
    employeeName: 'Sarah Jenkins',
    date: '2026-08-21',
    checkIn: '08:50 AM',
    checkOut: '05:45 PM',
    workingHours: 8.9,
    status: 'PRESENT'
  },
  {
    id: 'att-092',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-21',
    checkIn: '09:00 AM',
    checkOut: '06:15 PM',
    workingHours: 9.2,
    status: 'PRESENT'
  },
  {
    id: 'att-093',
    employeeId: 'EMP-1003',
    employeeName: 'Elena Rostova',
    date: '2026-08-21',
    checkIn: '09:15 AM',
    checkOut: '05:30 PM',
    workingHours: 8.25,
    status: 'PRESENT'
  },
  {
    id: 'att-094',
    employeeId: 'EMP-1004',
    employeeName: 'David Kim',
    date: '2026-08-21',
    checkIn: '09:00 AM',
    checkOut: '01:30 PM',
    workingHours: 4.5,
    status: 'HALF_DAY',
    notes: 'Doctor appointment in afternoon'
  },
  {
    id: 'att-095',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    date: '2026-08-21',
    checkIn: '08:55 AM',
    checkOut: '05:50 PM',
    workingHours: 8.9,
    status: 'PRESENT'
  },
  // Aug 20, 2026
  {
    id: 'att-081',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-20',
    checkIn: '09:10 AM',
    checkOut: '06:00 PM',
    workingHours: 8.8,
    status: 'PRESENT'
  },
  {
    id: 'att-082',
    employeeId: 'EMP-0001',
    employeeName: 'Sarah Jenkins',
    date: '2026-08-20',
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    workingHours: 8.75,
    status: 'PRESENT'
  },
  // Aug 19, 2026
  {
    id: 'att-071',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-19',
    checkIn: '08:58 AM',
    checkOut: '05:45 PM',
    workingHours: 8.78,
    status: 'PRESENT'
  },
  // Aug 18, 2026
  {
    id: 'att-061',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    date: '2026-08-18',
    checkIn: '09:05 AM',
    checkOut: '06:20 PM',
    workingHours: 9.25,
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
    reason: 'Family vacation and attending technical symposium.',
    status: 'PENDING',
    appliedOn: '2026-08-21'
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
    reason: 'Viral fever recovery and medical checkup.',
    status: 'APPROVED',
    appliedOn: '2026-08-21',
    adminComment: 'Get well soon David! Keep us updated.',
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
    basic: 12500,
    hra: 3500,
    allowances: 2000,
    bonus: 1000,
    grossSalary: 19000,
    pf: 1500,
    tax: 1200,
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
    basic: 9500,
    hra: 2800,
    allowances: 1700,
    bonus: 750,
    grossSalary: 14750,
    pf: 1140,
    tax: 950,
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
    basic: 8800,
    hra: 2500,
    allowances: 1400,
    bonus: 600,
    grossSalary: 13300,
    pf: 1056,
    tax: 820,
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
    basic: 10200,
    hra: 3000,
    allowances: 2000,
    bonus: 800,
    grossSalary: 16000,
    pf: 1224,
    tax: 1100,
    totalDeductions: 2324,
    netPay: 13676,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  {
    id: 'pay-005',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    month: 'July',
    year: 2026,
    basic: 8400,
    hra: 2400,
    allowances: 1300,
    bonus: 500,
    grossSalary: 12600,
    pf: 1008,
    tax: 780,
    totalDeductions: 1788,
    netPay: 10812,
    status: 'PAID',
    paymentDate: '2026-07-31'
  },
  // Current Month Draft (August 2026)
  {
    id: 'pay-006',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Morgan',
    month: 'August',
    year: 2026,
    basic: 9500,
    hra: 2800,
    allowances: 1700,
    bonus: 750,
    grossSalary: 14750,
    pf: 1140,
    tax: 950,
    totalDeductions: 2090,
    netPay: 12660,
    status: 'PROCESSING',
    paymentDate: '2026-08-31'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'EMP-0001',
    title: 'New Leave Request',
    message: 'Alex Morgan submitted a request for 4 days of Paid Leave.',
    type: 'leave',
    timestamp: '10 mins ago',
    read: false,
    link: '/leaves'
  },
  {
    id: 'notif-2',
    userId: 'EMP-1004',
    title: 'Leave Approved',
    message: 'Your Sick Leave application for Aug 22-23 has been approved by HR.',
    type: 'success',
    timestamp: '1 hour ago',
    read: true,
    link: '/leaves'
  },
  {
    id: 'notif-3',
    userId: 'ALL',
    title: 'Upcoming Company Holiday',
    message: 'Labor Day holiday will be observed on Monday, Sept 7.',
    type: 'info',
    timestamp: 'Yesterday',
    read: false
  },
  {
    id: 'notif-4',
    userId: 'ALL',
    title: 'Monthly Payroll Run',
    message: 'July 2026 salary disbursements and payslips are now available.',
    type: 'payroll',
    timestamp: '3 days ago',
    read: true,
    link: '/payroll'
  }
];
