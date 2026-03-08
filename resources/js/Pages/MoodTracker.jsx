import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function MoodTracker() {
    const moods = [
        { emoji: 'sentiment_very_satisfied', label: 'Amazing', color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { emoji: 'sentiment_satisfied', label: 'Good', color: 'text-green-500', bg: 'bg-green-50' },
        { emoji: 'sentiment_neutral', label: 'Okay', color: 'text-blue-400', bg: 'bg-blue-50' },
        { emoji: 'sentiment_dissatisfied', label: 'Low', color: 'text-orange-400', bg: 'bg-orange-50' },
        { emoji: 'sentiment_very_dissatisfied', label: 'Rough', color: 'text-red-400', bg: 'bg-red-50' },
    ];

    const weekLog = [
        { day: 'Sen', mood: 0, note: 'Great start to the week!' },
        { day: 'Sel', mood: 1, note: 'Productive day at work' },
        { day: 'Rab', mood: 2, note: 'A bit tired' },
        { day: 'Kam', mood: 1, note: 'Good meeting with team' },
        { day: 'Jum', mood: 0, note: 'Jummah vibes' },
        { day: 'Sab', mood: null, note: null },
        { day: 'Min', mood: null, note: null },
    ];

    return (
        <JournalLayout
            pageTitle="Life OS - Mood Tracker"
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
                            {moods.map((m, i) => (
                                <button
                                    key={i}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-110 cursor-pointer ${
                                        i === 1 ? 'border-primary bg-primary/5 scale-105' : 'border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-4xl ${m.color}`}>{m.emoji}</span>
                                    <span className="font-note text-xs text-gray-500">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What made you feel this way?</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Work', 'Family', 'Health', 'Weather', 'Social', 'Exercise', 'Sleep', 'Food'].map((tag) => (
                                    <button
                                        key={tag}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                            tag === 'Work' ? 'bg-primary/10 text-primary' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/50'
                                        }`}
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
                            ></textarea>
                        </div>
                    </div>

                    {/* Right page — Weekly overview */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-pink-100/70 rotate-[3deg]"></div>
                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-1">This Week</h3>
                            <p className="font-note text-gray-400 text-sm">March 3 - 9</p>
                        </div>

                        {/* Weekly mood chart */}
                        <div className="bg-white/60 rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
                            <div className="flex items-end justify-between gap-2 h-40">
                                {weekLog.map((entry, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        {entry.mood !== null ? (
                                            <>
                                                <span className={`material-symbols-outlined text-2xl ${moods[entry.mood].color}`}>
                                                    {moods[entry.mood].emoji}
                                                </span>
                                                <div
                                                    className={`w-full rounded-t-lg ${moods[entry.mood].bg} border border-gray-100`}
                                                    style={{ height: `${(5 - entry.mood) * 25}px` }}
                                                ></div>
                                            </>
                                        ) : (
                                            <div className="w-full h-8 rounded-t-lg bg-gray-100 border border-dashed border-gray-200"></div>
                                        )}
                                        <span className="font-note text-xs text-gray-400">{entry.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily notes */}
                        <h4 className="font-sketch text-lg text-gray-600 mb-4">Daily Notes</h4>
                        <div className="space-y-3">
                            {weekLog.filter(e => e.note).map((entry, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <span className={`material-symbols-outlined text-lg mt-0.5 ${moods[entry.mood].color}`}>
                                        {moods[entry.mood].emoji}
                                    </span>
                                    <div>
                                        <span className="font-bold text-xs text-gray-400">{entry.day}</span>
                                        <p className="font-note text-gray-600">{entry.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-20 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-pink-300">favorite</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
