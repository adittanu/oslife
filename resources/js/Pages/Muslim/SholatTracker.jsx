import React, { useState, useEffect, useCallback, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const PRAYERS = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ahad'];

const SUNNAH_PRAYERS = [
    { name: 'Tahajud', icon: 'dark_mode', color: 'bg-indigo-100', iconColor: 'text-indigo-500' },
    { name: 'Dhuha', icon: 'wb_sunny', color: 'bg-amber-100', iconColor: 'text-amber-500' },
    { name: 'Rawatib Qabliyah', icon: 'arrow_back', color: 'bg-teal-100', iconColor: 'text-teal-500' },
    { name: 'Rawatib Ba\'diyah', icon: 'arrow_forward', color: 'bg-rose-100', iconColor: 'text-rose-500' },
];

const getStatusInfo = (status) => {
    if (status === 'jamaah') return { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-50' };
    if (status === 'alone') return { icon: 'check', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { icon: 'close', color: 'text-red-300', bg: 'bg-red-50/50' };
};

export default function SholatTracker({ weekStart, weeklyLogs, sunnahLogs }) {
    const { auth } = usePage().props;
    const isAuth = !!auth?.user;

    // Calculate week dates
    const getWeekDates = (startDate) => {
        const dates = [];
        const d = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            const date = new Date(d);
            date.setDate(d.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(weekStart || new Date().toISOString().split('T')[0]);
    const weekDates = getWeekDates(currentWeekStart);

    // Parse logs into usable format
    const [gridData, setGridData] = useState(() => {
        const data = {};
        PRAYERS.forEach(prayer => {
            data[prayer] = {};
            weekDates.forEach(date => {
                const log = weeklyLogs?.find(l => l.prayer_name === prayer && l.date === date);
                data[prayer][date] = log?.status || null;
            });
        });
        return data;
    });

    const [sunnahData, setSunnahData] = useState(() => {
        const data = {};
        SUNNAH_PRAYERS.forEach(sp => {
            data[sp.name] = {};
            weekDates.forEach(date => {
                const log = sunnahLogs?.find(l => l.prayer_name === sp.name && l.date === date);
                data[sp.name][date] = log?.done || false;
            });
        });
        return data;
    });

    useEffect(() => {
        const data = {};
        PRAYERS.forEach(prayer => {
            data[prayer] = {};
            weekDates.forEach(date => {
                const log = weeklyLogs?.find(l => l.prayer_name === prayer && l.date === date);
                data[prayer][date] = log?.status || null;
            });
        });
        setGridData(data);

        const sData = {};
        SUNNAH_PRAYERS.forEach(sp => {
            sData[sp.name] = {};
            weekDates.forEach(date => {
                const log = sunnahLogs?.find(l => l.prayer_name === sp.name && l.date === date);
                sData[sp.name][date] = log?.done || false;
            });
        });
        setSunnahData(sData);
    }, [weeklyLogs, sunnahLogs, weekDates]);

    const saveRef = useRef(null);
    const autoSaveLog = useCallback((date, prayerName, status) => {
        if (!isAuth) return;
        clearTimeout(saveRef.current);
        saveRef.current = setTimeout(() => {
            axios.post('/api/muslim/sholat-tracker/log', {
                date,
                prayer_name: prayerName,
                status,
            });
        }, 500);
    }, [isAuth]);

    const autoSaveSunnah = useCallback((date, prayerName, done) => {
        if (!isAuth) return;
        clearTimeout(saveRef.current);
        saveRef.current = setTimeout(() => {
            axios.post('/api/muslim/sholat-tracker/sunnah', {
                date,
                prayer_name: prayerName,
                done,
            });
        }, 500);
    }, [isAuth]);

    const cycleStatus = (prayer, date) => {
        const current = gridData[prayer][date];
        const next = current === null ? 'missed' : current === 'missed' ? 'alone' : current === 'alone' ? 'jamaah' : null;
        setGridData(prev => ({
            ...prev,
            [prayer]: { ...prev[prayer], [date]: next }
        }));
        if (next !== null) {
            autoSaveLog(date, prayer, next);
        }
    };

    const toggleSunnah = (prayer, date) => {
        const current = sunnahData[prayer]?.[date] || false;
        setSunnahData(prev => ({
            ...prev,
            [prayer]: { ...prev[prayer], [date]: !current }
        }));
        autoSaveSunnah(date, prayer, !current);
    };

    const navigateWeek = (offset) => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + offset * 7);
        const newStart = d.toISOString().split('T')[0];
        router.visit(`/muslim/sholat-tracker?week_start=${newStart}`, { preserveState: false });
    };

    // Calculate stats
    const totalPrayers = PRAYERS.length * 7;
    const completedPrayers = Object.values(gridData).flatMap(Object.values).filter(s => s !== null).length;
    const jamaahPrayers = Object.values(gridData).flatMap(Object.values).filter(s => s === 'jamaah').length;

    // Check if there's any data
    const hasData = completedPrayers > 0;

    return (
        <JournalLayout
            pageTitle="Muslim OS - Sholat Tracker"
            headerTitle="Sholat Tracker"
            headerSubtitle="Menjaga sholat 5 waktu dengan istiqamah"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">mosque</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1600px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    {/* Notebook spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden xl:block z-10 shadow-notebook-spine"></div>

                    {/* LEFT PAGE - Weekly Sholat Grid */}
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-emerald-100/80 rotate-1"></div>

                        {/* Week Navigation */}
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full flex items-center justify-between">
                                <button
                                    onClick={() => navigateWeek(-1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-primary/10 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-600">chevron_left</span>
                                </button>
                                <div className="text-center">
                                    <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Sholat Wajib Mingguan</h3>
                                    <p className="font-note text-gray-400 mt-1">
                                        {new Date(weekDates[0]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(weekDates[6]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigateWeek(1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-primary/10 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-600">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        {/* Tracking Grid */}
                        <div className="relative w-full flex-1 bg-white/70 p-4 md:p-8 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm flex flex-col">
                            <div className="overflow-x-auto flex-1 custom-scrollbar">
                                <table className="w-full min-w-[600px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-display font-semibold text-gray-500 pb-4 w-32 text-base">Sholat</th>
                                            {weekDates.map((date, i) => (
                                                <th key={date} className={`text-center font-display font-bold text-base pb-4 w-20 ${i === 4 ? 'text-primary' : 'text-gray-400'}`}>
                                                    <div>{DAYS[i]}</div>
                                                    <div className="font-note text-sm font-normal text-gray-300">{new Date(date).getDate()}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PRAYERS.map((prayer, pi) => (
                                            <tr key={prayer} className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                                            <span className="material-symbols-outlined text-lg">mosque</span>
                                                        </div>
                                                        <span className="font-display font-bold text-gray-700 text-base tracking-wide">{prayer}</span>
                                                    </div>
                                                </td>
                                                {weekDates.map((date, di) => {
                                                    const status = gridData[prayer]?.[date];
                                                    const s = getStatusInfo(status);
                                                    return (
                                                        <td key={date} className="text-center py-5 px-1">
                                                            <div
                                                                className={`w-10 h-10 mx-auto rounded-xl ${status ? s.bg : 'bg-gray-50'} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border ${status ? 'border-gray-200' : 'border-gray-100 border-dashed'}`}
                                                                onClick={() => cycleStatus(prayer, date)}
                                                            >
                                                                {status ? (
                                                                    <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-xl text-gray-300">radio_button_unchecked</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex items-center justify-center gap-6 border-t-2 border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                    <span className="font-note text-sm text-gray-500">Berjamaah</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-lg">check</span>
                                    <span className="font-note text-sm text-gray-500">Munfarid</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-300 text-lg">close</span>
                                    <span className="font-note text-sm text-gray-500">Terlewat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-amber-100/70 rotate-[3deg]"></div>

                        {/* Prayer Streak */}
                        <div className="mb-8 flex flex-col items-center mt-4 xl:mt-0">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-4">Statistik & Streak</h3>
                        </div>

                        {/* Streak Badge */}
                        <div className="absolute top-12 right-6 xl:right-8 z-20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex flex-col items-center justify-center shadow-lg rotate-12 border-[3px] border-primary/50 text-white font-black">
                                <span className="material-symbols-outlined text-2xl md:text-3xl mb-0.5">local_fire_department</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-center leading-tight">Streak</span>
                                <span className="text-base md:text-lg">{jamaahPrayers}</span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-gray-100 mb-6 backdrop-blur-sm mt-8 md:mt-16">
                            <div className="washi-tape -top-3 -left-4 bg-green-200/60 rotate-[-5deg] w-20"></div>
                            <h4 className="font-handwriting text-xl text-gray-600 mb-4 text-center">Ringkasan Pekan Ini</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                                    <span className="font-handwriting text-3xl font-bold text-green-600">{completedPrayers}</span>
                                    <span className="font-handwriting text-xl text-green-600">/{totalPrayers}</span>
                                    <p className="font-note text-xs text-green-500 mt-1">Sholat Selesai</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="font-handwriting text-3xl font-bold text-blue-600">{jamaahPrayers}</span>
                                    <p className="font-note text-xs text-blue-500 mt-1">Berjamaah</p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2">
                                    <span className="font-handwriting text-2xl font-bold text-amber-600">{totalPrayers > 0 ? Math.round((completedPrayers / totalPrayers) * 100) : 0}%</span>
                                    <p className="font-note text-xs text-amber-500 mt-1">Tingkat Kepatuhan</p>
                                    <div className="w-full h-2 bg-amber-100 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${totalPrayers > 0 ? Math.round((completedPrayers / totalPrayers) * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sunnah Prayers */}
                        <div className="mb-6">
                            <h4 className="font-handwriting text-2xl text-gray-700 mb-3 text-center flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                                Sholat Sunnah
                            </h4>
                            <div className="space-y-3">
                                {SUNNAH_PRAYERS.map((sunnah, i) => (
                                    <div key={sunnah.name} className={`${sunnah.color} p-3 rounded-xl border border-gray-100 shadow-sm transform ${i % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`material-symbols-outlined ${sunnah.iconColor}`}>{sunnah.icon}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-700">{sunnah.name}</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {weekDates.map((date, di) => {
                                                const done = sunnahData[sunnah.name]?.[date] || false;
                                                return (
                                                    <div
                                                        key={date}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs cursor-pointer ${done ? 'bg-white/80 border border-green-200' : 'bg-white/40 border border-gray-200 border-dashed'}`}
                                                        onClick={() => toggleSunnah(sunnah.name, date)}
                                                    >
                                                        {done ? (
                                                            <span className="material-symbols-outlined text-green-500 text-sm">check</span>
                                                        ) : (
                                                            <span className="font-note text-[10px] text-gray-400">{DAYS[di][0]}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motivational Sticky */}
                        <div className="bg-sticky-yellow p-4 shadow-sticky transform rotate-[1deg] mt-auto">
                            <p className="font-handwriting text-lg text-gray-700 text-center leading-relaxed" dir="rtl">
                                إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2 italic">
                                "Sesungguhnya sholat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman." (QS. An-Nisa: 103)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}