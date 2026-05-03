# Crave Bites Deployment Guide

This guide is for a simple student-project deployment flow.

## 1. Push to GitHub

Run these commands from the project root:

```powershell
git init
git add .
git commit -m "Initial Crave Bites MERN app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/crave-bites.git
git push -u origin main
```

## 2. Create MongoDB Atlas

1. Create a free cluster in MongoDB Atlas.
2. Create a database user.
3. Allow your deployment IP or use `0.0.0.0/0` for testing only.
4. Copy the connection string.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/cravebitesdb
```

## 3. Deploy Backend

Recommended: Render

Create a new Web Service for the `backend` folder and add:

- Build command: `npm install`
- Start command: `npm start`

Environment variables:

- `PORT=5001`
- `MONGODB_URI=your-atlas-connection-string`
- `CLIENT_URL=https://your-frontend-url.vercel.app`
- `TEAM_ACCOUNT_PASSWORD=CraveTeam@2026`
- `JWT_SECRET=your-production-secret`

## 4. Deploy Frontend

Recommended: Vercel

Create a new Vercel project for the `frontend` folder and add:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

## 5. Update CORS

Make sure the backend `CLIENT_URL` matches your deployed frontend URL exactly.

## 6. Final Check

After deployment, test:

- User signup and login
- Menu loading
- Checkout with promo code
- Order creation and status update
- Inventory and low-stock logic
- Feedback submission and average rating display

## Suggested Repository Layout

Keep everything in one repo:

```text
crave-bites/
  frontend/
  backend/
  shared/
  docs/
```

This is the easiest structure for your 5-member team project.
