<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Debugbar;


/**
 * 
 * Table name : pumps
 * Columns :
 * - id
 * - created_at : timestamp
 * - updated_at : timestamp
 * - deleted_at : timestamp
 * 
 */

class Pump extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function hapus(){
        $this->nozzles()->delete();
        $this->delete();
    }

    public function nozzles(){
        return $this->hasMany(Nozzle::class);
    }
}
