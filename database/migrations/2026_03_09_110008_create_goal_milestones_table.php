<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goal_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goal_id')->constrained()->cascadeOnDelete();
            $table->string('text');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->index(['goal_id', 'completed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_milestones');
    }
};
