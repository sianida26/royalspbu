<?php

namespace App\Http\Controllers;

use App\Models\Nozzle;
use App\Models\Pump;
use App\Models\Tank;

use Carbon\Carbon;

use Debugbar;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class PumpController extends Controller
{
    //
    public function getAll(Request $request){
        return Pump::all()->map(function($pump){
            return [
                'id' => $pump->id,
                'nozzles' => $pump->nozzles->map(function($nozzle){
                    return [
                        'id' => $nozzle->id,
                        'tankId' => $nozzle->tank->id,
                        'totalizator' => $nozzle->totalizator,
                    ];
                }),
            ];
        });
    }

    public function add(Request $request){

        $messages = [
            'required' => 'harus diisi',
            'exists' => 'Tangki tidak valid',
            'integer' => 'Harus berupa angka',
        ];

        $rules = [
            'nozzles.*.tankId' => ['required','exists:tanks,id'],
            'nozzles.*.totalizator' => ['required','integer'],
        ];
        $request->validate($rules, $messages);

        $nozzles = collect($request->nozzles);
        $pump = new Pump;
        $pump->save();

        $nozzles->each(function($nozzle) use ($pump){
            $nozzleModel = new Nozzle;
            $history = [
                [
                    'timestamp' => Carbon::today(),
                    'tankId' => $nozzle['tankId'],
                ]
            ];
            $tank = Tank::findOrFail($nozzle['tankId']);

            $nozzleModel->totalizator = $nozzle['totalizator'];
            $nozzleModel->history = $history;
            $nozzleModel->tank()->associate($tank);
            $nozzleModel->pump()->associate($pump);
            $nozzleModel->save();
        });
        return 'OK';
    }

    public function edit(Request $request){
        $messages = [
            'required' => 'harus diisi',
            'exists' => 'tidak valid',
            'integer' => 'Harus berupa angka',
        ];

        $rules = [
            'id' => ['required', 'exists:pumps,id'],
            'nozzles.*.tankId' => ['required','exists:tanks,id'],
            'nozzles.*.totalizator' => ['required','integer'],
        ];
        $request->validate($rules, $messages);

        $pump = Pump::findOrFail($request->id);

        $oldNozzleIds = $pump->nozzles->pluck('id');
        $newNozzleIds = collect($request->nozzles)->pluck('id')->filter(function($value){return $value > 0;});
        $deletedNozzleIds = $oldNozzleIds->diff($newNozzleIds);
        
        //destroy deleted nozzles
        Nozzle::destroy($deletedNozzleIds->toArray());
        collect($request->nozzles)->each(function($nozzleForm) use ($pump){

            //if old tank
            if ($nozzleForm['id'] > 0){
                $nozzle = Nozzle::findOrFail($nozzleForm['id']);
                //check if tank changed
                if ($nozzle->tank->id != $nozzleForm['tankId']){
                    $tank = Tank::findOrFail($nozzleForm['tankId']);
                    $nozzle->tank()->associate($tank);
                    $nozzle->history = $nozzle->history->push([
                        'timestamp' => Carbon::today(),
                        'tankId' => $nozzleForm['tankId'],
                    ]);
                }
                $nozzle->totalizator = $nozzleForm['totalizator'];
                $nozzle->save();
                return;
            }
            //if new tank
            $nozzle = new Nozzle;
            $history = [
                [
                    'timestamp' => Carbon::today(),
                    'tankId' => $nozzleForm['tankId'],
                ]
            ];
            $tank = Tank::findOrFail($nozzleForm['tankId']);

            $nozzle->totalizator = $nozzleForm['totalizator'];
            $nozzle->history = $history;
            $nozzle->tank()->associate($tank);
            $nozzle->pump()->associate($pump);
            $nozzle->save();
        });

        return 'ok';
    }

    public function delete(Request $request){
        $deleter = Auth::user();
        $pump = Pump::findOrFail($request->id);
        // if correct password
        if (Hash::check($request->password, $deleter->password)){
            $pump->hapus();
        } else {
            abort(422, 'Password salah');
        }
        return 'ok';
    }

    public function getAvailablePumps(Request $request){

        return Pump::all()->map(function($pump){
            return [
                'id' => $pump->id,
                'available' => $pump->isAvailableForReporting(),
                'nozzles' => $pump->nozzles->map(function($nozzle){
                    return [
                        'id' => $nozzle->id,
                        'initialTotalizator' => $nozzle->totalizator,
                        'price' => $nozzle->tank->product->price,
                        'productName' => $nozzle->tank->product->name,
                    ];
                }),
            ];
        });
    }
}
