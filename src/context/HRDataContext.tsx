import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem, LeaveType, LeaveStatus, SalaryStructure, EmployeeDocument } from '../types';
import { StorageService } from '../services/storage';
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

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const refreshAll = useCallback(() => {
    const emps = StorageService.getEmployees();
    const att = StorageService.getAttendance();
    const lvs = StorageService.getLeaves();
    const pay = StorageService.getPayroll();
    const notifs = StorageService.getNotifications(currentUser?.employeeId);

    setEmployees(emps);
    setAttendance(att);
    setLeaves(lvs);
    setPayroll(pay);
    setNotifications(notifs);

    if (currentUser) {
      const refreshedUser = emps.find(e => e.id === currentUser.id || e.employeeId === currentUser.employeeId);
      if (refreshedUser) {
        setActiveSelectedEmployee(prev => prev ? (emps.find(e => e.id === prev.id) || refreshedUser) : refreshedUser);
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
  const punchIn = () => {
    if (!currentUser) return;
    const record = StorageService.punchIn(currentUser);
    refreshAll();
    showToast(`Checked in at ${record.checkIn}! Have a productive workday.`, 'success');
    
    // Celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  // Punch Out
  const punchOut = () => {
    if (!currentUser) return;
    const record = StorageService.punchOut(currentUser);
    refreshAll();
    if (record) {
      showToast(`Checked out at ${record.checkOut}. Total logged hours: ${record.workingHours}h.`, 'info');
    }
  };

  // Employee update
  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const updated = StorageService.updateEmployee(id, updates);
    if (updated) {
      if (currentUser && (currentUser.id === id || currentUser.employeeId === id)) {
        updateCurrentUserProfile(updates);
      }
      refreshAll();
      showToast('Employee profile updated successfully.', 'success');
    }
  };

  const addEmployeeDocument = (employeeId: string, doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
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
    showToast(`Document "${doc.name}" uploaded successfully.`, 'success');
  };

  // Apply Leave
  const applyLeave = (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    totalDays: number,
    reason: string
  ) => {
    if (!currentUser) return;
    StorageService.applyLeave(currentUser, leaveType, startDate, endDate, totalDays, reason);
    refreshAll();
    showToast(`Leave request for ${totalDays} day(s) submitted for approval.`, 'success');
    
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Review Leave
  const reviewLeave = (leaveId: string, status: LeaveStatus, comment: string) => {
    if (!currentUser) return;
    StorageService.reviewLeave(leaveId, status, comment, currentUser.name);
    refreshAll();
    showToast(`Leave request ${status.toLowerCase()} successfully.`, status === 'APPROVED' ? 'success' : 'info');
    
    if (status === 'APPROVED') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Payroll structure update
  const updateSalaryStructure = (employeeId: string, salary: SalaryStructure) => {
    StorageService.updateSalaryStructure(employeeId, salary);
    refreshAll();
    showToast('Salary structure updated successfully.', 'success');
  };

  // Monthly payroll run
  const runMonthlyPayroll = (month: string, year: number) => {
    StorageService.runMonthlyPayrollBatch(month, year);
    refreshAll();
    showToast(`Monthly payroll for ${month} ${year} processed successfully!`, 'success');
    
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // Notification management
  const markNotificationAsRead = (id: string) => {
    StorageService.markNotificationRead(id);
    refreshAll();
  };

  const markAllNotificationsAsRead = () => {
    StorageService.markAllNotificationsRead(currentUser?.employeeId);
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
        setToast: setToastMessage
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
