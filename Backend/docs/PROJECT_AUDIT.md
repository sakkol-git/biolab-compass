# 🔬 Plant Lab Laboratory — Professional Project Audit

> **Audit Date:** July 2025  
> **Framework:** Laravel 12 · PHP 8.4  
> **Auth Stack:** JWT (`php-open-source-saver/jwt-auth`) + Spatie Permission v7  
> **Database:** MySQL  
> **Auditor:** AI Code Audit Agent

---

## 📋 Executive Summary

| Category            | Score (1-10) | Verdict                                                  |
| ------------------- | ------------ | -------------------------------------------------------- |
| **Security**        | 4 / 10       | 🔴 Critical gaps — most API routes unprotected           |
| **Architecture**    | 6 / 10       | 🟡 Decent foundation, inconsistent layering              |
| **Database Design** | 7 / 10       | 🟢 Solid polymorphic design, minor schema issues         |
| **Performance**     | 6 / 10       | 🟡 Good indexes, missing caching & N+1 guards            |
| **Code Quality**    | 6 / 10       | 🟡 Clean in most modules, inconsistent in UserController |
| **Testing**         | 3 / 10       | 🔴 Tests exist but no API/auth/RBAC test coverage        |
| **DevOps & Config** | 5 / 10       | 🟡 Missing rate limiting, logging, monitoring            |
| **Maintainability** | 7 / 10       | 🟢 Good enum usage, traits, concerns                     |
| **Overall**         | **5.5 / 10** | 🟡 Solid prototype, **not production-ready**             |

**Bottom line:** The project has a well-designed domain model (polymorphic borrows/transactions, good enum usage, proper service layer for BorrowService). However, **critical security vulnerabilities** — primarily the complete absence of authentication middleware on 90% of API routes — make this unsafe for any deployment beyond local development. The codebase needs a focused sprint on security, consistency, and test coverage before going live.

---

## 🔴 1. Critical Security Issues

### 1.1 CRITICAL: API Routes Missing Authentication Middleware

**Severity:** 🔴 CRITICAL  
**Files:** `routes/api.php`

**The majority of API routes have zero authentication or authorization:**

```php
// routes/api.php — these are completely PUBLIC
Route::apiResource('plant-species', PlantSpeciesController::class);
Route::apiResource('plant-varieties', PlantVarietyController::class);
Route::apiResource('plant-samples', PlantSampleController::class);
Route::apiResource('plant-stocks', PlantStockController::class);
Route::apiResource('chemicals', ChemicalController::class);
Route::apiResource('equipment', EquipmentController::class);
Route::apiResource('transactions', TransactionController::class);
Route::apiResource('borrow-records', BorrowRecordController::class);
Route::apiResource('users', UserController::class);  // ← Anyone can CRUD users!
```

**Impact:** Any anonymous HTTP client can:

- Create, edit, delete chemicals, equipment, plant data
- Create and manage user accounts (including admins)
- Read all transactions and borrow records
- Delete inventory records

**Fix:** Wrap all resource routes in `auth:api` middleware. Apply permission-based authorization per action:

```php
Route::middleware('auth:api')->group(function () {
    Route::apiResource('plant-species', PlantSpeciesController::class);
    Route::apiResource('chemicals', ChemicalController::class);
    Route::apiResource('users', UserController::class);
    // ... etc
});
```

### 1.2 CRITICAL: Double Password Hashing in UserController

**Severity:** 🔴 CRITICAL  
**File:** `app/Http/Controllers/UserController.php` (lines 76, 109)

The `User` model has `'password' => 'hashed'` cast, which automatically hashes any value assigned to the `password` attribute. But `UserController` also manually calls `Hash::make()`:

```php
// store() — line 76
'password' => Hash::make($data['password']),  // ← hashed, then model hashes AGAIN

// update() — line 109
$data['password'] = Hash::make($data['password']);  // ← same double-hash bug
```

**Impact:** Users created or updated via the User API endpoint **cannot log in** — the password is hashed twice and never matches.

**Fix:** Remove all `Hash::make()` calls — the model cast handles it:

```php
// store()
return User::create($data);

// update()
// Just leave $data['password'] as-is; the model will hash it
```

### 1.3 HIGH: Open Registration With Any Role

**Severity:** 🟠 HIGH  
**File:** `app/Http/Requests/auth/RegisterRequest.php`

```php
'role' => ['required', Rule::enum(UserRole::class)],
```

Anyone can register as `admin` or `lab_manager`. There is no server-side guard preventing privilege escalation during self-registration.

**Fix:** Either:

- Hardcode `'role' => UserRole::STUDENT` in the register controller (remove from request validation)
- Or require an authenticated admin to set the role

### 1.4 HIGH: No CSRF / Rate Limiting on API Auth Endpoints

**Severity:** 🟠 HIGH  
**File:** `routes/api.php`

The `auth/login` and `auth/register` endpoints have no rate limiting, making them vulnerable to brute-force attacks. While `FortifyServiceProvider` configures rate limiting for the web login, the API auth routes bypass Fortify entirely.

**Fix:** Add throttle middleware:

```php
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
});
```

### 1.5 HIGH: FormRequest `authorize()` Returns `false` (Dead Code)

**Severity:** 🟠 HIGH  
**Files:** `app/Http/Requests/Chemical/CreateChemicalRequest.php`, `app/Http/Requests/Equipment/CreateEquipmentRequest.php`

```php
public function authorize(): bool
{
    return false;  // ← Blocks ALL requests with 403
}

public function rules(): array
{
    return [];  // ← No validation rules
}
```

These are unused scaffold files, but if ever accidentally wired into a controller, they would reject every request. They should be deleted or implemented.

### 1.6 MEDIUM: No Authorization (Policy/Gate) Layer

**Severity:** 🟡 MEDIUM  
**Scope:** Entire API

Even after adding `auth:api` middleware, any authenticated user (student) could delete chemicals, modify equipment, or manage other users' records. There are no Laravel Policies, Gates, or `can()` middleware checks anywhere in the codebase.

**Recommendation:** Create model policies (`ChemicalPolicy`, `EquipmentPolicy`, `UserPolicy`, etc.) and use Spatie permissions:

```php
public function authorize(): bool
{
    return $this->user()->can('chemicals.edit');
}
```

### 1.7 MEDIUM: SQL Injection Risk via Search Scopes

**Severity:** 🟡 MEDIUM  
**Files:** All controllers with `search` parameter

```php
$query->where('common_name', 'like', "%{$term}%");
```

While Laravel's query builder parameterizes values with `LIKE`, the `%` wildcards are string-interpolated. This is safe from SQL injection but allows **wildcard injection** (`%`, `_`). Consider escaping LIKE wildcards:

```php
$escaped = str_replace(['%', '_'], ['\\%', '\\_'], $term);
$query->where('common_name', 'like', "%{$escaped}%");
```

### 1.8 LOW: JWT Token Not Validated for Blacklist on Every Request

**Severity:** 🟢 LOW  
**File:** `config/jwt.php`

```php
'blacklist_grace_period' => (int) env('JWT_BLACKLIST_GRACE_PERIOD', 0),
```

The grace period is 0, which is correct. However, there's no mechanism to force-revoke all tokens for a user (e.g., on password change or account disable). Consider adding JTI tracking or using short-lived tokens with refresh.

---

## 🏗️ 2. Major Architecture Problems

### 2.1 Inconsistent Service Layer

**Finding:** Only `BorrowService`, `TransactionService`, and `StockService` exist. All other controllers (`ChemicalController`, `EquipmentController`, `PlantSpeciesController`, etc.) contain business logic directly.

| Module          | Has Service?          | Has FormRequest? | Has Resource?      |
| --------------- | --------------------- | ---------------- | ------------------ |
| Borrow Records  | ✅ BorrowService      | ✅               | ✅                 |
| Plant Stock     | ✅ StockService       | ✅               | ✅                 |
| Transactions    | ✅ TransactionService | ❌ (read-only)   | ✅                 |
| Chemicals       | ❌                    | ✅               | ✅                 |
| Equipment       | ❌                    | ✅               | ✅                 |
| Plant Species   | ❌                    | ✅               | ✅                 |
| Plant Samples   | ❌                    | ✅               | ✅                 |
| Plant Varieties | ❌                    | ✅               | ✅                 |
| **Users**       | ❌                    | **❌ inline**    | **❌ manual JSON** |
| Auth            | ❌                    | ✅               | ❌ manual JSON     |
| Roles           | ❌                    | ❌ inline        | ❌ manual JSON     |
| Permissions     | ❌                    | ❌ inline        | ❌ manual JSON     |

**Impact:** The `UserController` is the worst offender — it uses inline validation, manual JSON building, and `Hash::make()` (causing the double-hash bug). All other controllers follow a consistent FormRequest + Resource pattern.

**Recommendation:** Create `StoreUserRequest`, `UpdateUserRequest`, and `UserResource`. Either create a `UserService` or keep it thin — but be consistent.

### 2.2 Empty Service Files

**Files:** `app/Services/DashboardService.php`, `app/Services/SampleService.php`

These are completely empty placeholder files. They add confusion and should be either implemented or deleted.

### 2.3 Dual Auth System Confusion

The project has **two parallel authentication systems**:

1. **Web auth (Fortify/Inertia):** Session-based, handles login/register/2FA views, Blade/Inertia pages
2. **API auth (JWT):** Token-based, custom `AuthController`, JSON responses

These share the same `User` model and `users` table but have separate route files, controllers, and middleware configurations. While this is technically valid for a hybrid SPA+API app, it creates confusion:

- `config/auth.php` defaults to `web` guard
- Spatie permissions use `api` guard
- `Settings/PasswordController` and `Settings/ProfileController` use web auth
- No clear documentation on which auth system to use when

**Recommendation:** Document the intended auth architecture. If the API is the primary interface, consider removing the web routes or clearly separating them.

### 2.4 Registration Creates User Without Spatie Role Assignment

**File:** `app/Http/Controllers/Api/AuthController.php`

```php
public function register(RegisterRequest $request)
{
    $user = User::create($request->validated());
    // ← No Spatie role assigned!
}
```

The `role` enum column is set, but no Spatie role is assigned. This means the user has the enum role but **zero Spatie permissions**. They won't pass any permission checks.

**Fix:**

```php
$user = User::create($request->validated());
$spatieRole = Role::findByName($user->role->value, 'api');
$user->assignRole($spatieRole);
```

### 2.5 Dual Role System (Enum vs Spatie)

The `User` model tracks roles in two places:

1. `role` column (enum: `admin`, `lab_manager`, `student`) — used by `AdminMiddleware`
2. Spatie `model_has_roles` pivot table — used for permission checks

These can drift out of sync. The `AdminMiddleware` checks the enum column, not Spatie roles:

```php
// AdminMiddleware.php
if (!$user || $user->role !== UserRole::ADMIN) { ... }
```

But permission checks use Spatie. If only the enum is updated (e.g., via `UserController::update()`), the user may have admin access via middleware but no admin permissions, or vice versa.

**Recommendation:** Choose one source of truth. Either:

- Drop the `role` column and derive it from Spatie
- Or keep the column but sync it automatically with Spatie on every change

---

## ⚡ 3. Performance Risks

### 3.1 No N+1 Prevention

**Finding:** While `BorrowRecordController` and `PlantSampleController` use `with()` for eager loading, several controllers don't guard against N+1:

- `UserController::index()` — paginated query with no relationship loading. If roles/permissions are ever needed in the list, this becomes N+1.
- `TransactionController::index()` — eager loads `user` and `transactionable`, which is correct.
- `PlantStockController::index()` — eager loads relations. ✅

**Recommendation:** Add `Model::preventLazyLoading(!app()->isProduction())` to `AppServiceProvider::boot()` to catch N+1 issues during development.

### 3.2 No API Response Caching

All list endpoints hit the database on every request. For read-heavy resources like plant species and chemicals, consider:

- Response caching with `spatie/laravel-responsecache`
- Or manual `Cache::remember()` with tagged cache invalidation

### 3.3 Pagination Not Configurable

All controllers hardcode `paginate(15)`. This should be configurable via query parameter with a max limit:

```php
$perPage = min($request->integer('per_page', 15), 100);
$query->paginate($perPage);
```

### 3.4 Missing Database Indexes

While the migrations include good composite indexes, some are missing:

- `users.role` — no index but filtered in `UserController::index()`
- `chemicals.quantity` — used in `scopeLowStock()` and `scopeAvailable()` but not indexed
- `borrow_records.user_id` — has FK constraint (auto-indexed by MySQL), but combined with `status` would be better as a composite index for per-user borrow queries

### 3.5 `description` Column Type Inconsistency

- `plant_species.description` is `string` (VARCHAR 255) — truncates long descriptions
- `plant_varieties.description` is `text` — unlimited
- `chemicals.description` is `text` — unlimited
- `equipment.description` is `text` — unlimited

The `plant_species` migration should use `text()` for consistency.

---

## 🗄️ 4. Database Design Issues

### 4.1 Users Table Missing `email_verified_at`

**File:** `database/migrations/2026_02_25_041254_create_users_table.php`

The migration does not create the `email_verified_at` column, yet Fortify is configured to handle email verification (`verifyEmailView`). The `ProfileController::update()` also references it:

```php
if ($request->user()->isDirty('email')) {
    $request->user()->email_verified_at = null;
}
```

This will fail silently or error if the column doesn't exist.

**Fix:** Add `$table->timestamp('email_verified_at')->nullable();` to the users migration.

### 4.2 `plant_specy_id` Typo in Column Names

The foreign key `plant_specy_id` is used across `plant_varieties`, `plant_samples`, and `plant_stocks`. The correct singular of "species" is "species" (irregularly, it's the same word). While renaming now would be a breaking change, this should be documented as a known tech debt.

### 4.3 Enum Values Hardcoded in Migrations

Migrations use raw enum strings instead of referencing the PHP enum classes:

```php
$table->enum('role', ['admin', 'lab_manager', 'student'])->default('student');
$table->enum('status', ['available', 'borrowed', 'in_use', 'under_maintenance']);
```

If enum values are added or modified in the PHP enum, the DB constraint won't match. Consider using `string` columns with app-level enum validation instead of DB-level `ENUM`.

### 4.4 No `SoftDeletes` on Users Table

All inventory models (`Chemical`, `Equipment`, `PlantSpecies`, etc.) use `SoftDeletes`, but the `User` model does **not**. This means:

- Deleted users can't be recovered
- FK constraints (`borrow_records.user_id`, `transactions.user_id`) use `restrictOnDelete`, so deleting a user with history will fail with a DB error
- No audit trail for user deletions

**Recommendation:** Add `SoftDeletes` to the User model and migration.

### 4.5 `personal_access_tokens` Table Is Unused

The project uses JWT auth, not Sanctum tokens. The `personal_access_tokens` migration and `HasApiTokens` trait on `User` are dead code.

**Recommendation:** Remove the migration, and remove `HasApiTokens` from the User model unless Sanctum tokens are planned.

### 4.6 Transactions `quantity` as `decimal(8,2)` but BorrowRecord `quantity` as `unsignedInteger`

Transactional quantities are decimal (allowing 0.5 liters of chemical) but borrow quantities are integer. This inconsistency could cause precision mismatches in the audit trail.

---

## 🧹 5. Code Quality Problems

### 5.1 UserController: The Outlier

`UserController` breaks every convention followed by the rest of the codebase:

| Convention        | Other Controllers   | UserController                   |
| ----------------- | ------------------- | -------------------------------- |
| Validation        | FormRequest classes | Inline `$request->validate()`    |
| Response format   | API Resources       | Manual `$this->userArray()`      |
| Password handling | No `Hash::make()`   | `Hash::make()` (double hash bug) |

This should be refactored to match the project's patterns.

### 5.2 Missing Return Type Hints

**Files:** `app/Http/Controllers/Api/AuthController.php`

All methods in `AuthController` lack return type declarations:

```php
public function register(RegisterRequest $request)   // ← no return type
public function login(LoginRequest $request)          // ← no return type
public function profile()                             // ← no return type
```

All other controllers properly declare `: JsonResponse`.

### 5.3 Unused Imports & Dead Code

- `CreateChemicalRequest` and `CreateEquipmentRequest` are likely scaffold remnants (empty rules, `authorize() = false`). Delete them.
- `DashboardResource` returns `parent::toArray()` — default behavior. Dead code.
- `DashboardService` and `SampleService` are empty files.

### 5.4 Inconsistent Namespace Casing

- `app/Http/Requests/auth/LoginRequest.php` — lowercase `auth` directory
- `app/Http/Requests/Chemical/StoreChemicalRequest.php` — uppercase `Chemical` directory

PSR-4 autoloading on case-sensitive filesystems (Linux) requires exact case matches. This is a latent portability bug.

### 5.5 Magic Strings in Seeders

Borrow records and transactions use string morph types:

```php
'borrowable_type' => 'equipment',   // ← magic string
'borrowable_type' => 'chemical',    // ← magic string
```

These must match the morph map in `AppServiceProvider`. If the map changes and seeders don't, data integrity breaks. Use constants or the model's `getMorphClass()`:

```php
'borrowable_type' => (new Equipment)->getMorphClass(),
```

### 5.6 No PHPDoc on Service Methods

`BorrowService` has good docblocks, but `StockService` and `TransactionService` lack `@param` and `@return` annotations. For a scientific lab system, thorough documentation is important.

---

## ⚙️ 6. Configuration & DevOps Risks

### 6.1 No Global Exception Handler for API

**File:** `bootstrap/app.php`

Only `AuthenticationException` is caught for JSON responses. Other exceptions (validation, model not found, server errors) will render as HTML in API requests.

**Fix:** Add handlers for common exceptions:

```php
$exceptions->render(function (ModelNotFoundException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json(['message' => 'Resource not found.'], 404);
    }
});

$exceptions->render(function (NotFoundHttpException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json(['message' => 'Endpoint not found.'], 404);
    }
});
```

### 6.2 CORS Configuration Is Development-Only

**File:** `config/cors.php`

```php
'allowed_origins' => [
    'http://localhost:8080',
    'http://localhost:5173',
    // ... more localhost variants
],
```

No production domain is configured. This will block all frontend requests in production.

**Fix:** Use environment-driven configuration:

```php
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')),
```

### 6.3 No API Versioning

All routes are at `/api/...` with no version prefix. Adding v2 endpoints later will be painful.

**Recommendation:** Use `/api/v1/...` prefix now:

```php
->withRouting(
    api: __DIR__.'/../routes/api.php',
    apiPrefix: 'api/v1',
)
```

### 6.4 No Logging or Monitoring

- No structured logging in controllers or services
- No audit log for destructive operations (delete chemical, delete user)
- No Sentry, Bugsnag, or similar error tracking
- No health check endpoint beyond `/up`

### 6.5 Missing `.env.example` Review

The JWT secret must be set. If `JWT_SECRET` is missing, authentication fails silently. Consider adding a boot-time check:

```php
throw_if(empty(config('jwt.secret')), 'JWT_SECRET is not set.');
```

### 6.6 Future Migration Timestamps (2026)

All migration files are dated 2026. This is unusual and may cause confusion. While functionally harmless, it suggests the timestamps were manually set.

---

## 📈 7. Scalability Risks

### 7.1 No Queue or Job Infrastructure

All operations are synchronous:

- Transaction logging is inline
- No email notifications for overdue borrows
- No background jobs for expiry checks

For a lab with many users, borrow operations touching multiple tables (BorrowService) should be wrapped in background jobs.

### 7.2 No File/Image Upload Handling

Many models have `image_url` fields validated as URL strings. There's no actual file upload endpoint. When this is implemented, it will need:

- Storage disk configuration
- Validation (file size, type)
- Virus scanning for lab documents

### 7.3 BorrowService Doesn't Handle PlantSample/PlantStock

`BorrowService::assertBorrowable()` only handles `Equipment` and `Chemical`:

```php
if ($item instanceof Equipment) { ... }
elseif ($item instanceof Chemical) { ... }
// ← PlantSample and PlantStock: no borrowing validation!
```

But `StoreBorrowRecordRequest` allows `plant_sample` as a borrowable type. Borrowing a plant sample will silently succeed without stock validation.

### 7.4 No Borrow Limit Enforcement

`BorrowLimitExceededException` exists but is **never thrown** anywhere in the codebase. There's no check for maximum active borrows per user.

---

## 🧪 8. Testing Coverage

### 8.1 Current Test State

The project has Pest tests but they are primarily for the **web (Inertia)** auth flows:

| Test File                     | Coverage                   |
| ----------------------------- | -------------------------- |
| `Auth/AuthenticationTest`     | Web login/logout (Fortify) |
| `Auth/RegistrationTest`       | Web registration (Fortify) |
| `Auth/PasswordResetTest`      | Web password reset         |
| `Settings/PasswordUpdateTest` | Web password change        |
| `Settings/ProfileUpdateTest`  | Web profile update         |
| `Feature/ChemicalTest`        | Chemical CRUD              |
| `Feature/EquipmentTest`       | Equipment CRUD             |
| `Feature/PlantSpeciesTest`    | Species CRUD               |
| `Feature/PlantVarietyTest`    | Variety CRUD               |
| `Feature/PlantSampleTest`     | Sample CRUD                |
| `Feature/PlantStockTest`      | Stock CRUD                 |
| `Feature/BorrowRecordTest`    | Borrow operations          |

### 8.2 Missing Test Coverage

- **❌ API JWT Authentication** — no tests for login, register, refresh, logout via JWT
- **❌ RBAC / Permissions** — no tests for role assignment, permission checks, admin middleware
- **❌ UserController** — no tests for user CRUD API
- **❌ BorrowService** — no unit tests for the core business logic
- **❌ StockService** — no unit tests
- **❌ Authorization** — no tests verifying students can't delete chemicals, etc.
- **❌ Edge cases** — no tests for double borrow, overdue transitions, expired chemical borrow rejection

---

## 🧼 9. Clean Code Violations

### 9.1 God Controller Pattern (Partial)

`RoleController` and `PermissionController` handle CRUD + relationship management in a single controller (145+ lines). Consider extracting `RolePermissionController` and `RoleUserController`.

### 9.2 Config Values in Code

```php
// AdminMiddleware
$user = auth('api')->user();  // ← hardcoded guard name
```

```php
// RolePermissionSeeder
private string $guard = 'api';  // ← hardcoded
```

Use `config('auth.defaults.guard')` or a constant.

### 9.3 No Interface/Contract for Services

Services are concrete classes with no interfaces. For testability, define contracts:

```php
interface BorrowServiceContract {
    public function borrow(Model $item, User $user, ...): BorrowRecord;
    public function returnItem(BorrowRecord $record, ...): BorrowRecord;
}
```

### 9.4 Mixed Response Formats

- Most controllers: `return new ChemicalResource($chemical);`
- UserController: `return response()->json($this->userArray($user));`
- AuthController: `return response()->json(['user' => [...], 'token' => $token]);`
- RoleController: `return response()->json(['role' => $role, ...]);`

**Recommendation:** Standardize all responses to use API Resources or a consistent envelope.

---

## 🏁 10. Final Verdict

### What's Done Well ✅

1. **Polymorphic design** — Single `transactions` and `borrow_records` tables serve all inventory types via morphs. Clean, extensible.
2. **Enum usage** — 12 backed enums replace magic strings throughout the app. Excellent type safety.
3. **Morph map enforcement** — `Relation::enforceMorphMap()` prevents morph type drift across DB/code.
4. **Service layer (partial)** — `BorrowService` properly encapsulates the borrow → return lifecycle with DB transactions.
5. **FormRequest validation** — Most controllers use dedicated FormRequest classes with robust rules.
6. **API Resources** — Consistent response transformations for domain models.
7. **DB transactions** — All write operations in controllers are wrapped in `DB::transaction()`.
8. **Soft deletes** — All inventory models support soft deletion.
9. **Custom exceptions** — `InsufficientStockException`, `ItemNotBorrowableException` render proper JSON.
10. **Seeder quality** — Realistic named data + random factory data. Good test coverage.

### What Needs Immediate Attention 🔴

| Priority | Issue                                                | Effort  |
| -------- | ---------------------------------------------------- | ------- |
| **P0**   | Add `auth:api` middleware to ALL resource routes     | 30 min  |
| **P0**   | Fix double password hashing in `UserController`      | 10 min  |
| **P0**   | Lock registration to `student` role only             | 10 min  |
| **P1**   | Assign Spatie role during API registration           | 15 min  |
| **P1**   | Add rate limiting to auth endpoints                  | 15 min  |
| **P1**   | Add `email_verified_at` column to users table        | 10 min  |
| **P1**   | Add global API exception handler                     | 30 min  |
| **P2**   | Refactor UserController (FormRequest + Resource)     | 1 hr    |
| **P2**   | Add authorization Policies for all models            | 2-3 hrs |
| **P2**   | Write JWT auth + RBAC tests                          | 2-3 hrs |
| **P2**   | Delete dead code (empty services, scaffold requests) | 15 min  |
| **P3**   | Add PlantSample/PlantStock to BorrowService          | 1 hr    |
| **P3**   | Add API versioning (`/api/v1/`)                      | 30 min  |
| **P3**   | Environment-driven CORS config                       | 15 min  |
| **P3**   | Consolidate dual role system                         | 1-2 hrs |

### Estimated Time to Production-Ready: **2-3 focused development days**

The core domain logic is sound. The primary work is security hardening, consistency cleanup, and test coverage. The architecture doesn't need a rewrite — it needs **finishing**.

---

_End of audit._
