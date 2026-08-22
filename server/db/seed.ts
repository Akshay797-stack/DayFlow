import { EmployeeModel } from '../models/Employee';
import { AttendanceModel } from '../models/Attendance';
import { LeaveModel } from '../models/Leave';
import { PayrollModel } from '../models/Payroll';
import { NotificationModel } from '../models/Notification';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVES, INITIAL_PAYROLL, INITIAL_NOTIFICATIONS } from '../../src/services/mockData';

export async function seedDatabaseIfEmpty() {
  try {
    const empCount = await EmployeeModel.countDocuments();
    if (empCount === 0) {
      console.log('🌱 Seeding MongoDB with initial Dayflow HRMS enterprise data...');

      await EmployeeModel.insertMany(INITIAL_EMPLOYEES);
      console.log(`✅ Seeded ${INITIAL_EMPLOYEES.length} Employees into MongoDB`);

      await AttendanceModel.insertMany(INITIAL_ATTENDANCE);
      console.log(`✅ Seeded ${INITIAL_ATTENDANCE.length} Attendance records into MongoDB`);

      await LeaveModel.insertMany(INITIAL_LEAVES);
      console.log(`✅ Seeded ${INITIAL_LEAVES.length} Leave requests into MongoDB`);

      await PayrollModel.insertMany(INITIAL_PAYROLL);
      console.log(`✅ Seeded ${INITIAL_PAYROLL.length} Payroll statements into MongoDB`);

      await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);
      console.log(`✅ Seeded ${INITIAL_NOTIFICATIONS.length} Notifications into MongoDB`);

      console.log('🎉 MongoDB Database seeding complete!');
    } else {
      console.log(`ℹ️ MongoDB already initialized (${empCount} employees in database).`);
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
}
