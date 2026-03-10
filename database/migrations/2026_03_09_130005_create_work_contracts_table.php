<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('work_clients')->onDelete('set null');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->enum('status', ['Draft', 'Sent', 'Signed', 'Expired', 'Cancelled'])->default('Draft');
            $table->date('signed_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_contracts');
    }
};