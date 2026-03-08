<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('theme')->default('pink')->after('plan');
            $table->string('default_mode')->default('life')->after('theme');
            $table->string('first_day')->default('monday')->after('default_mode');
            $table->string('language')->default('id')->after('first_day');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['theme', 'default_mode', 'first_day', 'language']);
        });
    }
};
