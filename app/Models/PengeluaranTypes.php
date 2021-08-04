<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * table name: pengeluaran_types
 * 
 * columns:
 * - id: unsigned big integer, pk, ai
 * - name: string
 * - created_at: timestamp
 * - modified_at: timestamp,
 * - deleted_at: timestamp,
 */

class PengeluaranTypes extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    /**
     * Get all of the pengeluarans for the PengeluaranTypes
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pengeluarans(): HasMany
    {
        return $this->hasMany(Pengeluaran::class, 'type_id');
    }
}
