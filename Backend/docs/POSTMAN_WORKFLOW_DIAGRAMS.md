# API Testing Workflow - Visual Guide

## 🔄 Complete CRUD Testing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    START LARAVEL SERVER                         │
│                   php artisan serve                             │
│              http://127.0.0.1:8000 🚀                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     IMPORT TO POSTMAN                           │
│  1. Plant_Lab_API.postman_collection.json                       │
│  2. Plant_Lab_Local.postman_environment.json                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              SELECT ENVIRONMENT: "Plant Lab - Local"            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  START TESTING  │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
  ┌─────────┐         ┌──────────┐          ┌──────────┐
  │ CREATE  │         │   READ   │          │  SEARCH  │
  │  (POST) │         │   (GET)  │          │  (GET)   │
  └─────────┘         └──────────┘          └──────────┘
        │                     │                     │
        ▼                     ▼                     ▼
  ┌─────────┐         ┌──────────┐          ┌──────────┐
  │ UPDATE  │         │  DELETE  │          │ VALIDATE │
  │PUT/PATCH│         │ (DELETE) │          │  ERRORS  │
  └─────────┘         └──────────┘          └──────────┘
```

---

## 📊 HTTP Methods Flow Chart

```
┌──────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                            │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┬──────────────┐
        ▼                     ▼                     ▼              ▼
┌─────────────┐       ┌─────────────┐      ┌─────────────┐  ┌─────────────┐
│     GET     │       │     POST    │      │   PUT/PATCH │  │   DELETE    │
│   (Read)    │       │   (Create)  │      │   (Update)  │  │   (Remove)  │
└─────────────┘       └─────────────┘      └─────────────┘  └─────────────┘
      │                     │                     │                │
      ▼                     ▼                     ▼                ▼
┌─────────────┐       ┌─────────────┐      ┌─────────────┐  ┌─────────────┐
│ GET /api/   │       │ POST /api/  │      │ PUT /api/   │  │ DELETE /api/│
│ plant-      │       │ plant-      │      │ plant-      │  │ plant-      │
│ species     │       │ species     │      │ species/{id}│  │ species/{id}│
│             │       │             │      │             │  │             │
│ List All ✓  │       │ + JSON Body │      │ + JSON Body │  │ Remove ✓    │
└─────────────┘       └─────────────┘      └─────────────┘  └─────────────┘
      │                     │                     │                │
      ▼                     ▼                     ▼                ▼
┌─────────────┐       ┌─────────────┐      ┌─────────────┐  ┌─────────────┐
│  Response:  │       │  Response:  │      │  Response:  │  │  Response:  │
│             │       │             │      │             │  │             │
│  200 OK     │       │  201 Created│      │  200 OK     │  │  200 OK     │
│  + data[]   │       │  + data{}   │      │  + data{}   │  │  + message  │
└─────────────┘       └─────────────┘      └─────────────┘  └─────────────┘
```

---

## 🎯 Request/Response Flow

```
┌──────────────────┐
│   POSTMAN UI     │
│  Click "Send"    │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────┐
│   HTTP REQUEST                         │
│                                        │
│   Method: POST                         │
│   URL: http://127.0.0.1:8000/api/     │
│        plant-species                   │
│                                        │
│   Headers:                             │
│     Accept: application/json           │
│     Content-Type: application/json     │
│                                        │
│   Body:                                │
│     {                                  │
│       "common_name": "Tomato",         │
│       "scientific_name": "Solanum...", │
│       "growth_type": "annual"          │
│     }                                  │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│   LARAVEL BACKEND                      │
│                                        │
│   1. Route: api.php                    │
│      Route::apiResource('plant-        │
│      species', ...)                    │
│                                        │
│   2. Controller:                       │
│      PlantSpeciesController@store      │
│                                        │
│   3. Request Validation:               │
│      StorePlantSpeciesRequest          │
│      ✓ Check required fields           │
│      ✓ Validate data types             │
│                                        │
│   4. Database:                         │
│      PlantSpecies::create($data)       │
│                                        │
│   5. Resource:                         │
│      PlantSpeciesResource              │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│   HTTP RESPONSE                        │
│                                        │
│   Status: 201 Created                  │
│                                        │
│   Body:                                │
│     {                                  │
│       "data": {                        │
│         "id": 1,                       │
│         "common_name": "Tomato",       │
│         "scientific_name": "...",      │
│         "created_at": "2026-02-28",    │
│         "updated_at": "2026-02-28"     │
│       }                                │
│     }                                  │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────┐
│  POSTMAN UI        │
│  Display Response  │
│  ✓ Status: 201     │
│  ✓ Body: JSON      │
│  ✓ Auto-save ID    │
└────────────────────┘
```

---

## ✅ Testing Sequence Diagram

```
Step 1: LIST ALL
┌─────────┐                    ┌─────────┐
│ Postman │  GET /plant-species│ Laravel │
│         ├───────────────────>│         │
│         │                    │ Query DB│
│         │<───────────────────┤         │
│         │  200 + data[]      │         │
└─────────┘                    └─────────┘
   Result: See existing data (may be empty)


Step 2: CREATE
┌─────────┐                    ┌─────────┐
│ Postman │ POST /plant-species│ Laravel │
│         ├───────────────────>│         │
│         │ + JSON body        │ Validate│
│         │                    │ Create  │
│         │<───────────────────┤         │
│         │ 201 + data{id:1}   │         │
└─────────┘                    └─────────┘
   Result: New record created, ID saved


Step 3: READ ONE
┌─────────┐                    ┌─────────┐
│ Postman │ GET /plant-species/1│Laravel │
│         ├───────────────────>│         │
│         │                    │ Find ID │
│         │<───────────────────┤         │
│         │ 200 + data{...}    │         │
└─────────┘                    └─────────┘
   Result: Verify created data


Step 4: UPDATE
┌─────────┐                    ┌─────────┐
│ Postman │ PUT /plant-species/1│Laravel │
│         ├───────────────────>│         │
│         │ + JSON body        │ Update  │
│         │<───────────────────┤         │
│         │ 200 + data{...}    │         │
└─────────┘                    └─────────┘
   Result: Record updated


Step 5: DELETE
┌─────────┐                    ┌─────────┐
│ Postman │DELETE /plant-species/1│Laravel│
│         ├───────────────────>│         │
│         │                    │ Delete  │
│         │<───────────────────┤         │
│         │ 200 + message      │         │
└─────────┘                    └─────────┘
   Result: Record deleted


Step 6: VERIFY DELETE
┌─────────┐                    ┌─────────┐
│ Postman │ GET /plant-species/1│Laravel │
│         ├───────────────────>│         │
│         │                    │ Not Found│
│         │<───────────────────┤         │
│         │ 404 Not Found      │         │
└─────────┘                    └─────────┘
   Result: Confirms deletion
```

---

## 🔐 Validation Flow

```
POST /api/plant-species
         │
         ▼
┌─────────────────────────────────────┐
│  StorePlantSpeciesRequest           │
│                                     │
│  ✓ common_name → Required           │
│  ✓ scientific_name → Required+Unique│
│  ✓ growth_type → Must be:           │
│      • annual                       │
│      • perennial                    │
│      • biennial                     │
│  ✓ image_url → Must be valid URL   │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐       ┌──────────┐
│  PASS   │       │   FAIL   │
│  ✓      │       │   ✗      │
└────┬────┘       └────┬─────┘
     │                 │
     ▼                 ▼
┌─────────┐       ┌──────────────────┐
│ Create  │       │ 422 Validation   │
│ Record  │       │ Error            │
│         │       │                  │
│ Return  │       │ {                │
│ 201     │       │   "message": "", │
│ Created │       │   "errors": {}   │
└─────────┘       │ }                │
                  └──────────────────┘
```

---

## 📈 Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        POSTMAN                               │
│  Import Collection → Set Environment → Send Requests         │
└────────────────┬─────────────────────────────────────────────┘
                 │ HTTP Request
                 │ (JSON)
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                    LARAVEL ROUTES                            │
│  routes/api.php                                              │
│  Route::apiResource('plant-species', ...)                    │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                    CONTROLLER                                │
│  app/Http/Controllers/PlantSpeciesController.php             │
│  • index() → List all                                        │
│  • store() → Create                                          │
│  • show() → Get one                                          │
│  • update() → Update                                         │
│  • destroy() → Delete                                        │
└────────────────┬─────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌───────────────┐   ┌──────────────────┐
│   VALIDATION  │   │      MODEL       │
│  (Requests)   │   │  PlantSpecies    │
│               │   │                  │
│ • Store       │   │ • $fillable      │
│ • Update      │   │ • Relationships  │
└───────────────┘   └────────┬─────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │    DATABASE      │
                   │   PostgreSQL     │
                   │                  │
                   │ plant_species    │
                   │   table          │
                   └────────┬─────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    API RESOURCE                              │
│  app/Http/Resources/PlantSpeciesResource.php                 │
│  Format response data                                        │
└────────────────┬─────────────────────────────────────────────┘
                 │ JSON Response
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                       POSTMAN                                │
│  Receive Response → View Data → Run Tests                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Status Code Decision Tree

```
         Send Request
              │
              ▼
        ┌──────────┐
        │ Success? │
        └─────┬────┘
         ┌────┴────┐
         ▼         ▼
       YES        NO
         │         │
         ▼         ▼
    ┌────────┐   ┌──────────────┐
    │ 2xx OK │   │ What error?  │
    └────────┘   └──────┬───────┘
                   ┌────┴────┬──────────┬──────────┐
                   ▼         ▼          ▼          ▼
              ┌────────┐ ┌───────┐ ┌───────┐ ┌───────┐
              │  400   │ │  404  │ │  422  │ │  500  │
              │  Bad   │ │ Not   │ │Valid- │ │Server │
              │Request │ │ Found │ │ation  │ │Error  │
              └────────┘ └───────┘ └───────┘ └───────┘

2xx Codes:
  200 → OK (GET, PUT, PATCH, DELETE)
  201 → Created (POST)

4xx Client Errors:
  400 → Bad Request
  404 → Not Found
  422 → Validation Failed

5xx Server Errors:
  500 → Internal Server Error
```

---

## 📋 Quick Reference Symbols

```
✅ Required Field
❌ Optional Field
🔒 Unique Field
📝 Text Field
🔢 Number Field
📅 Date Field
🌐 URL Field
🔄 Auto-generated
```

### Field Requirements

```
common_name         ✅ Required, 📝 String, Max 255
khmer_name          ❌ Optional, 📝 String, Max 255
scientific_name     ✅ Required, 🔒 Unique, 📝 String, Max 255
family              ❌ Optional, 📝 String, Max 255
growth_type         ✅ Required, Must be: annual|perennial|biennial
native_region       ❌ Optional, 📝 String, Max 255
propagation_method  ❌ Optional, 📝 String, Max 255
description         ❌ Optional, 📝 Text
image_url           ❌ Optional, 🌐 Valid URL
id                  🔄 Auto-generated
created_at          🔄 Auto-generated, 📅 Timestamp
updated_at          🔄 Auto-generated, 📅 Timestamp
```

---

**Use these diagrams for quick visual reference! 📊**

