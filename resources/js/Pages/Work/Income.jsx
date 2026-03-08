import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Income() {
    const monthlyData = [
        { month: 'Oct', actual: 6200, target: 7000, height: '62%', targetHeight: '70%' },
        { month: 'Nov', actual: 7800, target: 7000, height: '78%', targetHeight: '70%' },
        { month: 'Dec', actual: 5500, target: 7000, height: '55%', targetHeight: '70%' },
        { month: 'Jan', actual: 8200, target: 8000, height: '82%', targetHeight: '80%' },
        { month: 'Feb', actual: 9100, target: 8000, height: '91%', targetHeight: '80%' },
        { month: 'Mar', actual: 7400, target: 8000, height: '74%', targetHeight: '80%' },
    ];

    const clients = [
        { name: 'Acme Studios', amount: '$3,500', percentage: '38%', color: 'bg-blue-400' },
        { name: 'Nova Digital', amount: '$2,800', percentage: '30%', color: 'bg-green-400' },
        { name: 'Bright Ideas Co.', amount: '$1,900', percentage: '20%', color: 'bg-purple-400' },
        { name: 'Sunset Agency', amount: '$1,100', percentage: '12%', color: 'bg-orange-400' },
    ];

    const expenses = [
        { category: 'Software & Tools', amount: '$320', icon: 'devices', color: 'bg-blue-100 text-blue-700' },
        { category: 'Marketing', amount: '$180', icon: 'campaign', color: 'bg-pink-100 text-pink-700' },
        { category: 'Office Supplies', amount: '$95', icon: 'inventory_2', color: 'bg-yellow-100 text-yellow-700' },
        { category: 'Professional Dev', amount: '$250', icon: 'school', color: 'bg-green-100 text-green-700' },
        { category: 'Travel', amount: '$150', icon: 'flight', color: 'bg-purple-100 text-purple-700' },
    ];

    const totalIncome = 9300;
    const totalExpenses = 995;
    const netProfit = totalIncome - totalExpenses;

    return (
        <JournalLayout
            pageTitle="Work OS - Income"
            headerTitle="Income Tracker"
            headerSubtitle="Follow the money"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">account_balance_wallet</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Income Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">trending_up</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">This Month</p>
                            <p className="font-handwriting text-3xl font-bold text-green-700 mt-1">$9,300</p>
                            <p className="font-note text-xs text-green-600 mt-1">+16% vs target</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">flag</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Monthly Target</p>
                            <p className="font-handwriting text-3xl font-bold text-blue-700 mt-1">$8,000</p>
                            <p className="font-note text-xs text-blue-600 mt-1">Exceeded!</p>
                        </div>
                        <div className="bg-red-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">shopping_cart</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Expenses</p>
                            <p className="font-handwriting text-3xl font-bold text-red-700 mt-1">$995</p>
                            <p className="font-note text-xs text-gray-500 mt-1">5 categories</p>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">savings</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Net Profit</p>
                            <p className="font-handwriting text-3xl font-bold text-emerald-700 mt-1">${netProfit.toLocaleString()}</p>
                            <p className="font-note text-xs text-emerald-600 mt-1">89% margin</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Monthly Income Chart */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/4 bg-green-100/80 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-2">Monthly Income</h3>
                            <p className="font-note text-xs text-gray-400 mb-4">Last 6 months - bars show actual vs target (dashed line)</p>
                            <div className="flex items-end gap-3 h-48 px-2">
                                {monthlyData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="font-note text-xs text-gray-500">${(d.actual / 1000).toFixed(1)}k</span>
                                        <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500"
                                                style={{
                                                    height: d.height,
                                                    backgroundColor: d.actual >= d.target ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.4)',
                                                }}
                                            ></div>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-gray-400"
                                                style={{ bottom: d.targetHeight }}
                                            ></div>
                                        </div>
                                        <span className="font-note text-xs text-gray-600 font-bold">{d.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-3 rounded bg-green-400/60"></div>
                                    <span className="font-note text-xs text-gray-500">Actual</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 border-t-2 border-dashed border-gray-400"></div>
                                    <span className="font-note text-xs text-gray-500">Target</span>
                                </div>
                            </div>
                        </div>

                        {/* Income by Client */}
                        <div className="lg:col-span-1 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-[2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Income by Client</h3>
                            <div className="space-y-4">
                                {clients.map((c, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                            <span>{c.name}</span>
                                            <span className="font-bold">{c.amount}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div className={`${c.color} h-full rounded-full transition-all duration-500`} style={{ width: c.percentage }}></div>
                                        </div>
                                        <p className="font-note text-xs text-gray-400 mt-0.5 text-right">{c.percentage}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                <div className="flex justify-between font-handwriting text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>$9,300</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Expense Categories */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 right-8 bg-orange-100/70 rotate-[3deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Expense Breakdown</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {expenses.map((e, i) => (
                                    <div key={i} className="bg-white/60 rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:bg-white/80 transition-colors">
                                        <div className={`${e.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-[20px]">{e.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-handwriting text-lg text-gray-800">{e.category}</p>
                                        </div>
                                        <span className="font-handwriting text-xl font-bold text-red-600">{e.amount}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center">
                                <span className="font-handwriting text-lg font-bold text-gray-700">Total Expenses</span>
                                <span className="font-handwriting text-2xl font-bold text-red-600">$995</span>
                            </div>
                        </div>

                        {/* Net Profit Sticky + Tip */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-green-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600">emoji_events</span>
                                    Net Profit
                                </h4>
                                <p className="font-handwriting text-4xl font-bold text-green-700 text-center my-2">${netProfit.toLocaleString()}</p>
                                <p className="font-note text-sm text-gray-600 text-center">After all expenses deducted</p>
                                <div className="mt-3 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-green-500" style={{ width: '89%' }}></div>
                                </div>
                                <p className="font-note text-xs text-gray-500 text-center mt-1">89% profit margin</p>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-600">lightbulb</span>
                                    Insight
                                </h4>
                                <p className="font-note text-sm text-gray-600 leading-relaxed">
                                    Your income has been steadily growing. Acme Studios is your largest client at 38% of revenue. Consider diversifying to reduce dependency on a single client.
                                </p>
                            </div>

                            <div className="bg-green-50 p-5 rounded-xl shadow-notebook rotate-[1deg] border border-green-100">
                                <h4 className="font-handwriting text-lg font-bold text-green-800 mb-2">Yearly Progress</h4>
                                <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                    <span>$44,200 / $96,000</span>
                                    <span>46%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-green-500" style={{ width: '46%' }}></div>
                                </div>
                                <p className="font-note text-xs text-gray-400 mt-2">On track for annual goal</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
