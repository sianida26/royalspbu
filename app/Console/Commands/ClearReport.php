<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:clear';

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

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $start = microtime(true);
        DB::table('pump_report_nozzles')->truncate();
        $end = microtime(true);
        $this->line('success clearing table pump_report_nozzles ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('daily_pump_reports')->truncate();
        $end = microtime(true);
        $this->line('success clearing table daily_pump_reports ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('penerimaans')->truncate();
        $end = microtime(true);
        $this->line('success clearing table penerimaans ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('pengeluarans')->truncate();
        $end = microtime(true);
        $this->line('success clearing table pengeluarans ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('pengeluaran_types')->truncate();
        $end = microtime(true);
        $this->line('success clearing table pengeluaran_types ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('persediaan_reports')->truncate();
        $end = microtime(true);
        $this->line('success clearing table persediaan_reports ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('tabungans')->truncate();
        $end = microtime(true);
        $this->line('success clearing table tabungans ('.(intval(($end-$start)*1000)).' ms)');

        $start = microtime(true);
        DB::table('totalizator_reports')->truncate();
        $end = microtime(true);
        $this->line('success clearing table totalizator_reports ('.(intval(($end-$start)*1000)).' ms)');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->info('success clearing tables!');
    }
}
