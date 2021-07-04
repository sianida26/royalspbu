<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class PresenceToken extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $timestamps = false;

    public function generateToken(){
        $chars = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        $token = implode(Arr::random($chars,6));
        while ($this->firstWhere('token',$token) != null) $token = implode(Arr::random($chars,6)); //preventing duplicates
        $this->token = $token;
        $this->save();
        return $token;
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
