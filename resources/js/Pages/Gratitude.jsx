import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Gratitude() {
    return (
        <JournalLayout 
            pageTitle="Life OS Gratitude Journal Page"
            headerTitle="Gratitude Journal"
            headerSubtitle="Cultivating thankfulness every single day."
            titleFontClass="font-elegant"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-pink-300 rotate-12">spa</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>
                    <div className="absolute -top-6 -left-6 z-0 opacity-10 pointer-events-none rotate-[-10deg]">
                        <span className="material-symbols-outlined text-9xl text-pink-500">local_florist</span>
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none z-0 rotate-12">
                        <span className="material-symbols-outlined text-9xl text-yellow-500">sunny</span>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines overflow-hidden">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div className="w-full text-center">
                                <h3 className="font-elegant text-3xl font-bold text-gray-700 mt-2">Things I'm Grateful For</h3>
                                <div className="h-0.5 w-32 bg-pink-200 mx-auto mt-2 rounded-full"></div>
                            </div>
                        </div>
                        
                        <div className="relative h-full w-full px-2 space-y-10 mt-10">
                            <div className="flex gap-4 items-baseline group">
                                <span className="font-elegant text-2xl text-pink-400 w-8">1.</span>
                                <p className="font-handwriting text-3xl text-gray-600 border-b border-transparent leading-relaxed w-full">
                                    The smell of fresh coffee this morning <span className="material-symbols-outlined text-lg text-yellow-600 align-middle ml-1">coffee</span>
                                </p>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0">
                                    <span className="material-symbols-outlined text-pink-300">favorite</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-baseline group">
                                <span className="font-elegant text-2xl text-pink-400 w-8">2.</span>
                                <p className="font-handwriting text-3xl text-gray-600 border-b border-transparent leading-relaxed w-full">
                                    A supportive message from Mom.
                                </p>
                                <div className="absolute left-[30%] -top-4 opacity-30 rotate-12">
                                    <span className="material-symbols-outlined text-3xl text-red-300">favorite</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-baseline group">
                                <span className="font-elegant text-2xl text-pink-400 w-8">3.</span>
                                <p className="font-handwriting text-3xl text-gray-600 border-b border-transparent leading-relaxed w-full">
                                    Finally finishing that difficult project at work!
                                </p>
                                <div className="ml-2 inline-block rotate-12">
                                    <span className="text-2xl">✨</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-baseline group">
                                <span className="font-elegant text-2xl text-pink-400 w-8">4.</span>
                                <p className="font-handwriting text-3xl text-gray-600 border-b border-transparent leading-relaxed w-full">
                                    The sun coming out after the rain.
                                </p>
                            </div>
                            <div className="flex gap-4 items-baseline group">
                                <span className="font-elegant text-2xl text-pink-400 w-8">5.</span>
                                <p className="font-handwriting text-3xl text-gray-400 border-b border-dotted border-gray-300 leading-relaxed w-full italic opacity-50">
                                    Write something...
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-10 left-10">
                            <img alt="Flower doodle" className="w-24 opacity-40 mix-blend-multiply rotate-[-15deg]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqdPueTGeW3RvB3PKh2Qs2ocOBqmsggqpkZx8wzTCZeMJW4CurIBP6-D-VOtp15H_ul8AcIeR0tI2jM5rM7GBAwhWyvgmFdq4HBpQFtkoZwC-KUCsQI5S2m-0rHp6qEOmKtBL_lL7QoH0oHUVRYU7COsvlwgAet3qn0tc9S-Wp3e3_cGfTSQhsi-IixtyhQZvpB8a7Yn1A9SJ8qowkRQ77zyGoMaVnny6CsnsRfCDy2ULZUDGoFnvbm3p3XOXf7DKBXsA-Z9OPF7k"/>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative bg-opacity-50">
                        <div className="washi-tape top-0 right-10 bg-purple-100/70 rotate-[3deg]"></div>
                        <div className="mb-12 flex flex-col items-center">
                            <h3 className="font-elegant text-3xl font-bold text-gray-700 mb-2 flex items-center gap-2">
                                Moments of Joy
                            </h3>
                            <span className="font-note text-gray-400 text-sm">Snapshots of happiness</span>
                        </div>

                        <div className="relative h-[600px] w-full">
                            <div className="absolute top-0 left-4 z-10 rotate-[-3deg] hover:rotate-0 transition-transform duration-300 cursor-pointer group">
                                <div className="bg-white p-3 pb-8 shadow-photo w-56 transform group-hover:scale-105 transition-transform">
                                    <div className="h-40 bg-gray-200 overflow-hidden mb-2">
                                        <img alt="Sunset view" className="w-full h-full object-cover filter sepia-[.3] contrast-[.9]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9lQRClYUzyoTMhEn1q8FSX6KD9ner1TI8Rs5Vev6Fdk4tdVOum_OJsn9TkueU5N0Whf36I4C47tO0IOpMDgBua0wg9fXTwGfv6AC9WDv1r7ggZ86CrEj3CZw9fIxEc6Pjppg74F6GhdnCdjREyKYAoDf1CSdhOr9CSWuKUS5rWzkrkTM58x8dQ47KLrXfeRHb9fSTrnvxaKyzOHT8NfwH9a1_Pty4vNknA4UyFufNRJZSi2pYGIsaYGMIkLFjHw0pfP_m4ZuaB3g"/>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-note text-gray-600 text-lg">Golden hour walk 🌅</p>
                                        <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-1">Oct 12</p>
                                    </div>
                                </div>
                                <div className="absolute -top-3 left-[35%] w-20 h-6 bg-yellow-100/60 blur-[1px] rotate-[-2deg] z-20"></div>
                            </div>
                            
                            <div className="absolute top-20 right-8 z-20 rotate-[4deg] hover:rotate-0 transition-transform duration-300 cursor-pointer group">
                                <div className="bg-white p-3 pb-8 shadow-photo w-48 transform group-hover:scale-105 transition-transform">
                                    <div className="h-40 bg-gray-200 overflow-hidden mb-2">
                                        <img alt="Cat sleeping" className="w-full h-full object-cover grayscale-[0.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM6IHR6TxO6qjn-A9ikpb0QuEGjr7zs0EQU-_DQ6E9zjksASTuNGjO2ybF5UAj_3cQuaE4mTYfRLv52VsMYKhc_NnA2qG7mjaJvlvBNML2_Pbz6NUkYV9X2p_Mk8KDiBnPYphn5G4LcBJ67tuc6lDIsiJG08h-fINCMUCziEkD2IBgV-RgQbDifKTAsPZcoiBzWINO46RFMznSbRfkgKXqRB4UqXiuckvvNFg_I7QGyAAtB8IQfARRWJ6t6hfe0z8u3mNpFIPKAjk"/>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-note text-gray-600 text-lg">Luna sleeping 🐱</p>
                                    </div>
                                </div>
                                <div className="absolute -top-2 right-[20%] w-16 h-8 bg-pink-200/50 rotate-[4deg] z-30 shadow-sm mix-blend-multiply"></div>
                            </div>

                            <div className="absolute bottom-32 left-10 z-10 rotate-[-2deg] group">
                                <div className="bg-sticky-yellow p-4 shadow-sticky w-48 relative">
                                    <div className="absolute -top-3 left-[40%] w-12 h-4 bg-gray-200/40 rotate-[90deg] z-20 rounded-sm shadow-sm"></div>
                                    <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                        "Enjoy the little things, for one day you may look back and realize they were the big things."
                                    </p>
                                    <div className="mt-2 flex justify-center">
                                        <span className="material-symbols-outlined text-pink-400 text-sm">favorite</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-20 z-30 rotate-[-6deg] hover:rotate-[-2deg] transition-transform duration-300 group">
                                <div className="bg-white p-2 pb-6 shadow-photo-rotate w-40">
                                    <div className="h-32 bg-gray-100 overflow-hidden">
                                        <img alt="Coffee cup" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxh5TfhyVlAszP-4nbiWB3U1QCy6om-TZJ1VuRIOCgAlVwm5LUtnM_rjvLdGtIo8euUDfHbYutqvvskbLLWr4KzNXR1-flONpCMy6USyLocGz5Ey6jLsNKcrb6KRqDXEXVsFsGjP4VHjho_HZWWpsq3Lc620H8rkFm3uQu-O_zbXGEr-LQyq7hFHcnosRiyVOnjibbkpQwpN2hOhwp3a7Z6H00vX2xU8pMAOvIbBMPz4Fxp-6wI9a7vHmHGyfK7bH0Rx5UpBDDvLA"/>
                                    </div>
                                    <div className="text-center mt-2">
                                        <p className="font-sketch text-gray-500 text-sm transform -rotate-2">Yummy latte!</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 text-3xl opacity-80 rotate-12">✨</div>
                            </div>

                            <div className="absolute top-[40%] left-[40%] opacity-60 z-0">
                                <svg height="100" viewBox="0 0 100 100" width="100">
                                    <path d="M50 10 Q60 40 90 50 Q60 60 50 90 Q40 60 10 50 Q40 40 50 10" fill="#FEF9C3" stroke="#FCD34D" strokeWidth="1"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
