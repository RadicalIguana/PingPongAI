<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->integer('winner_id')->unsigned();
            $table->integer('loser_id')->unsigned();
            $table->string('game_result');
            $table->timestamps();

            $table->foreign('winner_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('loser_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
