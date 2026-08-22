import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (role: UserRole) => void;
  signup: (data: {
    employeeId: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    department?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  verifyEmail: () => void;
  updateCurrentUserProfile: (updates: Partial<Employee>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('dayflow_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to HR Admin demo on first load for showcase
    const employees = StorageService.getEmployees();
    return employees[0] || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_current_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dayflow_current_user_v1');
    }
  }, [currentUser]);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; message?: string }> => {
    const employees = StorageService.getEmployees();
    const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, message: 'Invalid credentials. User not found in Dayflow directory.' };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const loginAsDemo = (role: UserRole) => {
    const employees = StorageService.getEmployees();
    if (role === 'ADMIN_HR') {
      const admin = employees.find(e => e.role === 'ADMIN_HR') || employees[0];
      setCurrentUser(admin);
    } else {
      const emp = employees.find(e => e.role === 'EMPLOYEE') || employees[1];
      setCurrentUser(emp);
    }
  };

  const signup = async (data: {
    employeeId: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    department?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const employees = StorageService.getEmployees();

    if (employees.some(e => e.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    if (employees.some(e => e.employeeId.toUpperCase() === data.employeeId.toUpperCase())) {
      return { success: false, message: 'Employee ID is already registered.' };
    }

    const defaultAvatar = data.role === 'ADMIN_HR' 
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80';

    const newEmp: Employee = {
      id: 'emp-' + Date.now(),
      employeeId: data.employeeId.toUpperCase(),
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar || defaultAvatar,
      phone: '+1 (555) 000-0000',
      address: '100 Innovation Way, Suite 500',
      designation: data.role === 'ADMIN_HR' ? 'HR Specialist' : 'Associate Engineer',
      department: data.department || (data.role === 'ADMIN_HR' ? 'Human Resources' : 'Engineering'),
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-Time',
      managerName: 'Sarah Jenkins',
      isEmailVerified: false,
      salaryStructure: {
        baseSalary: 7500,
        hra: 2200,
        conveyance: 400,
        specialAllowance: 700,
        providentFund: 900,
        professionalTax: 200,
        bonus: 500,
        currency: 'USD'
      },
      documents: [],
      leaveBalance: {
        paid: { total: 18, used: 0, remaining: 18 },
        sick: { total: 8, used: 0, remaining: 8 },
        casual: { total: 6, used: 0, remaining: 6 },
        unpaid: { used: 0 }
      }
    };

    StorageService.addEmployee(newEmp);
    setCurrentUser(newEmp);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dayflow_current_user_v1');
  };

  const verifyEmail = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, isEmailVerified: true };
    StorageService.updateEmployee(currentUser.id, updated);
    setCurrentUser(updated);
  };

  const updateCurrentUserProfile = (updates: Partial<Employee>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    StorageService.updateEmployee(currentUser.id, updated);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'ADMIN_HR',
        login,
        loginAsDemo,
        signup,
        logout,
        verifyEmail,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
