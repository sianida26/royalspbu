<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Table name: nozzles
 * Columns:
 * - id : unisgned bigint, pk, ai
 * - tank_id : unsigned bigint, foreign key on tanks,
 * - pump_id : unsigned bigint, foreign key on pumps,
 * - totalizator : unsigned int
 * - history : text
 * - created_at : timestamp, nullable
 * - updated_at : timestamp, nullable
 * - deleted_at : timestamp, nullable
 */

class Nozzle extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'history' => AsCollection::class,
    ];

    /**
     * Get the tank that owns the Nozzle
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tank(): BelongsTo
    {
        return $this->belongsTo(Tank::class);
    }

    /**
     * Get the pump that owns the Nozzle
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pump(): BelongsTo
    {
        return $this->belongsTo(Pump::class);
    }

    /**
     * Get all of the pumpReports for the Nozzle
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pumpReports(): HasMany
    {
        return $this->hasMany(PumpReportNozzle::class);
    }

    public function price(){
        return $this->tank->product->price;
    }

    public function productName(){
        return $this->tank->product->name;
    }

    public function getTotalizatorOnBeginningOfMonth($date){

        $totalizator = 0;
        //get reports on first date of the month
        $model = PumpReportNozzle::whereDate('created_at',$date->startOfMonth())
            ->where('nozzle_id', $this->id)
            ->first();
        
        //check if first report is not on first month
        if ($model === null) {
            $model = PumpReportNozzle::whereMonth('created_at', $date)
                ->where('nozzle_id', $this->id)
                ->get()
                ->sortBy('created_at')
                ->first();
            
            if ($model !== null) {
                $totalizator= $model->totalizator_initial;
            }
            //if report is still null, then there take the last report
            else {
                $model = PumpReportNozzle::where('nozzle', $this->id)
                    ->get()
                    ->sortBy('created_at')
                    ->last();

                if ($model !== null) {
                    $totalizator = $model->totalizator_initial;
                }
            }
        } else {
            $totalizator = $model->totalizator_initial;
        }

        return $totalizator;
    }

    public function getTotalizatorOnEndOfMonth($date){

        $totalizator = 0;
        //get reports on first date of the month
        $model = PumpReportNozzle::whereDate('created_at',$date->endOfMonth())
            ->where('nozzle_id', $this->id)
            ->first();
        
        //check if first report is not on first month
        if ($model === null) {
            $model = PumpReportNozzle::whereMonth('created_at', $date)
                ->where('nozzle_id', $this->id)
                ->get()
                ->sortByDesc('created_at')
                ->first();
            
            if ($model !== null) {
                $totalizator= $model->totalizator_final;
            }
            //if report is still null, then there take the last report
            else {
                $model = PumpReportNozzle::where('nozzle', $this->id)
                    ->get()
                    ->sortBy('created_at')
                    ->last();

                if ($model !== null) {
                    $totalizator = $model->totalizator_final;
                }
            }
        } else {
            $totalizator = $model->totalizator_final;
        }

        return $totalizator;
    }
}
