<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TotalizatorReportController;
use App\Http\Controllers\PersediaanReportController;
use App\Http\Controllers\LaporanBulananController;

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
    ->where('path','^(?!(api|tests|pdf|assets)).*$');

Route::prefix('tests')->group(function(){

    Route::get('testPDF', [TestController::class, 'pdf']);
});

Route::prefix('pdf')->group(function(){
    Route::get('totalizatorReport', [TotalizatorReportController::class, 'downloadPDF']);
    Route::get('persediaanReport', [PersediaanReportController::class, 'downloadPDF']);
    Route::get('stockReport', [LaporanBulananController::class, 'downloadStockReport']);
    Route::get('lrReport', [LaporanBulananController::class, 'downloadLRReport']);
});