<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dzikir_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('dzikir_name', 100);
            $table->boolean('done')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'dzikir_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dzikir_logs');
    }
};