import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function HabitTracker() {
    const habits = [
        { name: 'Tahajud', icon: 'dark_mode', color: 'bg-indigo-100 text-indigo-600', checks: [true, true, false, true, true, false, true], streak: 5 },
        { name: 'Dhuha', icon: 'wb_sunny', color: 'bg-amber-100 text-amber-600', checks: [true, true, true, true, true, true, true], streak: 14 },
        { name: 'Puasa Sunnah', icon: 'restaurant', color: 'bg-emerald-100 text-emerald-600', checks: [false, true, false, true, false, false, false], streak: 2 },
        { name: 'Tilawah', icon: 'menu_book', color: 'bg-teal-100 text-teal-600', checks: [true, true, true, false, true, true, true], streak: 6 },
        { name: 'Sedekah', icon: 'favorite', color: 'bg-pink-100 text-pink-600', checks: [true, false, true, false, true, true, false], streak: 3 },
        { name: 'Istighfar 100x', icon: 'self_improvement', color: 'bg-purple-100 text-purple-600', checks: [true, true, true, true, true, true, false], streak: 8 },
        { name: 'Sholawat 100x', icon: 'volunteer_activism', color: 'bg-rose-100 text-rose-600', checks: [true, true, true, true, false, true, true], streak: 4 },
    ];

    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const dayDates = ['3', '4', '5', '6', '7', '8', '9'];

    const completionRates = habits.map(h => ({
        name: h.name.split(' ')[0],
        rate: Math.round((h.checks.filter(Boolean).length / h.checks.length) * 100),
    }));

    return (
        <JournalLayout
            pageTitle="Muslim OS - Habit Islami"
            headerTitle="Habit Islami"
            headerSubtitle="Consistency is key to Jannah"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">track_changes</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-15 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-purple-300">auto_awesome</span>
            </div>
            <div className="absolute top-40 right-20 opacity-15 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-emerald-300">mosque</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1600px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden xl:block z-10 shadow-notebook-spine"></div>

                    {/* Left — Habit Grid */}
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center xl:text-left xl:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Tracker Ibadah Mingguan</h3>
                                <div className="h-0.5 w-48 bg-purple-200 mx-auto xl:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative w-full flex-1 bg-white/70 p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                                <h4 className="font-display font-bold text-xl text-gray-800">Pekan Ini</h4>
                                <div className="flex gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-base">calendar_month</span>
                                    <span>3 - 9 Maret 2026</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto flex-1 custom-scrollbar">
                                <table className="w-full min-w-[700px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-display font-semibold text-gray-500 pb-4 w-44 text-base">Amalan</th>
                                            {dayNames.map((day, i) => (
                                                <th key={i} className="text-center pb-4 w-16">
                                                    <span className="font-display font-bold text-gray-400 text-sm block">{day}</span>
                                                    <span className="font-note text-xs text-gray-300">{dayDates[i]}</span>
                                                </th>
                                            ))}
                                            <th className="text-center font-display font-semibold text-gray-500 pb-4 w-20 text-sm">Streak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {habits.map((habit, hi) => (
                                            <tr key={hi} className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl ${habit.color} flex items-center justify-center shadow-sm`}>
                                                            <span className="material-symbols-outlined text-lg">{habit.icon}</span>
                                                        </div>
                                                        <span className="font-display font-bold text-gray-700 text-base tracking-wide">{habit.name}</span>
                                                    </div>
                                                </td>
                                                {habit.checks.map((checked, ci) => (
                                                    <td key={ci} className="text-center py-4 px-1">
                                                        <div className="tracker-cell flex justify-center">
                                                            <input defaultChecked={checked} id={`h${hi}d${ci}`} type="checkbox" />
                                                            <label htmlFor={`h${hi}d${ci}`}></label>
                                                        </div>
                                                    </td>
                                                ))}
                                                <td className="text-center py-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined text-orange-400 text-base">local_fire_department</span>
                                                        <span className="font-handwriting text-lg font-bold text-gray-700">{habit.streak}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t-2 border-gray-100 pt-4">
                                <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-xl transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">add</span> Tambah Amalan
                                </button>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">Tampilan 7 hari</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Insights & Motivation */}
                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>

                        {/* Streak Badge */}
                        <div className="absolute top-12 right-6 xl:right-8 z-20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-400 rounded-full flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(251,146,60,0.5)] rotate-12 border-[3px] border-orange-200 text-white font-black">
                                <span className="material-symbols-outlined text-2xl md:text-3xl mb-0.5">local_fire_department</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-center leading-tight">Best<br/>Streak</span>
                                <span className="text-base md:text-lg">14d</span>
                            </div>
                        </div>

                        <div className="mb-6 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-2 mt-4 xl:mt-0">Insight Ibadah</h3>
                        </div>

                        {/* Completion Rates */}
                        <div className="bg-white/60 p-5 rounded-xl shadow-sm border border-gray-100 mb-6 backdrop-blur-sm relative mt-8 md:mt-14">
                            <div className="washi-tape -top-3 -left-4 bg-yellow-200/60 rotate-[-5deg] w-20"></div>
                            <h4 className="font-handwriting text-xl text-gray-600 mb-4 text-center">Tingkat Konsistensi</h4>
                            <div className="space-y-3">
                                {completionRates.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                            <span>{item.name}</span>
                                            <span className="font-bold">{item.rate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-full rounded-full ${item.rate >= 80 ? 'bg-emerald-400' : item.rate >= 50 ? 'bg-amber-400' : 'bg-red-300'}`}
                                                style={{ width: `${item.rate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motivational sticky */}
                        <div className="bg-yellow-100 p-5 shadow-sticky rotate-[-1deg] relative z-10 border border-yellow-200 mb-6">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-3deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <p className="font-handwriting text-lg text-gray-800 leading-relaxed text-center italic">
                                "Amalan yang paling dicintai Allah adalah yang paling konsisten, meskipun sedikit."
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-2">— HR. Bukhari & Muslim</p>
                        </div>

                        {/* Reflection area */}
                        <div className="mb-4 flex flex-col items-center">
                            <h3 className="font-handwriting text-xl font-bold text-gray-700">Refleksi Pekan Ini</h3>
                        </div>
                        <div className="relative w-full flex-1 min-h-[120px] bg-transparent p-3 transform group transition-transform">
                            <textarea
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-lg text-gray-800 leading-[2rem] focus:ring-0 custom-scrollbar"
                                placeholder="Bagaimana perjalanan ibadah pekan ini? Apa yang perlu ditingkatkan..."
                            ></textarea>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none rotate-12">
                            <svg height="80" viewBox="0 0 100 100" width="80">
                                <polygon fill="#FCD34D" points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
