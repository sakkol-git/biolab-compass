# 🔬 SCOPE.md vs Implementation — Alignment Audit

> **Auditor Level:** World-Class Laravel Architect  
> **Date:** 2025-07-02  
> **Framework:** Laravel 12 · PHP 8.4 · JWT · Spatie Permission v7  
> **Source of Truth:** `docs/SCOP.md` (6 Modules)  
> **Codebase Analyzed:** 9 Models, 13 Controllers, 3 Services, 9 Policies, 20 FormRequests, 9 Resources, 12 Enums, 14 Migrations, 11 Seeders, 9 Factories

---

## 1. Executive Scope Alignment Summary

| #   | Module                | Scope Verdict         | Coverage | Status                                                                                           |
| --- | --------------------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| 1   | Plant Management      | Partially Implemented | **65%**  | 🟡 CRUD solid; stock tracking disconnected from CRUD; ownership not linked to User               |
| 2   | Chemical Management   | Weakly Implemented    | **30%**  | 🔴 CRUD works; batch tracking, usage logging, and expiry alerts entirely missing                 |
| 3   | Equipment Management  | Partially Implemented | **50%**  | 🟡 CRUD + borrow/return work; approval workflow and maintenance tracking missing                 |
| 4   | Auth & Authorization  | Mostly Implemented    | **75%**  | 🟢 JWT + RBAC complete; audit logging only covers borrow/return, not all actions                 |
| 5   | User Profile          | Barely Implemented    | **15%**  | 🔴 Basic profile endpoint exists; achievements, documents, contributions, activity — all missing |
| 6   | Dashboard & Reporting | Not Implemented       | **0%**   | ⚫ Zero code exists for dashboard, reports, or export                                            |

### **Overall Scope Coverage: ~40%**

The system has a solid **foundation layer** (models, migrations, auth, RBAC, policies, CRUD endpoints) but is missing **all the features that make it a lab management system** — the business logic, workflows, tracking, and reporting that distinguish it from a generic scaffold.

---

## 2. Module-by-Module Scope Comparison

---

### Module 1: Plant Management — 65%

| Scope Feature                                        | Status         | Evidence                                                                                                                                                                                                                                                          |
| ---------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Manage Species (name, code, image, description)      | ✅ Implemented | `PlantSpeciesController` with full CRUD, `PlantSpeciesResource`, `StorePlantSpeciesRequest`                                                                                                                                                                       |
| Manage Variety (name, code, image, description)      | ✅ Implemented | `PlantVarietyController` with full CRUD, belongs-to Species                                                                                                                                                                                                       |
| Manage Sample (name, code, image, description)       | ✅ Implemented | `PlantSampleController` with full CRUD, owner_name, department, origin, quantity                                                                                                                                                                                  |
| Stock Management via transactions (IN/OUT/ADJUST)    | 🟡 Partial     | `PlantStock` model + `StockService` (consume/reserve/release) exist but **are NOT called from any controller or route**. No `/api/stocks/{id}/adjust` endpoint. `TransactionService.log()` only called from `BorrowService`, never from stock or CRUD operations. |
| Ownership & Contribution: each sample linked to user | 🟡 Partial     | `PlantSample.owner_name` is a **string field**, not a FK to User. No `user_id`/`contributor_id` column. No way to query "all samples contributed by user X" via relationship.                                                                                     |
| Display detailed info per species/variety/sample     | ✅ Implemented | API Resources return structured JSON with nested relationships                                                                                                                                                                                                    |

**Critical Gaps:**

1. **`StockService` is dead code** — exists but is never injected or called from any controller. The `PlantStockController` does raw `create()`/`update()`/`delete()` without going through the service.
2. **No automatic transaction logging** — when a user creates a plant species, updates a chemical, or deletes equipment, **no Transaction record is created**. The `TransactionService` is only used in `BorrowService`.
3. **`owner_name` is a free-text field** — the scope says "each sample linked to user" implying a relationship, but the DB only stores an arbitrary string.

---

### Module 2: Chemical Management — 30%

| Scope Feature                                              | Status         | Evidence                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD chemical master data (name, code, safety info, image) | ✅ Implemented | `ChemicalController` full CRUD, `ChemicalResource`, validation                                                                                                                                                                                             |
| Batch-based tracking (quantity, expiry, supplier)          | ❌ Missing     | No `ChemicalBatch` model. The `chemicals` table has a single `quantity` and `expiry_date` — not per-batch. **No `supplier` column** in the migration at all.                                                                                               |
| Usage tracking (who used, how much, when, purpose)         | ❌ Missing     | No `ChemicalUsageLog` model, controller, or endpoint. No way to record "User X used 50ml of HCl for experiment Y on date Z."                                                                                                                               |
| Expiry alerts (notifications for near-expiry/expired)      | ❌ Missing     | `Chemical::scopeExpiringSoon()` and `Chemical::scopeExpired()` query scopes exist, but **no Laravel Notification, no scheduled command, no email/push, no alert endpoint**. The scopes are only usable via `?expiring_soon=true` query param on GET index. |

**Critical Gaps:**

1. **No batch architecture** — the scope explicitly says "batch-based tracking" but the system has a flat `chemicals` table. Real chemical management needs multiple batches per chemical (e.g., HCl Batch #1 expires Jan 2026, Batch #2 expires Mar 2026).
2. **No supplier tracking** — migration has no `supplier`, `supplier_contact`, `batch_number`, or `lot_number` column.
3. **No usage log** — this is a core scope requirement for "full traceability of chemical usage" and is completely absent.
4. **Expiry alerts are passive** — no proactive notification system. A lab manager must manually call the API with `?expiring_soon=true` to discover near-expiry chemicals.

---

### Module 3: Equipment Management — 50%

| Scope Feature                                                        | Status         | Evidence                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD equipment info (name, code, serial, manufacturer, status)       | ✅ Implemented | `EquipmentController` full CRUD, rich model with serial_number, manufacturer, purchase_date, etc.                                                                                                                                                    |
| Borrow & Return Workflow                                             | 🟡 Partial     | `BorrowService` handles borrow + return with stock management. `BorrowRecordController` has store/return/overdue endpoints. Equipment status auto-updates (available ↔ borrowed).                                                                    |
| Approval System                                                      | ❌ Missing     | Scope says "approval system" but `BorrowStatus` only has `borrowed`, `returned`, `overdue`. **No `pending`, `approved`, `rejected` states.** No `approved_by` or `approved_at` fields. Anyone with `borrows.create` permission can instantly borrow. |
| Automatic status updates                                             | ✅ Implemented | `BorrowService.decrementStock()` sets equipment to BORROWED; `incrementStock()` restores to AVAILABLE.                                                                                                                                               |
| Maintenance Tracking (repair history, technician, next service date) | ❌ Missing     | **No `MaintenanceRecord` model**. No `last_maintenance_date`, `next_service_date`, `technician_name` columns or tables. No maintenance endpoints.                                                                                                    |

**Critical Gaps:**

1. **No approval workflow** — the scope explicitly mentions an approval system. In a real lab, a student requests to borrow equipment → a lab manager approves or rejects. Currently, `store()` creates an immediately-active borrow.
2. **No maintenance tracking** — this is a full sub-module in the scope (repair history, technician info, next service date) and has zero implementation.
3. **Borrow return permission granularity** — students can create borrows but the `borrows.return` permission is only on admin/manager. However, the policy doesn't check if the user owns the borrow record.

---

### Module 4: Authentication & Authorization — 75%

| Scope Feature                             | Status         | Evidence                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JWT-based login with encrypted passwords  | ✅ Implemented | `php-open-source-saver/jwt-auth`, `AuthController` login/logout/refresh, `password => 'hashed'` cast                                                                                                                                                                                                                                            |
| RBAC: Admin (full access)                 | ✅ Implemented | `admin` role with all 24 permissions via `RolePermissionSeeder`                                                                                                                                                                                                                                                                                 |
| RBAC: Lab Manager (manage resources)      | ✅ Implemented | `lab-manager` role with 17 permissions (all resource perms, no user/role management)                                                                                                                                                                                                                                                            |
| RBAC: Student (add/update only)           | 🟡 Partial     | `student` role has `plants.view`, `chemicals.view`, `equipment.view`, `borrows.view`, `borrows.create`, `transactions.view` — this is **read-only + borrow**, not "add/update". The scope says students should be able to "add/update data only" but the student role lacks `*.create` and `*.edit` permissions for plants/chemicals/equipment. |
| Audit logging: track all critical actions | 🟡 Partial     | `Transaction` model logs `borrow` and `return` actions (via `BorrowService`). But **CRUD operations (create/update/delete) on plants, chemicals, equipment, users do NOT create Transaction records**. No `ActivityLog` or `AuditLog` model.                                                                                                    |

**Critical Gaps:**

1. **Student permissions don't match scope** — scope says "add/update data only" but student role is essentially read-only (view + borrow only). No `plants.create`, `plants.edit`, `chemicals.create`, etc.
2. **Audit logging only covers borrow lifecycle** — creating a chemical, updating equipment, deleting a species, changing a user's role — none of these are logged. The `Transaction` model and `TransactionService` could easily be extended but currently aren't.
3. **No login audit** — no record of when users login, from what IP, failed attempts, etc.

---

### Module 5: User Profile — 15%

| Scope Feature                                        | Status     | Evidence                                                                                                                                                                                                                         |
| ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personal profile page                                | 🟡 Partial | `GET /api/auth/profile` returns `id`, `name`, `email`, `phone`, `role`, `permissions`. No profile photo, bio, or editable profile endpoint via API. Settings routes exist in `routes/settings.php` but are web/Inertia, not API. |
| Manage achievements & document links                 | ❌ Missing | No `Achievement`, `UserAchievement`, or `UserDocument` model/table/migration. Zero implementation.                                                                                                                               |
| Track contributions (samples added, chemicals added) | ❌ Missing | No API endpoint returns "User X added N samples, M chemicals." Transaction model _could_ be queried for this, but no controller/endpoint does it.                                                                                |
| View overall activity summary                        | ❌ Missing | No activity summary endpoint. No aggregation of user's borrows, transactions, contributions.                                                                                                                                     |

**Critical Gaps:**

1. **Profile is read-only and minimal** — just returns the JWT user's basic info. No update endpoint for profile via API.
2. **Three entire features are zero-implemented** — achievements, documents, and activity summary have no models, migrations, or controllers.
3. **Contribution tracking is architecturally possible** (Transaction model records `user_id`) but **no endpoint exposes it**.

---

### Module 6: Dashboard & Reporting — 0%

| Scope Feature                                                   | Status     | Evidence                                                                                               |
| --------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Dashboard: overview of plants, chemicals, equipment, activities | ❌ Missing | No `DashboardController`, no `/api/dashboard` route. Previous `DashboardService` was deleted as empty. |
| Reports: inventory report                                       | ❌ Missing | No report controllers, services, or endpoints                                                          |
| Reports: chemical usage                                         | ❌ Missing | No chemical usage data exists to report on                                                             |
| Reports: expired items                                          | ❌ Missing | Could be built from `Chemical::expired()` scope but no report endpoint                                 |
| Reports: borrowed equipment                                     | ❌ Missing | Could be built from `BorrowRecord::active()` scope but no report endpoint                              |
| Reports: user activity                                          | ❌ Missing | No user activity aggregation                                                                           |
| Export to PDF / Excel                                           | ❌ Missing | No `maatwebsite/excel` or `barryvdh/laravel-dompdf` packages in `composer.json`                        |

**Critical Gaps:**

1. **This entire module is a blank slate** — not a single line of code exists for dashboard or reporting.
2. **No export infrastructure** — no PDF/Excel libraries installed.
3. **This module is critical for the scope** — "Professional reporting for management & research" is a key benefit listed in the scope document.

---

## 3. Critical Missing Features (Priority-Ordered)

### P0 — Scope-Breaking Gaps (must implement to claim scope compliance)

| #   | Missing Feature                    | Impact                                                                                                                       | Effort                                                                                                                   |
| --- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Chemical Batch Tracking**        | Scope explicitly requires batch-based tracking with supplier. Current flat model cannot track multiple batches per chemical. | High — requires new `chemical_batches` table, model, controller, migration                                               |
| 2   | **Chemical Usage Logging**         | Scope explicitly requires "log who used how much, when, and purpose." Zero implementation.                                   | Medium — new `ChemicalUsageLog` model + controller                                                                       |
| 3   | **Equipment Approval Workflow**    | Scope says "approval system." Current borrow is instant.                                                                     | Medium — add `pending`/`approved`/`rejected` states to `BorrowStatus`, add `approved_by`/`approved_at` to borrow_records |
| 4   | **Equipment Maintenance Tracking** | Scope says "repair history, technician info, next service date." Zero implementation.                                        | Medium — new `MaintenanceRecord` model + controller                                                                      |
| 5   | **Dashboard API**                  | Entire Module 6 is missing. Scope lists it as a core module.                                                                 | Medium — new `DashboardController` with aggregation queries                                                              |
| 6   | **Reporting Endpoints**            | Scope lists 5 specific reports. Zero implemented.                                                                            | Medium-High — new `ReportController` with multiple endpoints                                                             |
| 7   | **PDF/Excel Export**               | Scope explicitly lists export capability. No packages installed.                                                             | Medium — install `maatwebsite/excel` + `barryvdh/laravel-dompdf`, create export classes                                  |

### P1 — Logical Gaps (the implemented features have incomplete logic)

| #   | Gap                                          | Current State                                                                                                  | Required State                                                                                                                 |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **CRUD doesn't log transactions**            | Only `BorrowService` calls `TransactionService`. Creating/updating/deleting any resource is NOT recorded.      | Every CRUD operation should create a Transaction via `TransactionService::log()`                                               |
| 2   | **`StockService` is dead code**              | `StockService` has consume/reserve/release methods but is never injected into any controller.                  | Should be used by `PlantStockController` for stock adjustments; add dedicated `/api/plant-stocks/{id}/adjust` endpoint         |
| 3   | **`PlantSample.owner_name` is a text field** | Free-text, not a FK to users. Cannot link contributions to users.                                              | Add `user_id`/`contributor_id` FK to `plant_samples` (keep `owner_name` as display name)                                       |
| 4   | **Student role is read-only**                | Student has `*.view` + `borrows.create` only. Scope says "add/update data only."                               | Add `plants.create`, `plants.edit`, `chemicals.create`, `chemicals.edit`, `equipment.create`, `equipment.edit` to student role |
| 5   | **Expiry alerts are passive-only**           | Scopes exist but no proactive notification.                                                                    | Add `php artisan chemicals:check-expiry` scheduled command + Laravel Notifications                                             |
| 6   | **No borrow ownership check**                | BorrowRecordPolicy checks permission but not if user owns the record. A student can't return their own borrow. | Policy should allow users to view/return their own borrows regardless of role                                                  |

### P2 — Missing Models & Entities

| Model               | Table                       | Purpose                                                                   | Related To                                           |
| ------------------- | --------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `ChemicalBatch`     | `chemical_batches`          | Track individual batches per chemical (qty, expiry, supplier, lot number) | Chemical (belongsTo)                                 |
| `ChemicalUsageLog`  | `chemical_usage_logs`       | Record who used how much chemical, when, for what purpose                 | Chemical/ChemicalBatch (belongsTo), User (belongsTo) |
| `MaintenanceRecord` | `maintenance_records`       | Equipment repair history, technician, cost, next service date             | Equipment (belongsTo), User (performedBy)            |
| `Achievement`       | `achievements`              | Achievement definitions (name, description, criteria)                     | —                                                    |
| `UserAchievement`   | `user_achievements` (pivot) | Track which users earned which achievements                               | User (belongsTo), Achievement (belongsTo)            |
| `UserDocument`      | `user_documents`            | Links to uploaded documents/certificates                                  | User (belongsTo)                                     |

---

## 4. Logical & Architectural Gaps

### 4.1 Dead Code & Disconnected Services

| Code                                             | Issue                                                                                                                                                                            |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StockService` (app/Services/)                   | Has `consume()`, `reserve()`, `release()` — never injected or used anywhere. `PlantStockController` does raw Eloquent, bypassing this service.                                   |
| `HasTransactions` trait                          | Applied to 6 models but the `transactions()` relationship is never utilized in any controller response (no eager-loading, no API endpoint returns transaction history per item). |
| `BorrowLimitExceededException`                   | Exception class exists but is never thrown. No borrow limit logic is implemented.                                                                                                |
| `TransactionAction::CONSUMED/HARVESTED/DISPOSED` | Enum values exist but no code path ever logs these actions. Only `ADDED`, `BORROWED`, `RETURNED` are used (in seeders and BorrowService).                                        |

### 4.2 Schema Design Weaknesses

| Issue                             | Current                                              | Better Design                                                                                                                   |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Chemical has no supplier          | `chemicals` table has no supplier column             | Add `supplier_name`, `supplier_contact`, OR a separate `suppliers` table with FK                                                |
| Chemical is flat, not batch-based | Single `quantity`/`expiry_date` per chemical         | `chemicals` table = master data; `chemical_batches` table = per-batch qty, expiry, supplier, lot #                              |
| No file upload support            | `image_url` is a text field; no `Storage` disk usage | Add file upload endpoint, store to S3/local, return URL                                                                         |
| Equipment no maintenance fields   | Equipment table has no maintenance columns           | Either add `last_maintenance_at`/`next_maintenance_at` to equipment, or create separate `maintenance_records` table (preferred) |
| BorrowRecord no approval fields   | No `approved_by`, `approved_at`, `rejected_reason`   | Add these columns + `pending` status to support approval workflow                                                               |
| PlantSample owner not FK          | `owner_name` is varchar, not FK                      | Add `contributor_id` FK → users + keep `owner_name` for display                                                                 |

### 4.3 Scalability Concerns

| Area                        | Issue                                            | Impact                                                                     |
| --------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| No caching                  | No Redis/cache layer on any read endpoint        | High-traffic will hit DB on every request                                  |
| No pagination configuration | Fixed `paginate(10)` or `paginate(15)` hardcoded | Should accept `?per_page=N` on all endpoints (some controllers already do) |
| No query result caching     | Chemical expiry checks run against DB every time | `chemicals:check-expiry` should cache results                              |
| No queue system             | All operations are synchronous                   | Notifications, exports should use queues                                   |
| No API versioning           | Routes are at `/api/` with no version prefix     | `/api/v1/` needed for backward compatibility                               |

---

## 5. Enterprise-Level Improvements

### 5.1 Architecture Improvements

| Improvement                          | Description                                                                                                    | Benefit                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Implement Repository Pattern**     | Add repositories between controllers and models for complex queries                                            | Testability, separation of concerns, swap implementations                     |
| **Event-Driven Transaction Logging** | Dispatch events (`PlantSpeciesCreated`, `ChemicalUpdated`) → listeners log Transactions                        | Decouples logging from controllers, ensures nothing is missed                 |
| **Service Layer Consistency**        | Currently only `BorrowService`, `StockService`, `TransactionService` exist. Other controllers do raw Eloquent. | Create services for Chemical, Equipment, Plant operations with business logic |
| **API Versioning**                   | Prefix all routes with `/api/v1/`                                                                              | Backward-compatible API evolution                                             |
| **Response Envelope**                | Standardize all responses: `{ status, data, message, meta }`                                                   | Consistent client-side parsing                                                |

### 5.2 Missing Infrastructure

| Component                 | What to Add                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scheduled Commands**    | `chemicals:check-expiry` (daily, send notifications), `borrows:check-overdue` (daily, update status + notify)                               |
| **Laravel Notifications** | `ExpiryAlertNotification`, `OverdueBorrowNotification`, `BorrowApprovalNotification` — via mail + database channels                         |
| **File Upload**           | `POST /api/upload` endpoint → store to `storage/app/public` or S3 → return URL for `image_url` fields                                       |
| **Activity Logging**      | Install `spatie/laravel-activitylog` OR extend current `Transaction` model to log ALL system events                                         |
| **API Documentation**     | Install `knuckleswtf/scribe` or use OpenAPI spec → auto-generate docs                                                                       |
| **Test Coverage**         | Current tests cover basic CRUD. Missing: BorrowService edge cases, StockService, policy authorization, validation failures, error responses |

---

## 6. Structured Development Roadmap

### Phase 1: Complete Core Scope (Weeks 1-2)

**Goal:** Bring Module 2 and Module 3 to scope compliance

| Task                                                                   | Module | Priority | Effort |
| ---------------------------------------------------------------------- | ------ | -------- | ------ |
| Create `chemical_batches` migration + `ChemicalBatch` model            | 2      | P0       | 4h     |
| Create `ChemicalBatchController` with CRUD                             | 2      | P0       | 4h     |
| Add `supplier_name`/`supplier_contact` to chemicals or batches         | 2      | P0       | 2h     |
| Create `chemical_usage_logs` migration + `ChemicalUsageLog` model      | 2      | P0       | 4h     |
| Create `ChemicalUsageController` (POST to log usage, GET to list)      | 2      | P0       | 4h     |
| Add `pending`/`approved`/`rejected` to `BorrowStatus` enum + migration | 3      | P0       | 3h     |
| Add `approved_by`/`approved_at`/`rejected_reason` to borrow_records    | 3      | P0       | 3h     |
| Create `BorrowApprovalController` (approve/reject endpoints)           | 3      | P0       | 4h     |
| Create `maintenance_records` migration + `MaintenanceRecord` model     | 3      | P0       | 4h     |
| Create `MaintenanceRecordController` with CRUD                         | 3      | P0       | 4h     |

### Phase 2: Business Logic Completion (Week 3)

**Goal:** Wire up transaction logging, fix dead code, complete Module 4

| Task                                                                              | Module | Priority | Effort |
| --------------------------------------------------------------------------------- | ------ | -------- | ------ |
| Wire `TransactionService::log()` into all CRUD controllers (create/update/delete) | 1,2,3  | P1       | 6h     |
| Wire `StockService` into `PlantStockController` + add `/adjust` endpoint          | 1      | P1       | 4h     |
| Add `contributor_id` FK to `plant_samples` migration                              | 1      | P1       | 2h     |
| Fix student role permissions (add create/edit for plants/chemicals/equipment)     | 4      | P1       | 1h     |
| Create `chemicals:check-expiry` Artisan command + schedule daily                  | 2      | P1       | 3h     |
| Create `borrows:check-overdue` Artisan command + schedule daily                   | 3      | P1       | 3h     |
| Create `ExpiryAlertNotification` + `OverdueBorrowNotification`                    | 2,3    | P1       | 4h     |
| Add borrow ownership check to `BorrowRecordPolicy`                                | 3      | P1       | 2h     |

### Phase 3: Dashboard & Reporting (Week 4)

**Goal:** Implement Module 6

| Task                                                             | Module | Priority | Effort   |
| ---------------------------------------------------------------- | ------ | -------- | -------- |
| Create `DashboardController` with `GET /api/dashboard`           | 6      | P0       | 4h       |
| — Total species/varieties/samples/stocks counts                  | 6      | P0       | included |
| — Total chemicals, low-stock, expired, expiring-soon counts      | 6      | P0       | included |
| — Total equipment, available, borrowed, under-maintenance counts | 6      | P0       | included |
| — Active borrows, overdue borrows counts                         | 6      | P0       | included |
| — Recent transactions (last 7 days)                              | 6      | P0       | included |
| Create `ReportController`                                        | 6      | P0       | 8h       |
| — `GET /api/reports/inventory` (all stock levels)                | 6      | P0       | included |
| — `GET /api/reports/chemical-usage` (usage logs aggregated)      | 6      | P0       | included |
| — `GET /api/reports/expired-items` (expired chemicals)           | 6      | P0       | included |
| — `GET /api/reports/borrowed-equipment` (active borrows)         | 6      | P0       | included |
| — `GET /api/reports/user-activity` (per-user transaction counts) | 6      | P0       | included |
| Install `maatwebsite/excel` + create export classes              | 6      | P0       | 4h       |
| Install `barryvdh/laravel-dompdf` + create PDF export            | 6      | P0       | 4h       |

### Phase 4: User Profile Completion (Week 5)

**Goal:** Implement Module 5

| Task                                                                  | Module | Priority | Effort |
| --------------------------------------------------------------------- | ------ | -------- | ------ |
| Create `achievements` + `user_achievements` migrations + models       | 5      | P0       | 4h     |
| Create `AchievementController` (admin CRUD + user earn/list)          | 5      | P0       | 4h     |
| Create `user_documents` migration + `UserDocument` model              | 5      | P0       | 3h     |
| Create `UserDocumentController` (upload/list/delete)                  | 5      | P0       | 4h     |
| Create `GET /api/profile/contributions` endpoint                      | 5      | P0       | 3h     |
| Create `GET /api/profile/activity` endpoint (transaction aggregation) | 5      | P0       | 3h     |
| Add `PATCH /api/profile` for self-update (name, phone, avatar)        | 5      | P1       | 2h     |

### Phase 5: Polish & Enterprise Hardening (Week 6)

**Goal:** Production readiness

| Task                                                                    | Priority | Effort |
| ----------------------------------------------------------------------- | -------- | ------ |
| Add API versioning (`/api/v1/`)                                         | P2       | 2h     |
| Standardize response envelope `{ status, data, message, meta }`         | P2       | 4h     |
| Add Redis caching on read-heavy endpoints (dashboard, reports)          | P2       | 4h     |
| Install `spatie/laravel-activitylog` for comprehensive audit trail      | P2       | 4h     |
| Add file upload endpoint + S3 storage config                            | P2       | 4h     |
| Install `knuckleswtf/scribe` for auto-generated API docs                | P2       | 3h     |
| Write comprehensive Pest tests for new features (target: ≥80% coverage) | P2       | 12h    |
| Load testing with `artisan` benchmarks                                  | P3       | 4h     |

---

## 7. Final Evaluation

### Scorecard

| Dimension            | Score    | Notes                                                                              |
| -------------------- | -------- | ---------------------------------------------------------------------------------- |
| Scope Coverage       | **4/10** | Only ~40% of scope features have any implementation                                |
| Foundation Quality   | **8/10** | Models, migrations, RBAC, policies, FormRequests, resources are well-structured    |
| Business Logic       | **3/10** | Dead services, no transaction logging on CRUD, no workflows                        |
| Feature Completeness | **3/10** | 3 of 6 modules are ≤30% implemented; Module 6 is 0%                                |
| Code Quality         | **7/10** | Consistent patterns, strict types, enums, proper separation                        |
| Test Coverage        | **6/10** | 98 tests pass but only cover happy-path CRUD; no edge case or business logic tests |
| Production Readiness | **3/10** | No caching, no queues, no file uploads, no API docs, no versioning                 |

### **Overall: 4.9/10 — Foundation Complete, Business Logic Missing**

### Verdict

The project has **excellent scaffolding** — the model layer, database schema, authentication, authorization, and REST API structure are well-architected and follow Laravel conventions correctly. However, the **business logic that the scope document promises** is largely absent:

- **Chemicals** have no batch tracking, no usage logging, and no expiry notifications
- **Equipment** has no approval workflow and no maintenance tracking
- **Plants** have disconnected stock management with dead service code
- **User profiles** have no achievements, documents, or activity tracking
- **Dashboard and reporting** don't exist at all

The path forward is clear: the foundation doesn't need rebuilding — it needs **the domain features stacked on top**. The 5-phase roadmap above will bring the system to full scope compliance in approximately 6 weeks of focused development.
