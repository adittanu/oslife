<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ModeController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'mode' => 'required|in:life,muslim,work',
        ]);

        $request->user()->update([
            'default_mode' => $request->mode,
        ]);

        $homePages = [
            'life' => '/daily-spread',
            'muslim' => '/muslim/daily-spread',
            'work' => '/daily-spread',
        ];

        return redirect($homePages[$request->mode]);
    }
}
