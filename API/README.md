# Project Tracker API

Laravel REST API for the Client Project Tracker application.

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
