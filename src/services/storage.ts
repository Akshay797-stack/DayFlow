import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem, LeaveType, LeaveStatus, SalaryStructure } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVES, INITIAL_PAYROLL, INITIAL_NOTIFICATIONS } from './mockData';

const KEYS = {
  EMPLOYEES: 'dayflow_employees_v1',
  ATTENDANCE: 'dayflow_attendance_v1',
  LEAVES: 'dayflow_leaves_v1',
  PAYROLL: 'dayflow_payroll_v1',
  NOTIFICATIONS: 'dayflow_notifications_v1',
  AUTH: 'dayflow_auth_v1',
  THEME: 'dayflow_theme_v1',
};

// Storage helper with fallback to initial seed
export const StorageService = {
  // Reset all data to factory demo state
  resetToDemo(): void {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
    localStorage.setItem(KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  },

  // Employees
  getEmployees(): Employee[] {
    const raw = localStorage.getItem(KEYS.EMPLOYEES);
    if (!raw) {
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees(employees: Employee[]): void {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getEmployeeById(id: string): Employee | undefined {
    const employees = this.getEmployees();
    return employees.find(e => e.id === id || e.employeeId === id);
  },

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === id || e.employeeId === id);
    if (index === -1) return null;

    employees[index] = { ...employees[index], ...updates };
    this.saveEmployees(employees);
    return employees[index];
  },

  addEmployee(employee: Employee): void {
    const employees = this.getEmployees();
    employees.unshift(employee);
    this.saveEmployees(employees);
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  saveAttendance(records: AttendanceRecord[]): void {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  punchIn(employee: Employee): AttendanceRecord {
    const records = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if record exists for today
    const existingIndex = records.findIndex(r => r.employeeId === employee.employeeId && r.date === today);

    if (existingIndex !== -1) {
      records[existingIndex].checkIn = nowTime;
      records[existingIndex].status = 'PRESENT';
      this.saveAttendance(records);
      return records[existingIndex];
    }

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      employeeId: employee.employeeId,
      employeeName: employee.name,
      date: today,
      checkIn: nowTime,
      checkOut: null,
      workingHours: 0,
      status: 'PRESENT'
    };

    records.unshift(newRecord);
    this.saveAttendance(records);
    return newRecord;
  },

  punchOut(employee: Employee): AttendanceRecord | null {
    const records = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const existingIndex = records.findIndex(r => r.employeeId === employee.employeeId && r.date === today);
    if (existingIndex === -1) return null;

    const record = records[existingIndex];
    record.checkOut = nowTime;

    // Calculate approximate working hours if checkIn exists
    if (record.checkIn) {
      try {
        const parseTime = (timeStr: string) => {
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          return hours + minutes / 60;
        };
        const inHrs = parseTime(record.checkIn);
        const outHrs = parseTime(nowTime);
        record.workingHours = Math.max(0.5, Number((outHrs - inHrs).toFixed(2)));
        if (record.workingHours < 5) {
          record.status = 'HALF_DAY';
        }
      } catch {
        record.workingHours = 8.0;
      }
    }

    records[existingIndex] = record;
    this.saveAttendance(records);
    return record;
  },

  // Leaves
  getLeaves(): LeaveRequest[] {
    const raw = localStorage.getItem(KEYS.LEAVES);
    if (!raw) {
      localStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
      return INITIAL_LEAVES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LEAVES;
    }
  },

  saveLeaves(leaves: LeaveRequest[]): void {
    localStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));
  },

  applyLeave(
    employee: Employee,
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    totalDays: number,
    reason: string
  ): LeaveRequest {
    const leaves = this.getLeaves();
    const newLeave: LeaveRequest = {
      id: 'leave-' + Date.now(),
      employeeId: employee.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    leaves.unshift(newLeave);
    this.saveLeaves(leaves);

    // Create notification for HR Admin
    this.addNotification({
      userId: 'ALL',
      title: 'New Leave Request',
      message: `${employee.name} applied for ${totalDays} day(s) of ${leaveType} leave.`,
      type: 'leave',
      link: '/leaves'
    });

    return newLeave;
  },

  reviewLeave(
    leaveId: string,
    status: LeaveStatus,
    adminComment: string,
    reviewerName: string
  ): LeaveRequest | null {
    const leaves = this.getLeaves();
    const index = leaves.findIndex(l => l.id === leaveId);
    if (index === -1) return null;

    const leave = leaves[index];
    leave.status = status;
    leave.adminComment = adminComment;
    leave.reviewedBy = reviewerName;
    leave.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    leaves[index] = leave;
    this.saveLeaves(leaves);

    // If approved, deduct from employee leave balance & mark attendance calendar
    if (status === 'APPROVED') {
      const employees = this.getEmployees();
      const empIndex = employees.findIndex(e => e.employeeId === leave.employeeId);
      if (empIndex !== -1) {
        const emp = employees[empIndex];
        const typeKey = leave.leaveType.toLowerCase() as 'paid' | 'sick' | 'casual';
        if (emp.leaveBalance[typeKey]) {
          emp.leaveBalance[typeKey].used += leave.totalDays;
          emp.leaveBalance[typeKey].remaining = Math.max(0, emp.leaveBalance[typeKey].total - emp.leaveBalance[typeKey].used);
        } else if (leave.leaveType === 'UNPAID') {
          emp.leaveBalance.unpaid.used += leave.totalDays;
        }
        this.saveEmployees(employees);
      }

      // Add Attendance record placeholder for the dates
      const attendances = this.getAttendance();
      attendances.unshift({
        id: 'att-leave-' + Date.now(),
        employeeId: leave.employeeId,
        employeeName: leave.employeeName,
        date: leave.startDate,
        checkIn: null,
        checkOut: null,
        workingHours: 0,
        status: 'LEAVE',
        notes: `${leave.leaveType} Leave: ${leave.reason}`
      });
      this.saveAttendance(attendances);
    }

    // Send notification to employee
    this.addNotification({
      userId: leave.employeeId,
      title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your ${leave.leaveType} leave request (${leave.startDate} to ${leave.endDate}) was ${status.toLowerCase()}${adminComment ? `: "${adminComment}"` : '.'}`,
      type: status === 'APPROVED' ? 'success' : 'warning',
      link: '/leaves'
    });

    return leave;
  },

  // Payroll
  getPayroll(): PayrollRecord[] {
    const raw = localStorage.getItem(KEYS.PAYROLL);
    if (!raw) {
      localStorage.setItem(KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
      return INITIAL_PAYROLL;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PAYROLL;
    }
  },

  savePayroll(records: PayrollRecord[]): void {
    localStorage.setItem(KEYS.PAYROLL, JSON.stringify(records));
  },

  updateSalaryStructure(employeeId: string, salary: SalaryStructure): void {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.employeeId === employeeId || e.id === employeeId);
    if (index !== -1) {
      employees[index].salaryStructure = salary;
      this.saveEmployees(employees);
    }
  },

  runMonthlyPayrollBatch(month: string, year: number): PayrollRecord[] {
    const employees = this.getEmployees();
    const payrolls = this.getPayroll();
    const newRecords: PayrollRecord[] = [];

    employees.forEach(emp => {
      // Check if already generated for this month
      const exists = payrolls.find(p => p.employeeId === emp.employeeId && p.month === month && p.year === year);
      const sal = emp.salaryStructure;
      const gross = sal.baseSalary + sal.hra + sal.conveyance + sal.specialAllowance + sal.bonus;
      const deductions = sal.providentFund + sal.professionalTax;
      const net = gross - deductions;

      if (!exists) {
        const record: PayrollRecord = {
          id: `pay-${emp.employeeId}-${month}-${year}`,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          month,
          year,
          basic: sal.baseSalary,
          hra: sal.hra,
          allowances: sal.conveyance + sal.specialAllowance,
          bonus: sal.bonus,
          grossSalary: gross,
          pf: sal.providentFund,
          tax: sal.professionalTax,
          totalDeductions: deductions,
          netPay: net,
          status: 'PAID',
          paymentDate: `${year}-${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-28`
        };
        newRecords.push(record);
      }
    });

    const combined = [...newRecords, ...payrolls];
    this.savePayroll(combined);

    if (newRecords.length > 0) {
      this.addNotification({
        userId: 'ALL',
        title: 'Monthly Salary Processed',
        message: `Payroll for ${month} ${year} has been processed and payslips are available for download.`,
        type: 'payroll',
        link: '/payroll'
      });
    }

    return combined;
  },

  // Notifications
  getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    let notifs: NotificationItem[] = INITIAL_NOTIFICATIONS;
    if (raw) {
      try {
        notifs = JSON.parse(raw);
      } catch {
        notifs = INITIAL_NOTIFICATIONS;
      }
    }

    if (!userId) return notifs;
    return notifs.filter(n => n.userId === 'ALL' || n.userId === userId);
  },

  saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const notifs = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false
    };
    notifs.unshift(item);
    this.saveNotifications(notifs);
    return item;
  },

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].read = true;
      this.saveNotifications(notifs);
    }
  },

  markAllNotificationsRead(userId?: string): void {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (!userId || n.userId === 'ALL' || n.userId === userId) {
        n.read = true;
      }
    });
    this.saveNotifications(notifs);
  }
};
