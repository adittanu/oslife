<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GratitudeEntry extends Model
{
    protected $fillable = ['user_id', 'content', 'media_type', 'media_path'];

    protected function casts(): array
    {
        return [
            'media_type' => 'string',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
