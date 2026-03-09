<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('post_date');
            $table->string('platform'); // instagram, youtube, tiktok, twitter
            $table->string('type'); // Reel, Video, Post, Story, Short, Carousel, Thread
            $table->string('title')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('planned'); // planned, draft, published
            $table->timestamps();

            $table->index(['user_id', 'post_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_posts');
    }
};
