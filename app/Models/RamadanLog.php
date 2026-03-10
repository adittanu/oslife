<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RamadanLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'sahur',
        'iftar',
        'tarawih',
        'quran_pages',
        'reflection',
    ];

    protected $casts = [
        'date' => 'date',
        'sahur' => 'boolean',
        'iftar' => 'boolean',
        'tarawih' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}