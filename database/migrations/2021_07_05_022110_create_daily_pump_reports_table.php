<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDailyPumpReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('daily_pump_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pump_id')->constrained();
            $table->foreignId('reporter_id')->constrained('users');
            $table->unsignedInteger('totalizator_initial');
            $table->unsignedInteger('totalizator_final');
            $table->unsignedBigInteger('income');
            $table->text('filename');
            $table->boolean('editable')->default(false);
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daily_pump_reports');
    }
}
