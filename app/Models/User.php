<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\Note;
use App\Models\FinanceTransaction;
use App\Models\FinanceBudget;
use App\Models\FinanceGoal;
use App\Models\Idea;
use App\Models\GratitudeEntry;
use App\Models\Goal;
use App\Models\GoalMilestone;
use App\Models\FocusSession;
use App\Models\WeeklyReview;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'plan',
        'theme',
        'default_mode',
        'first_day',
        'language',
        'seen_tours',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'seen_tours' => 'array',
        ];
    }

    public function scheduleItems(): HasMany
    {
        return $this->hasMany(ScheduleItem::class);
    }

    public function priorities(): HasMany
    {
        return $this->hasMany(Priority::class);
    }

    public function dailyNotes(): HasMany
    {
        return $this->hasMany(DailyNote::class);
    }

    public function moodEntries(): HasMany
    {
        return $this->hasMany(MoodEntry::class);
    }

    public function habitLogs(): HasMany
    {
        return $this->hasMany(HabitLog::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function habitDefinitions(): HasMany
    {
        return $this->hasMany(HabitDefinition::class);
    }

    public function habitMonthlyReflections(): HasMany
    {
        return $this->hasMany(HabitMonthlyReflection::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function financeTransactions(): HasMany
    {
        return $this->hasMany(FinanceTransaction::class);
    }

    public function financeBudgets(): HasMany
    {
        return $this->hasMany(FinanceBudget::class);
    }

    public function financeGoals(): HasMany
    {
        return $this->hasMany(FinanceGoal::class);
    }

    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class);
    }

    public function gratitudeEntries(): HasMany
    {
        return $this->hasMany(GratitudeEntry::class);
    }

    public function goals(): HasMany
    {
        return $this->hasMany(Goal::class);
    }

    public function focusSessions(): HasMany
    {
        return $this->hasMany(FocusSession::class);
    }

    public function weeklyReviews(): HasMany
    {
        return $this->hasMany(WeeklyReview::class);
    }

    public function contentPosts(): HasMany
    {
        return $this->hasMany(ContentPost::class);
    }

    public function contentIdeas(): HasMany
    {
        return $this->hasMany(ContentIdea::class);
    }

    public function scripts(): HasMany
    {
        return $this->hasMany(Script::class);
    }

    public function platformStats(): HasMany
    {
        return $this->hasMany(PlatformStat::class);
    }

    public function platformStatSnapshots(): HasMany
    {
        return $this->hasMany(PlatformStatSnapshot::class);
    }

    public function brandKit(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(BrandKit::class);
    }

    public function brandCollabs(): HasMany
    {
        return $this->hasMany(BrandCollab::class);
    }
}
