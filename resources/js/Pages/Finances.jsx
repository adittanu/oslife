import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Finances({ transactions: propTransactions, budgets: propBudgets, goals: propGoals }) {
    const [transactions, setTransactions] = useState(propTransactions || []);
    const [budgets, setBudgets] = useState(propBudgets || []);
    const [goals, setGoals] = useState(propGoals || []);

    // Form states
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: '',
        description: '',
        amount: '',
    });

    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [budgetForm, setBudgetForm] = useState({
        category: '',
        limit_amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goalForm, setGoalForm] = useState({
        name: '',
        target_amount: '',
        current_amount: '0',
        deadline: '',
        color: 'blue',
        icon: 'savings',
    });

    useEffect(() => {
        setTransactions(propTransactions || []);
        setBudgets(propBudgets || []);
        setGoals(propGoals || []);
    }, [propTransactions, propBudgets, propGoals]);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/finances/transactions', transactionForm);
            setTransactions([res.data, ...transactions]);
            setShowTransactionForm(false);
            setTransactionForm({
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: '',
                description: '',
                amount: '',
            });
            router.reload({ only: ['transactions'] });
        } catch (err) {
            console.error('Failed to add transaction', err);
        }
    };

    const handleAddBudget = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/finances/budgets', budgetForm);
            setBudgets([...budgets, res.data]);
            setShowBudgetForm(false);
            setBudgetForm({
                category: '',
                limit_amount: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            });
            router.reload({ only: ['budgets'] });
        } catch (err) {
            console.error('Failed to add budget', err);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/finances/goals', goalForm);
            setGoals([...goals, res.data]);
            setShowGoalForm(false);
            setGoalForm({
                name: '',
                target_amount: '',
                current_amount: '0',
                deadline: '',
                color: 'blue',
                icon: 'savings',
            });
            router.reload({ only: ['goals'] });
        } catch (err) {
            console.error('Failed to add goal', err);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await axios.delete(`/api/finances/transactions/${id}`);
            setTransactions(transactions.filter(t => t.id !== id));
            router.reload({ only: ['transactions'] });
        } catch (err) {
            console.error('Failed to delete transaction', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    // Calculate spending by category for current month
    const spendingByCategory = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + parseFloat(t.amount);
        });

    return (
        <JournalLayout
            pageTitle="Mosiku Finance Tracker Page"
            headerTitle="Finances"
            headerSubtitle="Tracking my pennies & pounds."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-green-400 rotate-[-15deg]">payments</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-yellow-300">calculate</span>
            </div>
            <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-blue-300">savings</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1200px] h-full min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 dot-grid overflow-y-auto custom-scrollbar">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center md:text-left md:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Monthly Budget & Spending</h3>
                                <div className="h-0.5 w-48 bg-blue-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-6 mt-8 relative z-10">
                            {/* Budgets */}
                            <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Spending by Category</h4>
                                    <button
                                        onClick={() => setShowBudgetForm(!showBudgetForm)}
                                        className="text-primary hover:underline font-note text-sm"
                                    >
                                        + Add Budget
                                    </button>
                                </div>

                                {showBudgetForm && (
                                    <form onSubmit={handleAddBudget} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            className="w-full p-2 border rounded"
                                            value={budgetForm.category}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Limit"
                                            className="w-full p-2 border rounded"
                                            value={budgetForm.limit_amount}
                                            onChange={(e) => setBudgetForm({ ...budgetForm, limit_amount: e.target.value })}
                                            required
                                        />
                                        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save Budget</button>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {budgets.length === 0 && Object.keys(spendingByCategory).length === 0 ? (
                                        <p className="font-note text-gray-400 text-center py-4">No budgets set yet</p>
                                    ) : (
                                        budgets.map((budget, i) => {
                                            const spent = spendingByCategory[budget.category] || 0;
                                            const percentage = Math.min((spent / budget.limit_amount) * 100, 100);
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between font-note text-lg text-gray-600 mb-1">
                                                        <span>{budget.category}</span>
                                                        <span>{formatCurrency(spent)} / {formatCurrency(budget.limit_amount)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
                                                        <div
                                                            className={`h-full rounded-full ${percentage >= 90 ? 'bg-red-300' : percentage >= 50 ? 'bg-orange-300' : 'bg-green-300'}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Savings Goals */}
                            <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300 mt-8 relative">
                                <div className="absolute -right-4 -top-6 rotate-12">
                                    <span className="material-symbols-outlined text-[40px] text-yellow-500">monetization_on</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Savings Goals</h4>
                                    <button
                                        onClick={() => setShowGoalForm(!showGoalForm)}
                                        className="text-primary hover:underline font-note text-sm"
                                    >
                                        + Add Goal
                                    </button>
                                </div>

                                {showGoalForm && (
                                    <form onSubmit={handleAddGoal} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Goal name"
                                            className="w-full p-2 border rounded"
                                            value={goalForm.name}
                                            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Target amount"
                                            className="w-full p-2 border rounded"
                                            value={goalForm.target_amount}
                                            onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="date"
                                            placeholder="Deadline"
                                            className="w-full p-2 border rounded"
                                            value={goalForm.deadline}
                                            onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                                        />
                                        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save Goal</button>
                                    </form>
                                )}

                                {goals.length > 0 ? (
                                    goals.map((goal, i) => {
                                        const percentage = Math.min((parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100, 100);
                                        return (
                                            <div key={i} className="mb-6">
                                                <h5 className="font-handwriting text-xl text-gray-800 mb-2">{goal.name}</h5>
                                                <div className="flex items-center justify-center">
                                                    <div className="relative w-32 h-40 border-4 border-gray-400 rounded-b-3xl rounded-t-xl overflow-hidden bg-blue-50/50">
                                                        <div
                                                            className="absolute bottom-0 left-0 right-0 bg-yellow-200/80 border-t-2 border-yellow-400 flex items-center justify-center"
                                                            style={{ height: `${percentage}%` }}
                                                        >
                                                            <span className="font-note text-xl font-bold text-yellow-700">{Math.round(percentage)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-center font-note text-lg text-gray-600 mt-4">
                                                    {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="font-note text-gray-400 text-center py-4">No savings goals yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="washi-tape bottom-10 -right-4 bg-yellow-100/70 rotate-[-15deg] w-40"></div>

                        <div className="absolute right-8 top-16 bg-sticky-yellow p-4 rounded shadow-sticky rotate-[5deg] w-48 border border-yellow-200 z-20">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-1">Tip of the Day</h4>
                            <p className="font-note text-sm text-gray-600">Always pay yourself first! Move 10% to savings on payday.</p>
                        </div>

                        <div className="flex justify-between items-start mb-6 z-10 relative mt-4">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-700">Transaction Log</h3>
                            <button
                                onClick={() => setShowTransactionForm(!showTransactionForm)}
                                className="text-primary hover:underline font-note text-lg"
                            >
                                + Add
                            </button>
                        </div>

                        {showTransactionForm && (
                            <form onSubmit={handleAddTransaction} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={transactionForm.date}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-full p-2 border rounded"
                                    value={transactionForm.type}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Category"
                                    className="w-full p-2 border rounded"
                                    value={transactionForm.category}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="w-full p-2 border rounded"
                                    value={transactionForm.description}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount"
                                    className="w-full p-2 border rounded"
                                    value={transactionForm.amount}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                    required
                                />
                                <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save Transaction</button>
                            </form>
                        )}

                        <div className="relative w-full flex-1 z-10 mt-4 overflow-auto">
                            <table className="w-full text-left font-note text-xl text-gray-700">
                                <thead>
                                    <tr className="border-b-2 border-gray-400 text-gray-500">
                                        <th className="py-2 w-24">Date</th>
                                        <th className="py-2">Description</th>
                                        <th className="py-2 text-right">Amount</th>
                                        <th className="py-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center font-note text-gray-400">
                                                No transactions yet
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((t) => (
                                            <tr key={t.id} className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 text-gray-500">{formatDate(t.date)}</td>
                                                <td className="py-3">
                                                    {t.description || t.category}
                                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${
                                                        t.type === 'income'
                                                            ? 'bg-green-100 text-green-700 border-green-200'
                                                            : 'bg-red-100 text-red-700 border-red-200'
                                                    }`}>
                                                        {t.type === 'income' ? 'Income' : 'Expense'}
                                                    </span>
                                                </td>
                                                <td className={`py-3 text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                                </td>
                                                <td className="py-3">
                                                    <button
                                                        onClick={() => handleDeleteTransaction(t.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
