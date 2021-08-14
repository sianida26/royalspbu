<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\AsCollection;

use Carbon\Carbon;

/**
 * Table name: tanks
 * Columns:
 * - id: unsigned bigint, pk, ai
 * - product_id: unisgned bigint, foreign on products
 * - name: string,
 * - stock: int,
 * - created_at: timestamp, nullable
 * - updated_at: timestamp, nullable
 * - deleted_at: timestamp, nullable
 * - history: [
 *  {
 *    timestamp: timestamp,
 *    name: string,
 *    productId: number,
 *  }
 * ]
 */

class Tank extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'history' => AsCollection::class,
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function nozzles(){
        return $this->hasMany(Nozzle::class);
    }

    public function getNameOnDate($date){
        $last = $this->history->last(function($value) use ($date){
            return $date->gte(Carbon::create($value['timestamp']));
        });
        return $last['name'];
    }

    public function getProductOnDate($date){
        $last = $this->history->last(function($value) use ($date){
            return $date->gte(Carbon::create($value['timestamp']));
        });
        $productId = $last['productId'];
        $product = Product::withTrashed()->findOrFail($productId);
        $product->name = $product->getNameOnDate($date);
        $product->price = $product->getPriceOnDate($date);
        return $product;
    }

    public function getVolumeOutOnDate($date){
        return $this->nozzles()
            ->get()
            ->reduce(function($carry, $nozzle) use ($date){
                return $carry + $nozzle->pumpReports()
                    ->whereDate('created_at',$date)
                    ->get()
                    ->reduce(function($carry, $report){
                        return $carry + $report->getTotalizatorDiff();
                    },0);
            }, 0);
    }

    public static function getTanksOnDate($date){
        return self::withTrashed()->whereDate('created_at','<=',$date)
            ->where(function($query) use ($date){
                $query->whereDate('deleted_at','>',$date)
                    ->orWhere('deleted_at',null);
            })
            ->get()
            ->map(function($tank) use ($date){
                $last = $tank->history->last(function($value) use ($date){
                    return $date->gte(Carbon::create($value['timestamp']));
                });
                if ($last !== null){
                    $tank->name = $last['name'];
                    $tank->productId = $last['productId'];
                }
                return $tank;
            });
    }

    public static function findOrFailOnDate($id,$date){
        $model = self::getTanksOnDate($date)->where('id',$id)->first();
        if ($model !== null) return $model;
        throw new \Illuminate\Database\Eloquent\ModelNotFoundException;
    }
}
