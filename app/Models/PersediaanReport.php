<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Debugbar;


/**
 * table name : persediaan_reports
 * columns:
 * - id: unsigned big int, pk, ai
 * - reporter_id : foreign id on users
 * - tank_id : foreign id on tanks
 * - initial_stock : unsigned big integer, default 0
 * - actual_stock : unsigned big integer, default 0
 * - created_at : timestamp,
 * - modified_at : timestamp,
 */

class PersediaanReport extends Model
{
    use HasFactory;

    /**
     * Get the reporter that owns the PersediaanReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get the tank that owns the PersediaanReport
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tank(): BelongsTo
    {
        return $this->belongsTo(Tank::class);
    }

    public static function getReportDataOnTank($tankId, $date){
        $report = self::whereDate('created_at',$date)->where('tank_id',$tankId)->first();
        $penerimaanModel = Penerimaan::getPenerimaansOnDate($date)->where('tank_id',$tankId)->first();

        Debugbar::info($report);

        $tank = Tank::findOrFailOnDate($tankId, $date);

        $penerimaan = $penerimaanModel ? [
            'truckId' => $penerimaanModel->truck_id,
            'pnbp' => $penerimaanModel->pnbp,
            'initialVolume' => $penerimaanModel->initial_volume,
            'pnbpVolume' => $penerimaanModel->pnbp_volume,
            'actualVolume' => $penerimaanModel->actual_volume,
            'volumeDiff' => $penerimaanModel->getVolumeDiff(),
        ] : null;

        $volumeOut = $tank->getVolumeOutOnDate($date);

        $reportData = collect([
            'id' => $report ? $report->id : -1,
            'tankName' => $tank->name,
            'reporter' => $report ? $report->reporter->name : '',
            'tankId' => $tank->id,
            'product' => $tank->getProductOnDate($date)->name,
            'initialStock' => $report ? $report->initial_stock : $tank->stock,
            'penerimaan' => $penerimaan,
            'volumeOut' => $volumeOut,
            'theoriticalStock' => ($report ? $report->initial_stock : $tank->stock) + ($penerimaan ? $penerimaan['volumeDiff'] : 0) - $volumeOut,
            'actualStock' => $report ? $report->actual_stock : 0,
        ]);
        return $reportData;
    }

    public static function getReportDataOnDate($date){
        $tanks = Tank::getTanksOnDate($date)
            ->map(function($tank) use ($date){
                return self::getReportDataOnTank($tank->id, $date);
            });

        return $tanks;
    }
}
