import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem, LeaveType, LeaveStatus, SalaryStructure } from '../types';

const API_BASE = '/api';

export const ApiService = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Auth
  async login(email: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async signup(data: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async verifyEmail(employeeId: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Employees
  async getEmployees(): Promise<Employee[] | null> {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async addDocument(employeeId: string, doc: any) {
    try {
      const res = await fetch(`${API_BASE}/employees/${employeeId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Attendance
  async getAttendance(employeeId?: string, date?: string): Promise<AttendanceRecord[] | null> {
    try {
      let url = `${API_BASE}/attendance`;
      const params = new URLSearchParams();
      if (employeeId) params.append('employeeId', employeeId);
      if (date) params.append('date', date);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async punchIn(employeeId: string, employeeName: string) {
    try {
      const res = await fetch(`${API_BASE}/attendance/punch-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, employeeName })
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async punchOut(employeeId: string) {
    try {
      const res = await fetch(`${API_BASE}/attendance/punch-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  // Leaves
  async getLeaves(employeeId?: string): Promise<LeaveRequest[] | null> {
    try {
      let url = `${API_BASE}/leaves`;
      if (employeeId) url += `?employeeId=${employeeId}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async applyLeave(payload: any): Promise<LeaveRequest | null> {
    try {
      const res = await fetch(`${API_BASE}/leaves/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async reviewLeave(leaveId: string, status: LeaveStatus, adminComment: string, reviewerName: string) {
    try {
      const res = await fetch(`${API_BASE}/leaves/${leaveId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminComment, reviewerName })
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  // Payroll
  async getPayroll(employeeId?: string): Promise<PayrollRecord[] | null> {
    try {
      let url = `${API_BASE}/payroll`;
      if (employeeId) url += `?employeeId=${employeeId}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async updateSalaryStructure(employeeId: string, salaryStructure: SalaryStructure) {
    try {
      const res = await fetch(`${API_BASE}/payroll/salary-structure/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryStructure)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async runPayrollBatch(month: string, year: number) {
    try {
      const res = await fetch(`${API_BASE}/payroll/run-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year })
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  // Notifications
  async getNotifications(userId?: string): Promise<NotificationItem[] | null> {
    try {
      let url = `${API_BASE}/notifications`;
      if (userId) url += `?userId=${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async markNotificationRead(id: string) {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
    } catch {}
  },

  async markAllNotificationsRead(userId?: string) {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch {}
  }
};
