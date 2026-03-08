import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function HabitTracker() {
    return (
        <JournalLayout 
            pageTitle="Life OS Detailed Habit Tracker Page"
            headerTitle="Habit Tracker"
            headerSubtitle="Building better routines, one day at a time."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-green-400 rotate-[-15deg]">potted_plant</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-yellow-300">stars</span>
            </div>
            <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-blue-300">water_bottle</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1600px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden xl:block z-10 shadow-notebook-spine"></div>
                    
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center xl:text-left xl:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Functional Tracker</h3>
                                <div className="h-0.5 w-48 bg-blue-200 mx-auto xl:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative w-full flex-1 bg-white/70 p-4 md:p-8 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                                <h4 className="font-display font-bold text-2xl text-gray-800">September Habits</h4>
                                <div className="flex gap-2 text-base text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                    <span>Days 1 - 15</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto flex-1 custom-scrollbar">
                                <table className="w-full min-w-[900px] border-collapse h-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-display font-semibold text-gray-500 pb-6 w-48 text-lg">Habit</th>
                                            {Array.from({ length: 15 }, (_, i) => (
                                                <th key={i} className="text-center font-display font-bold text-gray-400 text-base pb-6 w-12">{i + 1}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Water Habit */}
                                        <tr className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                                                        <span className="material-symbols-outlined text-xl">water_drop</span>
                                                    </div>
                                                    <span className="font-display font-bold text-gray-700 text-lg tracking-wide">Water 2L</span>
                                                </div>
                                            </td>
                                            {[true, true, false, true, true, true, true, false, true, true, true, false, true, true, true].map((checked, i) => (
                                                <td key={`w${i}`} className="text-center py-6 px-1">
                                                    <div className="tracker-cell water flex justify-center">
                                                        <input defaultChecked={checked} id={`w${i}`} type="checkbox"/>
                                                        <label htmlFor={`w${i}`}></label>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Reading Habit */}
                                        <tr className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                                                        <span className="material-symbols-outlined text-xl">menu_book</span>
                                                    </div>
                                                    <span className="font-display font-bold text-gray-700 text-lg tracking-wide">Read 30m</span>
                                                </div>
                                            </td>
                                            {[true, false, true, true, true, false, true, true, true, true, false, true, true, false, true].map((checked, i) => (
                                                <td key={`r${i}`} className="text-center py-6 px-1">
                                                    <div className="tracker-cell reading flex justify-center">
                                                        <input defaultChecked={checked} id={`r${i}`} type="checkbox"/>
                                                        <label htmlFor={`r${i}`}></label>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Prayer Habit */}
                                        <tr className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                                                        <span className="material-symbols-outlined text-xl">self_improvement</span>
                                                    </div>
                                                    <span className="font-display font-bold text-gray-700 text-lg tracking-wide">Prayer</span>
                                                </div>
                                            </td>
                                            {Array.from({ length: 15 }, (_, i) => (
                                                <td key={`p${i}`} className="text-center py-6 px-1">
                                                    <div className="tracker-cell prayer flex justify-center">
                                                        <input defaultChecked={true} id={`p${i}`} type="checkbox"/>
                                                        <label htmlFor={`p${i}`}></label>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Exercise Habit */}
                                        <tr className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                                                        <span className="material-symbols-outlined text-xl">fitness_center</span>
                                                    </div>
                                                    <span className="font-display font-bold text-gray-700 text-lg tracking-wide">Exercise</span>
                                                </div>
                                            </td>
                                            {[false, true, false, true, false, true, false, true, false, true, false, true, false, true, false].map((checked, i) => (
                                                <td key={`e${i}`} className="text-center py-6 px-1">
                                                    <div className="tracker-cell exercise flex justify-center">
                                                        <input defaultChecked={checked} id={`e${i}`} type="checkbox"/>
                                                        <label htmlFor={`e${i}`}></label>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 flex items-center justify-between border-t-2 border-gray-100 pt-6">
                                <button className="flex items-center gap-2 text-base font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">add</span> Add New Habit
                                </button>
                                <span className="text-sm font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">Showing 15 days view</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="mb-8 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-2 mt-4 xl:mt-0">Habit Insights</h3>
                        </div>
                        <div className="absolute top-12 right-6 xl:right-8 z-20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(250,204,21,0.5)] rotate-12 border-[3px] border-yellow-200 text-yellow-900 font-black">
                                <span className="material-symbols-outlined text-2xl md:text-3xl mb-0.5">local_fire_department</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-center leading-tight">Longest<br/>Streak</span>
                                <span className="text-base md:text-lg">15d</span>
                            </div>
                        </div>
                        <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-gray-100 mb-10 backdrop-blur-sm relative mt-8 md:mt-16">
                            <div className="washi-tape -top-3 -left-4 bg-yellow-200/60 rotate-[-5deg] w-20"></div>
                            <h4 className="font-handwriting text-2xl text-gray-600 mb-6 text-center">Completion Rate</h4>
                            <div className="flex items-end justify-center h-48 gap-6 font-handwriting text-gray-600 border-b-2 border-dashed border-gray-300 pb-2 px-4">
                                <div className="flex flex-col items-center gap-2 h-full justify-end group w-full">
                                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">80%</span>
                                    <div className="w-full max-w-[40px] bg-blue-300 hand-drawn-bar h-[80%] transition-all hover:bg-blue-400"></div>
                                    <span className="text-lg font-bold">Water</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 h-full justify-end group w-full">
                                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">70%</span>
                                    <div className="w-full max-w-[40px] bg-green-300 hand-drawn-bar h-[70%] transition-all hover:bg-green-400"></div>
                                    <span className="text-lg font-bold">Read</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 h-full justify-end group w-full">
                                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">100%</span>
                                    <div className="w-full max-w-[40px] bg-purple-300 hand-drawn-bar h-[100%] transition-all hover:bg-purple-400"></div>
                                    <span className="text-lg font-bold">Prayer</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 h-full justify-end group w-full">
                                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">53%</span>
                                    <div className="w-full max-w-[40px] bg-pink-300 hand-drawn-bar h-[53%] transition-all hover:bg-pink-400"></div>
                                    <span className="text-lg font-bold">Gym</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-center">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Reflection</h3>
                        </div>
                        <div className="relative w-full flex-1 min-h-[200px] bg-transparent p-4 transform group transition-transform">
                            <textarea className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-2xl text-gray-800 leading-[2.5rem] focus:ring-0 custom-scrollbar" placeholder="Thoughts on progress this month..."></textarea>
                        </div>
                        <div className="absolute bottom-12 right-12 opacity-60 z-0 rotate-12 pointer-events-none">
                            <svg height="80" viewBox="0 0 100 100" width="80">
                                <polygon fill="#FCD34D" points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
