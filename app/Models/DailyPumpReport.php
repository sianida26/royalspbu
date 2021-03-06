<?php

namespace App\Models;

use App\Models\PumpReportNozzle;
use App\Models\User;

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

    public static function getReportsOnDate($date){
        return self::whereDate('created_at',$date);
    }

    public static function getPenjualanByTanksOnDate($date){
        $penjualanData = self::getReportsOnDate($date)
            ->get()
            ->map(function($report) use ($date){
                return collect($report->nozzles->map(function($nozzle) use ($date){

                    $tank = $nozzle->getTank();
                    $soldVolume = $nozzle->getTotalizatorDiff();

                    return [
                        'tankId' => $tank->id,
                        'tankName' => $tank->getNameOnDate($date),
                        'price' => $tank->getProductOnDate($date)->price,
                        'volume' => $soldVolume,
                    ];
                }));
            })
            ->flatten(1)
            ->groupBy('tankId')
            ->map(function($group){
                $nozzles = collect($group);
                $volume = $nozzles->sum('volume');
                $price = $nozzles->first()['price'];
                return [
                    'tankName' => $nozzles->first()['tankName'],
                    'volume' => $volume,
                    'price' => $price,
                    'income' => $volume*$price,
                ];
            })
            ->sortBy('tankName');
        
        $penjualanDefault = Tank::getTanksOnDate($date)
            ->groupBy('id')
            ->map(function($_tank) use ($date){
                $tank = $_tank[0];
                $product = $tank->getProductOnDate($date);
                return [
                    'tankName' => $tank->name,
                    'volume' => 0,
                    'price' => $product->price,
                    'income' => 0,
                ];
            });
        return $penjualanData
            ->union($penjualanDefault)
            ->values();
    }


    public static function generateRandomReport($pump, $pumpNumber, $date){

        $reporter = User::role('operator')->get()->random();
        
        $totalIncome = 0;
        $nozzles = $pump->nozzles->map(function($nozzleModel) use (&$totalIncome, $date){

            //generate random data
            $initialTotalizator = $nozzleModel->totalizator;
            $volumeOut = rand(0,1)*rand(0,1000); //rand 0,1 for boolean switch, generating volume out 0 L to 1000 L
            $finalTotaliator = $initialTotalizator+$volumeOut;
            $reportFilename = 'seed.png';

            $nozzleModel->totalizator = $finalTotaliator; //update totalizator to database
            $nozzleModel->save();

            $price = $nozzleModel->price();
            $totalIncome += $volumeOut*$price;

            return new PumpReportNozzle([
                'nozzle_id' => $nozzleModel->id,
                'totalizator_initial' => $initialTotalizator,
                'totalizator_final' => $finalTotaliator,
                'report_filename' => $reportFilename,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        });

        $report = self::create([
            'pump_id' => $pump->id,
            'pump_number' => $pumpNumber,
            'reporter_id' => $reporter->id,
            'income' => $totalIncome,
            'created_at' => $date,
        ]);

        $report->nozzles()->saveMany($nozzles);
    }
}
