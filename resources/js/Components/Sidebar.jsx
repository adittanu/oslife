import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import SidebarNav from '@/Components/SidebarNav';
import { modeConfig, detectMode } from '@/config/modeConfig';

export default function Sidebar() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const config = modeConfig[mode] || modeConfig.life;

    return (
        <aside id="tour-sidebar" className="w-64 bg-white/60 backdrop-blur-md flex-col border-r border-orange-100 hidden md:flex h-full shrink-0 z-30">
            <Link href="/" className="p-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={`/images/ciku-${mode === 'life' ? 'default' : mode}.svg`} alt="Mosiku" className="h-12 w-12 rotate-3 drop-shadow-md" />
                <div className="flex flex-col">
                    <h1 className="text-primary text-xl font-handwriting font-bold leading-tight">{config.brandTitle}</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{config.label}</p>
                </div>
            </Link>

            <SidebarNav />
        </aside>
    );
}
