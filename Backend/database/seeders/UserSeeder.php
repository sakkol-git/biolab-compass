<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Clear Spatie's permission cache so role assignments are not affected
        // by any warm cache left over from RolePermissionSeeder
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = Role::findByName('admin', 'api');
        $managerRole = Role::findByName('lab-manager', 'api');
        $studentRole = Role::findByName('student', 'api');

        // ── Fixed admin account for quick login ──────────────────────────────
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@biolab.test',
            'password' => 'password',
            'role' => UserRole::ADMIN->value,
            'phone' => '+855-12-000-000',
        ]);
        $admin->refresh()->assignRole($adminRole);

        $manager = User::factory()->create([
            'name' => 'Lab Manager',
            'email' => 'manager@biolab.test',
            'password' => 'password',
            'role' => UserRole::LAB_MANAGER->value,
            'phone' => '+855-12-111-111',
        ]);
        $manager->refresh()->assignRole($managerRole);

        // ── Fixed student account for quick testing ──────────────────────────
        $student = User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@biolab.test',
            'password' => 'password',
            'role' => UserRole::STUDENT->value,
            'phone' => '+855-12-222-222',
        ]);
        $student->refresh()->assignRole($studentRole);

        // ── 10 random student users ──────────────────────────────────────────
        User::factory()->count(10)->create([
            'role' => UserRole::STUDENT->value,
        ])->each(fn ($u) => $u->refresh()->assignRole($studentRole));

        $this->command->info('  ✓ Users seeded (1 admin + 1 manager + 1 student + 10 random students)');
    }
}
