<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TadabburNote extends Model
{
    protected $fillable = [
        'user_id',
        'surah',
        'ayat',
        'arabic',
        'reflection',
        'color',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}