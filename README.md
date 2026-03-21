# Plant Lab Inventory

Full-stack plant laboratory inventory and operations platform.

## Overview

This repository contains:

- Backend API in Laravel (`Backend/`)
- Frontend app in React + Vite (`frontend/`)
- Docker setup for local containerized development (`Dockerfile`, `docker-compose.yml`, `docker/`)

The system supports inventory management, laboratory workflows, business operations, reporting, and role-based access control.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Auth/Security: Laravel Sanctum, JWT support
- Testing: Pest / PHPUnit (backend), Vitest (frontend)

## Repository Structure

```text
.
├── Backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   └── docs/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── docs/
│   └── package.json
├── docker/
├── Dockerfile
└── docker-compose.yml
```

## Quick Start (Local)

### 1) Backend

```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend API base URL:

```text
http://127.0.0.1:8000/api
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Docker (Optional)

From repository root:

```bash
docker compose up --build
```

Use this when you want a containerized environment instead of running backend/frontend directly on host.

## Common Development Commands

### Backend

```bash
cd Backend
php artisan serve
php artisan migrate
php artisan test
composer test
composer lint
./test-api.sh
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run test
```

## Configuration Notes

- Configure backend database credentials in `Backend/.env`.
- Keep backend CORS settings aligned with frontend origin in `Backend/config/cors.php`.
- For local split-host development, run backend and frontend on separate ports and verify auth/cookie settings.

## Documentation

- Backend docs: `Backend/docs/`
- Frontend docs: `frontend/docs/`
- Backend quick reference: `Backend/docs/README.md`

## License

MIT
