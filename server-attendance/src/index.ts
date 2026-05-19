import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import employeeRoutes from './routes/employee.routes';
import settingRoutes from './routes/settings.routes';
import { errorHandler, catchAsync } from './middleware/error.handler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', environment: NODE_ENV, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/office-settings', settingRoutes)

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
});

export default app;
