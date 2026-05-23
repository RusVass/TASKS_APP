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
├── frontend/          React + Vite app (deployed on Vercel)
├── backend/           Express API (runs locally)
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Deployment

| Layer | Hosting |
|---|---|
| Frontend | [Vercel](https://tasks-app-iota.vercel.app) |
| Backend | **Local only** — runs on your machine via Docker or Node.js |

The backend is not publicly hosted. SQLite is a local file database by design.  
To use the deployed frontend, start the backend locally — the frontend connects to `http://localhost:3001`.

---

## Running the backend with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

Backend starts at **http://localhost:3001**.  
SQLite data persists in a named Docker volume (`todo-data`) between restarts.

To stop:

```bash
docker compose down
```

To wipe data and start fresh:

```bash
docker compose down -v
```

---

## Running the backend without Docker

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3001**. SQLite file is created at `backend/todos.db`.

---

## Running the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**.

---

## Using the deployed frontend with a local backend

1. Start the backend (Docker or Node.js) — it must be on port 3001.
2. Open [https://tasks-app-iota.vercel.app](https://tasks-app-iota.vercel.app) in your browser.
3. The deployed frontend connects to `http://localhost:3001` automatically.

---

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
