<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SunnahPrayerLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'prayer_name',
        'done',
    ];

    protected $casts = [
        'date' => 'date',
        'done' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}