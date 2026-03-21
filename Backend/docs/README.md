# Plant Lab Laboratory - API Backend

A Laravel-based REST API for managing plant laboratory data including species, varieties, samples, stocks, chemicals, equipment, and transactions.

## Quick Start

### Prerequisites
- PHP 8.2+
- PostgreSQL
- Composer

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your database in `.env`:
   ```
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=plant_lap_laboratory
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the server:
   ```bash
   php artisan serve
   ```

The API will be available at `http://127.0.0.1:8000/api`

## Testing the API

Run the included test script:
```bash
./test-api.sh
```

Or test manually:
```bash
# Get all plant species
curl http://127.0.0.1:8000/api/plant-species

# Create a new plant species
curl -X POST http://127.0.0.1:8000/api/plant-species \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Tomato",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "annual"
  }'
```

## API Endpoints

### Plant Species
- `GET /api/plant-species` - List all species (paginated, searchable)
- `POST /api/plant-species` - Create new species
- `GET /api/plant-species/{id}` - Get specific species
- `PUT /api/plant-species/{id}` - Update species
- `DELETE /api/plant-species/{id}` - Delete species

**Query Parameters:**
- `search` - Search by common name, scientific name, or Khmer name
- `page` - Pagination page number (default: 1)

## Database Structure

### Tables
- `plant_species` - Plant species information (top level)
- `plant_varieties` - Varieties under each species (middle level)
- `plant_samples` - Individual samples (lowest level)
- `plant_stocks` - Inventory tracking
- `chemicals` - Chemical inventory
- `equipment` - Equipment inventory
- `transactions` - Transaction history
- `borrow_records` - Equipment/material borrowing records
- `users` - User accounts
- `sessions` - Session storage

## Data Models

### PlantSpecies
```json
{
  "common_name": "string (required)",
  "khmer_name": "string (optional)",
  "scientific_name": "string (required, unique)",
  "family": "string (optional)",
  "growth_type": "enum: annual|perennial|biennial (optional)",
  "native_region": "string (optional)",
  "propagation_method": "string (optional)",
  "description": "text (optional)",
  "image_url": "string (optional)"
}
```

## Connecting a Frontend

This API uses Laravel Sanctum for authentication. To connect a frontend:

### React.js on localhost:8081 ✅ CONFIGURED

The backend is **ready** to connect with React running on `http://localhost:8081`.

**Quick Start:**
```bash
# 1. Install axios in your React project
npm install axios

# 2. Copy the API service code from QUICK_START_REACT.md

# 3. Start both servers
# Terminal 1 (Backend):
php artisan serve

# Terminal 2 (Frontend):
npm start  # or npm run dev
```

📚 **See detailed guides:**
- [QUICK_START_REACT.md](QUICK_START_REACT.md) - Copy-paste ready code
- [REACT_INTEGRATION_GUIDE.md](REACT_INTEGRATION_GUIDE.md) - Complete documentation

### General Frontend Setup

1. **Configure CORS** in `config/cors.php`:
   ```php
   'allowed_origins' => ['http://localhost:8081'], // Your frontend URL
   ```

2. **For SPA (same domain):**
   - Use cookie-based authentication
   - Call `/sanctum/csrf-cookie` before making authenticated requests

3. **For separate domain/mobile:**
   - Issue API tokens using Sanctum
   - Include token in `Authorization: Bearer {token}` header

## Development

### Code Style
```bash
composer lint          # Format code
composer test:lint     # Check code style
```

### Testing
```bash
composer test          # Run all tests
php artisan test       # Run PHPUnit tests
```

### Database
```bash
php artisan migrate:fresh         # Reset database
php artisan migrate:fresh --seed  # Reset with seeders
php artisan db:seed               # Run seeders only
```

## Documentation

For detailed setup information, see:
- [API_SETUP_SUMMARY.md](API_SETUP_SUMMARY.md) - Complete setup guide
- [Laravel Documentation](https://laravel.com/docs/12.x)

## License

MIT License

## Support

For issues or questions, please check the documentation or contact the development team.

