# Contributing

## Setup

1. Fork and clone the repo.
2. Backend: `cd backend`, `npm install`. Set `MONGO_URI` and `SECRET_KEY` in `.env`.
3. Frontend: `cd frontend`, `npm install`.
4. Run backend (`node index.js`) and frontend (`npm run dev`) as in [README](README.md).

## Workflow

1. Create a branch from `master` (e.g. `fix/auth-redirect`, `feat/issue-filters`).
2. Make changes. Run backend tests: `cd backend && npm test`.
3. Open a PR into `master`. Describe what changed and why.
4. Ensure CI passes (backend tests run on push).

## Code

- Backend: ESM (`import`/`export`), Node 18+.
- Frontend: React, Vite, existing patterns in `src/`.
- No new dependencies without reason.

## Tests

- Backend: add or update tests in `backend/tests/` for new or changed API behaviour.
- Tests that need the DB require `MONGO_URI`; otherwise they are skipped.
