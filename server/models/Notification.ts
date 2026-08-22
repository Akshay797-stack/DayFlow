import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'leave' | 'attendance' | 'payroll';
  timestamp: string;
  read: boolean;
  link?: string;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'leave', 'attendance', 'payroll'],
      default: 'info'
    },
    timestamp: { type: String, default: 'Just now' },
    read: { type: Boolean, default: false },
    link: { type: String }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
