import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function SholatTracker() {
    const prayers = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ahad'];

    // 0 = missed, 1 = done alone, 2 = done in jamaah
    const weeklyData = [
        [2, 2, 1, 2, 2, 2, 0], // Subuh
        [2, 1, 2, 2, 2, 1, 2], // Dzuhur
        [1, 2, 2, 1, 2, 2, 2], // Ashar
        [2, 2, 2, 2, 2, 2, 2], // Maghrib
        [2, 2, 1, 2, 0, 2, 0], // Isya
    ];

    const sunnahPrayers = [
        { name: 'Tahajud', icon: 'dark_mode', days: [true, false, true, false, true, true, true], color: 'bg-indigo-100', iconColor: 'text-indigo-500' },
        { name: 'Dhuha', icon: 'wb_sunny', days: [true, true, false, true, true, false, true], color: 'bg-amber-100', iconColor: 'text-amber-500' },
        { name: 'Rawatib Qabliyah', icon: 'arrow_back', days: [true, true, true, true, true, true, true], color: 'bg-teal-100', iconColor: 'text-teal-500' },
        { name: 'Rawatib Ba\'diyah', icon: 'arrow_forward', days: [true, true, true, false, true, true, true], color: 'bg-rose-100', iconColor: 'text-rose-500' },
    ];

    const getStatusIcon = (status) => {
        if (status === 2) return { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-50' };
        if (status === 1) return { icon: 'check', color: 'text-yellow-500', bg: 'bg-yellow-50' };
        return { icon: 'close', color: 'text-red-300', bg: 'bg-red-50/50' };
    };

    const totalPrayers = weeklyData.flat().length;
    const completedPrayers = weeklyData.flat().filter(s => s > 0).length;
    const jamaahPrayers = weeklyData.flat().filter(s => s === 2).length;

    return (
        <JournalLayout
            pageTitle="Muslim OS - Sholat Tracker"
            headerTitle="Sholat Tracker"
            headerSubtitle="Menjaga sholat 5 waktu dengan istiqamah"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">mosque</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1600px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden xl:block z-10 shadow-notebook-spine"></div>

                    {/* LEFT PAGE - Weekly Sholat Grid */}
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>

                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center xl:text-left xl:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Sholat Wajib Mingguan</h3>
                                <p className="font-note text-gray-400 mt-1">Pekan ke-3, Ramadan 1447 H</p>
                                <div className="h-0.5 w-48 bg-primary/30 mx-auto xl:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        {/* Tracking Grid */}
                        <div className="relative w-full flex-1 bg-white/70 p-4 md:p-8 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm flex flex-col">
                            <div className="overflow-x-auto flex-1 custom-scrollbar">
                                <table className="w-full min-w-[600px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-display font-semibold text-gray-500 pb-4 w-32 text-base">Sholat</th>
                                            {daysOfWeek.map((day, i) => (
                                                <th key={i} className={`text-center font-display font-bold text-base pb-4 w-20 ${i === 4 ? 'text-primary' : 'text-gray-400'}`}>{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prayers.map((prayer, pi) => (
                                            <tr key={pi} className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                                            <span className="material-symbols-outlined text-lg">mosque</span>
                                                        </div>
                                                        <span className="font-display font-bold text-gray-700 text-base tracking-wide">{prayer}</span>
                                                    </div>
                                                </td>
                                                {weeklyData[pi].map((status, di) => {
                                                    const s = getStatusIcon(status);
                                                    return (
                                                        <td key={di} className="text-center py-5 px-1">
                                                            <div className={`w-10 h-10 mx-auto rounded-xl ${s.bg} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}>
                                                                <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex items-center justify-center gap-6 border-t-2 border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                    <span className="font-note text-sm text-gray-500">Berjamaah</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-lg">check</span>
                                    <span className="font-note text-sm text-gray-500">Munfarid</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-300 text-lg">close</span>
                                    <span className="font-note text-sm text-gray-500">Terlewat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-amber-100/70 rotate-[3deg]"></div>

                        {/* Prayer Streak */}
                        <div className="mb-8 flex flex-col items-center mt-4 xl:mt-0">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-4">Statistik & Streak</h3>
                        </div>

                        {/* Streak Badge */}
                        <div className="absolute top-12 right-6 xl:right-8 z-20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex flex-col items-center justify-center shadow-lg rotate-12 border-[3px] border-primary/50 text-white font-black">
                                <span className="material-symbols-outlined text-2xl md:text-3xl mb-0.5">local_fire_department</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-center leading-tight">Streak</span>
                                <span className="text-base md:text-lg">12 Hari</span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-gray-100 mb-6 backdrop-blur-sm mt-8 md:mt-16">
                            <div className="washi-tape -top-3 -left-4 bg-green-200/60 rotate-[-5deg] w-20"></div>
                            <h4 className="font-handwriting text-xl text-gray-600 mb-4 text-center">Ringkasan Pekan Ini</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                                    <span className="font-handwriting text-3xl font-bold text-green-600">{completedPrayers}</span>
                                    <span className="font-handwriting text-xl text-green-600">/{totalPrayers}</span>
                                    <p className="font-note text-xs text-green-500 mt-1">Sholat Selesai</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="font-handwriting text-3xl font-bold text-blue-600">{jamaahPrayers}</span>
                                    <p className="font-note text-xs text-blue-500 mt-1">Berjamaah</p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2">
                                    <span className="font-handwriting text-2xl font-bold text-amber-600">{Math.round((completedPrayers / totalPrayers) * 100)}%</span>
                                    <p className="font-note text-xs text-amber-500 mt-1">Tingkat Kepatuhan</p>
                                    <div className="w-full h-2 bg-amber-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.round((completedPrayers / totalPrayers) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sunnah Prayers */}
                        <div className="mb-6">
                            <h4 className="font-handwriting text-2xl text-gray-700 mb-3 text-center flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                                Sholat Sunnah
                            </h4>
                            <div className="space-y-3">
                                {sunnahPrayers.map((sunnah, i) => (
                                    <div key={i} className={`${sunnah.color} p-3 rounded-xl border border-gray-100 shadow-sm transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`material-symbols-outlined ${sunnah.iconColor}`}>{sunnah.icon}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-700">{sunnah.name}</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {sunnah.days.map((done, di) => (
                                                <div key={di} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${done ? 'bg-white/80 border border-green-200' : 'bg-white/40 border border-gray-200'}`}>
                                                    {done ? (
                                                        <span className="material-symbols-outlined text-green-500 text-sm">check</span>
                                                    ) : (
                                                        <span className="font-note text-[10px] text-gray-400">{daysOfWeek[di][0]}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motivational Sticky */}
                        <div className="bg-sticky-yellow p-4 shadow-sticky transform rotate-[1deg] mt-auto">
                            <p className="font-handwriting text-lg text-gray-700 text-center leading-relaxed" dir="rtl">
                                إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2 italic">
                                "Sesungguhnya sholat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman." (QS. An-Nisa: 103)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
