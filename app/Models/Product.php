<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\AsCollection;

/**
 * Table name: products
 * Columns:
 * - id: unsigned bigint, pk, ai
 * - name: string,
 * - price: int,
 * - created_at: timestamp, nullable
 * - updated_at: timestamp, nullable
 * - deleted_at: timestamp, nullable
 * - history: [
 *  {
 *    timestamp: timestamp,
 *    name: string,
 *    price: number,
 *  }
 * ]
 */

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'history' => AsCollection::class,
    ];

    public function tanks(){
        return $this->hasMany(Tank::class);
    }

    public function getNameOnDate($date){
        $last = $this->history->last(function($value) use ($date){
            return $date >= $value['timestamp'];
        });
        return $last['name'];
    }

    public function getPriceOnDate($date){
        $last = $this->history->last(function($value) use ($date){
            return $date >= $value['timestamp'];
        });
        return $last['price'];
    }
}
