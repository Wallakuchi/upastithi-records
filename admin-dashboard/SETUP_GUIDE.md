# 📊 Admin Dashboard - Setup & Status

## ✅ Project Overview

**Type:** Next.js 14 (React Admin Dashboard)  
**Framework:** Next.js with TypeScript  
**Styling:** Tailwind CSS + Radix UI  
**State Management:** React hooks  
**HTTP Client:** Axios

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages (login, register)
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── api/             # API routes (if any)
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Quick Start

### 1. Create Environment Configuration

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# App Information
NEXT_PUBLIC_APP_NAME=Upastithi Records
NEXT_PUBLIC_APP_TAGLINE=Attendance & Leave Management System
```

### 2. Install Dependencies

```bash
cd admin-dashboard
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Access at: **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
npm start
```

## 📋 Available Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🔑 Key Features (Based on Structure)

- ✅ **Authentication** - Login/Register pages
- ✅ **Dashboard** - Protected admin dashboard
- ✅ **API Integration** - Axios configured for backend
- ✅ **Responsive UI** - Tailwind CSS + Radix UI components
- ✅ **Type Safety** - Full TypeScript support

## 🧪 Test the Dashboard

Once running at `http://localhost:3000`:

1. Check if pages load without errors
2. Verify Tailwind CSS is applied
3. Test navigation between pages
4. Check browser console for any errors

## ⚙️ Configuration Files

### `next.config.js`
Next.js configuration - check for API routes, redirects, etc.

### `tsconfig.json`
TypeScript configuration with path aliases

### `tailwind.config.ts`
Tailwind CSS theme customization

### `postcss.config.mjs`
CSS processing configuration

## 📚 Dependencies

**Core:**
- next@14.0.0 - React framework
- react@18.2.0 - UI library
- typescript@5.3.0 - Type safety

**UI Components:**
- @radix-ui/react-slot - Primitive components
- lucide-react - Icon library

**Styling:**
- tailwindcss@3.3.0 - Utility-first CSS
- tailwind-merge@2.2.0 - Merge Tailwind classes
- class-variance-authority - Component variants

**HTTP:**
- axios@1.6.0 - API requests

## 🔗 Integration with Backend

The dashboard connects to backend via:
- **Base URL:** `http://localhost:5000` (from .env)
- **Authentication:** JWT tokens (stored in localStorage)
- **CORS:** Configured in backend

Example API call:
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🚨 Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: Backend connection failed
- Verify backend is running on http://localhost:5000
- Check `.env.local` has correct API_BASE_URL
- Check CORS is enabled in backend

### Issue: Styles not loading
```bash
# Rebuild Tailwind
npm run dev -- --reset
```

### Issue: Module not found
```bash
# Clean and reinstall
rm -r node_modules package-lock.json
npm install
```

## 📝 Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| NEXT_PUBLIC_API_BASE_URL | Yes | http://localhost:5000 |
| NEXT_PUBLIC_APP_NAME | No | Upastithi Records |
| NEXT_PUBLIC_APP_TAGLINE | No | Attendance Management |

## 🔐 Security Notes

- ✓ Uses HTTPS in production
- ✓ JWT tokens for authentication
- ✓ Credentials stored securely (httpOnly cookies recommended)
- ✓ CORS configured for specific origins
- ✓ Input validation on all forms

## 📞 Next Steps

1. ✅ Create `.env.local` with API_BASE_URL
2. ✅ Run `npm install`
3. ✅ Start with `npm run dev`
4. ✅ Open http://localhost:3000
5. ✅ Check console for errors
6. ✅ Test login/authentication flow

## 🎯 Typical Pages Structure

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page (if available)
- `/dashboard` - Main dashboard (protected)
- `/dashboard/employees` - Employee management
- `/dashboard/attendance` - Attendance records
- `/dashboard/leave` - Leave management
- `/dashboard/settings` - Settings (if available)

---

**Ready to start the admin dashboard!** 🎉
