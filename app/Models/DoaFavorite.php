<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoaFavorite extends Model
{
    protected $fillable = [
        'user_id',
        'doa_id',
        'personal_note',
        'memorized',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}