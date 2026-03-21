# Role & Permission API — Developer Guide

## Overview

This document covers the complete Role & Permission system built on top of **Spatie Laravel Permission v7** with **JWT authentication** (guard: `api`).

The system provides:

- 3 seeded roles with appropriate permission sets
- 24 granular permissions across all modules
- Full CRUD for roles and permissions
- Role ↔ Permissions assignment
- Role ↔ Users assignment
- Admin-only middleware protection

---

## Architecture

### Components Created / Modified

| File                                                | Action    | Purpose                                              |
| --------------------------------------------------- | --------- | ---------------------------------------------------- |
| `app/Http/Controllers/Api/RoleController.php`       | Rewritten | Full CRUD + assign/revoke permissions & users        |
| `app/Http/Controllers/Api/PermissionController.php` | Rewritten | Full CRUD                                            |
| `app/Http/Middleware/AdminMiddleware.php`           | Created   | Blocks non-admin users with 403                      |
| `app/Http/Controllers/Api/AuthController.php`       | Updated   | Profile now returns roles & permissions              |
| `bootstrap/app.php`                                 | Updated   | Registered `admin` middleware alias                  |
| `routes/api.php`                                    | Updated   | Full role/permission routes under `auth:api + admin` |
| `database/seeders/RolePermissionSeeder.php`         | Created   | Seeds 3 roles + 24 permissions                       |
| `database/seeders/UserSeeder.php`                   | Updated   | Assigns Spatie roles to seeded users                 |
| `database/seeders/DatabaseSeeder.php`               | Updated   | Runs `RolePermissionSeeder` before `UserSeeder`      |
| `app/Providers/AppServiceProvider.php`              | Updated   | Added `user` to morph map (required by Spatie)       |

### Why `guard_name = 'api'`?

The app uses JWT with the `api` guard. Spatie defaults to `web`. All roles and permissions are created with `guard_name = 'api'` so Spatie resolves them correctly through the JWT guard.

---

## Seeded Roles & Permissions

### Roles

| Role        | Spatie Name   | Assigned To           |
| ----------- | ------------- | --------------------- |
| Admin       | `admin`       | `admin@biolab.test`   |
| Lab Manager | `lab-manager` | `manager@biolab.test` |
| Student     | `student`     | All factory users     |

### Permissions (24 total)

| Area                | Permissions                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| Users               | `users.view`, `users.create`, `users.edit`, `users.delete`                 |
| Roles & Permissions | `roles.view`, `roles.manage`, `permissions.view`, `permissions.manage`     |
| Plants              | `plants.view`, `plants.create`, `plants.edit`, `plants.delete`             |
| Chemicals           | `chemicals.view`, `chemicals.create`, `chemicals.edit`, `chemicals.delete` |
| Equipment           | `equipment.view`, `equipment.create`, `equipment.edit`, `equipment.delete` |
| Borrows             | `borrows.view`, `borrows.create`, `borrows.return`                         |
| Transactions        | `transactions.view`                                                        |

### Permission Matrix

| Permission Area         | admin | lab-manager |    student    |
| ----------------------- | :---: | :---------: | :-----------: |
| users.\*                |  ✅   |  view only  |      ❌       |
| roles._ / permissions._ |  ✅   |     ❌      |      ❌       |
| plants.\*               |  ✅   |     ✅      |   view only   |
| chemicals.\*            |  ✅   |     ✅      |   view only   |
| equipment.\*            |  ✅   |     ✅      |   view only   |
| borrows.\*              |  ✅   |     ✅      | view + create |
| transactions.view       |  ✅   |     ✅      |      ✅       |

---

## API Reference

**Base URL:** `http://localhost:8000/api`

All role/permission endpoints require:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

> **Admin-only:** All `/roles` and `/permissions` endpoints require the authenticated user to have the `admin` role (enforced by `AdminMiddleware`). Non-admins receive `403 Forbidden`.

---

### Authentication

#### POST `/auth/login`

Login and receive a JWT token.

```json
// Request
{ "email": "admin@biolab.test", "password": "password" }

// Response 200
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### GET `/auth/profile` 🔒

Returns the authenticated user's profile including Spatie roles and all resolved permissions.

```json
// Response 200
{
    "id": 1,
    "name": "Admin User",
    "email": "admin@biolab.test",
    "phone": "+855-12-000-000",
    "role": "admin",
    "roles": ["admin"],
    "permissions": ["users.view", "users.create", "roles.view", "..."]
}
```

---

### Roles

#### GET `/roles` 🔒🛡️

List all roles with their assigned permissions.

```json
// Response 200
[
  {
    "id": 1,
    "name": "admin",
    "guard_name": "api",
    "permissions": [
      { "id": 1, "name": "users.view" },
      ...
    ],
    "created_at": "2026-03-03T07:00:00.000000Z"
  }
]
```

#### POST `/roles` 🔒🛡️

Create a new role. Optionally assign permissions on creation.

```json
// Request
{
  "name": "researcher",
  "permissions": ["plants.view", "chemicals.view"]
}

// Response 201
{
  "id": 4,
  "name": "researcher",
  "guard_name": "api",
  "permissions": [
    { "id": 1, "name": "plants.view" },
    { "id": 5, "name": "chemicals.view" }
  ],
  "created_at": "..."
}
```

#### GET `/roles/{id}` 🔒🛡️

Get a single role with its permissions.

```json
// Response 200 — same structure as list item
```

#### PUT `/roles/{id}` 🔒🛡️

Update a role name and/or sync its permissions (replaces all current permissions).

```json
// Request
{
    "name": "senior-researcher",
    "permissions": ["plants.view", "plants.create"]
}
```

#### DELETE `/roles/{id}` 🔒🛡️

Delete a role.

```json
// Response 200
{ "message": "Role deleted successfully" }
```

---

### Role ↔ Permissions

#### GET `/roles/{id}/permissions` 🔒🛡️

List all permissions currently assigned to a role.

```json
// Response 200
[
    { "id": 1, "name": "users.view" },
    { "id": 2, "name": "plants.view" }
]
```

#### POST `/roles/{id}/permissions` 🔒🛡️

Assign a single permission to a role (additive, does not replace existing).

```json
// Request
{ "permission": "plants.create" }

// Response 200
{ "message": "Permission 'plants.create' assigned to role 'researcher'" }
```

#### DELETE `/roles/{id}/permissions/{permissionName}` 🔒🛡️

Revoke a single permission from a role.

```
DELETE /api/roles/4/permissions/plants.create
```

```json
// Response 200
{ "message": "Permission 'plants.create' revoked from role 'researcher'" }
```

---

### Role ↔ Users

#### GET `/roles/{id}/users` 🔒🛡️

List all users who have a given role.

```json
// Response 200
[
    {
        "id": 1,
        "name": "Admin User",
        "email": "admin@biolab.test",
        "role": "admin"
    }
]
```

#### POST `/roles/{id}/users` 🔒🛡️

Assign a role to a user.

```json
// Request
{ "user_id": 5 }

// Response 200
{ "message": "Role 'researcher' assigned to user 'Jane Doe'" }
```

#### DELETE `/roles/{id}/users/{userId}` 🔒🛡️

Revoke a role from a user.

```
DELETE /api/roles/4/users/5
```

```json
// Response 200
{ "message": "Role 'researcher' revoked from user 'Jane Doe'" }
```

---

### Permissions

#### GET `/permissions` 🔒🛡️

List all permissions (ordered alphabetically).

```json
// Response 200
[
  { "id": 3, "name": "borrows.create", "created_at": "..." },
  { "id": 4, "name": "borrows.return", "created_at": "..." },
  ...
]
```

#### POST `/permissions` 🔒🛡️

Create a new permission.

```json
// Request
{ "name": "reports.export" }

// Response 201
{ "id": 25, "name": "reports.export", "guard_name": "api", "created_at": "..." }
```

#### GET `/permissions/{id}` 🔒🛡️

Get a single permission.

#### PUT `/permissions/{id}` 🔒🛡️

Rename a permission.

```json
// Request
{ "name": "reports.download" }
```

#### DELETE `/permissions/{id}` 🔒🛡️

Delete a permission.

```json
// Response 200
{ "message": "Permission deleted successfully" }
```

---

## Postman Quick Reference

### Step 1 — Login (get token)

```
POST http://localhost:8000/api/auth/login
Body (raw JSON):
{
  "email": "admin@biolab.test",
  "password": "password"
}
```

Copy the `access_token` value.

### Step 2 — Set Bearer token

In Postman: `Authorization` tab → `Bearer Token` → paste token.

### Step 3 — Test endpoints

| Action                      | Method | URL                                    |
| --------------------------- | ------ | -------------------------------------- |
| List roles                  | GET    | `/api/roles`                           |
| Create role                 | POST   | `/api/roles`                           |
| Add permission to role      | POST   | `/api/roles/1/permissions`             |
| Remove permission from role | DELETE | `/api/roles/1/permissions/plants.view` |
| Assign role to user         | POST   | `/api/roles/1/users`                   |
| Remove role from user       | DELETE | `/api/roles/1/users/5`                 |
| List permissions            | GET    | `/api/permissions`                     |
| Create permission           | POST   | `/api/permissions`                     |
| My profile + permissions    | GET    | `/api/auth/profile`                    |

### Error Responses

| Status | Meaning                        |
| ------ | ------------------------------ |
| `401`  | Missing or invalid JWT token   |
| `403`  | Authenticated but not admin    |
| `404`  | Role/permission/user not found |
| `422`  | Validation failed              |

---

## Legend

- 🔒 Requires `Authorization: Bearer <token>` (JWT)
- 🛡️ Requires `admin` role (enforced by `AdminMiddleware`)
