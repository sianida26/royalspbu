<?php

namespace App\Models;

use App\Models\PersediaanReport;
use App\Models\PumpReportNozzle;

use Carbon\Carbon;

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
 *    penerimaanPrice: number,
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

    public function recordedSave(){

        if ($this->history === null){

            $this->history = collect([
                [
                    'timestamp' => Carbon::today(),
                    'name' => $this->name,
                    'price' => $this->price,
                ]
            ]);
        } 

        else {
            $this->history = $this->history->push([
                'timestamp' => Carbon::today(),
                'name' => $this->name,
                'price' => $this->price,
            ]);
        }
        $this->save();
    }

    public function tanks(){
        return $this->hasMany(Tank::class);
    }

    public function getNozzles(){
        return $this->tanks->map(function($tank){
            return $tank->nozzles;
        })->flatten(1);
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

    public function getInitialStockOnBeginningOfMonth(Carbon $date){
        
        $tanks = $this->tanks;
        $initialStock = 0;
        //carbon first day of month
        $date = $date->copy()->startOfMonth();

        foreach ($this->tanks as $tank) {
            $tankStock = 0;
            $model = PersediaanReport::whereDate('created_at', $date)
            ->where('tank_id', $tank->id)
            ->first();
        
            //check if first report is not on first day of month
            if ($model === null) {
                $model = PersediaanReport::whereMonth('created_at', $date)
                    ->where('tank_id', $tank->id)
                    ->get()
                    ->sortBy('created_at')
                    ->first();
                
                if ($model !== null) {
                    $tankStock= $model->initial_stock;
                }
                //if report is still null, then take the latest report
                else {
                    $model = PersediaanReport::where('tank_id', $tank->id)
                        ->get()
                        ->sortBy('created_at')
                        ->last();
                    if ($model !== null) {
                        $tankStock = $model->initial_stock;
                    }
                }
            } 
            //if first report is on first day of month
            else {
                $tankStock = $model->initial_stock;
            }

            $initialStock += $tankStock;
        }

        return $initialStock;
    }

    public function getActualStockOnEndOfMonth($date){
        $tanks = $this->tanks;
        $initialStock = 0;
        //carbon last day of month
        $date = $date->copy()->endOfMonth();

        foreach ($this->tanks as $tank) {
            $tankStock = 0;
            $model = PersediaanReport::whereDate('created_at', $date)
            ->where('tank_id', $tank->id)
            ->first();
        
            //check if last report is not on last day of month
            if ($model === null) {
                $model = PersediaanReport::whereMonth('created_at', $date)
                    ->where('tank_id', $tank->id)
                    ->get()
                    ->sortByDesc('created_at')
                    ->first();
                
                if ($model !== null) {
                    $tankStock= $model->actual_stock;
                }
                //if report is still null, then take the latest report
                else {
                    $model = PersediaanReport::where('tank_id', $tank->id)
                        ->get()
                        ->sortBy('created_at')
                        ->last();
                    
                    if ($model !== null) {
                        $tankStock = $model->actual_stock;
                    }
                }
            } else {
                $tankStock = $model->actual_stock;
            }

            $initialStock += $tankStock;
        }

        return $initialStock;
    }

    public function getTotalPenerimaanOfMonth($date){
        $tanks = $this->tanks;
        $totalPenerimaan = 0;
        
        foreach($tanks as $tank){
            $volumePenerimaanOnThisTank = 0;
            $penerimaans = Penerimaan::where('tank_id', $tank->id)
                ->whereMonth('receive_timestamp', $date)
                ->get();
            
            foreach ($penerimaans as $penerimaan) {
                $volumePenerimaanOnThisTank += $penerimaan->getActualPenerimaanVolume();
            }

            $totalPenerimaan += $volumePenerimaanOnThisTank;
        }

        return $totalPenerimaan;
    }

    public function getTotalVolumePenerimaanPNBPOfMonth($date){
        $tanks = $this->tanks;
        $totalPenerimaan = 0;
        
        foreach($tanks as $tank){
            $volumePenerimaanOnThisTank = 0;
            $penerimaans = Penerimaan::where('tank_id', $tank->id)
                ->whereMonth('receive_timestamp', $date)
                ->get();
            
            foreach ($penerimaans as $penerimaan) {
                $volumePenerimaanOnThisTank += $penerimaan->pnbp_volume;
            }

            $totalPenerimaan += $volumePenerimaanOnThisTank;
        }

        return $totalPenerimaan;
    }

    public function getVolumeOutFromNozzlesOnMonth($date){
        $tanks = $this->tanks;
        $totalVolume = 0;

        foreach ($tanks as $tank){
            $volumeOnThisTank = 0;
            foreach ($tank->nozzles as $nozzle){
                $nozzleId = $nozzle->id;
                $reports = PumpReportNozzle::whereMonth('created_at',$date)
                    ->where('nozzle_id', $nozzleId)
                    ->get();
                foreach ($reports as $report){
                    $volumeOnThisTank += $report->getTotalizatorDiff();
                }
            }
            $totalVolume += $volumeOnThisTank;
        }

        return $totalVolume;
    }

    public static function getProductsOnDate($date){
        return self::withTrashed()->whereDate('created_at','<=',$date)
            ->where(function($query) use ($date){
                $query->whereDate('deleted_at','>',$date)
                    ->orWhere('deleted_at',null);
            })
            ->get()
            ->map(function($product) use ($date){
                $last = $product->history->last(function($value) use ($date){
                    return $date->gte(Carbon::create($value['timestamp']));
                });
                if ($last !== null){
                    $product->name = $last['name'];
                    $product->price = $last['price'];
                    $product->penerimaan_price = $last['penerimaanPrice'];
                }
                return $product;
            });
    }
}
