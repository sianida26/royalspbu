<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TankController;
use App\Http\Controllers\PumpController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\DailyPumpReportController;
use App\Http\Controllers\TotalizatorReportController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\PenerimaanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
// Route::get('/admin/user/getAll', [UserController::class, 'getAllUser'] );

Route::middleware('auth:api')->group(function(){
    
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::prefix('admin')->group(function(){
        Route::prefix('user')->group(function(){
            Route::get('/getAll', [UserController::class, 'getAllUser'] );
            Route::get('/getAllRoles', [UserController::class, 'getAllRoles']);
            Route::post('/add', [UserController::class, 'addUser'] );
            Route::post('/edit', [UserController::class, 'editUser']);
            Route::post('/delete', [UserController::class, 'deleteUser']);
            Route::post('/resetPassword', [UserController::class, 'resetUserPassword']);
        });

        Route::prefix('permission')->group(function(){
            Route::get('/getAll', [RolePermissionController::class, 'getAllPermissions']);
            Route::post('/add', [RolePermissionController::class, 'addPermission']);
            Route::post('/edit', [RolePermissionController::class, 'editPermission']);
            Route::post('/delete', [RolePermissionController::class, 'deletePermission']);
        });

        Route::prefix('role')->group(function(){
            Route::get('/getAll', [RolePermissionController::class, 'getAllRoles']);
            Route::post('/add', [RolePermissionController::class, 'addRole']);
            Route::post('/edit', [RolePermissionController::class, 'editRole']);
            Route::post('/delete', [RolePermissionController::class, 'deleteRole']);
        });

        Route::prefix('product')->group(function(){
            Route::get('/getAll',[ProductController::class, 'getAllProducts']);
            Route::post('/add',[ProductController::class, 'addProduct']);
            Route::post('/edit',[ProductController::class, 'editProduct']);
            Route::post('/delete',[ProductController::class, 'deleteProduct']);
        });

        Route::prefix('tank')->group(function(){
            Route::get('/getAll',[TankController::class,'getAllTanks']);
            Route::post('/add',[TankController::class,'addTank']);
            Route::post('/edit',[TankController::class,'editTank']);
            Route::post('/delete',[TankController::class,'delete']);
        });

        Route::prefix('pump')->group(function(){
            Route::get('/getAll',[PumpController::class,'getAll']);
            Route::post('/add',[PumpController::class,'add']);
            Route::post('/delete',[PumpController::class,'delete']);
            Route::post('/edit',[PumpController::class,'edit']);
        });
        
        Route::prefix('presence')->group(function(){
            Route::get('list', [PresenceController::class, 'list']);
            Route::post('scan', [PresenceController::class, 'scan']);
        });

        Route::prefix('dailyPumpReport')->group(function(){
            Route::get('all', [DailyPumpReportController::class, 'all']);
        });

        Route::prefix('totalizatorReport')->group(function(){
            Route::get('getAllPengeluaranTypes', [TotalizatorReportController::class, 'getAllPengeluaranTypes']);
            Route::post('getFormReportData', [TotalizatorReportController::class, 'getFormReportData']);
            Route::post('getLaporan', [TotalizatorReportController::class, 'getLaporan']);
            Route::post('uploadBuktiPengeluaran', [TotalizatorReportController::class, 'uploadBuktiPengeluaran']);
            Route::post('uploadBuktiTabungan', [TotalizatorReportController::class, 'uploadBuktiTabungan']);
            Route::post('submit', [TotalizatorReportController::class, 'submit']);
        });

        Route::prefix('penerimaan')->group(function(){
            Route::get('all', [PenerimaanController::class, 'all']);
            Route::post('create', [PenerimaanController::class, 'create']);
            Route::post('edit', [PenerimaanController::class, 'edit']);
            Route::post('delete', [PenerimaanController::class, 'delete']);
            Route::post('confirm', [PenerimaanController::class, 'confirm']);
        });
    });

    //operator APIs
    Route::group(['middleware' => 'role:operator'], function(){
        Route::get('/getPresenceToken', [PresenceController::class, 'getPresenceToken']);
        Route::get('/getAvailablePumps', [PumpController::class, 'getAvailablePumps']);
        Route::post('/uploadBuktiTotalizer', [DailyPumpReportController::class, 'uploadBuktiTotalizer']);
        Route::post('/sendPumpReport', [DailyPumpReportController::class, 'submitPumpReport']);
    });
});