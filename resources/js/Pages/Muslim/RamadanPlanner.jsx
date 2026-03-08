import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function RamadanPlanner() {
    const specialNights = [21, 23, 25, 27, 29];

    const days = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const isSpecial = specialNights.includes(day);
        return {
            day,
            isSpecial,
            sahur: day <= 15 ? true : day <= 20 ? Math.random() > 0.3 : false,
            tarawih: day <= 12 ? true : day <= 18 ? Math.random() > 0.2 : false,
            tadarus: day <= 10 ? Math.ceil(Math.random() * 3) : day <= 18 ? Math.ceil(Math.random() * 2) : 0,
            sedekah: day <= 15 ? Math.random() > 0.4 : false,
        };
    });

    const iftarMenu = [
        { day: 'Hari 1-5', menu: 'Kolak pisang, kurma, es buah' },
        { day: 'Hari 6-10', menu: 'Es cendol, gorengan, bubur sumsum' },
        { day: 'Hari 11-15', menu: 'Tajil masjid, kurma ajwa, jus alpukat' },
        { day: 'Hari 16-20', menu: 'Sop buah, roti maryam, teh hangat' },
        { day: 'Hari 21-25', menu: 'Bubur kacang hijau, kurma, air zam-zam' },
        { day: 'Hari 26-30', menu: 'Ketupat mini, opor, es kelapa muda' },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Ramadan Planner"
            headerTitle="Ramadan Planner"
            headerSubtitle="The month of blessing"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">nights_stay</span>}
        >
            <div className="absolute bottom-16 left-[30%] opacity-15 pointer-events-none rotate-[15deg]">
                <span className="material-symbols-outlined text-[60px] text-indigo-300">auto_awesome</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1400px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>
                    <div className="absolute left-2/3 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden xl:block z-10"></div>

                    {/* Left — 30-day Grid */}
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-indigo-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-4 z-10 relative">
                            <div className="w-full text-center xl:text-left xl:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Checklist Ramadan 1447H</h3>
                                <div className="h-0.5 w-48 bg-indigo-200 mx-auto xl:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-4 z-10 relative text-sm font-note text-gray-500 pl-4">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Sahur</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block"></span> Tarawih</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Tadarus</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span> Sedekah</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-yellow-500">nights_stay</span> Lailatul Qadr</span>
                        </div>

                        {/* 30-day Grid */}
                        <div className="overflow-x-auto flex-1 custom-scrollbar relative z-10">
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 min-w-[600px]">
                                {days.map((d) => (
                                    <div
                                        key={d.day}
                                        className={`relative rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 ${
                                            d.isSpecial
                                                ? 'border-yellow-400 bg-yellow-50 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                                                : 'border-gray-200 bg-white/60'
                                        }`}
                                    >
                                        {d.isSpecial && (
                                            <span className="absolute -top-2 -right-2 material-symbols-outlined text-yellow-500 text-base">nights_stay</span>
                                        )}
                                        <span className={`font-handwriting text-lg font-bold ${d.isSpecial ? 'text-yellow-700' : 'text-gray-700'}`}>
                                            {d.day}
                                        </span>
                                        <div className="flex gap-1 flex-wrap justify-center">
                                            {d.sahur && <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-white text-[8px]">S</span>}
                                            {d.tarawih && <span className="w-4 h-4 rounded-full bg-indigo-400 flex items-center justify-center text-white text-[8px]">T</span>}
                                            {d.tadarus > 0 && (
                                                <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-white text-[8px]">{d.tadarus}</span>
                                            )}
                                            {d.sedekah && <span className="w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center text-white text-[8px]">$</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6 z-10 relative">
                            <div className="flex justify-between font-note text-sm text-gray-500 mb-1">
                                <span>Progress Ramadan</span>
                                <span>15 / 30 hari</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
                                <div className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Iftar Menu & Special Notes */}
                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-amber-100/70 rotate-[3deg]"></div>

                        <div className="mb-6 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-1 mt-4 xl:mt-0">Menu Buka Puasa</h3>
                            <span className="font-note text-gray-400 text-sm">Perencanaan iftar mingguan</span>
                        </div>

                        <div className="space-y-3 relative z-10 mb-8">
                            {iftarMenu.map((item, i) => (
                                <div key={i} className="bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm hover:bg-white/80 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-amber-500 text-base">restaurant</span>
                                        <span className="font-handwriting text-lg font-bold text-gray-700">{item.day}</span>
                                    </div>
                                    <p className="font-note text-sm text-gray-600 pl-7">{item.menu}</p>
                                </div>
                            ))}
                        </div>

                        {/* Lailatul Qadr sticky */}
                        <div className="bg-indigo-100 p-5 shadow-sticky rotate-[-1deg] relative z-10 border border-indigo-200 mb-6">
                            <div className="washi-tape w-16 h-4 bg-yellow-200/60 rotate-[-3deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-indigo-600">nights_stay</span>
                                <h4 className="font-handwriting text-xl font-bold text-indigo-800">Malam Lailatul Qadr</h4>
                            </div>
                            <p className="font-note text-sm text-indigo-700 leading-relaxed">
                                Perbanyak ibadah di malam ganjil 10 hari terakhir: <strong>21, 23, 25, 27, 29 Ramadan</strong>.
                            </p>
                            <p className="font-handwriting text-base text-indigo-600 mt-2 italic text-center">
                                "Lailatul Qadr lebih baik dari seribu bulan" — QS. Al-Qadr: 3
                            </p>
                        </div>

                        {/* Dua sticky */}
                        <div className="bg-yellow-100 p-4 shadow-sticky rotate-[2deg] relative z-10 border border-yellow-200">
                            <h4 className="font-sketch text-base text-yellow-800 mb-2 border-b border-yellow-300 pb-1">Doa Buka Puasa</h4>
                            <p className="font-handwriting text-lg text-gray-800 text-center leading-relaxed">
                                "Allahumma laka sumtu wa bika aamantu wa 'ala rizqika aftartu"
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-1">
                                Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.
                            </p>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[60px] text-indigo-300">mosque</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
