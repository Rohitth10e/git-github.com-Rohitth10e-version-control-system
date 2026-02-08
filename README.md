# Version Control

GitHub-style web app: repositories, issues, and auth. Backend (Express, MongoDB, Socket.IO) + frontend (React, Vite).

## Stack

- **Backend:** Node, Express 5, MongoDB (Mongoose), JWT auth, Socket.IO, yargs CLI (init / add / commit / push / pull / revert). Optional S3 for push/pull.
- **Frontend:** React 19, Vite 7, React Router. Auth via `localStorage` (userId + token); protected routes redirect to `/auth` when unauthenticated.

## Prerequisites

- Node 18+
- MongoDB (local or Atlas)

## Backend

**Env** (e.g. `backend/.env`):

- `MONGO_URI` – MongoDB connection string (required)
- `SECRET_KEY` – JWT signing secret (required for login/register and protected routes)
- `PORT` – optional; default `3000`

**Run**

```bash
cd backend
npm install
node index.js
```

Server: `http://localhost:3000`. Health: `GET /` → "Server is healthy". API prefix: `/api/v1`.

**CLI** (when running as Node app, yargs is loaded but HTTP server still starts):

- `init` – init `.repo` (commits, staging, config)
- `add <file>` – stage file
- `commit <message>` – commit staged
- `push` / `pull` – S3 sync (depends on config)
- `revert <commitID>` – revert to commit

**Tests**

```bash
cd backend
npm test
```

Jest + supertest. DB tests run only when `MONGO_URI` is set and reachable; otherwise they skip (no timeout). CI: see `.github/workflows/backend_git.yml` (runs on push to `master`).

## Frontend

**Run**

```bash
cd frontend
npm install
npm run dev
```

Dev server: `http://localhost:5173`. Expects API at `http://localhost:3000` (hardcoded in auth, dashboard, repo, issues, profile).

**Scripts**

- `npm run dev` – Vite dev server
- `npm run build` – production build → `dist/`
- `npm run preview` – serve `dist/` locally
- `npm run lint` – ESLint

**Routes**

| Path | Page | Auth |
|------|------|------|
| `/` | Dashboard (your repos, suggested repos, search) | required |
| `/auth` | Login | — |
| `/signup` | Register | — |
| `/profile` | User profile (repos, heat map) | required |
| `/create` | Create repository (name, description, visibility) | required |
| `/repo/:repoId/issues` | List/create/toggle issues for a repo | required for create/toggle |

Auth: login/signup call backend; token and userId stored in `localStorage`. `AuthContext` + route effect enforce redirect to `/auth` when not logged in.

## API (backend)

Base: `http://localhost:3000/api/v1`. Protected routes need header: `Authorization: Bearer <token>`.

**Users** (no auth unless noted)

- `POST /users/register` – body: `email`, `username`, `password`
- `POST /users/login` – body: `email`, `password` → returns `token`, `user`
- `GET /users/profile/:id` – profile by user id
- `GET /users/allusers` – list users
- `PUT /users/profile/update/:id` – auth – update profile
- `DELETE /users/delete/:id` – auth – delete user

**Repos**

- `GET /repo/getall` – all repos (public)
- `GET /repo/:id` – repo by id
- `GET /repo/name/:name` – repo by name
- `GET /repo/user/:id` – auth – repos owned by user
- `POST /repo/create` – auth – body: `owner`, `name`; optional: `description`, `visibility`, `content`, `issues`
- `PUT /repo/update/:id` – auth
- `PATCH /repo/toggle/:id` – auth – toggle visibility
- `DELETE /repo/delete/:id` – auth

**Issues**

- `POST /issue/create` – auth – body: `title`, `description`, `repository` (repo id)
- `GET /issue/repo/:repoId` – auth – issues for repo
- `GET /issue/:id` – auth – issue by id
- `PUT /issue/update/:id` – auth
- `PATCH /issue/status/:id` – auth – cycle status: open → in progress → closed
- `DELETE /issue/delete/:id` – auth

## Repo layout

```
backend/          – Express app, routes, controllers, models, auth, CLI, tests
frontend/         – Vite + React app, components (auth, dashboard, repo, user)
.github/workflows – Backend CI (npm test on push to master)
```
