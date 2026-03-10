<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hifz_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('surah', 100);
            $table->integer('total_ayat');
            $table->integer('memorized')->default(0);
            $table->enum('status', ['not-started', 'in-progress', 'done'])->default('not-started');
            $table->timestamps();
            $table->unique(['user_id', 'surah']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hifz_progress');
    }
};