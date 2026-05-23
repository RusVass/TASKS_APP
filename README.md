# Todo App

A full-stack Todo application with categories, built with React + Express + SQLite.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, React Hook Form, Axios, SCSS Modules |
| Backend | Node.js, Express.js, TypeScript, Zod |
| Database | SQLite (via `better-sqlite3`) |

## Project Structure

```
todo-app/
├── frontend/   React + Vite app
└── backend/    Express API
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
