<?php

namespace App\Console\Commands;

use App\Models\Pump;
use App\Models\DailyPumpReport;

use Carbon\Carbon;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedLaporanPompa extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'laporan:pompaHarian {--truncate} {--harian} {--bulanan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command untuk membuat seed laporan pompa harian';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        //seed
        if (!$this->option('truncate')){

            //seed harian
            if ($this->option('harian')){
                $date = Carbon::today();
                $pumps = Pump::getPumpsOnDate($date);
                $pumpNumber = 1;
                foreach($pumps as $pump){
                    if (rand(0,1)){
                        DailyPumpReport::generateRandomReport($pump, $pumpNumber, $date);
                    }
                    $pumpNumber++;
                }
                $this->info('Success generating random report');
            } 
            
            //seed bulanan
            else if ($this->option('bulanan')) {
                $startOfMonth = Carbon::now()->startOfMonth();
                $endOfMonth = Carbon::now()->endOfMonth();
                $now = $startOfMonth;
                while ($now < $endOfMonth){
                    $pumps = Pump::getPumpsOnDate($now);
                    $pumpNumber = 1;
                    foreach($pumps as $pump){
                        if (rand(0,1)){
                            DailyPumpReport::generateRandomReport($pump, $pumpNumber, $now);
                        }
                        $pumpNumber++;
                    }
                    $now->addDays(1);
                }
                $this->info('Success generating random report');
            } else {
                $this->info('ntah');
            }
        }
        //clear
        else {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::table('pump_report_nozzles')->truncate();
            DB::table('daily_pump_reports')->truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->info('success clearing table');
        }
    }
}
