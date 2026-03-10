<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('habit_name', 100);
            $table->string('icon', 50);
            $table->json('value')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date', 'habit_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_logs');
    }
};
