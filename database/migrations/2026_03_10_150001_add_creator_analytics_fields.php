<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_posts', function (Blueprint $table) {
            $table->unsignedInteger('views')->default(0)->after('status');
            $table->unsignedInteger('likes')->default(0)->after('views');
            $table->unsignedInteger('comments')->default(0)->after('likes');
            $table->unsignedInteger('shares')->default(0)->after('comments');
            $table->unsignedInteger('saves')->default(0)->after('shares');
        });

        Schema::create('platform_stat_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('platform');
            $table->unsignedInteger('followers')->default(0);
            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->unsignedInteger('avg_views')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->date('recorded_on');
            $table->timestamps();

            $table->unique(['user_id', 'platform', 'recorded_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_stat_snapshots');

        Schema::table('content_posts', function (Blueprint $table) {
            $table->dropColumn(['views', 'likes', 'comments', 'shares', 'saves']);
        });
    }
};
