import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function KajianNotes() {
    const topics = [
        { name: 'Semua', count: 12, active: true },
        { name: 'Tauhid', count: 4, color: 'emerald' },
        { name: 'Fiqh', count: 3, color: 'blue' },
        { name: 'Akhlak', count: 3, color: 'amber' },
        { name: 'Sirah', count: 2, color: 'rose' },
    ];

    const notes = [
        {
            title: 'Memurnikan Tauhid dalam Kehidupan Sehari-hari',
            speaker: 'Ust. Khalid Basalamah',
            date: '5 Maret 2026',
            topic: 'Tauhid',
            topicColor: 'emerald',
            takeaways: [
                'Tauhid bukan hanya pengakuan lisan, tapi harus terwujud dalam perbuatan',
                'Tawakkal adalah buah dari tauhid yang benar',
                'Menjauhkan diri dari segala bentuk syirik kecil (riya, sum\'ah)',
            ],
            favorite: true,
            stickyColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
        },
        {
            title: 'Panduan Shalat Khusyuk',
            speaker: 'Ust. Adi Hidayat',
            date: '28 Feb 2026',
            topic: 'Fiqh',
            topicColor: 'blue',
            takeaways: [
                'Persiapan sebelum shalat: wudhu dengan sempurna, niat yang benar',
                'Tadabbur ayat yang dibaca dalam shalat',
                'Merasakan kehadiran di hadapan Allah di setiap gerakan',
                'Jangan terburu-buru, thuma\'ninah di setiap rukun',
            ],
            favorite: true,
            stickyColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
        },
        {
            title: 'Adab Bergaul dalam Islam',
            speaker: 'Ust. Hanan Attaki',
            date: '20 Feb 2026',
            topic: 'Akhlak',
            topicColor: 'amber',
            takeaways: [
                'Senyum adalah sedekah - jangan pelit senyum',
                'Menjaga lisan: diam itu emas jika tidak bisa berkata baik',
                'Mendahulukan prasangka baik (husnuzhan)',
            ],
            favorite: false,
            stickyColor: 'bg-amber-50',
            borderColor: 'border-amber-100',
        },
        {
            title: 'Kisah Perjuangan Rasulullah di Thaif',
            speaker: 'Ust. Firanda Andirja',
            date: '15 Feb 2026',
            topic: 'Sirah',
            topicColor: 'rose',
            takeaways: [
                'Rasulullah tetap berdoa kebaikan untuk penduduk Thaif yang menyakitinya',
                'Kesabaran adalah kunci dalam dakwah',
                'Pertolongan Allah datang setelah ujian yang berat',
            ],
            favorite: false,
            stickyColor: 'bg-rose-50',
            borderColor: 'border-rose-100',
        },
        {
            title: 'Fiqh Puasa Sunnah',
            speaker: 'Ust. Abdul Somad',
            date: '10 Feb 2026',
            topic: 'Fiqh',
            topicColor: 'blue',
            takeaways: [
                'Puasa Senin-Kamis: amalan rutin Rasulullah',
                'Puasa Ayyamul Bidh (13, 14, 15 setiap bulan Hijriyah)',
                'Niat puasa sunnah boleh di pagi hari selama belum makan/minum',
            ],
            favorite: false,
            stickyColor: 'bg-sky-50',
            borderColor: 'border-sky-100',
        },
        {
            title: 'Meneladani Akhlak Rasulullah',
            speaker: 'Ust. Syafiq Riza Basalamah',
            date: '3 Feb 2026',
            topic: 'Akhlak',
            topicColor: 'amber',
            takeaways: [
                'Rasulullah selalu tersenyum saat bertemu sahabat',
                'Tidak pernah membalas kejahatan dengan kejahatan',
                'Lemah lembut dalam menegur kesalahan',
                'Selalu mendahulukan kepentingan orang lain',
            ],
            favorite: true,
            stickyColor: 'bg-orange-50',
            borderColor: 'border-orange-100',
        },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Kajian Notes"
            headerTitle="Kajian Notes"
            headerSubtitle="Seek knowledge from cradle to grave"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">school</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-16 opacity-10 pointer-events-none rotate-[-10deg]">
                    <span className="material-symbols-outlined text-[70px] text-primary">menu_book</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header card with stats */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-amber-100/80 rotate-1"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-3xl text-primary">auto_stories</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Catatan Kajian</h3>
                                    <p className="font-note text-sm text-gray-400">12 catatan dari berbagai ustadz dan topik</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span> Catatan Baru
                            </button>
                        </div>

                        {/* Topic filters */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {topics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    className={`px-4 py-2 rounded-xl font-note text-sm transition-all shadow-sm ${
                                        topic.active
                                            ? 'bg-primary text-white shadow-md'
                                            : `bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`
                                    }`}
                                >
                                    {topic.name}
                                    <span className={`ml-1.5 text-xs ${topic.active ? 'text-white/70' : 'text-gray-400'}`}>({topic.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notes.map((note, idx) => (
                            <div key={idx} className={`relative ${note.stickyColor} shadow-notebook rounded-xl ${note.borderColor} border p-6 hover:shadow-lg transition-all group ${idx % 3 === 0 ? 'rotate-[-0.5deg]' : idx % 3 === 1 ? 'rotate-[0.3deg]' : ''}`}>
                                {idx === 0 && <div className="washi-tape -top-2 left-10 bg-emerald-100/70 rotate-[-2deg]"></div>}
                                {idx === 1 && <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[1deg]"></div>}
                                {idx === 3 && <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-rose-100/70 rotate-[-1deg]"></div>}

                                {/* Paper clip decoration */}
                                {idx % 2 === 0 && (
                                    <div className="absolute -top-3 right-6 z-10">
                                        <div className="w-6 h-10 border-2 border-gray-300 rounded-t-full bg-transparent"></div>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-${note.topicColor}-100 text-${note.topicColor}-700`}>
                                                {note.topic}
                                            </span>
                                            <span className="font-note text-xs text-gray-400">{note.date}</span>
                                        </div>
                                        <h4 className="font-handwriting text-xl font-bold text-gray-700 leading-snug">{note.title}</h4>
                                    </div>
                                    <button className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-all ${note.favorite ? 'text-red-400' : 'text-gray-300 hover:text-red-300'}`}>
                                        <span className="material-symbols-outlined text-lg">{note.favorite ? 'favorite' : 'favorite_border'}</span>
                                    </button>
                                </div>

                                {/* Speaker */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-sm text-gray-500">person</span>
                                    </div>
                                    <span className="font-note text-sm text-gray-500">{note.speaker}</span>
                                </div>

                                {/* Key Takeaways */}
                                <div className="bg-white/50 rounded-lg p-4 border border-white/80">
                                    <p className="font-handwriting text-sm font-bold text-gray-500 mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base text-primary/50">lightbulb</span>
                                        Poin Penting:
                                    </p>
                                    <ul className="space-y-2">
                                        {note.takeaways.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary/40 mt-0.5 flex-shrink-0">arrow_right</span>
                                                <span className="font-note text-sm text-gray-600 leading-relaxed">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-primary transition-colors bg-white/60 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">edit</span> Edit
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-primary transition-colors bg-white/60 px-3 py-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">share</span> Share
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-note text-gray-400 hover:text-red-400 transition-colors bg-white/60 px-3 py-1.5 rounded-lg ml-auto">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-80 relative rotate-[-1deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[38%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-lg text-gray-800 leading-snug text-center" style={{ fontFamily: 'serif' }}>
                                "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللّٰهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ"
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga." (HR. Muslim)
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
