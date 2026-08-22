import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem, LeaveType, LeaveStatus, SalaryStructure, EmployeeDocument } from '../types';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface HRDataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  activeSelectedEmployee: Employee | null;
  setActiveSelectedEmployee: (emp: Employee | null) => void;
  // Employee methods
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  addEmployeeDocument: (employeeId: string, doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  // Attendance methods
  todayAttendance: AttendanceRecord | undefined;
  hasPunchedInToday: boolean;
  hasPunchedOutToday: boolean;
  punchIn: () => void;
  punchOut: () => void;
  // Leave methods
  applyLeave: (leaveType: LeaveType, startDate: string, endDate: string, totalDays: number, reason: string) => void;
  reviewLeave: (leaveId: string, status: LeaveStatus, comment: string) => void;
  // Payroll methods
  updateSalaryStructure: (employeeId: string, salary: SalaryStructure) => void;
  runMonthlyPayroll: (month: string, year: number) => void;
  // Notification methods
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // System
  refreshAll: () => void;
  resetDemoData: () => void;
  toastMessage: { message: string; type: 'success' | 'error' | 'info' } | null;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  isMongoDBConnected: boolean;
}

const HRDataContext = createContext<HRDataContextType | undefined>(undefined);

export const HRDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUserProfile } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeSelectedEmployee, setActiveSelectedEmployee] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isMongoDBConnected, setIsMongoDBConnected] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const refreshAll = useCallback(async () => {
    // 1. Load from local storage for instant render
    const localEmps = StorageService.getEmployees();
    const localAtt = StorageService.getAttendance();
    const localLvs = StorageService.getLeaves();
    const localPay = StorageService.getPayroll();
    const localNotifs = StorageService.getNotifications(currentUser?.employeeId);

    // Helper to keep currentUser custom photo and profile in sync with employee directory
    const syncWithCurrentUser = (list: Employee[]): Employee[] => {
      if (!currentUser) return list;
      const copy = [...list];
      const idx = copy.findIndex(e => 
        (e.id && currentUser.id && e.id === currentUser.id) ||
        (e.employeeId && currentUser.employeeId && e.employeeId.toUpperCase() === currentUser.employeeId.toUpperCase()) ||
        (e.email && currentUser.email && e.email.toLowerCase() === currentUser.email.toLowerCase())
      );
      if (idx !== -1) {
        copy[idx] = { 
          ...copy[idx], 
          ...currentUser, 
          avatar: currentUser.avatar || copy[idx].avatar,
          name: currentUser.name || copy[idx].name,
          designation: currentUser.designation || copy[idx].designation
        };
      } else {
        copy.unshift(currentUser);
      }
      return copy;
    };

    const mergedLocalEmps = syncWithCurrentUser(localEmps);
    setEmployees(mergedLocalEmps);
    setAttendance(localAtt);
    setLeaves(localLvs);
    setPayroll(localPay);
    setNotifications(localNotifs);

    // 2. Fetch live data from MongoDB API server
    try {
      const [apiEmps, apiAtt, apiLvs, apiPay, apiNotifs] = await Promise.all([
        ApiService.getEmployees(),
        ApiService.getAttendance(),
        ApiService.getLeaves(),
        ApiService.getPayroll(),
        ApiService.getNotifications(currentUser?.employeeId)
      ]);

      if (apiEmps && apiEmps.length > 0) {
        const mergedApiEmps = syncWithCurrentUser(apiEmps);
        setEmployees(mergedApiEmps);
        StorageService.saveEmployees(mergedApiEmps);
        setIsMongoDBConnected(true);
      }
      if (apiAtt && apiAtt.length > 0) {
        setAttendance(apiAtt);
        StorageService.saveAttendance(apiAtt);
      }
      if (apiLvs && apiLvs.length > 0) {
        setLeaves(apiLvs);
        StorageService.saveLeaves(apiLvs);
      }
      if (apiPay && apiPay.length > 0) {
        setPayroll(apiPay);
        StorageService.savePayroll(apiPay);
      }
      if (apiNotifs && apiNotifs.length > 0) {
        setNotifications(apiNotifs);
        StorageService.saveNotifications(apiNotifs);
      }
    } catch {
      // Keep local data if backend is offline
    }

    if (currentUser) {
      const refreshedUser = mergedLocalEmps.find(e => 
        e.id === currentUser.id || 
        e.employeeId === currentUser.employeeId || 
        e.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (refreshedUser) {
        setActiveSelectedEmployee(prev => prev ? (mergedLocalEmps.find(e => e.id === prev.id) || refreshedUser) : refreshedUser);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Today's attendance for logged in user
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(
    a => a.employeeId === currentUser?.employeeId && a.date === todayStr
  );
  const hasPunchedInToday = !!todayAttendance?.checkIn;
  const hasPunchedOutToday = !!todayAttendance?.checkOut;

  // Punch In
  const punchIn = async () => {
    if (!currentUser) return;
    const record = StorageService.punchIn(currentUser);
    refreshAll();
    showToast(`Checked in at ${record.checkIn}! Have a productive workday.`, 'success');

    // Async sync to MongoDB
    ApiService.punchIn(currentUser.employeeId, currentUser.name);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  // Punch Out
  const punchOut = async () => {
    if (!currentUser) return;
    const record = StorageService.punchOut(currentUser);
    refreshAll();
    if (record) {
      showToast(`Checked out at ${record.checkOut}. Total logged hours: ${record.workingHours}h.`, 'info');
    }

    // Async sync to MongoDB
    ApiService.punchOut(currentUser.employeeId);
  };

  // Employee update
  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const updated = StorageService.updateEmployee(id, updates);
    if (updated) {
      if (currentUser && (currentUser.id === id || currentUser.employeeId === id)) {
        updateCurrentUserProfile(updates);
      }
      refreshAll();
      showToast('Employee profile updated in MongoDB successfully.', 'success');
    }

    // Async sync to MongoDB
    ApiService.updateEmployee(id, updates);
  };

  const addEmployeeDocument = async (employeeId: string, doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const emp = StorageService.getEmployeeById(employeeId);
    if (!emp) return;

    const newDoc: EmployeeDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };

    const docs = [...(emp.documents || []), newDoc];
    StorageService.updateEmployee(emp.id, { documents: docs });
    refreshAll();
    showToast(`Document "${doc.name}" saved to MongoDB vault.`, 'success');

    // Async sync to MongoDB
    ApiService.addDocument(employeeId, doc);
  };

  // Apply Leave
  const applyLeave = async (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    totalDays: number,
    reason: string
  ) => {
    if (!currentUser) return;
    StorageService.applyLeave(currentUser, leaveType, startDate, endDate, totalDays, reason);
    refreshAll();
    showToast(`Leave request for ${totalDays} day(s) submitted to MongoDB for approval.`, 'success');

    // Async sync to MongoDB
    ApiService.applyLeave({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Review Leave
  const reviewLeave = async (leaveId: string, status: LeaveStatus, comment: string) => {
    if (!currentUser) return;
    StorageService.reviewLeave(leaveId, status, comment, currentUser.name);
    refreshAll();
    showToast(`Leave request ${status.toLowerCase()} in MongoDB successfully.`, status === 'APPROVED' ? 'success' : 'info');

    // Async sync to MongoDB
    ApiService.reviewLeave(leaveId, status, comment, currentUser.name);

    if (status === 'APPROVED') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Payroll structure update
  const updateSalaryStructure = async (employeeId: string, salary: SalaryStructure) => {
    StorageService.updateSalaryStructure(employeeId, salary);
    refreshAll();
    showToast('Salary structure updated in MongoDB successfully.', 'success');

    // Async sync to MongoDB
    ApiService.updateSalaryStructure(employeeId, salary);
  };

  // Monthly payroll run
  const runMonthlyPayroll = async (month: string, year: number) => {
    StorageService.runMonthlyPayrollBatch(month, year);
    refreshAll();
    showToast(`Monthly payroll for ${month} ${year} processed and recorded in MongoDB!`, 'success');

    // Async sync to MongoDB
    ApiService.runPayrollBatch(month, year);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Notification management
  const markNotificationAsRead = (id: string) => {
    StorageService.markNotificationRead(id);
    ApiService.markNotificationRead(id);
    refreshAll();
  };

  const markAllNotificationsAsRead = () => {
    StorageService.markAllNotificationsRead(currentUser?.employeeId);
    ApiService.markAllNotificationsRead(currentUser?.employeeId);
    refreshAll();
    showToast('All notifications marked as read.', 'info');
  };

  const resetDemoData = () => {
    StorageService.resetToDemo();
    refreshAll();
    showToast('Database reset to default demo records.', 'info');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <HRDataContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        payroll,
        notifications,
        unreadNotifsCount,
        activeSelectedEmployee,
        setActiveSelectedEmployee,
        updateEmployee,
        addEmployeeDocument,
        todayAttendance,
        hasPunchedInToday,
        hasPunchedOutToday,
        punchIn,
        punchOut,
        applyLeave,
        reviewLeave,
        updateSalaryStructure,
        runMonthlyPayroll,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshAll,
        resetDemoData,
        toastMessage,
        setToast: setToastMessage,
        isMongoDBConnected
      }}
    >
      {children}
    </HRDataContext.Provider>
  );
};

export const useHRData = () => {
  const context = useContext(HRDataContext);
  if (!context) {
    throw new Error('useHRData must be used within an HRDataProvider');
  }
  return context;
};
