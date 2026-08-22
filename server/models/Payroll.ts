import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  paidLeaveDays: number;
  unpaidDays: number;
  payableDays: number;
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  pf: number;
  tax: number;
  lopDeduction: number;
  totalDeductions: number;
  netPay: number;
  status: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentDate: string;
}

const PayrollSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    totalWorkingDays: { type: Number, default: 22 },
    presentDays: { type: Number, default: 20 },
    paidLeaveDays: { type: Number, default: 2 },
    unpaidDays: { type: Number, default: 0 },
    payableDays: { type: Number, default: 22 },
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    grossSalary: { type: Number, required: true },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    lopDeduction: { type: Number, default: 0 },
    totalDeductions: { type: Number, required: true },
    netPay: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PAID', 'PENDING', 'PROCESSING'],
      default: 'PAID'
    },
    paymentDate: { type: String, required: true }
  },
  { timestamps: true }
);

export const PayrollModel = mongoose.model<IPayroll>('Payroll', PayrollSchema);
