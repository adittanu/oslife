import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function DailySpread() {
    const sholatSchedule = [
        { name: 'Subuh', time: '04:32', icon: 'dark_mode', done: true, color: 'bg-indigo-100', borderColor: 'border-indigo-200' },
        { name: 'Dzuhur', time: '11:55', icon: 'light_mode', done: true, color: 'bg-yellow-100', borderColor: 'border-yellow-200' },
        { name: 'Ashar', time: '15:12', icon: 'partly_cloudy_day', done: false, color: 'bg-orange-100', borderColor: 'border-orange-200' },
        { name: 'Maghrib', time: '17:48', icon: 'wb_twilight', done: false, color: 'bg-rose-100', borderColor: 'border-rose-200' },
        { name: 'Isya', time: '19:02', icon: 'nights_stay', done: false, color: 'bg-purple-100', borderColor: 'border-purple-200' },
    ];

    const dzikirChecklist = [
        { text: 'Istighfar 100x', done: true },
        { text: 'Subhanallah 33x', done: true },
        { text: 'Alhamdulillah 33x', done: true },
        { text: 'Allahu Akbar 33x', done: false },
        { text: 'Sholawat Nabi 100x', done: false },
        { text: 'La ilaha illallah 100x', done: false },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Daily Spread"
            headerTitle="Daily Spread"
            headerSubtitle="Senin, 15 Ramadan 1447 H"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">mosque</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Decorative elements */}
                    <div className="absolute -top-5 -right-5 rotate-12 z-20 drop-shadow-md">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 border-dashed">
                            <span className="material-symbols-outlined text-3xl text-green-600">nights_stay</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-10 -rotate-6 z-20">
                        <span className="w-32 h-8 bg-emerald-200/80 block transform skew-x-12 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}></span>
                    </div>

                    {/* LEFT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-emerald-200/50"></div>

                        {/* Sholat Schedule */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-3xl text-primary">mosque</span>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Jadwal Sholat</h3>
                            </div>

                            <div className="space-y-3">
                                {sholatSchedule.map((sholat, i) => (
                                    <div
                                        key={i}
                                        className={`${sholat.color} border ${sholat.borderColor} p-3 rounded-xl flex items-center justify-between transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'} hover:rotate-0 transition-transform shadow-sm`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-2xl text-gray-600">{sholat.icon}</span>
                                            <div>
                                                <span className="font-handwriting text-xl font-bold text-gray-800">{sholat.name}</span>
                                                <span className="font-note text-sm text-gray-500 ml-3">{sholat.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {sholat.done ? (
                                                <span className="material-symbols-outlined text-2xl text-green-600">check_circle</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-2xl text-gray-300">radio_button_unchecked</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Dzikir Checklist */}
                        <div className="bg-sticky-yellow p-5 shadow-sticky relative transform rotate-[-1deg]">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 blur-[2px] rotate-1"></div>
                            <h4 className="font-sketch text-xl text-primary mb-3 border-b border-primary/20 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">checklist</span>
                                Dzikir Harian
                            </h4>
                            <ul className="space-y-2">
                                {dzikirChecklist.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-lg ${item.done ? 'text-green-600' : 'text-gray-300'}`}>
                                            {item.done ? 'check_box' : 'check_box_outline_blank'}
                                        </span>
                                        <span className={`font-handwriting text-lg ${item.done ? 'text-gray-500 line-through decoration-wavy decoration-green-300' : 'text-gray-800'}`}>
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 text-right">
                                <span className="font-note text-sm text-gray-500">3/6 selesai</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-teal-200/50 rotate-[2deg]"></div>

                        {/* Quran Reading Target */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                                Target Bacaan Al-Qur'an
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-note text-gray-500">Juz</span>
                                        <span className="font-handwriting text-2xl font-bold text-primary">Juz 15</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-note text-gray-500">Surah</span>
                                        <span className="font-handwriting text-xl text-gray-800">Al-Isra' (17)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-note text-gray-500">Ayat</span>
                                        <span className="font-handwriting text-xl text-gray-800">1 - 50</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-note text-gray-400">Progress hari ini</span>
                                            <span className="font-handwriting text-primary font-bold">60%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="font-note text-sm text-green-700 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                                        Target Ramadan: Khatam 1x dalam 30 hari
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Muhasabah / Reflection */}
                        <div className="mb-6">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">self_improvement</span>
                                Muhasabah
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 paper-lines min-h-[220px] relative rounded-lg">
                                <p className="font-handwriting text-xl text-gray-600 leading-[2rem]">
                                    Hari ini Alhamdulillah bisa bangun sebelum Subuh dan sholat berjamaah di masjid. Perlu lebih menjaga lisan saat bekerja.
                                    <br /><br />
                                    <span className="text-primary font-bold">#Syukur:</span> Diberi kesehatan dan rezeki yang cukup untuk berbuka puasa bersama keluarga.
                                    <br /><br />
                                    <span className="text-rose-500 font-bold">#Perbaikan:</span> Lebih sabar menghadapi kemacetan, jangan mudah mengeluh.
                                </p>
                                <div className="absolute bottom-3 right-3 opacity-30 rotate-[-10deg]">
                                    <span className="material-symbols-outlined text-5xl text-primary">favorite</span>
                                </div>
                            </div>
                        </div>

                        {/* Dua of the day sticky */}
                        <div className="bg-green-100 p-4 shadow-sticky transform rotate-[1deg] rounded-lg border border-green-200/50">
                            <h4 className="font-sketch text-lg text-green-800 mb-2">Do'a Hari Ini</h4>
                            <p className="font-handwriting text-lg text-gray-700 text-right leading-relaxed" dir="rtl">
                                رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                            </p>
                            <p className="font-note text-sm text-green-700 mt-2 italic">
                                "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
