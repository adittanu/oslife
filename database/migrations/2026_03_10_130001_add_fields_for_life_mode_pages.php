<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mood_entries', function (Blueprint $table) {
            $table->unsignedTinyInteger('mood_level')->nullable()->after('icon');
            $table->text('note')->nullable()->after('mood_level');
            $table->json('tags')->nullable()->after('note');
        });

        Schema::table('weekly_reviews', function (Blueprint $table) {
            $table->text('gratitude')->nullable()->after('scores');
        });

        Schema::create('habit_monthly_reflections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('month', 7);
            $table->text('content')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_monthly_reflections');

        Schema::table('weekly_reviews', function (Blueprint $table) {
            $table->dropColumn('gratitude');
        });

        Schema::table('mood_entries', function (Blueprint $table) {
            $table->dropColumn(['mood_level', 'note', 'tags']);
        });
    }
};
