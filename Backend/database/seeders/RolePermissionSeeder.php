<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    private string $guard = 'api';

    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Define all permissions ───────────────────────────────────────────
        $permissions = [
            // Users
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Roles & Permissions
            'roles.view',
            'roles.manage',
            'permissions.view',
            'permissions.manage',

            // Plants
            'plants.view',
            'plants.create',
            'plants.edit',
            'plants.delete',

            // Chemicals
            'chemicals.view',
            'chemicals.create',
            'chemicals.edit',
            'chemicals.delete',

            // Chemical Batches
            'chemical_batches.view',
            'chemical_batches.create',
            'chemical_batches.edit',
            'chemical_batches.delete',

            // Chemical Usage
            'chemical_usage.view',
            'chemical_usage.create',

            // Equipment
            'equipment.view',
            'equipment.create',
            'equipment.edit',
            'equipment.delete',

            // Maintenance
            'maintenance.view',
            'maintenance.create',
            'maintenance.edit',
            'maintenance.delete',

            // Borrow Records
            'borrows.view',
            'borrows.create',
            'borrows.return',
            'borrows.approve',

            // Transactions
            'transactions.view',

            // Achievements
            'achievements.view',
            'achievements.create',
            'achievements.edit',
            'achievements.delete',

            // User Documents
            'user_documents.view',
            'user_documents.create',
            'user_documents.delete',

            // Dashboard & Reports
            'dashboard.view',
            'reports.view',
            'reports.export',

            // ── Research Module ──────────────────────────────────────────────
            // Experiments
            'experiments.view',
            'experiments.create',
            'experiments.edit',
            'experiments.delete',

            // Growth Logs
            'growth_logs.create',
            'growth_logs.edit',
            'growth_logs.delete',

            // Protocols
            'protocols.view',
            'protocols.create',
            'protocols.edit',
            'protocols.delete',

            // Lab Notebooks
            'notebooks.view',
            'notebooks.create',
            'notebooks.edit',
            'notebooks.delete',

            // Research Analytics
            'research-analytics.view',

            // ── Business Module ──────────────────────────────────────────────
            // Clients
            'clients.view',
            'clients.create',
            'clients.edit',
            'clients.delete',

            // Contracts
            'contracts.view',
            'contracts.create',
            'contracts.edit',
            'contracts.delete',
            'contracts.manage-status',

            // Contract Milestones
            'milestones.create',
            'milestones.edit',
            'milestones.delete',

            // Payments
            'payments.view',
            'payments.create',
            'payments.edit',
            'payments.delete',

            // Lab Services
            'lab_services.view',
            'lab_services.create',
            'lab_services.edit',
            'lab_services.delete',

            // Production Forecasts
            'forecasts.view',
            'forecasts.calculate',
            'forecasts.delete',

            // Business Dashboard
            'business-dashboard.view',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => $this->guard]);
        }

        // ── Create roles and assign permissions ──────────────────────────────

        // Admin — full access
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $this->guard]);
        $admin->syncPermissions($permissions);

        // Lab Manager — manage resources, approve borrows, but not users/roles
        // Full research & business access except delete (admin only for deletes)
        $manager = Role::firstOrCreate(['name' => 'lab-manager', 'guard_name' => $this->guard]);
        $manager->syncPermissions([
            'plants.view', 'plants.create', 'plants.edit', 'plants.delete',
            'chemicals.view', 'chemicals.create', 'chemicals.edit', 'chemicals.delete',
            'chemical_batches.view', 'chemical_batches.create', 'chemical_batches.edit', 'chemical_batches.delete',
            'chemical_usage.view', 'chemical_usage.create',
            'equipment.view', 'equipment.create', 'equipment.edit', 'equipment.delete',
            'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.delete',
            'borrows.view', 'borrows.create', 'borrows.return', 'borrows.approve',
            'transactions.view',
            'achievements.view', 'achievements.create', 'achievements.edit', 'achievements.delete',
            'user_documents.view', 'user_documents.create', 'user_documents.delete',
            'dashboard.view',
            'reports.view', 'reports.export',
            'users.view',
            // Research — full (create/edit, delete handled by admin-only policy)
            'experiments.view', 'experiments.create', 'experiments.edit',
            'growth_logs.create', 'growth_logs.edit',
            'protocols.view', 'protocols.create', 'protocols.edit',
            'notebooks.view', 'notebooks.create', 'notebooks.edit',
            'research-analytics.view',
            // Business — full except delete
            'clients.view', 'clients.create', 'clients.edit',
            'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.manage-status',
            'milestones.create', 'milestones.edit',
            'payments.view', 'payments.create', 'payments.edit',
            'lab_services.view', 'lab_services.create', 'lab_services.edit',
            'forecasts.view', 'forecasts.calculate',
            'business-dashboard.view',
        ]);

        // Student — view + create + borrow + own documents
        // Research: view + create growth logs + create/edit own notebooks
        // Business: view only
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => $this->guard]);
        $student->syncPermissions([
            'plants.view', 'plants.create', 'plants.edit',
            'chemicals.view',
            'chemical_batches.view',
            'chemical_usage.view', 'chemical_usage.create',
            'equipment.view',
            'maintenance.view',
            'borrows.view', 'borrows.create',
            'transactions.view',
            'achievements.view',
            'user_documents.view', 'user_documents.create', 'user_documents.delete',
            'dashboard.view',
            // Research — view + create growth logs + own notebooks
            'experiments.view',
            'growth_logs.create',
            'protocols.view',
            'notebooks.view', 'notebooks.create', 'notebooks.edit',
            'research-analytics.view',
            // Business — view only
            'clients.view',
            'contracts.view',
            'payments.view',
            'lab_services.view',
            'forecasts.view',
            'business-dashboard.view',
        ]);

        $this->command->info('  ✓ Roles & permissions seeded (admin + lab-manager + student)');
    }
}
