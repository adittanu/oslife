import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function IdeaDump() {
    return (
        <JournalLayout 
            pageTitle="Life OS Idea Dump Canvas"
            headerTitle="Idea Dump"
            headerSubtitle="Capture everything before it flies away."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">emoji_objects</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>
                    <div className="absolute -top-4 right-1/4 z-30 drop-shadow-md rotate-6">
                        <span className="material-symbols-outlined text-gray-400 text-5xl">attachment</span>
                    </div>
                    <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none z-0 rotate-45 mix-blend-multiply">
                        <div className="w-32 h-32 rounded-full border-[6px] border-amber-800"></div>
                        <div className="w-28 h-28 rounded-full border-[2px] border-amber-800 absolute top-2 left-2"></div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 dot-grid overflow-hidden">
                        <div className="washi-tape top-4 left-20 bg-blue-200/50"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Mind Map & Sketches</h3>
                                <p className="font-note text-gray-400">Free-form thinking zone.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl text-gray-400">gesture</span>
                                <span className="material-symbols-outlined text-2xl text-gray-400">edit</span>
                            </div>
                        </div>

                        <div className="relative h-[600px] w-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white p-4 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] shadow-md border-2 border-gray-800 flex items-center justify-center w-40 h-32 rotate-[-2deg]">
                                    <span className="font-sketch text-2xl font-bold text-gray-800 text-center leading-none">The Big<br/>Project?</span>
                                </div>
                            </div>
                            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                                <path d="M280 300 Q 200 200 150 150" fill="none" stroke="#9CA3AF" strokeDasharray="5,5" strokeWidth="2"></path>
                                <path d="M350 320 Q 450 400 500 450" fill="none" stroke="#9CA3AF" strokeDasharray="5,5" strokeWidth="2"></path>
                                <path d="M300 350 Q 250 450 200 500" fill="none" stroke="#9CA3AF" strokeDasharray="5,5" strokeWidth="2"></path>
                                <path d="M380 280 Q 500 200 550 150" fill="none" stroke="#9CA3AF" strokeDasharray="5,5" strokeWidth="2"></path>
                            </svg>

                            <div className="absolute top-[100px] left-[50px] z-10 rotate-[-5deg]">
                                <div className="bg-sticky-pink/60 p-3 shadow-sm border border-pink-200 max-w-[150px] rounded-lg">
                                    <span className="font-handwriting text-lg text-gray-700 leading-tight">Maybe a mobile app for plant care? 🌿</span>
                                </div>
                            </div>
                            <div className="absolute bottom-[100px] right-[50px] z-10 rotate-[3deg]">
                                <div className="bg-sticky-blue/60 p-3 shadow-sm border border-blue-200 max-w-[160px] rounded-lg">
                                    <span className="font-handwriting text-lg text-gray-700 leading-tight">Focus on community features first!</span>
                                </div>
                            </div>
                            <div className="absolute bottom-[80px] left-[80px] z-10 rotate-[-2deg]">
                                <div className="border-2 border-dashed border-gray-400 p-2 rounded-full w-24 h-24 flex items-center justify-center bg-white/50">
                                    <span className="font-sketch text-lg text-gray-500">Budget?</span>
                                </div>
                            </div>
                            <div className="absolute top-[120px] right-[40px] z-10 rotate-[6deg]">
                                <div className="bg-sticky-green/40 p-2 shadow-sm border-t-4 border-green-300 w-[140px] h-[100px] flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-green-600 mb-1">monetization_on</span>
                                        <span className="block font-note text-sm">Revenue model</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-[50px] right-[200px] opacity-60 rotate-12">
                                <svg height="60" viewBox="0 0 100 100" width="60" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10,90 Q50,10 90,90" fill="none" stroke="#FCD34D" strokeWidth="3"></path>
                                    <circle cx="50" cy="50" fill="#FCD34D" r="10"></circle>
                                    <path d="M50,40 L50,10" stroke="#FCD34D" strokeWidth="3"></path>
                                    <path d="M50,60 L50,90" stroke="#FCD34D" strokeWidth="3"></path>
                                    <path d="M40,50 L10,50" stroke="#FCD34D" strokeWidth="3"></path>
                                    <path d="M60,50 L90,50" stroke="#FCD34D" strokeWidth="3"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 z-20 opacity-80 rotate-[-15deg]">
                            <span className="material-symbols-outlined text-4xl text-gray-400">edit_note</span>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative bg-opacity-50">
                        <div className="washi-tape top-4 right-20 bg-pink-200/50 rotate-[2deg]"></div>
                        <div className="mb-8 flex justify-between items-end">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                List of Sparks
                                <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
                            </h3>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                + Add Spark
                            </button>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="relative group ml-4">
                                <div className="absolute -top-3 left-[40%] w-24 h-6 bg-yellow-200/40 blur-[1px] rotate-[-2deg] z-20"></div> 
                                <div className="bg-sticky-yellow p-4 shadow-sticky sticky-note-tilt-3 transition-transform hover:scale-[1.02] duration-300 relative z-10 w-5/6">
                                    <div className="absolute -right-2 -top-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm transform rotate-12">!</div>
                                    <p className="font-handwriting text-xl text-gray-800 leading-snug">
                                        Don't forget to email Sarah about the <span className="bg-yellow-300/50 px-1">collaboration</span> opportunity before Friday!
                                    </p>
                                    <div className="mt-2 flex justify-end">
                                        <span className="text-xs font-note text-gray-500">2 mins ago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group ml-12">
                                <div className="absolute -top-3 right-[20%] w-20 h-6 bg-blue-200/40 blur-[1px] rotate-[1deg] z-20"></div> 
                                <div className="bg-white p-6 shadow-md transform rotate-[2deg] hover:rotate-[1deg] transition-transform w-5/6 torn-paper-clip relative z-10">
                                    <h4 className="font-sketch text-lg text-blue-600 mb-1">Book Idea 📚</h4>
                                    <p className="font-note text-lg text-gray-600 leading-relaxed">
                                        "The Silent Ocean" - A mystery novel set in an underwater research facility.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase">Fiction</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase">Draft</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group ml-2">
                                <div className="bg-sticky-green p-4 shadow-sticky sticky-note-tilt-1 transition-transform hover:scale-[1.02] duration-300 w-3/4 relative z-10 border-l-4 border-green-300">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600 text-xl mt-1">check_circle</span>
                                        <div>
                                            <p className="font-handwriting text-xl text-gray-800 leading-snug">
                                                Buy new watercolor set. The Winsor & Newton travel kit looks perfect.
                                            </p>
                                            <div className="mt-2 w-full h-1 bg-green-200 rounded-full overflow-hidden">
                                                <div className="w-2/3 h-full bg-green-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group ml-8">
                                <div className="absolute -top-3 left-[10%] w-24 h-8 bg-pink-200/50 blur-[1px] rotate-[3deg] z-20"></div> 
                                <div className="bg-sticky-pink p-5 shadow-sticky sticky-note-tilt-2 transition-transform hover:scale-[1.02] duration-300 w-5/6 relative z-10">
                                    <div className="absolute top-2 right-2 opacity-30">
                                        <span className="material-symbols-outlined text-4xl">favorite</span>
                                    </div>
                                    <p className="font-handwriting text-2xl text-gray-700 text-center font-bold">
                                        "Creativity takes courage."
                                    </p>
                                    <p className="text-center font-note text-gray-500 text-sm mt-1">- Matisse</p>
                                </div>
                            </div>

                            <div className="absolute bottom-20 right-4 rotate-12 opacity-80 pointer-events-none">
                                <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
