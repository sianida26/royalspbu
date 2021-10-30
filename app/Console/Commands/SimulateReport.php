<?php

namespace App\Console\Commands;

use App\Models\Pump;
use App\Models\User;
use App\Models\Tank;
use App\Models\Penerimaan;
use App\Models\Pengeluaran;
use App\Models\Tabungan;
use App\Models\PengeluaranTypes;
use App\Models\DailyPumpReport;
use App\Models\PersediaanReport;
use App\Models\TotalizatorReport;

use Carbon\Carbon;

use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SimulateReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:simulate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    private function generateToken(){
        $chars = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u' ,'v', 'w', 'x', 'y', 'z'];
        $token = implode(Arr::random($chars,12));
        while (TotalizatorReport::firstWhere('report_token',$token) != null) $token = implode(Arr::random($chars,12)); //preventing duplicates
        return $token;
    }

    private function generateDailyPumpReport($currentDate){
        $this->line('Generating daily pump report...');
        $start = microtime(true);
        $pumps = Pump::getPumpsOnDate($currentDate);
        foreach($pumps as $index=>$pump){
            if (rand(0,1)){
                DailyPumpReport::generateRandomReport($pump, $index+1, $currentDate);
            }
        }
        $end = microtime(true);
        $this->info('Daily Pump Report done ('.(intval(($end-$start)*1000)).' ms)');
        $this->newLine();
    }

    private function generateTotalizatorReport($currentDate){
        $this->line('Generating totalizator report...');
        $start = microtime(true);
        $report = new TotalizatorReport;
        $reporter = User::role('admin')->get()->random(); //random reporter
        $reportToken =  $this->generateToken();

        //generating random pengeluaran
        for($i = 0; $i < rand(0,10); $i++){
            $pengeluaran = new Pengeluaran;
            $amount = rand(1000,500000);
            $reportFilename = 'seed.png';
            $pengeluaran->created_at = $currentDate;

            //generating random pengeluaran type
            $randomNumber = rand(0,100);
            $pengeluaranType = PengeluaranTypes::firstOrCreate(
                ['name' => 'Pengeluaran id '.$randomNumber],
                ['name' => 'Pengeluaran id '.$randomNumber],
            );

            $pengeluaran->type()->associate($pengeluaranType);
            $pengeluaran->amount = $amount;
            $pengeluaran->report_filename = $reportFilename;

            $pengeluaran->save();
        }

        //generating random tabungan
        if (rand(0,1)){
            $tabungan = new Tabungan;
            $amount = rand(20000,500000);
            $filename = 'seed.png';

            $tabungan->created_at = $currentDate;
            $tabungan->amount = $amount;
            $tabungan->report_filename = $filename;

            $tabungan->save();
        }

        $report->created_at = $currentDate;
        $report->updated_at = $currentDate;
        $report->report_token = $reportToken;
        $report->reporter()->associate($reporter);

        $report->save();
        $end = microtime(true);
        $this->info('Totalizator Report done ('.(intval(($end-$start)*1000)).' ms)');
        $this->newLine();
    }

    private function requestPermintaan($tank, $currentDate){
        $start = microtime(true);
        $permintaan = new Penerimaan;
        $reporter = User::role('admin')->get()->random(); //random reporter
        $pnbpVolume = 16000;

        $permintaan->issuer_id = $reporter->id;
        $permintaan->tank_id = $tank->id;
        $permintaan->pnbp_volume = $pnbpVolume;
        $permintaan->issue_timestamp = $currentDate;
        $permintaan->save();
        $end = microtime(true);
        $this->info('Request stock done ('.(intval(($end-$start)*1000)).' ms)');
        $this->newLine();
    }

    private function generatePenerimaanReport($currentDate){
        $this->line('Generating penerimaan report');
        $start = microtime(true);
        $reporter = User::role('admin')->get()->random(); //random reporter

        $penerimaans = Penerimaan::where('receive_timestamp',null)->get();
        foreach($penerimaans as $index=>$penerimaan){

            $tank = $penerimaan->tank;

            $initialVolume = rand(0, $tank->stock);
            $actualVolume = $initialVolume + $penerimaan->pnbp_volume - rand(0, 20);
            $this->comment('penerimaan '.$tank->name.': '.($actualVolume-$initialVolume).' L');

            $penerimaan->truck_id = 'N '.rand(1000,9999).' UA';
            $penerimaan->pnbp = rand(10000,99999);
            $penerimaan->initial_volume = $initialVolume;
            $penerimaan->actual_volume = $actualVolume;
            $penerimaan->receive_timestamp = $currentDate;
            $penerimaan->receiver_id = $reporter->id;
            $penerimaan->save();
        }
        $end = microtime(true);
        $this->info('Penerimaan Report done ('.$penerimaans->count().' penerimaans, '.(intval(($end-$start)*1000)).' ms)');
        $this->newLine();
    }

    private function generatePersediaanReport($currentDate){
        $this->line('Generating persediaan report');
        $start = microtime(true);
        $tanks = Tank::getTanksOnDate($currentDate);
        
        $reporter = User::role('admin')->get()->random(); //random reporter

        foreach($tanks as $index=>$tank){
            $report = new PersediaanReport;
            $penerimaan = Penerimaan::getPenerimaansOnDate($currentDate)->where('tank_id', $tank->id)->first();

            $theoriticalStock = $tank->stock + ($penerimaan ? ($penerimaan->actual_volume - $penerimaan->initial_volume) : 0) - $tank->getVolumeOutOnDate($currentDate); //calculate penerimaan also
            $actualStock = $theoriticalStock - rand(0,10);

            $report->reporter()->associate($reporter);
            $report->tank()->associate($tank);
            $report->initial_stock = $tank->stock;
            $report->actual_stock = $actualStock; //rand loss amount
            $report->created_at = $currentDate;
            $report->updated_at = $currentDate;
            $report->save();

            $tank->stock = $actualStock;
            $tank->save();

            if ($actualStock < 4000){ //if stock less than 4000, request permintaan
                $this->warn('Volume '.$tank->name.' is '.$actualStock.'. Requesting stock');
                $this->requestPermintaan($tank, $currentDate);
            }
        }

        $end = microtime(true);
        $this->info('Persediaan Report done ('.(intval(($end-$start)*1000)).' ms)');
        $this->newLine();

    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $currentDate = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        // $bar = $this->output->createProgressBar($endOfMonth->day);
        // $bar->start();
        while ($currentDate < $endOfMonth){

            $this->warn('---- '.$currentDate->isoFormat('dddd, D MMMM Y').' ----');

            //generate penerimaan report
            $this->generatePenerimaanReport($currentDate);

            //generate pump report
            $this->generateDailyPumpReport($currentDate);

            //generate totalizator report
            $this->generateTotalizatorReport($currentDate);

            //generate persediaan report
            $this->generatePersediaanReport($currentDate);

            $currentDate->addDays(1);
            $this->newLine(2);
            // $bar->advance();
        }
        // $bar->finish();
        $this->newLine();
        $this->info('selesai');
    }
}
