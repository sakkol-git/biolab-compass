# Frontend API Integration — Master Prompt
> **Project:** BioLab Compass (React + TypeScript + Tailwind CSS)  
> **Backend:** Laravel 11 REST API  
> **Backend Base URL:** `http://127.0.0.1:8000/api`  
> **Date:** March 2, 2026  

---

## Role & Mission

You are a **Senior Full-Stack Engineer** specializing in React + TypeScript + Tailwind CSS frontends that connect to Laravel REST APIs. You are obsessed with type safety, clean component architecture, and perfect API alignment.

**Your Mission:** Replace ALL mock/static data in the BioLab Compass React application with real API calls to the Laravel backend. Every CRUD operation must work end-to-end. Every form field must match the exact backend validation rules. Every response shape must be typed correctly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, React Router |
| HTTP Client | **Axios** (preferred) with base config, or TanStack Query |
| State | React Context or Zustand |
| Forms | React Hook Form + Zod (for client-side pre-validation) |
| Notifications | Toast (sonner or react-hot-toast) |
| Backend | Laravel 11 API — `http://127.0.0.1:8000/api` |
| Auth | Laravel Sanctum (token-based for SPA) |

---

## Architecture Requirements

### 1. API Client Setup

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for Sanctum
});

// Attach Bearer token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Pagination Wrapper Type

ALL list endpoints return Laravel's paginated JSON. Create `src/types/pagination.ts`:

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
```

### 3. Standard API Error Shape

When validation fails (HTTP 422), the response is:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

Custom exceptions return:
```json
{ "error": "insufficient_stock", "message": "...", "details": { ... } }
{ "error": "item_not_borrowable", "message": "..." }
```

Create `src/types/api-error.ts`:
```typescript
export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}
export interface ApiCustomError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
```

---

## Complete API Contract

### ENUM VALUES (use these exact strings everywhere)

```typescript
// src/types/enums.ts
export type PlantGrowthType = 'annual' | 'perennial' | 'biennial';
export type SampleStatus    = 'active' | 'inactive' | 'archived';
export type LabLocation     = 'lab_a' | 'lab_b' | 'lab_c';
export type StockStatus     = 'available' | 'reserved' | 'out_of_stock';
export type ChemicalCategory = 'acid' | 'base' | 'solvent' | 'oxidizer' | 'reducer' | 'other';
export type DangerLevel     = 'low' | 'medium' | 'high';
export type EquipmentStatus   = 'available' | 'borrowed' | 'in_use' | 'under_maintenance';
export type EquipmentCondition = 'good' | 'normal' | 'broken';
export type EquipmentCategory  = 'microscope' | 'centrifuge' | 'incubator' | 'spectrophotometer' | 'other';
export type BorrowStatus    = 'borrowed' | 'returned' | 'overdue';
export type TransactionAction = 'added' | 'updated' | 'consumed' | 'borrowed' | 'returned' | 'harvested' | 'disposed';
export type UserRole        = 'admin' | 'lab_manager' | 'student';
export type BorrowableType  = 'equipment' | 'chemical' | 'plant_sample';
```

---

## Module 1 — Plant Species

**Base URL:** `/api/plant-species`  
**Route param:** `{plantSpecies}` (e.g., `/api/plant-species/1`)

### TypeScript Type
```typescript
// src/types/plant-species.ts
export interface PlantSpecies {
  id: number;
  common_name: string;
  khmer_name: string | null;
  scientific_name: string;
  family: string | null;
  growth_type: PlantGrowthType | null;
  native_region: string | null;
  propagation_method: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/plant-species` | `search`, `family`, `page` |
| Create | POST | `/api/plant-species` | — |
| Show | GET | `/api/plant-species/{id}` | — |
| Update | PUT/PATCH | `/api/plant-species/{id}` | — |
| Delete | DELETE | `/api/plant-species/{id}` | — |

### Create/Update Payload
```typescript
export interface PlantSpeciesPayload {
  common_name: string;           // required, max:255
  khmer_name?: string | null;    // nullable
  scientific_name: string;       // required, max:255, unique (soft-delete aware)
  family?: string | null;        // nullable
  growth_type: PlantGrowthType;  // required enum
  native_region?: string | null;
  propagation_method?: string | null;
  description?: string | null;
  image_url?: string | null;     // nullable, valid URL
}
```

---

## Module 2 — Plant Varieties

**Base URL:** `/api/plant-varieties`  
**Route param:** `{plantVariety}`

### TypeScript Type
```typescript
export interface PlantVariety {
  id: number;
  plant_specy_id: number;  // ⚠️ Note: the FK is named plant_specy_id (legacy, intentional)
  name: string;
  variety_code: string;
  description: string | null;
  image_url: string | null;
  plant_species: PlantSpecies | null;  // embedded when eager-loaded
  created_at: string;
  updated_at: string;
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/plant-varieties` | `search`, `species_id`, `page` |
| Create | POST | `/api/plant-varieties` | — |
| Show | GET | `/api/plant-varieties/{id}` | — |
| Update | PUT/PATCH | `/api/plant-varieties/{id}` | — |
| Delete | DELETE | `/api/plant-varieties/{id}` | — |

### Create/Update Payload
```typescript
export interface PlantVarietyPayload {
  plant_specy_id: number;    // required, must exist in plant_species
  name: string;              // required, max:255
  variety_code: string;      // required, max:100, unique
  description?: string | null;
  image_url?: string | null;
}
```

### ⚠️ IMPORTANT UI NOTE
The FK field is `plant_specy_id` (with a typo — NOT `plant_species_id`). When building forms, the `<select>` for species must send `plant_specy_id` as the key.

---

## Module 3 — Plant Samples

**Base URL:** `/api/plant-samples`  
**Route param:** `{plantSample}`

### TypeScript Type
```typescript
// ⚠️ The response uses a NESTED structure
export interface PlantSample {
  id: number;
  identity: {
    name: string;           // = sample_name
    code: string;           // = sample_code
    status: SampleStatus;
  };
  relationships: {
    species: PlantSpecies | null;
    variety: PlantVariety | null;
  };
  details: {
    owner: string | null;       // = owner_name
    department: string | null;
    origin: string | null;      // = origin_location
    quantity: number;
  };
  lab_info: {
    brought_at: string | null;  // YYYY-MM-DD
    location: LabLocation | null; // = lab_location
  };
  meta: {
    description: string | null;
    image: string | null;       // = image_url
    created_at: string;
    updated_at: string;
  };
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/plant-samples` | `search`, `status`, `species_id`, `page` |
| Create | POST | `/api/plant-samples` | — |
| Show | GET | `/api/plant-samples/{id}` | — |
| Update | PUT/PATCH | `/api/plant-samples/{id}` | — |
| Delete | DELETE | `/api/plant-samples/{id}` | — |

### Create/Update Payload (FLAT — send flat, receive nested)
```typescript
export interface PlantSamplePayload {
  sample_name: string;           // required
  sample_code: string;           // required, unique
  plant_specy_id: number;        // required, exists
  plant_variety_id?: number | null;
  owner_name?: string | null;
  department?: string | null;
  origin_location?: string | null;
  brought_at?: string | null;    // YYYY-MM-DD
  lab_location?: LabLocation | null;
  status: SampleStatus;          // required
  quantity: number;              // required, min:0
  description?: string | null;
  image_url?: string | null;
}
```

---

## Module 4 — Plant Stocks

**Base URL:** `/api/plant-stocks`  
**Route param:** `{plantStock}`

### TypeScript Type
```typescript
export interface PlantStock {
  id: number;
  inventory: {
    total: number;         // = quantity
    reserved: number;      // = reserved_quantity
    net_available: number; // computed: total - reserved, always >= 0
    status: StockStatus;
  };
  relations: {
    species: PlantSpecies | null;
    variety: PlantVariety | null;
    sample: PlantSample | null;
  };
  created_at: string;
  updated_at: string;
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/plant-stocks` | `species_id`, `status`, `page` |
| Create | POST | `/api/plant-stocks` | — |
| Show | GET | `/api/plant-stocks/{id}` | — |
| Update | PUT/PATCH | `/api/plant-stocks/{id}` | — |
| Delete | DELETE | `/api/plant-stocks/{id}` | — |

### Create Payload
```typescript
export interface PlantStockCreatePayload {
  plant_specy_id: number;       // required
  plant_variety_id?: number | null;
  plant_sample_id?: number | null;
  quantity: number;             // required, min:0
  reserved_quantity: number;    // required, min:0, must be <= quantity
  status: StockStatus;          // required
}
// reserved_quantity must always be <= quantity — enforce in UI
```

---

## Module 5 — Chemicals

**Base URL:** `/api/chemicals`

### TypeScript Type
```typescript
export interface Chemical {
  id: number;
  common_name: string;
  chemical_code: string | null;
  category: ChemicalCategory;
  quantity: number;
  storage_location: string | null;
  expiry_date: string | null;      // YYYY-MM-DD
  danger_level: DangerLevel;
  safety_measures: string | null;
  description: string | null;
  image_url: string | null;
  is_expired: boolean;             // computed server-side
  created_at: string;
  updated_at: string;
}
```

### API Operations & Query Params

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/chemicals` | `search`, `category`, `available_only=1`, `expired_only=1`, `low_stock=1`, `expiring_soon=1`, `page` |
| Create | POST | `/api/chemicals` | — |
| Show | GET | `/api/chemicals/{id}` | — |
| Update | PUT/PATCH | `/api/chemicals/{id}` | — |
| Delete | DELETE | `/api/chemicals/{id}` | — |

### Create/Update Payload
```typescript
export interface ChemicalPayload {
  common_name: string;           // required
  chemical_code?: string | null; // nullable, unique
  category: ChemicalCategory;    // required
  quantity: number;              // required, min:0
  storage_location?: string | null;
  expiry_date?: string | null;   // YYYY-MM-DD
  danger_level: DangerLevel;     // required
  safety_measures?: string | null;
  description?: string | null;
  image_url?: string | null;
}
```

### UI Behaviour
- Show a **red badge** when `is_expired === true`
- Show an **amber badge** when `expiry_date` is within 30 days but not expired
- Show a **yellow badge** when `quantity <= 10` (low stock)
- `danger_level` should render as a colour-coded chip: `low`=green, `medium`=amber, `high`=red

---

## Module 6 — Equipment

**Base URL:** `/api/equipment`

### TypeScript Type
```typescript
export interface Equipment {
  id: number;
  equipment_name: string;
  equipment_code: string | null;
  category: EquipmentCategory;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  location: string | null;
  manufacturer: string | null;
  model_name: string | null;     // ⚠️ field is model_name, NOT model
  serial_number: string | null;
  purchase_date: string | null;  // YYYY-MM-DD
  purchase_price: string | null; // decimal as string from backend
  description: string | null;
  image_url: string | null;
  is_borrowable: boolean;        // computed: status=available AND condition≠broken
  created_at: string;
  updated_at: string;
}
```

### API Operations & Query Params

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/equipment` | `search`, `category`, `status`, `available_only=1`, `borrowed_only=1`, `page` |
| Create | POST | `/api/equipment` | — |
| Show | GET | `/api/equipment/{id}` | — |
| Update | PUT/PATCH | `/api/equipment/{id}` | — |
| Delete | DELETE | `/api/equipment/{id}` | — |

### Create/Update Payload
```typescript
export interface EquipmentPayload {
  equipment_name: string;            // required
  equipment_code?: string | null;    // nullable, unique
  category: EquipmentCategory;       // required
  status: EquipmentStatus;           // required
  condition: EquipmentCondition;     // required
  location?: string | null;
  manufacturer?: string | null;
  model_name?: string | null;        // ⚠️ NOT model
  serial_number?: string | null;     // nullable, unique
  purchase_date?: string | null;     // YYYY-MM-DD
  purchase_price?: number | null;    // numeric, min:0
  description?: string | null;
  image_url?: string | null;
}
```

### UI Behaviour
- **Borrow button**: only show/enable when `is_borrowable === true`
- `status` should render as colour-coded badge: `available`=green, `borrowed`=blue, `in_use`=amber, `under_maintenance`=red
- `condition` badge: `good`=green, `normal`=amber, `broken`=red

---

## Module 7 — Borrow Records

**Base URL:** `/api/borrow-records`

### TypeScript Type
```typescript
export interface BorrowRecord {
  id: number;
  status: BorrowStatus;
  quantity: number;
  borrowed_at: string;       // ISO 8601
  due_at: string | null;     // ISO 8601
  returned_at: string | null;
  is_overdue: boolean;       // computed server-side
  notes: string | null;
  user: { id: number; name: string; } | null;
  item: {
    type: BorrowableType;    // 'equipment' | 'chemical' | 'plant_sample'
    id: number;
    data: Equipment | Chemical | PlantSample | null; // embedded when loaded
  };
  created_at: string;
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/borrow-records` | `type`, `user_id`, `status`, `active_only=1`, `overdue_only=1`, `page` |
| Create (Borrow) | POST | `/api/borrow-records` | — |
| Show | GET | `/api/borrow-records/{id}` | — |
| Return | POST | `/api/borrow-records/{id}/return` | — |
| Overdue List | GET | `/api/borrow-records/overdue` | `page` |

### Borrow Payload
```typescript
export interface BorrowPayload {
  user_id: number;                // required, exists in users
  borrowable_type: BorrowableType; // 'equipment' | 'chemical' | 'plant_sample'
  borrowable_id: number;          // required
  quantity: number;               // required, min:1
  due_at?: string | null;         // ISO date, must be in the future
  notes?: string | null;
}
```

### Return Payload
```typescript
export interface ReturnPayload {
  notes?: string | null;
}
// POST /api/borrow-records/{id}/return
```

### Error Handling for Borrow
```typescript
// HTTP 400 — item_not_borrowable
{ "error": "item_not_borrowable", "message": "Equipment 'X' is not available..." }
// HTTP 422 — insufficient_stock
{ "error": "insufficient_stock", "message": "...", "details": { "requested": 5, "available": 2 } }
```
Show these errors as toast notifications with the `message` field.

---

## Module 8 — Transactions (Read-Only)

**Base URL:** `/api/transactions`

### TypeScript Type
```typescript
export interface Transaction {
  id: number;
  action: TransactionAction;
  quantity: string | null;   // decimal as string
  note: string | null;
  user: { id: number; name: string; } | null;
  item: {
    type: string;    // morph alias: 'chemical', 'equipment', 'plant_stock', etc.
    id: number;
    data: unknown;   // dynamically loaded model
  };
  created_at: string;
}
```

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/transactions` | `type`, `action`, `user_id`, `recent=1`, `page` |
| Show | GET | `/api/transactions/{id}` | — |

> **No Create/Update/Delete** — Transactions are created automatically by the backend when borrowing, returning, or modifying stock.

---

## Module 9 — Users

**Base URL:** `/api/users`

### TypeScript Type
```typescript
export interface LabUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
```

> Note: response structure for list is `{ data: LabUser[], meta: {...}, links: {...} }` from Laravel paginator.  
> Response structure for single item is `{ data: LabUser }`.

### API Operations

| Op | Method | URL | Query Params |
|---|---|---|---|
| List | GET | `/api/users` | `search`, `role`, `page` |
| Create | POST | `/api/users` | — |
| Show | GET | `/api/users/{id}` | — |
| Update | PUT/PATCH | `/api/users/{id}` | — |
| Delete | DELETE | `/api/users/{id}` | — |

### Create Payload
```typescript
export interface UserCreatePayload {
  name: string;              // required
  email: string;             // required, unique
  password: string;          // required, confirmed
  password_confirmation: string; // required
  phone?: string | null;     // max:20
  role: UserRole;            // required
}
```

### Update Payload
```typescript
export interface UserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string | null;
  role?: UserRole;
}
```

---

## Service Layer Pattern

Create one service file per module. Example structure:

```
src/
  services/
    plantSpeciesService.ts
    plantVarietyService.ts
    plantSampleService.ts
    plantStockService.ts
    chemicalService.ts
    equipmentService.ts
    borrowRecordService.ts
    transactionService.ts
    userService.ts
```

Example service pattern:
```typescript
// src/services/chemicalService.ts
import { api } from '@/lib/api';
import type { PaginatedResponse } from '@/types/pagination';
import type { Chemical, ChemicalPayload } from '@/types/chemical';

export const chemicalService = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Chemical>>('/chemicals', { params }),

  show: (id: number) =>
    api.get<{ data: Chemical }>(`/chemicals/${id}`),

  create: (payload: ChemicalPayload) =>
    api.post<{ data: Chemical }>('/chemicals', payload),

  update: (id: number, payload: Partial<ChemicalPayload>) =>
    api.put<{ data: Chemical }>(`/chemicals/${id}`, payload),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/chemicals/${id}`),
};
```

---

## CRUD Page Implementation Pattern

For every module, implement:

### 1. List Page (`/chemicals`)
- Fetch from API on mount with `useEffect` or TanStack Query
- Show pagination controls linked to `meta.current_page` / `meta.last_page`
- Search input → debounce 300ms → re-fetch with `?search=`
- Filter dropdowns → re-fetch with enum query params
- Loading skeleton while fetching
- Empty state when `data.length === 0`
- Action buttons: Edit (opens modal/drawer), Delete (with confirmation dialog)

### 2. Create/Edit Modal or Page
- Form fields must match **exactly** the payload types defined above
- Use `React Hook Form` + `Zod` for client-side validation (mirror the backend rules)
- On submit → POST/PUT → show success toast → close modal → refetch list
- On error 422 → display field-level errors under each input
- For selects (dropdowns): populate options from the enum type arrays

### 3. Delete Confirmation
- Show a confirmation dialog (not window.confirm)
- On confirm → DELETE → show success toast → remove item from list optimistically or refetch

### 4. Detail/Show View
- Load the full item from `/api/{resource}/{id}`
- Show all fields, including relationships (e.g., species inside a variety card)

---

## Special UI Adjustments Required

### A. Plant Sample Response Shape Mapping
The PlantSample response is **deeply nested**. Map it to a flat display:
```typescript
// When rendering sample data, access like this:
sample.identity.name      // display name
sample.identity.code      // display code
sample.details.quantity   // display quantity
sample.lab_info.location  // display lab location
sample.relationships.species?.common_name // display species name
```

### B. Plant Stock `net_available`
Always read from `inventory.net_available` — never compute it client-side. The backend guarantees it is always `>= 0`.

### C. Equipment `model_name` not `model`
The field in the API is `model_name`. Do NOT use `model` — it will be ignored by the backend.

### D. Varieties: `plant_specy_id` not `plant_species_id`
The FK is the legacy spelling `plant_specy_id`. All forms that create/update a variety must send this exact key.

### E. Borrow Overdue Detection
Do NOT compute overdue client-side. Use `is_overdue` from the response. For the overdue list, use `GET /api/borrow-records/overdue`.

### F. Delete = Soft Delete
Deleted items disappear from lists but are not destroyed. No "restore" functionality is required in the UI.

---

## Form Validation (Zod Schemas — Mirror Backend Rules)

```typescript
import { z } from 'zod';

// Chemical
export const chemicalSchema = z.object({
  common_name:      z.string().min(1).max(255),
  chemical_code:    z.string().max(100).nullable().optional(),
  category:         z.enum(['acid','base','solvent','oxidizer','reducer','other']),
  quantity:         z.number().int().min(0),
  storage_location: z.string().max(255).nullable().optional(),
  expiry_date:      z.string().nullable().optional(),
  danger_level:     z.enum(['low','medium','high']),
  safety_measures:  z.string().nullable().optional(),
  description:      z.string().nullable().optional(),
  image_url:        z.string().url().nullable().optional(),
});

// Equipment
export const equipmentSchema = z.object({
  equipment_name:  z.string().min(1).max(255),
  equipment_code:  z.string().max(100).nullable().optional(),
  category:        z.enum(['microscope','centrifuge','incubator','spectrophotometer','other']),
  status:          z.enum(['available','borrowed','in_use','under_maintenance']),
  condition:       z.enum(['good','normal','broken']),
  location:        z.string().max(255).nullable().optional(),
  manufacturer:    z.string().max(255).nullable().optional(),
  model_name:      z.string().max(255).nullable().optional(),
  serial_number:   z.string().max(255).nullable().optional(),
  purchase_date:   z.string().nullable().optional(),
  purchase_price:  z.number().min(0).nullable().optional(),
  description:     z.string().nullable().optional(),
  image_url:       z.string().url().nullable().optional(),
});

// PlantSpecies
export const plantSpeciesSchema = z.object({
  common_name:        z.string().min(1).max(255),
  khmer_name:         z.string().max(255).nullable().optional(),
  scientific_name:    z.string().min(1).max(255),
  family:             z.string().max(255).nullable().optional(),
  growth_type:        z.enum(['annual','perennial','biennial']),
  native_region:      z.string().max(255).nullable().optional(),
  propagation_method: z.string().max(255).nullable().optional(),
  description:        z.string().nullable().optional(),
  image_url:          z.string().url().nullable().optional(),
});

// PlantVariety
export const plantVarietySchema = z.object({
  plant_specy_id: z.number().int().positive(), // ⚠️ plant_specy_id NOT plant_species_id
  name:           z.string().min(1).max(255),
  variety_code:   z.string().min(1).max(100),
  description:    z.string().nullable().optional(),
  image_url:      z.string().url().nullable().optional(),
});

// PlantStock
export const plantStockSchema = z.object({
  plant_specy_id:    z.number().int().positive(),
  plant_variety_id:  z.number().int().positive().nullable().optional(),
  plant_sample_id:   z.number().int().positive().nullable().optional(),
  quantity:          z.number().int().min(0),
  reserved_quantity: z.number().int().min(0),
  status:            z.enum(['available','reserved','out_of_stock']),
}).refine(d => d.reserved_quantity <= d.quantity, {
  message: 'Reserved quantity cannot exceed total quantity',
  path: ['reserved_quantity'],
});

// BorrowRecord
export const borrowSchema = z.object({
  user_id:          z.number().int().positive(),
  borrowable_type:  z.enum(['equipment','chemical','plant_sample']),
  borrowable_id:    z.number().int().positive(),
  quantity:         z.number().int().min(1),
  due_at:           z.string().nullable().optional(),
  notes:            z.string().nullable().optional(),
});

// User Create
export const userCreateSchema = z.object({
  name:                  z.string().min(1).max(255),
  email:                 z.string().email().max(255),
  password:              z.string().min(8),
  password_confirmation: z.string().min(8),
  phone:                 z.string().max(20).nullable().optional(),
  role:                  z.enum(['admin','lab_manager','student']),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});
```

---

## Dashboard Integration

The backend has a `DashboardService` and `DashboardResource`. Connect the dashboard page to:

```
GET /api/dashboard   (if implemented — if not, aggregate from individual endpoints)
```

Dashboard should display:
- Total plant species count
- Total samples count (by status breakdown)
- Total stock items (available vs reserved vs out-of-stock)
- Total chemicals (with expired count, expiring soon count, low stock count)
- Equipment status breakdown (available / borrowed / in use / maintenance)
- Recent transactions (GET `/api/transactions?recent=1&page=1`)
- Overdue borrows count (GET `/api/borrow-records/overdue`)

---

## CORS & Environment

The backend CORS config allows:
- `http://localhost:5173` ← Vite default
- `http://localhost:3000`
- `http://localhost:8080`
- `withCredentials: true` is required

Create `.env` file in the React project root:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## HTTP Status Codes Reference

| Status | Meaning | Action |
|---|---|---|
| 200 | OK | Parse `data` from response |
| 201 | Created | Parse `data`, show success toast, reset form |
| 400 | Bad Request (not borrowable) | Show `message` as toast error |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show "Not Found" state |
| 422 | Validation Error | Map `errors` to form field errors |
| 500 | Server Error | Show generic error toast |

---

## Implementation Checklist

- [ ] Create `src/lib/api.ts` with Axios instance
- [ ] Create `src/types/enums.ts` with all enum types
- [ ] Create `src/types/pagination.ts` with PaginatedResponse type
- [ ] Create one service file per module in `src/services/`
- [ ] Create TypeScript interfaces for all 9 modules
- [ ] Create Zod schemas for all forms
- [ ] Replace all mock data in Plant Species page → real API
- [ ] Replace all mock data in Plant Varieties page → real API
- [ ] Replace all mock data in Plant Samples page → real API
- [ ] Replace all mock data in Plant Stocks page → real API
- [ ] Replace all mock data in Chemicals page → real API
- [ ] Replace all mock data in Equipment page → real API
- [ ] Replace all mock data in Borrow Records page → real API
- [ ] Replace all mock data in Transactions page → real API
- [ ] Replace all mock data in Users page → real API
- [ ] Replace all mock data in Dashboard → real API aggregation
- [ ] Implement pagination component
- [ ] Implement search debounce
- [ ] Implement global error toast for API errors
- [ ] Handle loading states (skeletons)
- [ ] Handle empty states
- [ ] Handle 401 redirect to login
- [ ] Test borrow → return full flow end-to-end
- [ ] Test chemical expiry badge logic
- [ ] Test equipment `is_borrowable` gate
- [ ] Test stock `net_available` display

---

*Generated from the Plant-Lap-Laboratory Laravel 11 backend — March 2, 2026*

