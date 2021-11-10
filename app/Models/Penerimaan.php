<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Carbon\Carbon;

/**
 * table name : penerimaans
 * columns:
 * - id : primary key, auto increment, unsigned big integer
 * - issuer_id : foreign on users
 * - issue_timestamp : timestamp. default current timestamp
 * - tank_id : foreign on tanks
 * - truck_id : string, nullable 
 * - pnbp : string, nullable
 * - initial_volume : unsigned integer, nullable
 * - pnbp_volume : unsigned integer, nullable
 * - actual_volume : unsigned integer, nullable (VOLUME AKTUAL ADALAH VOLUME TANK SETELAH PENERIMAAN)
 * - receive_timestamp : timestamp, nullable
 * - receiver_id : foreign on users, nullable
 */

class Penerimaan extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $timestamps = false;

    /**
     * Get the issuer associated with the Penerimaan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function issuer(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'issuer_id');
    }

    /**
     * Get the receiver associated with the Penerimaan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function receiver(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'receiver_id');
    }

    /**
     * Get the tank associated with the Penerimaan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function tank(): HasOne
    {
        return $this->hasOne(Tank::class, 'id', 'tank_id');
    }

    public function getVolumeDiff(){
        return $this->getActualPenerimaanVolume() - $this->pnbp_volume;
    }

    public function getActualPenerimaanVolume(){
        return $this->actual_volume - $this->initial_volume;
    }

    /**
     * Get the array of models where penerimaan diterima on given date
     */
    public static function getPenerimaansOnDate($date)
    {
        // if ($date = null) $date = Carbon::now();
        return self::whereDate('receive_timestamp',$date);
    }

    public static function getVolumePerTanksOnDate($date)
    {
        // if ($date = null) $date = Carbon::now();
        $tankNames = Tank::getTanksOnDate($date);
        
        $penerimaans = self::getPenerimaansOnDate($date)->get();
        
        return collect($tankNames->map(function($tank) use ($penerimaans){
            $penerimaan = $penerimaans
                ->where('tank_id',$tank->id)
                ->first();
            $volume = 0;
            if ($penerimaan !== null) {
                $volume = $penerimaan->pnbp_volume;
            }
            return collect([
                'tankName' => $tank->name,
                'volume' => $volume,
            ]);
        }));
    }
}
