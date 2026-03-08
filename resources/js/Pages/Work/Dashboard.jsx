import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Dashboard() {
    const summaryCards = [
        { label: 'Active Projects', value: '5', icon: 'folder_open', bg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-blue-100' },
        { label: 'Pending Invoices', value: '3', icon: 'receipt_long', bg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-amber-100' },
        { label: 'Hours This Week', value: '32.5', icon: 'schedule', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'border-emerald-100' },
        { label: 'Revenue This Month', value: '$4,250', icon: 'payments', bg: 'bg-purple-50', iconColor: 'text-purple-500', border: 'border-purple-100' },
    ];

    const recentActivity = [
        { text: 'Invoice #1042 sent to Acme Corp', time: '2 hours ago', icon: 'send', color: 'bg-blue-100 text-blue-600' },
        { text: 'Completed milestone: Landing Page Design', time: '5 hours ago', icon: 'check_circle', color: 'bg-green-100 text-green-600' },
        { text: 'New comment from Sarah on Brand Refresh', time: 'Yesterday', icon: 'chat_bubble', color: 'bg-pink-100 text-pink-600' },
        { text: 'Time logged: 3.5h on Mobile App UI', time: 'Yesterday', icon: 'timer', color: 'bg-amber-100 text-amber-600' },
        { text: 'New project inquiry from TechStart Inc', time: '2 days ago', icon: 'mail', color: 'bg-purple-100 text-purple-600' },
    ];

    const upcomingDeadlines = [
        { project: 'E-commerce Redesign', client: 'ShopWell', date: 'Mar 15', daysLeft: 6, urgency: 'text-red-600 bg-red-50 border-red-200' },
        { project: 'Brand Identity Package', client: 'GreenLeaf Co', date: 'Mar 22', daysLeft: 13, urgency: 'text-amber-600 bg-amber-50 border-amber-200' },
        { project: 'Mobile App Prototype', client: 'FitTrack', date: 'Apr 1', daysLeft: 23, urgency: 'text-green-600 bg-green-50 border-green-200' },
        { project: 'Marketing Website', client: 'Acme Corp', date: 'Apr 10', daysLeft: 32, urgency: 'text-blue-600 bg-blue-50 border-blue-200' },
    ];

    return (
        <JournalLayout
            pageTitle="Work OS - Dashboard"
            headerTitle="Freelancer Dashboard"
            headerSubtitle="Your work at a glance"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">dashboard</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Decorative element */}
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">work</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryCards.map((card, i) => (
                            <div key={i} className={`${card.bg} rounded-2xl shadow-notebook border ${card.border} p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10">
                                    <span className="material-symbols-outlined text-[48px] text-gray-800">{card.icon}</span>
                                </div>
                                <p className="font-note text-sm text-gray-500">{card.label}</p>
                                <p className="font-handwriting text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                                <div className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center mt-2`}>
                                    <span className={`material-symbols-outlined text-lg ${card.iconColor}`}>{card.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">history</span>
                                Recent Activity
                            </h3>

                            <div className="space-y-3">
                                {recentActivity.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100 hover:bg-white/80 transition-colors">
                                        <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-note text-sm text-gray-700 leading-relaxed">{item.text}</p>
                                            <p className="font-note text-xs text-gray-400 mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Deadlines - Sticky Note Style */}
                        <div className="lg:col-span-1 flex flex-col gap-5">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">event</span>
                                    Upcoming Deadlines
                                </h4>
                                <div className="space-y-3">
                                    {upcomingDeadlines.map((d, i) => (
                                        <div key={i} className={`${d.urgency} border rounded-lg p-3`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-handwriting text-base font-bold">{d.project}</p>
                                                    <p className="font-note text-xs opacity-70">{d.client}</p>
                                                </div>
                                                <span className="font-note text-xs font-bold whitespace-nowrap">{d.daysLeft}d left</span>
                                            </div>
                                            <p className="font-note text-xs mt-1 opacity-60">Due: {d.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stat Note */}
                            <div className="bg-emerald-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-emerald-100">
                                <h4 className="font-handwriting text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-600">trending_up</span>
                                    This Month
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-note text-sm text-gray-600">
                                        <span>Projects completed</span>
                                        <span className="font-bold text-emerald-700">3</span>
                                    </div>
                                    <div className="flex justify-between font-note text-sm text-gray-600">
                                        <span>Client satisfaction</span>
                                        <span className="font-bold text-emerald-700">98%</span>
                                    </div>
                                    <div className="flex justify-between font-note text-sm text-gray-600">
                                        <span>On-time delivery</span>
                                        <span className="font-bold text-emerald-700">100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                "The secret of getting ahead is getting started."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                - Mark Twain
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
