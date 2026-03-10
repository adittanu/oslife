<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('dzikir_logs')) {
            $hasCount = Schema::hasColumn('dzikir_logs', 'count');
            $hasTarget = Schema::hasColumn('dzikir_logs', 'target');

            if (! $hasCount || ! $hasTarget) {
                Schema::table('dzikir_logs', function (Blueprint $table) use ($hasCount, $hasTarget) {
                    if (! $hasCount) {
                        $table->integer('count')->default(0);
                    }

                    if (! $hasTarget) {
                        $table->integer('target')->default(33);
                    }
                });
            }

            return;
        }

        Schema::create('dzikir_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('dzikir_name'); // Subhanallah, Alhamdulillah, etc.
            $table->integer('count')->default(0);
            $table->integer('target')->default(33);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'dzikir_name']);
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('dzikir_logs')) {
            return;
        }

        $hasCount = Schema::hasColumn('dzikir_logs', 'count');
        $hasTarget = Schema::hasColumn('dzikir_logs', 'target');

        if ($hasCount || $hasTarget) {
            Schema::table('dzikir_logs', function (Blueprint $table) use ($hasCount, $hasTarget) {
                $columns = array_values(array_filter([
                    $hasCount ? 'count' : null,
                    $hasTarget ? 'target' : null,
                ]));

                if ($columns !== []) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
