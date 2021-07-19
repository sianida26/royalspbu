<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/','royalSPBU.app')->name('login');

Route::view('/{path}','royalSPBU.app')
    ->where('path','^(?!(api|tests)).*$');

    Route::prefix('tests')->group(function(){

        Route::get('testPDF', [TestController::class, 'pdf']);
    });