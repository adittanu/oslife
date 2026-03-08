import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function WeeklyMuhasabah() {
    const scores = [
        { label: 'Ibadah', score: 8, color: 'bg-indigo-500', icon: 'mosque' },
        { label: 'Akhlak', score: 7, color: 'bg-emerald-500', icon: 'sentiment_satisfied' },
        { label: 'Ilmu', score: 6, color: 'bg-amber-500', icon: 'menu_book' },
        { label: 'Amal', score: 8, color: 'bg-pink-500', icon: 'volunteer_activism' },
    ];

    const wins = [
        'Sholat 5 waktu berjamaah penuh di masjid',
        'Khatam juz 28-29 Al-Quran',
        'Puasa Senin-Kamis konsisten',
        'Sedekah ke 3 masjid berbeda',
    ];

    const improvements = [
        'Tahajud masih sering terlewat — set alarm 03:30',
        'Kurang sabar saat menghadapi kemacetan',
        'Belum konsisten membaca hadits harian',
        'Perlu lebih banyak istighfar di waktu luang',
    ];

    const amalDone = [
        { text: 'Bantu tetangga pindahan rumah', icon: 'handshake' },
        { text: 'Ajar anak-anak mengaji di mushola', icon: 'school' },
        { text: 'Bersihkan masjid hari Jumat', icon: 'cleaning_services' },
        { text: 'Antar makanan untuk keluarga yang sakit', icon: 'local_shipping' },
    ];

    const ilmuGained = [
        'Kajian Fiqih Puasa — Ustadz Ahmad',
        'Tafsir Surah Al-Kahfi ayat 1-10',
        'Baca kitab Riyadhus Shalihin bab Sabar',
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Weekly Muhasabah"
            headerTitle="Weekly Muhasabah"
            headerSubtitle="Weekly reflection & renewal"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">rate_review</span>}
        >
            <div className="absolute bottom-16 left-[35%] opacity-15 pointer-events-none rotate-[15deg]">
                <span className="material-symbols-outlined text-[50px] text-purple-300">psychology</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left — Reflection & Scores */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-indigo-100/80 rotate-1"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Muhasabah Pekan 10</h3>
                            <p className="font-note text-gray-400">3 - 9 Maret 2026</p>
                        </div>

                        {/* Scores Grid */}
                        <div className="mb-8">
                            <h4 className="font-handwriting text-2xl font-bold text-gray-700 mb-4">Skor Mingguan</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {scores.map((s, i) => (
                                    <div key={i} className="bg-white/60 rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-gray-500 text-base">{s.icon}</span>
                                            <span className="font-note text-sm text-gray-500">{s.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-handwriting text-2xl font-bold text-gray-700">{s.score}/10</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score * 10}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wins */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Pencapaian Ibadah</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {wins.map((win, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5">check_circle</span>
                                        <p className="font-handwriting text-lg text-gray-700">{win}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-lg text-gray-500 placeholder-gray-300" placeholder="Tambah pencapaian..." type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Ilmu Gained */}
                        <div className="bg-blue-100 p-5 shadow-sticky rotate-[-1deg] border border-blue-200">
                            <div className="washi-tape w-16 h-4 bg-yellow-200/60 rotate-[-3deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-sketch text-base text-blue-800 mb-3 border-b border-blue-200 pb-1">Ilmu yang Didapat</h4>
                            <div className="space-y-2">
                                {ilmuGained.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">auto_stories</span>
                                        <p className="font-handwriting text-base text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Improvements & Next Week */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-rose-100/70 rotate-[3deg]"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">Evaluasi & Rencana</h3>
                            <p className="font-note text-gray-400">Perbaikan untuk pekan depan</p>
                        </div>

                        {/* Amal Done */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-pink-500">volunteer_activism</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Amal Sosial</h4>
                            </div>
                            <div className="space-y-3">
                                {amalDone.map((amal, i) => (
                                    <div key={i} className="bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                                            <span className="material-symbols-outlined text-base">{amal.icon}</span>
                                        </div>
                                        <p className="font-handwriting text-base text-gray-700">{amal.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Areas to Improve */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-orange-400">trending_up</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Perlu Ditingkatkan</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {improvements.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">arrow_circle_up</span>
                                        <p className="font-handwriting text-base text-gray-700">{item}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-base text-gray-500 placeholder-gray-300" placeholder="Tambah area perbaikan..." type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Dua & Goals sticky */}
                        <div className="bg-green-100 p-5 shadow-sticky rotate-[1deg] relative z-10 border border-green-200 mb-6">
                            <h4 className="font-sketch text-base text-green-800 mb-2 border-b border-green-300 pb-1">Doa & Target Pekan Depan</h4>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-base text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[80px]"
                                defaultValue={"Ya Allah, bantu aku untuk lebih istiqomah dalam tahajud dan tilawah. Target: khatam juz 30, tahajud minimal 5 hari, dan sedekah setiap hari Jumat."}
                            ></textarea>
                        </div>

                        {/* Motivational note */}
                        <div className="bg-yellow-100 p-4 shadow-sticky rotate-[-2deg] relative z-10 border border-yellow-200">
                            <p className="font-handwriting text-base text-gray-800 text-center italic leading-relaxed">
                                "Hisablah dirimu sebelum kamu dihisab, dan timbanglah amalmu sebelum amalmu ditimbang."
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-1">— Umar bin Khattab radhiyallahu 'anhu</p>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-indigo-300">self_improvement</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
