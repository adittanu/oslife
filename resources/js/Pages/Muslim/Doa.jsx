import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router } from '@inertiajs/react';

export default function Doa({ doaList: initialDoaList, categories, stats }) {
    const [doaList, setDoaList] = useState(initialDoaList || []);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoa, setSelectedDoa] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    const stickyColors = ['bg-yellow-50', 'bg-green-50', 'bg-blue-50', 'bg-rose-50', 'bg-amber-50', 'bg-violet-50'];
    const borderColors = ['border-yellow-200', 'border-green-200', 'border-blue-200', 'border-rose-200', 'border-amber-200', 'border-violet-200'];

    const toggleFavorite = (doaId) => {
        router.post('/api/muslim/doa/favorite', { doa_id: doaId }, { preserveScroll: true });
    };

    const markAsRead = (doaName) => {
        router.post('/api/muslim/doa/read', { doa_name: doaName, date: today }, { preserveScroll: true });
    };

    // Filter doa
    const filteredDoa = doaList.filter(doa => {
        const matchesCategory = activeCategory === 'all' || doa.category === activeCategory;
        const matchesSearch = !searchQuery ||
            doa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doa.translation.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Get favorites
    const favorites = doaList.filter(doa => doa.is_favorite);

    return (
        <JournalLayout
            pageTitle="Muslim OS - Doa Collection"
            headerTitle="Doa Collection"
            headerSubtitle="The weapon of a believer"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">volunteer_activism</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-16 right-10 opacity-10 pointer-events-none rotate-[15deg]">
                    <span className="material-symbols-outlined text-[70px] text-primary">auto_stories</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Category tabs */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-4 md:p-6">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {Object.entries(categories || {}).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveCategory(key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-note text-sm transition-all shadow-sm ${
                                        activeCategory === key
                                            ? 'bg-primary text-white shadow-md scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-4 md:p-6">
                        <div className="flex items-center gap-3 bg-white/80 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari doa... (misal: tidur, makan, safar)"
                                className="flex-1 bg-transparent border-none outline-none font-note text-gray-700 placeholder-gray-300 focus:ring-0"
                            />
                            <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined text-sm">bookmark</span>
                                {favorites.length} favorit
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-primary">{stats?.totalDoa || 0}</span>
                                <p className="font-note text-xs text-gray-400">Total Doa</p>
                            </div>
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-green-600">{stats?.memorized || 0}</span>
                                <p className="font-note text-xs text-gray-400">Dihafal</p>
                            </div>
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-amber-600">{stats?.readToday || 0}</span>
                                <p className="font-note text-xs text-gray-400">Dibaca Hari Ini</p>
                            </div>
                        </div>
                    </div>

                    {/* Doa Cards */}
                    {filteredDoa.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-5xl text-gray-300">volunteer_activism</span>
                            </div>
                            <p className="font-handwriting text-xl text-gray-400">Tidak ada doa ditemukan...</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {filteredDoa.map((doa, idx) => (
                                <div key={doa.id || idx} className={`relative ${stickyColors[idx % stickyColors.length]} shadow-notebook rounded-xl ${borderColors[idx % borderColors.length]} border p-6 md:p-8 hover:shadow-lg transition-shadow group`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                                <span className="font-handwriting text-lg font-bold text-primary">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-handwriting text-xl font-bold text-gray-700">{doa.name}</h4>
                                                <span className="font-note text-xs text-gray-400">{categories?.[doa.category] || doa.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => markAsRead(doa.name)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${doa.read_today ? 'bg-green-100 text-green-600' : 'bg-white/80 text-gray-300 hover:text-green-500'}`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{doa.read_today ? 'check_circle' : 'radio_button_unchecked'}</span>
                                            </button>
                                            <button
                                                onClick={() => toggleFavorite(doa.id)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${doa.is_favorite ? 'bg-primary/10 text-primary' : 'bg-white/80 text-gray-300 hover:text-primary/60'}`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{doa.is_favorite ? 'bookmark' : 'bookmark_border'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Arabic text */}
                                    <div className="bg-white/60 rounded-xl p-5 mb-4 border border-white/80 shadow-sm">
                                        <p className="text-2xl md:text-3xl text-gray-800 text-right leading-loose" style={{ fontFamily: 'serif' }} dir="rtl">
                                            {doa.arabic}
                                        </p>
                                    </div>

                                    {/* Latin */}
                                    <p className="font-note text-sm text-gray-500 italic mb-3 leading-relaxed px-1">
                                        {doa.latin}
                                    </p>

                                    {/* Translation */}
                                    <div className="flex items-start gap-2 px-1">
                                        <span className="material-symbols-outlined text-primary/40 text-lg mt-0.5">translate</span>
                                        <p className="font-note text-base text-gray-600 leading-relaxed">
                                            {doa.translation}
                                        </p>
                                    </div>

                                    {/* Memorization progress */}
                                    <div className="mt-4 pt-4 border-t border-white/60">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-note text-xs text-gray-400">Progress Hafalan</span>
                                            <span className="font-note text-xs text-gray-500">{doa.memorized}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${doa.memorized}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bottom quote sticky */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-80 relative rotate-[1deg] hover:rotate-0 transition-transform">
                            <p className="font-handwriting text-lg text-gray-800 leading-snug text-center">
                                "Doa adalah senjata orang mukmin, tiang agama, dan cahaya langit dan bumi."
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-2">
                                - HR. Al-Hakim
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}