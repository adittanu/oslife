<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platform_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // instagram, youtube, tiktok, twitter
            $table->integer('followers')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->integer('avg_views')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->date('date_recorded')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_stats');
    }
};
