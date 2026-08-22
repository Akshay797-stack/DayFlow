import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  fileUrl?: string;
}

export interface ISalaryStructure {
  baseSalary: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  providentFund: number;
  professionalTax: number;
  bonus: number;
  currency: string;
}

export interface ILeaveBalance {
  paid: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  casual: { total: number; used: number; remaining: number };
  unpaid: { used: number };
}

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  role: 'ADMIN_HR' | 'EMPLOYEE';
  password?: string;
  avatar: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  managerName: string;
  isEmailVerified: boolean;
  bio?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  salaryStructure: ISalaryStructure;
  documents: IEmployeeDocument[];
  leaveBalance: ILeaveBalance;
}

const EmployeeSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['ADMIN_HR', 'EMPLOYEE'], default: 'EMPLOYEE' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250' },
    phone: { type: String, default: '+1 (555) 000-0000' },
    address: { type: String, default: 'San Francisco, CA' },
    designation: { type: String, default: 'Software Engineer' },
    department: { type: String, default: 'Engineering' },
    joiningDate: { type: String, default: '2023-01-01' },
    employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'], default: 'Full-Time' },
    managerName: { type: String, default: 'Sarah Jenkins' },
    isEmailVerified: { type: Boolean, default: true },
    bio: { type: String, default: '' },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    salaryStructure: {
      baseSalary: { type: Number, default: 8000 },
      hra: { type: Number, default: 2400 },
      conveyance: { type: Number, default: 500 },
      specialAllowance: { type: Number, default: 800 },
      providentFund: { type: Number, default: 960 },
      professionalTax: { type: Number, default: 200 },
      bonus: { type: Number, default: 500 },
      currency: { type: String, default: 'USD' }
    },
    documents: [
      {
        id: { type: String },
        name: { type: String },
        type: { type: String },
        uploadDate: { type: String },
        size: { type: String },
        fileUrl: { type: String }
      }
    ],
    leaveBalance: {
      paid: {
        total: { type: Number, default: 18 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 18 }
      },
      sick: {
        total: { type: Number, default: 8 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 8 }
      },
      casual: {
        total: { type: Number, default: 6 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 6 }
      },
      unpaid: {
        used: { type: Number, default: 0 }
      }
    }
  },
  { timestamps: true }
);

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
