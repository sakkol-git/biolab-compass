# Terminal Testing Commands - Quick Reference

Quick commands to test your API from the terminal (alternative to Postman).

---

## 🚀 Prerequisites

```bash
# Start Laravel server
cd /home/sakkol/Documents/Plant-Lap-Laboratory
php artisan serve
```

Server running at: **http://127.0.0.1:8000**

---

## 📡 cURL Commands

### GET - List All Plant Species

```bash
curl -X GET http://127.0.0.1:8000/api/plant-species \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

**Formatted output (with jq):**
```bash
curl -s http://127.0.0.1:8000/api/plant-species | jq
```

### GET - Search Plant Species

```bash
curl -X GET "http://127.0.0.1:8000/api/plant-species?search=Tomato" \
  -H "Accept: application/json"
```

### GET - Single Plant Species

```bash
curl -X GET http://127.0.0.1:8000/api/plant-species/1 \
  -H "Accept: application/json"
```

---

### POST - Create Plant Species

```bash
curl -X POST http://127.0.0.1:8000/api/plant-species \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Tomato",
    "khmer_name": "ប៉េងប៉ោះ",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "annual",
    "native_region": "South America",
    "propagation_method": "Seeds",
    "description": "Popular garden vegetable"
  }'
```

**Minimal required fields:**
```bash
curl -X POST http://127.0.0.1:8000/api/plant-species \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Test Plant",
    "scientific_name": "Testus plantus",
    "growth_type": "annual"
  }'
```

---

### PUT - Update Plant Species (Full Update)

```bash
curl -X PUT http://127.0.0.1:8000/api/plant-species/1 \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Tomato - Updated",
    "khmer_name": "ប៉េងប៉ោះ",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "perennial",
    "native_region": "South America - Andes",
    "propagation_method": "Seeds and Cuttings",
    "description": "Updated description"
  }'
```

---

### PATCH - Partial Update

```bash
curl -X PATCH http://127.0.0.1:8000/api/plant-species/1 \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Only updating the description field"
  }'
```

---

### DELETE - Remove Plant Species

```bash
curl -X DELETE http://127.0.0.1:8000/api/plant-species/1 \
  -H "Accept: application/json"
```

---

## 🧪 Test Scripts

### Complete CRUD Test Script

Save as `test-plant-species.sh`:

```bash
#!/bin/bash

API_URL="http://127.0.0.1:8000/api/plant-species"

echo "=== Testing Plant Species API ==="
echo ""

# 1. List all
echo "1. GET - List all plant species"
curl -s $API_URL | jq '.data | length'
echo ""

# 2. Create
echo "2. POST - Create new plant species"
RESPONSE=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Test Tomato",
    "scientific_name": "Solanum test'$(date +%s)'",
    "growth_type": "annual"
  }')
  
ID=$(echo $RESPONSE | jq -r '.data.id')
echo "Created ID: $ID"
echo ""

# 3. Get single
echo "3. GET - Get created plant species"
curl -s $API_URL/$ID | jq '.data.common_name'
echo ""

# 4. Update
echo "4. PUT - Update plant species"
curl -s -X PUT $API_URL/$ID \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Updated Tomato",
    "scientific_name": "Solanum test'$(date +%s)'",
    "growth_type": "perennial"
  }' | jq '.data.common_name'
echo ""

# 5. Delete
echo "5. DELETE - Remove plant species"
curl -s -X DELETE $API_URL/$ID | jq '.message'
echo ""

# 6. Verify deletion
echo "6. GET - Verify deletion (should be 404)"
curl -s -w "\nHTTP Status: %{http_code}\n" $API_URL/$ID
echo ""

echo "=== Test Complete ==="
```

**Run it:**
```bash
chmod +x test-plant-species.sh
./test-plant-species.sh
```

---

### Validation Test Script

Save as `test-validation.sh`:

```bash
#!/bin/bash

API_URL="http://127.0.0.1:8000/api/plant-species"

echo "=== Testing Validation ==="
echo ""

# Test 1: Missing required field
echo "Test 1: Missing common_name (should fail)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "scientific_name": "Test species",
    "growth_type": "annual"
  }' | jq '.errors'
echo ""

# Test 2: Invalid growth_type
echo "Test 2: Invalid growth_type (should fail)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Test",
    "scientific_name": "Test species",
    "growth_type": "invalid_type"
  }' | jq '.errors'
echo ""

# Test 3: Invalid URL
echo "Test 3: Invalid image_url (should fail)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "common_name": "Test",
    "scientific_name": "Test species",
    "growth_type": "annual",
    "image_url": "not-a-url"
  }' | jq '.errors'
echo ""

echo "=== Validation Tests Complete ==="
```

---

## 🔍 HTTPie (Alternative to cURL)

If you have HTTPie installed (more readable):

### Install HTTPie
```bash
# Ubuntu/Debian
sudo apt install httpie

# macOS
brew install httpie

# pip
pip install httpie
```

### HTTPie Examples

```bash
# GET all
http GET http://127.0.0.1:8000/api/plant-species

# POST create
http POST http://127.0.0.1:8000/api/plant-species \
  common_name="Tomato" \
  scientific_name="Solanum lycopersicum" \
  growth_type="annual"

# PUT update
http PUT http://127.0.0.1:8000/api/plant-species/1 \
  common_name="Updated Tomato" \
  scientific_name="Solanum lycopersicum" \
  growth_type="perennial"

# DELETE
http DELETE http://127.0.0.1:8000/api/plant-species/1
```

---

## 📊 Pretty Print JSON

### Using jq
```bash
curl -s http://127.0.0.1:8000/api/plant-species | jq '.'
```

### Using Python
```bash
curl -s http://127.0.0.1:8000/api/plant-species | python -m json.tool
```

---

## 🎯 Quick Test Commands

### Check if API is running
```bash
curl -I http://127.0.0.1:8000/api/plant-species
```

### Count total plant species
```bash
curl -s http://127.0.0.1:8000/api/plant-species | jq '.meta.total'
```

### Get only common names
```bash
curl -s http://127.0.0.1:8000/api/plant-species | jq '.data[].common_name'
```

### Search and get names
```bash
curl -s "http://127.0.0.1:8000/api/plant-species?search=Tomato" | jq '.data[].common_name'
```

---

## 🛠️ Laravel Artisan Commands

### View all API routes
```bash
php artisan route:list --path=api
```

### View specific route details
```bash
php artisan route:list --path=api/plant-species
```

### Clear all cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Database commands
```bash
# Show database info
php artisan db:show

# Show tables
php artisan db:table plant_species

# Refresh database
php artisan migrate:fresh --seed
```

---

## 📝 Save Output to File

### Save response to file
```bash
curl -s http://127.0.0.1:8000/api/plant-species > response.json
```

### View saved file
```bash
jq '.' response.json
```

---

## 🔄 Loop Testing

### Create multiple records
```bash
for i in {1..5}; do
  curl -s -X POST http://127.0.0.1:8000/api/plant-species \
    -H "Content-Type: application/json" \
    -d "{
      \"common_name\": \"Plant $i\",
      \"scientific_name\": \"Plantus $i\",
      \"growth_type\": \"annual\"
    }" | jq '.data.id'
done
```

---

## 🎨 Colored Output

### Using jq with colors
```bash
curl -s http://127.0.0.1:8000/api/plant-species | jq -C '.' | less -R
```

---

## 🆘 Troubleshooting Commands

### Check if server is running
```bash
curl -I http://127.0.0.1:8000
```

### Test with verbose output
```bash
curl -v http://127.0.0.1:8000/api/plant-species
```

### Show only HTTP status code
```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/plant-species
```

### Show response time
```bash
curl -s -o /dev/null -w "Time: %{time_total}s\n" http://127.0.0.1:8000/api/plant-species
```

---

## 📚 Resources

- **cURL documentation**: https://curl.se/docs/
- **jq documentation**: https://stedolan.github.io/jq/
- **HTTPie documentation**: https://httpie.io/docs

---

**For GUI testing, use Postman with the provided collection!**

See: `QUICK_START_POSTMAN.md`

