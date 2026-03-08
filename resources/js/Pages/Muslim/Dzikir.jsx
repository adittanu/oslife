import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Dzikir() {
    const dzikirCounters = [
        { arabic: 'سُبْحَانَ اللّٰهِ', latin: 'Subhanallah', meaning: 'Maha Suci Allah', count: 27, target: 33, color: 'emerald' },
        { arabic: 'اَلْحَمْدُ لِلّٰهِ', latin: 'Alhamdulillah', meaning: 'Segala Puji Bagi Allah', count: 33, target: 33, color: 'blue' },
        { arabic: 'اَللّٰهُ اَكْبَرُ', latin: 'Allahu Akbar', meaning: 'Allah Maha Besar', count: 15, target: 33, color: 'purple' },
    ];

    const morningDzikir = [
        { text: 'Ayat Kursi (1x)', done: true },
        { text: 'Al-Ikhlas (3x)', done: true },
        { text: 'Al-Falaq (3x)', done: true },
        { text: 'An-Nas (3x)', done: false },
        { text: 'Sayyidul Istighfar (1x)', done: false },
        { text: 'Doa Pagi (Ashbahnaa wa ashbahal mulku lillah...)', done: false },
    ];

    const eveningDzikir = [
        { text: 'Ayat Kursi (1x)', done: true },
        { text: 'Al-Ikhlas (3x)', done: false },
        { text: 'Al-Falaq (3x)', done: false },
        { text: 'An-Nas (3x)', done: false },
        { text: 'Sayyidul Istighfar (1x)', done: false },
        { text: 'Doa Petang (Amsaynaa wa amsal mulku lillah...)', done: false },
    ];

    const customDzikir = [
        { text: 'Istighfar (Astaghfirullahal adzim)', count: 50, target: 100 },
        { text: 'Shalawat Nabi', count: 30, target: 100 },
        { text: 'La ilaha illallah', count: 100, target: 100 },
        { text: 'La hawla wa la quwwata illa billah', count: 10, target: 33 },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Dzikir Counter"
            headerTitle="Dzikir Counter"
            headerSubtitle="Remember Allah always"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">pace</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Decorative elements */}
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">mosque</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Main Dzikir Counters */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 text-center mb-2 mt-2">Dzikir Ba'da Shalat</h3>
                        <p className="font-note text-gray-400 text-sm text-center mb-8">After prayer remembrance</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dzikirCounters.map((dzikir, idx) => (
                                <div key={idx} className={`relative bg-${dzikir.color}-50/60 rounded-2xl p-6 border border-${dzikir.color}-100 shadow-sm hover:shadow-md transition-shadow group`}>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 rotate-[1deg] rounded-sm shadow-sm"></div>

                                    <div className="text-center mb-4">
                                        <p className="text-3xl font-bold text-gray-800 leading-relaxed" style={{ fontFamily: 'serif' }}>{dzikir.arabic}</p>
                                        <p className="font-handwriting text-lg text-gray-600 mt-1">{dzikir.latin}</p>
                                        <p className="font-note text-sm text-gray-400">{dzikir.meaning}</p>
                                    </div>

                                    {/* Counter circle */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative w-28 h-28">
                                            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                                <circle
                                                    cx="60" cy="60" r="52" fill="none"
                                                    stroke={dzikir.color === 'emerald' ? '#10b981' : dzikir.color === 'blue' ? '#3b82f6' : '#8b5cf6'}
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(dzikir.count / dzikir.target) * 327} 327`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-handwriting text-3xl font-bold text-gray-800">{dzikir.count}</span>
                                                <span className="text-xs text-gray-400">/ {dzikir.target}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-3">
                                        <button className={`w-14 h-14 rounded-full bg-${dzikir.color}-200 hover:bg-${dzikir.color}-300 flex items-center justify-center shadow-md transition-all active:scale-95`}>
                                            <span className="material-symbols-outlined text-2xl text-gray-700">add</span>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-gray-100 flex items-center justify-center shadow-sm transition-all self-end">
                                            <span className="material-symbols-outlined text-lg text-gray-400">restart_alt</span>
                                        </button>
                                    </div>

                                    {dzikir.count >= dzikir.target && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md rotate-12">
                                            <span className="material-symbols-outlined text-base text-white">done</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Morning & Evening Dzikir */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Morning */}
                        <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 left-10 bg-yellow-100/80 rotate-[-2deg]"></div>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-yellow-600">wb_sunny</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Dzikir Pagi</h3>
                                    <p className="font-note text-xs text-gray-400">Morning Adhkar</p>
                                </div>
                                <div className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                                    2/6
                                </div>
                            </div>

                            <div className="space-y-3">
                                {morningDzikir.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary/50'}`}>
                                            {item.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                        </div>
                                        <span className={`font-note text-base leading-relaxed ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Evening */}
                        <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                            <div className="washi-tape -top-2 right-10 bg-indigo-100/80 rotate-[2deg]"></div>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-indigo-600">dark_mode</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Dzikir Petang</h3>
                                    <p className="font-note text-xs text-gray-400">Evening Adhkar</p>
                                </div>
                                <div className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                    1/6
                                </div>
                            </div>

                            <div className="space-y-3">
                                {eveningDzikir.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary/50'}`}>
                                            {item.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                        </div>
                                        <span className={`font-note text-base leading-relaxed ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Custom Dzikir List */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-20 bg-pink-100/80 rotate-[-1deg]"></div>
                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div>
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700">Dzikir Harian Lainnya</h3>
                                <p className="font-note text-sm text-gray-400">Other daily remembrance</p>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span> Tambah Dzikir
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customDzikir.map((item, idx) => {
                                const percentage = Math.round((item.count / item.target) * 100);
                                const colors = ['bg-rose-50 border-rose-100', 'bg-amber-50 border-amber-100', 'bg-teal-50 border-teal-100', 'bg-sky-50 border-sky-100'];
                                const barColors = ['bg-rose-400', 'bg-amber-400', 'bg-teal-400', 'bg-sky-400'];
                                return (
                                    <div key={idx} className={`relative ${colors[idx]} rounded-xl p-5 border shadow-sm`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-note text-base text-gray-700 font-medium">{item.text}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-600">{item.count}/{item.target}</span>
                                        </div>
                                        <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${barColors[idx]} rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-gray-400">{percentage}% selesai</span>
                                            <button className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all active:scale-95">
                                                <span className="material-symbols-outlined text-sm text-gray-500">add</span>
                                            </button>
                                        </div>
                                        {percentage >= 100 && (
                                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-md rotate-12">
                                                <span className="material-symbols-outlined text-sm text-white">star</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center" style={{ fontFamily: 'serif' }}>
                                "اَلَا بِذِكْرِ اللّٰهِ تَطْمَىِٕنُّ الْقُلُوْبُ"
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram." (QS. Ar-Ra'd: 28)
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
