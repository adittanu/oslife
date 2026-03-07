import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Notes() {
    return (
        <JournalLayout 
            pageTitle="Life OS Notes Collection Page"
            headerTitle="Notes"
            headerSubtitle="Jotting down life's details."
            titleFontClass="font-elegant"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-green-400 rotate-[-15deg]">local_cafe</span>}
        >
            <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-blue-300">push_pin</span>
            </div>
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-yellow-300">edit</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1200px] h-full min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>
                    
                    <div className="w-full md:w-1/2 p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 grid-lines overflow-y-auto custom-scrollbar">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center md:text-left md:pl-4">
                                <h3 className="font-elegant text-4xl font-bold text-gray-700 mt-2">Recent Notes</h3>
                                <div className="h-0.5 w-32 bg-blue-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-6 mt-8 relative z-10">
                            {/* Note 1 */}
                            <div className="bg-sticky-yellow p-5 rounded-lg shadow-sticky hover:shadow-sticky-hover transition-all cursor-pointer rotate-[-1deg] torn-paper relative border border-yellow-200">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="material-symbols-outlined text-gray-400 rotate-45 text-3xl opacity-50">push_pin</span>
                                </div>
                                <div className="flex justify-between items-start mb-2 mt-2">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Grocery List</h4>
                                    <span className="font-note text-sm text-gray-500">Oct 24</span>
                                </div>
                                <p className="font-note text-lg text-gray-600 line-clamp-2">Milk, eggs, bread, spinach, tomatoes, and some dark chocolate for the weekend.</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-white/50 text-yellow-700 border border-yellow-300">Personal</span>
                                </div>
                            </div>
                            
                            {/* Note 2 */}
                            <div className="bg-sticky-pink p-5 rounded-lg shadow-sticky hover:shadow-sticky-hover transition-all cursor-pointer rotate-[2deg] torn-paper relative border border-pink-200">
                                <div className="absolute -top-3 right-4">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl opacity-50 transform -rotate-12">attach_file</span>
                                </div>
                                <div className="flex justify-between items-start mb-2 mt-2">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Project Ideas</h4>
                                    <span className="font-note text-sm text-gray-500">Oct 22</span>
                                </div>
                                <p className="font-note text-lg text-gray-600 line-clamp-2">Need to brainstorm the new UI layout for the dashboard. Maybe use a card-based design.</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-white/50 text-pink-700 border border-pink-300">Work</span>
                                </div>
                            </div>

                            {/* Note 3 */}
                            <div className="bg-sticky-green p-5 rounded-lg shadow-sticky hover:shadow-sticky-hover transition-all cursor-pointer rotate-[-2deg] torn-paper relative border border-green-200">
                                <div className="absolute -top-3 left-6">
                                    <div className="washi-tape w-16 h-6 bg-green-300/60 rotate-12 left-0 top-0"></div>
                                </div>
                                <div className="flex justify-between items-start mb-2 mt-2">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Friday Reflection</h4>
                                    <span className="font-note text-sm text-gray-500">Oct 20</span>
                                </div>
                                <p className="font-note text-lg text-gray-600 line-clamp-2">Alhamdulillah for another week. Need to focus more on morning adkhar and reading Surah Kahf earlier.</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-white/50 text-green-700 border border-green-300">Sunnah</span>
                                </div>
                            </div>

                            {/* Note 4 */}
                            <div className="bg-sticky-blue p-5 rounded-lg shadow-sticky hover:shadow-sticky-hover transition-all cursor-pointer rotate-[1deg] torn-paper relative border border-blue-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-handwriting text-2xl text-gray-800 font-bold">Book Quotes</h4>
                                    <span className="font-note text-sm text-gray-500">Oct 18</span>
                                </div>
                                <p className="font-note text-lg text-gray-600 line-clamp-2">"The only way to do great work is to love what you do." - Steve Jobs</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-white/50 text-blue-700 border border-blue-300">Creator</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-note text-xl hover:bg-gray-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 mb-4">
                            <span className="material-symbols-outlined">add</span> Create New Note
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="washi-tape bottom-10 -right-4 bg-yellow-100/70 rotate-[-15deg] w-40"></div>
                        
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <input className="bg-transparent border-none focus:ring-0 font-handwriting text-4xl font-bold text-gray-800 p-0 w-full placeholder-gray-300 outline-none" placeholder="Note Title..." type="text" defaultValue="Project Ideas"/>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                <button className="text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-2xl">more_horiz</span></button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 z-10 relative">
                            <span className="font-note text-gray-400 text-lg">Tags:</span>
                            <div className="flex gap-2 relative">
                                <span className="px-3 py-1 rounded-full text-sm font-note bg-pink-100 text-pink-700 border border-pink-200 cursor-pointer hover:bg-pink-200 transition-colors">Work</span>
                                <span className="px-3 py-1 rounded-full text-sm font-note bg-gray-100 text-gray-500 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">add</span> Add Tag</span>
                            </div>
                        </div>

                        <div className="relative w-full flex-1 z-10">
                            <textarea className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-2xl text-gray-800 leading-[2.5rem] focus:ring-0 custom-scrollbar" placeholder="Start writing here..."></textarea>
                        </div>
                        
                        <div className="text-center text-gray-400 font-note text-sm mt-4">
                            Last edited: Today at 10:42 AM
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
