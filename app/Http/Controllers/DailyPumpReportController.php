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

    public function all(Request $request){

        $date = Carbon::createFromFormat('j-n-Y',$request->date);

        return DailyPumpReport::whereDate('created_at',$date)->get()->map(function($report){
            Debugbar::info('report id: '.$report->id);
            $nozzles = $report->nozzles()->get()->map(function($nozzle){
                Debugbar::info('report_nozzle id: '.$nozzle->id);
                Debugbar::info('nozzle id: '.$nozzle->nozzle->id);
                return [
                    'productName' => $nozzle->nozzle->productName(),
                    'totalizatorInitial' => $nozzle->totalizator_initial,
                    'totalizatorFinal' => $nozzle->totalizator_final,
                    'reportFilename' => $nozzle->report_filename,
                    'price' => $nozzle->nozzle->price(),
                ];
            });
            return [
                'createdAt' => $report->created_at,
                'editable' => $report->editable,
                'id' => $report->id,
                'income' => $report->income,
                'nozzles' => $nozzles,
                'pumpId' => $report->pump_id,
                'pumpNumber' => $report->pump_number,
                'reporter' => $report->reporterName(),
            ];
        });
    }

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
            'id' => ['required'],
            'pumpId' => ['required', 'exists:pumps,id'],
            'pumpNumber' => ['required', 'integer'],
            'nozzles' => ['required'],
            'nozzles.*.id' => ['required', 'exists:nozzles,id'],
            'nozzles.*.finalTotalizator' => ['required','integer'],
            'nozzles.*.filename' => ['required', new FileExists('temp/')],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => ':attribute tidak ada',
            'integer' => 'Harus berupa angka',
        ];

        $request->validate($rules, $messages);

        abort_if(
            DailyPumpReport::whereDate('created_at',Carbon::today())->where('pump_id',$request->pumpId)->exists(),
            403,
            'Anda sudah membuat laporan'
        );

        $userId = Auth::id();

        $totalIncome = 0;

        //CREATE REPORT
        if ($request->id === -1){
            $nozzles = collect($request->nozzles)->map(function($nozzle) use (&$totalIncome){

                $nozzleModel = Nozzle::findOrFail($nozzle['id']);
                $initialTotalizator = $nozzleModel->totalizator;
                $nozzleModel->totalizator = $nozzle['finalTotalizator'];
                $nozzleModel->save();
    
                $price = $nozzleModel->price();
                $totalizatorDiff = abs($nozzleModel->totalizator - $initialTotalizator);
                $totalIncome += $totalizatorDiff*$price;
    
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
                'pump_number' => $request->pumpNumber+1,
                'reporter_id' => $userId,
                'income' => $totalIncome,
            ]);
    
            $report->nozzles()->saveMany($nozzles);
    
            //move report files
            collect($request->nozzles)->map(function($nozzle){
                Storage::move('temp/'.$nozzle['filename'],'public/images/reports/'.$nozzle['filename']);
            });
    
            return $report;
        }
        else { //EDIT REPORT

            //delete old nozzles and revert totalizator
            $report->nozzles->map(function($nozzle){
                $nozzle->nozzle->totalizator = $nozzle->totalizator_initial;
                $nozzle->nozzle->save();
                $nozzle->delete();
            });

            //create new nozzles
            $nozzles = collect($request->nozzles)->map(function($nozzle) use (&$totalIncome){

                $nozzleModel = Nozzle::findOrFail($nozzle['id']);
                $initialTotalizator = $nozzleModel->totalizator;
                $nozzleModel->totalizator = $nozzle['finalTotalizator'];
                $nozzleModel->save();
    
                $price = $nozzleModel->price();
                $totalizatorDiff = abs($nozzleModel->totalizator - $initialTotalizator);
                $totalIncome += $totalizatorDiff*$price;
    
                return new PumpReportNozzle([
                    'nozzle_id' => $nozzle['id'],
                    'totalizator_initial' => $initialTotalizator,
                    'totalizator_final' => $nozzleModel->totalizator,
                    'report_filename' => $nozzle['filename'],
                ]);
            });

            $report->nozzles()->saveMany($nozzles);

            //move report files
            collect($request->nozzles)->map(function($nozzle){
                Storage::move('temp/'.$nozzle['filename'],'public/images/reports/'.$nozzle['filename']);
            });

            return $report;
        }
    }

    public function izinkanEdit(Request $request){
        $rules = [
            'id' => ['required', 'exists:daily_pump_reports,id'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => ':attribute tidak ada',
        ];

        $request->validate($rules, $messages);

        $report = DailyPumpReport::findOrFail($request->id);
        $report->editable = true;
        $report->save();

        return $report;
    }
}
