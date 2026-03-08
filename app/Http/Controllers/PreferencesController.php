<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class PreferencesController extends Controller
{
    public function updateAppearance(Request $request): RedirectResponse
    {
        $request->validate([
            'theme' => 'required|in:pink,blue,green,purple,orange',
        ]);

        $request->user()->update(['theme' => $request->theme]);

        return back();
    }

    public function updateJournalSettings(Request $request): RedirectResponse
    {
        $request->validate([
            'default_mode' => 'required|in:life,muslim,work,creator',
            'first_day' => 'required|in:monday,sunday,saturday',
            'language' => 'required|in:id,en',
        ]);

        $request->user()->update($request->only('default_mode', 'first_day', 'language'));

        return back();
    }
}
