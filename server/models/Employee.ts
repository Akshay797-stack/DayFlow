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
  monthlyWage?: number;
  yearlyWage?: number;
  workingDaysPerWeek?: number;
  workingHoursPerDay?: number;
  breakTimeHours?: number;
  baseSalary: number;
  hra: number;
  conveyance?: number;
  specialAllowance?: number;
  standardAllowance?: number;
  performanceBonus?: number;
  leaveTravelAllowance?: number;
  fixedAllowance?: number;
  providentFund: number;
  employerPF?: number;
  professionalTax: number;
  bonus?: number;
  currency: string;
}

export interface IPrivateInfo {
  dateOfBirth?: string;
  residingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  uanNumber?: string;
}

export interface IEmployeeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
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
  about?: string;
  whatILoveAboutJob?: string;
  interestsAndHobbies?: string;
  skills?: string[];
  certifications?: IEmployeeCertification[];
  privateInfo?: IPrivateInfo;
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
    about: { type: String, default: '' },
    whatILoveAboutJob: { type: String, default: '' },
    interestsAndHobbies: { type: String, default: '' },
    skills: { type: [String], default: ['React', 'TypeScript', 'Node.js', 'System Architecture'] },
    certifications: [
      {
        id: { type: String },
        name: { type: String },
        issuer: { type: String },
        date: { type: String }
      }
    ],
    privateInfo: {
      dateOfBirth: { type: String, default: '1995-06-15' },
      residingAddress: { type: String, default: 'San Francisco, CA' },
      nationality: { type: String, default: 'American' },
      personalEmail: { type: String, default: '' },
      gender: { type: String, default: 'Male' },
      maritalStatus: { type: String, default: 'Single' },
      dateOfJoining: { type: String, default: '2023-01-01' },
      bankName: { type: String, default: 'Silicon Valley National Bank' },
      accountNumber: { type: String, default: '987654321098' },
      ifscCode: { type: String, default: 'SVNB0004521' },
      panNumber: { type: String, default: 'ABCDE1234F' },
      uanNumber: { type: String, default: '100987654321' }
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    salaryStructure: {
      monthlyWage: { type: Number, default: 50000 },
      yearlyWage: { type: Number, default: 600000 },
      workingDaysPerWeek: { type: Number, default: 5 },
      workingHoursPerDay: { type: Number, default: 8 },
      breakTimeHours: { type: Number, default: 1 },
      baseSalary: { type: Number, default: 25000 },
      hra: { type: Number, default: 12500 },
      conveyance: { type: Number, default: 500 },
      specialAllowance: { type: Number, default: 800 },
      standardAllowance: { type: Number, default: 4167 },
      performanceBonus: { type: Number, default: 2082.5 },
      leaveTravelAllowance: { type: Number, default: 2082.5 },
      fixedAllowance: { type: Number, default: 4168 },
      providentFund: { type: Number, default: 3000 },
      employerPF: { type: Number, default: 3000 },
      professionalTax: { type: Number, default: 200 },
      bonus: { type: Number, default: 500 },
      currency: { type: String, default: 'INR' }
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
