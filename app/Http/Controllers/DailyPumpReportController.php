<?php

namespace App\Http\Controllers;

use Debugbar;
use App\Rules\FileExists;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\DailyPumpReport;
use App\Models\Nozzle;
use App\Models\PumpReportNozzle;
use Carbon\Carbon;

class DailyPumpReportController extends Controller
{
    //

    public function uploadBuktiTotalizer(Request $request){
        
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

        $path = $request->file('image')->store('temp');
        return Str::afterLast($path, '/');
    }

    public function submitPumpReport(Request $request){

        $rules = [
            'pumpId' => ['required', 'exists:pumps,id'],
            'nozzles' => ['required'],
            'nozzles.*.id' => ['required', 'exists:nozzles,id'],
            'nozzles.*.finalTotalizator' => ['required','integer'],
            'nozzles.*.filename' => ['required', new FileExists('temp/')],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => ':attribute tidak ada',
            'number' => 'Harus berupa angka',
        ];

        $request->validate($rules, $messages);

        abort_if(
            DailyPumpReport::whereDate('created_at',Carbon::today())->where('pump_id',$request->pumpId)->exists(),
            422,
            'Anda sudah membuat laporan'
        );

        $userId = Auth::id();

        $totalIncome = 0;
        $nozzles = collect($request->nozzles)->map(function($nozzle) use (&$totalIncome){

            $nozzleModel = Nozzle::findOrFail($nozzle['id']);
            $initialTotalizator = $nozzleModel->totalizator;
            $nozzleModel->totalizator = $nozzle['finalTotalizator'];
            $nozzleModel->save();

            $price = $nozzleModel->price();
            $totalizatorDiff = $nozzleModel->totalizator - $initialTotalizator;
            Debugbar::info('final: '.$nozzleModel->totalizator.', initial:'.$initialTotalizator);
            // Debugbar::info($price);
            $totalIncome += $totalizatorDiff*$price;

            Storage::move('temp/'.$nozzle['filename'],'public/images/reports/'.$nozzle['filename']);

            return new PumpReportNozzle([
                'nozzle_id' => $nozzle['id'],
                'totalizator_initial' => $initialTotalizator,
                'totalizator_final' => $nozzleModel->totalizator,
                'report_filename' => $nozzle['filename'],
            ]);
        });

        Debugbar::info($totalIncome);
        $report = DailyPumpReport::create([
            'pump_id' => $request->pumpId,
            'reporter_id' => $userId,
            'income' => $totalIncome,
        ]);

        $report->nozzles()->saveMany($nozzles);

        return $report;
    }
}
