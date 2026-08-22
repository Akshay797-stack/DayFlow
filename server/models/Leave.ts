import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: 'PAID' | 'SICK' | 'UNPAID' | 'CASUAL';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedOn: string;
  adminComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

const LeaveSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    employeeAvatar: { type: String, default: '' },
    department: { type: String, default: 'Engineering' },
    leaveType: {
      type: String,
      enum: ['PAID', 'SICK', 'UNPAID', 'CASUAL'],
      required: true
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    appliedOn: { type: String, default: () => new Date().toISOString().split('T')[0] },
    adminComment: { type: String, default: '' },
    reviewedBy: { type: String, default: '' },
    reviewedAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const LeaveModel = mongoose.model<ILeave>('Leave', LeaveSchema);
