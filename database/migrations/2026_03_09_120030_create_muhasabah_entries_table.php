<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('muhasabah_entries')) {
            $columns = [
                'gratitude' => 'text',
                'improvement' => 'text',
                'achievement' => 'text',
                'tomorrow_goal' => 'text',
                'reflection' => 'text',
                'mood' => 'string',
            ];

            $missingColumns = array_keys(array_filter($columns, fn ($type, $column) => ! Schema::hasColumn('muhasabah_entries', $column), ARRAY_FILTER_USE_BOTH));

            if ($missingColumns !== []) {
                Schema::table('muhasabah_entries', function (Blueprint $table) use ($missingColumns) {
                    if (in_array('gratitude', $missingColumns, true)) {
                        $table->text('gratitude')->nullable();
                    }

                    if (in_array('improvement', $missingColumns, true)) {
                        $table->text('improvement')->nullable();
                    }

                    if (in_array('achievement', $missingColumns, true)) {
                        $table->text('achievement')->nullable();
                    }

                    if (in_array('tomorrow_goal', $missingColumns, true)) {
                        $table->text('tomorrow_goal')->nullable();
                    }

                    if (in_array('reflection', $missingColumns, true)) {
                        $table->text('reflection')->nullable();
                    }

                    if (in_array('mood', $missingColumns, true)) {
                        $table->string('mood')->nullable();
                    }
                });
            }

            return;
        }

        Schema::create('muhasabah_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->text('gratitude')->nullable(); // Syukur hari ini
            $table->text('improvement')->nullable(); // Hal yang perlu diperbaiki
            $table->text('achievement')->nullable(); // Pencapaian hari ini
            $table->text('tomorrow_goal')->nullable(); // Target esok hari
            $table->text('reflection')->nullable(); // Refleksi tambahan
            $table->string('mood')->nullable(); // happy, grateful, neutral, sad, anxious
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('muhasabah_entries')) {
            return;
        }

        $columns = array_values(array_filter([
            Schema::hasColumn('muhasabah_entries', 'gratitude') ? 'gratitude' : null,
            Schema::hasColumn('muhasabah_entries', 'improvement') ? 'improvement' : null,
            Schema::hasColumn('muhasabah_entries', 'achievement') ? 'achievement' : null,
            Schema::hasColumn('muhasabah_entries', 'tomorrow_goal') ? 'tomorrow_goal' : null,
            Schema::hasColumn('muhasabah_entries', 'reflection') ? 'reflection' : null,
            Schema::hasColumn('muhasabah_entries', 'mood') ? 'mood' : null,
        ]));

        if ($columns !== []) {
            Schema::table('muhasabah_entries', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
