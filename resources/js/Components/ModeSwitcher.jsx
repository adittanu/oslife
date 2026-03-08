import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { detectMode, modeConfig } from '@/config/modeConfig';

const modes = [
    { value: 'life', label: 'Life' },
    { value: 'muslim', label: 'Muslim' },
    { value: 'creator', label: 'Creator' },
];

export default function ModeSwitcher({ className = '', compact = false }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const currentMode = detectMode(auth?.user, currentUrl);

    function switchMode(mode) {
        if (mode === currentMode) return;
        if (auth?.user) {
            router.post('/api/mode', { mode }, { preserveScroll: false });
        } else {
            const config = modeConfig[mode] || modeConfig.life;
            router.visit(config.homePath);
        }
    }

    return (
        <div className={className}>
            <div className="flex gap-1">
                {modes.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => switchMode(value)}
                        className={`${compact ? 'px-2 py-1.5 text-[11px]' : 'px-5 py-2 text-xs'} rounded-xl font-bold transition-all ${
                            currentMode === value
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
