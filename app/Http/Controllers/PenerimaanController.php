<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Penerimaan;
use Carbon\Carbon;

class PenerimaanController extends Controller
{
    //

    public function all(Request $request){
        return Penerimaan::all()
        ->map(function($penerimaan){
            return [
                'id' => $penerimaan->id,
                'issueTimestamp' => $penerimaan->issue_timestamp,
                'issuer' => $penerimaan->issuer()->first()->name,
                'tankName' => $penerimaan->tank()->first()->name,
                'tankId' => $penerimaan->tank_id,
                'pnbpVolume' => $penerimaan->pnbp_volume,
                'receiveTimestamp' => $penerimaan->receive_timestamp,
                'receiver' => $penerimaan->receiver()->first()->name ?? '',
                'truckId' => $penerimaan->truck_id,
                'pnbp' => $penerimaan->pnbp,
                'initialVolume' => $penerimaan->initial_volume,
                'actualVolume' => $penerimaan->actual_volume,
            ];
        });
    }

    public function create(Request $request){
        
        $rules = [
            'tankId' => ['required', 'exists:tanks,id'],
            'volume' => ['required', 'integer', 'min:0'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => 'tank ini tidak ada di database',
            'integer' => 'harus berupa angka',
            'min' => 'minimal :min',
        ];

        $request->validate($rules, $messages);

        $user = Auth::user();

        $penerimaan = Penerimaan::create([
            'issuer_id' => $user->id,
            'tank_id' => $request->tankId,
            'pnbp_volume' => $request->volume,
        ]);

        return $penerimaan;
    }

    public function edit(Request $request){
        $rules = [
            'id' => ['required', 'exists:penerimaans,id'],
            'tankId' => ['required', 'exists:tanks,id'],
            'volume' => ['required', 'integer', 'min:0'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => 'tank ini tidak ada di database',
            'integer' => 'harus berupa angka',
            'min' => 'minimal :min',
        ];

        $request->validate($rules, $messages);

        $user = Auth::user();
        $penerimaan = Penerimaan::findOrFail($request->id);

        $penerimaan->issuer_id = $user->id;
        $penerimaan->tank_id = $request->tankId;
        $penerimaan->pnbp_volume = $request->volume;
        $penerimaan->issue_timestamp = Carbon::now();
        $penerimaan->save();
        return $penerimaan;
    }

    public function delete(Request $request){
        $rules = [
            'id' => ['required', 'exists:penerimaans,id'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => 'Data ini tidak tersedia di database',
        ];

        $request->validate($rules, $messages);

        $penerimaan = Penerimaan::findOrFail($request->id);
        $penerimaan->delete();
        return $penerimaan;
    }

    public function confirm(Request $request){
        
        $rules = [
            'id' => ['required', 'exists:penerimaans,id'],
            'truckId' => ['required'],
            'pnbp' => ['required'],
            'initialVolume' => ['required', 'integer', 'min:0'],
            'actualVolume' => ['required', 'integer', 'min:0'],
        ];

        $messages = [
            'required' => 'Harus diisi',
            'exists' => 'Laporan ID tidak ada',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
        ];

        $request->validate($rules, $messages);

        $penerimaan = Penerimaan::findOrFail($request->id);
        $user = Auth::user();

        $penerimaan->truck_id = $request->truckId;
        $penerimaan->pnbp = $request->pnbp;
        $penerimaan->initial_volume = $request->initialVolume;
        $penerimaan->actual_volume = $request->actualVolume;
        $penerimaan->receive_timestamp = Carbon::now();
        $penerimaan->receiver_id = $user->id;
        $penerimaan->save();
        return $penerimaan;
    }
}
