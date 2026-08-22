import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'Dayflow HRMS REST API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Seed data reference for backend
let employees = [
  {
    id: 'emp-001',
    employeeId: 'EMP-0001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.com',
    role: 'ADMIN_HR',
    designation: 'VP of People & Culture',
    department: 'Human Resources'
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-1002',
    name: 'Alex Morgan',
    email: 'employee@dayflow.com',
    role: 'EMPLOYEE',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering'
  }
];

// Routes
app.get('/api/employees', (_req: Request, res: Response) => {
  res.json({ success: true, data: employees });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = employees.find(e => e.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({
    success: true,
    user,
    token: `dayflow-jwt-${user.id}-${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dayflow HRMS Backend Server running on http://localhost:${PORT}`);
});
