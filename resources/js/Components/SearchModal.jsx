import React, { useState, useEffect, useRef, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { modeConfig, detectMode } from '@/config/modeConfig';

export default function SearchModal({ open, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const currentMode = detectMode(auth?.user, currentUrl);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Build searchable items from all modes
    const allItems = useMemo(() => {
        const items = [];
        const modeLabels = { life: 'Life', muslim: 'Muslim', creator: 'Creator', work: 'Work' };
        const modeIcons = { life: '🌸', muslim: '🕌', creator: '🎨', work: '💼' };

        // Current mode first, then others
        const modes = [currentMode, ...Object.keys(modeConfig).filter(m => m !== currentMode)];

        for (const mode of modes) {
            const config = modeConfig[mode];
            if (!config) continue;

            const sections = [
                ...config.main.map(item => ({ ...item, section: 'Main' })),
                ...config.collections.map(item => ({ ...item, section: 'Collections' })),
                ...config.tools.map(item => ({ ...item, section: 'Tools' })),
            ];

            for (const item of sections) {
                items.push({
                    label: item.label,
                    href: item.href,
                    icon: item.icon,
                    mode: modeLabels[mode],
                    modeKey: mode,
                    modeIcon: modeIcons[mode],
                    section: item.section,
                    isCurrent: mode === currentMode,
                });
            }
        }

        return items;
    }, [currentMode]);

    const filtered = useMemo(() => {
        if (!query.trim()) return allItems;
        const q = query.toLowerCase();
        return allItems.filter(item =>
            item.label.toLowerCase().includes(q) ||
            item.mode.toLowerCase().includes(q) ||
            item.section.toLowerCase().includes(q)
        );
    }, [query, allItems]);

    // Reset selection when filter changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [filtered]);

    // Focus input on open
    useEffect(() => {
        if (open) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Keyboard shortcut to open (Ctrl+K)
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                onClose?.('toggle');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            navigate(filtered[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const navigate = (item) => {
        onClose();
        router.visit(item.href);
    };

    if (!open) return null;

    // Group filtered items by mode
    const grouped = {};
    for (const item of filtered) {
        const key = item.mode;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    }

    let globalIndex = 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[520px] max-w-[calc(100vw-2rem)] z-[101]">
                <div className="bg-[#FFF8F0] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                        <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search pages, features..."
                            className="flex-1 bg-transparent text-gray-800 font-note text-base outline-none placeholder-gray-400"
                        />
                        <kbd className="hidden md:inline-flex text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">ESC</kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-auto py-2">
                        {filtered.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">search_off</span>
                                <p className="font-note text-gray-400">No results for "{query}"</p>
                            </div>
                        ) : (
                            Object.entries(grouped).map(([modeName, items]) => (
                                <div key={modeName}>
                                    <div className="px-5 py-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                            {items[0].modeIcon} {modeName} Mode
                                        </span>
                                    </div>
                                    {items.map((item) => {
                                        const idx = globalIndex++;
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => navigate(item)}
                                                onMouseEnter={() => setSelectedIndex(idx)}
                                                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                                                    selectedIndex === idx
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className={`material-symbols-outlined text-lg ${selectedIndex === idx ? 'text-primary' : 'text-gray-400'}`}>
                                                    {item.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-note text-sm font-medium">{item.label}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 font-note">{item.section}</span>
                                                {selectedIndex === idx && (
                                                    <span className="material-symbols-outlined text-sm text-primary/50">keyboard_return</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-2.5 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                            <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">↑↓</kbd> navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">↵</kbd> open
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">Ctrl+K</kbd> toggle
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
