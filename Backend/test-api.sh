#!/bin/bash

# Plant Lab Laboratory API Test Script
# This script tests the basic functionality of the API

echo "=========================================="
echo "Plant Lab Laboratory - API Test"
echo "=========================================="
echo ""

BASE_URL="http://127.0.0.1:8000/api"

# Test 1: Check if server is running
echo "1. Testing server connectivity..."
if curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/plant-species" | grep -q "200\|401"; then
    echo "   ✓ Server is running"
else
    echo "   ✗ Server is not responding"
    echo "   Please start the server with: php artisan serve"
    exit 1
fi
echo ""

# Test 2: Get all plant species (should return empty list initially)
echo "2. Testing GET /api/plant-species..."
response=$(curl -s -H "Accept: application/json" "${BASE_URL}/plant-species")
echo "   Response: $response"
echo ""

# Test 3: Create a new plant species
echo "3. Testing POST /api/plant-species..."
create_response=$(curl -s -X POST "${BASE_URL}/plant-species" \
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
    "description": "A popular garden vegetable"
  }')
echo "   Response: $create_response"
echo ""

# Extract ID from response (if jq is available)
if command -v jq &> /dev/null; then
    species_id=$(echo "$create_response" | jq -r '.data.id // empty')

    if [ ! -z "$species_id" ]; then
        echo "4. Testing GET /api/plant-species/{id}..."
        get_response=$(curl -s -H "Accept: application/json" "${BASE_URL}/plant-species/${species_id}")
        echo "   Response: $get_response"
        echo ""

        echo "5. Testing PUT /api/plant-species/{id}..."
        update_response=$(curl -s -X PUT "${BASE_URL}/plant-species/${species_id}" \
          -H "Accept: application/json" \
          -H "Content-Type: application/json" \
          -d '{
            "common_name": "Cherry Tomato",
            "khmer_name": "ប៉េងប៉ោះ",
            "scientific_name": "Solanum lycopersicum var. cerasiforme",
            "family": "Solanaceae",
            "growth_type": "annual",
            "native_region": "South America",
            "propagation_method": "Seeds",
            "description": "A smaller variety of tomato"
          }')
        echo "   Response: $update_response"
        echo ""
    fi
else
    echo "   Note: Install 'jq' to test individual resource endpoints"
    echo ""
fi

# Test 4: Search functionality
echo "6. Testing search functionality..."
search_response=$(curl -s -H "Accept: application/json" "${BASE_URL}/plant-species?search=tomato")
echo "   Response: $search_response"
echo ""

echo "=========================================="
echo "Test completed!"
echo "=========================================="
echo ""
echo "Available endpoints:"
echo "  GET    /api/plant-species           - List all species"
echo "  POST   /api/plant-species           - Create new species"
echo "  GET    /api/plant-species/{id}      - Get specific species"
echo "  PUT    /api/plant-species/{id}      - Update species"
echo "  DELETE /api/plant-species/{id}      - Delete species"
echo ""
echo "To start the server:"
echo "  php artisan serve"
echo ""

