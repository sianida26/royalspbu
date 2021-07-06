<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePumpReportNozzlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pump_report_nozzles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('daily_pump_reports');
            $table->foreignid('nozzle_id')->constrained();
            $table->unsignedInteger('totalizator_initial');
            $table->unsignedInteger('totalizator_final');
            $table->string('report_filename');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pump_report_nozzles');
    }
}
