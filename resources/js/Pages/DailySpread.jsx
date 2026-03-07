import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function DailySpread() {
    return (
        <JournalLayout 
            pageTitle="Life OS - Daily Spread Journal Page"
            headerTitle="Daily Spread"
            headerSubtitle="Monday, October 23rd"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">park</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>
                    
                    <div className="absolute -top-6 -right-6 rotate-12 z-20 drop-shadow-md">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-200 border-dashed">
                            <span className="material-symbols-outlined text-4xl text-yellow-500">local_cafe</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-10 -rotate-6 z-20">
                        <span className="w-32 h-8 bg-pink-200/80 block transform skew-x-12 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}></span>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-blue-200/50"></div>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Today's Schedule</h3>
                                <p className="font-note text-gray-400">Time blocking for focus.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl text-orange-400">partly_cloudy_day</span>
                                <span className="font-note text-sm text-gray-500">22°C</span>
                            </div>
                        </div>

                        <div className="relative pl-12 space-y-6 border-l-2 border-primary/20 ml-4 py-2">
                            <div className="relative group">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">07:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <div className="bg-sticky-green/50 p-2 rounded-lg -mt-2 transform rotate-[-1deg] hover:rotate-0 transition-transform w-3/4">
                                    <span className="font-handwriting text-xl text-gray-700">Morning Routine & Fajr</span>
                                </div>
                            </div>
                            <div className="relative group mt-8">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">09:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <div className="bg-sticky-blue/50 p-3 rounded-lg -mt-2 transform rotate-[1deg] hover:rotate-0 transition-transform border border-blue-100 shadow-sm">
                                    <span className="font-handwriting text-xl text-gray-800 font-bold">Deep Work: Q4 Planning</span>
                                    <p className="font-note text-sm text-gray-600">Review metrics and draft proposal.</p>
                                </div>
                            </div>
                            <div className="relative group mt-12">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">12:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <span className="font-handwriting text-xl text-gray-500 italic">Lunch Break 🥗</span>
                            </div>
                            <div className="relative group mt-12">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">14:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <div className="bg-sticky-purple/40 p-2 rounded-lg -mt-2 w-2/3 transform rotate-[-0.5deg]">
                                    <span className="font-handwriting text-xl text-gray-700">Team Sync Meeting</span>
                                </div>
                            </div>
                            <div className="relative group mt-16">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">17:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <div className="bg-sticky-pink/40 p-2 rounded-lg -mt-2 w-1/2 transform rotate-[2deg]">
                                    <span className="font-handwriting text-xl text-gray-700">Gym Session 🏋️‍♀️</span>
                                </div>
                            </div>
                            <div className="relative group mt-12">
                                <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">20:00</span>
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>
                                <span className="font-handwriting text-xl text-gray-600">Wind down & Read</span>
                            </div>
                        </div>

                        <div className="mt-10 bg-sticky-yellow p-4 shadow-sticky sticky-note-tilt-2 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 blur-[2px] rotate-1"></div>
                            <h4 className="font-sketch text-xl text-red-500 mb-2 border-b border-red-200 pb-1">Top 3 Priorities!</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-lg text-gray-800">Finish Project Alpha draft</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg">check_box_outline_blank</span>
                                    <span className="font-handwriting text-lg text-gray-800">Call the bank</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600 text-lg">check_box</span>
                                    <span className="font-handwriting text-lg text-gray-500 line-through decoration-wavy decoration-red-300">Buy groceries</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-pink-200/50 rotate-[2deg]"></div>
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Notes & Reflections
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 paper-lines min-h-[300px] relative rounded-lg">
                                <p className="font-handwriting text-xl text-gray-600 leading-[2rem]">
                                    Today started a bit slow, but the morning coffee really helped. I need to remember to be patient with the new design process. It takes time to get things right. <br/>
                                    <br/>
                                    Note to self: The blue color palette might be too cold for the winter campaign? Maybe add some warm accents? 🤔
                                    <br/><br/>
                                    <span className="text-primary font-bold">#Gratitude:</span> Thankful for the sunny weather today!
                                </p>
                                <div className="absolute bottom-4 right-4 opacity-40 rotate-[-10deg]">
                                    <span className="material-symbols-outlined text-6xl text-purple-300">star</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <h4 className="font-sketch text-xl text-gray-700 mb-2">Habits</h4>
                                <div className="bg-white p-3 rounded-lg border border-gray-200 grid-lines shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col items-center p-2 border border-gray-100 rounded bg-blue-50/50">
                                            <span className="material-symbols-outlined text-blue-400 mb-1">water_drop</span>
                                            <span className="font-note text-xs">Water</span>
                                            <div className="flex gap-1 mt-1">
                                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-2 border border-gray-100 rounded bg-indigo-50/50">
                                            <span className="material-symbols-outlined text-indigo-400 mb-1">bedtime</span>
                                            <span className="font-note text-xs">Sleep</span>
                                            <span className="font-handwriting text-sm font-bold">7h 30m</span>
                                        </div>
                                        <div className="flex flex-col items-center p-2 border border-gray-100 rounded bg-green-50/50">
                                            <span className="material-symbols-outlined text-green-400 mb-1">mosque</span>
                                            <span className="font-note text-xs">Pray</span>
                                            <div className="flex gap-0.5 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-100 border border-green-200"></div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-2 border border-gray-100 rounded bg-yellow-50/50">
                                            <span className="material-symbols-outlined text-yellow-500 mb-1">menu_book</span>
                                            <span className="font-note text-xs">Read</span>
                                            <span className="material-symbols-outlined text-green-500 text-sm mt-1">check</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h4 className="font-sketch text-xl text-gray-700 mb-2">Mood</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 h-[148px] shadow-sm relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-yellow-200/50 rounded-full blur-xl"></div>
                                    <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 bg-pink-200/50 rounded-full blur-xl"></div>
                                    <div className="z-10 text-center">
                                        <span className="material-symbols-outlined text-5xl text-yellow-500 mb-1 drop-shadow-sm">sentiment_satisfied</span>
                                        <p className="font-handwriting text-xl text-gray-600">Optimistic</p>
                                    </div>
                                    <div className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform">
                                        <span className="w-3 h-3 rounded-full bg-gray-200 block"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
