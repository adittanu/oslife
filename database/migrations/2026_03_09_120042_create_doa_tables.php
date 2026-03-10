<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doa_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('doa_id'); // reference to static doa
            $table->text('personal_note')->nullable();
            $table->integer('memorized')->default(0); // 0-100 percentage
            $table->timestamps();

            $table->unique(['user_id', 'doa_id']);
        });

        Schema::create('doa_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('doa_name');
            $table->boolean('read')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'doa_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doa_logs');
        Schema::dropIfExists('doa_favorites');
    }
};