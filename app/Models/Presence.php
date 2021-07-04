<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public $timestamps = false; //this model doesn't use timestamps columns

    public function user(){
        return $this->belongsTo(User::class);
    }
}
