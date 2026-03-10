<?php

namespace App\Policies;

use App\Models\ContentPost;
use App\Models\User;

class ContentPostPolicy
{
    public function view(User $user, ContentPost $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function update(User $user, ContentPost $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, ContentPost $post): bool
    {
        return $user->id === $post->user_id;
    }
}
