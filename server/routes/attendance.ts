import { Router, Request, Response } from 'express';
import { AttendanceModel } from '../models/Attendance';

const router = Router();

// GET all attendance records
router.get('/', async (req: Request, res: Response) => {
  try {
    const { employeeId, date } = req.query;
    const filter: any = {};
    if (employeeId) filter.employeeId = employeeId;
    if (date) filter.date = date;

    const records = await AttendanceModel.find(filter).sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Punch In
router.post('/punch-in', async (req: Request, res: Response) => {
  try {
    const { employeeId, employeeName } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let record = await AttendanceModel.findOne({ employeeId, date: today });
    if (record) {
      record.checkIn = nowTime;
      record.status = 'PRESENT';
      await record.save();
    } else {
      record = new AttendanceModel({
        employeeId,
        employeeName,
        date: today,
        checkIn: nowTime,
        checkOut: null,
        workingHours: 0,
        status: 'PRESENT'
      });
      await record.save();
    }

    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Punch Out
router.post('/punch-out', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record = await AttendanceModel.findOne({ employeeId, date: today });
    if (!record) {
      return res.status(404).json({ success: false, message: 'No punch-in found for today' });
    }

    record.checkOut = nowTime;

    if (record.checkIn) {
      try {
        const parseTime = (timeStr: string) => {
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          return hours + minutes / 60;
        };
        const inHrs = parseTime(record.checkIn);
        const outHrs = parseTime(nowTime);
        record.workingHours = Math.max(0.5, Number((outHrs - inHrs).toFixed(2)));
        if (record.workingHours < 5) {
          record.status = 'HALF_DAY';
        }
      } catch {
        record.workingHours = 8.0;
      }
    }

    await record.save();
    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
