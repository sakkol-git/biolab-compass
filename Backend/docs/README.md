# Plant Lab Inventory Backend

Laravel API backend for plant lab inventory, operations, and business workflows.

## What this backend provides

- Inventory domain: species, varieties, samples, stock, chemicals, equipment, maintenance, borrowing, and transactions.
- Business domain: clients, contracts, milestones, services, payments, and forecasting.
- Core domain: authentication, users/roles/permissions, activity logs, notifications, and settings.
- API-first architecture with modular routes, requests, resources, services, and policies.

## Stack

- Laravel 12
- PHP 8.2+
- PostgreSQL
- Laravel Sanctum + JWT support
- Pest / PHPUnit for tests

## Quick start

From the `Backend` directory:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API base URL:

```text
http://127.0.0.1:8000/api
```

## Environment notes

Set database credentials in `.env` before running migrations:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=plant_lab_inventory
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

If your frontend runs on a different host/port, update `config/cors.php` accordingly.

## Common commands

```bash
php artisan serve
php artisan migrate
php artisan migrate:fresh --seed
php artisan test
composer test
composer lint
```

## API smoke test

Use the included script:

```bash
./test-api.sh
```

## Project structure (high level)

- `app/Modules/Core`
- `app/Modules/Inventory`
- `app/Modules/Business`
- `routes/api.php`
- `database/migrations`
- `tests/Feature` and `tests/Unit`

## Documentation index

This folder contains detailed references, including:

- `API_SETUP_SUMMARY.md`
- `REACT_INTEGRATION_GUIDE.md`
- `QUICK_START_REACT.md`
- `POSTMAN_API_TESTING_GUIDE.md`
- `PROJECT_TECHNICAL_AUDIT.md`

## Frontend integration

The companion frontend lives in the workspace `frontend/` folder.

Typical local workflow:

- Run backend on `http://127.0.0.1:8000`
- Run frontend with Vite (default `http://localhost:5173` unless changed)
- Keep CORS + auth settings aligned with frontend origin

## License

MIT
