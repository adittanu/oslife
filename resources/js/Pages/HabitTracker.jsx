import React, { useState, useMemo, useCallback, useRef } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

const ICON_OPTIONS = [
    { value: 'water_drop', label: 'Water' },
    { value: 'menu_book', label: 'Book' },
    { value: 'self_improvement', label: 'Meditate' },
    { value: 'fitness_center', label: 'Exercise' },
    { value: 'bedtime', label: 'Sleep' },
    { value: 'restaurant', label: 'Food' },
    { value: 'directions_walk', label: 'Walk' },
    { value: 'code', label: 'Code' },
];

const COLOR_OPTIONS = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'yellow', label: 'Yellow' },
];

const COLOR_MAP = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-500', bar: 'bg-blue-300', barHover: 'hover:bg-blue-400' },
    green: { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-300', barHover: 'hover:bg-green-400' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-300', barHover: 'hover:bg-purple-400' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-500', bar: 'bg-pink-300', barHover: 'hover:bg-pink-400' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-500', bar: 'bg-indigo-300', barHover: 'hover:bg-indigo-400' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', bar: 'bg-yellow-300', barHover: 'hover:bg-yellow-400' },
};

export default function HabitTracker({
    month = new Date().toISOString().slice(0, 7),
    monthName = 'March',
    year = 2026,
    daysInMonth = 31,
    definitions: initialDefinitions = [],
    logs: initialLogs = {},
    today = new Date().toISOString().slice(0, 10),
}) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    const [definitions, setDefinitions] = useState(initialDefinitions);
    const [logs, setLogs] = useState(initialLogs);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', icon: 'water_drop', color: 'blue' });
    const [reflection, setReflection] = useState('');
    const reflectionTimer = useRef(null);

    const todayDay = useMemo(() => {
        const todayDate = new Date(today);
        const todayMonth = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}`;
        return todayMonth === month ? todayDate.getDate() : null;
    }, [today, month]);

    // Month navigation
    const navigateMonth = useCallback((direction) => {
        const [y, m] = month.split('-').map(Number);
        const d = new Date(y, m - 1 + direction, 1);
        const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.visit(`/habit-tracker?month=${newMonth}`);
    }, [month]);

    // Check if a log entry has a truthy value (supports Daily Spread's numeric/string/boolean values)
    const isLogTruthy = (entry) => {
        if (!entry) return false;
        const v = entry.value;
        return v !== null && v !== undefined && v !== false && v !== 0 && v !== '0' && v !== '';
    };

    // Toggle habit log (optimistic)
    const toggleHabit = useCallback(async (def, day) => {
        if (!isLoggedIn) return;

        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
        const habitName = def.name;
        const currentEntry = logs[habitName]?.[day];
        const isCurrentlyChecked = isLogTruthy(currentEntry);

        // Optimistic update — toggle value, don't remove entry
        setLogs(prev => {
            const next = { ...prev };
            if (isCurrentlyChecked) {
                // Set value to null (unchecked) but keep entry
                next[habitName] = {
                    ...(next[habitName] || {}),
                    [day]: { ...(currentEntry || {}), value: null },
                };
            } else {
                next[habitName] = {
                    ...(next[habitName] || {}),
                    [day]: { id: currentEntry?.id || 'temp', date: dateStr, habit_name: habitName, icon: def.icon, value: true },
                };
            }
            return next;
        });

        try {
            await axios.post('/api/habits/toggle', {
                date: dateStr,
                habit_name: habitName,
                icon: def.icon,
            });
        } catch {
            // Revert on error
            setLogs(prev => {
                const next = { ...prev };
                next[habitName] = {
                    ...(next[habitName] || {}),
                    [day]: currentEntry || undefined,
                };
                if (!currentEntry) {
                    const { [day]: _, ...rest } = next[habitName];
                    next[habitName] = rest;
                }
                return next;
            });
        }
    }, [isLoggedIn, logs, month]);

    // Add new habit
    const handleAddHabit = useCallback(async () => {
        if (!newHabit.name.trim() || !isLoggedIn) return;

        try {
            const { data } = await axios.post('/api/habits/definitions', newHabit);
            setDefinitions(prev => [...prev, data]);
            setNewHabit({ name: '', icon: 'water_drop', color: 'blue' });
            setShowAddForm(false);
        } catch {
            // silently fail
        }
    }, [newHabit, isLoggedIn]);

    // Archive a habit
    const archiveHabit = useCallback(async (def) => {
        if (!isLoggedIn) return;
        try {
            await axios.patch(`/api/habits/definitions/${def.id}`, { archived: true });
            setDefinitions(prev => prev.filter(d => d.id !== def.id));
        } catch {
            // silently fail
        }
    }, [isLoggedIn]);

    // Calculate insights
    const insights = useMemo(() => {
        const currentDay = todayDay || daysInMonth;
        const completionRates = definitions.map(def => {
            const habitLogs = logs[def.name] || {};
            const loggedDays = Object.values(habitLogs).filter(entry => isLogTruthy(entry)).length;
            const rate = currentDay > 0 ? Math.round((loggedDays / currentDay) * 100) : 0;
            return { ...def, loggedDays, rate };
        });

        // Calculate longest streak across all habits
        let longestStreak = 0;
        definitions.forEach(def => {
            const habitLogs = logs[def.name] || {};
            let streak = 0;
            let maxStreak = 0;
            for (let d = 1; d <= daysInMonth; d++) {
                if (isLogTruthy(habitLogs[d])) {
                    streak++;
                    maxStreak = Math.max(maxStreak, streak);
                } else {
                    streak = 0;
                }
            }
            longestStreak = Math.max(longestStreak, maxStreak);
        });

        return { completionRates, longestStreak };
    }, [definitions, logs, daysInMonth, todayDay]);

    return (
        <JournalLayout
            pageTitle="Mosiku Detailed Habit Tracker Page"
            headerTitle="Habit Tracker"
            headerSubtitle="Building better routines, one day at a time."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-green-400 rotate-[-15deg]">potted_plant</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-yellow-300">stars</span>
            </div>
            <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-blue-300">water_bottle</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex flex-col items-center">
                {/* Month Navigation */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h2 className="font-handwriting text-3xl text-gray-700 select-none">
                        {monthName} {year}
                    </h2>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Dual-page notebook */}
                <div className="relative w-full max-w-[1600px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col lg:flex-row border border-gray-200">
                    {/* Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden lg:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden lg:block z-10 shadow-notebook-spine"></div>

                    {/* LEFT PAGE - Habit Grid */}
                    <div className="w-full lg:w-2/3 p-6 md:p-10 relative border-b lg:border-b-0 lg:border-r border-gray-100 grid-lines flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center lg:text-left lg:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Habit Tracker</h3>
                                <p className="font-note text-lg text-gray-400 mt-1">{monthName} {year}</p>
                                <div className="h-0.5 w-48 bg-blue-200 mx-auto lg:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative w-full flex-1 bg-white/70 p-4 md:p-8 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm flex flex-col">
                            {definitions.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined text-[60px] mb-4">potted_plant</span>
                                    <p className="font-note text-2xl">Tambah habit pertamamu!</p>
                                    {!isLoggedIn && (
                                        <p className="font-note text-lg mt-2 text-gray-300">Login untuk mulai tracking</p>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto flex-1 custom-scrollbar">
                                    <table className="w-full min-w-[900px] border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="text-left font-display font-semibold text-gray-500 pb-4 w-48 text-base sticky left-0 bg-white/70 z-10">Habit</th>
                                                {Array.from({ length: daysInMonth }, (_, i) => {
                                                    const day = i + 1;
                                                    const isToday = day === todayDay;
                                                    return (
                                                        <th
                                                            key={day}
                                                            className={`text-center font-display font-bold text-xs pb-4 w-9 ${isToday ? 'text-primary' : 'text-gray-400'}`}
                                                        >
                                                            <span className={isToday ? 'bg-primary/10 px-1.5 py-0.5 rounded-full' : ''}>
                                                                {day}
                                                            </span>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {definitions.map(def => {
                                                const colors = COLOR_MAP[def.color] || COLOR_MAP.blue;
                                                return (
                                                    <tr
                                                        key={def.id || def.name}
                                                        className="border-t-2 border-dashed border-gray-100 group hover:bg-gray-50/50 transition-colors"
                                                    >
                                                        <td className="py-4 sticky left-0 bg-white/70 z-10">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} shadow-sm`}>
                                                                    <span className="material-symbols-outlined text-lg">{def.icon}</span>
                                                                </div>
                                                                <span className="font-display font-bold text-gray-700 text-sm tracking-wide">{def.name}</span>
                                                                {isLoggedIn && (
                                                                    <button
                                                                        onClick={() => archiveHabit(def)}
                                                                        className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity ml-1"
                                                                        title="Archive habit"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm text-gray-400">close</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                                            const day = i + 1;
                                                            const isLogged = isLogTruthy(logs[def.name]?.[day]);
                                                            const isToday = day === todayDay;
                                                            return (
                                                                <td key={day} className="text-center py-4 px-0.5">
                                                                    <button
                                                                        onClick={() => toggleHabit(def, day)}
                                                                        disabled={!isLoggedIn}
                                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                                                            isToday ? 'ring-2 ring-primary/30' : ''
                                                                        } ${
                                                                            isLogged
                                                                                ? `${colors.bg} ${colors.text} shadow-sm scale-100`
                                                                                : 'bg-gray-50 hover:bg-gray-100'
                                                                        } ${isLoggedIn ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                                                                    >
                                                                        {isLogged ? (
                                                                            <span className="material-symbols-outlined text-sm">{def.icon}</span>
                                                                        ) : (
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Add habit section */}
                            <div className="mt-6 border-t-2 border-gray-100 pt-4">
                                {showAddForm ? (
                                    <div className="flex flex-wrap items-end gap-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="text-xs font-display text-gray-400 mb-1 block">Nama Habit</label>
                                            <input
                                                type="text"
                                                value={newHabit.name}
                                                onChange={e => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Contoh: Olahraga pagi"
                                                className="w-full bg-transparent border-none outline-none focus:ring-0 font-note text-lg text-gray-700 placeholder-gray-300"
                                                onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-display text-gray-400 mb-1 block">Icon</label>
                                            <select
                                                value={newHabit.icon}
                                                onChange={e => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                                                className="bg-transparent border-none outline-none focus:ring-0 font-note text-base text-gray-600 cursor-pointer"
                                            >
                                                {ICON_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-display text-gray-400 mb-1 block">Warna</label>
                                            <select
                                                value={newHabit.color}
                                                onChange={e => setNewHabit(prev => ({ ...prev, color: e.target.value }))}
                                                className="bg-transparent border-none outline-none focus:ring-0 font-note text-base text-gray-600 cursor-pointer"
                                            >
                                                {COLOR_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAddHabit}
                                                className="flex items-center gap-1 text-sm font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-colors shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">check</span> Simpan
                                            </button>
                                            <button
                                                onClick={() => { setShowAddForm(false); setNewHabit({ name: '', icon: 'water_drop', color: 'blue' }); }}
                                                className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl transition-colors"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        {isLoggedIn ? (
                                            <button
                                                onClick={() => setShowAddForm(true)}
                                                className="flex items-center gap-2 text-base font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add</span> Add New Habit
                                            </button>
                                        ) : (
                                            <span className="font-note text-gray-400">Login untuk menambah habit</span>
                                        )}
                                        <span className="text-sm font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                                            {daysInMonth} days
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAGE - Insights */}
                    <div className="w-full lg:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="mb-8 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-2 mt-4 lg:mt-0">Habit Insights</h3>
                        </div>

                        {/* Streak badge */}
                        <div className="absolute top-12 right-6 lg:right-8 z-20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(250,204,21,0.5)] rotate-12 border-[3px] border-yellow-200 text-yellow-900 font-black">
                                <span className="material-symbols-outlined text-2xl md:text-3xl mb-0.5">local_fire_department</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-center leading-tight">Longest<br/>Streak</span>
                                <span className="text-base md:text-lg">{insights.longestStreak}d</span>
                            </div>
                        </div>

                        {/* Completion rate bar chart */}
                        <div className="bg-white/60 p-6 rounded-xl shadow-sm border border-gray-100 mb-10 backdrop-blur-sm relative mt-8 md:mt-16">
                            <div className="washi-tape -top-3 -left-4 bg-yellow-200/60 rotate-[-5deg] w-20"></div>
                            <h4 className="font-handwriting text-2xl text-gray-600 mb-6 text-center">Completion Rate</h4>
                            {definitions.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-gray-400">
                                    <p className="font-note text-lg text-center">Mulai track habit untuk lihat insights</p>
                                </div>
                            ) : (
                                <div className="flex items-end justify-center h-48 gap-6 font-handwriting text-gray-600 border-b-2 border-dashed border-gray-300 pb-2 px-4">
                                    {insights.completionRates.map(item => {
                                        const colors = COLOR_MAP[item.color] || COLOR_MAP.blue;
                                        const heightPercent = Math.max(item.rate, 2); // minimum visible bar
                                        return (
                                            <div key={item.id || item.name} className="flex flex-col items-center gap-2 h-full justify-end group w-full">
                                                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">{item.rate}%</span>
                                                <div
                                                    className={`w-full max-w-[40px] ${colors.bar} hand-drawn-bar transition-all ${colors.barHover}`}
                                                    style={{ height: `${heightPercent}%` }}
                                                ></div>
                                                <span className="text-sm font-bold truncate max-w-[60px]" title={item.name}>
                                                    {item.name.length > 8 ? item.name.slice(0, 7) + '...' : item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Reflection */}
                        <div className="mb-4 flex flex-col items-center">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Reflection</h3>
                        </div>
                        <div className="relative w-full flex-1 min-h-[200px] bg-transparent p-4 transform group transition-transform">
                            <textarea
                                value={reflection}
                                onChange={e => setReflection(e.target.value)}
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-2xl text-gray-800 leading-[2.5rem] focus:ring-0 custom-scrollbar"
                                placeholder="Thoughts on progress this month..."
                            ></textarea>
                        </div>

                        {/* Star decoration */}
                        <div className="absolute bottom-12 right-12 opacity-60 z-0 rotate-12 pointer-events-none">
                            <svg height="80" viewBox="0 0 100 100" width="80">
                                <polygon fill="#FCD34D" points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
