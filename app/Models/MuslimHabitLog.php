<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MuslimHabitLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'habit_name',
        'icon',
        'value',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'value' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
