# Submission

## Setup Instructions

### Prerequisites

| Tool           | Version   |
|----------------|-----------|
| PHP            | **8.4+**  |
| Composer       | 2.x       |
| Node.js        | 18+ (20 recommended) |
| npm            | 9+        |
| MySQL          | 8.0 (for local non-Docker setup) |
| Docker + Compose | 24+ / 2.x (recommended) |

### Option A — Docker (recommended)

```bash
docker compose up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| API      | http://localhost:8000 |
| MySQL    | localhost:3306        |

Demo credentials: `demo@agency.com` / `password`

### Option B — Local development

**Backend**

```bash
cd API
composer install
cp .env.example .env
php artisan key:generate
# Configure MySQL (or keep sqlite for quick local use) in .env
php artisan migrate --seed
php artisan serve
```

API: http://localhost:8000

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173

### Running tests

```bash
cd API
php artisan test
```

---

## Features Implemented

### Core CRUD
- Create, read, update, and delete projects via REST API and UI

### Project fields
- Client Name, Project Name, Description, Status, Priority, Start Date, Due Date

### Status values
- Planning, In Progress, On Hold, Completed

### Priority values
- Low, Medium, High

### Validation
- Client Name and Project Name required
- Status and Priority must be valid enum values
- Due Date cannot be earlier than Start Date
- Meaningful validation error responses

### Search, filter, and sort
- Search by client name, project name, or description
- Filter by status and priority
- Sort by client, project, status, priority, start/due date

### Authentication
- User registration and login
- Token-based auth (Laravel Sanctum)
- Protected project routes (users only see their own projects)

### Frontend
- React + TypeScript SPA
- Project list with stats, toolbar, and sortable table
- Create / edit modals with inline error display
- Login and register screens

### Quality & delivery
- Service + repository architecture on the backend
- Feature and unit tests (PHPUnit)
- Docker Compose setup (API, frontend, MySQL)
- Deployment notes (`README.md`, `render.yaml`)

---

## Assumptions Made

1. **Domain model** — The provided scenario describes a **Client Project Tracker** (projects for a digital agency). The sample assessment email mentions “Task Management”; this submission implements **projects** as the core entity, matching the detailed project model, status, and priority requirements.

2. **Stack** — Assumed the technical examples in the requirements are preferred: React (frontend), Laravel (backend), MySQL (database).

3. **Authentication** — Assumed projects should be private per user. Auth is required for all project endpoints so managers only manage their own data. A demo seeded user is included for reviewers.

4. **API style** — Assumed a JSON REST API with Bearer tokens (Sanctum) is appropriate for a React SPA, rather than session/cookie-only auth.

5. **Soft deletes / history** — Assumed hard delete is acceptable; no audit trail or soft deletes were required.

6. **Pagination** — Assumed a simple full list is enough for this scope; search/filter/sort cover larger datasets for the assessment size. Pagination can be added later.

7. **Roles / multi-tenancy** — Assumed a single user type (project manager). No admin roles, teams, or agency-level multi-tenancy.

8. **PHP version** — Laravel 13 / Symfony 8.1 in the lockfile require **PHP 8.4+**. Docker and docs target PHP 8.4 accordingly.

9. **Timebox** — Prioritized code quality, architecture, validation, tests, and documentation over extra features (notifications, comments, file uploads, etc.).

---

## AI Tools Used

- **Cursor** (AI coding assistant) was used to help scaffold the application, refactor structure, write tests/docs, and iterate on Docker/setup issues.
- Final architecture choices, validation rules, and feature scope follow the assessment requirements and were reviewed for consistency with the submission criteria.
