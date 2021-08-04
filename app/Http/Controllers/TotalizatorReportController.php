<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Debugbar;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Models\Pengeluaran;
use App\Models\PengeluaranTypes;
use App\Models\Penerimaan;
use App\Models\Tank;
use App\Models\Tabungan;
use App\Models\DailyPumpReport;
use App\Models\TotalizatorReport;
use App\Rules\UuidOrNumber;

class TotalizatorReportController extends Controller
{
    //

    public function getAllPengeluaranTypes(Request $request){
        return PengeluaranTypes::select('id','name')->get();
    }

    public function getLaporan(Request $request){
        $rules = [
            'date' => ['required', 'date_format:j-n-Y'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'date_format' => 'Format harus berupa dd-MM-YYYY',
        ];

        $request->validate($rules, $messages);

        $date = Carbon::createFromFormat('j-n-Y',$request->date);

        return TotalizatorReport::getDetailedReportOnDate($date);
    }

    public function getFormReportData(Request $request){

        $date = Carbon::createFromFormat('j-n-Y',$request->date);
        // $date = Carbon::createFromDate(2021,8,2);

        $penerimaan = Penerimaan::getVolumePerTanksOnDate($date);

        $penjualan = DailyPumpReport::getPenjualanByTanksOnDate($date);
            
        return [
            'penerimaan' => $penerimaan,
            'penjualan' => $penjualan,
            'totalIncome' => collect($penjualan)->sum('income'),
        ];
    }

    public function uploadBuktiPengeluaran(Request $request){

        $messages = [
            'required' => 'Harus diisi',
            'file' => 'Harus berupa file',
            'max' => 'Ukuran maksimal :max kB',
            'mimes' => 'Harus berupa *.jpg, *.png atau *.jpeg',
        ];

        $rules = [
            'image' => ['required', 'file', 'max:1024', 'mimes:jpg,png,jpeg'],
        ];

        $request->validate($rules, $messages);

        $path = $request->file('image')->store('public/temp');
        return Str::afterLast($path, '/');
    }

    public function uploadBuktiTabungan(Request $request){

        $messages = [
            'required' => 'Harus diisi',
            'file' => 'Harus berupa file',
            'max' => 'Ukuran maksimal :max kB',
            'mimes' => 'Harus berupa *.jpg, *.png atau *.jpeg',
        ];

        $rules = [
            'image' => ['required', 'file', 'max:1024', 'mimes:jpg,png,jpeg'],
        ];

        $request->validate($rules, $messages);

        $path = $request->file('image')->store('public/temp');
        return Str::afterLast($path, '/');
    }

    public function submit(Request $request){

        $rules = [
            'date' => ['required', 'date_format:j-n-Y'],
            'pengeluaran.*.id' => ['required', new UuidOrNumber],
            'pengeluaran.*.pengeluaran' => ['required'],
            'pengeluaran.*.amount' => ['required', 'integer', 'min:0'],
            'pengeluaran.*.fileName' => ['present'],
            'tabungan.amount' => ['required', 'integer', 'min:0'],
            'tabungan.fileName' => ['present'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'date_format' => 'Format harus berupa dd-MM-YYYY',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
            'present' => 'Harus ada',
        ];

        $request->validate($rules, $messages);

        $report = new TotalizatorReport;
        $report->reporter()->associate(Auth::user());

        //processing pengeluaran
        $pengeluaranModels = collect($request->pengeluaran)
            ->map(function($pengeluaran){

                $pengeluaranModel = new Pengeluaran;

                //if old item
                if (!Str::isUuid($pengeluaran['id'])){
                    $pengeluaranModel = Pengeluaran::findOrFail($pengeluaran['id']);
                }
                
                //create new PengeluaranType if new
                $pengeluaranType = PengeluaranTypes::firstOrCreate(
                    ['name' => $pengeluaran['pengeluaran']],
                    ['name' => $pengeluaran['pengeluaran']]
                );

                $pengeluaranModel->type()->associate($pengeluaranType);
                $pengeluaranModel->amount = $pengeluaran['amount'];
                $pengeluaranModel->report_filename = $pengeluaran['fileName'];

                //move receipt
                if ($pengeluaran['fileName'] !== null && Storage::disk('local')->exists('public/temp/'.$pengeluaran['fileName'])){
                    Storage::move('public/temp/'.$pengeluaran['fileName'], 'public/images/receipts/pengeluaran/'.$pengeluaran['fileName']);
                }
                
                return $pengeluaranModel;
            });

            
        // processing tabungan
        $tabungan = new Tabungan;
        if ($request->tabungan['fileName'] !== null){
            //write to database if filename is not null
            $filename = $request->tabungan['fileName'];

            $tabungan->amount = $request->tabungan['amount'];
            $tabungan->report_filename = $filename;


            //move receipt
            if ($filename && Storage::disk('local')->exists('public/temp/'.$filename)){
                Storage::move('public/temp/'.$filename, 'public/images/receipts/tabungan/'.$filename);
            }
        }

        //apply all model changes
        try{
            $report->save();
            $pengeluaranModels->each(function($pengeluaran){
                $pengeluaran->save();
            });
            if ($tabungan->report_filename !== null) $tabungan->save();
        } catch (Exception $e){
            //if error, delete all applied changes
            $report->delete();
            $pengeluaranModels->each(function($pengeluaran){
                $pengeluaran->delete();
            });
            $tabungan->delete();
        }

        return 'ok';
    }
}
