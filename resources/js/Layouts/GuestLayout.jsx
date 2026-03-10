import { Link } from '@inertiajs/react';
import { useCursorMode } from '@/hooks/useCursorMode';

export default function GuestLayout({ children }) {
    // Set default cursor mode (life/pink) for guest pages
    useCursorMode('life');

    return (
        <div className="min-h-screen bg-journal-bg paper-texture flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-white/30">
                <div className="dot-grid absolute inset-0 opacity-30"></div>

                <div className="absolute top-16 left-12 opacity-15 rotate-[-15deg] pointer-events-none">
                    <span className="material-symbols-outlined text-[100px] text-pink-400">auto_stories</span>
                </div>
                <div className="absolute bottom-20 right-16 opacity-15 rotate-[10deg] pointer-events-none">
                    <span className="material-symbols-outlined text-[80px] text-blue-300">edit_note</span>
                </div>
                <div className="absolute top-1/3 right-12 opacity-10 rotate-[20deg] pointer-events-none">
                    <span className="material-symbols-outlined text-[60px] text-green-400">potted_plant</span>
                </div>

                <div className="relative z-10 text-center px-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8">
                        <img src="/images/ciku-default.svg" alt="Mosiku" className="h-16 w-16 rotate-3 drop-shadow-md" />
                    </Link>
                    <h1 className="text-5xl font-elegant text-gray-800 mb-4 leading-tight">Mosiku</h1>
                    <p className="text-xl font-handwriting text-primary mb-6">Semua hidupmu, satu catatan</p>
                    <p className="text-gray-500 font-note text-lg max-w-sm mx-auto">
                        Sistem manajemen hidup all-in-one dengan estetika digital bullet journal.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile branding */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <img src="/images/ciku-default.svg" alt="Mosiku" className="h-12 w-12 rotate-3 drop-shadow-md" />
                            <span className="text-primary text-2xl font-handwriting font-bold">Mosiku</span>
                        </Link>
                    </div>

                    {/* Form card */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 relative overflow-hidden">
                        <div className="washi-tape-accent -top-2 left-1/2 -translate-x-1/2 bg-pink-200/60 w-28 rotate-1"></div>
                        <div className="notebook-spine"></div>
                        <div className="px-8 py-10 pt-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
