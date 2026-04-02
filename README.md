# E-Commerce Store

This repository contains a small full-stack e-commerce project with:

- a React + Vite storefront in [`app`](./app)
- an admin dashboard in the same frontend app under `/admin`
- an Express + TypeScript API server in [`server`](./server)
- PostgreSQL persistence for users, products, blogs, reviews, refresh tokens, and orders

## Features

- Public storefront with products, blogs, and customer reviews
- Customer registration, login, session refresh, and account page
- Cart UI with checkout flow that creates real orders
- Admin authentication with role-based access (`admin`, `manager`, `staff`)
- Admin CRUD for products, blogs, and reviews
- Admin views for customers and orders
- Dashboard metrics based on live data

## Project Structure

```text
E-Commerce-store/
|-- app/       # React frontend (storefront + admin UI)
|-- server/    # Express API + auth + PostgreSQL queries
|-- README.md
```

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Auth: JWT access/refresh tokens

## Prerequisites

- Node.js 18+ recommended
- npm
- PostgreSQL database

## How To Run

### 1. Install dependencies

Install dependencies separately for the frontend and backend:

```powershell
cd app
npm install
```

```powershell
cd server
npm install
```

### 2. Create the database schema

Run the SQL in [`server/sql/schema.sql`](./server/sql/schema.sql) against your PostgreSQL database.

### 3. Configure environment variables

Create a `.env` file inside [`server`](./server) and add the variables listed below.

Optionally, create a `.env` file inside [`app`](./app) if you want to override the frontend API URL.

### 4. Start the backend

```powershell
cd server
npm run dev
```

The API server runs on `http://localhost:4000` by default.

### 5. Start the frontend

```powershell
cd app
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

### `server/.env`

Required:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Optional:

```env
PORT=4000
API_ORIGIN=http://localhost:5173
ENABLE_ADMIN_BOOTSTRAP=false
```

Admin bootstrap variables:

Only needed when `ENABLE_ADMIN_BOOTSTRAP=true`.

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me
MANAGER_EMAIL=manager@example.com
MANAGER_PASSWORD=change_me
STAFF_EMAIL=staff@example.com
STAFF_PASSWORD=change_me
```

### `app/.env`

Optional:

```env
VITE_API_URL=http://localhost:4000
```

If `VITE_API_URL` is not provided, the frontend uses `http://localhost:4000`.

## Available Scripts

### Frontend (`app`)

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend (`server`)

```powershell
npm run dev
npm run build
npm start
```

## Default URLs

- Storefront: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`
- API health check: `http://localhost:4000/health`

## Authentication Notes

- Customer sessions use access and refresh tokens
- Admin users are role-based
- Admin seed users are not created automatically unless `ENABLE_ADMIN_BOOTSTRAP=true`

## Build Status

Verified locally:

- `server`: `npm run build`
- `app`: `npx tsc -b`
- `app`: `npm run build`

## Known Notes

- The current ESLint setup still reports `react-refresh/only-export-components` issues in some shared UI/context files
- The frontend production bundle is large and would benefit from code-splitting, especially for the admin area
