import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function IslamicCalendar() {
    const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

    const ramadanGrid = [
        [null, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
        [28, 29, 30, null, null, null, null],
    ];

    const importantDates = {
        1: { text: 'Awal Ramadan', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
        10: { text: 'Perjalanan Isra Mi\'raj', color: 'bg-blue-100', textColor: 'text-blue-700' },
        17: { text: 'Nuzulul Qur\'an', color: 'bg-amber-100', textColor: 'text-amber-700', highlight: true },
        21: { text: 'Lailatul Qadr (ganjil)', color: 'bg-purple-100', textColor: 'text-purple-700', lailatulQadr: true },
        23: { text: 'Lailatul Qadr (ganjil)', color: 'bg-purple-100', textColor: 'text-purple-700', lailatulQadr: true },
        25: { text: 'Lailatul Qadr (ganjil)', color: 'bg-purple-100', textColor: 'text-purple-700', lailatulQadr: true },
        27: { text: 'Lailatul Qadr (ganjil)', color: 'bg-purple-100', textColor: 'text-purple-700', lailatulQadr: true },
        29: { text: 'Lailatul Qadr (ganjil)', color: 'bg-purple-100', textColor: 'text-purple-700', lailatulQadr: true },
    };

    const today = 15;

    return (
        <JournalLayout
            pageTitle="Muslim OS - Islamic Calendar"
            headerTitle="Islamic Calendar"
            headerSubtitle="Hijriyah Calendar & Important Dates"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">calendar_month</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl">
                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="material-symbols-outlined">chevron_left</span>
                            <span className="font-note">Sya'ban</span>
                        </button>
                        <div className="text-center">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-800">Ramadan 1447 H</h3>
                            <p className="font-note text-gray-400 mt-1">Maret - April 2026 M</p>
                        </div>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="font-note">Syawwal</span>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Decorative crescent */}
                    <div className="absolute -top-2 right-20 z-20 opacity-60 rotate-12">
                        <span className="material-symbols-outlined text-5xl text-amber-400 drop-shadow-md">nights_stay</span>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 overflow-hidden mb-8">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-gray-200 bg-primary/5">
                            {days.map((day, i) => (
                                <div key={i} className={`px-2 py-3 text-center text-sm font-bold uppercase tracking-wider ${i === 5 ? 'text-primary' : 'text-gray-400'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        {ramadanGrid.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                {week.map((day, di) => {
                                    const event = day ? importantDates[day] : null;
                                    const isToday = day === today;
                                    return (
                                        <div
                                            key={di}
                                            className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 transition-colors relative ${
                                                day ? 'hover:bg-white/60 cursor-pointer' : 'bg-gray-50/30'
                                            } ${isToday ? 'bg-primary/5 ring-2 ring-inset ring-primary/20' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-handwriting text-lg ${isToday ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                            {day}
                                                        </span>
                                                        {isToday && (
                                                            <span className="font-note text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">Hari ini</span>
                                                        )}
                                                    </div>
                                                    {event && (
                                                        <div className={`${event.color} mt-1 px-2 py-1 rounded-lg`}>
                                                            <span className={`font-note text-xs ${event.textColor} truncate block`}>
                                                                {event.lailatulQadr && <span className="material-symbols-outlined text-xs align-middle mr-0.5">star</span>}
                                                                {event.text}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {event?.highlight && (
                                                        <div className="absolute top-1 right-1">
                                                            <span className="material-symbols-outlined text-amber-400 text-sm animate-pulse">auto_awesome</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Bottom section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Upcoming Events Sticky Note */}
                        <div className="bg-sticky-yellow p-6 shadow-sticky transform rotate-[-1deg]">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 blur-[2px] rotate-1"></div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-600">event_upcoming</span>
                                Agenda Mendatang
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm whitespace-nowrap">17 Ram</span>
                                    <div>
                                        <span className="font-note text-gray-700">Nuzulul Qur'an</span>
                                        <p className="font-note text-xs text-gray-400">Peringatan turunnya Al-Qur'an</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm whitespace-nowrap">21 Ram</span>
                                    <div>
                                        <span className="font-note text-gray-700">10 Malam Terakhir</span>
                                        <p className="font-note text-xs text-gray-400">I'tikaf di masjid</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm whitespace-nowrap">1 Syaw</span>
                                    <div>
                                        <span className="font-note text-gray-700">Idul Fitri 1447 H</span>
                                        <p className="font-note text-xs text-gray-400">Sholat Ied & silaturahmi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform rotate-[0.5deg]">
                            <h4 className="font-handwriting text-xl text-gray-700 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">palette</span>
                                Keterangan Warna
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-emerald-200 border border-emerald-300"></div>
                                    <span className="font-note text-sm text-gray-600">Awal/Akhir Bulan</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-amber-200 border border-amber-300"></div>
                                    <span className="font-note text-sm text-gray-600">Peristiwa Penting</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-purple-200 border border-purple-300"></div>
                                    <span className="font-note text-sm text-gray-600">Malam Lailatul Qadr</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-primary/30 border border-primary/40"></div>
                                    <span className="font-note text-sm text-gray-600">Hari Ini</span>
                                </div>
                            </div>
                        </div>

                        {/* Ramadan Checklist Sticky */}
                        <div className="bg-green-100 p-6 shadow-sticky transform rotate-[1deg] rounded-lg border border-green-200/50">
                            <h4 className="font-sketch text-xl text-green-800 mb-4 border-b border-green-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">task_alt</span>
                                Amaliyah Ramadan
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600 text-lg">check_box</span>
                                    <span className="font-handwriting text-gray-500 line-through">Bayar Zakat Fitrah</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-gray-800">Khatam Al-Qur'an</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-gray-800">I'tikaf 10 hari terakhir</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-gray-800">Sedekah setiap hari</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-300 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-gray-800">Tadarus bareng keluarga</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
