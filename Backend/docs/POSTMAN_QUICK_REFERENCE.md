# Postman API Testing - Quick Reference Card

## 🔗 Base URLs
```
Base URL:    http://127.0.0.1:8000
API URL:     http://127.0.0.1:8000/api
```

---

## 📡 Plant Species Endpoints

### 1️⃣ GET - List All (with Pagination)
```
GET    /api/plant-species
GET    /api/plant-species?search=tomato
```
**Headers:**
```
Accept: application/json
Content-Type: application/json
```
**Response:** 200 OK

---

### 2️⃣ POST - Create New
```
POST   /api/plant-species
```
**Headers:**
```
Accept: application/json
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "common_name": "Tomato",           ✅ Required
  "khmer_name": "ប៉េងប៉ោះ",              Optional
  "scientific_name": "Solanum...",   ✅ Required, Unique
  "family": "Solanaceae",                Optional
  "growth_type": "annual",           ✅ Required (annual|perennial|biennial)
  "native_region": "South America",      Optional
  "propagation_method": "Seeds",         Optional
  "description": "A vegetable...",       Optional
  "image_url": "https://..."             Optional, must be valid URL
}
```
**Response:** 201 Created

---

### 3️⃣ GET - Show Single
```
GET    /api/plant-species/{id}
```
**Example:** `/api/plant-species/1`

**Headers:**
```
Accept: application/json
```
**Response:** 200 OK or 404 Not Found

---

### 4️⃣ PUT/PATCH - Update
```
PUT    /api/plant-species/{id}    (Full update)
PATCH  /api/plant-species/{id}    (Partial update)
```
**Headers:**
```
Accept: application/json
Content-Type: application/json
```
**Body (JSON):** Same as POST
- PUT: Send all fields
- PATCH: Send only fields to update

**Response:** 200 OK

---

### 5️⃣ DELETE - Remove
```
DELETE /api/plant-species/{id}
```
**Headers:**
```
Accept: application/json
```
**Response:** 200 OK
```json
{
  "message": "Plant species deleted successfully"
}
```

---

## 🎨 HTTP Methods Summary

| Method | Action | Endpoint | Body Required |
|--------|--------|----------|---------------|
| **GET** | List all | `/plant-species` | ❌ No |
| **GET** | Get one | `/plant-species/{id}` | ❌ No |
| **POST** | Create | `/plant-species` | ✅ Yes |
| **PUT** | Update (full) | `/plant-species/{id}` | ✅ Yes |
| **PATCH** | Update (partial) | `/plant-species/{id}` | ✅ Yes |
| **DELETE** | Delete | `/plant-species/{id}` | ❌ No |

---

## ✅ Validation Rules

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| `common_name` | string | **Required**, max:255 | "Tomato" |
| `khmer_name` | string | Optional, max:255 | "ប៉េងប៉ោះ" |
| `scientific_name` | string | **Required**, max:255, **unique** | "Solanum lycopersicum" |
| `family` | string | Optional, max:255 | "Solanaceae" |
| `growth_type` | enum | **Required**, [annual\|perennial\|biennial] | "annual" |
| `native_region` | string | Optional, max:255 | "South America" |
| `propagation_method` | string | Optional, max:255 | "Seeds" |
| `description` | text | Optional | "A popular vegetable..." |
| `image_url` | string | Optional, must be valid URL | "https://example.com/img.jpg" |

---

## 📊 HTTP Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| **200** | OK | Request successful |
| **201** | Created | Resource created |
| **204** | No Content | Successful, no data returned |
| **400** | Bad Request | Invalid request |
| **404** | Not Found | Resource doesn't exist |
| **422** | Unprocessable | Validation failed |
| **500** | Server Error | Internal error |

---

## 📝 Sample Test Data

### Tomato (Annual)
```json
{
  "common_name": "Tomato",
  "khmer_name": "ប៉េងប៉ោះ",
  "scientific_name": "Solanum lycopersicum",
  "family": "Solanaceae",
  "growth_type": "annual",
  "native_region": "South America",
  "propagation_method": "Seeds",
  "description": "Popular garden vegetable"
}
```

### Rose (Perennial)
```json
{
  "common_name": "Rose",
  "scientific_name": "Rosa spp.",
  "family": "Rosaceae",
  "growth_type": "perennial",
  "native_region": "Asia",
  "propagation_method": "Cuttings"
}
```

### Carrot (Biennial)
```json
{
  "common_name": "Carrot",
  "scientific_name": "Daucus carota",
  "family": "Apiaceae",
  "growth_type": "biennial",
  "propagation_method": "Seeds"
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete CRUD Flow
```
1. GET /plant-species           → List all
2. POST /plant-species          → Create new (save ID)
3. GET /plant-species/{id}      → View created
4. PUT /plant-species/{id}      → Update all fields
5. PATCH /plant-species/{id}    → Update one field
6. DELETE /plant-species/{id}   → Delete
7. GET /plant-species/{id}      → Verify 404
```

### Scenario 2: Test Search
```
1. POST /plant-species          → Create "Tomato"
2. POST /plant-species          → Create "Pepper"
3. GET /plant-species?search=Tom → Find Tomato
4. GET /plant-species?search=Sol → Find by scientific name
```

### Scenario 3: Test Validation
```
1. POST with empty common_name     → 422 Error
2. POST with invalid growth_type   → 422 Error
3. POST with duplicate scientific  → 422 Error
4. POST with invalid URL           → 422 Error
```

---

## 🛠️ Troubleshooting

### Issue: Connection Refused
```bash
# Start Laravel server
php artisan serve
```

### Issue: 404 Not Found
```bash
# Check routes exist
php artisan route:list --path=api
```

### Issue: 500 Server Error
```bash
# Check logs
tail -f storage/logs/laravel.log

# Refresh database
php artisan migrate:fresh --seed
```

### Issue: 422 Validation Error
- Check all **required** fields are present
- Verify `growth_type` is: annual, perennial, or biennial
- Ensure `scientific_name` is unique
- Verify `image_url` is a valid URL format

---

## 🔑 Postman Variables

Set these in your environment:

```
{{api_url}}            = http://127.0.0.1:8000/api
{{base_url}}           = http://127.0.0.1:8000
{{plant_species_id}}   = (auto-saved from create)
```

---

## ⚡ Quick Commands

### Test API from Terminal
```bash
# List all
curl http://127.0.0.1:8000/api/plant-species

# Get single
curl http://127.0.0.1:8000/api/plant-species/1

# Create
curl -X POST http://127.0.0.1:8000/api/plant-species \
  -H "Content-Type: application/json" \
  -d '{"common_name":"Test","scientific_name":"Test sp.","growth_type":"annual"}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/plant-species/1
```

### Laravel Commands
```bash
# Start server
php artisan serve

# View routes
php artisan route:list --path=api

# Reset database
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear
php artisan config:clear
```

---

## 📚 Resources

- **Full Guide:** `POSTMAN_API_TESTING_GUIDE.md`
- **Quick Start:** `QUICK_START_POSTMAN.md`
- **Collection:** `Plant_Lab_API.postman_collection.json`
- **Environment:** `Plant_Lab_Local.postman_environment.json`

---

**Print this card for quick reference! 📋**

