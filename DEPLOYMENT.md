# Deployment Details

This document describes how the project is deployed and structured in production.

## Architecture Overview

The project follows a backend-first architecture with a minimal frontend layer.

- Backend: Node.js + Express API deployed on AWS EC2
- Database: MongoDB Atlas
- Frontend: React (Vite) deployed on Vercel
- CI: GitHub Actions for automated testing

## Backend Deployment

The backend is deployed on an AWS EC2 instance running Amazon Linux.

Deployment steps:
1. Provisioned an EC2 instance (free-tier eligible)
2. Installed Node.js and project dependencies
3. Configured environment variables using a `.env` file
4. Connected the backend to MongoDB Atlas
5. Started and managed the application using PM2 to ensure persistence across restarts
6. Exposed REST APIs over a public IP address

The backend is responsible for authentication, repository management, issue tracking, and CLI integration.

## Frontend Deployment

The frontend is deployed on Vercel.

Deployment steps:
1. Connected the GitHub repository to Vercel
2. Configured the root directory to `frontend` (monorepo setup)
3. Added environment variables to reference the deployed backend API
4. Built and deployed the application using Vite

Live frontend URL:
https://git-github-com-rohitth10e-versi-git-f8afb8-rohitth10es-projects.vercel.app/
## Continuous Integration

GitHub Actions is used to run automated tests on every push:
- Executes Jest test suites
- Validates API routes and core backend functionality
- Prevents regressions before deployment

## Notes

- This project is primarily focused on backend and CLI functionality
- The frontend is intentionally minimal and serves as a demonstration layer
- Additional deployment improvements (reverse proxy, HTTPS, infrastructure as code) can be added in future iterations
