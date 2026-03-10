<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('muslim_habit_definitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('icon', 50);
            $table->string('color', 30)->default('emerald');
            $table->boolean('is_default')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('archived')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'name']);
        });

        Schema::create('muslim_habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('habit_name', 100);
            $table->string('icon', 50)->nullable();
            $table->boolean('value')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'habit_name']);
        });

        Schema::create('muslim_habit_reflections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('week_start');
            $table->text('content')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'week_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('muslim_habit_reflections');
        Schema::dropIfExists('muslim_habit_logs');
        Schema::dropIfExists('muslim_habit_definitions');
    }
};
