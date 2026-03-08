import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Invoices() {
    const summary = [
        { label: 'Total Outstanding', value: '$4,250.00', icon: 'pending_actions', bg: 'bg-yellow-50', color: 'text-yellow-700' },
        { label: 'Paid This Month', value: '$8,750.00', icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-700' },
        { label: 'Overdue', value: '2', icon: 'warning', bg: 'bg-red-50', color: 'text-red-700' },
        { label: 'Total Invoices', value: '6', icon: 'receipt_long', bg: 'bg-blue-50', color: 'text-blue-700' },
    ];

    const invoices = [
        { number: 'INV-001', client: 'Acme Studios', amount: '$3,500.00', date: 'Mar 1, 2026', status: 'Paid' },
        { number: 'INV-002', client: 'Bright Ideas Co.', amount: '$2,250.00', date: 'Mar 3, 2026', status: 'Pending' },
        { number: 'INV-003', client: 'Pixel Perfect LLC', amount: '$1,800.00', date: 'Feb 15, 2026', status: 'Overdue' },
        { number: 'INV-004', client: 'Nova Digital', amount: '$5,250.00', date: 'Mar 5, 2026', status: 'Paid' },
        { number: 'INV-005', client: 'Sunset Agency', amount: '$2,000.00', date: 'Feb 20, 2026', status: 'Overdue' },
        { number: 'INV-006', client: 'Acme Studios', amount: '$2,450.00', date: 'Mar 8, 2026', status: 'Pending' },
    ];

    const statusStyle = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return '';
        }
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'Paid': return 'check_circle';
            case 'Pending': return 'schedule';
            case 'Overdue': return 'error';
            default: return '';
        }
    };

    return (
        <JournalLayout
            pageTitle="Work OS - Invoices"
            headerTitle="Invoices"
            headerSubtitle="Track payments & billing"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">receipt_long</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {summary.map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10">
                                    <span className="material-symbols-outlined text-[48px] text-gray-800">{s.icon}</span>
                                </div>
                                <p className="font-note text-sm text-gray-500">{s.label}</p>
                                <p className={`font-handwriting text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Create Invoice Button & Invoice List */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-center mt-2 mb-6">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Invoice Log</h3>
                            <button className="flex items-center gap-2 bg-primary/90 text-white font-note text-sm px-4 py-2 rounded-xl shadow hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Create Invoice
                            </button>
                        </div>

                        {/* Invoice Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-note text-gray-700">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 text-gray-500 text-sm">
                                        <th className="py-3 px-2">Invoice #</th>
                                        <th className="py-3 px-2">Client</th>
                                        <th className="py-3 px-2">Amount</th>
                                        <th className="py-3 px-2">Date</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv, i) => (
                                        <tr key={i} className="border-b border-gray-100 hover:bg-white/60 transition-colors">
                                            <td className="py-4 px-2">
                                                <span className="font-handwriting text-lg font-bold text-primary">{inv.number}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="font-handwriting text-lg text-gray-800">{inv.client}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="font-handwriting text-lg font-bold text-gray-800">{inv.amount}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="font-note text-sm text-gray-500">{inv.date}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(inv.status)}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{statusIcon(inv.status)}</span>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <button className="text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-primary transition-colors ml-2">
                                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Notes Sticky */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[1deg] relative">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">tips_and_updates</span>
                                Reminder
                            </h4>
                            <p className="font-note text-sm text-gray-600 leading-relaxed">
                                Follow up with Pixel Perfect LLC and Sunset Agency on overdue invoices. Consider adding late fees after 30 days.
                            </p>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                            <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">trending_up</span>
                                This Month
                            </h4>
                            <p className="font-note text-sm text-gray-600">6 invoices sent</p>
                            <p className="font-note text-sm text-gray-600">2 paid, 2 pending, 2 overdue</p>
                            <p className="font-note text-sm text-green-600 font-bold mt-2">Collection rate: 67%</p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl shadow-notebook rotate-[2deg] border border-green-100">
                            <h4 className="font-handwriting text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">account_balance</span>
                                Payment Methods
                            </h4>
                            <div className="space-y-1 font-note text-sm text-gray-600">
                                <p>Bank Transfer - 60%</p>
                                <p>PayPal - 25%</p>
                                <p>Stripe - 15%</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
