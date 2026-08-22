import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number;
  extraHours: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  notes?: string;
}

const AttendanceSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    date: { type: String, required: true, index: true },
    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },
    workingHours: { type: Number, default: 0 },
    extraHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
      default: 'PRESENT'
    },
    notes: { type: String }
  },
  { timestamps: true }
);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const AttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
