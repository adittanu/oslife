<?php

namespace Tests\Feature;

use App\Models\DzikirLog;
use App\Models\MuhasabahEntry;
use App\Models\MuslimHabitDefinition;
use App\Models\MuslimHabitLog;
use App\Models\MuslimHabitReflection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MuslimModePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_muhasabah_saves_extended_daily_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/muslim/muhasabah', [
            'date' => '2026-03-10',
            'gratitude' => 'Masih diberi kesehatan.',
            'improvement' => 'Lebih tepat waktu shalat.',
            'achievement' => 'Tilawah satu juz.',
            'tomorrow_goal' => 'Bangun sebelum subuh.',
            'reflection' => 'Hari ini lebih tenang.',
            'mood' => 'peaceful',
        ])->assertOk()
            ->assertJsonPath('mood', 'peaceful');

        $entry = MuhasabahEntry::query()->firstOrFail();

        $this->assertSame('Masih diberi kesehatan.', $entry->gratitude);
        $this->assertSame('Lebih tepat waktu shalat.', $entry->improvement);
        $this->assertSame('Tilawah satu juz.', $entry->achievement);
        $this->assertSame('Bangun sebelum subuh.', $entry->tomorrow_goal);
        $this->assertSame('Hari ini lebih tenang.', $entry->reflection);
    }

    public function test_dzikir_set_count_persists_count_and_target(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/muslim/dzikir/set', [
            'date' => '2026-03-10',
            'dzikir_name' => 'Subhanallah',
            'count' => 33,
            'target' => 33,
        ])->assertOk()
            ->assertJsonPath('count', 33)
            ->assertJsonPath('target', 33);

        $log = DzikirLog::query()->firstOrFail();

        $this->assertSame(33, $log->count);
        $this->assertSame(33, $log->target);
    }

    public function test_sholat_log_can_be_cleared(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/muslim/sholat-tracker/log', [
            'date' => '2026-03-10',
            'prayer_name' => 'fajr',
            'status' => 'jamaah',
        ])->assertOk();

        $this->assertDatabaseHas('sholat_weekly_logs', [
            'user_id' => $user->id,
            'date' => '2026-03-10 00:00:00',
            'prayer_name' => 'fajr',
            'status' => 'jamaah',
        ]);

        $this->actingAs($user)->postJson('/api/muslim/sholat-tracker/log', [
            'date' => '2026-03-10',
            'prayer_name' => 'fajr',
            'status' => null,
        ])->assertOk()
            ->assertJsonPath('status', 'cleared');

        $this->assertDatabaseMissing('sholat_weekly_logs', [
            'user_id' => $user->id,
            'date' => '2026-03-10',
            'prayer_name' => 'fajr',
        ]);
    }

    public function test_muslim_habit_tracker_persists_definition_log_and_reflection(): void
    {
        $user = User::factory()->create();

        $definitionResponse = $this->actingAs($user)->postJson('/api/muslim/habit-tracker/definitions', [
            'name' => 'Qiyamul Lail',
            'icon' => 'dark_mode',
            'color' => 'indigo',
        ])->assertOk();

        $definitionId = $definitionResponse->json('id');

        $this->actingAs($user)->postJson('/api/muslim/habit-tracker/toggle', [
            'date' => '2026-03-10',
            'habit_name' => 'Qiyamul Lail',
            'done' => true,
        ])->assertOk();

        $this->actingAs($user)->postJson('/api/muslim/habit-tracker/reflection', [
            'week_start' => '2026-03-09',
            'content' => 'Pekan ini lebih stabil menjaga qiyam.',
        ])->assertOk();

        $definition = MuslimHabitDefinition::query()->findOrFail($definitionId);
        $log = MuslimHabitLog::query()->firstOrFail();
        $reflection = MuslimHabitReflection::query()->firstOrFail();

        $this->assertSame('Qiyamul Lail', $definition->name);
        $this->assertSame('Qiyamul Lail', $log->habit_name);
        $this->assertTrue($log->value);
        $this->assertSame('Pekan ini lebih stabil menjaga qiyam.', $reflection->content);
    }
}
