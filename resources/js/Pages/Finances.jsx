import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Finances() {
    return (
        <JournalLayout 
            pageTitle="Life OS Finance Tracker Page"
            headerTitle="Finances"
            headerSubtitle="Tracking my pennies & pounds."
            titleFontClass="font-elegant"
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
                                <h3 className="font-elegant text-4xl font-bold text-gray-700 mt-2">Monthly Budget &amp; Spending</h3>
                                <div className="h-0.5 w-48 bg-blue-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-6 mt-8 relative z-10">
                            <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300">
                                <h4 className="font-handwriting text-2xl text-gray-800 font-bold mb-4">Spending by Category</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between font-note text-lg text-gray-600 mb-1">
                                            <span>Food</span>
                                            <span>$450 / $500</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
                                            <div className="bg-orange-300 h-full rounded-full" style={{ width: '90%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between font-note text-lg text-gray-600 mb-1">
                                            <span>Bills</span>
                                            <span>$1200 / $1200</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
                                            <div className="bg-red-300 h-full rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between font-note text-lg text-gray-600 mb-1">
                                            <span>Fun</span>
                                            <span>$150 / $300</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
                                            <div className="bg-green-300 h-full rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300 mt-8 relative">
                                <div className="absolute -right-4 -top-6 rotate-12">
                                    <span className="material-symbols-outlined text-[40px] text-yellow-500">monetization_on</span>
                                </div>
                                <h4 className="font-handwriting text-2xl text-gray-800 font-bold mb-4">Savings Goal: Vacation</h4>
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-40 border-4 border-gray-400 rounded-b-3xl rounded-t-xl overflow-hidden bg-blue-50/50">
                                        <div className="absolute bottom-0 left-0 right-0 bg-yellow-200/80 border-t-2 border-yellow-400 flex items-center justify-center" style={{ height: '60%' }}>
                                            <span className="font-note text-xl font-bold text-yellow-700">60%</span>
                                        </div>
                                        <div className="absolute top-0 w-full h-6 border-b-4 border-gray-400 bg-white/50"></div>
                                    </div>
                                </div>
                                <p className="text-center font-note text-lg text-gray-600 mt-4">$1,200 / $2,000 Saved</p>
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
                            <h3 className="font-elegant text-4xl font-bold text-gray-700">Transaction Log</h3>
                        </div>
                        
                        <div className="relative w-full flex-1 z-10 mt-4">
                            <table className="w-full text-left font-note text-xl text-gray-700">
                                <thead>
                                    <tr className="border-b-2 border-gray-400 text-gray-500">
                                        <th className="py-2 w-24">Date</th>
                                        <th className="py-2">Description</th>
                                        <th className="py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 text-gray-500">Oct 24</td>
                                        <td className="py-3">Grocery Store <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">Expense</span></td>
                                        <td className="py-3 text-right text-red-600">-$85.40</td>
                                    </tr>
                                    <tr className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 text-gray-500">Oct 22</td>
                                        <td className="py-3">Client Payment <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">Income</span></td>
                                        <td className="py-3 text-right text-green-600">+$450.00</td>
                                    </tr>
                                    <tr className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 text-gray-500">Oct 20</td>
                                        <td className="py-3">Electric Bill <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">Expense</span></td>
                                        <td className="py-3 text-right text-red-600">-$112.00</td>
                                    </tr>
                                    <tr className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 text-gray-500">Oct 18</td>
                                        <td className="py-3">Coffee Shop <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">Expense</span></td>
                                        <td className="py-3 text-right text-red-600">-$4.50</td>
                                    </tr>
                                    <tr className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 text-gray-500">Oct 15</td>
                                        <td className="py-3">Salary <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">Income</span></td>
                                        <td className="py-3 text-right text-green-600">+$2100.00</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-8 flex justify-center">
                                <button className="font-note text-lg text-primary flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-[20px]">add_circle</span> Add Transaction
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
