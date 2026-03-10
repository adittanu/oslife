import React, { useState, useCallback } from 'react';
import ModeSwitcher from '@/Components/ModeSwitcher';
import SearchModal from '@/Components/SearchModal';

export default function Header({ title, subtitle, titleFontClass = "font-elegant", onMenuToggle }) {
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearchClose = useCallback((action) => {
        if (action === 'toggle') {
            setSearchOpen(prev => !prev);
        } else {
            setSearchOpen(false);
        }
    }, []);

    return (
        <>
            <header className="shrink-0 z-20">
                <div className="h-20 flex items-center justify-between px-4 md:px-8 bg-transparent">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={onMenuToggle}
                            className="md:hidden w-10 h-10 rounded-xl bg-white/80 border border-orange-100 flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <div className="flex flex-col">
                            <h2 className={`text-2xl md:text-4xl ${titleFontClass} font-bold text-gray-800 tracking-tight`}>{title}</h2>
                            <p className="text-xs md:text-sm font-note text-gray-500 italic">{subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Desktop mode switcher */}
                        <ModeSwitcher id="tour-mode-switcher" className="hidden md:flex bg-white/50 backdrop-blur shadow-sm rounded-2xl p-1 border border-orange-100" />
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-orange-100 text-gray-400 flex items-center justify-center shadow-sm relative group hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[22px] md:text-[24px]">search</span>
                        </button>
                        <button
                            id="tour-help-btn"
                            onClick={() => window.__startTour?.()}
                            className="hidden md:flex w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-orange-100 text-gray-400 items-center justify-center shadow-sm relative group hover:text-primary transition-colors"
                            title="Start guided tour"
                        >
                            <span className="material-symbols-outlined text-[22px] md:text-[24px]">help</span>
                        </button>
                    </div>
                </div>
            </header>

            <SearchModal open={searchOpen} onClose={handleSearchClose} />
        </>
    );
}
