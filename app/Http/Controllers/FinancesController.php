<?php

namespace App\Http\Controllers;

use App\Models\FinanceTransaction;
use App\Models\FinanceBudget;
use App\Models\FinanceGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $transactions = [];
        $budgets = [];
        $goals = [];

        if ($user) {
            $currentMonth = now()->month;
            $currentYear = now()->year;

            $transactions = $user->financeTransactions()
                ->orderBy('date', 'desc')
                ->limit(50)
                ->get();

            $budgets = $user->financeBudgets()
                ->where('month', $currentMonth)
                ->where('year', $currentYear)
                ->get();

            $goals = $user->financeGoals()->get();
        }

        return Inertia::render('Finances', [
            'transactions' => $transactions,
            'budgets' => $budgets,
            'goals' => $goals,
        ]);
    }

    public function storeTransaction(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $transaction = $request->user()->financeTransactions()->create($data);
        return response()->json($transaction);
    }

    public function updateTransaction(Request $request, int $id)
    {
        $transaction = $request->user()->financeTransactions()->findOrFail($id);

        $data = $request->validate([
            'date' => 'sometimes|date',
            'type' => 'sometimes|in:income,expense',
            'category' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
            'amount' => 'sometimes|numeric|min:0.01',
        ]);

        $transaction->update($data);
        return response()->json($transaction);
    }

    public function destroyTransaction(Request $request, int $id)
    {
        $request->user()->financeTransactions()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }

    public function storeBudget(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string|max:100',
            'limit_amount' => 'required|numeric|min:0',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);

        $budget = $request->user()->financeBudgets()->create($data);
        return response()->json($budget);
    }

    public function storeGoal(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $goal = $request->user()->financeGoals()->create($data);
        return response()->json($goal);
    }

    public function updateGoal(Request $request, int $id)
    {
        $goal = $request->user()->financeGoals()->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'target_amount' => 'sometimes|numeric|min:0',
            'current_amount' => 'sometimes|numeric|min:0',
            'deadline' => 'nullable|date',
            'color' => 'sometimes|string',
            'icon' => 'nullable|string',
        ]);

        $goal->update($data);
        return response()->json($goal);
    }
}
