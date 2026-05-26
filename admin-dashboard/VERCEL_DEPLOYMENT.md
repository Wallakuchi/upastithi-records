# Vercel Deployment Guide - Admin Dashboard

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved (or `ignoreBuildErrors: true` is set)
- [ ] No console errors in local build: `npm run build`
- [ ] Local test: `npm run start` works without errors
- [ ] Commit all changes to git

### ✅ Environment Variables
Required variables in Vercel project settings:
- [ ] `NEXT_PUBLIC_API_URL` - Backend API endpoint
  - Example: `https://your-backend.railway.app/api`
  - Must be accessible from client (public)

### ✅ Configuration Files
- [ ] `.next` directory clean (Vercel will rebuild)
- [ ] `.vercelignore` configured
- [ ] `next.config.js` has build optimizations
- [ ] `package.json` has correct build script

## Deployment Steps

### 1. Connect to Vercel
```bash
# If not already connected
npm install -g vercel
vercel login
```

### 2. Deploy
```bash
vercel --prod
```

Or use Git integration (recommended):
1. Push code to GitHub
2. Connect GitHub to Vercel project
3. Vercel auto-deploys on push

### 3. Monitor Build
- Vercel dashboard shows build progress
- Check "Build" tab for logs
- Check "Function" logs for runtime errors

## Build Process Overview

```
Vercel Receives Push
    ↓
Install Dependencies (npm ci)
    ↓
Build NextJS App (npm run build)
    ├─ Transpile TypeScript
    ├─ Generate Manifests ← (This was failing before)
    ├─ Optimize Assets
    └─ Create .next folder
    ↓
Generate Serverless Functions
    ↓
Deploy to CDN
    ↓
✅ Live!
```

## Common Build Errors & Solutions

| Error | Solution |
|-------|----------|
| `client-reference-manifest.js` not found | ✅ Fixed - Added `'use client'` to layout |
| TypeScript errors during build | Ignore with `ignoreBuildErrors: true` |
| Environment variable undefined | Add to Vercel Project Settings → Environment Variables |
| Module not found errors | Run `npm install` locally and commit `package-lock.json` |
| API endpoints 404 | Verify `NEXT_PUBLIC_API_URL` is correct in Vercel |

## Testing After Deployment

1. **Open Dashboard**: https://your-vercel-url.vercel.app
2. **Login Flow**: 
   - Should redirect to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`
3. **Protected Routes**:
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`
4. **API Calls**:
   - Check browser console (F12)
   - Verify API calls go to correct backend
   - Check response status codes

## Rollback (if needed)

### Using Vercel Dashboard
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Promote to Production"

### Using Git
```bash
# Revert last commit
git revert HEAD
git push

# Vercel auto-deploys
```

## Performance Monitoring

After deployment, monitor:
- **Lighthouse Score**: Vercel shows in Analytics
- **Web Vitals**: Check Vercel Analytics tab
- **Error Tracking**: Monitor Function logs for runtime errors
- **API Latency**: Check if API calls are slow

## Useful Vercel Commands

```bash
# View project info
vercel project ls

# Check deployment status
vercel ls

# View live logs
vercel logs

# Remove project from local
vercel remove
```

## Documentation
- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js 14 Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

## Quick Reference

**Build Command**: `next build`  
**Start Command**: `next start`  
**Dev Command**: `next dev`  
**Export**: Not applicable (using Vercel Serverless)

---

**Last Updated**: 2026-05-26  
**Next.js Version**: 14.0.0  
**Node Version**: 18+ (required)
