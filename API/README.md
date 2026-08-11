# Project Tracker API

Laravel REST API for the Client Project Tracker application.

## Requirements

| Tool     | Version  |
|----------|----------|
| PHP      | **8.4+** |
| Composer | 2.x      |
| MySQL    | 8.0      |

Laravel 13 uses Symfony 8.1, which requires PHP >= 8.4.1.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Testing

```bash
php artisan test
```

## API Routes

All project routes require `Authorization: Bearer {token}` header.

See the root [README](../README.md) for full API documentation.
