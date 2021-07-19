<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenerimaansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('penerimaans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('issuer_id')->constrained('users');
            $table->timestamp('issue_timestamp')->useCurrent();
            $table->foreignId('tank_id')->constrained();
            $table->string('truck_id')->nullable();
            $table->string('pnbp')->nullable();
            $table->unsignedInteger('initial_volume')->nullable();
            $table->unsignedInteger('pnbp_volume')->nullable();
            $table->unsignedInteger('actual_volume')->nullable();
            $table->timestamp('receive_timestamp')->nullable();
            $table->foreignId('receiver_id')->nullable()->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('penerimaans');
    }
}
