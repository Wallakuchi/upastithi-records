# Backend Server - Attendance Management System

This directory contains the backend API server for the Upastithi Records - Employee Attendance Management System.

## 📋 Overview

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Port**: 5000 (default)
- **Environment**: Node.js 18+

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

### 2. Setup

**Windows:**
```bash
.\setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**
```bash
npm install
npm run prisma:generate
```

### 3. Environment Configuration

Edit `.env` file with your settings:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/upastithi

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8081

# Office Location (Geofencing)
OFFICE_LATITUDE=28.553306
OFFICE_LONGITUDE=77.2047050
OFFICE_RADIUS=500
```

### 4. Database Setup

**Create database:**
```bash
psql -U postgres -c "CREATE DATABASE upastithi;"
```

**Run migrations:**
```bash
npm run prisma:migrate
```

### 5. Start Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
server-attendance/
├── BACKEND_ATTENDANCE_ROUTES.ts       # Attendance endpoints
├── BACKEND_ATTENDANCE_SERVICE.ts      # Attendance business logic
├── BACKEND_ATTENDANCE_VALIDATOR.ts    # Attendance validation schemas
├── BACKEND_AUTH_ROUTES.ts             # Auth endpoints (login, register, etc.)
├── BACKEND_AUTH_SERVICE.ts            # Auth business logic
├── BACKEND_AUTH_VALIDATOR.ts          # Auth validation schemas
├── BACKEND_AUTH_MIDDLEWARE.ts         # JWT verification middleware
├── BACKEND_EMPLOYEE_ROUTES.ts         # Employee management endpoints
├── BACKEND_LEAVE_ROUTES.ts            # Leave management endpoints
├── BACKEND_SETTINGS_ROUTES.ts         # Settings endpoints
├── BACKEND_JWT.ts                     # JWT utility functions
├── BACKEND_PASSWORD.ts                # Password hashing utilities
├── BACKEND_CLOUDINARY.ts              # Cloudinary image upload
├── BACKEND_GEODISTANCE.ts             # Geofencing calculations
├── BACKEND_ERROR_HANDLER.ts           # Global error handler
├── BACKEND_RESPONSE.ts                # Standardized API responses
├── BACKEND_TYPES.ts                   # TypeScript type definitions
├── BACKEND_SCHEMA.prisma              # Prisma database schema
├── backend_api_package.json           # Dependencies and scripts
├── .env                               # Environment variables
├── setup.bat                          # Windows setup script
├── setup.sh                           # Unix setup script
└── README.md                          # This file
```

## 🔑 Available Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Build TypeScript
npm start               # Run compiled JavaScript

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio UI

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

## 🔐 Authentication

### Login Endpoint
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "Password123!"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Protected Endpoints

All protected endpoints require:
```bash
Authorization: Bearer <accessToken>
```

## 📍 Core Features

### Attendance Management
- Check-in/Check-out with GPS location
- Photo capture during check-in
- Geofencing validation
- Attendance status tracking (Present, Absent, Late, Outside Office)

### Leave Management
- Submit leave requests
- Multiple leave types (Sick, Casual, Earned, Unpaid, Maternity)
- Leave approval workflow
- Leave balance tracking

### Employee Management
- Employee profiles
- Department and designation management
- Role-based access control (Admin, HR, Employee)

### Settings
- Office location configuration
- Working hours setup
- Allowed geofencing radius

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Documentation
Check `API_POSTMAN_GUIDE.md` for complete API documentation and Postman collection.

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Verify connection string
psql -U postgres -h localhost -d upastithi
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001

# Or kill process on port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### Prisma Client Not Found
```bash
npm run prisma:generate
```

### Migration Failed
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Attendance
- `POST /api/attendance/check-in` - Check-in
- `POST /api/attendance/check-out` - Check-out
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/history` - Attendance history

### Leave
- `POST /api/leave/request` - Submit leave request
- `GET /api/leave/requests` - Get leave requests
- `PUT /api/leave/requests/:id` - Update leave request
- `GET /api/leave/balance` - Get leave balance

### Employee
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Settings
- `GET /api/settings` - Get office settings
- `PUT /api/settings` - Update office settings

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for specific origins
- Rate limiting on sensitive endpoints
- Input validation with Zod
- Error handling with non-sensitive messages

## 📞 Support

For issues or questions, refer to:
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- [SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md)
- [TROUBLESHOOTING_GUIDE.md](../TROUBLESHOOTING_GUIDE.md)
- [DATABASE_SETUP.md](../DATABASE_SETUP.md)
