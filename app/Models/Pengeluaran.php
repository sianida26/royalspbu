<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * table name: pengeluarans
 * 
 * columns:
 * - id: unsignedBigInteger, pk, ai
 * - type_id: foreign on pengeluaran_types
 * - amount: unsignedBigInteger, default: 0
 * - report_filename: string, nullable
 * - created_at : timestamp
 */

class Pengeluaran extends Model
{
    use HasFactory;

    public $timestamps = false;

    /**
     * Get the type that owns the Pengeluaran
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(PengeluaranTypes::class, 'type_id');
    }

    public static function getPengeluaransOnDate($date){
        return self::whereDate('created_at',$date)
            ->get()
            ->map(function($pengeluaran){
                return [
                    'id' => $pengeluaran->id,
                    'reportFilename' => $pengeluaran->report_filename,
                    'name' => $pengeluaran->type->name,
                    'amount' => $pengeluaran->amount,
                ];
            });
    }

    public static function getPengeluaransOnMonth($date){
        return self::whereMonth('created_at',$date)
            ->get();
    }
}
