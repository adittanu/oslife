<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sholat_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('sholat_name', 20); // Subuh, Dzuhur, Ashar, Maghrib, Isya
            $table->string('time', 10)->nullable();
            $table->enum('status', ['missed', 'alone', 'jamaah'])->default('missed');
            $table->timestamps();

            $table->unique(['user_id', 'date', 'sholat_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sholat_logs');
    }
};