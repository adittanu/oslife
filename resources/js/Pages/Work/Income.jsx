import React, { useMemo } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Income({ invoices: propInvoices }) {
    const invoices = propInvoices || [];

    const summary = useMemo(() => {
        const thisMonth = new Date().toISOString().slice(0, 7);
        const thisMonthInvoices = invoices.filter(i => i.paid_date?.startsWith(thisMonth));
        const totalThisMonth = thisMonthInvoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        const total = invoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        return { thisMonth: totalThisMonth, total };
    }, [invoices]);

    // Group by client
    const byClient = useMemo(() => {
        const grouped = {};
        invoices.forEach(inv => {
            const name = inv.client?.name || 'Unknown';
            if (!grouped[name]) grouped[name] = 0;
            grouped[name] += parseFloat(inv.amount || 0);
        });
        return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
    }, [invoices]);

    if (!invoices.length) {
        return (
            <JournalLayout pageTitle="Work OS - Income" headerTitle="Income Tracker" headerSubtitle="Follow the money" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="account_balance_wallet" title="Belum ada income" description="Income akan muncul di sini setelah ada invoice yang lunas" />
                    </div>
                </div>
            </JournalLayout>
        );
    }

    const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400', 'bg-amber-400'];

    return (
        <JournalLayout pageTitle="Work OS - Income" headerTitle="Income Tracker" headerSubtitle="Follow the money" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">account_balance_wallet</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">trending_up</span></div>
                            <p className="font-note text-sm text-gray-500">This Month</p>
                            <p className="font-handwriting text-3xl font-bold text-green-700 mt-1">{formatCurrency(summary.thisMonth)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">payments</span></div>
                            <p className="font-note text-sm text-gray-500">Total Income</p>
                            <p className="font-handwriting text-3xl font-bold text-blue-700 mt-1">{formatCurrency(summary.total)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">receipt_long</span></div>
                            <p className="font-note text-sm text-gray-500">Total Invoices</p>
                            <p className="font-handwriting text-3xl font-bold text-purple-700 mt-1">{invoices.length}</p>
                        </div>
                        <div className="bg-amber-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">group</span></div>
                            <p className="font-note text-sm text-gray-500">Active Clients</p>
                            <p className="font-handwriting text-3xl font-bold text-amber-700 mt-1">{byClient.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                            <div className="washi-tape -top-2 left-10 bg-green-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Income by Client</h3>
                            <div className="space-y-3">
                                {byClient.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></div>
                                        <div className="flex-1"><p className="font-note text-sm text-gray-700">{c.name}</p></div>
                                        <div className="text-right"><p className="font-handwriting font-bold text-gray-800">{formatCurrency(c.amount)}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Recent Payments</h3>
                            <div className="space-y-3">
                                {invoices.slice(0, 5).map((inv, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-handwriting font-bold text-gray-800">{inv.invoice_number}</p>
                                            <p className="font-note text-xs text-gray-500">{inv.client?.name || '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-handwriting font-bold text-green-700">{formatCurrency(inv.amount)}</p>
                                            <p className="font-note text-xs text-gray-400">{formatDate(inv.paid_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}