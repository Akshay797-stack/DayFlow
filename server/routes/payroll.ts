import { Router, Request, Response } from 'express';
import { PayrollModel } from '../models/Payroll';
import { EmployeeModel } from '../models/Employee';
import { NotificationModel } from '../models/Notification';

const router = Router();

// GET all payroll records
router.get('/', async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year } = req.query;
    const filter: any = {};
    if (employeeId) filter.employeeId = employeeId;
    if (month) filter.month = month;
    if (year) filter.year = Number(year);

    const records = await PayrollModel.find(filter).sort({ year: -1, createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update salary structure
router.put('/salary-structure/:employeeId', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const salaryStructure = req.body;

    const emp = await EmployeeModel.findOneAndUpdate(
      { $or: [{ employeeId }, { _id: employeeId }] },
      { $set: { salaryStructure } },
      { new: true }
    );

    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: emp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Run monthly payroll batch
router.post('/run-batch', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.body;
    const employees = await EmployeeModel.find();
    const createdPayrolls = [];

    for (const emp of employees) {
      const exists = await PayrollModel.findOne({
        employeeId: emp.employeeId,
        month,
        year
      });

      if (!exists) {
        const sal = emp.salaryStructure;
        const gross = sal.baseSalary + sal.hra + sal.conveyance + sal.specialAllowance + sal.bonus;
        const deductions = sal.providentFund + sal.professionalTax;
        const net = gross - deductions;

        const record = new PayrollModel({
          employeeId: emp.employeeId,
          employeeName: emp.name,
          month,
          year,
          basic: sal.baseSalary,
          hra: sal.hra,
          allowances: sal.conveyance + sal.specialAllowance,
          bonus: sal.bonus,
          grossSalary: gross,
          pf: sal.providentFund,
          tax: sal.professionalTax,
          totalDeductions: deductions,
          netPay: net,
          status: 'PAID',
          paymentDate: `${year}-${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-28`
        });

        await record.save();
        createdPayrolls.push(record);
      }
    }

    if (createdPayrolls.length > 0) {
      await NotificationModel.create({
        userId: 'ALL',
        title: 'Monthly Salary Processed',
        message: `Payroll for ${month} ${year} has been processed and payslips are available for download.`,
        type: 'payroll',
        link: '/payroll'
      });
    }

    const allPayrolls = await PayrollModel.find().sort({ year: -1, createdAt: -1 });
    res.json({ success: true, count: createdPayrolls.length, data: allPayrolls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
