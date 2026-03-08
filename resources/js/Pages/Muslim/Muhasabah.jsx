import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Muhasabah() {
    const goodDeeds = [
        { text: 'Shalat 5 waktu tepat waktu', done: true },
        { text: 'Shalat Dhuha', done: true },
        { text: 'Membaca Al-Quran 1 juz', done: false },
        { text: 'Bersedekah kepada tetangga', done: true },
        { text: 'Membantu teman yang kesulitan', done: true },
        { text: 'Tahajjud', done: false },
    ];

    const sinsToRepent = [
        { text: 'Berkata kasar kepada orang tua', level: 'berat' },
        { text: 'Menunda-nunda shalat', level: 'sedang' },
        { text: 'Ghibah saat ngobrol dengan teman', level: 'sedang' },
        { text: 'Bermain HP berlebihan saat waktu produktif', level: 'ringan' },
    ];

    const improvements = [
        { text: 'Lebih sabar menghadapi kemacetan', priority: 'tinggi' },
        { text: 'Bangun lebih awal untuk tahajjud', priority: 'tinggi' },
        { text: 'Kurangi scrolling media sosial', priority: 'sedang' },
        { text: 'Perbanyak membaca buku ilmu', priority: 'sedang' },
        { text: 'Lebih sering silaturahmi ke saudara', priority: 'rendah' },
    ];

    const gratitudeItems = [
        'Masih diberi kesehatan dan kekuatan beribadah',
        'Keluarga yang sehat dan harmonis',
        'Rezeki yang cukup hari ini',
        'Diberi kesempatan untuk bertaubat',
    ];

    const istighfarTracker = [
        { day: 'Senin', count: 100, target: 100, done: true },
        { day: 'Selasa', count: 80, target: 100, done: false },
        { day: 'Rabu', count: 100, target: 100, done: true },
        { day: 'Kamis', count: 45, target: 100, done: false },
        { day: 'Jumat', count: 100, target: 100, done: true },
        { day: 'Sabtu', count: 70, target: 100, done: false },
        { day: 'Ahad', count: 0, target: 100, done: false },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Muhasabah"
            headerTitle="Muhasabah"
            headerSubtitle="Evaluate yourself before you are evaluated"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">self_improvement</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-16 left-12 opacity-10 pointer-events-none rotate-[-12deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">nights_stay</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Date & Header */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 text-center">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-violet-100/80 rotate-1"></div>
                        <div className="mt-2">
                            <p className="font-note text-sm text-gray-400 mb-1">Muhasabah Harian</p>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">Ahad, 8 Maret 2026</h3>
                            <p className="font-note text-sm text-gray-400 mt-1">8 Sya'ban 1447 H</p>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-1">
                                    <span className="material-symbols-outlined text-emerald-600">thumb_up</span>
                                </div>
                                <p className="font-note text-xs text-gray-500">4 kebaikan</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1">
                                    <span className="material-symbols-outlined text-red-400">warning</span>
                                </div>
                                <p className="font-note text-xs text-gray-500">4 dosa</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                                    <span className="material-symbols-outlined text-blue-500">trending_up</span>
                                </div>
                                <p className="font-note text-xs text-gray-500">5 perbaikan</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Good Deeds */}
                        <div className="relative bg-emerald-50/60 shadow-notebook rounded-xl border border-emerald-100 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 left-12 bg-emerald-100/80 rotate-[-2deg]"></div>
                            {/* Paper clip */}
                            <div className="absolute -top-3 right-8 z-10">
                                <div className="w-6 h-10 border-2 border-emerald-300 rounded-t-full bg-transparent"></div>
                            </div>

                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-emerald-600">volunteer_activism</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Amal Baik Hari Ini</h3>
                                    <p className="font-note text-xs text-gray-400">What good did I do today?</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {goodDeeds.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-emerald-300'}`}>
                                            {item.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                        </div>
                                        <span className={`font-note text-base leading-relaxed ${item.done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item.text}</span>
                                    </label>
                                ))}
                            </div>

                            <button className="mt-4 flex items-center gap-1 text-sm font-note text-emerald-500 hover:text-emerald-600 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Tambah amal baik
                            </button>
                        </div>

                        {/* Sins to Repent */}
                        <div className="relative bg-red-50/40 shadow-notebook rounded-xl border border-red-100 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 right-12 bg-red-100/70 rotate-[2deg]"></div>

                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-red-400">heart_broken</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Dosa yang Harus Ditaubati</h3>
                                    <p className="font-note text-xs text-gray-400">What sins do I need to repent?</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {sinsToRepent.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/50 rounded-lg p-3 border border-white/80">
                                        <span className="material-symbols-outlined text-red-300 mt-0.5 text-lg">radio_button_unchecked</span>
                                        <div className="flex-1">
                                            <p className="font-note text-base text-gray-700">{item.text}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                            item.level === 'berat' ? 'bg-red-100 text-red-600' :
                                            item.level === 'sedang' ? 'bg-amber-100 text-amber-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.level}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 p-4 bg-white/40 rounded-xl border border-red-100/50">
                                <p className="font-handwriting text-sm text-gray-500 mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-red-300">edit_note</span>
                                    Catatan taubat:
                                </p>
                                <p className="font-note text-sm text-gray-600 italic leading-relaxed">
                                    "Ya Allah, ampunilah segala dosa-dosaku. Aku menyesal dan berjanji untuk tidak mengulanginya. Bantu aku menjadi hamba yang lebih baik..."
                                </p>
                            </div>
                        </div>

                        {/* What to Improve */}
                        <div className="relative bg-blue-50/50 shadow-notebook rounded-xl border border-blue-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/70 rotate-[1deg]"></div>

                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-blue-500">trending_up</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Yang Perlu Diperbaiki</h3>
                                    <p className="font-note text-xs text-gray-400">What should I improve?</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {improvements.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/50 rounded-lg p-3 border border-white/80">
                                        <span className="font-handwriting text-lg font-bold text-blue-400 w-6">{idx + 1}.</span>
                                        <p className="font-note text-base text-gray-700 flex-1">{item.text}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                            item.priority === 'tinggi' ? 'bg-red-100 text-red-500' :
                                            item.priority === 'sedang' ? 'bg-amber-100 text-amber-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-4 flex items-center gap-1 text-sm font-note text-blue-500 hover:text-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Tambah target perbaikan
                            </button>
                        </div>

                        {/* Gratitude to Allah */}
                        <div className="relative bg-amber-50/50 shadow-notebook rounded-xl border border-amber-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 right-10 bg-amber-100/70 rotate-[-1deg]"></div>
                            {/* Paper clip */}
                            <div className="absolute -top-3 left-8 z-10">
                                <div className="w-6 h-10 border-2 border-amber-300 rounded-t-full bg-transparent"></div>
                            </div>

                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-amber-600">favorite</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Syukur kepada Allah</h3>
                                    <p className="font-note text-xs text-gray-400">Gratitude to Allah</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {gratitudeItems.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-amber-400 mt-0.5">star</span>
                                        <p className="font-note text-base text-gray-700 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 bg-white/40 rounded-xl p-4 border border-amber-100/50">
                                <textarea
                                    className="w-full bg-transparent border-none outline-none resize-none font-note text-base text-gray-600 leading-relaxed placeholder-gray-300 focus:ring-0"
                                    placeholder="Tuliskan nikmat lain yang kamu syukuri hari ini..."
                                    rows={2}
                                ></textarea>
                            </div>
                        </div>

                    </div>

                    {/* Taubat & Istighfar Tracker */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-[-1deg]"></div>

                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-purple-500">refresh</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Istighfar Mingguan</h3>
                                    <p className="font-note text-xs text-gray-400">Target: 100x istighfar per hari</p>
                                </div>
                            </div>
                            <div className="bg-purple-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full">
                                3/7 hari tercapai
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-3">
                            {istighfarTracker.map((day, idx) => {
                                const percentage = Math.round((day.count / day.target) * 100);
                                return (
                                    <div key={idx} className={`relative text-center p-3 rounded-xl border transition-all ${
                                        day.done ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-white/60 border-gray-200'
                                    }`}>
                                        <p className="font-note text-xs text-gray-500 mb-2">{day.day}</p>
                                        <div className="relative w-12 h-12 mx-auto mb-2">
                                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                                <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                                                <circle
                                                    cx="24" cy="24" r="20" fill="none"
                                                    stroke={day.done ? '#8b5cf6' : '#d1d5db'}
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(day.count / day.target) * 126} 126`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {day.done ? (
                                                    <span className="material-symbols-outlined text-purple-500 text-lg">check</span>
                                                ) : (
                                                    <span className="font-handwriting text-xs font-bold text-gray-500">{day.count}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-note text-xs text-gray-400">{percentage}%</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Istighfar text */}
                        <div className="mt-6 text-center bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                            <p className="text-2xl text-gray-800 mb-1" style={{ fontFamily: 'serif' }}>
                                أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ
                            </p>
                            <p className="font-note text-sm text-gray-500 italic">Astaghfirullahal 'adziim - Aku memohon ampun kepada Allah Yang Maha Agung</p>
                        </div>
                    </div>

                    {/* Daily reflection journal entry */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10 paper-lines">
                        <div className="washi-tape -top-2 left-20 bg-pink-100/70 rotate-[1deg]"></div>

                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <span className="material-symbols-outlined text-primary/40">edit_note</span>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Refleksi Hari Ini</h3>
                        </div>

                        <textarea
                            className="w-full bg-transparent border-none outline-none resize-none font-note text-lg text-gray-700 leading-[2.2rem] placeholder-gray-300 focus:ring-0 min-h-[120px]"
                            placeholder="Tuliskan refleksi harianmu di sini... Bagaimana perasaanmu hari ini? Apa yang kamu pelajari tentang dirimu?"
                            defaultValue="Hari ini aku merasa bersyukur karena masih diberi kesempatan untuk memperbaiki diri. Aku sadar masih banyak kekurangan, terutama dalam menjaga lisan. Semoga Allah memberi kekuatan untuk istiqomah dalam kebaikan. Allahumma a'inni 'ala dzikrika wa syukrika wa husni 'ibadatik."
                        ></textarea>
                    </div>

                    {/* Bottom motivational sticky */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-80 relative rotate-[1.5deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[35%] w-14 h-4 bg-gray-200/50 rotate-[-1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center" style={{ fontFamily: 'serif' }}>
                                "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا"
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                "Hisablah dirimu sebelum kamu dihisab." - Umar bin Khattab radhiyallahu 'anhu
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
