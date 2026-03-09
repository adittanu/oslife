<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_kits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('colors')->nullable(); // array of {name, hex}
            $table->json('fonts')->nullable(); // array of {role, font, weight}
            $table->json('tone_examples')->nullable(); // array of {tone, emoji, example}
            $table->json('keywords')->nullable(); // array of strings
            $table->json('content_pillars')->nullable(); // array of {pillar, desc, icon}
            $table->json('dos_donts')->nullable(); // {dos: [], donts: []}
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_kits');
    }
};
