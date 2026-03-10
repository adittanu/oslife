import React, { useState, useEffect, useRef } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import axios from 'axios';

export default function WeeklyMuhasabah({ thisWeek: initialThisWeek, recentWeeks, currentWeekStart, weekRange }) {
    const [entry, setEntry] = useState({
        week_start: currentWeekStart,
        achievements: initialThisWeek?.achievements || [],
        challenges: initialThisWeek?.challenges || [],
        lessons_learned: initialThisWeek?.lessons_learned || '',
        next_week_goals: initialThisWeek?.next_week_goals || [],
        gratitude: initialThisWeek?.gratitude || '',
        overall_mood: initialThisWeek?.overall_mood || null,
    });

    const [newAchievement, setNewAchievement] = useState('');
    const [newChallenge, setNewChallenge] = useState('');
    const [newGoal, setNewGoal] = useState('');

    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        setEntry({
            week_start: currentWeekStart,
            achievements: initialThisWeek?.achievements || [],
            challenges: initialThisWeek?.challenges || [],
            lessons_learned: initialThisWeek?.lessons_learned || '',
            next_week_goals: initialThisWeek?.next_week_goals || [],
            gratitude: initialThisWeek?.gratitude || '',
            overall_mood: initialThisWeek?.overall_mood || null,
        });
    }, [initialThisWeek, currentWeekStart]);

    const moodOptions = [
        { value: 'excellent', label: 'Sangat Baik', icon: '😊', color: 'bg-green-100 border-green-300' },
        { value: 'good', label: 'Baik', icon: '🙂', color: 'bg-blue-100 border-blue-300' },
        { value: 'neutral', label: 'Biasa', icon: '😐', color: 'bg-gray-100 border-gray-300' },
        { value: 'needs_work', label: 'Perlu Perbaikan', icon: '😔', color: 'bg-amber-100 border-amber-300' },
    ];

    const autoSave = (nextEntry) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            axios.post('/api/muslim/weekly-muhasabah', nextEntry);
        }, 1000);
    };

    const addAchievement = () => {
        if (newAchievement.trim()) {
            const nextEntry = {
                ...entry,
                achievements: [...entry.achievements, newAchievement.trim()]
            };
            setEntry(nextEntry);
            setNewAchievement('');
            autoSave(nextEntry);
        }
    };

    const addChallenge = () => {
        if (newChallenge.trim()) {
            const nextEntry = {
                ...entry,
                challenges: [...entry.challenges, newChallenge.trim()]
            };
            setEntry(nextEntry);
            setNewChallenge('');
            autoSave(nextEntry);
        }
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            const nextEntry = {
                ...entry,
                next_week_goals: [...entry.next_week_goals, newGoal.trim()]
            };
            setEntry(nextEntry);
            setNewGoal('');
            autoSave(nextEntry);
        }
    };

    const updateField = (field, value) => {
        const nextEntry = { ...entry, [field]: value };
        setEntry(nextEntry);
        autoSave(nextEntry);
    };

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

                    {/* Left — Achievements & Mood */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-indigo-100/80 rotate-1"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Muhasabah Mingguan</h3>
                            <p className="font-note text-gray-400">{weekRange?.start} - {weekRange?.end}</p>
                        </div>

                        {/* Mood Selection */}
                        <div className="mb-8">
                            <h4 className="font-handwriting text-xl font-bold text-gray-700 mb-3">Bagaimana pekanmu?</h4>
                            <div className="flex flex-wrap gap-2">
                                {moodOptions.map((mood) => (
                                    <button
                                        key={mood.value}
                                        onClick={() => updateField('overall_mood', mood.value)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                            entry.overall_mood === mood.value
                                                ? mood.color
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-lg">{mood.icon}</span>
                                        <span className="font-note text-sm">{mood.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Pencapaian</h4>
                            </div>

                            {entry.achievements.length === 0 ? (
                                <div
                                    onClick={() => document.getElementById('achievement-input').focus()}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-emerald-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-emerald-300 mb-2">emoji_events</span>
                                    <p className="font-handwriting text-lg text-emerald-400">Ketuk untuk tambah pencapaian...</p>
                                </div>
                            ) : (
                                <div className="space-y-3 pl-2">
                                    {entry.achievements.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5">check_circle</span>
                                            <p className="font-handwriting text-lg text-gray-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-start gap-3 mt-3">
                                <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                <input
                                    id="achievement-input"
                                    type="text"
                                    value={newAchievement}
                                    onChange={(e) => setNewAchievement(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                                    className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-lg text-gray-500 placeholder-gray-300"
                                    placeholder="Tambah pencapaian..."
                                />
                            </div>
                        </div>

                        {/* Gratitude */}
                        <div className="bg-amber-100 p-5 shadow-sticky rotate-[-1deg] border border-amber-200">
                            <div className="washi-tape w-16 h-4 bg-yellow-200/60 rotate-[-3deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-handwriting text-base text-amber-800 mb-3">Syukur Pekan Ini</h4>
                            {entry.gratitude ? (
                                <textarea
                                    value={entry.gratitude}
                                    onChange={(e) => updateField('gratitude', e.target.value)}
                                    className="w-full bg-transparent border-none resize-none font-handwriting text-base text-gray-700 leading-relaxed focus:ring-0 outline-none"
                                    rows={3}
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('gratitude', ' ')}
                                    className="bg-white/40 rounded-lg p-4 text-center cursor-pointer hover:bg-white/60"
                                >
                                    <p className="font-handwriting text-amber-400">Ketuk untuk menulis syukur...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — Challenges & Goals */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-rose-100/70 rotate-[3deg]"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">Evaluasi & Rencana</h3>
                            <p className="font-note text-gray-400">Perbaikan untuk pekan depan</p>
                        </div>

                        {/* Challenges */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-orange-400">trending_up</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Tantangan</h4>
                            </div>

                            {entry.challenges.length === 0 ? (
                                <div
                                    onClick={() => document.getElementById('challenge-input').focus()}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-orange-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-orange-300 mb-2">trending_up</span>
                                    <p className="font-handwriting text-lg text-orange-400">Ketuk untuk tambah tantangan...</p>
                                </div>
                            ) : (
                                <div className="space-y-3 pl-2">
                                    {entry.challenges.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">arrow_circle_up</span>
                                            <p className="font-handwriting text-base text-gray-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-start gap-3 mt-3">
                                <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                <input
                                    id="challenge-input"
                                    type="text"
                                    value={newChallenge}
                                    onChange={(e) => setNewChallenge(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
                                    className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-base text-gray-500 placeholder-gray-300"
                                    placeholder="Tambah tantangan..."
                                />
                            </div>
                        </div>

                        {/* Lessons Learned */}
                        <div className="mb-8">
                            <h4 className="font-handwriting text-xl font-bold text-gray-700 mb-3">Pelajaran yang Didapat</h4>
                            {entry.lessons_learned ? (
                                <textarea
                                    value={entry.lessons_learned}
                                    onChange={(e) => updateField('lessons_learned', e.target.value)}
                                    className="w-full bg-white/60 border border-gray-100 rounded-xl p-4 font-note text-base text-gray-700 leading-relaxed focus:ring-2 focus:ring-primary/20"
                                    rows={3}
                                    placeholder="Apa yang kamu pelajari minggu ini?"
                                />
                            ) : (
                                <div
                                    onClick={() => updateField('lessons_learned', ' ')}
                                    className="bg-white/40 rounded-xl p-6 border border-dashed border-blue-200 cursor-pointer hover:bg-white/60 transition-colors text-center"
                                >
                                    <span className="material-symbols-outlined text-4xl text-blue-300 mb-2">lightbulb</span>
                                    <p className="font-handwriting text-lg text-blue-400">Ketuk untuk menulis pelajaran...</p>
                                </div>
                            )}
                        </div>

                        {/* Next Week Goals */}
                        <div className="bg-green-100 p-5 shadow-sticky rotate-[1deg] relative z-10 border border-green-200 mb-6">
                            <h4 className="font-handwriting text-base text-green-800 mb-3">Target Pekan Depan</h4>

                            {entry.next_week_goals.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {entry.next_week_goals.map((goal, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">flag</span>
                                            <p className="font-handwriting text-base text-gray-700">{goal}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                                    className="flex-1 bg-white/60 border border-green-200 rounded-lg px-3 py-2 font-note text-sm placeholder-gray-400"
                                    placeholder="Tambah target..."
                                />
                                <button onClick={addGoal} className="px-3 py-2 bg-green-200 text-green-700 rounded-lg">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Motivational note */}
                        <div className="bg-yellow-100 p-4 shadow-sticky rotate-[-2deg] relative z-10 border border-yellow-200">
                            <p className="font-handwriting text-base text-gray-800 text-center italic leading-relaxed">
                                "Hisablah dirimu sebelum kamu dihisab, dan timbanglah amalmu sebelum amalmu ditimbang."
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-1">— Umar bin Khattab radhiyallahu 'anhu</p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
