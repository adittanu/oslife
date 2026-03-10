import React from 'react';
import { usePage } from '@inertiajs/react';
import SidebarNav from '@/Components/SidebarNav';
import ModeSwitcher from '@/Components/ModeSwitcher';
import { modeConfig, detectMode } from '@/config/modeConfig';

export default function MobileSidebar({ open, onClose }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const config = modeConfig[mode] || modeConfig.life;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer — journal notebook style */}
            <aside
                className={`fixed top-0 left-0 h-full w-[280px] z-50 md:hidden flex flex-col transition-transform duration-300 ease-out overflow-hidden ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Solid notebook paper background */}
                <div className="absolute inset-0 bg-[#FFF8F0]" />

                {/* Dot grid overlay */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#c4a882 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Red margin line */}
                <div className="absolute left-11 top-0 bottom-0 w-[1px] bg-red-300/40" />

                {/* Notebook binding holes */}
                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-start pt-16 gap-[60px]">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border-2 border-gray-300/50 bg-white/50" />
                    ))}
                </div>

                {/* Right edge shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full pl-3">
                    {/* Header */}
                    <div className="p-5 pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={`/images/ciku-${mode === 'life' ? 'default' : mode}.svg`} alt="Mosiku" className="h-10 w-10 rotate-3 drop-shadow-md" />
                                <div className="flex flex-col">
                                    <h1 className="text-primary text-lg font-handwriting font-bold leading-tight">{config.brandTitle}</h1>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{config.label}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Washi tape divider */}
                    <div className="mx-4 mb-1">
                        <div className="h-5 bg-primary/20 rotate-[-0.5deg]"
                            style={{
                                maskImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='50' viewBox='0 0 200 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L200,0 L195,50 L5,50 Z' fill='black'/%3E%3C/svg%3E\")",
                                maskSize: '100% 100%'
                            }}
                        />
                    </div>

                    {/* Mode Switcher — sticky note style */}
                    <div className="mx-4 mt-2 mb-2">
                        <div className="bg-yellow-100 rounded-lg p-1.5 shadow-sm rotate-[-0.3deg] border border-yellow-200/60">
                            <ModeSwitcher compact />
                        </div>
                    </div>

                    {/* Nav */}
                    <SidebarNav onNavigate={onClose} />

                    {/* Bottom doodle */}
                    <div className="px-6 pb-4 pt-2 flex items-center justify-center gap-2 text-gray-300">
                        <span className="text-lg">✿</span>
                        <span className="text-xs font-handwriting text-gray-400/70 italic">made with love</span>
                        <span className="text-lg">✿</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
