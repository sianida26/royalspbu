<?php

namespace App\Http\Controllers;


use App\Models\AppConfig;
use App\Models\TotalizatorReport;
use App\Models\DailyPumpReport;
use App\Models\Presence;
use App\Models\User;

use Carbon\Carbon;

use Debugbar;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use Spatie\Permission\Models\Role;

/**
 * @group User Management
 * 
 * API untuk pengaturan user
 */

class UserController extends Controller
{
    
    
    /**
     * Get All User
     * 
     * Mendapatkan semua user
     * 
     * @authenticated
     * @bodyParam [] object[] List user. Contoh: [{"id": 3, "name": "Fulan bin Fulanah", "username": "fulan", "is_active": true}]
     * @bodyParam [].id integer id user
     * @bodyParam [].name string nama lengkap user
     * @bodyParam [].username string username user
     * @bodyParam [].is_active boolean status aktif user
     */
    function getAllUser(Request $request){

        $users = User::all()->map(function($user){
            $roleId = -1;
            $roleName = '';
            if ($user->roles->isNotEmpty()){
                $role = $user->roles->first();
                $roleId = $role->id;
                $roleName = $role->name;
            }
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'isActive' => $user->is_active,
                'roleId' => $roleId,
                'roleName' => $roleName,
            ];
        });

        $defaultPassword = AppConfig::getValue('default_password');

        return [
            'users' => $users,
            'defaultPassword' => $defaultPassword,
        ];
    }

    /**
     * Add user
     * 
     * Menambahkan user baru
     * 
     * @authenticated
     * @queryParam username string required username user baru. harus unique
     * @queryParam name string required nama lengkap user baru
     * @queryParam password string required password dalam plain text minimal 8 karakter
     * @queryParam isActive boolean required status keaktivan user
     * 
     * @response scenario=success{
     *  "id": 5,
     *  "name" : "Fulan bin Fulanah",
     *  "username" : "fulan",
     * } 
     * 
     * @response status=422{
     *  "id": "Harus diisi",
     *  "name" : "Harus diisi",
     *  "username" : "Harus diisi",
     * }
     */
    function addUser(Request $request){

        $messages = [
            'required' => 'Harus diisi',
            'unique' => ':attribute ini sudah ada',
            'min' => 'Minimal harus :min karakter',
            'boolean' => 'Data harus berupa boolean',
        ];

        //Query parameters
        $request->validate([
            'username' => ['required', 'unique:users,username'],
            'name' => ['required'],
            'roleId' => ['required'],
            'password' => ['required', 'min:8'],
            'isActive' => ['required', 'boolean'],
        ], $messages);

        abort(200);
        return;

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'is_active' => $request->isActive,
        ]);

        $role = Role::find($request->roleId);
        $user->syncRoles([$role->name]);

        return $user->makeHidden(['created_at','updated_at','password']);
    }

    /**
     * Edit user
     * 
     * API untuk mengedit user
     * 
     * @authenticated
     * @queryParam id integer required id user berdasarkan database
     * @queryParam username string required username user baru. harus unique
     * @queryParam name string required nama lengkap user baru
     * @queryParam isActive boolean required status keaktivan user
     * 
     * @response scenario=success{
     *  "id": 5,
     *  "name" : "Fulan bin Fulanah",
     *  "username" : "fulan",
     * } 
     * 
     * @response status=404{
     * "message" : "User tidak ditemukan"
     * }
     * 
     * @response status=422{
     *  "id": "Harus diisi",
     *  "name" : "Harus diisi",
     *  "username" : "Harus diisi",
     * }
     */
    function editUser(Request $request){

        $messages = [
            'required' => 'Harus diisi',
            'unique' => ':attribute ini sudah ada',
            'min' => 'Minimal harus :min karakter',
            'boolean' => 'Data harus berupa boolean',
        ];

        //Query parameters
        $request->validate([
            'id' => ['required', 'integer'],
            'username' => ['required', Rule::unique('users','username')->ignore($request->id)],
            'name' => ['required'],
            'roleId' => ['required'],
            'isActive' => ['required', 'boolean'],
        ], $messages);

        $user = User::findOrFail($request->id);

        $user->username = $request->username;
        $user->name = $request->name;
        $user->is_active = $request->isActive;
        $user->save();

        $role = Role::find($request->roleId);
        $user->syncRoles([$role->name]);

        return $user->makeHidden(['created_at','updated_at','password']);
    }

    /**
     * Delete user
     * 
     * @authenticated
     * @queryParam id integer required ID user yang ingin dihapus
     * 
     * @response scenario=success{
     * "username": "fulan",
     * "name": "fulan bin fulanah"
     * "message": "User berhasil dihapus"
     * }
     * 
     * @response status=401{
     * "message": "Password salah"
     * }
     * 
     * @response status=404{
     * "message": "User tidak ditemukan"
     * }
     */
    function deleteUser(Request $request){

        $deleter = Auth::user();

        if ($request->id == $deleter->id) {
            abort(422, 'Anda tidak bisa menghapus diri anda sendiri');
            return;
        }

        if (Hash::check($request->password, $deleter->password)){
            $user = User::findOrFail($request->id);

            if ($user->hasRole('developer') && !$deleter->hasRole('developer')){
                abort(422, 'Anda tidak bisa menghapus developer');
                return;
            }
            $user->delete();
            return [
                'username' => $user->username,
                'name' => $user->name,
                'message' => 'User berhasil dihapus',
            ];
        } else {
            abort(422, 'Password salah');
        }
    }

    /**
     * Reset Password user
     * 
     * API untuk mereset password user menjadi password default di config
     * 
     * @authenticated
     * @queryParam id integer required ID user yang ingin dihapus
     * 
     * @response scenario=success{
     * "username": "fulan",
     * "name": "fulan bin fulanah"
     * "message": "User berhasil direset password"
     * }
     * 
     * @response status=401{
     * "message": "Password salah"
     * }
     * 
     * @response status=404{
     * "message": "User tidak ditemukan"
     * }
     */
    function resetUserPassword(Request $request){

        $resetter = Auth::user();

        if (Hash::check($request->password, $resetter->password)){
            $user = User::findOrFail($request->id);
            $defaultPassword = AppConfig::getValue('default_password');
            $user->password = Hash::make($defaultPassword);
            $user->save();
            return [
                'username' => $user->username,
                'name' => $user->name,
                'message' => 'User berhasil direset password',
            ];
        } else {
            abort(422, 'Password salah');
        }
    }

    function getAllRoles(Request $request){
        return Role::select('id','name')->get();
    }

    function getOperatorReportingStatus(Request $request){

        $presenceStatus = Presence::where('user_id', Auth::id())
            ->whereDate('timestamp', Carbon::today())
            ->exists();
        
        $report = DailyPumpReport::where('reporter_id', Auth::id())
            ->whereDate('created_at', Carbon::today())
            ->first();

        $reportEdit = null;
        $canCreateNewReport = $report ? false : true;

        if ($report !== null && $report->editable){

            $nozzles = $report->nozzles->map(function($nozzle){
                
                return [
                    'id' => $nozzle->nozzle_id,
                    'productName' => $nozzle->product_name,
                    'imageUrl' => '/storage/images/reports/'.$nozzle->report_filename,
                    'reportFilename' => $nozzle->report_filename,
                    'totalizator' => $nozzle->totalizator_final,
                ];
            });

            $reportEdit = [
                'id' => $report->id,
                'pumpNumber' => $report->pump_number,
                'pumpId' => $report->pump_id,
                'nozzles' => $nozzles,
            ];

            $canCreateNewReport = true;
        }

        return [
            'presence' => $presenceStatus,
            'report' => !$canCreateNewReport,
            'reportEdit' => $reportEdit,
        ];
    }
}
