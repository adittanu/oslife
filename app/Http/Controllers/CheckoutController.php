<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private array $plans = [
        'free' => [
            'name' => 'Free',
            'price' => 0,
            'priceLabel' => 'Rp 0',
            'period' => 'selamanya',
            'features' => [
                '1 Mode (Life)',
                'Daily Task Log',
                '3 Habit Trackers',
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'price' => 49000,
            'priceLabel' => 'Rp 49.000',
            'period' => 'bulan',
            'features' => [
                'Semua 4 Mode',
                'Unlimited Trackers',
                'Cloud Sync',
                'Custom Sticker Pack',
            ],
        ],
        'team' => [
            'name' => 'Team',
            'price' => 199000,
            'priceLabel' => 'Rp 199.000',
            'period' => 'bulan',
            'features' => [
                'Hingga 5 User',
                'Shared Workspaces',
                'Admin Dashboard',
                'Prioritas Support',
            ],
        ],
    ];

    public function show(string $plan)
    {
        if (!isset($this->plans[$plan])) {
            abort(404);
        }

        return Inertia::render('Checkout', [
            'plan' => array_merge($this->plans[$plan], ['slug' => $plan]),
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request, string $plan)
    {
        if (!isset($this->plans[$plan])) {
            abort(404);
        }

        $request->user()->update(['plan' => $plan]);

        return redirect('/daily-spread');
    }
}
