<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sunnah_prayer_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('prayer_name', 50);
            $table->boolean('done')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'prayer_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sunnah_prayer_logs');
    }
};