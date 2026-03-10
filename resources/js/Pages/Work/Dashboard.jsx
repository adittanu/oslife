import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

export default function Dashboard({ stats }) {
    const summaryCards = [
        { label: 'Active Projects', value: stats?.activeProjects || '0', icon: 'folder_open', bg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-blue-100' },
        { label: 'Pending Invoices', value: stats?.pendingInvoices || '0', icon: 'receipt_long', bg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-amber-100' },
        { label: 'Hours This Week', value: stats?.hoursThisWeek || '0', icon: 'schedule', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'border-emerald-100' },
        { label: 'Revenue This Month', value: formatCurrency(stats?.incomeThisMonth), icon: 'payments', bg: 'bg-purple-50', iconColor: 'text-purple-500', border: 'border-purple-100' },
    ];

    return (
        <JournalLayout pageTitle="Work OS - Dashboard" headerTitle="Freelancer Dashboard" headerSubtitle="Your work at a glance" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">dashboard</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]"><span className="material-symbols-outlined text-[80px] text-primary">work</span></div>
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryCards.map((card, i) => (
                            <div key={i} className={`${card.bg} rounded-2xl shadow-notebook border ${card.border} p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">{card.icon}</span></div>
                                <p className="font-note text-sm text-gray-500">{card.label}</p>
                                <p className="font-handwriting text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                                <div className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center mt-2`}><span className={`material-symbols-outlined text-lg ${card.iconColor}`}>{card.icon}</span></div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5 flex items-center gap-2"><span className="material-symbols-outlined text-blue-400">history</span>Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="material-symbols-outlined text-lg">folder_open</span></div>
                                    <div className="flex-1 min-w-0"><p className="font-note text-sm text-gray-700">{stats?.totalClients || 0} total clients</p><p className="font-note text-xs text-gray-400">All time</p></div>
                                </div>
                                <div className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="material-symbols-outlined text-lg">warning</span></div>
                                    <div className="flex-1 min-w-0"><p className="font-note text-sm text-gray-700">{stats?.overdueInvoices || 0} overdue invoices</p><p className="font-note text-xs text-gray-400">Action needed</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 flex flex-col gap-5">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">event</span>Quick Stats</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between"><span className="font-note text-sm text-gray-600">Active Projects</span><span className="font-handwriting font-bold">{stats?.activeProjects || 0}</span></div>
                                    <div className="flex justify-between"><span className="font-note text-sm text-gray-600">Pending Invoices</span><span className="font-handwriting font-bold">{stats?.pendingInvoices || 0}</span></div>
                                    <div className="flex justify-between"><span className="font-note text-sm text-gray-600">Hours This Week</span><span className="font-handwriting font-bold">{stats?.hoursThisWeek || 0}h</span></div>
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-emerald-100">
                                <h4 className="font-handwriting text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-emerald-600">trending_up</span>This Month</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-note text-sm text-gray-600"><span>Income</span><span className="font-bold text-emerald-700">{formatCurrency(stats?.incomeThisMonth)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">"The secret of getting ahead is getting started."</p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">- Mark Twain</p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}