import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function WeeklyReview() {
    return (
        <JournalLayout
            pageTitle="Life OS - Weekly Review"
            headerTitle="Weekly Review"
            headerSubtitle="Reflect, learn, and plan ahead."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-purple-300 rotate-12">rate_review</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left — This week reflection */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Week 10 Review</h3>
                            <p className="font-note text-gray-400">March 3 - 9, 2026</p>
                        </div>

                        {/* Wins */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Wins This Week</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {[
                                    'Finished the project proposal ahead of deadline',
                                    'Maintained 5-day workout streak',
                                    'Read 2 chapters of Atomic Habits',
                                ].map((win, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                        <p className="font-handwriting text-xl text-gray-700">{win}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-xl text-gray-500 placeholder-gray-300" placeholder="Add a win..." type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Challenges */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-orange-400">warning</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Challenges</h4>
                            </div>
                            <div className="space-y-3 pl-2">
                                {[
                                    'Struggled with focus on Wednesday',
                                    'Skipped morning routine twice',
                                ].map((challenge, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">pending</span>
                                        <p className="font-handwriting text-xl text-gray-700">{challenge}</p>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-gray-300 text-lg mt-0.5">add_circle</span>
                                    <input className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-xl text-gray-500 placeholder-gray-300" placeholder="Add a challenge..." type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Lessons learned */}
                        <div className="bg-sticky-purple p-5 shadow-sticky rotate-[-1deg]">
                            <h4 className="font-sketch text-lg text-purple-800 mb-2 border-b border-purple-200 pb-1">Lessons Learned</h4>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-xl text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[80px]"
                                defaultValue="Need to set specific time blocks for deep work. Morning is my most productive time — protect it."
                            ></textarea>
                        </div>
                    </div>

                    {/* Right — Next week plan */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-blue-100/70 rotate-[3deg]"></div>

                        <div className="text-center mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700">Next Week Plan</h3>
                            <p className="font-note text-gray-400">March 10 - 16, 2026</p>
                        </div>

                        {/* Top priorities */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-red-400">priority_high</span>
                                <h4 className="font-handwriting text-2xl font-bold text-gray-700">Top 3 Priorities</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { num: '1', text: 'Submit final project deliverable', color: 'bg-sticky-pink' },
                                    { num: '2', text: 'Prepare for client presentation', color: 'bg-sticky-blue' },
                                    { num: '3', text: 'Start new habit: journaling before bed', color: 'bg-sticky-green' },
                                ].map((p, i) => (
                                    <div key={i} className={`${p.color} p-4 rounded-xl shadow-sm flex items-start gap-3`}>
                                        <span className="font-handwriting text-2xl font-bold text-gray-400">{p.num}.</span>
                                        <p className="font-handwriting text-xl text-gray-800">{p.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly scores */}
                        <div className="mb-8">
                            <h4 className="font-handwriting text-2xl font-bold text-gray-700 mb-4">This Week's Score</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Productivity', score: 8, color: 'bg-primary' },
                                    { label: 'Health', score: 7, color: 'bg-green-500' },
                                    { label: 'Relationships', score: 6, color: 'bg-blue-500' },
                                    { label: 'Happiness', score: 8, color: 'bg-yellow-500' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/60 rounded-xl p-3 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-note text-sm text-gray-500">{s.label}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-700">{s.score}/10</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score * 10}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gratitude */}
                        <div className="bg-sticky-yellow p-5 shadow-sticky rotate-[1deg]">
                            <h4 className="font-sketch text-lg text-yellow-800 mb-2 border-b border-yellow-300 pb-1">Grateful For This Week</h4>
                            <textarea
                                className="w-full bg-transparent border-none resize-none font-handwriting text-xl text-gray-700 leading-relaxed focus:ring-0 outline-none min-h-[60px]"
                                defaultValue="My supportive team, the rainy morning that made me slow down, and a good cup of coffee."
                            ></textarea>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-yellow-300">stars</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
