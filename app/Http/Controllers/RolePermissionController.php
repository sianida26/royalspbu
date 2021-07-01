<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use Debugbar;

class RolePermissionController extends Controller
{
    //

    public function getAllPermissions(Request $request){
        return Permission::all();
    }

    public function addPermission(Request $request){

        $rules = [
            'name' => ['required', 'string', 'unique:permissions,name'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'string' => 'Harus berupa string',
            'unique' => 'Permission ini sudah ada',
        ];

        $request->validate($rules, $messages);

        $permission = Permission::create(['name' => $request->name]);

        return $permission;
    }

    public function editPermission(Request $request){

        $permission = Permission::findOrFail($request->id);

        $rules = [
            'id' => ['required', 'exists:permissions,id'],
            'name' => ['required', 'string', Rule::unique('permissions')->ignore($permission->id, 'id')],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'string' => 'Harus berupa string',
            'unique' => 'Permission ini sudah ada',
            'exists' => 'Permission ini tidak tersedia',
        ];

        $request->validate($rules, $messages);

        $permission->name = $request->name;
        $permission->save();

        return $permission;
    }

    public function deletePermission(Request $request){

        $permission = Permission::findOrFail($request->id);
        $permission->delete();

        return 'OK';
    }

    public function getAllRoles(Request $request){
        return Role::all()->load('permissions');
    }

    public function addRole(Request $request){

        $rules = [
            'name' => ['required', 'string', 'unique:roles,name'],
            'permissions.*' => ['required','exists:permissions,id'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'string' => 'Harus berupa string',
            'unique' => 'Role ini sudah ada',
            'exists' => 'Permission ini tidak tersedia'
        ];

        $request->validate($rules, $messages);

        $role = Role::create(['name' => $request->name]);

        $role->syncPermissions($request->permissions);

        return $role;
    }

    public function editRole(Request $request){

        $role = Role::findOrFail($request->id);

        $rules = [
            'name' => ['required', 'string', Rule::unique('roles')->ignore($role->id, 'id')],
            'permissions.*' => ['required','exists:permissions,id'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'string' => 'Harus berupa string',
            'unique' => 'Role ini sudah ada',
            'exists' => 'Permission ini tidak tersedia'
        ];

        $request->validate($rules, $messages);

        $role->name = $request->name;
        $role->save();

        $role->syncPermissions($request->permissions);

        return $role;
    }

    public function deleteRole(Request $request){

        $role = Role::findOrFail($request->id);
        $role->delete();

        return 'OK';
    }
}
