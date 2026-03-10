import React, { useState, useEffect, useRef } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import axios from 'axios';

export default function QuranJournal({ readingLogs: initialReadingLogs, hifzProgress: initialHifzProgress, tadabburNotes: initialTadabburNotes, stats }) {
    // State for each section
    const [readingLogs, setReadingLogs] = useState(initialReadingLogs || []);
    const [hifzProgress, setHifzProgress] = useState(initialHifzProgress || []);
    const [tadabburNotes, setTadabburNotes] = useState(initialTadabburNotes || []);

    useEffect(() => {
        setReadingLogs(initialReadingLogs || []);
    }, [initialReadingLogs]);

    useEffect(() => {
        setHifzProgress(initialHifzProgress || []);
    }, [initialHifzProgress]);

    useEffect(() => {
        setTadabburNotes(initialTadabburNotes || []);
    }, [initialTadabburNotes]);

    // Form states
    const [newReadingLog, setNewReadingLog] = useState({
        date: new Date().toISOString().split('T')[0],
        juz: '',
        surah: '',
        ayat_start: '',
        ayat_end: '',
        pages: '',
    });

    const [newHifz, setNewHifz] = useState({
        surah: '',
        total_ayat: '',
        memorized: 0,
        status: 'not-started',
    });

    const [newTadabbur, setNewTadabbur] = useState({
        surah: '',
        ayat: '',
        arabic: '',
        reflection: '',
        color: 'bg-blue-50',
    });

    // Auto-save debounce refs
    // Calculate progress stats
    const totalJuz = stats?.juz || readingLogs.reduce((max, log) => Math.max(max, log.juz), 0);
    const totalPages = stats?.pages || readingLogs.reduce((sum, log) => sum + (log.pages || 0), 0);
    const khatamProgress = Math.round((totalJuz / 30) * 100);

    // Color options for tadabbur notes
    const colorOptions = [
        { value: 'bg-blue-50', border: 'border-blue-200' },
        { value: 'bg-green-50', border: 'border-green-200' },
        { value: 'bg-purple-50', border: 'border-purple-200' },
        { value: 'bg-amber-50', border: 'border-amber-200' },
        { value: 'bg-pink-50', border: 'border-pink-200' },
    ];

    // Save reading log
    const saveReadingLog = () => {
        if (!newReadingLog.juz || !newReadingLog.surah) return;

        axios.post('/api/muslim/quran-journal/reading-log', newReadingLog).then(({ data }) => {
                setReadingLogs((prev) => [data, ...prev]);
                setNewReadingLog({
                    date: new Date().toISOString().split('T')[0],
                    juz: '',
                    surah: '',
                    ayat_start: '',
                    ayat_end: '',
                    pages: '',
                });
        });
    };

    // Save hifz progress
    const saveHifz = () => {
        if (!newHifz.surah || !newHifz.total_ayat) return;

        axios.post('/api/muslim/quran-journal/hifz', {
            ...newHifz,
            total_ayat: parseInt(newHifz.total_ayat),
            memorized: parseInt(newHifz.memorized) || 0,
        }).then(({ data }) => {
                setHifzProgress((prev) => {
                    const exists = prev.some((item) => item.id === data.id || item.surah === data.surah);
                    if (exists) {
                        return prev.map((item) => item.id === data.id || item.surah === data.surah ? data : item);
                    }
                    return [...prev, data];
                });
                setNewHifz({
                    surah: '',
                    total_ayat: '',
                    memorized: 0,
                    status: 'not-started',
                });
        });
    };

    // Update hifz status
    const updateHifzStatus = (id, memorized, status) => {
        axios.patch(`/api/muslim/quran-journal/hifz/${id}`, { memorized, status }).then(({ data }) => {
            setHifzProgress((prev) => prev.map((item) => item.id === id ? data : item));
        });
    };

    // Save tadabbur note
    const saveTadabbur = () => {
        if (!newTadabbur.surah || !newTadabbur.ayat) return;

        axios.post('/api/muslim/quran-journal/tadabbur', newTadabbur).then(({ data }) => {
                setTadabburNotes((prev) => [data, ...prev]);
                setNewTadabbur({
                    surah: '',
                    ayat: '',
                    arabic: '',
                    reflection: '',
                    color: 'bg-blue-50',
                });
        });
    };

    // Delete tadabbur note
    const deleteTadabbur = (id) => {
        axios.delete(`/api/muslim/quran-journal/tadabbur/${id}`).then(() => {
            setTadabburNotes((prev) => prev.filter((note) => note.id !== id));
        });
    };

    // Get color border class
    const getBorderClass = (colorClass) => {
        const found = colorOptions.find(c => c.value === colorClass);
        return found ? found.border : 'border-blue-200';
    };

    return (
        <JournalLayout
            pageTitle="Muslim OS - Qur'an Journal"
            headerTitle="Qur'an Journal"
            headerSubtitle="Tadarus, Hafalan & Tadabbur Al-Qur'an"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">menu_book</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Decorative */}
                    <div className="absolute -top-5 -left-5 rotate-[-12deg] z-20 drop-shadow-md">
                        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200 border-dashed">
                            <span className="material-symbols-outlined text-3xl text-amber-600">menu_book</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 right-10 rotate-6 z-20">
                        <span className="w-32 h-8 bg-teal-200/80 block transform skew-x-12 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}></span>
                    </div>

                    {/* LEFT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-teal-200/50"></div>

                        {/* Current Progress */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-4xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl text-primary">auto_stories</span>
                                Progress Tadarus
                            </h3>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent"></div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <span className="font-handwriting text-4xl font-bold text-primary">{totalJuz}</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Juz Selesai</p>
                                    </div>
                                    <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <span className="font-handwriting text-4xl font-bold text-amber-600">{totalPages}</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Halaman Dibaca</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                                        <span className="font-handwriting text-4xl font-bold text-green-600">{khatamProgress}%</span>
                                        <p className="font-note text-sm text-gray-500 mt-1">Target Khatam</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-note text-gray-400">Juz 1</span>
                                        <span className="font-handwriting text-primary font-bold">Juz {totalJuz} / 30</span>
                                        <span className="font-note text-gray-400">Juz 30</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div className="h-full bg-gradient-to-r from-primary/80 to-primary/40 rounded-full transition-all" style={{ width: `${khatamProgress}%` }}></div>
                                        {Array.from({ length: 29 }, (_, i) => (
                                            <div key={i} className="absolute top-0 bottom-0 w-px bg-gray-200" style={{ left: `${((i + 1) / 30) * 100}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Reading Log */}
                        <div className="mb-6">
                            <h4 className="font-handwriting text-2xl text-gray-700 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_circle</span>
                                Tambah Log Bacaan
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        value={newReadingLog.date}
                                        onChange={(e) => setNewReadingLog({...newReadingLog, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Tanggal"
                                    />
                                    <input
                                        type="number"
                                        value={newReadingLog.juz}
                                        onChange={(e) => setNewReadingLog({...newReadingLog, juz: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Juz (1-30)"
                                        min="1"
                                        max="30"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={newReadingLog.surah}
                                    onChange={(e) => setNewReadingLog({...newReadingLog, surah: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Nama Surah"
                                />
                                <div className="grid grid-cols-3 gap-3">
                                    <input
                                        type="number"
                                        value={newReadingLog.ayat_start}
                                        onChange={(e) => setNewReadingLog({...newReadingLog, ayat_start: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Ayat Awal"
                                    />
                                    <input
                                        type="number"
                                        value={newReadingLog.ayat_end}
                                        onChange={(e) => setNewReadingLog({...newReadingLog, ayat_end: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Ayat Akhir"
                                    />
                                    <input
                                        type="number"
                                        value={newReadingLog.pages}
                                        onChange={(e) => setNewReadingLog({...newReadingLog, pages: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Halaman"
                                    />
                                </div>
                                <button
                                    onClick={saveReadingLog}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg hover:bg-primary/90 transition-colors"
                                >
                                    Simpan Log Bacaan
                                </button>
                            </div>
                        </div>

                        {/* Reading Log */}
                        <div>
                            <h4 className="font-handwriting text-2xl text-gray-700 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Log Bacaan Harian
                            </h4>

                            {readingLogs.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">menu_book</span>
                                    </div>
                                    <p className="font-handwriting text-xl text-gray-400">Ketuk untuk tambah log bacaan...</p>
                                    <p className="font-note text-sm text-gray-300 mt-2">Log tadarus harianmu akan muncul di sini</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                                <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Tanggal</th>
                                                <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Surah</th>
                                                <th className="text-left font-note text-sm text-gray-400 py-2 px-4">Ayat</th>
                                                <th className="text-center font-note text-sm text-gray-400 py-2 px-4">Hal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {readingLogs.map((entry, i) => (
                                                <tr key={entry.id || i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                    <td className="py-2.5 px-4">
                                                        <span className="font-handwriting text-primary font-bold text-sm">
                                                            {new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <span className="font-handwriting text-gray-700">{entry.surah}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <span className="font-note text-sm text-gray-500">
                                                            {entry.ayat_start && entry.ayat_end ? `${entry.ayat_start}-${entry.ayat_end}` : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <span className="font-handwriting text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{entry.pages || '-'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-amber-200/50 rotate-[2deg]"></div>

                        {/* Hafalan Progress */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                                Progress Hafalan
                            </h3>

                            {/* Add Hifz */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={newHifz.surah}
                                        onChange={(e) => setNewHifz({...newHifz, surah: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Nama Surah"
                                    />
                                    <input
                                        type="number"
                                        value={newHifz.total_ayat}
                                        onChange={(e) => setNewHifz({...newHifz, total_ayat: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Total Ayat"
                                    />
                                </div>
                                <button
                                    onClick={saveHifz}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg hover:bg-primary/90 transition-colors"
                                >
                                    Tambah Surah Hafalan
                                </button>
                            </div>

                            {hifzProgress.length === 0 ? (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">psychology</span>
                                    </div>
                                    <p className="font-handwriting text-xl text-gray-400">Ketuk untuk tambah target hafalan...</p>
                                    <p className="font-note text-sm text-gray-300 mt-2">Track progress hafalan Al-Qur'anmu</p>
                                </div>
                            ) : (
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                        {hifzProgress.map((item, i) => (
                                            <div key={item.id || i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newStatus = item.status === 'done' ? 'not-started' :
                                                                             item.status === 'in-progress' ? 'done' : 'in-progress';
                                                            updateHifzStatus(item.id, item.memorized, newStatus);
                                                        }}
                                                        className={`material-symbols-outlined text-lg ${
                                                            item.status === 'done' ? 'text-green-500' :
                                                            item.status === 'in-progress' ? 'text-amber-500' : 'text-gray-300 hover:text-primary'
                                                        }`}
                                                    >
                                                        {item.status === 'done' ? 'check_circle' :
                                                         item.status === 'in-progress' ? 'timelapse' : 'radio_button_unchecked'}
                                                    </button>
                                                    <span className={`font-handwriting ${item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                        {item.surah}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-note text-xs text-gray-400">{item.memorized}/{item.total_ayat} ayat</span>
                                                    {item.status === 'in-progress' && (
                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(item.memorized / item.total_ayat) * 100}%` }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 p-2 bg-primary/5 rounded-lg text-center">
                                        <span className="font-note text-sm text-primary">
                                            Total: <span className="font-handwriting font-bold">{hifzProgress.filter(h => h.status === 'done').length}</span> surah selesai
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tadabbur Notes */}
                        <div>
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                                Catatan Tadabbur
                            </h3>

                            {/* Add Tadabbur */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={newTadabbur.surah}
                                        onChange={(e) => setNewTadabbur({...newTadabbur, surah: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Nama Surah"
                                    />
                                    <input
                                        type="text"
                                        value={newTadabbur.ayat}
                                        onChange={(e) => setNewTadabbur({...newTadabbur, ayat: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Ayat (contoh: 286)"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={newTadabbur.arabic}
                                    onChange={(e) => setNewTadabbur({...newTadabbur, arabic: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                                    placeholder="Teks Arab (opsional)"
                                    dir="rtl"
                                />
                                <textarea
                                    value={newTadabbur.reflection}
                                    onChange={(e) => setNewTadabbur({...newTadabbur, reflection: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Refleksi / Tadabbur..."
                                    rows={2}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="font-note text-sm text-gray-500">Warna:</span>
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewTadabbur({...newTadabbur, color: color.value})}
                                            className={`w-6 h-6 rounded-full ${color.value} border-2 ${newTadabbur.color === color.value ? 'border-primary' : 'border-transparent'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={saveTadabbur}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg hover:bg-primary/90 transition-colors"
                                >
                                    Simpan Catatan Tadabbur
                                </button>
                            </div>

                            {tadabburNotes.length === 0 ? (
                                <div className="bg-sticky-yellow p-6 shadow-sticky transform rotate-[1deg] text-center">
                                    <div className="w-16 h-16 bg-amber-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl text-amber-600">edit_note</span>
                                    </div>
                                    <p className="font-handwriting text-xl text-gray-600">Ketuk untuk tambah catatan tadabbur...</p>
                                    <p className="font-note text-sm text-gray-500 mt-2">Simpan ayat-ayat favorit dan refleksimu</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tadabburNotes.map((note, i) => (
                                        <div key={note.id || i} className={`${note.color} p-4 rounded-xl border ${getBorderClass(note.color)} shadow-sm transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'} hover:rotate-0 transition-transform relative group`}>
                                            <button
                                                onClick={() => deleteTadabbur(note.id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-note text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                                                    QS. {note.surah}: {note.ayat}
                                                </span>
                                            </div>
                                            {note.arabic && (
                                                <p className="font-handwriting text-lg text-gray-800 text-right leading-relaxed mb-2" dir="rtl">
                                                    {note.arabic}
                                                </p>
                                            )}
                                            {note.reflection && (
                                                <div className="border-t border-gray-200/50 pt-2">
                                                    <p className="font-note text-sm text-gray-600 leading-relaxed italic">
                                                        {note.reflection}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
