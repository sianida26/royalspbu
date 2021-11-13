<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * table name : pump_report_nozzles
 * columns : 
 * - id : unisgned bigint, pk, ai
 * - report_id : unsigned bigint, foreign on daily_pump_reports,
 * - nozzle_id : unsigned bigint, foreign on nozzles,
 * - totalizator_initial : unsigned int,
 * - totalizator_final : unsigned int,
 * - report_filename : string,
 * - created_at : timestamp, nullable
 * - updated_at : timestamp, nullable
 */

class PumpReportNozzle extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Get the report associated with the PumpReportNozzle
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function report(): HasOne
    {
        return $this->hasOne(DailyPumpReport::class, 'report_id');
    }

    /**
     * Get the nozzle associated with the PumpReportNozzle
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function nozzle(): HasOne
    {
        return $this->hasOne(Nozzle::class, 'id', 'nozzle_id');
    }

    public function getTank(){
        return $this->nozzle->tank;
    }

    public function getTotalizatorDiff(){
        $totalizatorDigit = 5;
        //if meteran lebih dari max digit totalisator
        if ($this->totalizator_final - $this->totalizator_initial < 0){
            $maxDigit = pow(10, $totalizatorDigit);
            return $this->totalizator_final + $maxDigit - $this->totalizator_initial;
        } else {
            return abs($this->totalizator_final - $this->totalizator_initial);
        }
    }
}
