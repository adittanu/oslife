import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function TimeTracking() {
    const weeklyHours = [
        { day: 'Mon', hours: 6.5, height: '81%' },
        { day: 'Tue', hours: 7.0, height: '88%' },
        { day: 'Wed', hours: 5.5, height: '69%' },
        { day: 'Thu', hours: 8.0, height: '100%' },
        { day: 'Fri', hours: 5.5, height: '69%' },
        { day: 'Sat', hours: 0, height: '0%' },
        { day: 'Sun', hours: 0, height: '0%' },
    ];

    const totalWeekHours = weeklyHours.reduce((sum, d) => sum + d.hours, 0);

    const timeEntries = [
        { project: 'E-commerce Redesign', task: 'Product page wireframes', duration: '2h 30m', date: 'Mar 9', color: 'bg-blue-100 text-blue-700' },
        { project: 'Brand Identity Package', task: 'Logo exploration v3', duration: '1h 45m', date: 'Mar 9', color: 'bg-emerald-100 text-emerald-700' },
        { project: 'E-commerce Redesign', task: 'Client feedback revisions', duration: '1h 15m', date: 'Mar 9', color: 'bg-blue-100 text-blue-700' },
        { project: 'Mobile App Prototype', task: 'Onboarding flow design', duration: '3h 00m', date: 'Mar 8', color: 'bg-purple-100 text-purple-700' },
        { project: 'Brand Identity Package', task: 'Color palette finalization', duration: '0h 45m', date: 'Mar 8', color: 'bg-emerald-100 text-emerald-700' },
        { project: 'E-commerce Redesign', task: 'Checkout flow prototype', duration: '2h 00m', date: 'Mar 7', color: 'bg-blue-100 text-blue-700' },
        { project: 'Mobile App Prototype', task: 'User research synthesis', duration: '1h 30m', date: 'Mar 7', color: 'bg-purple-100 text-purple-700' },
        { project: 'Marketing Website', task: 'Discovery call notes', duration: '0h 30m', date: 'Mar 7', color: 'bg-amber-100 text-amber-700' },
    ];

    const todayTotal = '5h 30m';
    const currentTimer = '01:23:45';
    const currentProject = 'E-commerce Redesign';
    const currentTask = 'Homepage hero section design';

    return (
        <JournalLayout
            pageTitle="Work OS - Time Tracking"
            headerTitle="Time Tracking"
            headerSubtitle="Track every minute"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">schedule</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Decorative element */}
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">hourglass_top</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Today's Timer Section */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-rose-100/80 rotate-1"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 mt-2">
                            {/* Timer Display */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-1 flex items-center justify-center md:justify-start gap-2">
                                    <span className="material-symbols-outlined text-rose-400">timer</span>
                                    Today's Timer
                                </h3>
                                <p className="font-note text-sm text-gray-400 mb-4">Currently tracking time</p>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 inline-block">
                                    <p className="font-handwriting text-6xl font-bold text-gray-800 tracking-wider">{currentTimer}</p>
                                    <div className="mt-3 space-y-1">
                                        <p className="font-note text-sm text-gray-600">
                                            <span className="font-bold text-primary">{currentProject}</span>
                                        </p>
                                        <p className="font-note text-xs text-gray-400">{currentTask}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Controls & Today Stats */}
                            <div className="flex flex-col items-center gap-5">
                                {/* Start/Stop Button */}
                                <button className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center shadow-lg transition-all active:scale-95 group">
                                    <span className="material-symbols-outlined text-3xl text-white">stop</span>
                                </button>
                                <p className="font-note text-xs text-gray-400">Click to stop timer</p>

                                {/* Today's total */}
                                <div className="bg-rose-50 border border-rose-100 rounded-xl px-6 py-3 text-center">
                                    <p className="font-note text-xs text-gray-500">Today's Total</p>
                                    <p className="font-handwriting text-2xl font-bold text-rose-700">{todayTotal}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Weekly Summary Chart */}
                        <div className="lg:col-span-2 relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">bar_chart</span>
                                Weekly Summary
                            </h3>

                            <div className="flex items-end gap-3 h-48 px-2">
                                {weeklyHours.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="font-note text-xs text-gray-500">{d.hours}h</span>
                                        <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                                            <div
                                                className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 ${d.hours > 0 ? 'bg-primary/70' : 'bg-gray-200/50'}`}
                                                style={{ height: d.height }}
                                            ></div>
                                        </div>
                                        <span className="font-note text-xs text-gray-600 font-bold">{d.day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-4">
                                <p className="font-note text-sm text-gray-400">
                                    Week total: <span className="font-bold text-primary">{totalWeekHours}h</span>
                                </p>
                            </div>
                        </div>

                        {/* Weekly Stats Sticky Notes */}
                        <div className="lg:col-span-1 flex flex-col gap-5">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">insights</span>
                                    Week at a Glance
                                </h4>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between">
                                        <span className="font-note text-sm text-gray-600">Total Hours</span>
                                        <span className="font-handwriting text-lg font-bold text-gray-800">{totalWeekHours}h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-note text-sm text-gray-600">Avg per Day</span>
                                        <span className="font-handwriting text-lg font-bold text-gray-800">{(totalWeekHours / 5).toFixed(1)}h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-note text-sm text-gray-600">Most Productive</span>
                                        <span className="font-handwriting text-lg font-bold text-gray-800">Thu</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-note text-sm text-gray-600">Billable Rate</span>
                                        <span className="font-handwriting text-lg font-bold text-emerald-700">92%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2">Weekly Goal</h4>
                                <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                    <span>40 hours</span>
                                    <span>{Math.round((totalWeekHours / 40) * 100)}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((totalWeekHours / 40) * 100, 100)}%` }}></div>
                                </div>
                                <p className="font-note text-xs text-gray-400 mt-2">{(40 - totalWeekHours).toFixed(1)}h remaining</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Time Entries */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                        <div className="washi-tape -top-2 left-20 bg-green-100/80 rotate-[-1deg]"></div>
                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div>
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700">Recent Entries</h3>
                                <p className="font-note text-sm text-gray-400">Your logged time this week</p>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span> Log Time
                            </button>
                        </div>

                        <div className="space-y-3">
                            {timeEntries.map((entry, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border border-gray-100 hover:bg-white/80 transition-colors">
                                    <div className="w-1.5 h-12 rounded-full bg-primary/40 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`${entry.color} text-xs font-bold px-2.5 py-0.5 rounded-full`}>{entry.project}</span>
                                        </div>
                                        <p className="font-note text-sm text-gray-600 mt-1 truncate">{entry.task}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-handwriting text-lg font-bold text-gray-800">{entry.duration}</p>
                                        <p className="font-note text-xs text-gray-400">{entry.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                "Time is what we want most, but what we use worst."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                - William Penn
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
