<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ramadan_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->boolean('sahur')->default(false);
            $table->boolean('iftar')->default(false);
            $table->boolean('tarawih')->default(false);
            $table->integer('quran_pages')->default(0);
            $table->text('reflection')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });

        Schema::create('ramadan_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('goal_type'); // quran_khatam, tarawih_daily, etc.
            $table->string('description');
            $table->integer('target')->default(30);
            $table->integer('current')->default(0);
            $table->year('ramadan_year');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ramadan_goals');
        Schema::dropIfExists('ramadan_logs');
    }
};