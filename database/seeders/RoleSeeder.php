<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roleNames = [
            [
                'name' => 'developer',
                'permissions' => []
            ],
            [
                'name' => 'admin',
                'permissions' => [
                    'user',
                    'role.getAll',
                    'product',
                    'tank',
                    'pump',
                    'presence.getAll',
                    'presence.scan',
                ],
            ],
            [
                'name' => 'supervisor',
                'permissions' => [],
            ],
            [
                'name' => 'operator',
                'permissions' => [
                    'presence.requestToken',
                ]
            ],
        ];

        collect($roleNames)->map(function($role){
            $roleModel = Role::firstWhere('name',$role['name']);
            if ($roleModel == null) { 
                $roleModel = Role::create(['name' => $role['name'], 'guard_name' => 'api']);
            }
            $roleModel->syncPermissions($role['permissions']);
        });
    }
}
