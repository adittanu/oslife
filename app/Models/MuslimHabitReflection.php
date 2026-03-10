<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MuslimHabitReflection extends Model
{
    protected $fillable = [
        'user_id',
        'week_start',
        'content',
    ];

    protected $casts = [
        'week_start' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
