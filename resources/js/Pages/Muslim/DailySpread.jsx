import React, { useState, useRef, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const SHOLAT_NAMES = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
const SHOLAT_TIMES = {
    Subuh: '04:32',
    Dzuhur: '11:55',
    Ashar: '15:12',
    Maghrib: '17:48',
    Isya: '19:02',
};
const SHOLAT_ICONS = {
    Subuh: { icon: 'dark_mode', color: 'bg-indigo-100', borderColor: 'border-indigo-200' },
    Dzuhur: { icon: 'light_mode', color: 'bg-yellow-100', borderColor: 'border-yellow-200' },
    Ashar: { icon: 'partly_cloudy_day', color: 'bg-orange-100', borderColor: 'border-orange-200' },
    Maghrib: { icon: 'wb_twilight', color: 'bg-rose-100', borderColor: 'border-rose-200' },
    Isya: { icon: 'nights_stay', color: 'bg-purple-100', borderColor: 'border-purple-200' },
};

const DEFAULT_DZIKIR = [
    { dzikir_name: 'Istighfar 100x', done: false },
    { dzikir_name: 'Subhanallah 33x', done: false },
    { dzikir_name: 'Alhamdulillah 33x', done: false },
    { dzikir_name: 'Allahu Akbar 33x', done: false },
    { dzikir_name: 'Sholawat Nabi 100x', done: false },
    { dzikir_name: 'La ilaha illallah 100x', done: false },
];

export default function DailySpread({ date, sholatLogs, dzikirLogs, quranTarget, muhasabah }) {
    const { auth } = usePage().props;
    const isAuth = !!auth?.user;

    // Date navigation
    const currentDate = date || new Date().toISOString().split('T')[0];
    const dateObj = new Date(currentDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const dateInputRef = useRef(null);

    const navigateDate = (offset) => {
        const d = new Date(dateObj);
        d.setDate(d.getDate() + offset);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        router.visit(`/muslim/daily-spread?date=${yyyy}-${mm}-${dd}`, { preserveState: false });
    };

    const onDatePick = (e) => {
        if (e.target.value) {
            router.visit(`/muslim/daily-spread?date=${e.target.value}`, { preserveState: false });
        }
    };

    // --- Sholat State ---
    const [sholatData, setSholatData] = useState(() => {
        const data = {};
        SHOLAT_NAMES.forEach(name => {
            const log = sholatLogs?.[name];
            data[name] = {
                status: log?.status || 'missed',
                time: log?.time || SHOLAT_TIMES[name],
            };
        });
        return data;
    });

    const sholatSaveRef = useRef(null);
    const autoSaveSholat = useCallback((name, status) => {
        if (!isAuth) return;
        clearTimeout(sholatSaveRef.current);
        sholatSaveRef.current = setTimeout(() => {
            axios.post('/api/muslim/daily-spread/sholat', {
                date: currentDate,
                sholat_name: name,
                status: status,
                time: SHOLAT_TIMES[name],
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const cycleSholatStatus = (name) => {
        const currentStatus = sholatData[name].status;
        const newStatus = currentStatus === 'missed' ? 'alone' : currentStatus === 'alone' ? 'jamaah' : 'missed';
        setSholatData(prev => ({ ...prev, [name]: { ...prev[name], status: newStatus } }));
        autoSaveSholat(name, newStatus);
    };

    // --- Dzikir State ---
    const [dzikirData, setDzikirData] = useState(() => {
        if (dzikirLogs && dzikirLogs.length > 0) {
            return DEFAULT_DZIKIR.map(d => {
                const log = dzikirLogs.find(l => l.dzikir_name === d.dzikir_name);
                return { ...d, done: log?.done || false };
            });
        }
        return DEFAULT_DZIKIR.map(d => ({ ...d }));
    });

    useEffect(() => {
        if (dzikirLogs && dzikirLogs.length > 0) {
            setDzikirData(DEFAULT_DZIKIR.map(d => {
                const log = dzikirLogs.find(l => l.dzikir_name === d.dzikir_name);
                return { ...d, done: log?.done || false };
            }));
        } else {
            setDzikirData(DEFAULT_DZIKIR.map(d => ({ ...d })));
        }
    }, [dzikirLogs]);

    const dzikirSaveRef = useRef(null);
    const autoSaveDzikir = useCallback((items) => {
        if (!isAuth) return;
        clearTimeout(dzikirSaveRef.current);
        dzikirSaveRef.current = setTimeout(() => {
            axios.post('/api/muslim/daily-spread/dzikir', {
                date: currentDate,
                items: items.map(({ dzikir_name, done }) => ({ dzikir_name, done })),
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const toggleDzikir = (idx) => {
        const newItems = [...dzikirData];
        newItems[idx] = { ...newItems[idx], done: !newItems[idx].done };
        setDzikirData(newItems);
        autoSaveDzikir(newItems);
    };

    // --- Quran Target State ---
    const [quranData, setQuranData] = useState({
        juz: quranTarget?.juz || '',
        surah: quranTarget?.surah || '',
        ayat_start: quranTarget?.ayat_start || '',
        ayat_end: quranTarget?.ayat_end || '',
        progress: quranTarget?.progress || 0,
    });

    useEffect(() => {
        setQuranData({
            juz: quranTarget?.juz || '',
            surah: quranTarget?.surah || '',
            ayat_start: quranTarget?.ayat_start || '',
            ayat_end: quranTarget?.ayat_end || '',
            progress: quranTarget?.progress || 0,
        });
    }, [quranTarget]);

    const quranSaveRef = useRef(null);
    const autoSaveQuran = useCallback((data) => {
        if (!isAuth) return;
        clearTimeout(quranSaveRef.current);
        quranSaveRef.current = setTimeout(() => {
            axios.post('/api/muslim/daily-spread/quran-target', {
                date: currentDate,
                ...data,
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const updateQuranField = (field, value) => {
        const newData = { ...quranData, [field]: value };
        setQuranData(newData);
        autoSaveQuran(newData);
    };

    // --- Muhasabah State ---
    const [muhasabahContent, setMuhasabahContent] = useState(muhasabah?.content || '');
    useEffect(() => { setMuhasabahContent(muhasabah?.content || ''); }, [muhasabah]);

    const muhasabahSaveRef = useRef(null);
    const autoSaveMuhasabah = useCallback((content) => {
        if (!isAuth) return;
        clearTimeout(muhasabahSaveRef.current);
        muhasabahSaveRef.current = setTimeout(() => {
            axios.post('/api/muslim/daily-spread/muhasabah', { date: currentDate, content });
        }, 1000);
    }, [currentDate, isAuth]);

    const onMuhasabahChange = (e) => {
        setMuhasabahContent(e.target.value);
        autoSaveMuhasabah(e.target.value);
    };

    const hasSholatData = Object.values(sholatData).some(s => s.status !== 'missed');
    const hasDzikirData = dzikirData.some(d => d.done);
    const hasQuranData = quranData.juz || quranData.surah;
    const dzikirDoneCount = dzikirData.filter(d => d.done).length;

    return (
        <JournalLayout
            pageTitle="Muslim OS - Daily Spread"
            headerTitle="Daily Spread"
            headerSubtitle={formattedDate}
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">mosque</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex flex-col items-center">
                {/* Date Navigation */}
                <div className="flex items-center gap-4 mb-6 select-none">
                    <button
                        onClick={() => navigateDate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                        aria-label="Hari sebelumnya"
                    >
                        <span className="material-symbols-outlined text-gray-600">chevron_left</span>
                    </button>
                    <button
                        onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                        className="font-handwriting text-xl md:text-2xl text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    >
                        {formattedDate}
                    </button>
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={currentDate}
                        onChange={onDatePick}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                    />
                    <button
                        onClick={() => navigateDate(1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                        aria-label="Hari berikutnya"
                    >
                        <span className="material-symbols-outlined text-gray-600">chevron_right</span>
                    </button>
                </div>

                {/* Journal Book */}
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Decorative elements */}
                    <div className="absolute -top-5 -right-5 rotate-12 z-20 drop-shadow-md">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 border-dashed">
                            <span className="material-symbols-outlined text-3xl text-green-600">nights_stay</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-10 -rotate-6 z-20">
                        <span className="w-32 h-8 bg-emerald-200/80 block transform skew-x-12 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}></span>
                    </div>

                    {/* LEFT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-emerald-200/50"></div>

                        {/* Sholat Schedule */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-3xl text-primary">mosque</span>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Jadwal Sholat</h3>
                            </div>

                            <div className="space-y-3">
                                {SHOLAT_NAMES.map((name, i) => {
                                    const config = SHOLAT_ICONS[name];
                                    const status = sholatData[name].status;
                                    const statusIcon = status === 'jamaah' ? 'check_circle' : status === 'alone' ? 'check' : 'radio_button_unchecked';
                                    const statusColor = status === 'jamaah' ? 'text-green-600' : status === 'alone' ? 'text-yellow-500' : 'text-gray-300';

                                    return (
                                        <div
                                            key={name}
                                            className={`${config.color} border ${config.borderColor} p-3 rounded-xl flex items-center justify-between transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'} hover:rotate-0 transition-transform shadow-sm cursor-pointer`}
                                            onClick={() => cycleSholatStatus(name)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-2xl text-gray-600">{config.icon}</span>
                                                <div>
                                                    <span className="font-handwriting text-xl font-bold text-gray-800">{name}</span>
                                                    <span className="font-note text-sm text-gray-500 ml-3">{SHOLAT_TIMES[name]}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-2xl ${statusColor}`}>{statusIcon}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {!hasSholatData && (
                                <p className="text-gray-400 italic font-note text-sm mt-3 text-center">Ketuk untuk tandai status sholat</p>
                            )}
                        </div>

                        {/* Daily Dzikir Checklist */}
                        <div className="bg-sticky-yellow p-5 shadow-sticky relative transform rotate-[-1deg]">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 blur-[2px] rotate-1"></div>
                            <h4 className="font-sketch text-xl text-primary mb-3 border-b border-primary/20 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">checklist</span>
                                Dzikir Harian
                            </h4>
                            <ul className="space-y-2">
                                {dzikirData.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleDzikir(i)}>
                                        <span className={`material-symbols-outlined text-lg ${item.done ? 'text-green-600' : 'text-gray-300'}`}>
                                            {item.done ? 'check_box' : 'check_box_outline_blank'}
                                        </span>
                                        <span className={`font-handwriting text-lg ${item.done ? 'text-gray-500 line-through decoration-wavy decoration-green-300' : 'text-gray-800'}`}>
                                            {item.dzikir_name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 text-right">
                                <span className="font-note text-sm text-gray-500">{dzikirDoneCount}/{dzikirData.length} selesai</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-teal-200/50 rotate-[2deg]"></div>

                        {/* Quran Reading Target */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                                Target Bacaan Al-Qur'an
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                                {hasQuranData ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-note text-gray-500">Juz</span>
                                            <input
                                                type="number"
                                                value={quranData.juz}
                                                onChange={(e) => updateQuranField('juz', parseInt(e.target.value) || '')}
                                                className="font-handwriting text-2xl font-bold text-primary w-16 text-right bg-transparent border-b border-dashed border-primary/30 focus:outline-none"
                                                placeholder="?"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-note text-gray-500">Surah</span>
                                            <input
                                                type="text"
                                                value={quranData.surah}
                                                onChange={(e) => updateQuranField('surah', e.target.value)}
                                                className="font-handwriting text-xl text-gray-800 flex-1 ml-4 text-right bg-transparent border-b border-dashed border-gray-200 focus:outline-none"
                                                placeholder="Nama surah"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-note text-gray-500">Ayat</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={quranData.ayat_start}
                                                    onChange={(e) => updateQuranField('ayat_start', parseInt(e.target.value) || '')}
                                                    className="font-handwriting text-xl text-gray-800 w-12 text-right bg-transparent border-b border-dashed border-gray-200 focus:outline-none"
                                                    placeholder="1"
                                                />
                                                <span className="text-gray-400">-</span>
                                                <input
                                                    type="number"
                                                    value={quranData.ayat_end}
                                                    onChange={(e) => updateQuranField('ayat_end', parseInt(e.target.value) || '')}
                                                    className="font-handwriting text-xl text-gray-800 w-12 text-right bg-transparent border-b border-dashed border-gray-200 focus:outline-none"
                                                    placeholder="?"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-note text-gray-400">Progress hari ini</span>
                                                <span className="font-handwriting text-primary font-bold">{quranData.progress}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={quranData.progress}
                                                onChange={(e) => updateQuranField('progress', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">menu_book</span>
                                        <p className="text-gray-400 italic font-note">Set target bacaan hari ini...</p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Juz"
                                                value={quranData.juz}
                                                onChange={(e) => updateQuranField('juz', parseInt(e.target.value) || '')}
                                                className="font-handwriting text-lg w-16 text-center bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Surah"
                                                value={quranData.surah}
                                                onChange={(e) => updateQuranField('surah', e.target.value)}
                                                className="font-handwriting text-lg flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Muhasabah / Reflection */}
                        <div className="mb-6">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">self_improvement</span>
                                Muhasabah
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 paper-lines min-h-[220px] relative rounded-lg">
                                <textarea
                                    value={muhasabahContent}
                                    onChange={onMuhasabahChange}
                                    placeholder="Tulis refleksi harianmu di sini... Bagaimana ibadahmu hari ini? Apa yang perlu diperbaiki?"
                                    className="font-handwriting text-xl text-gray-600 leading-[2rem] w-full min-h-[180px] bg-transparent border-none outline-none resize-none placeholder:text-gray-300 placeholder:italic placeholder:font-note focus:ring-0"
                                    style={{ lineHeight: '2rem' }}
                                />
                                <div className="absolute bottom-3 right-3 opacity-30 rotate-[-10deg] pointer-events-none">
                                    <span className="material-symbols-outlined text-5xl text-primary">favorite</span>
                                </div>
                            </div>
                        </div>

                        {/* Dua of the day sticky */}
                        <div className="bg-green-100 p-4 shadow-sticky transform rotate-[1deg] rounded-lg border border-green-200/50">
                            <h4 className="font-sketch text-lg text-green-800 mb-2">Do'a Hari Ini</h4>
                            <p className="font-handwriting text-lg text-gray-700 text-right leading-relaxed" dir="rtl">
                                رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                            </p>
                            <p className="font-note text-sm text-green-700 mt-2 italic">
                                "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}