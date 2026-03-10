import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router } from '@inertiajs/react';

export default function SedekahTracker({ todayLogs, monthlyLogs, stats }) {
    const [showForm, setShowForm] = useState(false);
    const [newSedekah, setNewSedekah] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'uang',
        description: '',
        amount: '',
        recipient: '',
    });

    const categories = [
        { name: 'Zakat', icon: 'balance', color: 'emerald' },
        { name: 'Infaq', icon: 'volunteer_activism', color: 'blue' },
        { name: 'Sedekah', icon: 'favorite', color: 'pink' },
        { name: 'Wakaf', icon: 'mosque', color: 'amber' },
    ];

    const formatRupiah = (num) => 'Rp ' + (num || 0).toLocaleString('id-ID');

    const categoryColors = {
        Zakat: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Infaq: 'bg-blue-100 text-blue-700 border-blue-200',
        Sedekah: 'bg-pink-100 text-pink-700 border-pink-200',
        Wakaf: 'bg-amber-100 text-amber-700 border-amber-200',
    };

    const saveSedekah = () => {
        if (!newSedekah.type || !newSedekah.date) return;

        router.post('/api/muslim/sedekah', {
            ...newSedekah,
            amount: parseFloat(newSedekah.amount) || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowForm(false);
                setNewSedekah({
                    date: new Date().toISOString().split('T')[0],
                    type: 'uang',
                    description: '',
                    amount: '',
                    recipient: '',
                });
            },
        });
    };

    const deleteSedekah = (id) => {
        router.delete(`/api/muslim/sedekah/${id}`, { preserveScroll: true });
    };

    // Calculate category totals
    const categoryTotals = categories.map(cat => {
        const total = monthlyLogs?.filter(l => l.type === cat.name).reduce((sum, l) => sum + (l.amount || 0), 0) || 0;
        return { ...cat, total };
    });

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

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1200px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left — Category Breakdown & Totals */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 dot-grid overflow-y-auto custom-scrollbar">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>

                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center md:text-left md:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Catatan Sedekah</h3>
                                <div className="h-0.5 w-48 bg-emerald-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                                <p className="font-note text-gray-400 mt-1">
                                    {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3 mt-6 mb-8 relative z-10">
                            <div className="bg-primary/10 p-4 rounded-2xl border-2 border-dashed border-primary/30 text-center">
                                <span className="font-note text-sm text-gray-500">Bulan Ini</span>
                                <p className="font-handwriting text-2xl font-bold text-primary mt-1">
                                    {formatRupiah(stats?.totalAmount || 0)}
                                </p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300 text-center">
                                <span className="font-note text-sm text-gray-500">Total Donasi</span>
                                <p className="font-handwriting text-2xl font-bold text-amber-700 mt-1">
                                    {stats?.totalCount || 0}x
                                </p>
                            </div>
                        </div>

                        {/* Category Progress */}
                        <div className="bg-white/60 p-5 rounded-2xl border-2 border-dashed border-gray-300 relative z-10">
                            <h4 className="font-handwriting text-2xl text-gray-800 font-bold mb-4">Kategori Sedekah</h4>
                            <div className="space-y-5">
                                {categoryTotals.map((cat, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg bg-${cat.color}-100 text-${cat.color}-600 flex items-center justify-center shadow-sm`}>
                                                    <span className="material-symbols-outlined text-base">{cat.icon}</span>
                                                </div>
                                                <span className="font-handwriting text-xl font-bold text-gray-700">{cat.name}</span>
                                            </div>
                                            <span className="font-note text-sm text-gray-500">{formatRupiah(cat.total)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
                                            <div
                                                className={`h-full rounded-full transition-all bg-${cat.color}-400`}
                                                style={{ width: `${Math.min((cat.total / 1000000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Streak Badge */}
                        <div className="mt-6 flex justify-center">
                            <div className="w-24 h-24 bg-emerald-400 rounded-full flex flex-col items-center justify-center shadow-lg rotate-12 border-4 border-emerald-200 text-white">
                                <span className="material-symbols-outlined text-2xl">trending_up</span>
                                <span className="text-xs uppercase">Streak</span>
                                <span className="text-xl font-bold">{stats?.streak || 0}d</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Transaction Log */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-blue-100/70 rotate-[3deg]"></div>

                        <div className="flex justify-between items-start mb-6 z-10 relative mt-4">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-700">Riwayat Donasi</h3>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span> Tambah
                            </button>
                        </div>

                        {/* Add Form */}
                        {showForm && (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        value={newSedekah.date}
                                        onChange={(e) => setNewSedekah({...newSedekah, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    />
                                    <select
                                        value={newSedekah.type}
                                        onChange={(e) => setNewSedekah({...newSedekah, type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={newSedekah.description}
                                    onChange={(e) => setNewSedekah({...newSedekah, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    placeholder="Keterangan (misal: Infaq Jumat)"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        value={newSedekah.amount}
                                        onChange={(e) => setNewSedekah({...newSedekah, amount: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                        placeholder="Jumlah (Rp)"
                                    />
                                    <input
                                        type="text"
                                        value={newSedekah.recipient}
                                        onChange={(e) => setNewSedekah({...newSedekah, recipient: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                        placeholder="Penerima (opsional)"
                                    />
                                </div>
                                <button
                                    onClick={saveSedekah}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg hover:bg-primary/90"
                                >
                                    Simpan
                                </button>
                            </div>
                        )}

                        {/* Transaction List */}
                        {monthlyLogs?.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-5xl text-gray-300">volunteer_activism</span>
                                </div>
                                <p className="font-handwriting text-xl text-gray-400">Ketuk untuk tambah sedekah...</p>
                                <p className="font-note text-sm text-gray-300 mt-2">Riwayat sedekahmu akan muncul di sini</p>
                            </div>
                        ) : (
                            <div className="relative w-full flex-1 z-10 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left font-note text-gray-700">
                                    <thead>
                                        <tr className="border-b-2 border-gray-400 text-gray-500 text-sm sticky top-0 bg-page-bg">
                                            <th className="py-2 w-20">Tanggal</th>
                                            <th className="py-2">Keterangan</th>
                                            <th className="py-2 text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyLogs?.map((item, i) => (
                                            <tr key={item.id || i} className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-3 text-gray-500 text-sm">
                                                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="py-3 text-sm">
                                                    {item.description || item.type}
                                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${categoryColors[item.type] || 'bg-gray-100 text-gray-700'}`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-emerald-600 font-semibold text-sm">
                                                        {item.amount ? formatRupiah(item.amount) : '-'}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteSedekah(item.id)}
                                                        className="ml-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}