import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { modeConfig, detectMode } from '@/config/modeConfig';

function SidebarLink({ href, icon, label, onClick }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold ${
                isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-500 hover:bg-white/80'
            }`}
            href={href}
        >
            <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}

function CollectionLink({ href, icon, label, onClick }) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all ${
                isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-600 hover:bg-white/80 font-medium'
            }`}
            href={href}
        >
            <span className={`material-symbols-outlined text-[18px] ${isActive ? 'fill-1' : ''}`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}

export default function SidebarNav({ onNavigate }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const config = modeConfig[mode] || modeConfig.life;

    return (
        <>
            <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                <div id="tour-main-nav">
                    {config.main.map((item) => (
                        <SidebarLink key={item.href} href={item.href} icon={item.icon} label={item.label} onClick={onNavigate} />
                    ))}
                </div>

                <div className="mt-6 mb-2 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Collections</div>
                <div id="tour-collections" className="space-y-1">
                    {config.collections.map((item) => (
                        <CollectionLink key={item.href} href={item.href} icon={item.icon} label={item.label} onClick={onNavigate} />
                    ))}
                </div>

                <div className="mt-6 mb-2 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Tools</div>
                <div id="tour-tools" className="space-y-1">
                    {config.tools.map((item) => (
                        <CollectionLink key={item.href} href={item.href} icon={item.icon} label={item.label} onClick={onNavigate} />
                    ))}
                </div>
            </nav>
            <div className="p-6 border-t border-orange-50 bg-white/20">
                <Link onClick={onNavigate} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-primary transition-colors font-medium" href="/preferences">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">Preferences</span>
                </Link>
            </div>
        </>
    );
}
