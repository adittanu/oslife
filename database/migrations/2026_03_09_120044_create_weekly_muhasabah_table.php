<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_muhasabah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('week_start'); // Monday of the week
            $table->text('achievements')->nullable(); // JSON array
            $table->text('challenges')->nullable(); // JSON array
            $table->text('lessons_learned')->nullable();
            $table->text('next_week_goals')->nullable(); // JSON array
            $table->text('gratitude')->nullable();
            $table->string('overall_mood')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'week_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_muhasabah');
    }
};