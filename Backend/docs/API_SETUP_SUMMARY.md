# Plant Lab Laboratory - API Backend Setup

## Summary

This Laravel project has been successfully converted to a **pure API backend** for connecting to a separate frontend application.

## What Was Removed

All frontend-related files and dependencies have been removed:

### Directories Deleted
- `/frontend` - React frontend application
- `/node_modules` - Node.js packages
- `/resources/css` - Frontend CSS files
- `/resources/js` - Frontend JavaScript files
- `/resources/views` - Blade templates
- `/public/build` - Vite build output

### Files Deleted
- `package.json` - Node.js dependencies
- `package-lock.json` / `bun.lockb` - Package lock files
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `components.json` - Component configuration
- `boost.json` - Laravel Boost configuration
- `.prettierrc` / `.prettierignore` - Prettier configuration
- `.npmrc` - NPM configuration
- `app/Http/Middleware/HandleInertiaRequests.php` - Inertia middleware
- `config/inertia.php` - Inertia configuration

### Composer Packages Removed
- `inertiajs/inertia-laravel` - Inertia.js Laravel adapter
- `laravel/wayfinder` - Frontend routing helper
- `laravel/boost` - Frontend development tools
- `laravel/mcp` - Model Context Protocol
- `laravel/roster` - Team management

## Database Issues Fixed

### Migration Order Problem
The migration files had timestamp conflicts causing foreign key errors:
- **Problem**: `plant_species` and `plant_varieties` had the same timestamp `2026_02_25_041255`
- **Solution**: Renamed migrations to enforce proper order:
  - `2026_02_25_041255_0_create_plant_species_table.php` (runs first)
  - `2026_02_25_041255_1_create_plant_varieties_table.php` (runs second)

### Database Connection
- **Database**: PostgreSQL
- **Host**: 127.0.0.1
- **Port**: 5432
- **Database Name**: plant_lap_laboratory

All migrations now run successfully in the correct order:
1. cache table
2. users table
3. plant_species table
4. plant_varieties table
5. chemicals table
6. equipment table
7. plant_samples table
8. plant_stocks table
9. transactions table
10. borrow_records table
11. personal_access_tokens table
12. sessions table (added for database session storage)

## API Routes Available

### Plant Species Endpoints
```
GET     /api/plant-species              - List all plant species (with pagination and search)
POST    /api/plant-species              - Create a new plant species
GET     /api/plant-species/{id}         - Get a specific plant species
PUT     /api/plant-species/{id}         - Update a plant species
PATCH   /api/plant-species/{id}         - Partially update a plant species
DELETE  /api/plant-species/{id}         - Delete a plant species
```

### Example API Call
```bash
# Get all plant species
curl -X GET http://127.0.0.1:8000/api/plant-species \
  -H "Accept: application/json"

# Search plant species
curl -X GET "http://127.0.0.1:8000/api/plant-species?search=tomato" \
  -H "Accept: application/json"

# Create a new plant species
curl -X POST http://127.0.0.1:8000/api/plant-species \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Tomato",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "annual"
  }'
```

## Running the Project

### Start the Server
```bash
php artisan serve
```
Server runs on: `http://127.0.0.1:8000`

### Test the API
A test script is included to verify the API is working:
```bash
./test-api.sh
```

This will test:
- Server connectivity
- GET all plant species
- POST create new species
- GET specific species
- PUT update species
- Search functionality

### Reset Database and Run Migrations
```bash
php artisan migrate:fresh
```

### Run with Queue and Logs (Development)
```bash
composer dev
```

## Connecting a Frontend

This API backend is now ready to connect to any frontend framework:
- React
- Vue
- Angular
- Svelte
- Mobile apps (React Native, Flutter, etc.)

### CORS Configuration
Make sure to configure CORS in `config/cors.php` to allow requests from your frontend domain.

### Authentication
The project uses Laravel Sanctum for API authentication. You can:
1. Use token-based authentication for SPAs
2. Use session-based authentication if frontend is on same domain
3. Issue API tokens for mobile apps

### API Base URL
When connecting from frontend, use:
```
http://127.0.0.1:8000/api
```

## Project Structure

```
Plant-Lap-Laboratory/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── PlantSpeciesController.php
│   │   ├── Requests/
│   │   │   └── Species/
│   │   │       ├── StorePlantSpeciesRequest.php
│   │   │       └── UpdatePlantSpeciesRequest.php
│   │   └── Resources/
│   │       └── PlantSpeciesResource.php
│   ├── Models/
│   │   ├── PlantSpecies.php
│   │   ├── PlantVariety.php
│   │   ├── PlantSample.php
│   │   ├── PlantStock.php
│   │   ├── Chemical.php
│   │   ├── Equipment.php
│   │   ├── Transaction.php
│   │   └── BorrowRecord.php
│   └── Enums/
│       └── PlantGrowthType.php
├── database/
│   ├── migrations/
│   └── factories/
├── routes/
│   ├── api.php
│   └── web.php
└── config/
```

## Next Steps

1. **Add More API Endpoints**: Create controllers for other models (PlantVariety, PlantSample, etc.)
2. **Set Up Authentication**: Configure Sanctum for your frontend
3. **Configure CORS**: Update allowed origins for your frontend URL
4. **Add API Documentation**: Consider using Laravel's API resources or Swagger/OpenAPI
5. **Set Up Testing**: Write API tests using Pest/PHPUnit

## Status

✅ Frontend completely removed
✅ Database migrations fixed and working
✅ PostgreSQL connection established
✅ API routes configured
✅ PlantSpecies CRUD endpoints working
✅ Project ready for frontend integration

## Contact

For issues or questions, check the Laravel documentation:
- https://laravel.com/docs/12.x
- https://laravel.com/docs/12.x/sanctum (for authentication)
- https://laravel.com/docs/12.x/eloquent-resources (for API resources)

