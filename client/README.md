# MRW E-Commerce Client

Modern React + Vite storefront for the MRW e-commerce portfolio project.

## Demo Login Credentials

These demo accounts are seeded for portfolio walkthroughs:

- User login:
	- Email: user@example.com
	- Password: User123!
- Admin login:
	- Email: admin@example.com
	- Password: Admin123!

## Local Development

1. Install dependencies.
2. Start dev server.

```bash
npm install
npm run dev
```

## Environment Variable

Create a .env file in the client folder:

```dotenv
VITE_API_URL=https://your-api-domain.com/api
```

For local setup, you can use:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Deploy on Netlify

- Build command: npm run build
- Publish directory: dist
- Environment variable:
	- VITE_API_URL = https://your-backend-domain.com/api

## Deploy on Vercel

- Root Directory: client
- Framework preset: Vite
- Build command: npm run build
- Output directory: dist
- Environment variables:
	- VITE_API_URL = https://your-backend-project.vercel.app/api
	- VITE_STRIPE_PUBLISHABLE_KEY = your_stripe_publishable_key

## Important Notes For Portfolio Publish

- Deploy backend first (as a separate Vercel project with Root Directory = server), then set VITE_API_URL in frontend deployment.
- Run seed on backend database so demo credentials work.
- Do not use demo credentials for production businesses.
