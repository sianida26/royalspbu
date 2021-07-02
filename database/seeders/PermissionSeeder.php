<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{

    

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permissionNames = [
            'user',
            'user.getAll',
            'user.create',
            'user.edit',
            'user.delete',
            'permission',
            'permission.getAll',
            'permission.create',
            'permission.edit',
            'permission.delete',
            'role',
            'role.getAll',
            'role.create',
            'role.edit',
            'role.delete',
            'product',
            'product.getAll',
            'product.create',
            'product.edit',
            'product.delete',
            'tank',
            'tank.getAll',
            'tank.create',
            'tank.edit',
            'tank.delete',
            'pump',
            'pump.getAll',
            'pump.create',
            'pump.edit',
            'pump.delete',
            'presence',
            'presence.requestToken',
            'presence.scan',
            'presence.getAll',
        ];
        $skipCount = 0;
        collect($permissionNames)->map(function ($name) use (&$skipCount){
            if (Permission::all()->contains('name', $name)) { //preventing duplicate permission
                $skipCount++;
                return;
            }
            $permission = Permission::create(['guard_name' => 'api', 'name' => $name]);
        });
        if ($skipCount > 0) $this->command->info($skipCount.' '. Str::plural('permission',$skipCount) .' skipped');
    }
}
