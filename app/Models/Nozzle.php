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
}
