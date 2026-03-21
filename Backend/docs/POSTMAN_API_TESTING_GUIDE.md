# Postman API Testing Guide - Plant Lab Laboratory

Complete guide to testing your Plant Lab Laboratory API endpoints using Postman with REST methods.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [API Endpoints Overview](#api-endpoints-overview)
4. [Testing Each Endpoint](#testing-each-endpoint)
5. [Postman Collection Setup](#postman-collection-setup)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

### 1. Install Postman
- Download from: https://www.postman.com/downloads/
- Or use Postman Web: https://web.postman.com/

### 2. Start Your Laravel Server
```bash
cd /home/sakkol/Documents/Plant-Lap-Laboratory
php artisan serve
```
Your API will be available at: **http://127.0.0.1:8000**

### 3. Ensure Database is Running
Make sure PostgreSQL is running and your database migrations are complete:
```bash
php artisan migrate:fresh --seed
```

---

## Environment Setup

### Create Postman Environment

1. Click **Environments** in Postman (left sidebar)
2. Click **+** to create a new environment
3. Name it: **Plant Lab - Local**
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `base_url` | `http://127.0.0.1:8000` | `http://127.0.0.1:8000` |
| `api_url` | `{{base_url}}/api` | `http://127.0.0.1:8000/api` |

5. Click **Save**
6. Select this environment from the dropdown (top right)

---

## API Endpoints Overview

Your Laravel API uses RESTful conventions. The `apiResource` creates these routes:

| Method | URI | Action | Description |
|--------|-----|--------|-------------|
| **GET** | `/api/plant-species` | index | Get all plant species (paginated) |
| **POST** | `/api/plant-species` | store | Create a new plant species |
| **GET** | `/api/plant-species/{id}` | show | Get a specific plant species |
| **PUT/PATCH** | `/api/plant-species/{id}` | update | Update a plant species |
| **DELETE** | `/api/plant-species/{id}` | destroy | Delete a plant species |

---

## Testing Each Endpoint

### 1. GET - List All Plant Species

**Purpose:** Retrieve all plant species (paginated)

#### Setup in Postman:

1. **Create New Request**
   - Click **New** → **HTTP Request**
   - Name: `Get All Plant Species`

2. **Configure Request:**
   - **Method:** `GET`
   - **URL:** `{{api_url}}/plant-species`

3. **Headers:**
   ```
   Accept: application/json
   Content-Type: application/json
   ```

4. **Click Send**

#### Expected Response (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "common_name": "Tomato",
      "khmer_name": "ប៉េងប៉ោះ",
      "scientific_name": "Solanum lycopersicum",
      "family": "Solanaceae",
      "growth_type": "annual",
      "native_region": "South America",
      "propagation_method": "Seeds",
      "description": "A popular garden vegetable",
      "image_url": null,
      "created_at": "2026-02-28T10:30:00.000000Z",
      "updated_at": "2026-02-28T10:30:00.000000Z"
    }
  ],
  "links": {
    "first": "http://127.0.0.1:8000/api/plant-species?page=1",
    "last": "http://127.0.0.1:8000/api/plant-species?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 10,
    "to": 1,
    "total": 1
  }
}
```

#### Test with Search Parameter:
- **URL:** `{{api_url}}/plant-species?search=Tomato`

---

### 2. POST - Create New Plant Species

**Purpose:** Create a new plant species

#### Setup in Postman:

1. **Create New Request**
   - Name: `Create Plant Species`

2. **Configure Request:**
   - **Method:** `POST`
   - **URL:** `{{api_url}}/plant-species`

3. **Headers:**
   ```
   Accept: application/json
   Content-Type: application/json
   ```

4. **Body** (select **raw** and **JSON**):
   ```json
   {
     "common_name": "Sweet Pepper",
     "khmer_name": "ម្រេចផ្អែម",
     "scientific_name": "Capsicum annuum",
     "family": "Solanaceae",
     "growth_type": "annual",
     "native_region": "Central and South America",
     "propagation_method": "Seeds",
     "description": "Bell pepper or sweet pepper, widely cultivated vegetable",
     "image_url": "https://example.com/pepper.jpg"
   }
   ```

5. **Click Send**

#### Expected Response (201 Created):
```json
{
  "data": {
    "id": 2,
    "common_name": "Sweet Pepper",
    "khmer_name": "ម្រេចផ្អែម",
    "scientific_name": "Capsicum annuum",
    "family": "Solanaceae",
    "growth_type": "annual",
    "native_region": "Central and South America",
    "propagation_method": "Seeds",
    "description": "Bell pepper or sweet pepper, widely cultivated vegetable",
    "image_url": "https://example.com/pepper.jpg",
    "created_at": "2026-02-28T11:00:00.000000Z",
    "updated_at": "2026-02-28T11:00:00.000000Z"
  }
}
```

#### Validation Rules:
- `common_name`: **Required**, string, max 255 characters
- `khmer_name`: Optional, string, max 255 characters
- `scientific_name`: **Required**, string, max 255, **unique**
- `family`: Optional, string, max 255
- `growth_type`: **Required**, must be: `annual`, `perennial`, or `biennial`
- `native_region`: Optional, string, max 255
- `propagation_method`: Optional, string, max 255
- `description`: Optional, string (text)
- `image_url`: Optional, must be valid URL

#### Test Validation Errors:

Try sending invalid data:
```json
{
  "common_name": "",
  "scientific_name": "Solanum lycopersicum",
  "growth_type": "invalid_type"
}
```

Expected Response (422 Unprocessable Entity):
```json
{
  "message": "The common name field is required. (and 1 more error)",
  "errors": {
    "common_name": [
      "The common name field is required."
    ],
    "growth_type": [
      "The selected growth type is invalid."
    ]
  }
}
```

---

### 3. GET - Show Single Plant Species

**Purpose:** Retrieve a specific plant species by ID

#### Setup in Postman:

1. **Create New Request**
   - Name: `Get Single Plant Species`

2. **Configure Request:**
   - **Method:** `GET`
   - **URL:** `{{api_url}}/plant-species/1`
   
   *(Replace `1` with actual ID)*

3. **Headers:**
   ```
   Accept: application/json
   Content-Type: application/json
   ```

4. **Click Send**

#### Expected Response (200 OK):
```json
{
  "data": {
    "id": 1,
    "common_name": "Tomato",
    "khmer_name": "ប៉េងប៉ោះ",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "annual",
    "native_region": "South America",
    "propagation_method": "Seeds",
    "description": "A popular garden vegetable",
    "image_url": null,
    "created_at": "2026-02-28T10:30:00.000000Z",
    "updated_at": "2026-02-28T10:30:00.000000Z"
  }
}
```

#### Test Not Found:
- **URL:** `{{api_url}}/plant-species/9999`

Expected Response (404 Not Found):
```json
{
  "message": "No query results for model [App\\Models\\PlantSpecies] 9999"
}
```

---

### 4. PUT/PATCH - Update Plant Species

**Purpose:** Update an existing plant species

#### Setup in Postman:

1. **Create New Request**
   - Name: `Update Plant Species`

2. **Configure Request:**
   - **Method:** `PUT` or `PATCH`
   - **URL:** `{{api_url}}/plant-species/1`

3. **Headers:**
   ```
   Accept: application/json
   Content-Type: application/json
   ```

4. **Body** (select **raw** and **JSON**):
   ```json
   {
     "common_name": "Tomato - Updated",
     "khmer_name": "ប៉េងប៉ោះ",
     "scientific_name": "Solanum lycopersicum",
     "family": "Solanaceae",
     "growth_type": "perennial",
     "native_region": "South America - Andes Region",
     "propagation_method": "Seeds and Cuttings",
     "description": "A popular garden vegetable - Updated with more info",
     "image_url": "https://example.com/tomato-updated.jpg"
   }
   ```

5. **Click Send**

#### Expected Response (200 OK):
```json
{
  "data": {
    "id": 1,
    "common_name": "Tomato - Updated",
    "khmer_name": "ប៉េងប៉ោះ",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "perennial",
    "native_region": "South America - Andes Region",
    "propagation_method": "Seeds and Cuttings",
    "description": "A popular garden vegetable - Updated with more info",
    "image_url": "https://example.com/tomato-updated.jpg",
    "created_at": "2026-02-28T10:30:00.000000Z",
    "updated_at": "2026-02-28T11:30:00.000000Z"
  }
}
```

#### Note: Partial Updates with PATCH
You can send only the fields you want to update:
```json
{
  "common_name": "Tomato",
  "description": "Updated description only"
}
```

---

### 5. DELETE - Delete Plant Species

**Purpose:** Delete a plant species

#### Setup in Postman:

1. **Create New Request**
   - Name: `Delete Plant Species`

2. **Configure Request:**
   - **Method:** `DELETE`
   - **URL:** `{{api_url}}/plant-species/2`

3. **Headers:**
   ```
   Accept: application/json
   Content-Type: application/json
   ```

4. **Click Send**

#### Expected Response (200 OK):
```json
{
  "message": "Plant species deleted successfully"
}
```

#### Test Deleting Non-Existent Record:
- **URL:** `{{api_url}}/plant-species/9999`

Expected Response (404 Not Found):
```json
{
  "message": "No query results for model [App\\Models\\PlantSpecies] 9999"
}
```

---

## Postman Collection Setup

### Create a Complete Collection

1. **Create New Collection**
   - Click **Collections** → **+**
   - Name: `Plant Lab Laboratory API`

2. **Add Collection Variables**
   - Click on collection → **Variables** tab
   - Add:
     - `plant_species_id`: `1` (use this in URLs as `{{plant_species_id}}`)

3. **Organize Requests into Folders**
   ```
   Plant Lab Laboratory API/
   ├── Plant Species/
   │   ├── Get All Plant Species
   │   ├── Get Single Plant Species
   │   ├── Create Plant Species
   │   ├── Update Plant Species
   │   └── Delete Plant Species
   └── (Future endpoints...)
   ```

### Save Response Data as Variables (Advanced)

For the **Create Plant Species** request:

1. Go to **Tests** tab
2. Add this script to save the created ID:
   ```javascript
   if (pm.response.code === 200 || pm.response.code === 201) {
       const jsonData = pm.response.json();
       pm.collectionVariables.set("plant_species_id", jsonData.data.id);
   }
   ```

3. Now you can use `{{plant_species_id}}` in subsequent requests

---

## Common HTTP Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request format |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server error |

---

## Common Issues & Solutions

### Issue 1: Connection Refused
**Error:** `Could not send request`

**Solution:**
- Ensure Laravel server is running: `php artisan serve`
- Check URL is correct: `http://127.0.0.1:8000/api/plant-species`

### Issue 2: 404 Not Found
**Error:** `{"message": "Not Found"}`

**Solution:**
- Verify the endpoint URL is correct
- Check if the resource ID exists
- Ensure routes are defined: `php artisan route:list`

### Issue 3: 500 Internal Server Error
**Error:** `{"message": "Server Error"}`

**Solution:**
- Check Laravel logs: `storage/logs/laravel.log`
- Ensure database is running and migrations are complete
- Run: `php artisan migrate:fresh --seed`

### Issue 4: 422 Validation Error
**Error:** `{"message": "The given data was invalid"}`

**Solution:**
- Check the validation rules in request
- Ensure all required fields are provided
- Verify data types match (e.g., `growth_type` must be `annual`, `perennial`, or `biennial`)

### Issue 5: CSRF Token Mismatch (if authentication added later)
**Error:** `{"message": "CSRF token mismatch"}`

**Solution:**
- For API testing, CSRF protection is typically disabled for `/api/*` routes
- If needed, get CSRF cookie first: `GET /sanctum/csrf-cookie`

---

## Quick Reference Commands

### Check Available Routes
```bash
php artisan route:list --path=api
```

### Check Database Tables
```bash
php artisan db:show
```

### Refresh Database with Sample Data
```bash
php artisan migrate:fresh --seed
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## Testing Workflow Example

### Complete Test Sequence:

1. **List all species** (GET)
   - Verify empty or existing data

2. **Create a new species** (POST)
   - Save the returned ID

3. **Get the created species** (GET with ID)
   - Verify all fields match

4. **Update the species** (PUT/PATCH)
   - Change some fields
   - Verify changes were saved

5. **List all species again** (GET)
   - Verify the updated record appears

6. **Delete the species** (DELETE)
   - Verify deletion successful

7. **Try to get deleted species** (GET with ID)
   - Should return 404 Not Found

---

## Sample Test Data

### Tomato
```json
{
  "common_name": "Tomato",
  "khmer_name": "ប៉េងប៉ោះ",
  "scientific_name": "Solanum lycopersicum",
  "family": "Solanaceae",
  "growth_type": "annual",
  "native_region": "South America",
  "propagation_method": "Seeds",
  "description": "Popular garden vegetable with red fruits"
}
```

### Sweet Pepper
```json
{
  "common_name": "Sweet Pepper",
  "khmer_name": "ម្រេចផ្អែម",
  "scientific_name": "Capsicum annuum",
  "family": "Solanaceae",
  "growth_type": "annual",
  "native_region": "Central America",
  "propagation_method": "Seeds",
  "description": "Bell pepper, sweet variety"
}
```

### Basil
```json
{
  "common_name": "Sweet Basil",
  "khmer_name": "ជីជីរ",
  "scientific_name": "Ocimum basilicum",
  "family": "Lamiaceae",
  "growth_type": "annual",
  "native_region": "Central Africa to Southeast Asia",
  "propagation_method": "Seeds or Cuttings",
  "description": "Aromatic herb used in cooking"
}
```

### Rose
```json
{
  "common_name": "Rose",
  "scientific_name": "Rosa spp.",
  "family": "Rosaceae",
  "growth_type": "perennial",
  "native_region": "Asia, Europe, North America",
  "propagation_method": "Cuttings, Grafting",
  "description": "Ornamental flowering plant"
}
```

---

## Export/Import Postman Collection

### Export Collection
1. Right-click on collection
2. Click **Export**
3. Choose **Collection v2.1**
4. Save as `Plant_Lab_API.postman_collection.json`

### Import Collection
1. Click **Import** button
2. Drag and drop the `.json` file
3. Collection will be available in your workspace

---

## Next Steps

1. ✅ Test all Plant Species endpoints
2. 📝 Add authentication endpoints (login/register)
3. 📝 Add more resource endpoints (varieties, stocks, samples)
4. 📝 Set up automated tests with Postman
5. 📝 Create documentation with Postman

---

## Useful Resources

- **Postman Documentation:** https://learning.postman.com/docs/
- **Laravel API Resources:** https://laravel.com/docs/11.x/eloquent-resources
- **HTTP Status Codes:** https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

---

**Happy Testing! 🚀**

Your Plant Lab Laboratory API is ready for comprehensive testing with Postman.

