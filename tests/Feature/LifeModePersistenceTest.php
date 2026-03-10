<?php

namespace Tests\Feature;

use App\Models\MoodEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LifeModePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_notes_can_be_created_with_empty_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/notes', [
            'title' => 'Inbox',
            'content' => '',
            'tags' => [],
            'color' => 'yellow',
        ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Inbox')
            ->assertJsonPath('content', '');
    }

    public function test_ideas_can_be_created_with_empty_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/ideas', [
            'title' => 'Spark',
            'content' => '',
            'tags' => [],
            'color' => 'pink',
        ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Spark')
            ->assertJsonPath('content', '');
    }

    public function test_mood_tracker_saves_normalized_and_legacy_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/mood', [
            'date' => '2026-03-10',
            'mood_level' => 4,
            'note' => 'Feeling steady.',
            'tags' => ['Work', 'Sleep'],
        ]);

        $response->assertOk()
            ->assertJsonPath('mood_level', 4)
            ->assertJsonPath('mood', 'optimistic')
            ->assertJsonPath('icon', 'sentiment_satisfied');

        $entry = MoodEntry::query()->where('user_id', $user->id)->firstOrFail();

        $this->assertSame(4, $entry->mood_level);
        $this->assertSame('optimistic', $entry->mood);
        $this->assertSame('sentiment_satisfied', $entry->icon);
        $this->assertSame('Feeling steady.', $entry->note);
        $this->assertSame(['Work', 'Sleep'], $entry->tags);
    }

    public function test_habit_reflection_and_weekly_gratitude_are_persisted(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/habits/reflection', [
            'month' => '2026-03',
            'content' => 'Consistency feels better this month.',
        ])->assertOk();

        $this->assertDatabaseHas('habit_monthly_reflections', [
            'user_id' => $user->id,
            'month' => '2026-03',
            'content' => 'Consistency feels better this month.',
        ]);

        $this->actingAs($user)->postJson('/api/weekly-review', [
            'week_start' => '2026-03-08',
            'week_end' => '2026-03-14',
            'wins' => ['Closed all tasks'],
            'challenges' => ['Energy dipped midweek'],
            'lessons' => 'Sleep matters.',
            'priorities' => ['Recover well'],
            'scores' => ['Health' => 8],
            'gratitude' => 'Family support',
        ])->assertOk();

        $this->assertDatabaseHas('weekly_reviews', [
            'user_id' => $user->id,
            'week_start' => '2026-03-08',
            'gratitude' => 'Family support',
        ]);
    }
}
