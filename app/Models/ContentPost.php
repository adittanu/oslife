<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_date',
        'platform',
        'type',
        'title',
        'notes',
        'status',
        'views',
        'likes',
        'comments',
        'shares',
        'saves',
    ];

    protected $casts = [
        'post_date' => 'date',
        'views' => 'integer',
        'likes' => 'integer',
        'comments' => 'integer',
        'shares' => 'integer',
        'saves' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
