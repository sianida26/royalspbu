<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

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

    public function dailyPumpReports(){
        return $this->hasMany(DailyPumpReport::class);
    }

    public function isAvailableForReporting(){
        return !$this->dailyPumpReports()->whereDate('created_at', Carbon::today())->where('pump_id',$this->id)->exists();
    }

    public static function getPumpsOnDate($date){
        return self::withTrashed()->whereDate('created_at','<=',$date)
            ->where(function($query) use ($date){
                $query->whereDate('deleted_at','>',$date)
                    ->orWhere('deleted_at',null);
            })
            ->get();
    }
}
