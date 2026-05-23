# Todo App

A full-stack Todo application with categories, built with React + Express + SQLite.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Hook Form, Axios, SCSS Modules |
| Backend | Node.js, Express.js, TypeScript, Zod |
| Database | SQLite (via `better-sqlite3`) |

## Project Structure

```
todo-app/
├── frontend/   React + Vite app (deployed on Vercel)
└── backend/    Express API (runs locally)
```

## Getting Started

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3001**

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /categories | List all categories |
| GET | /todos?category=Work | List todos (optional filter) |
| POST | /todos | Create a new todo |
| PATCH | /todos/:id | Mark todo complete/incomplete |
| DELETE | /todos/:id | Delete a todo |

## Business Rules

- Maximum **5 active tasks** per category (enforced on the backend)
- Completing a task shows a 5-second Undo window, then removes it from the list
- Deleting a task is deferred by 5 seconds — clicking Undo cancels the deletion

## Deployment

### Frontend — Vercel

The frontend is configured for Vercel deployment via [`vercel.json`](./vercel.json) at the project root.

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Backend — local only

The backend is **not deployed**. It uses SQLite and is intended to run locally on port 3001.  
The deployed frontend connects to `http://localhost:3001` by default (see `frontend/.env.example`).

To point the deployed frontend to a different backend, set the `VITE_API_URL` environment variable in the Vercel project dashboard before deploying.
