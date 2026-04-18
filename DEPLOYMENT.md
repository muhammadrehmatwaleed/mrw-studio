# Deployment Guide (Vercel: Backend + Frontend)

This repository should be deployed as two separate Vercel projects:
- Backend project with Root Directory = `server`
- Frontend project with Root Directory = `client`

## 1. Deploy Backend on Vercel

The backend is now configured for Vercel serverless using:
- `server/api/[...all].js`
- `server/vercel.json`

### Vercel project settings (Backend)
- Root Directory: `server`
- Build Command: leave default (Vercel installs dependencies automatically)
- Output Directory: leave empty

### Required backend environment variables (Vercel)
- `NODE_ENV=production`
- `MONGO_URI=...`
- `MONGO_DB_NAME=...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://your-frontend-domain.vercel.app`
- `CLIENT_URLS=https://your-frontend-domain.vercel.app,https://www.your-domain.com`
- `ALLOW_DEPLOY_PREVIEWS=false`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `STRIPE_SECRET_KEY=...`

If you want Vercel Preview URLs to pass CORS, set:
- `ALLOW_DEPLOY_PREVIEWS=true`

### Backend URL format
After deploy, backend API base URL is:
- `https://your-backend-project.vercel.app/api`

Health check:
- `https://your-backend-project.vercel.app/api/health`

### Seed data (optional for portfolio demo)
Run once from repo root:
- `npm run seed --prefix server`

## 2. Deploy Frontend on Vercel

### Vercel project settings (Frontend)
- Root Directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Required frontend environment variables (Vercel)
- `VITE_API_URL=https://your-backend-project.vercel.app/api`
- `VITE_STRIPE_PUBLISHABLE_KEY=...`

## 3. DNS / Domain Order

Recommended order:
1. Deploy backend first and copy its production URL.
2. Set frontend `VITE_API_URL` using backend `/api` URL.
3. Redeploy frontend.
4. Set backend `CLIENT_URL`/`CLIENT_URLS` to final frontend domain.

## 4. Final Publish Checklist

- Backend `api/health` endpoint responds successfully
- Frontend can list products and complete login without CORS errors
- Frontend `VITE_API_URL` points to backend `/api`
- Backend `CLIENT_URL` and `CLIENT_URLS` match frontend domain(s)
- Stripe checkout and Cloudinary upload work in production
- HTTPS enabled on both projects

## 5. Security Note

Before going live, rotate any keys that were exposed in local files/chat logs (especially Stripe, JWT, Cloudinary), then update them in Vercel Environment Variables.
