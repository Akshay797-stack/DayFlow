import { Router, Request, Response } from 'express';
import { EmployeeModel } from '../models/Employee';

const router = Router();

// GET all employees
router.get('/', async (_req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single employee by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findOne({
      $or: [{ _id: id }, { employeeId: id }]
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update employee
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employee = await EmployeeModel.findOneAndUpdate(
      { $or: [{ _id: id }, { employeeId: id }] },
      { $set: updates },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add document to vault
router.post('/:id/documents', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, size, fileUrl } = req.body;

    const newDoc = {
      id: 'doc-' + Date.now(),
      name,
      type: type || 'Document',
      size: size || '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl
    };

    const employee = await EmployeeModel.findOneAndUpdate(
      { $or: [{ _id: id }, { employeeId: id }] },
      { $push: { documents: newDoc } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee, newDoc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
