# Client Project Tracker

A full-stack application for digital agencies to track client projects, monitor progress, and manage priorities.

## Architecture

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React + TypeScript + Vite + Tailwind CSS |
| Backend   | Laravel 13 + Sanctum    |
| Database  | MySQL 8                 |
| DevOps    | Docker Compose          |

## Project Structure

```
assesments/
├── API/              # Laravel REST API backend
├── frontend/         # React SPA frontend
├── docker-compose.yml
└── README.md
```

## Features

- **CRUD** — Create, read, update, and delete projects
- **Search** — Search by client name, project name, or description
- **Filters** — Filter by status and priority
- **Sorting** — Sort by any column (client, project, status, priority, dates)
- **Authentication** — Token-based auth via Laravel Sanctum
- **Validation** — Server-side validation with meaningful error messages
- **Unit Tests** — 22 PHPUnit tests covering API, auth, and validation

## Quick Start (Docker)

```bash
docker compose up --build
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000    |
| API      | http://localhost:8000    |
| MySQL    | localhost:3306           |

**Demo credentials:** `demo@agency.com` / `password`

## Local Development

### Backend

```bash
cd API
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API runs at http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at http://localhost:5173.

### Run Tests

```bash
cd API
php artisan test
```

## API Endpoints

### Authentication

| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| POST   | `/api/register` | Register new user |
| POST   | `/api/login`    | Login             |
| POST   | `/api/logout`   | Logout (auth)     |
| GET    | `/api/me`       | Current user      |

### Projects (requires auth)

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/projects`     | List all projects        |
| GET    | `/api/projects/:id` | Get single project       |
| POST   | `/api/projects`     | Create project           |
| PUT    | `/api/projects/:id` | Update project           |
| DELETE | `/api/projects/:id` | Delete project           |

**Query parameters for GET /api/projects:**

- `search` — Search client name, project name, description
- `status` — Filter by status
- `priority` — Filter by priority
- `sort_by` — Column to sort by
- `sort_dir` — `asc` or `desc`

## Deployment

### Backend (any PHP host)

1. Set environment variables from `API/.env.example`
2. Run `composer install --no-dev --optimize-autoloader`
3. Run `php artisan migrate --force`
4. Point web server to `API/public`

### Frontend (any static host)

1. Set `VITE_API_URL` to your production API URL
2. Run `npm run build`
3. Deploy the `dist/` folder

### Docker Production

```bash
docker compose -f docker-compose.yml up -d --build
```

## Validation Rules

- Client Name — required
- Project Name — required
- Status — must be: Planning, In Progress, On Hold, Completed
- Priority — must be: Low, Medium, High
- Due Date — cannot be earlier than Start Date
