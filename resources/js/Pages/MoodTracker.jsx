import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const MOOD_OPTIONS = [
    { value: 5, emoji: 'sentiment_very_satisfied', label: 'Amazing', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { value: 4, emoji: 'sentiment_satisfied', label: 'Good', color: 'text-green-500', bg: 'bg-green-50' },
    { value: 3, emoji: 'sentiment_neutral', label: 'Okay', color: 'text-blue-400', bg: 'bg-blue-50' },
    { value: 2, emoji: 'sentiment_dissatisfied', label: 'Low', color: 'text-orange-400', bg: 'bg-orange-50' },
    { value: 1, emoji: 'sentiment_very_dissatisfied', label: 'Rough', color: 'text-red-400', bg: 'bg-red-50' },
];

const MOOD_TAGS = ['Work', 'Family', 'Health', 'Weather', 'Social', 'Exercise', 'Sleep', 'Food'];

export default function MoodTracker({ moods: propMoods, todayMood: propTodayMood }) {
    const { auth } = usePage().props;
    const isAuth = !!auth?.user;
    const [moods, setMoods] = useState(propMoods || []);
    const [todayMood, setTodayMood] = useState(propTodayMood || null);
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [journalEntry, setJournalEntry] = useState('');

    const today = new Date().toISOString().split('T')[0];
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    useEffect(() => {
        setMoods(propMoods || []);
        setTodayMood(propTodayMood || null);
        if (propTodayMood) {
            setSelectedMood(propTodayMood.mood_level);
            setSelectedTags(propTodayMood.tags || []);
            setJournalEntry(propTodayMood.note || '');
        } else {
            setSelectedMood(null);
            setSelectedTags([]);
            setJournalEntry('');
        }
    }, [propMoods, propTodayMood]);

    const autoSave = useRef(null);
    const upsertMoodInWeek = (entry) => {
        setMoods((prev) => {
            const next = [...prev.filter((item) => item.date !== entry.date), entry];
            next.sort((a, b) => a.date.localeCompare(b.date));
            return next;
        });
    };

    const triggerAutoSave = (overrides = {}) => {
        if (!isAuth) return;

        clearTimeout(autoSave.current);
        autoSave.current = setTimeout(() => {
            axios.post('/api/mood', {
                date: today,
                mood_level: overrides.mood_level ?? selectedMood ?? todayMood?.mood_level ?? 3,
                note: overrides.note ?? journalEntry,
                tags: overrides.tags ?? selectedTags,
            }).then(({ data }) => {
                setTodayMood(data);
                upsertMoodInWeek(data);
            });
        }, 1000);
    };

    const handleMoodSelect = (moodValue) => {
        setSelectedMood(moodValue);
        triggerAutoSave({ mood_level: moodValue });
    };

    const handleTagToggle = (tag) => {
        const updated = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(updated);
        triggerAutoSave({ tags: updated });
    };

    const handleJournalChange = (e) => {
        const nextValue = e.target.value;
        setJournalEntry(nextValue);
        triggerAutoSave({ note: nextValue });
    };

    // Build week log from moods
    const weekLog = [];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const moodEntry = moods.find(m => m.date === dateStr);
        weekLog.push({
            day: weekDays[i],
            date: dateStr,
            mood: moodEntry ? moodEntry.mood_level : null,
            note: moodEntry ? moodEntry.note : null,
        });
    }

    return (
        <JournalLayout
            pageTitle="Mosiku - Mood Tracker"
            headerTitle="Mood Tracker"
            headerSubtitle="How are you feeling today?"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-yellow-300 rotate-12">mood</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left page — Today's mood */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-yellow-100/80 rotate-1"></div>
                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">How's Your Day?</h3>
                            <p className="font-note text-gray-400 mt-1">Tap to log your mood</p>
                        </div>

                        <div className="flex justify-center gap-4 mb-10">
                            {MOOD_OPTIONS.map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => handleMoodSelect(m.value)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-110 cursor-pointer ${
                                        selectedMood === m.value ? 'border-primary bg-primary/5 scale-105' : 'border-transparent hover:border-gray-200'
                                    } ${!isAuth ? 'opacity-60' : ''}`}
                                    disabled={!isAuth}
                                >
                                    <span className={`material-symbols-outlined text-4xl ${m.color}`}>{m.emoji}</span>
                                    <span className="font-note text-xs text-gray-500">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What made you feel this way?</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {MOOD_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                            selectedTags.includes(tag)
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/50'
                                        } ${!isAuth ? 'opacity-60' : ''}`}
                                        disabled={!isAuth}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-sticky-yellow p-5 shadow-sticky rotate-[-1deg]">
                            <p className="font-note text-gray-400 text-sm mb-2">Journal entry</p>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-xl text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[120px]"
                                placeholder="Write about your day..."
                                value={journalEntry}
                                onChange={handleJournalChange}
                                disabled={!isAuth}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right page — Weekly overview */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-pink-100/70 rotate-[3deg]"></div>
                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-1">This Week</h3>
                            <p className="font-note text-gray-400 text-sm">{weekLog[0]?.date} - {weekLog[6]?.date}</p>
                        </div>

                        {/* Weekly mood chart */}
                        <div className="bg-white/60 rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
                            <div className="flex items-end justify-between gap-2 h-40">
                                {weekLog.map((entry, i) => {
                                    const moodData = MOOD_OPTIONS.find(m => m.value === entry.mood);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            {entry.mood !== null ? (
                                                <>
                                                    <span className={`material-symbols-outlined text-2xl ${moodData?.color}`}>
                                                        {moodData?.emoji}
                                                    </span>
                                                    <div
                                                        className={`w-full rounded-t-lg ${moodData?.bg} border border-gray-100`}
                                                        style={{ height: `${entry.mood * 15}px` }}
                                                    ></div>
                                                </>
                                            ) : (
                                                <div className="w-full h-8 rounded-t-lg bg-gray-100 border border-dashed border-gray-200"></div>
                                            )}
                                            <span className="font-note text-xs text-gray-400">{entry.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Daily notes */}
                        <h4 className="font-sketch text-lg text-gray-600 mb-4">Daily Notes</h4>
                        <div className="space-y-3">
                            {weekLog.filter(e => e.note).map((entry, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <span className={`material-symbols-outlined text-lg mt-0.5 ${MOOD_OPTIONS.find(m => m.value === entry.mood)?.color}`}>
                                        {MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji}
                                    </span>
                                    <div>
                                        <span className="font-bold text-xs text-gray-400">{entry.day}</span>
                                        <p className="font-note text-gray-600">{entry.note}</p>
                                    </div>
                                </div>
                            ))}
                            {weekLog.filter(e => e.note).length === 0 && (
                                <p className="font-note text-gray-400 italic">No notes this week yet</p>
                            )}
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-pink-300">favorite</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
