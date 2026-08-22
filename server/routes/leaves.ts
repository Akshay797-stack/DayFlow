import { Router, Request, Response } from 'express';
import { LeaveModel } from '../models/Leave';
import { EmployeeModel } from '../models/Employee';
import { AttendanceModel } from '../models/Attendance';
import { NotificationModel } from '../models/Notification';

const router = Router();

// GET all leaves
router.get('/', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.query;
    const filter: any = {};
    if (employeeId) filter.employeeId = employeeId;

    const leaves = await LeaveModel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply for leave
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { employeeId, employeeName, employeeAvatar, department, leaveType, startDate, endDate, totalDays, reason } = req.body;

    const newLeave = new LeaveModel({
      employeeId,
      employeeName,
      employeeAvatar,
      department,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0]
    });

    await newLeave.save();

    // Create notification for HR
    const notif = new NotificationModel({
      userId: 'ALL',
      title: 'New Leave Request',
      message: `${employeeName} applied for ${totalDays} day(s) of ${leaveType} leave.`,
      type: 'leave',
      link: '/leaves'
    });
    await notif.save();

    res.status(201).json({ success: true, data: newLeave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Review leave (Approve/Reject)
router.put('/:id/review', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminComment, reviewerName } = req.body;

    const leave = await LeaveModel.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    leave.adminComment = adminComment;
    leave.reviewedBy = reviewerName || 'HR';
    leave.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    await leave.save();

    // If approved, deduct leave balance & create attendance placeholder
    if (status === 'APPROVED') {
      const emp = await EmployeeModel.findOne({ employeeId: leave.employeeId });
      if (emp) {
        const typeKey = leave.leaveType.toLowerCase() as 'paid' | 'sick' | 'casual';
        if (emp.leaveBalance && (emp.leaveBalance as any)[typeKey]) {
          (emp.leaveBalance as any)[typeKey].used += leave.totalDays;
          (emp.leaveBalance as any)[typeKey].remaining = Math.max(0, (emp.leaveBalance as any)[typeKey].total - (emp.leaveBalance as any)[typeKey].used);
          await emp.save();
        }
      }

      await AttendanceModel.create({
        employeeId: leave.employeeId,
        employeeName: leave.employeeName,
        date: leave.startDate,
        checkIn: null,
        checkOut: null,
        workingHours: 0,
        status: 'LEAVE',
        notes: `${leave.leaveType} Leave: ${leave.reason}`
      });
    }

    // Send notification to employee
    await NotificationModel.create({
      userId: leave.employeeId,
      title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your ${leave.leaveType} leave application (${leave.startDate} to ${leave.endDate}) was ${status.toLowerCase()}${adminComment ? `: "${adminComment}"` : '.'}`,
      type: status === 'APPROVED' ? 'success' : 'warning',
      link: '/leaves'
    });

    res.json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
