<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoodEntry extends Model
{
    protected $fillable = ['user_id', 'date', 'mood', 'icon', 'mood_level', 'note', 'tags'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'mood_level' => 'integer',
            'tags' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
