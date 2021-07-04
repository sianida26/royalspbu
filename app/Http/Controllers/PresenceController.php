<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PresenceToken;
use App\Models\Presence;
use Illuminate\Support\Arr;
use Carbon\Carbon;
use Debugbar;

class PresenceController extends Controller
{
    //
    public function getPresenceToken(Request $request){
        
        $user = Auth::user();
        $token = $user->presenceToken;
        if ($token == null) {
            $token = new PresenceToken;
            $chars = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            $tokenChars = implode(Arr::random($chars,6));
            while (PresenceToken::firstWhere('token',$tokenChars) != null) $tokenChars = implode(Arr::random($chars,6)); //preventing duplicates
            $token->token = $tokenChars;
            $token->user_id = $user->id;
            $token->save();
        }
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
            'timestamp' => $presence->timestamp->format('d M Y; H:i:s'),
        ];
    }
}
