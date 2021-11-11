<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Debugbar;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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

use PDF;

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

    private function generateToken(){
        $chars = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u' ,'v', 'w', 'x', 'y', 'z'];
        $token = implode(Arr::random($chars,12));
        while (TotalizatorReport::firstWhere('report_token',$token) != null) $token = implode(Arr::random($chars,12)); //preventing duplicates
        return $token;
    }

    public function submit(Request $request){

        $rules = [
            'date' => ['required', 'date_format:j-n-Y'],
            'pengeluaran.*.id' => ['required', new UuidOrNumber],
            'pengeluaran.*.name' => ['required'],
            'pengeluaran.*.amount' => ['required', 'integer', 'min:0'],
            'pengeluaran.*.reportFilename' => ['present'],
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

        $date = Carbon::createFromFormat('j-n-Y',$request->date);
        $isEdit = false;

        $report = TotalizatorReport::whereDate('created_at', $date); //check if already reported today
        if ($report->exists()){
            $report = $report->first();
            $isEdit = true;
        } else {
            $report = new TotalizatorReport;
            $report->created_at = $date;
        }

        $report->reporter()->associate(Auth::user());

        // deleting deleted pengeluaran
        if ($isEdit) {
            Pengeluaran::whereDate('created_at',$date)
                ->get()
                ->map(function($pengeluaran) use ($request){
                    if (!collect($request->pengeluaran)->pluck('id')->contains($pengeluaran->id)) {
                        //if deleted
                        
                        //delete receipt
                        Storage::delete('public/images/receipts/pengeluaran/'.$pengeluaran->report_filename);

                        //delete model
                        $pengeluaran->delete();
                    }
                });
        }

        //processing pengeluaran
        $pengeluaranModels = collect($request->pengeluaran)
            ->map(function($pengeluaran) use ($date){

                $pengeluaranModel = new Pengeluaran;
                $pengeluaranModel->created_at = $date;
                $isEdit = false;

                //if old item
                if (!Str::isUuid($pengeluaran['id'])){
                    $pengeluaranModel = Pengeluaran::findOrFail($pengeluaran['id']);
                    $isEdit = true;
                }

                //handling receipt
                if ($isEdit && $pengeluaran['reportFilename'] !== $pengeluaranModel->report_filename){
                    //if old item changes

                    //delete old receipt
                    Storage::delete('public/images/receipts/pengeluaran/'.$pengeluaranModel->report_filename);

                    //move receipt
                    Storage::move('public/temp/'.$pengeluaran['reportFilename'], 'public/images/receipts/pengeluaran/'.$pengeluaran['reportFilename']);
                } else if ($pengeluaran['reportFilename'] !== null && Storage::disk('local')->exists('public/temp/'.$pengeluaran['reportFilename'])){
                    //if new item, move receipt from temp folder
                    Storage::move('public/temp/'.$pengeluaran['reportFilename'], 'public/images/receipts/pengeluaran/'.$pengeluaran['reportFilename']);
                }
                
                //create new PengeluaranType if new
                $pengeluaranType = PengeluaranTypes::firstOrCreate(
                    ['name' => $pengeluaran['name']],
                    ['name' => $pengeluaran['name']]
                );

                $pengeluaranModel->type()->associate($pengeluaranType);
                $pengeluaranModel->amount = $pengeluaran['amount'];
                $pengeluaranModel->report_filename = $pengeluaran['reportFilename'];
                
                return $pengeluaranModel;
            });

            
        // processing tabungan
        $tabungan = Tabungan::whereDate('created_at', $date); //check if already reported today
        if ($tabungan->exists()){
            $tabungan = $tabungan->first();
        } else {
            $tabungan = new Tabungan;
            $tabungan->created_at = $date;
        }

        if ($isEdit){
            if ($tabungan->report_filename !== null && $request->tabungan['fileName'] !== $tabungan->report_filename) {

                //delete old receipt
                Storage::delete('public/images/receipts/tabungan/'.$tabungan->report_filename);

                $tabungan->report_filename == null;
            }
        }

        if ($request->tabungan['fileName'] !== null){
            //write to database if filename is not null
            $filename = $request->tabungan['fileName'];

            $tabungan->amount = $request->tabungan['amount'];
            $tabungan->report_filename = $filename;

            if ($filename && Storage::disk('local')->exists('public/temp/'.$filename)){
                Storage::move('public/temp/'.$filename, 'public/images/receipts/tabungan/'.$filename);
            }
        }

        $report->report_token = $this->generateToken();

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

    public function getReportPDF(Request $request){
        $date = Carbon::createFromFormat('m-Y',$request->date);
        
        return '/pdf/totalizatorReport?t='.$report->report_token;
    }

    public function downloadPDF(Request $request){
        $t = $request->t;
        $report = TotalizatorReport::where('report_token',$t)->firstOrFail();
        $pdf = PDF::loadView('PDF.totalizator', ['report' => $report->getDetailedReport(), 'model' => $report]);
        return $pdf->inline('Laporan Totalisator'.$report->created_at->isoFormat('D MMMM Y').'.pdf');
    }
}
