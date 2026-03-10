<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tadabbur_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('surah', 100);
            $table->string('ayat', 50);
            $table->text('arabic')->nullable();
            $table->text('reflection')->nullable();
            $table->string('color', 50)->default('bg-blue-50');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tadabbur_notes');
    }
};