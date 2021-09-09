<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppConfig extends Model
{
    use HasFactory;

    public static function getValue(string $key){
        return self::where('key',$key)->firstOrFail()->value;
    }
}
