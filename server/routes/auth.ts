import { Router, Request, Response } from 'express';
import { EmployeeModel } from '../models/Employee';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const employee = await EmployeeModel.findOne({ email: email.toLowerCase() });
    if (!employee) {
      return res.status(401).json({ success: false, message: 'User not found with this email' });
    }

    res.json({
      success: true,
      user: employee,
      token: `dayflow-token-${employee.employeeId}-${Date.now()}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { employeeId, name, email, role, department } = req.body;

    if (!employeeId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Employee ID, Name, and Email are required' });
    }

    const existingEmail = await EmployeeModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const existingId = await EmployeeModel.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'Employee ID is already registered' });
    }

    const newEmployee = new EmployeeModel({
      employeeId: employeeId.toUpperCase(),
      name,
      email: email.toLowerCase(),
      role: role || 'EMPLOYEE',
      department: department || 'Engineering',
      designation: role === 'ADMIN_HR' ? 'HR Specialist' : 'Associate Engineer',
      isEmailVerified: false,
      avatar: role === 'ADMIN_HR'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250'
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      user: newEmployee,
      token: `dayflow-token-${newEmployee.employeeId}-${Date.now()}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify email
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const emp = await EmployeeModel.findOneAndUpdate(
      { $or: [{ employeeId }, { _id: employeeId }] },
      { isEmailVerified: true },
      { new: true }
    );
    if (!emp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, user: emp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
