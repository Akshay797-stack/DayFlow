import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection';

// Route Imports
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leaves';
import payrollRoutes from './routes/payroll';
import notificationRoutes from './routes/notifications';
import analyticsRoutes from './routes/analytics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'Dayflow HRMS Production API Server',
    database: 'MongoDB (dayflow_hrms)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Connect to MongoDB and start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Dayflow HRMS Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Connected to MongoDB: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow_hrms'}`);
  });
}

startServer();

export default app;
