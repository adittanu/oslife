<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kajian_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('title')->nullable();
            $table->string('speaker')->nullable();
            $table->text('notes')->nullable();
            $table->text('key_points')->nullable(); // JSON array
            $table->text('action_items')->nullable(); // JSON array
            $table->string('color')->default('bg-blue-50');
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kajian_notes');
    }
};