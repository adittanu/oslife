<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Script extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'platform',
        'status',
        'content',
        'word_count',
    ];

    protected static function booted()
    {
        static::saving(function ($script) {
            if ($script->isDirty('content')) {
                $script->word_count = str_word_count($script->content ?? '');
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
