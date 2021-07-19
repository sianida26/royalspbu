<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Table name: daily_pump_report
 * Columns:
 * - id: unsigned bigint, pk, ai
 * - pump_id: unisgned bigint, foreign on pumps
 * - reporter_id: unsigned bigint, foreign on users
 * - income: unsigned bigint,
 * - editable: boolean, default: false
 * - created_at: timestamp
 */

class DailyPumpReport extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $guarded = [];


    /**
     * Get the pump that owns the DailyPumpReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pump(): BelongsTo
    {
        return $this->belongsTo(Pump::class);
    }

    /**
     * Get the reporter that owns the DailyPumpReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get all of the nozzles for the DailyPumpReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function nozzles(): HasMany
    {
        return $this->hasMany(PumpReportNozzle::class, 'report_id');
    }

    public function reporterName() {
        return $this->reporter()->first()->name;
    }
}
