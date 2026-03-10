<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'company',
        'email',
        'phone',
        'status',
        'notes',
        'avatar_color',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}