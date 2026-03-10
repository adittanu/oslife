<?php

namespace App\Policies;

use App\Models\ContentIdea;
use App\Models\User;

class ContentIdeaPolicy
{
    public function view(User $user, ContentIdea $idea): bool
    {
        return $user->id === $idea->user_id;
    }

    public function update(User $user, ContentIdea $idea): bool
    {
        return $user->id === $idea->user_id;
    }

    public function delete(User $user, ContentIdea $idea): bool
    {
        return $user->id === $idea->user_id;
    }
}
