#!/bin/bash

# React Integration Verification Script
# Checks if Laravel backend is ready for React on localhost:8081

echo "=========================================="
echo "React Integration - Configuration Check"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: CORS Configuration
echo "1. Checking CORS configuration..."
if grep -q "localhost:8081" config/cors.php; then
    echo -e "   ${GREEN}✓${NC} localhost:8081 found in CORS allowed_origins"
else
    echo -e "   ${RED}✗${NC} localhost:8081 NOT found in CORS configuration"
fi
echo ""

# Check 2: Sanctum Stateful Domains
echo "2. Checking Sanctum stateful domains..."
if grep -q "localhost:8081" .env; then
    echo -e "   ${GREEN}✓${NC} localhost:8081 found in SANCTUM_STATEFUL_DOMAINS"
else
    echo -e "   ${RED}✗${NC} localhost:8081 NOT found in .env"
fi
echo ""

# Check 3: Session Configuration
echo "3. Checking session configuration..."
SESSION_DRIVER=$(grep "SESSION_DRIVER=" .env | cut -d'=' -f2)
if [ "$SESSION_DRIVER" = "database" ]; then
    echo -e "   ${GREEN}✓${NC} Session driver is set to 'database'"
else
    echo -e "   ${YELLOW}!${NC} Session driver is '$SESSION_DRIVER' (expected 'database')"
fi
echo ""

# Check 4: Database Connection
echo "4. Checking database connection..."
if php artisan db:show --quiet 2>/dev/null; then
    echo -e "   ${GREEN}✓${NC} Database connection successful"
else
    echo -e "   ${RED}✗${NC} Database connection failed"
fi
echo ""

# Check 5: Sessions Table
echo "5. Checking sessions table..."
if php artisan tinker --execute="echo DB::table('sessions')->exists() ? 'yes' : 'no';" 2>/dev/null | grep -q "yes"; then
    echo -e "   ${GREEN}✓${NC} Sessions table exists"
else
    echo -e "   ${YELLOW}!${NC} Sessions table might not exist (run: php artisan migrate)"
fi
echo ""

# Check 6: API Routes
echo "6. Checking API routes..."
ROUTES=$(php artisan route:list --path=api 2>/dev/null | grep "plant-species" | wc -l)
if [ "$ROUTES" -gt 0 ]; then
    echo -e "   ${GREEN}✓${NC} Plant species API routes registered ($ROUTES routes)"
else
    echo -e "   ${RED}✗${NC} No API routes found"
fi
echo ""

# Check 7: Test Server Connection
echo "7. Testing API endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/plant-species | grep -q "200"; then
    echo -e "   ${GREEN}✓${NC} API endpoint responding (200 OK)"

    # Test CORS
    echo ""
    echo "8. Testing CORS from localhost:8081..."
    CORS_HEADER=$(curl -s -H "Origin: http://localhost:8081" -D - http://127.0.0.1:8000/api/plant-species 2>/dev/null | grep -i "access-control-allow-origin")
    if echo "$CORS_HEADER" | grep -q "localhost:8081"; then
        echo -e "   ${GREEN}✓${NC} CORS is working for localhost:8081"
    else
        echo -e "   ${RED}✗${NC} CORS not working for localhost:8081"
    fi
else
    echo -e "   ${YELLOW}!${NC} Server not responding (is it running?)"
    echo -e "   ${YELLOW}→${NC} Start server with: php artisan serve"
fi
echo ""

# Summary
echo "=========================================="
echo "Configuration Summary"
echo "=========================================="
echo ""
echo "Backend URL:  http://127.0.0.1:8000"
echo "API Base:     http://127.0.0.1:8000/api"
echo "Frontend URL: http://localhost:8081"
echo ""
echo "CORS Origins:"
grep -A 6 "allowed_origins" config/cors.php | grep "localhost" | sed 's/^/  /'
echo ""
echo "Sanctum Domains:"
grep "SANCTUM_STATEFUL" .env | sed 's/SANCTUM_STATEFUL_DOMAINS=/  /'
echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Start Laravel server:"
echo "   php artisan serve"
echo ""
echo "2. Start React dev server (in React project):"
echo "   npm start (or npm run dev)"
echo ""
echo "3. Check React integration guide:"
echo "   cat QUICK_START_REACT.md"
echo ""
echo "=========================================="

