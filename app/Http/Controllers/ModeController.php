<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ModeController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'mode' => 'required|in:life,muslim,creator,work',
        ]);

        $request->user()->update([
            'default_mode' => $request->mode,
        ]);

        $homePages = [
            'life' => '/daily-spread',
            'muslim' => '/muslim/daily-spread',
            'creator' => '/creator/content-calendar',
            'work' => '/work/dashboard',
        ];

        return redirect($homePages[$request->mode]);
    }
}
