import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function TaskLog() {
    return (
        <JournalLayout 
            pageTitle="Life OS Task Log Journal"
            headerTitle="Task Log"
            headerSubtitle="Getting things done, one day at a time."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-yellow-400 rotate-[-15deg]">schedule</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-pink-300">stars</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>
                    
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines overflow-hidden">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div className="w-full text-center">
                                <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Daily Task List</h3>
                                <div className="h-0.5 w-32 bg-blue-200 mx-auto mt-2 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative h-full w-full px-2 space-y-8 mt-10">
                            {[
                                { id: 'task1', text: 'Finish presentation deck for meeting', tag: 'Work', type: 'blue', rotate: '-2deg', checked: false },
                                { id: 'task2', text: 'Call mom', tag: 'Personal', type: 'purple', rotate: '1deg', checked: false },
                                { id: 'task3', text: 'Read Surah Al-Kahf', tag: 'Sunnah', type: 'green', rotate: '-1deg', checked: true },
                                { id: 'task4', text: 'Grocery shopping', tag: 'Personal', type: 'purple', rotate: '2deg', checked: false }
                            ].map((task) => (
                                <div key={task.id} className="flex items-center gap-4 group">
                                    <div className="relative">
                                        <input 
                                            defaultChecked={task.checked}
                                            className="task-checkbox peer w-5 h-5 text-pink-500 bg-transparent border-2 border-gray-400 rounded-sm focus:ring-pink-500 focus:ring-offset-page-bg cursor-pointer" 
                                            id={task.id} 
                                            type="checkbox"
                                        />
                                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white opacity-0 peer-checked:opacity-100 text-[18px] font-bold">check</span>
                                    </div>
                                    <label className="font-handwriting text-3xl text-gray-700 cursor-pointer flex-1 transition-all flex items-center justify-between" htmlFor={task.id}>
                                        <span>{task.text}</span>
                                        <span className={`px-3 py-1 bg-sticky-${task.type} text-${task.type}-700 text-xs font-sans font-bold rounded-full transform rotate-[${task.rotate}]`}>
                                            {task.tag}
                                        </span>
                                    </label>
                                </div>
                            ))}

                            <div className="flex items-center gap-4 mt-8">
                                <span className="material-symbols-outlined text-gray-400">add</span>
                                <input className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-2xl text-gray-500 placeholder-gray-400" placeholder="Add a new task..." type="text"/>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10">
                            <img alt="Coffee cup doodle" className="w-20 opacity-40 mix-blend-multiply rotate-[-5deg]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxh5TfhyVlAszP-4nbiWB3U1QCy6om-TZJ1VuRIOCgAlVwm5LUtnM_rjvLdGtIo8euUDfHbYutqvvskbLLWr4KzNXR1-flONpCMy6USyLocGz5Ey6jLsNKcrb6KRqDXEXVsFsGjP4VHjho_HZWWpsq3Lc620H8rkFm3uQu-O_zbXGEr-LQyq7hFHcnosRiyVOnjibbkpQwpN2hOhwp3a7Z6H00vX2xU8pMAOvIbBMPz4Fxp-6wI9a7vHmHGyfK7bH0Rx5UpBDDvLA"/>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative dot-grid overflow-hidden">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="mb-8 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-2">Habit Tracker</h3>
                        </div>

                        <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-gray-100 mb-10 backdrop-blur-sm relative">
                            <div className="washi-tape -top-3 -left-4 bg-yellow-200/60 rotate-[-5deg] w-20"></div>
                            <table className="w-full text-left font-handwriting text-xl text-gray-700">
                                <thead>
                                    <tr>
                                        <th className="pb-4 font-note text-lg text-gray-500 w-1/2">Habit</th>
                                        {['M','T','W','T','F','S','S'].map((day, i) => (
                                            <th key={i} className="pb-4 text-center text-sm font-sans text-gray-400 w-8">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100/50">
                                        <td className="py-2">Drink Water (8 glasses)</td>
                                        <td className="text-center"><span className="material-symbols-outlined text-blue-400 text-lg">water_drop</span></td>
                                        <td className="text-center"><span className="material-symbols-outlined text-blue-400 text-lg">water_drop</span></td>
                                        <td className="text-center"><span className="material-symbols-outlined text-blue-400 text-lg">water_drop</span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                    </tr>
                                    <tr className="border-b border-gray-100/50">
                                        <td className="py-2">Read 10 pages</td>
                                        <td className="text-center"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Exercise 30 mins</td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="material-symbols-outlined text-primary text-lg">fitness_center</span></td>
                                        <td class="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                        <td className="text-center"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-4 flex flex-col items-center">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Quick Notes</h3>
                        </div>
                        
                        <div className="relative w-full h-48 bg-sticky-yellow p-6 shadow-sticky transform rotate-[1deg] group transition-transform hover:rotate-0">
                            <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 bg-pink-200/50 rotate-[-2deg] w-24 z-20 shadow-sm mix-blend-multiply"></div>
                            <textarea className="w-full h-full bg-transparent border-none resize-none font-note text-xl text-gray-800 leading-relaxed focus:ring-0 custom-scrollbar outline-none" placeholder="Jot down random thoughts here..."></textarea>
                        </div>
                        
                        <div className="absolute bottom-12 right-12 opacity-60 z-0 rotate-12">
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
