<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuranReadingLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'juz',
        'surah',
        'ayat_start',
        'ayat_end',
        'pages',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}