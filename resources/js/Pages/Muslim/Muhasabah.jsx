import React, { useState, useEffect, useRef } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router } from '@inertiajs/react';

export default function Muhasabah({ todayEntry: initialEntry, recentEntries, weeklyMoods, stats }) {
    const today = new Date().toISOString().split('T')[0];

    // Form state
    const [entry, setEntry] = useState({
        date: today,
        gratitude: initialEntry?.gratitude || '',
        improvement: initialEntry?.improvement || '',
        achievement: initialEntry?.achievement || '',
        tomorrow_goal: initialEntry?.tomorrow_goal || '',
        reflection: initialEntry?.reflection || '',
        mood: initialEntry?.mood || null,
    });

    // Auto-save debounce ref
    const saveTimeoutRef = useRef(null);

    // Mood options
    const moodOptions = [
        { value: 'happy', label: 'Senang', icon: '😊', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
        { value: 'grateful', label: 'Syukur', icon: '🤲', color: 'bg-amber-100 border-amber-300 text-amber-700' },
        { value: 'peaceful', label: 'Tenang', icon: '😌', color: 'bg-green-100 border-green-300 text-green-700' },
        { value: 'neutral', label: 'Biasa', icon: '😐', color: 'bg-gray-100 border-gray-300 text-gray-700' },
        { value: 'sad', label: 'Sedih', icon: '😢', color: 'bg-blue-100 border-blue-300 text-blue-700' },
        { value: 'anxious', label: 'Khawatir', icon: '😰', color: 'bg-purple-100 border-purple-300 text-purple-700' },
    ];

    // Auto-save with debounce
    const saveEntry = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            router.post('/api/muslim/muhasabah', entry, {
                preserveScroll: true,
            });
        }, 1000);
    };

    // Update field and trigger auto-save
    const updateField = (field, value) => {
        setEntry(prev => ({ ...prev, [field]: value }));
        saveEntry();
    };

    // Get mood info
    const getMoodInfo = (moodValue) => {
        return moodOptions.find(m => m.value === moodValue);
    };

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
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                                    <span className="font-handwriting text-xl font-bold text-primary">{stats?.streak || 0}</span>
                                </div>
                                <p className="font-note text-xs text-gray-500">Streak</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-1">
                                    <span className="font-handwriting text-xl font-bold text-amber-600">{stats?.totalEntries || 0}</span>
                                </div>
                                <p className="font-note text-xs text-gray-500">Total Entry</p>
                            </div>
                        </div>
                    </div>

                    {/* Mood Selector */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                        <div className="washi-tape -top-2 left-10 bg-pink-100/70 rotate-[-2deg]"></div>
                        <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-4 mt-2">Bagaimana perasaanmu hari ini?</h3>

                        <div className="flex flex-wrap gap-3">
                            {moodOptions.map((mood) => (
                                <button
                                    key={mood.value}
                                    onClick={() => updateField('mood', mood.value)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                        entry.mood === mood.value
                                            ? mood.color
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-xl">{mood.icon}</span>
                                    <span className="font-note text-sm">{mood.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Gratitude */}
                        <div className="relative bg-amber-50/50 shadow-notebook rounded-xl border border-amber-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 right-10 bg-amber-100/70 rotate-[-1deg]"></div>
                            <div className="absolute -top-3 left-8 z-10">
                                <div className="w-6 h-10 border-2 border-amber-300 rounded-t-full bg-transparent"></div>
                            </div>

                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-amber-600">favorite</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Syukur Hari Ini</h3>
                                    <p className="font-note text-xs text-gray-400">Apa yang kamu syukuri hari ini?</p>
                                </div>
                            </div>

                            {entry.gratitude || entry.mood ? (
                                <textarea
                                    value={entry.gratitude}
                                    onChange={(e) => updateField('gratitude', e.target.value)}
                                    className="w-full bg-white/60 border border-amber-100 rounded-xl p-4 font-note text-base text-gray-700 leading-relaxed placeholder-gray-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                                    placeholder="Tuliskan nikmat-nikmat yang kamu syukuri hari ini..."
                                    rows={4}
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('gratitude', ' ')}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-amber-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-amber-300 mb-2">add_circle</span>
                                    <p className="font-handwriting text-lg text-amber-400">Ketuk untuk tambah syukur...</p>
                                </div>
                            )}
                        </div>

                        {/* Achievement */}
                        <div className="relative bg-emerald-50/60 shadow-notebook rounded-xl border border-emerald-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-12 bg-emerald-100/80 rotate-[-2deg]"></div>
                            <div className="absolute -top-3 right-8 z-10">
                                <div className="w-6 h-10 border-2 border-emerald-300 rounded-t-full bg-transparent"></div>
                            </div>

                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-emerald-600">volunteer_activism</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Pencapaian Hari Ini</h3>
                                    <p className="font-note text-xs text-gray-400">Apa kebaikan yang kamu lakukan?</p>
                                </div>
                            </div>

                            {entry.achievement ? (
                                <textarea
                                    value={entry.achievement}
                                    onChange={(e) => updateField('achievement', e.target.value)}
                                    className="w-full bg-white/60 border border-emerald-100 rounded-xl p-4 font-note text-base text-gray-700 leading-relaxed placeholder-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                                    placeholder="Amal baik yang kamu lakukan hari ini..."
                                    rows={4}
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('achievement', ' ')}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-emerald-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-emerald-300 mb-2">add_circle</span>
                                    <p className="font-handwriting text-lg text-emerald-400">Ketuk untuk tambah pencapaian...</p>
                                </div>
                            )}
                        </div>

                        {/* Improvement */}
                        <div className="relative bg-blue-50/50 shadow-notebook rounded-xl border border-blue-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/70 rotate-[1deg]"></div>

                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-blue-500">trending_up</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Yang Perlu Diperbaiki</h3>
                                    <p className="font-note text-xs text-gray-400">Apa yang bisa kamu perbaiki?</p>
                                </div>
                            </div>

                            {entry.improvement ? (
                                <textarea
                                    value={entry.improvement}
                                    onChange={(e) => updateField('improvement', e.target.value)}
                                    className="w-full bg-white/60 border border-blue-100 rounded-xl p-4 font-note text-base text-gray-700 leading-relaxed placeholder-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                                    placeholder="Hal-hal yang perlu diperbaiki..."
                                    rows={4}
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('improvement', ' ')}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-blue-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-blue-300 mb-2">add_circle</span>
                                    <p className="font-handwriting text-lg text-blue-400">Ketuk untuk tambah perbaikan...</p>
                                </div>
                            )}
                        </div>

                        {/* Tomorrow Goal */}
                        <div className="relative bg-purple-50/50 shadow-notebook rounded-xl border border-purple-100 p-6 md:p-8">
                            <div className="washi-tape -top-2 right-12 bg-purple-100/70 rotate-[2deg]"></div>

                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-purple-500">flag</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Target Esok Hari</h3>
                                    <p className="font-note text-xs text-gray-400">Apa rencana besok?</p>
                                </div>
                            </div>

                            {entry.tomorrow_goal ? (
                                <textarea
                                    value={entry.tomorrow_goal}
                                    onChange={(e) => updateField('tomorrow_goal', e.target.value)}
                                    className="w-full bg-white/60 border border-purple-100 rounded-xl p-4 font-note text-base text-gray-700 leading-relaxed placeholder-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                                    placeholder="Target dan rencana untuk besok..."
                                    rows={4}
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('tomorrow_goal', ' ')}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-purple-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-purple-300 mb-2">add_circle</span>
                                    <p className="font-handwriting text-lg text-purple-400">Ketuk untuk tambah target...</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Reflection */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10 paper-lines">
                        <div className="washi-tape -top-2 left-20 bg-pink-100/70 rotate-[1deg]"></div>

                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <span className="material-symbols-outlined text-primary/40">edit_note</span>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Refleksi Hari Ini</h3>
                        </div>

                        {entry.reflection ? (
                            <textarea
                                value={entry.reflection}
                                onChange={(e) => updateField('reflection', e.target.value)}
                                className="w-full bg-transparent border-none outline-none resize-none font-note text-lg text-gray-700 leading-[2.2rem] placeholder-gray-300 focus:ring-0 min-h-[120px]"
                                placeholder="Tuliskan refleksi harianmu di sini... Bagaimana perasaanmu hari ini? Apa yang kamu pelajari tentang dirimu?"
                            />
                        ) : (
                            <div
                                onClick={() => updateField('reflection', ' ')}
                                className="bg-white/40 rounded-xl p-8 border border-dashed border-gray-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                            >
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">edit_note</span>
                                <p className="font-handwriting text-lg text-gray-400">Ketuk untuk menulis refleksi...</p>
                                <p className="font-note text-sm text-gray-300 mt-1">Bagikan pemikiran dan perasaanmu hari ini</p>
                            </div>
                        )}
                    </div>

                    {/* Weekly Mood Summary */}
                    {weeklyMoods && Object.keys(weeklyMoods).length > 0 && (
                        <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                            <h3 className="font-handwriting text-xl font-bold text-gray-700 mb-4">Mood Minggu Ini</h3>
                            <div className="flex gap-2">
                                {Object.entries(weeklyMoods).map(([date, mood]) => {
                                    const moodInfo = getMoodInfo(mood);
                                    return (
                                        <div key={date} className="text-center flex-1">
                                            <div className={`w-10 h-10 rounded-full ${moodInfo?.color || 'bg-gray-100'} flex items-center justify-center mx-auto mb-1`}>
                                                <span className="text-lg">{moodInfo?.icon || '😐'}</span>
                                            </div>
                                            <p className="font-note text-xs text-gray-400">
                                                {new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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