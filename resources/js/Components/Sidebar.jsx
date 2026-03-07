import { Link } from '@inertiajs/react';
import React from 'react';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white/60 backdrop-blur-md flex-col border-r border-orange-100 hidden md:flex h-full shrink-0 z-30">
            <div className="p-8 flex items-center gap-3">
                <div className="bg-center bg-no-repeat bg-cover rounded-2xl h-12 w-12 border-2 border-primary rotate-3 shadow-md" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_k8zodvgRy8J2Vg_lS-vpqOiCOMN7YDmjiDQ6rPpf1E9BQdiL5yaBRegMph3ndGJG5iBGCoGeXXoiD8gBnHTIlWdkb-qemjG6P1UGMrF9IOotUALq9sL__D-Qeoaniq5p_wGKkKop7xzg6fNL1yz0jRGw44WbxxNv3fpKFrvWOx2Oz-KVXmDDkuTKFl84eLDUWsFz1JYQ3jVM-GAgy-vMes50uH8ukigGXHVXQ7sDPzC639P7W_Ukma5OSle2SLxGV7Rs8X5KEdc")'}}></div>
                <div className="flex flex-col">
                    <h1 className="text-primary text-xl font-handwriting font-bold leading-tight">My Journal</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Life OS v2.4</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-white/80 transition-all font-semibold" href="/daily-spread">
                    <span className="material-symbols-outlined">auto_stories</span>
                    <span className="text-sm">Daily Spread</span>
                </Link>
                <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-white/80 transition-all font-semibold" href="/task-log">
                    <span className="material-symbols-outlined">edit_calendar</span>
                    <span className="text-sm">Task Log</span>
                </Link>
                <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-white/80 transition-all font-semibold" href="/habit-tracker">
                    <span className="material-symbols-outlined">track_changes</span>
                    <span className="text-sm">Habit Tracker</span>
                </Link>

                <div className="mt-6 mb-2 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Collections</div>
                <div className="space-y-1">
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/80 transition-all font-medium" href="/notes">
                        <span className="material-symbols-outlined text-[18px]">edit_document</span>
                        <span className="text-sm font-medium">Notes</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/80 transition-all font-medium" href="/finances">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        <span className="text-sm font-medium">Finances</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white/80 transition-all" href="/idea-dump">
                        <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                        <span className="text-sm font-medium">Idea Dump</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-white/80 transition-all" href="#">
                        <span className="material-symbols-outlined text-[18px]">palette</span>
                        <span className="text-sm font-medium">Art Projects</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 text-primary font-bold" href="/gratitude">
                        <span className="material-symbols-outlined text-[18px] fill-1">favorite</span>
                        <span className="text-sm font-medium">Gratitude</span>
                    </Link>
                </div>

                <div className="mt-6 mb-2 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Labels</div>
                <div className="space-y-1">
                    <Link className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-500 hover:bg-white/80 transition-all" href="#">
                        <span className="w-2.5 h-2.5 rounded-full bg-sticky-blue border border-blue-200"></span>
                        <span className="text-sm font-medium">Work</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-500 hover:bg-white/80 transition-all" href="#">
                        <span className="w-2.5 h-2.5 rounded-full bg-sticky-purple border border-purple-200"></span>
                        <span className="text-sm font-medium">Personal</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-500 hover:bg-white/80 transition-all" href="#">
                        <span className="w-2.5 h-2.5 rounded-full bg-sticky-green border border-green-200"></span>
                        <span className="text-sm font-medium">Sunnah</span>
                    </Link>
                </div>
            </nav>
            <div className="p-6 border-t border-orange-50 bg-white/20">
                <Link className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-primary transition-colors font-medium" href="#">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">Preferences</span>
                </Link>
            </div>
        </aside>
    );
}
