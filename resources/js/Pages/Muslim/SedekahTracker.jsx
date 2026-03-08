import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function SedekahTracker() {
    const categories = [
        { name: 'Zakat', icon: 'balance', color: 'bg-emerald-100 text-emerald-600', amount: 2500000, budget: 2500000 },
        { name: 'Infaq', icon: 'volunteer_activism', color: 'bg-blue-100 text-blue-600', amount: 850000, budget: 1000000 },
        { name: 'Sedekah', icon: 'favorite', color: 'bg-pink-100 text-pink-600', amount: 350000, budget: 500000 },
        { name: 'Wakaf', icon: 'mosque', color: 'bg-amber-100 text-amber-600', amount: 1000000, budget: 1000000 },
    ];

    const recentLog = [
        { date: '8 Mar', desc: 'Infaq Jumat - Masjid Al-Ikhlas', category: 'Infaq', amount: 100000 },
        { date: '5 Mar', desc: 'Sedekah ke panti asuhan Darul Aitam', category: 'Sedekah', amount: 200000 },
        { date: '1 Mar', desc: 'Zakat penghasilan bulan Maret', category: 'Zakat', amount: 625000 },
        { date: '28 Feb', desc: 'Wakaf Al-Quran 5 eksemplar', category: 'Wakaf', amount: 500000 },
        { date: '25 Feb', desc: 'Infaq pembangunan mushola', category: 'Infaq', amount: 250000 },
        { date: '20 Feb', desc: 'Sedekah makanan untuk tetangga', category: 'Sedekah', amount: 50000 },
    ];

    const categoryColors = {
        Zakat: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Infaq: 'bg-blue-100 text-blue-700 border-blue-200',
        Sedekah: 'bg-pink-100 text-pink-700 border-pink-200',
        Wakaf: 'bg-amber-100 text-amber-700 border-amber-200',
    };

    const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

    const totalMonth = categories.reduce((sum, c) => sum + c.amount, 0);
    const totalYear = 28750000;

    return (
        <JournalLayout
            pageTitle="Muslim OS - Sedekah Tracker"
            headerTitle="Sedekah Tracker"
            headerSubtitle="Wealth does not decrease from charity"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">savings</span>}
        >
            <div className="absolute bottom-10 left-[35%] opacity-15 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-emerald-300">mosque</span>
            </div>
            <div className="absolute top-40 right-20 opacity-15 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-yellow-300">star_half</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1200px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>

                    {/* Left — Category Breakdown & Totals */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 dot-grid overflow-y-auto custom-scrollbar">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center md:text-left md:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Catatan Sedekah</h3>
                                <div className="h-0.5 w-48 bg-emerald-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                                <p className="font-note text-gray-400 mt-1">Maret 2026</p>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3 mt-6 mb-8 relative z-10">
                            <div className="bg-primary/10 p-4 rounded-2xl border-2 border-dashed border-primary/30 text-center">
                                <span className="font-note text-sm text-gray-500">Bulan Ini</span>
                                <p className="font-handwriting text-2xl font-bold text-primary mt-1">{formatRupiah(totalMonth)}</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300 text-center">
                                <span className="font-note text-sm text-gray-500">Tahun Ini</span>
                                <p className="font-handwriting text-2xl font-bold text-amber-700 mt-1">{formatRupiah(totalYear)}</p>
                            </div>
                        </div>

                        {/* Category Progress */}
                        <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300 relative z-10">
                            <h4 className="font-handwriting text-2xl text-gray-800 font-bold mb-4">Kategori Sedekah</h4>
                            <div className="space-y-5">
                                {categories.map((cat, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center shadow-sm`}>
                                                    <span className="material-symbols-outlined text-base">{cat.icon}</span>
                                                </div>
                                                <span className="font-handwriting text-xl font-bold text-gray-700">{cat.name}</span>
                                            </div>
                                            <span className="font-note text-sm text-gray-500">{formatRupiah(cat.amount)} / {formatRupiah(cat.budget)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
                                            <div
                                                className={`h-full rounded-full transition-all ${cat.name === 'Zakat' ? 'bg-emerald-400' : cat.name === 'Infaq' ? 'bg-blue-400' : cat.name === 'Sedekah' ? 'bg-pink-400' : 'bg-amber-400'}`}
                                                style={{ width: `${Math.min((cat.amount / cat.budget) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hadith Sticky Note */}
                        <div className="bg-yellow-100 p-5 shadow-sticky rotate-[-1deg] mt-8 relative z-10 border border-yellow-200">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-3deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <p className="font-handwriting text-lg text-gray-800 leading-relaxed text-center italic">
                                "Sedekah tidak mengurangi harta. Tidaklah seorang hamba memberi maaf kecuali Allah menambahkan kemuliaan baginya."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">— HR. Muslim no. 2588</p>
                            <div className="absolute -bottom-2 -right-2 opacity-40">
                                <span className="material-symbols-outlined text-3xl text-yellow-600 rotate-12">auto_awesome</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Transaction Log */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-blue-100/70 rotate-[3deg]"></div>

                        <div className="flex justify-between items-start mb-6 z-10 relative mt-4">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-700">Riwayat Donasi</h3>
                        </div>

                        {/* Motivational Badge */}
                        <div className="absolute top-14 right-8 z-20">
                            <div className="w-20 h-20 bg-emerald-400 rounded-full flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(16,185,129,0.4)] rotate-12 border-[3px] border-emerald-200 text-white font-black">
                                <span className="material-symbols-outlined text-2xl mb-0.5">trending_up</span>
                                <span className="text-[9px] uppercase tracking-wider text-center leading-tight">Streak</span>
                                <span className="text-base">12w</span>
                            </div>
                        </div>

                        <div className="relative w-full flex-1 z-10 mt-4">
                            <table className="w-full text-left font-note text-gray-700">
                                <thead>
                                    <tr className="border-b-2 border-gray-400 text-gray-500 text-sm">
                                        <th className="py-2 w-20">Tanggal</th>
                                        <th className="py-2">Keterangan</th>
                                        <th className="py-2 text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLog.map((item, i) => (
                                        <tr key={i} className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 text-gray-500 text-sm">{item.date}</td>
                                            <td className="py-3 text-sm">
                                                {item.desc}
                                                <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${categoryColors[item.category]}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right text-emerald-600 font-semibold text-sm">{formatRupiah(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 flex justify-center">
                                <button className="font-note text-base text-primary flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-[20px]">add_circle</span> Tambah Donasi
                                </button>
                            </div>
                        </div>

                        {/* Green sticky with dua */}
                        <div className="bg-green-100 p-4 shadow-sticky rotate-[2deg] mt-6 relative z-10 border border-green-200">
                            <p className="font-handwriting text-base text-gray-700 text-center">
                                "Ya Allah, berkahilah rezeki kami dan jadikanlah tangan kami selalu menjadi tangan di atas."
                            </p>
                            <div className="flex justify-center mt-2 gap-1">
                                <span className="material-symbols-outlined text-green-500 text-sm">eco</span>
                                <span className="font-note text-xs text-gray-400">Aamiin</span>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[80px] text-emerald-300">volunteer_activism</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
