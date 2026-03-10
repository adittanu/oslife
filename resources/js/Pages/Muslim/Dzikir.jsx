import React, { useState, useEffect } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import axios from 'axios';

export default function Dzikir({ dzikirList: initialDzikirList, weeklyLogs, stats }) {
    const [dzikirList, setDzikirList] = useState(initialDzikirList || []);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setDzikirList(initialDzikirList || []);
    }, [initialDzikirList]);

    // Dzikir data with Arabic text
    const dzikirData = {
        'Subhanallah': { arabic: 'سُبْحَانَ اللّٰهِ', meaning: 'Maha Suci Allah', color: 'emerald' },
        'Alhamdulillah': { arabic: 'اَلْحَمْدُ لِلّٰهِ', meaning: 'Segala Puji Bagi Allah', color: 'blue' },
        'Allahu Akbar': { arabic: 'اَللّٰهُ اَكْبَرُ', meaning: 'Allah Maha Besar', color: 'purple' },
        'La ilaha illallah': { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', meaning: 'Tiada Tuhan selain Allah', color: 'teal' },
        'Astaghfirullah': { arabic: 'أَسْتَغْفِرُ اللّٰهَ', meaning: 'Aku memohon ampun kepada Allah', color: 'amber' },
        "Hasbunallah wa ni'mal wakil": { arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ', meaning: 'Cukuplah Allah bagi kami, Dia sebaik-baik pelindung', color: 'pink' },
    };

    // Get color classes
    const getColorClasses = (color) => {
        const colors = {
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', button: 'bg-emerald-200 hover:bg-emerald-300', stroke: '#10b981' },
            blue: { bg: 'bg-blue-50', border: 'border-blue-100', button: 'bg-blue-200 hover:bg-blue-300', stroke: '#3b82f6' },
            purple: { bg: 'bg-purple-50', border: 'border-purple-100', button: 'bg-purple-200 hover:bg-purple-300', stroke: '#8b5cf6' },
            teal: { bg: 'bg-teal-50', border: 'border-teal-100', button: 'bg-teal-200 hover:bg-teal-300', stroke: '#14b8a6' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-100', button: 'bg-amber-200 hover:bg-amber-300', stroke: '#f59e0b' },
            pink: { bg: 'bg-pink-50', border: 'border-pink-100', button: 'bg-pink-200 hover:bg-pink-300', stroke: '#ec4899' },
        };
        return colors[color] || colors.emerald;
    };

    // Increment counter
    const incrementDzikir = (dzikirName) => {
        axios.post('/api/muslim/dzikir/increment', {
            dzikir_name: dzikirName,
            date: today,
        }).then(() => {
            setDzikirList((prev) => prev.map((d) =>
                d.name === dzikirName ? { ...d, count: d.count + 1 } : d
            ));
        });
    };

    // Reset counter
    const resetDzikir = (dzikirName) => {
        axios.post('/api/muslim/dzikir/reset', {
            dzikir_name: dzikirName,
            date: today,
        }).then(() => {
            setDzikirList((prev) => prev.map((d) =>
                d.name === dzikirName ? { ...d, count: 0 } : d
            ));
        });
    };

    // Set specific count
    const setCount = (dzikirName, count) => {
        axios.post('/api/muslim/dzikir/set', {
            dzikir_name: dzikirName,
            date: today,
            count: count,
        }).then(() => {
            setDzikirList((prev) => prev.map((d) =>
                d.name === dzikirName ? { ...d, count: count } : d
            ));
        });
    };

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

                    {/* Stats Bar */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <span className="font-handwriting text-3xl font-bold text-primary">{stats?.today || 0}</span>
                                    <p className="font-note text-xs text-gray-400">Hari Ini</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-handwriting text-3xl font-bold text-amber-600">{stats?.week || 0}</span>
                                    <p className="font-note text-xs text-gray-400">Minggu Ini</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-handwriting text-3xl font-bold text-green-600">{stats?.completedToday || 0}/{stats?.totalDzikir || 6}</span>
                                    <p className="font-note text-xs text-gray-400">Selesai</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-note text-sm text-gray-500">
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dzikir Counters */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>
                        <h3 className="font-handwriting text-3xl font-bold text-gray-700 text-center mb-2 mt-2">Dzikir Harian</h3>
                        <p className="font-note text-gray-400 text-sm text-center mb-8">Tap untuk menambah hitungan</p>

                        {dzikirList.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-5xl text-gray-300">pace</span>
                                </div>
                                <p className="font-handwriting text-xl text-gray-400">Ketuk untuk mulai berdzikir...</p>
                                <p className="font-note text-sm text-gray-300 mt-2">Counter dzikir akan muncul di sini</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dzikirList.map((dzikir, idx) => {
                                    const data = dzikirData[dzikir.name] || { arabic: '', meaning: '', color: 'emerald' };
                                    const colorClasses = getColorClasses(data.color);
                                    const progress = Math.min((dzikir.count / dzikir.target) * 100, 100);
                                    const isComplete = dzikir.count >= dzikir.target;

                                    return (
                                        <div key={dzikir.id || idx} className={`relative ${colorClasses.bg} rounded-2xl p-6 border ${colorClasses.border} shadow-sm hover:shadow-md transition-shadow group`}>
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 rotate-[1deg] rounded-sm shadow-sm"></div>

                                            <div className="text-center mb-4">
                                                <p className="text-3xl font-bold text-gray-800 leading-relaxed" style={{ fontFamily: 'serif' }}>{data.arabic}</p>
                                                <p className="font-handwriting text-lg text-gray-600 mt-1">{dzikir.name}</p>
                                                <p className="font-note text-sm text-gray-400">{data.meaning}</p>
                                            </div>

                                            {/* Counter circle */}
                                            <div className="flex justify-center mb-4">
                                                <div className="relative w-28 h-28 cursor-pointer" onClick={() => incrementDzikir(dzikir.name)}>
                                                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                                                        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                                        <circle
                                                            cx="60" cy="60" r="52" fill="none"
                                                            stroke={colorClasses.stroke}
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${(progress / 100) * 327} 327`}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="font-handwriting text-3xl font-bold text-gray-800">{dzikir.count}</span>
                                                        <span className="text-xs text-gray-400">/ {dzikir.target}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => incrementDzikir(dzikir.name)}
                                                    className={`w-14 h-14 rounded-full ${colorClasses.button} flex items-center justify-center shadow-md transition-all active:scale-95`}
                                                >
                                                    <span className="material-symbols-outlined text-2xl text-gray-700">add</span>
                                                </button>
                                                <button
                                                    onClick={() => resetDzikir(dzikir.name)}
                                                    className="w-10 h-10 rounded-full bg-white/80 hover:bg-gray-100 flex items-center justify-center shadow-sm transition-all self-end"
                                                >
                                                    <span className="material-symbols-outlined text-lg text-gray-400">restart_alt</span>
                                                </button>
                                            </div>

                                            {isComplete && (
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md rotate-12">
                                                    <span className="material-symbols-outlined text-base text-white">done</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Weekly Progress */}
                    {weeklyLogs && weeklyLogs.length > 0 && (
                        <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-4 mt-2">Progress Minggu Ini</h3>

                            <div className="grid grid-cols-7 gap-2">
                                {weeklyLogs.map((log, idx) => (
                                    <div key={idx} className="text-center p-2 bg-white rounded-lg border border-gray-100">
                                        <p className="font-note text-xs text-gray-400">
                                            {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                                        </p>
                                        <p className="font-handwriting text-lg font-bold text-primary">{log.total}</p>
                                        <p className="font-note text-xs text-gray-300">{log.completed}/{stats?.totalDzikir || 6}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
