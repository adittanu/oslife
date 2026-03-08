import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function QuranJournal() {
    const readingLog = [
        { date: '10 Ramadan', surah: 'Al-Baqarah', ayat: '1-141', juz: 1, pages: 20 },
        { date: '11 Ramadan', surah: 'Al-Baqarah', ayat: '142-252', juz: 2, pages: 18 },
        { date: '12 Ramadan', surah: 'Ali Imran', ayat: '1-91', juz: 3, pages: 16 },
        { date: '13 Ramadan', surah: 'Ali Imran - An-Nisa', ayat: '92-176 / 1-23', juz: 4, pages: 20 },
        { date: '14 Ramadan', surah: 'An-Nisa', ayat: '24-147', juz: 5, pages: 19 },
        { date: '15 Ramadan', surah: 'An-Nisa - Al-Ma\'idah', ayat: '148-176 / 1-81', juz: 6, pages: 20 },
    ];

    const hafalanProgress = [
        { surah: 'Al-Fatihah', ayat: 7, memorized: 7, status: 'done' },
        { surah: 'An-Nas', ayat: 6, memorized: 6, status: 'done' },
        { surah: 'Al-Falaq', ayat: 5, memorized: 5, status: 'done' },
        { surah: 'Al-Ikhlas', ayat: 4, memorized: 4, status: 'done' },
        { surah: 'Al-Lahab', ayat: 5, memorized: 5, status: 'done' },
        { surah: 'An-Nashr', ayat: 3, memorized: 3, status: 'done' },
        { surah: 'Al-Kafirun', ayat: 6, memorized: 6, status: 'done' },
        { surah: 'Al-Kautsar', ayat: 3, memorized: 3, status: 'done' },
        { surah: 'Al-Ma\'un', ayat: 7, memorized: 4, status: 'in-progress' },
        { surah: 'Quraisy', ayat: 4, memorized: 0, status: 'not-started' },
    ];

    const tadabburNotes = [
        {
            surah: 'Al-Baqarah',
            ayat: '286',
            arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
            reflection: 'Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Pengingat bahwa setiap ujian pasti mampu kita hadapi.',
            color: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            surah: 'Ali Imran',
            ayat: '139',
            arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ',
            reflection: 'Jangan bersedih dan jangan merasa lemah. Ayat ini memberikan kekuatan di saat-saat sulit dalam hidup.',
            color: 'bg-green-50',
            borderColor: 'border-green-200',
        },
        {
            surah: 'Ar-Ra\'d',
            ayat: '28',
            arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
            reflection: 'Ingatlah, hanya dengan mengingat Allah-lah hati menjadi tenang. Dzikir adalah obat untuk hati yang gelisah.',
            color: 'bg-purple-50',
            borderColor: 'border-purple-200',
        },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Qur'an Journal"
            headerTitle="Qur'an Journal"
            headerSubtitle="Tadarus, Hafalan & Tadabbur Al-Qur'an"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">menu_book</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Decorative */}
                    <div className="absolute -top-5 -left-5 rotate-[-12deg] z-20 drop-shadow-md">
                        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200 border-dashed">
                            <span className="material-symbols-outlined text-3xl text-amber-600">menu_book</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 right-10 rotate-6 z-20">
                        <span className="w-32 h-8 bg-teal-200/80 block transform skew-x-12 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}></span>
                    </div>

                    {/* LEFT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-teal-200/50"></div>

                        {/* Current Progress */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl text-primary">auto_stories</span>
                                Progress Tadarus
                            </h3>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent"></div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <span className="font-handwriting text-4xl font-bold text-primary">6</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Juz Selesai</p>
                                    </div>
                                    <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <span className="font-handwriting text-4xl font-bold text-amber-600">113</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Halaman Dibaca</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                                        <span className="font-handwriting text-4xl font-bold text-green-600">20%</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Target Khatam</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-note text-gray-400">Juz 1</span>
                                        <span className="font-handwriting text-primary font-bold">Juz 6 / 30</span>
                                        <span className="font-note text-gray-400">Juz 30</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div className="h-full bg-gradient-to-r from-primary/80 to-primary/40 rounded-full transition-all" style={{ width: '20%' }}></div>
                                        {Array.from({ length: 29 }, (_, i) => (
                                            <div key={i} className="absolute top-0 bottom-0 w-px bg-gray-200" style={{ left: `${((i + 1) / 30) * 100}%` }}></div>
                                        ))}
                                    </div>
                                </div>

                                <p className="font-note text-sm text-gray-400 mt-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-green-500">trending_up</span>
                                    Sedang membaca: <span className="font-handwriting text-primary font-bold">Surah Al-Ma'idah, Ayat 82</span>
                                </p>
                            </div>
                        </div>

                        {/* Reading Log */}
                        <div>
                            <h4 className="font-handwriting text-2xl text-gray-700 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Log Bacaan Harian
                            </h4>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Tanggal</th>
                                            <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Surah</th>
                                            <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Ayat</th>
                                            <th className="text-center font-note text-sm text-gray-400 py-2 px-4">Hal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readingLog.map((entry, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <td className="py-2.5 px-4">
                                                    <span className="font-handwriting text-primary font-bold text-sm">{entry.date}</span>
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <span className="font-handwriting text-gray-700">{entry.surah}</span>
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <span className="font-note text-sm text-gray-500">{entry.ayat}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <span className="font-handwriting text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{entry.pages}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-amber-200/50 rotate-[2deg]"></div>

                        {/* Hafalan Progress */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                                Progress Hafalan
                            </h3>
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-note text-sm text-gray-400">Juz 30 (Juz 'Amma)</span>
                                    <span className="font-handwriting text-primary font-bold">8/37 surah</span>
                                </div>
                                <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                    {hafalanProgress.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-lg ${
                                                    item.status === 'done' ? 'text-green-500' :
                                                    item.status === 'in-progress' ? 'text-amber-500' : 'text-gray-300'
                                                }`}>
                                                    {item.status === 'done' ? 'check_circle' :
                                                     item.status === 'in-progress' ? 'timelapse' : 'radio_button_unchecked'}
                                                </span>
                                                <span className={`font-handwriting ${item.status === 'done' ? 'text-gray-500' : 'text-gray-800'}`}>
                                                    {item.surah}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-note text-xs text-gray-400">{item.memorized}/{item.ayat} ayat</span>
                                                {item.status === 'in-progress' && (
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(item.memorized / item.ayat) * 100}%` }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 p-2 bg-primary/5 rounded-lg text-center">
                                    <span className="font-note text-sm text-primary">Sedang menghafal: <span className="font-handwriting font-bold">Al-Ma'un ayat 5</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Tadabbur Notes */}
                        <div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                                Catatan Tadabbur
                            </h3>
                            <div className="space-y-4">
                                {tadabburNotes.map((note, i) => (
                                    <div key={i} className={`${note.color} p-4 rounded-xl border ${note.borderColor} shadow-sm transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'} hover:rotate-0 transition-transform`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-note text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                                                QS. {note.surah}: {note.ayat}
                                            </span>
                                        </div>
                                        <p className="font-handwriting text-lg text-gray-800 text-right leading-relaxed mb-2" dir="rtl">
                                            {note.arabic}
                                        </p>
                                        <div className="border-t border-gray-200/50 pt-2">
                                            <p className="font-note text-sm text-gray-600 leading-relaxed italic">
                                                {note.reflection}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add note sticky */}
                            <div className="mt-4 bg-sticky-yellow p-4 shadow-sticky transform rotate-[1deg]">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="font-note text-sm">Tambah catatan tadabbur baru...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
