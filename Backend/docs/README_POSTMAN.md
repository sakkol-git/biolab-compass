# Postman API Testing Resources

Complete resources for testing Plant Lab Laboratory API with Postman.

---

## 📚 Documentation Files

| File | Description | When to Use |
|------|-------------|-------------|
| **QUICK_START_POSTMAN.md** | 5-minute quick start guide | Start here! Get testing immediately |
| **POSTMAN_API_TESTING_GUIDE.md** | Complete tutorial with examples | Learn all endpoints in detail |
| **POSTMAN_QUICK_REFERENCE.md** | One-page cheat sheet | Quick reference while testing |

---

## 📦 Postman Files (Ready to Import)

| File | Description | How to Use |
|------|-------------|------------|
| **Plant_Lab_API.postman_collection.json** | Complete API collection with all requests | Import into Postman |
| **Plant_Lab_Local.postman_environment.json** | Environment variables for local development | Import into Postman |

---

## 🚀 Quick Start

### 1. Start Laravel Server
```bash
cd /home/sakkol/Documents/Plant-Lap-Laboratory
php artisan serve
```

### 2. Import to Postman
1. Open Postman
2. Click **Import**
3. Drag and drop:
   - `Plant_Lab_API.postman_collection.json`
   - `Plant_Lab_Local.postman_environment.json`
4. Select environment: **Plant Lab - Local**

### 3. Send Your First Request
1. Open collection: **Plant Lab Laboratory API**
2. Click: **Get All Plant Species**
3. Click: **Send**

✅ You're testing!

---

## 📖 What's Included

### The Collection Includes:

✅ **10 Pre-configured Requests:**
- Get All Plant Species (with pagination)
- Get All Plant Species (with search)
- Get Single Plant Species
- Create Plant Species - Tomato
- Create Plant Species - Sweet Pepper
- Create Plant Species - Basil
- Update Plant Species (PUT - full update)
- Update Plant Species (PATCH - partial update)
- Delete Plant Species
- Test Validation - Invalid Data

✅ **Auto-Save Feature:**
- Created IDs are automatically saved
- Use `{{plant_species_id}}` in requests

✅ **Sample Data:**
- 3 complete plant species examples
- Ready to test immediately

---

## 🎯 API Endpoints Covered

### Plant Species CRUD

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/plant-species` | List all (paginated) |
| GET | `/api/plant-species?search=term` | Search |
| GET | `/api/plant-species/{id}` | Get single |
| POST | `/api/plant-species` | Create new |
| PUT | `/api/plant-species/{id}` | Update (full) |
| PATCH | `/api/plant-species/{id}` | Update (partial) |
| DELETE | `/api/plant-species/{id}` | Delete |

---

## 📋 Testing Checklist

Use this checklist to ensure complete testing:

### Basic CRUD
- [ ] List all plant species
- [ ] Create a new plant species
- [ ] View a single plant species
- [ ] Update a plant species (full)
- [ ] Partially update a plant species
- [ ] Delete a plant species

### Advanced Features
- [ ] Search by common name
- [ ] Search by scientific name
- [ ] Test pagination
- [ ] Test with missing required fields
- [ ] Test with invalid growth_type
- [ ] Test with duplicate scientific_name
- [ ] Test with invalid URL

### Edge Cases
- [ ] Get non-existent ID (404)
- [ ] Update non-existent ID (404)
- [ ] Delete non-existent ID (404)
- [ ] Create with all optional fields empty
- [ ] Create with all fields populated

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | `php artisan serve` |
| 404 Not Found | Check URL and routes: `php artisan route:list` |
| 500 Server Error | Check logs: `tail -f storage/logs/laravel.log` |
| Database error | Run: `php artisan migrate:fresh --seed` |
| Variables not working | Select environment: "Plant Lab - Local" |

---

## 💡 Pro Tips

1. **Use the Environment:** Select "Plant Lab - Local" from the dropdown (top right)
2. **Auto-save IDs:** The collection automatically saves created IDs
3. **Test in Order:** Follow the order in the collection for best results
4. **Save Responses:** Click "Save Response" to keep examples
5. **Check Console:** View Postman console for detailed request/response info

---

## 🎓 Learning Path

### Beginner
1. Read: `QUICK_START_POSTMAN.md`
2. Import collection and environment
3. Test "Get All Plant Species"
4. Test "Create Plant Species - Tomato"

### Intermediate
1. Read: `POSTMAN_API_TESTING_GUIDE.md`
2. Test all CRUD operations
3. Try search functionality
4. Test validation errors

### Advanced
1. Create custom test data
2. Write automated tests (Tests tab)
3. Chain requests using variables
4. Export and share collection

---

## 📞 Support

### Check Documentation
- `POSTMAN_API_TESTING_GUIDE.md` - Complete guide
- `POSTMAN_QUICK_REFERENCE.md` - Quick reference card

### Check Laravel
```bash
# View all routes
php artisan route:list --path=api

# Check database
php artisan db:show

# View logs
tail -f storage/logs/laravel.log
```

### Test from Command Line
```bash
# Quick test
curl http://127.0.0.1:8000/api/plant-species
```

---

## 🔄 Updates

### Version History
- **v1.0** (2026-02-28) - Initial release
  - Plant Species CRUD endpoints
  - 10 pre-configured requests
  - Auto-save ID feature
  - Complete documentation

---

## 📁 File Structure

```
Plant-Lap-Laboratory/
├── QUICK_START_POSTMAN.md                    ⭐ Start here
├── POSTMAN_API_TESTING_GUIDE.md              📖 Complete guide
├── POSTMAN_QUICK_REFERENCE.md                📋 Cheat sheet
├── Plant_Lab_API.postman_collection.json     📦 Import this
├── Plant_Lab_Local.postman_environment.json  📦 Import this
└── README_POSTMAN.md                         📚 This file
```

---

## 🚀 Next Steps

After mastering Plant Species endpoints:

1. ✅ Test all CRUD operations
2. ✅ Test search and pagination
3. ✅ Test validation rules
4. 📝 Add Plant Varieties endpoints
5. 📝 Add Plant Stocks endpoints
6. 📝 Add authentication (if needed)
7. 📝 Create automated test suite
8. 📝 Share collection with team

---

## 📚 Additional Resources

- **Postman Learning:** https://learning.postman.com/
- **REST API Best Practices:** https://restfulapi.net/
- **Laravel API Resources:** https://laravel.com/docs/11.x/eloquent-resources
- **HTTP Status Codes:** https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

---

**Happy Testing! 🎉**

You have everything you need to test your Plant Lab Laboratory API with Postman!

