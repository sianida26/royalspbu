<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * 
 * table name: totalizator_reports
 * columns:
 * - id : unsigned big integer, pk, ai
 * - reporter_id : foreignId on users
 * - created_at : timestamp
 * - modified_at : timestamp* 
 */

class TotalizatorReport extends Model
{
    use HasFactory;

    /**
     * Get the reporter that owns the TotalizatorReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function getGrossIncome(){
        return DailyPumpReport::getPenjualanByTanksOnDate($this->created_at)->reduce(function($carry, $item){
            return $carry + ($item['volume']*$item['price']);
        }, 0);
    }

    public function getTotalExpenses(){
        return Pengeluaran::getPengeluaransOnDate($this->created_at)->reduce(function($carry, $item){
            return $carry + $item['amount'];
        }, 0);
    }

    public function getNetIncome(){
        return $this->getGrossIncome() - $this->getTotalExpenses();
    }

    public function getDetailedReport(){

        $date = $this->created_at;

        return [
            'penerimaan' => Penerimaan::getVolumePerTanksOnDate($date),
            'penjualan' => DailyPumpReport::getPenjualanByTanksOnDate($date),
            'pengeluaran' => Pengeluaran::getPengeluaransOnDate($date),
            'tabungan' => Tabungan::whereDate('created_at',$date)->first(),
            'reporter' => $this->reporter->name,
        ];
    }

    public static function getDetailedReportOnDate($date){
        $report = self::whereDate('created_at',$date)->first();

        //if not null
        if ($report !== null) return $report->getDetailedReport();

        return 0; //if report is not found
    }
}
