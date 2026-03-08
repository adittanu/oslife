import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Doa() {
    const categories = [
        { name: 'Pagi & Sore', icon: 'wb_twilight', color: 'amber', active: true },
        { name: 'Makan', icon: 'restaurant', color: 'green', active: false },
        { name: 'Tidur', icon: 'bedtime', color: 'indigo', active: false },
        { name: 'Bepergian', icon: 'flight_takeoff', color: 'sky', active: false },
        { name: 'Ibadah', icon: 'mosque', color: 'emerald', active: false },
        { name: 'Lainnya', icon: 'more_horiz', color: 'gray', active: false },
    ];

    const doaList = [
        {
            title: 'Doa Bangun Tidur',
            arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ',
            latin: "Alhamdu lillahil ladzi ahyana ba'da ma amatana wa ilaihin nusyur",
            translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya lah kami dikembalikan.',
            source: 'HR. Bukhari',
            bookmarked: true,
            category: 'Pagi & Sore',
        },
        {
            title: 'Doa Keluar Rumah',
            arabic: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ وَلَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللّٰهِ',
            latin: "Bismillahi tawakkaltu 'alallah wa la hawla wa la quwwata illa billah",
            translation: 'Dengan nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.',
            source: 'HR. Abu Dawud & Tirmidzi',
            bookmarked: true,
            category: 'Bepergian',
        },
        {
            title: 'Doa Sebelum Makan',
            arabic: 'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ بِسْمِ اللّٰهِ',
            latin: "Allahumma barik lana fima razaqtana wa qina 'adzaban nar, bismillah",
            translation: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami, dan lindungilah kami dari siksa api neraka. Dengan menyebut nama Allah.',
            source: 'HR. Ibnu Sunni',
            bookmarked: false,
            category: 'Makan',
        },
        {
            title: 'Doa Sesudah Makan',
            arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
            latin: "Alhamdu lillahil ladzi ath'amana wa saqana wa ja'alana muslimin",
            translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami sebagai orang-orang Muslim.',
            source: 'HR. Abu Dawud & Tirmidzi',
            bookmarked: false,
            category: 'Makan',
        },
        {
            title: 'Doa Sebelum Tidur',
            arabic: 'بِاسْمِكَ اللّٰهُمَّ اَحْيَا وَاَمُوْتُ',
            latin: 'Bismika Allahumma ahya wa amut',
            translation: 'Dengan menyebut nama-Mu ya Allah, aku hidup dan aku mati.',
            source: 'HR. Bukhari & Muslim',
            bookmarked: true,
            category: 'Tidur',
        },
        {
            title: 'Doa Masuk Masjid',
            arabic: 'اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ',
            latin: "Allahummaf tah li abwaba rahmatik",
            translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
            source: 'HR. Muslim',
            bookmarked: false,
            category: 'Ibadah',
        },
    ];

    const stickyColors = ['bg-yellow-50', 'bg-green-50', 'bg-blue-50', 'bg-rose-50', 'bg-amber-50', 'bg-violet-50'];
    const borderColors = ['border-yellow-200', 'border-green-200', 'border-blue-200', 'border-rose-200', 'border-amber-200', 'border-violet-200'];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Doa Collection"
            headerTitle="Doa Collection"
            headerSubtitle="The weapon of a believer"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">volunteer_activism</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-16 right-10 opacity-10 pointer-events-none rotate-[15deg]">
                    <span className="material-symbols-outlined text-[70px] text-primary">auto_stories</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Category tabs */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-4 md:p-6">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-note text-sm transition-all shadow-sm ${
                                        cat.active
                                            ? 'bg-primary text-white shadow-md scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search bar sticky note */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-4 md:p-6">
                        <div className="flex items-center gap-3 bg-white/80 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Cari doa... (misal: tidur, makan, safar)"
                                className="flex-1 bg-transparent border-none outline-none font-note text-gray-700 placeholder-gray-300 focus:ring-0"
                            />
                            <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined text-sm">bookmark</span>
                                3 favorit
                            </div>
                        </div>
                    </div>

                    {/* Doa Cards */}
                    <div className="space-y-5">
                        {doaList.map((doa, idx) => (
                            <div key={idx} className={`relative ${stickyColors[idx % stickyColors.length]} shadow-notebook rounded-xl ${borderColors[idx % borderColors.length]} border p-6 md:p-8 hover:shadow-lg transition-shadow group`}>
                                {idx === 0 && <div className="washi-tape -top-2 left-16 bg-amber-100/80 rotate-[-1deg]"></div>}
                                {idx === 2 && <div className="washi-tape -top-2 right-16 bg-green-100/80 rotate-[2deg]"></div>}
                                {idx === 4 && <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-indigo-100/80 rotate-[1deg]"></div>}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                            <span className="font-handwriting text-lg font-bold text-primary">{idx + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-handwriting text-xl font-bold text-gray-700">{doa.title}</h4>
                                            <span className="font-note text-xs text-gray-400">{doa.category} &bull; {doa.source}</span>
                                        </div>
                                    </div>
                                    <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${doa.bookmarked ? 'bg-primary/10 text-primary' : 'bg-white/80 text-gray-300 hover:text-primary/60'}`}>
                                        <span className="material-symbols-outlined text-xl">{doa.bookmarked ? 'bookmark' : 'bookmark_border'}</span>
                                    </button>
                                </div>

                                {/* Arabic text */}
                                <div className="bg-white/60 rounded-xl p-5 mb-4 border border-white/80 shadow-sm">
                                    <p className="text-2xl md:text-3xl text-gray-800 text-right leading-loose" style={{ fontFamily: 'serif' }} dir="rtl">
                                        {doa.arabic}
                                    </p>
                                </div>

                                {/* Latin */}
                                <p className="font-note text-sm text-gray-500 italic mb-3 leading-relaxed px-1">
                                    {doa.latin}
                                </p>

                                {/* Translation */}
                                <div className="flex items-start gap-2 px-1">
                                    <span className="material-symbols-outlined text-primary/40 text-lg mt-0.5">translate</span>
                                    <p className="font-note text-base text-gray-600 leading-relaxed">
                                        {doa.translation}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-primary transition-colors bg-white/60 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">content_copy</span> Salin
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-primary transition-colors bg-white/60 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">share</span> Bagikan
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-primary transition-colors bg-white/60 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">volume_up</span> Audio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom quote sticky */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-80 relative rotate-[1deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[35%] w-16 h-4 bg-gray-200/50 rotate-[-2deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-lg text-gray-800 leading-snug text-center">
                                "Doa adalah senjata orang mukmin, tiang agama, dan cahaya langit dan bumi."
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-2">
                                - HR. Al-Hakim
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
