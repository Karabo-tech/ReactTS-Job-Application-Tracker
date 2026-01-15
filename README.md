# Job Application Tracker

A simple React + TypeScript application for tracking job applications (company, role, status, date applied, and additional details). The project uses a Vite frontend and a lightweight JSON Server backend (`db.json`).

## Features

- User authentication (stored locally)
- View all job applications for the logged-in user
- Search by company or role
- Filter by status (Applied / Interviewed / Rejected)
- Sort by application date
- Create new job entries
- Edit existing jobs
- View job details
- Delete jobs
- Toast notifications for key actions

## Tech Stack

- **Frontend:** React, TypeScript, React Router
- **Build tooling:** Vite
- **HTTP:** Axios
- **Backend (dev):** JSON Server (`db.json`)
- **Styling:** CSS Modules + shared theme tokens (CSS variables)

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Getting Started

1) Install dependencies:

```bash
npm i
```

2) Start the app (frontend + backend together):

```bash
npm run dev
```

This runs:
- JSON Server on `http://localhost:3001`
- Vite dev server (usually) on `http://localhost:5173`

## Useful Scripts

- `npm run dev` – starts JSON Server + Vite in parallel
- `npm run server` – starts JSON Server only (`db.json` on port `3001`)
- `npm run vite` – starts Vite only
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint

> Note: `npm test` is currently wired to `react-scripts` (Create React App) but this project is Vite-based. Prefer `npm run lint` and `npm run build` for validation.

## Application Routes

- `/` – Landing page
- `/login` – Login
- `/register` – Register
- `/home` – Job list (protected)
- `/job/new` – Create a job (protected)
- `/job/:id` – Job details (protected)
- `/job/:id?edit=true` – Edit an existing job (protected)

## Backend (JSON Server)

The backend is provided by JSON Server and reads/writes from `db.json`.

### Endpoints

- `GET /jobs?userId=<id>` – list jobs for a specific user
- `GET /jobs/<id>` – get a job by id
- `POST /jobs` – create a job
- `PUT /jobs/<id>` – update a job
- `DELETE /jobs/<id>` – delete a job

- `POST /users` – used by the UI for login/register in this demo setup

## Project Structure (high level)

```
src/
  components/        # Navbar, Toast, ProtectedRoute
  contexts/          # Auth context/provider
  pages/             # Landing, Login, Register, Home, JobPage, NotFound
  index.css          # Global styles + theme tokens
  main.tsx           # App bootstrap
  App.tsx            # Routes
public/
  ...
db.json              # JSON Server database
```

## Notes / Troubleshooting

- If you see errors like “Unknown word” coming from a `.module.css` file, it usually indicates invalid CSS content (for example literal `\\n` sequences). Ensure the file contains real newlines.
- If JSON Server is already using port 3001, stop the other process or change the port in `package.json` and the Axios URLs.


