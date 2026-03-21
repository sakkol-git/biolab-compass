# 🔬 Plant Lab Inventory — System Improvement Report

> **Date:** 2025-07-16  
> **Scope:** Full-stack system-level evaluation (Laravel 12 + React 18)  
> **Methodology:** Panel-of-experts analysis covering domain modeling, workflow design, UX architecture, data integrity, feature completeness, backend architecture, database design, and system consistency.

---

## Table of Contents

1. [Executive System Evaluation](#1-executive-system-evaluation)
2. [Major UX Problems](#2-major-ux-problems)
3. [Workflow Design Problems](#3-workflow-design-problems)
4. [Domain Modeling Issues](#4-domain-modeling-issues)
5. [Data Integrity Risks](#5-data-integrity-risks)
6. [Missing Essential Features](#6-missing-essential-features)
7. [Backend Architecture Improvements](#7-backend-architecture-improvements)
8. [Database Design Improvements](#8-database-design-improvements)
9. [System Consistency Problems](#9-system-consistency-problems)
10. [High-Impact Improvements](#10-high-impact-improvements)
11. [Long-Term Scalability Recommendations](#11-long-term-scalability-recommendations)
12. [Suggested Feature Roadmap](#12-suggested-feature-roadmap)
13. [Step-by-Step Refactoring Plan](#13-step-by-step-refactoring-plan)

---

## 1. Executive System Evaluation

### System Overview

The Plant Lab Inventory is a modular full-stack application managing plant tissue culture operations across four domains: **Inventory** (species, varieties, samples, stocks, chemicals, equipment), **Research** (experiments, growth logs, protocols, lab notebooks), **Business** (clients, contracts, payments, production forecasts, lab services), and **Core** (users, roles, permissions, auth).

### Architecture Strengths

| Area                        | Assessment                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modular Backend**         | Clean 4-module separation (Core, Inventory, Research, Business) with isolated Models/Controllers/Services/Policies per module. This is well above average for Laravel projects. |
| **Polymorphic Design**      | Transactions and BorrowRecords use `MorphTo`/`MorphMany` enabling a single audit trail across all inventory types — architecturally sound.                                      |
| **State Machine Enums**     | `ContractStatus`, `ExperimentStatus`, and `ProtocolStatus` implement `allowedTransitions()` with guard logic — proper finite state machine patterns.                            |
| **Generic CRUD Service**    | `InventoryCrudService` eliminates duplication across 7+ controllers with transactional create/update/delete + automatic audit logging.                                          |
| **Trait-Based Composition** | `HasActivityLogging`, `HasImageUpload`, `HasTransactions`, `ManagesBorrowableStock` — clean cross-cutting concerns.                                                             |
| **Frontend Architecture**   | Feature-based folder structure, lazy-loaded routes, TanStack Query for server state, Zod schemas for validation, shadcn/ui for consistent design.                               |

### Critical Gaps Identified

| Priority        | Count | Description                                                                         |
| --------------- | ----- | ----------------------------------------------------------------------------------- |
| **Critical**    | 7     | Data integrity risks, missing cross-module integration, broken domain relationships |
| **High**        | 12    | UX navigation problems, workflow gaps, missing essential features                   |
| **Medium**      | 15    | Architecture improvements, consistency issues, database optimizations               |
| **Enhancement** | 10    | Scalability, advanced features, developer experience                                |

### Overall Grade: **B-** (Good foundation, significant integration and data integrity gaps)

---

## 2. Major UX Problems

### UX-01: Flat Navigation Overload in Inventory Sidebar

**Problem:** The Inventory sidebar has 19 navigation items crammed into a single section with only surface-level grouping (`INVENTORY_GROUPS`). A user arriving at the inventory section sees: Dashboard, Plant Species, Plant Stock, Plant Varieties, Plant Samples, Chemicals, Equipment, Transactions, Borrow Records, Chemical Batches, Maintenance, Reports, Achievements, Documents, Users, Roles, Permissions, My Profile — all at once.

**Why it's a problem:** Cognitive overload. Research shows that users can effectively scan 5-7 items in a navigation group. 19 items creates decision paralysis, especially for new lab staff. Additionally, "Users", "Roles", and "Permissions" are admin functions mixed with inventory items, breaking the information scent.

**Real-world risk:** New students or lab assistants will feel overwhelmed, leading to reduced adoption and increased training costs. Users will frequently navigate to wrong sections.

**Recommended solution:**

1. Move "Users", "Roles", "Permissions" into a dedicated `/admin` section — these are NOT inventory functions
2. Collapse "Chemical Batches" into the "Chemicals" detail page (batches only make sense in context of a parent chemical)
3. Implement a role-based nav filter: students shouldn't see admin items at all
4. Add a "Favorites" or "Quick Access" section for frequently-used pages

---

### UX-02: Missing Breadcrumb Navigation for Hierarchical Data

**Problem:** The system has a deep entity hierarchy: Species → Varieties → Samples → Stocks. Detail pages use routes like `/inventory/products/species/:id`, but there are no breadcrumbs showing the user where they are in the hierarchy or how to navigate back.

**Why it's a problem:** Users drilling into a specific stock record have no visual trail showing: `Inventory > Plant Species > Banana > Variety: Grand Nain > Stock #42`. They must use the browser back button or sidebar, losing context.

**Real-world risk:** Lab workers tracking propagation batches across the Species→Variety→Sample→Stock chain will constantly lose their place, leading to data entry errors (selecting wrong species/variety).

**Recommended solution:**

1. Add a `<Breadcrumb />` component to all detail pages
2. Use the relationship chain (stock→sample→variety→species) to auto-generate breadcrumb trail
3. Make each breadcrumb segment a clickable link to the parent's detail page

---

### UX-03: Inconsistent URL Structure Between Lists and Details

**Problem:** List pages use `/inventory/plant-species` but detail pages use `/inventory/products/species/:id`. The "products" segment appears only in detail routes, creating a confusing mismatch:

- List: `/inventory/plant-species` → Detail: `/inventory/products/species/:id`
- List: `/inventory/plant-stock` → Detail: `/inventory/products/stock/:id`
- List: `/inventory/chemicals` → Detail: `/inventory/products/chemicals/:id`

**Why it's a problem:** This is a URL architecture anti-pattern. RESTful convention dictates `/inventory/plant-species/:id` — the "products" intermediary breaks predictability and makes URL sharing/bookmarking confusing.

**Real-world risk:** Users attempting to modify the URL bar to navigate (a common power-user pattern) will get 404s. Search engines and documentation will reference inconsistent paths.

**Recommended solution:**

- Unify URLs: `/inventory/plant-species/:id` for species detail
- Add redirects from old `/inventory/products/species/:id` paths
- The router already has legacy redirects — add this batch too

---

### UX-04: No Search or Global Filter Capability

**Problem:** There is no global search functionality. Each page implements its own inline search, but there's no way to search across all inventory types from a single input (e.g., "find anything named 'banana'").

**Why it's a problem:** In a lab with 500+ species, 2000+ samples, and hundreds of chemicals, finding a specific item requires knowing which section it belongs to first. This puts cognitive burden on the user.

**Real-world risk:** Lab technician receives a request to check on item "BN-42" — they don't know if it's a species code, sample code, variety code, or chemical code. They must search 4+ pages.

**Recommended solution:**

1. Add a global search endpoint: `GET /api/v1/search?q=term` that queries across all models' searchable fields
2. Add a `⌘K` / `Ctrl+K` command palette in the frontend
3. Return results grouped by entity type with direct links to detail pages

---

### UX-05: No Notifications Center

**Problem:** The system tracks alerts (expiring chemicals, overdue borrows, overdue maintenance) on the dashboard, but there's no persistent notification system. Users only see alerts when they visit the dashboard.

**Why it's a problem:** Critical alerts (chemical expiring tomorrow, equipment maintenance overdue) are invisible unless users actively check. The `notifications` table migration exists, but no frontend or controller implementation.

**Real-world risk:** Expired chemicals remain in use because nobody saw the alert. Overdue maintenance leads to equipment failure during critical experiments.

**Recommended solution:**

1. Implement `NotificationController` returning user's unread notifications
2. Add a notification bell icon in TopNav with unread count badge
3. Create scheduled commands to generate notifications for: expiring chemicals (7, 3, 1 day warnings), overdue borrows, upcoming maintenance

---

## 3. Workflow Design Problems

### WF-01: No Experiment → Inventory Integration

**Problem:** Experiments reference `plant_species_id` but have no connection to actual `PlantStock` (available quantities), `PlantSample` (specific samples being used), or `Chemical` (reagents consumed). The Research module operates in complete isolation from the Inventory module.

**Why it's a problem:** This is the most significant architectural gap. In a real plant tissue culture lab:

- Starting an experiment **consumes** stock (explants removed from mother plants)
- Experiments **use** chemicals (growth media, hormones, sterilization agents)
- Completed experiments **produce** new stock (successfully propagated plants)
- Growth logs should reference which chemicals/media were used at each stage

**Real-world risk:** The system cannot answer: "How much MS medium did Experiment EXP-001 consume?" or "How many plantlets from EXP-001 were transferred back to stock?" — making it useless for resource planning and costing.

**Recommended solution:**

1. Create `experiment_materials` pivot table: `experiment_id`, `materialable_type` (Chemical, PlantStock), `materialable_id`, `quantity_used`, `purpose`
2. Add `ExperimentMaterial` model with polymorphic relationship
3. When an experiment starts: deduct stock, log as transaction
4. When an experiment completes: create new PlantStock entries, log as "harvested"
5. Growth logs should optionally reference chemicals/media used per observation

---

### WF-02: BorrowRecord Status Has No Workflow Enforcement

**Problem:** `BorrowStatus` enum has 5 states (PENDING, BORROWED, RETURNED, OVERDUE, REJECTED) but unlike `ContractStatus` and `ExperimentStatus`, it does NOT implement `allowedTransitions()`. Any status can be set to any other status via API.

**Why it's a problem:** Without transition guards:

- A RETURNED borrow can be changed back to BORROWED
- A REJECTED borrow can be set to RETURNED without ever being BORROWED
- The `BorrowService` controller methods enforce some logic, but the model doesn't protect itself

**Real-world risk:** Manual database edits or API bugs could create logically impossible borrow states (e.g., returned before borrowed). Audit trail becomes unreliable.

**Recommended solution:**

```php
// Add to BorrowStatus enum:
public function allowedTransitions(): array
{
    return match ($this) {
        self::PENDING   => [self::BORROWED, self::REJECTED],
        self::BORROWED  => [self::RETURNED, self::OVERDUE],
        self::OVERDUE   => [self::RETURNED],
        default         => [],
    };
}
```

---

### WF-03: Contract → Production → Stock Pipeline Is Disconnected

**Problem:** The Business module has Contracts (quantity_ordered, quantity_delivered) and ProductionForecasts (estimated_weeks, weekly_milestones), but there's no workflow connecting:

1. Contract says "deliver 1000 banana plants by March"
2. System checks current stock → shortfall = 800
3. Creates production plan → links to experiments
4. Experiments produce stock → updates delivery progress
5. Stock is allocated to contract → marked as delivered

**Why it's a problem:** Each entity (Contract, ProductionForecast, Experiment, PlantStock) is independent. The `production-forecasts/calculate` endpoint generates estimates but doesn't create actionable plans linked back to contracts.

**Real-world risk:** Lab managers must manually track which experiments serve which contracts, using spreadsheets alongside the system — defeating the purpose of the software.

**Recommended solution:**

1. Add `contract_id` foreign key to `production_forecasts`
2. Add `contract_id` foreign key to `experiments` (optional, for contract-driven experiments)
3. Create a "Fulfillment" workflow: Contract → auto-generate ProductionForecast → create linked experiments → track stock output against contract quota
4. Dashboard widget: "Contract Fulfillment Progress" showing contract → forecast → actual yield

---

### WF-04: No Chemical Batch → Parent Chemical Quantity Synchronization

**Problem:** `Chemical` has a `quantity` field and `ChemicalBatch` also has a `quantity` field. When a batch is added, the parent chemical's total quantity is NOT automatically updated. They are independently maintained.

**Why it's a problem:** The system has two sources of truth for chemical stock levels:

- `chemicals.quantity` = overall stock (manually maintained)
- Sum of `chemical_batches.quantity` = batch-level stock (also manually maintained)

These can diverge. A chemical could show quantity=100 while its batches total 150.

**Real-world risk:** Inventory counts become unreliable. Lab supplies may appear available when actually depleted, or vice versa, leading to experiment delays or waste.

**Recommended solution:**

1. Make `chemicals.quantity` a computed total: `SELECT SUM(quantity) FROM chemical_batches WHERE chemical_id = ?`
2. Add an Eloquent accessor: `getTotalQuantityAttribute()` that sums batch quantities
3. Or use Observer pattern: when a ChemicalBatch is created/updated/deleted, recalculate parent Chemical's quantity
4. Remove direct editing of `chemicals.quantity` from API — it should always be derived

---

### WF-05: No Scheduled Tasks for Time-Based State Transitions

**Problem:** BorrowRecords have `due_at` timestamps, but there's no scheduled job to transition BORROWED → OVERDUE when `due_at` passes. Similarly, no job marks chemicals as expired when `expiry_date` passes. The `docker-compose.yml` has a scheduler container, but no actual commands are registered.

**Why it's a problem:** OVERDUE status only gets set when someone views the dashboard or when the borrow is returned. A borrow overdue for 3 months will still show as "borrowed" until manually checked.

**Real-world risk:** Overdue equipment remains unaccounted for. Lab managers don't get timely alerts about overdue items, leading to equipment hoarding and availability conflicts.

**Recommended solution:**

```php
// app/Console/Kernel.php (or app/Console/Commands/)
Schedule::command('borrows:mark-overdue')->hourly();
Schedule::command('notifications:generate-alerts')->daily();
Schedule::command('chemicals:check-expiry')->daily();
```

Create three Artisan commands that:

1. `borrows:mark-overdue`: Set BORROWED → OVERDUE where `due_at < now()`
2. `chemicals:check-expiry`: Generate notifications for chemicals expiring in 7/3/1 days
3. `notifications:generate-alerts`: Create notifications for upcoming maintenance, low stock, etc.

---

## 4. Domain Modeling Issues

### DM-01: The `plant_specy_id` Column Name Typo Permeates the Entire System

**Problem:** The foreign key column is named `plant_specy_id` instead of `plant_species_id` in `plant_varieties`, `plant_samples`, and `plant_stocks` tables. The singular of "species" is "species" (not "specy"). This typo propagates through:

- 3 migrations
- 4 models (`PlantVariety`, `PlantSample`, `PlantStock`, `PlantSpecies`)
- All controllers, services, and request validators referencing these columns
- Frontend types and form payloads

**Why it's a problem:** Every new developer will be confused by `plant_specy_id`. It's unprofessional and creates cognitive friction. The comment in `PlantVariety` even says "legacy typo kept for DB compatibility."

**Real-world risk:** Developers will write code referencing `plant_species_id` (the correct form), creating runtime errors. New team members will waste time understanding the naming convention.

**Recommended solution:**

1. Create a migration to rename: `plant_specy_id` → `plant_species_id` in all three tables
2. Update all model `$fillable`, relationships, and foreign key references
3. Update all controller/service/request references
4. Update frontend types
5. Do this as a single coordinated migration + code update to avoid partial states

---

### DM-02: Experiment Has Denormalized Species Fields

**Problem:** The `experiments` table has both a `plant_species_id` foreign key AND `species_name` + `common_name` text fields. The model's `$fillable` includes all three, meaning:

- `species_name` / `common_name` can be set independently of `plant_species_id`
- If the plant species record is edited (name changes), experiments keep the old name
- `plant_species_id` is nullable with `nullOnDelete`, so deleting a species orphans the experiment

**Why it's a problem:** Data inconsistency. Experiment says species_name="Banana" but the linked PlantSpecies record says common_name="Plantain" after an update. Or worse, the FK is null but species_name still holds a value, creating ghost references.

**Real-world risk:** Reports aggregating experiments by species will produce incorrect groupings because some experiments reference species by FK and others by text fields.

**Recommended solution:**

1. Make `plant_species_id` required (NOT NULL) — every experiment must reference a species
2. Remove `species_name` and `common_name` from experiments `$fillable`
3. Always load species name via the `species()` relationship
4. For historical record integrity, add `plant_species_snapshot` JSON column that captures species data at experiment creation time

---

### DM-03: Contract Also Has Denormalized Species Fields

**Problem:** Same issue as DM-02 but for `contracts` table: has both `plant_species_id` FK AND `species_name`, `common_name` text fields.

**Why it's a problem:** Same data inconsistency risk as experiments. Contract displays stale species name after species record update.

**Real-world risk:** Client-facing contract documents show outdated plant names.

**Recommended solution:** Same as DM-02 — rely on FK relationship, add snapshot JSON for historical integrity.

---

### DM-04: LabService Has No Relationship to Client Model

**Problem:** `LabService` stores `client_name` and `client_contact` as plain text fields instead of referencing the `Client` model via foreign key. Meanwhile, the Business module has a fully-featured `Client` model with `company_name`, `contact_name`, `contact_email`, `contact_phone`.

**Why it's a problem:** Lab services for existing clients create duplicate data. A client's contact info exists in two places (Client record + LabService text fields) with no synchronization.

**Real-world risk:** Client changes their phone number → updated in Client model but 15 LabService records still show the old number. Reporting on "all revenue from client X" misses lab service revenue because it's stored as text, not a FK.

**Recommended solution:**

1. Add `client_id` nullable FK to `lab_services` table
2. Keep `client_name`/`client_contact` for non-registered walk-in clients
3. When `client_id` is set, derive name/contact from the Client relationship
4. Add validation: if `client_id` is provided, `client_name` becomes optional

---

### DM-05: Protocol `steps_count` and `linked_experiments_count` Are Manual Counter Caches

**Problem:** The `protocols` table has `steps_count` and `linked_experiments_count` as manually-maintained integer columns in `$fillable`. These should be derived from `steps()->count()` and `experiments()->count()` but instead are writable fields.

**Why it's a problem:** Any API consumer can set `steps_count: 99` on a protocol that has 3 steps. The counter caches are never automatically synchronized.

**Real-world risk:** Dashboard displays incorrect protocol metrics, misleading lab managers about protocol complexity and usage.

**Recommended solution:**

1. Remove `steps_count` and `linked_experiments_count` from `$fillable`
2. Add Eloquent accessors or use `withCount()`:

```php
public function getStepsCountAttribute(): int {
    return $this->steps()->count();
}
```

3. Or implement Observer pattern on `ProtocolStep` and `experiment_protocol` to auto-update counters

---

### DM-06: No Unit-of-Measure Standardization

**Problem:** Chemical quantities use a `unit` field on `ChemicalBatch` (free text), but chemicals, plant samples, plant stocks all use a unitless `quantity` integer. There's no standardized unit-of-measure system.

**Why it's a problem:** A chemical might have quantity=500, but 500 _what_? mL? grams? tablets? Different batches of the same chemical might use different units (one batch in mL, another in L), making their quantities non-additive.

**Real-world risk:** Experiment protocols say "add 50mL of ethanol" but the system shows quantity=2 (meaning 2 liters) — potential 40x dosage error.

**Recommended solution:**

1. Create a `UnitOfMeasure` enum: `ML, L, G, KG, UNITS, PIECES`
2. Add `unit` column to `chemicals`, `plant_stocks`, `plant_samples`
3. Add unit conversion helpers for aggregation (mL → L, g → kg)
4. Require unit specification on all quantity-bearing models

---

## 5. Data Integrity Risks

### DI-01: No Unique Constraints on Code Fields (Soft-Delete Aware)

**Problem:** Multiple models have code fields (`sample_code`, `variety_code`, `chemical_code`, `equipment_code`, `experiment_code`, `contract_code`, `service_code`) but only `experiment_code` and `contract_code` have actual `UNIQUE` database constraints. Others use only indexes with comments like "uniqueness enforced at app level (soft-delete aware)."

**Why it's a problem:** Application-level uniqueness checks are race-condition-prone. Two concurrent requests creating records with the same `sample_code` can both pass the app-level check and create duplicates. The "soft-delete aware" concern can be handled by partial unique indexes.

**Real-world risk:** Duplicate codes in production → items are confused, barcodes point to wrong records, audit trail is unreliable.

**Recommended solution:**

```sql
-- PostgreSQL partial unique index (excludes soft-deleted rows)
CREATE UNIQUE INDEX idx_plant_samples_code_unique
ON plant_samples (sample_code)
WHERE deleted_at IS NULL;
```

Apply this pattern to: `variety_code`, `sample_code`, `chemical_code`, `equipment_code`, `service_code`, `client_code`.

---

### DI-02: Stock Quantity Can Go Negative via Concurrent Transactions

**Problem:** `PlantStock` has `quantity` and `reserved_quantity` with validation at the application level ("update guard in the controller enforces reserved <= quantity"). However, there's no database-level CHECK constraint preventing `quantity` from going negative after concurrent decrements.

**Why it's a problem:** Two users simultaneously borrowing from the same stock:

1. User A reads quantity=5, borrows 3 → passes validation
2. User B reads quantity=5, borrows 4 → passes validation
3. Both writes commit → quantity becomes -2

The `ManagesBorrowableStock` trait does `$item->decrement('quantity', $quantity)` which doesn't re-check the value.

**Real-world risk:** Phantom inventory. System shows negative quantities that are physically impossible. Lab workers show up expecting samples that don't exist.

**Recommended solution:**

1. Add PostgreSQL CHECK constraints:

```sql
ALTER TABLE plant_stocks ADD CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0);
ALTER TABLE plant_stocks ADD CONSTRAINT chk_reserved_non_negative CHECK (reserved_quantity >= 0);
ALTER TABLE plant_stocks ADD CONSTRAINT chk_reserved_lte_quantity CHECK (reserved_quantity <= quantity);
ALTER TABLE chemicals ADD CONSTRAINT chk_chemical_qty_non_negative CHECK (quantity >= 0);
```

2. Use `SELECT ... FOR UPDATE` (pessimistic locking) in the `ManagesBorrowableStock` trait
3. Wrap all stock modifications in database transactions with row-level locks

---

### DI-03: Polymorphic Types Store Raw Class Names

**Problem:** The `borrowable_type` and `transactionable_type` columns store values like `App\Modules\Inventory\Models\Chemical`. If the namespace ever changes (refactoring, module reorganization), all existing polymorphic references break silently.

**Why it's a problem:** Laravel's default polymorphic type storage uses FQCN strings. Moving a model to a different namespace (e.g., during a major refactoring) would orphan all existing borrow records and transactions pointing to the old class name.

**Real-world risk:** Any code reorganization that moves model classes will render historical transaction data unresolvable.

**Recommended solution:**
Register morph maps in a service provider:

```php
// AppServiceProvider or a dedicated MorphMapServiceProvider
Relation::enforceMorphMap([
    'chemical'     => Chemical::class,
    'equipment'    => Equipment::class,
    'plant_stock'  => PlantStock::class,
    'plant_sample' => PlantSample::class,
    // ...
]);
```

Then migrate existing data to use short aliases instead of FQCN.

---

### DI-04: No Foreign Key on `LabNotebook.author_id` + Denormalized `author_name`

**Problem:** `LabNotebook` has an `author_id` FK to users AND an `author_name` text field. The `author_name` is independently editable and can diverge from the actual user's name. Same pattern exists in `Protocol` (has `author_id` + `author_name`).

**Why it's a problem:** If the user changes their name (marriage, legal name change), the notebook still shows the old name. If the user is deleted, `author_id` becomes null but `author_name` persists as a ghost reference.

**Real-world risk:** Lab compliance audits require accurate attribution. Stale author names create traceability issues for regulatory submissions.

**Recommended solution:**

1. Remove `author_name` from `$fillable`
2. Always derive author name from the `author()` relationship
3. If you need the name at creation time for offline/export, store it in a metadata JSON field

---

### DI-05: `ChemicalUsageLog` Links to `experiment_name` as Free Text

**Problem:** `ChemicalUsageLog` has an `experiment_name` text field instead of a foreign key to the `experiments` table. This means chemical usage cannot be reliably associated with specific experiments.

**Why it's a problem:** A user types "banana experiment" as the experiment_name — but the actual experiment is titled "Musa acuminata Tissue Culture Trial (EXP-042)". There's no way to aggregate chemical consumption per experiment.

**Real-world risk:** Research cost analysis fails. "How much ethanol did EXP-042 consume?" requires manual cross-referencing of free-text fields.

**Recommended solution:**

1. Add `experiment_id` nullable FK to `chemical_usage_logs`
2. Keep `experiment_name` for backwards compatibility but prefer FK
3. Update the usage form to show a searchable dropdown of active experiments

---

## 6. Missing Essential Features

### MF-01: No Audit Trail Viewer in Frontend

**Problem:** The backend has comprehensive activity logging via Spatie ActivityLog (every model CRUD operation is logged), but there is NO frontend page to view audit logs. The `activity_log` table accumulates data with no way for users to inspect it.

**Why it's a problem:** Activity logging without visibility is pointless. Lab managers need to answer: "Who modified this chemical record last week?" "What changed on sample BN-42?" — these questions have answers in the database but no UI to retrieve them.

**Real-world risk:** When disputes arise about inventory changes, there's no accessible audit trail. Lab managers must request database queries from developers.

**Recommended solution:**

1. Create `ActivityLogController` with filterable index: by model type, user, date range, event type
2. Create frontend `ActivityLog` page under Reports or Administration
3. Add "History" tab to each detail page showing that record's activity log

---

### MF-02: No Barcode/QR Code Support

**Problem:** The system generates codes for every entity (`sample_code`, `chemical_code`, `equipment_code`, etc.) but provides no barcode/QR code generation or scanning capability.

**Why it's a problem:** Physical lab inventory management universally relies on barcodes. Lab workers don't type "CHEM-2024-0042" — they scan a barcode on the bottle.

**Real-world risk:** Without barcode support, every inventory check requires manual typing of codes, which is 10x slower and error-prone. This is a dealbreaker for labs with 1000+ items.

**Recommended solution:**

1. Backend: Add `GET /api/v1/{entity}/{id}/barcode` endpoint using a PHP barcode library
2. Frontend: Add barcode generation to detail pages (printable labels)
3. Frontend: Add camera-based barcode scanner (via `quagga2` or `html5-qrcode` libraries) to search/check-in flows
4. Consider QR codes that encode a URL to the item's detail page

---

### MF-03: No Image Upload Functionality on Frontend

**Problem:** The backend has a full `ImageUploadService` and `HasImageUpload` trait, and models have `image_path`/`image_url` fields. The frontend has an `ImageUpload` component in `shared/components/`. However, the actual form pages for creating/editing species, samples, chemicals, and equipment do NOT integrate the image upload flow.

**Why it's a problem:** The image upload infrastructure exists but is disconnected from user workflows. Users can't attach photos of plant samples, chemical labels, or equipment.

**Real-world risk:** Visual identification is crucial in labs. Without photos, staff must physically locate items to verify identity, wasting time and risking mix-ups.

**Recommended solution:**

1. Integrate `ImageUpload` component into all create/edit forms for: PlantSpecies, PlantVariety, PlantSample, Chemical, Equipment
2. Ensure the API controllers accept multipart/form-data uploads
3. Add image preview galleries to detail pages

---

### MF-04: No Data Export Beyond CSV Reports

**Problem:** The `ReportController` generates CSV exports for inventory and chemical usage. But there's no:

- PDF report generation (for formal reports, compliance documents)
- Excel export with formatting
- Printable views for any entity
- Bulk export of experiment data for statistical analysis

**Why it's a problem:** Research labs need to share data with external reviewers, funding agencies, and publications. CSV is too raw; formal reports need headers, logos, formatting.

**Real-world risk:** Lab submits a grant report with raw CSV data instead of a formatted table → unprofessional, potentially rejected.

**Recommended solution:**

1. Add `dompdf` or `barryvdh/laravel-dompdf` for PDF generation
2. Create report templates for: Inventory Summary, Experiment Report, Contract Invoice
3. Add "Print" and "Export PDF" buttons to detail pages and report pages
4. Consider `maatwebsite/excel` for properly formatted Excel exports

---



---

### MF-06: No Email Notifications

**Problem:** The `notifications` migration exists, the User model uses `Notifiable`, but there are NO notification classes implemented anywhere. No email is ever sent for any event.

**Why it's a problem:** Critical events that should trigger emails:

- Borrow request submitted (notify approver)
- Borrow request approved/rejected (notify requester)
- Chemical expiring soon (notify lab manager)
- Contract milestone due (notify contract manager)
- Equipment maintenance overdue (notify maintenance team)

**Real-world risk:** Lab managers must constantly check the dashboard for updates instead of being proactively notified. Time-sensitive alerts are missed.

**Recommended solution:**

1. Create notification classes: `BorrowRequestNotification`, `ExpiryAlertNotification`, `MaintenanceDueNotification`
2. Register event listeners to dispatch notifications
3. Configure SMTP/mail in `.env` and `config/mail.php`
4. Use database + mail channels so notifications appear both in-app and via email

---

## 7. Backend Architecture Improvements

### BA-01: No Request Validation Classes for Several Endpoints

**Problem:** While inventory controllers use Form Request classes, some Research and Business controllers perform validation inline using `$request->validate()` instead of dedicated FormRequest classes. This is inconsistent with the rest of the architecture.

**Why it's a problem:** Inline validation is not reusable, not testable independently, and doesn't follow Laravel's Form Request pattern which allows authorization checks alongside validation.

**Recommended solution:** Create dedicated FormRequest classes for all Research and Business endpoints, following the pattern already established in Inventory modules.

---

### BA-02: No API Versioning Strategy

**Problem:** Routes are prefixed with `/api/v1` (set in `RouteServiceProvider`), but there's no actual API versioning infrastructure. No v2 preparation, no deprecation headers, no version negotiation.

**Why it's a problem:** When breaking changes are needed (e.g., renaming `plant_specy_id` to `plant_species_id`), there's no way to maintain backward compatibility for existing clients.

**Real-world risk:** Mobile app or third-party integration breaks when API changes are deployed.

**Recommended solution:**

1. Implement proper version routing: `Route::prefix('v1')` vs `Route::prefix('v2')`
2. Add API version header: `Accept: application/vnd.plantlab.v1+json`
3. Plan deprecation strategy with sunset headers

---

### BA-03: No Rate Limiting Beyond Auth Endpoints

**Problem:** Only `auth/register` (5/min) and `auth/login` (10/min) have throttle middleware. All other API endpoints have NO rate limiting.

**Why it's a problem:** Any authenticated user can hammer the API with unlimited requests, potentially causing:

- Database overload from expensive aggregate queries (dashboard, reports)
- Storage exhaustion from unlimited document uploads
- Denial of service for other users

**Real-world risk:** A misconfigured automated script or a curious student running load tests could bring down the entire system.

**Recommended solution:**

```php
// In RouteServiceProvider or route files:
Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
    // Standard endpoints: 60 requests per minute
});

Route::middleware(['auth:api', 'throttle:10,1'])->group(function () {
    // Expensive endpoints: reports, analytics, exports
});
```

---

### BA-04: Missing API Resources (JSON Transformers) for Some Models

**Problem:** The frontend TypeScript types show structured response formats (e.g., `PlantSample` with nested `identity`, `relationships`, `details`, `lab_info`, `meta` groups). These structured responses require JsonResource classes. Not all models have corresponding Resource classes, leading to inconsistent response formats.

**Why it's a problem:** Some endpoints return raw Eloquent models (flat JSON with all columns), while others return beautifully structured resource objects. The inconsistency makes frontend development unpredictable.

**Recommended solution:** Ensure every model has a corresponding `JsonResource` class. Create `PlantStockResource`, `ChemicalBatchResource`, etc., where missing.

---

### BA-05: Observers Are Not Utilized for Side Effects

**Problem:** The `app/Observers/` directory exists but is underutilized. Model side effects (like updating parent chemical quantity when a batch changes, or recalculating contract progress when a milestone updates) are handled in controllers instead of Observers.

**Why it's a problem:** Business logic that should be triggered by model events is scattered across controllers. If a batch is created via a seeder, import script, or Artisan command instead of through the controller, the side effects don't fire.

**Real-world risk:** Data imported via seed scripts or console commands doesn't trigger the same business logic as API calls, creating data inconsistencies.

**Recommended solution:**

1. Create `ChemicalBatchObserver`: recalculate parent Chemical quantity on create/update/delete
2. Create `ContractMilestoneObserver`: recalculate Contract progress on milestone update
3. Create `BorrowRecordObserver`: update equipment status on borrow/return
4. Register all observers in `EventServiceProvider`

---

## 8. Database Design Improvements

### DB-01: No `CHECK` Constraints on Enum-Like String Columns

**Problem:** Many columns use `string` type with enum values enforced only at the application level (via PHP enums). The database accepts any string value. For example, `experiments.status` is a `VARCHAR(20)` that could hold "banana" at the database level.

**Why it's a problem:** Direct database edits, migration scripts, or bugs that bypass validation can insert invalid status values. PostgreSQL CHECK constraints provide a last line of defense.

**Recommended solution:**

```sql
ALTER TABLE experiments ADD CONSTRAINT chk_experiment_status
CHECK (status IN ('planning', 'active', 'paused', 'completed', 'failed'));
```

Apply to all status/type columns across all tables.

---

### DB-02: Missing Indexes on Frequently Filtered Columns

**Problem:** While the performance migration added some indexes, several frequently-queried columns lack indexes:

- `chemical_usage_logs.used_at` (filtered in reports by date range)
- `growth_logs.experiment_id` + `week_number` (compound index for time-series queries)
- `payments.contract_id` + `status` (filtered by status in financial reports)
- `lab_services.status` + `payment_status` (filtered in service queries)
- `borrow_records.user_id` (filtered by user in profile page)

**Why it's a problem:** As data grows, these queries will become increasingly slow without appropriate indexes.

**Recommended solution:** Create a new migration adding these indexes:

```php
Schema::table('chemical_usage_logs', function (Blueprint $table) {
    $table->index(['chemical_id', 'used_at']);
});
Schema::table('growth_logs', function (Blueprint $table) {
    $table->index(['experiment_id', 'week_number']);
});
Schema::table('payments', function (Blueprint $table) {
    $table->index(['contract_id', 'status']);
});
```

---

### DB-03: `plant_species.description` Was Changed From VARCHAR to TEXT But Others Weren't

**Problem:** Migration `2026_03_04_000002` changes `plant_species.description` from `string` (VARCHAR) to `text`. However, `chemicals.description` and `equipment.description` are still `text`, while `plant_varieties.description` was `text` from the start. The `plant_species.description` was originally `string` — as was `chemicals.description` (which is actually still declared as a `string` in its migration but never changed to `text`).

**Why it's a problem:** Inconsistent column types for the same semantic field across tables.

**Recommended solution:** Audit all `description` columns and standardize to `TEXT` across all entity tables.

---

### DB-04: No Soft Deletes on Several Models That Should Have Them

**Problem:** The following models do NOT use `SoftDeletes` but probably should:

- `ChemicalUsageLog` — usage records should never be permanently deleted
- `MaintenanceRecord` — maintenance history should be preserved
- `ContractMilestone` — milestones are part of contract history
- `Achievement` — achievement definitions should be archivable, not destroyable
- `Transaction` — transaction logs should NEVER be deletable

**Why it's a problem:** Hard-deleting a `Transaction` destroys audit trail. Hard-deleting a `MaintenanceRecord` destroys equipment service history. Hard-deleting a `ContractMilestone` invalidates contract progress tracking.

**Real-world risk:** A frustrated user or a cleanup script permanently erases critical historical data with no recovery option.

**Recommended solution:**

1. Add `SoftDeletes` trait to: `Transaction`, `ChemicalUsageLog`, `MaintenanceRecord`, `ContractMilestone`
2. Add `deleted_at` column to these tables via migration
3. `Transaction` should additionally be made immutable — disallow updates and deletes entirely

---

### DB-05: `contracts` Table Has `species_name` and `common_name` Without FK Enforcement

**Problem:** The `contracts` table stores denormalized `species_name` and `common_name` columns alongside a nullable `plant_species_id` FK. There's no trigger or constraint ensuring these text fields match the referenced species.

**Why it's a problem:** As detailed in DM-02/DM-03, this creates data inconsistency. But at the database level, there's also a referential integrity gap: `plant_species_id` uses `nullOnDelete`, so deleting a species leaves the contract with text names pointing to a deleted record.

**Recommended solution:**

1. Change `plant_species_id` to `restrictOnDelete` — you shouldn't be able to delete a species that has active contracts
2. Add a `species_snapshot` JSONB column for historical preservation
3. Remove `species_name` and `common_name` from direct manipulation

---

## 9. System Consistency Problems

### SC-01: Dual Role System (Enum vs Spatie Roles)

**Problem:** The system has TWO role systems running simultaneously:

1. `users.role` ENUM column with values `admin`, `lab_manager`, `student`
2. Spatie `HasRoles` trait with a full `roles` + `permissions` table

The `User` model has both `role` enum cast AND Spatie's `HasRoles`. The `isAdmin()` method checks the enum field, while the policy system can check Spatie permissions.

**Why it's a problem:** Two sources of truth for user roles. A user could have `role='student'` in the enum but be assigned the Spatie "admin" role. Which one wins? The `AdminMiddleware` checks one, policies may check the other, creating authorization inconsistencies.

**Real-world risk:** A user's permissions don't match their displayed role, leading to confusion and potential unauthorized access.

**Recommended solution:**

1. Choose ONE role system. Spatie is more flexible and already installed.
2. Migrate the `role` enum column data into Spatie roles
3. Remove the `role` column from users table
4. Update `isAdmin()`, `isLabManager()` to use `$this->hasRole('admin')` etc.
5. Update the `AdminMiddleware` to check Spatie roles

---

### SC-02: Inconsistent Permission Naming Convention

**Problem:** Some routes check permissions like `chemical_batches.view`, `maintenance.view`, `achievements.view`, `user_documents.view`, `reports.view`, `roles.view`, `permissions.view`. But most routes have NO permission checks at all — they only require authentication.

**Why it's a problem:** The permission system is partially implemented. A student can access experiments, protocols, contracts, payments, clients — all business-critical data — with just authentication. Only a handful of pages have actual permission gates.

**Real-world risk:** Students can view and modify contracts, payments, and financial data that should be restricted to lab managers and admins.

**Recommended solution:**

1. Define a complete permission matrix for all 3 roles:
    - Student: view inventory, create borrows, record observations
    - Lab Manager: full inventory CRUD, manage borrows, create experiments, view reports
    - Admin: everything including user/role management
2. Apply permission checks to ALL routes, not just a few
3. Gate frontend routes with matching permission checks

---

### SC-03: Frontend ProtectedRoute Only Checks Auth, Not Roles

**Problem:** The `<Protected>` component wraps routes with `<ProtectedRoute>`, which accepts an optional `permission` prop. Most routes pass NO permission:

```tsx
<Protected>
    <Dashboard />
</Protected> // No permission check
```

Only a few routes specify permissions:

```tsx
<Protected permission="chemical_batches.view">
    <ChemicalBatches />
</Protected>
```

**Why it's a problem:** 80%+ of routes are "protected" only by authentication, not authorization. Any logged-in user (including students) can access all pages.

**Real-world risk:** A student navigates to `/business/contracts` and sees confidential client pricing data.

**Recommended solution:**

1. Add permission props to ALL routes:

```tsx
<Protected permission="experiments.view"><Experiments /></Protected>
<Protected permission="contracts.view"><Contracts /></Protected>
```

2. Implement sidebar filtering: don't show nav items the user doesn't have permission to access

---

### SC-04: Mixed Date Handling (UTC vs Local)

**Problem:** Backend stores dates in UTC (database default for PostgreSQL). Frontend receives ISO 8601 strings and renders them without timezone conversion. There's no timezone configuration or user timezone preference.

**Why it's a problem:** A growth log recorded at 2:00 AM Cambodia time (UTC+7) shows as the previous day's date in the UI (because UTC would show 7:00 PM previous day).

**Real-world risk:** Experiment timelines appear shifted by hours, causing confusion about when observations were actually made.

**Recommended solution:**

1. Add `timezone` column to users table (default: `Asia/Phnom_Penh`)
2. Configure Laravel's timezone in `config/app.php`
3. Use a date formatting utility in the frontend that respects user timezone
4. Consider using `dayjs` with timezone plugin for consistent date formatting

---

### SC-05: Inconsistent Error Response Formats

**Problem:** The `ApiResponse` trait provides standardized `success()`, `error()`, `paginated()` methods. But exceptions thrown by policies (403), validation (422), and model not found (404) use Laravel's default exception handler format, which differs from the custom envelope:

- Custom: `{ "status": "error", "message": "...", "errors": ... }`
- Laravel default: `{ "message": "...", "errors": { "field": ["..."] } }`

**Why it's a problem:** Frontend error handling must accommodate TWO different error response formats, leading to fragile error parsing code.

**Recommended solution:**
Override the exception handler (`app/Exceptions/Handler.php`) to wrap ALL API error responses in the custom envelope format:

```php
public function render($request, Throwable $e)
{
    if ($request->expectsJson()) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'errors' => $e instanceof ValidationException ? $e->errors() : null,
        ], $this->getStatusCode($e));
    }
    return parent::render($request, $e);
}
```

---

## 10. High-Impact Improvements

### HI-01: Implement Real-Time Dashboard Updates via WebSockets

**Problem:** The dashboard uses cached data with TTLs (15-60 seconds). Users must refresh the page to see updated counts.

**Why it's a problem:** In an active lab, multiple users adding samples, logging chemical usage, and borrowing equipment simultaneously. Dashboard data is always stale.

**Recommended solution:**

1. Install Laravel Echo + Pusher/Soketi for WebSocket support
2. Broadcast events: `InventoryUpdated`, `BorrowCreated`, `BorrowReturned`
3. Frontend subscribes in the Dashboard component to update counts in real-time

---

### HI-02: Add Bulk Operations to All List Pages

**Problem:** All list pages operate on single records. There's no way to bulk-update status, bulk-delete, or bulk-export selected records.

**Why it's a problem:** Lab inventory counts often involve updating 50+ records at once (e.g., marking a batch of samples as archived after an experiment completes).

**Recommended solution:**

1. Add checkboxes to all list/table views
2. Add bulk action bar: "Archive Selected", "Delete Selected", "Export Selected"
3. Backend: Add `POST /api/v1/{entity}/bulk-update` and `POST /api/v1/{entity}/bulk-delete` endpoints
4. Use database transactions to ensure atomicity

---

### HI-03: Add Data Visualization to Experiment Growth Tracking

**Problem:** Growth logs store rich time-series data (`alive_count`, `survival_rate_pct`, `health_score`, `avg_height_cm` per week). The frontend has a "Data Analysis" page but its visualization capabilities are unclear from the route alone.

**Why it's a problem:** Time-series growth data is the core output of plant tissue culture research. Without proper charts (growth curves, survival rate trends, comparison across experiments), the data is just numbers in a table.

**Recommended solution:**

1. Use `recharts` or `chart.js` for interactive charts
2. Key visualizations needed:
    - Growth curve: alive_count over weeks (line chart)
    - Survival rate trend: survival_rate_pct over weeks (area chart)
    - Experiment comparison: overlay multiple experiments on same chart
    - Health heatmap: health_score by week × experiment (heatmap)

---

### HI-04: Add Inventory Movement Tracking (Location History)

**Problem:** `PlantSample` has a `lab_location` enum (LAB_A, LAB_B, LAB_C), and `Equipment` has a `location` string. But when items move between locations, there's no history — the field is simply overwritten.

**Why it's a problem:** You can't answer: "Where was microscope M-001 last month?" or "How many times has sample BN-42 moved between labs?" These are critical questions for compliance and security.

**Recommended solution:**

1. Create `location_history` table: `entity_type`, `entity_id`, `from_location`, `to_location`, `moved_by`, `moved_at`, `reason`
2. Automatically log location changes in a model Observer
3. Add "Movement History" tab to equipment and sample detail pages

---

## 11. Long-Term Scalability Recommendations

### LS-01: Implement Event-Driven Architecture

**Current state:** All business logic is synchronous, executed in the HTTP request lifecycle.

**Problem:** Expensive operations (report generation, notification dispatch, activity logging, cache invalidation) block API responses.

**Recommendation:**

1. Use Laravel Events + Queue workers for async operations
2. Move to event-driven patterns: `BorrowApproved` event → listeners for: notification, stock update, transaction log, cache bust
3. The docker-compose already has `queue-worker` service — wire it up with actual jobs

### LS-02: Implement Read Replicas for Reports

**Problem:** Report queries (aggregations, joins across multiple tables) compete with CRUD operations on the same database.

**Recommendation:** Configure Laravel's database `read`/`write` connections to use a PostgreSQL read replica for report endpoints.

### LS-03: Implement API Response Caching with Cache Tags

**Problem:** The current `CacheApiResponse` middleware exists but only caches at the route level. Individual resource endpoints are not cached.

**Recommendation:** Use Redis cache tags per entity type. When a PlantSpecies is updated, bust only `plant-species` tags instead of all caches.

### LS-04: Add Database Connection Pooling

**Problem:** Each PHP-FPM worker opens its own database connection. With high concurrency, PostgreSQL connection limits can be exhausted.

**Recommendation:** Add PgBouncer as a connection pooler between the app and PostgreSQL containers.

### LS-05: Implement File Storage Abstraction

**Problem:** Current file uploads go to local storage (public disk). This doesn't scale to multi-server deployments.

**Recommendation:** Configure S3/MinIO for file storage. The `filesystems.php` config already supports this — just need to switch the disk driver and add MinIO to docker-compose.

---

## 12. Suggested Feature Roadmap

### Phase 1: Foundation (Weeks 1-4) — Data Integrity & Consistency

| Week | Task                                                            | Priority |
| ---- | --------------------------------------------------------------- | -------- |
| 1    | Fix `plant_specy_id` → `plant_species_id` rename (DM-01)        | Critical |
| 1    | Register polymorphic morph map (DI-03)                          | Critical |
| 1    | Add CHECK constraints for quantities (DI-02)                    | Critical |
| 2    | Add partial unique indexes on code fields (DI-01)               | Critical |
| 2    | Unify role system: migrate enum to Spatie (SC-01)               | Critical |
| 2    | Add BorrowStatus transition guards (WF-02)                      | High     |
| 3    | Implement complete permission matrix (SC-02)                    | High     |
| 3    | Add permission checks to all frontend routes (SC-03)            | High     |
| 4    | Standardize error response format (SC-05)                       | High     |
| 4    | Add soft deletes to Transaction, ChemicalUsageLog, etc. (DB-04) | High     |

### Phase 2: Workflow Integration (Weeks 5-8)

| Week | Task                                                   | Priority |
| ---- | ------------------------------------------------------ | -------- |
| 5    | Chemical batch → parent quantity sync (WF-04)          | Critical |
| 5    | Scheduled jobs: overdue borrows, expiry alerts (WF-05) | High     |
| 6    | Experiment → Inventory integration (WF-01)             | High     |
| 6-7  | Remove denormalized name fields (DM-02, DM-03, DI-04)  | Medium   |
| 7    | LabService → Client FK integration (DM-04)             | Medium   |
| 8    | Contract → Production pipeline (WF-03)                 | Medium   |

### Phase 3: UX & Features (Weeks 9-12)

| Week | Task                                                       | Priority |
| ---- | ---------------------------------------------------------- | -------- |
| 9    | Fix URL structure consistency (UX-03)                      | High     |
| 9    | Add breadcrumb navigation (UX-02)                          | High     |
| 10   | Implement global search ⌘K (UX-04)                         | High     |
| 10   | Add notification system backend + bell icon (UX-05, MF-06) | High     |
| 11   | Add audit trail viewer (MF-01)                             | Medium   |
| 11   | Add email notifications (MF-06)                            | Medium   |
| 12   | Reorganize sidebar navigation (UX-01)                      | Medium   |

### Phase 4: Advanced Features (Weeks 13-16)

| Week | Task                                          | Priority |
| ---- | --------------------------------------------- | -------- |
| 13   | Barcode/QR code generation + scanning (MF-02) | High     |
| 13   | Image upload integration in forms (MF-03)     | Medium   |
| 14   | PDF report generation (MF-04)                 | Medium   |
| 14   | Growth data visualization/charts (HI-03)      | Medium   |
| 15   | Bulk operations for list pages (HI-02)        | Medium   |
| 15   | Location history tracking (HI-04)             | Medium   |            

---

## 13. Step-by-Step Refactoring Plan

### Step 1: Database Foundation Fixes (No Application Changes)

**Goal:** Fix all database-level issues without changing any application code.

1. **Create migration: rename `plant_specy_id`**

```php
Schema::table('plant_varieties', fn (Blueprint $t) => $t->renameColumn('plant_specy_id', 'plant_species_id'));
Schema::table('plant_samples', fn (Blueprint $t) => $t->renameColumn('plant_specy_id', 'plant_species_id'));
Schema::table('plant_stocks', fn (Blueprint $t) => $t->renameColumn('plant_specy_id', 'plant_species_id'));
```

2. **Create migration: add CHECK constraints**

```php
DB::statement('ALTER TABLE plant_stocks ADD CONSTRAINT chk_qty_non_neg CHECK (quantity >= 0)');
DB::statement('ALTER TABLE chemicals ADD CONSTRAINT chk_chemical_qty_non_neg CHECK (quantity >= 0)');
```

3. **Create migration: add partial unique indexes**

```php
DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS idx_samples_code_uniq ON plant_samples (sample_code) WHERE deleted_at IS NULL");
// ... repeat for variety_code, chemical_code, equipment_code, service_code, client_code
```

4. **Create migration: add soft deletes**

```php
Schema::table('transactions', fn (Blueprint $t) => $t->softDeletes());
Schema::table('chemical_usage_logs', fn (Blueprint $t) => $t->softDeletes());
Schema::table('maintenance_records', fn (Blueprint $t) => $t->softDeletes());
Schema::table('contract_milestones', fn (Blueprint $t) => $t->softDeletes());
```

5. **Create migration: add missing indexes**

```php
Schema::table('chemical_usage_logs', fn (Blueprint $t) => $t->index(['chemical_id', 'used_at']));
Schema::table('growth_logs', fn (Blueprint $t) => $t->index(['experiment_id', 'week_number']));
Schema::table('payments', fn (Blueprint $t) => $t->index(['contract_id', 'status']));
```

### Step 2: Model Layer Fixes

**Goal:** Update all models to match database changes.

1. Update `$fillable` in PlantVariety, PlantSample, PlantStock: `plant_specy_id` → `plant_species_id`
2. Update all relationship definitions referencing the old column name
3. Add `SoftDeletes` trait to Transaction, ChemicalUsageLog, MaintenanceRecord, ContractMilestone
4. Register morph map in `AppServiceProvider::boot()`:

```php
Relation::enforceMorphMap([
    'chemical' => \App\Modules\Inventory\Models\Chemical::class,
    'equipment' => \App\Modules\Inventory\Models\Equipment::class,
    'plant_stock' => \App\Modules\Inventory\Models\PlantStock::class,
    'plant_sample' => \App\Modules\Inventory\Models\PlantSample::class,
]);
```

5. Add `BorrowStatus::allowedTransitions()` method
6. Remove `steps_count`, `linked_experiments_count` from Protocol `$fillable`

### Step 3: Role System Unification

**Goal:** Eliminate dual role system.

1. Create migration to remove `role` column from users (after migrating data to Spatie roles)
2. Create a seeder/command that reads `users.role` and assigns corresponding Spatie roles
3. Update `User::isAdmin()` → `$this->hasRole('admin')`
4. Update `AdminMiddleware` to check Spatie roles
5. Remove `UserRole` enum (or keep for Spatie role names)

### Step 4: Permission System Completion

**Goal:** Every route has proper authorization.

1. Define all permissions in a seeder:

```
plant_species.view, plant_species.create, plant_species.update, plant_species.delete,
chemicals.view, chemicals.create, ...
experiments.view, experiments.create, ...
contracts.view, contracts.create, ...
reports.view, reports.export,
users.view, users.manage,
roles.view, roles.manage
```

2. Assign permissions to roles (admin gets all, lab_manager gets most, student gets view + limited create)
3. Add `->middleware('can:resource.action')` to all routes
4. Add permission props to all frontend `<Protected>` route wrappers

### Step 5: Cross-Module Integration

**Goal:** Connect the isolated modules.

1. Create `experiment_materials` migration and model
2. Add experiment → stock/chemical consumption workflow
3. Add chemical batch → parent chemical quantity Observers
4. Link production forecasts to contracts
5. Add `experiment_id` FK to chemical_usage_logs

### Step 6: Frontend UX Improvements

**Goal:** Fix navigation, add missing UI features.

1. Restructure sidebar: separate admin items, reduce inventory nav count
2. Add breadcrumbs to all detail pages
3. Unify URL structure (remove `/products/` intermediary)
4. Implement `⌘K` global search with `cmdk` library
5. Add notification bell in TopNav
6. Add audit log viewer page

### Step 7: Advanced Features

**Goal:** Add production-grade features.

1. Implement barcode generation (backend: `picqer/php-barcode-generator`)
2. Add barcode scanner component (frontend: `html5-qrcode`)
3. Integrate image uploads in all create/edit forms
4. Add PDF report generation
5. Implement email notifications
6. Add data visualization charts for growth logs

---

## Summary of All Issues

| ID    | Category    | Priority | Title                                          |
| ----- | ----------- | -------- | ---------------------------------------------- |
| UX-01 | UX          | High     | Flat navigation overload in inventory sidebar  |
| UX-02 | UX          | High     | Missing breadcrumb navigation                  |
| UX-03 | UX          | High     | Inconsistent URL structure                     |
| UX-04 | UX          | High     | No global search capability                    |
| UX-05 | UX          | High     | No notifications center                        |
| WF-01 | Workflow    | Critical | No experiment → inventory integration          |
| WF-02 | Workflow    | High     | BorrowRecord has no transition guards          |
| WF-03 | Workflow    | Medium   | Contract → production pipeline disconnected    |
| WF-04 | Workflow    | Critical | Chemical batch/parent quantity disconnect      |
| WF-05 | Workflow    | High     | No scheduled state-transition jobs             |
| DM-01 | Domain      | Critical | `plant_specy_id` typo permeates system         |
| DM-02 | Domain      | Medium   | Experiment has denormalized species fields     |
| DM-03 | Domain      | Medium   | Contract has denormalized species fields       |
| DM-04 | Domain      | Medium   | LabService has no Client FK                    |
| DM-05 | Domain      | Medium   | Protocol counter caches are manual             |
| DM-06 | Domain      | Medium   | No unit-of-measure standardization             |
| DI-01 | Integrity   | Critical | No unique constraints on code fields           |
| DI-02 | Integrity   | Critical | Stock can go negative concurrently             |
| DI-03 | Integrity   | Critical | Polymorphic types store raw class names        |
| DI-04 | Integrity   | Medium   | Denormalized author names can diverge          |
| DI-05 | Integrity   | Medium   | ChemicalUsageLog links experiment by name only |
| MF-01 | Feature     | Medium   | No audit trail viewer                          |
| MF-02 | Feature     | High     | No barcode/QR support                          |
| MF-03 | Feature     | Medium   | Image upload not integrated in forms           |
| MF-04 | Feature     | Medium   | No PDF export                                  |
| MF-05 | Feature     | Low      | No multi-language support                      |
| MF-06 | Feature     | High     | No email notifications                         |
| BA-01 | Backend     | Medium   | Missing FormRequest classes                    |
| BA-02 | Backend     | Medium   | No API versioning strategy                     |
| BA-03 | Backend     | High     | No rate limiting beyond auth                   |
| BA-04 | Backend     | Medium   | Missing API Resources for some models          |
| BA-05 | Backend     | Medium   | Observers underutilized                        |
| DB-01 | Database    | Medium   | No CHECK constraints on status columns         |
| DB-02 | Database    | Medium   | Missing indexes on filtered columns            |
| DB-03 | Database    | Low      | Inconsistent description column types          |
| DB-04 | Database    | High     | Missing soft deletes on audit-critical models  |
| DB-05 | Database    | Medium   | Denormalized FK + text name columns            |
| SC-01 | Consistency | Critical | Dual role system                               |
| SC-02 | Consistency | High     | Inconsistent permission naming                 |
| SC-03 | Consistency | High     | Frontend routes lack permission checks         |
| SC-04 | Consistency | Medium   | Mixed date handling                            |
| SC-05 | Consistency | High     | Inconsistent error response formats            |
| HI-01 | Enhancement | Low      | Real-time dashboard via WebSockets             |
| HI-02 | Enhancement | Medium   | Bulk operations for list pages                 |
| HI-03 | Enhancement | Medium   | Data visualization for growth tracking         |
| HI-04 | Enhancement | Medium   | Location history tracking                      |

**Total: 44 issues** — 7 Critical, 14 High, 18 Medium, 5 Low

---

_Report generated by deep system-level analysis of 26 models, 31+ controllers, 25+ services, 21+ policies, 24 enums, 40+ migrations, 4 route files, and the complete frontend architecture._
