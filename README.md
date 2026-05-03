# Crave Bites

`Crave Bites` is a Colombo, Sri Lanka based fast-food order management system built with the MERN stack. The frontend is designed with a mobile-app-style experience using React, while the backend is powered by Express, Node.js, and MongoDB.

## Stack

- MongoDB
- Express.js
- React + Vite
- Node.js

## Core Business Modules

1. Promotion and Offer Management
2. Order Management
3. User Management and Admin Dashboard
4. Inventory Management
5. Menu Management
6. Feedback and Rating Management

## Special Features

- Automatic discount application using promo codes at checkout
- Real-time style order status tracking with refresh-based live updates
- Quick admin dashboard with daily overview cards
- Automatic stock deduction with low-stock warning support
- Availability auto-hide for unavailable menu items
- Average rating display for menu items

## Project Structure

```text
frontend/                   React frontend
frontend/src/features/      Feature-based UI modules
mobile/                     React Native + Expo app scaffold
backend/                    Express + MongoDB backend
backend/src/controllers/    Request handlers by business module
backend/src/models/         MongoDB models
backend/src/routes/         API routes
shared/                     Shared constants and future shared schemas
docs/                       Team ownership, API notes, DB design, deployment guide
extracted/                  Legacy reference project
```

## Team Ownership

Use this file for the main folder split:

- [docs/team-module-map.md](C:\Users\sanus\Documents\New project\docs\team-module-map.md)

## Setup

1. Create `backend/.env` from `backend/.env.example`.
2. Install root dependencies with `npm install`.
3. Install app dependencies with `npm run install:all`.
4. Start both apps with `npm run dev`.
5. Open `http://localhost:5173`.

Mobile app:

1. Set `EXPO_PUBLIC_API_URL` to your hosted backend URL.
2. Run `npm run dev:mobile`.

## Environment

Example server environment:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/cravebitesdb
CLIENT_URL=http://localhost:5173
TEAM_ACCOUNT_PASSWORD=CraveTeam@2026
```

## Deployment Guide

Deployment steps for GitHub, Vercel, Render, and MongoDB Atlas are here:

- [docs/deployment-guide.md](C:\Users\sanus\Documents\New project\docs\deployment-guide.md)

## Existing Documentation

- [docs/api.md](C:\Users\sanus\Documents\New project\docs\api.md)
- [docs/database-design.md](C:\Users\sanus\Documents\New project\docs\database-design.md)

## Notes

- The backend structure for all modules is already scaffolded.
- The current web frontend lives inside [frontend](C:\Users\sanus\Documents\New%20project\frontend).
- The new mobile app scaffold lives inside [mobile](C:\Users\sanus\Documents\New%20project\mobile).
