<?php

namespace App\Http\Controllers;

use App\Models\PersediaanReport;
use App\Models\Tank;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use PDF;

class PersediaanReportController extends Controller
{
    //

    public function getReportData(Request $request){

        $rules = [
            'date' => ['required', 'date_format:j-n-Y'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'date_format' => 'Format harus berupa dd-MM-YYYY',
        ];

        $request->validate($rules, $messages);

        $date = Carbon::createFromFormat('j-n-Y',$request->date);

        return PersediaanReport::getReportDataOnDate($date);
    }

    public function submit(Request $request){

        $rules = [
            'tankId' => ['required', 'exists:tanks,id'],
            'actualStock' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date_format:j-n-Y'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => 'Tangki tidak valid',
            'numeric' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
            'date_format' => 'Format harus berupa dd-MM-YYYY',
        ];

        $request->validate($rules, $messages);

        $date = Carbon::createFromFormat('j-n-Y',$request->date);

        $user = Auth::user();
        $tank = Tank::findOrFail($request->tankId);
        $report = PersediaanReport::whereDate('created_at',$date)
            ->where('tank_id', $tank->id)
            ->first();
        
        if ($report === null) {
            $report = new PersediaanReport;
        }
        $report->reporter()->associate($user);
        $report->tank()->associate($tank);
        $report->initial_stock = $tank->stock;
        $report->actual_stock = $request->actualStock;
        $report->save();

        $tank->stock = $request->actualStock;
        $tank->save();

        return $report;
    }

    public function getTanks(Request $request){
        //TODO select tanks available on selected month
        return Tank::all();
    }

    public function downloadPDF(Request $request){
        $tankId = $request->t;
        $tank = Tank::findOrFail($tankId);
        //parse the date from request
        $date = Carbon::createFromFormat('m-Y',$request->m);
        $pdf = PDF::loadView('PDF.persediaan.persediaan', ['tank' => $tank, 'date' => $date])
            ->setOrientation('landscape')
            ->setOption('dpi', 300)
            ->setOption('disable-smart-shrinking', true)
            // ->setOption('header-html', $header)
            ->setOption('margin-top', 0);
        return $pdf->inline('Laporan Persediaan Bulanan.pdf');
    }
}
