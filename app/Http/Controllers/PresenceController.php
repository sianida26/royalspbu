<?php

namespace App\Http\Controllers;

use Debugbar;

use App\Models\Presence;
use App\Models\PresenceToken;
use App\Models\User;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;


class PresenceController extends Controller
{
    //
    public function getPresenceToken(Request $request){
        
        $user = Auth::user();
        $token = $user->getPresenceToken();
        return [
            'token' => $token->token,
        ];
    }

    public function scan(Request $request){

        $tokenString = $request->token;
        $token = PresenceToken::firstWhere('token',$tokenString);
        abort_if($token == null, 404, 'Kode tidak ditemukan');
        $user = $token->user;

        $presence = Presence::whereDate('timestamp',Carbon::today())
            ->where('user_id', $user->id)
            ->first();

        //prevent doubling
        if ($presence == null ){
            $presence = Presence::create([
                'user_id' => $user->id,
                'timestamp' => Carbon::now(),
            ]);
        }

        return [
            'name' => $user->name,
            // 'timestamp' => $presence->timestamp->format('d M Y; H:i:s'),
            'timestamp' => $presence->timestamp->format('H:i'),
        ];
    }

    public function list(Request $request){

        $rules = [
            'date' => ['required','date_format:d-m-Y'],
        ];

        $messages = [
            'required' => 'Data harus tersedia',
            'date_format' => 'Format :attribute tidak sesuai',
        ];

        $request->validate($rules, $messages);

        $date = Carbon::createFromFormat('d-m-Y',$request->date)->startOfDay();

        $operators = User::getUsersOnDate($date)
            ->filter(function($user){
                return $user->hasRole('operator');
            })
            ->values();

        return $operators->map(function($user) use ($date){
            return [
                'name' => $user->name,
                'id' => $user->id,
                'status' => $user->isPresenceOnDate($date),
                'time' => $user->getPresenceOnDate($date) ? $user->getPresenceOnDate($date)->timestamp : '-',
            ];
        });
    }
}
