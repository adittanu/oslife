import { Link, usePage } from '@inertiajs/react';
import React from 'react';

function SidebarLink({ href, icon, label, iconClass = '' }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold ${
                isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-500 hover:bg-white/80'
            }`}
            href={href}
        >
            <span className={`material-symbols-outlined ${iconClass} ${isActive ? 'fill-1' : ''}`}>{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}

function CollectionLink({ href, icon, label, iconClass = '' }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all ${
                isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-600 hover:bg-white/80 font-medium'
            }`}
            href={href}
        >
            <span className={`material-symbols-outlined text-[18px] ${iconClass} ${isActive ? 'fill-1' : ''}`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}

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
                <SidebarLink href="/daily-spread" icon="auto_stories" label="Daily Spread" />
                <SidebarLink href="/task-log" icon="edit_calendar" label="Task Log" />
                <SidebarLink href="/habit-tracker" icon="track_changes" label="Habit Tracker" />

                <div className="mt-6 mb-2 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Collections</div>
                <div className="space-y-1">
                    <CollectionLink href="/notes" icon="edit_document" label="Notes" />
                    <CollectionLink href="/finances" icon="account_balance_wallet" label="Finances" />
                    <CollectionLink href="/idea-dump" icon="lightbulb" label="Idea Dump" />
                    <CollectionLink href="/gratitude" icon="favorite" label="Gratitude" />
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
