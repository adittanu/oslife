import React, { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    teal: 'bg-teal-100 text-teal-600',
    pink: 'bg-pink-100 text-pink-600',
    purple: 'bg-purple-100 text-purple-600',
    rose: 'bg-rose-100 text-rose-600',
};

const iconOptions = ['mosque', 'menu_book', 'dark_mode', 'wb_sunny', 'favorite', 'restaurant', 'self_improvement', 'volunteer_activism'];

const parseIso = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const toIso = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function HabitTracker({ weekStart, weekRange, definitions: initialDefinitions, logs: initialLogs, reflection: initialReflection }) {
    const user = usePage().props.auth?.user;
    const isGuest = !user;
    const saveRef = useRef(null);
    const [definitions, setDefinitions] = useState(initialDefinitions || []);
    const [logs, setLogs] = useState(initialLogs || {});
    const [reflection, setReflection] = useState(initialReflection || '');
    const [status, setStatus] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', icon: 'mosque', color: 'emerald' });

    useEffect(() => setDefinitions(initialDefinitions || []), [initialDefinitions]);
    useEffect(() => setLogs(initialLogs || {}), [initialLogs]);
    useEffect(() => setReflection(initialReflection || ''), [initialReflection]);
    useEffect(() => () => saveRef.current && clearTimeout(saveRef.current), []);

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = parseIso(weekStart);
        date.setDate(date.getDate() + i);
        return {
            iso: toIso(date),
            label: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date),
            day: new Intl.DateTimeFormat('id-ID', { day: 'numeric' }).format(date),
        };
    });

    const metrics = definitions.map((habit) => {
        const completed = days.filter((day) => logs?.[habit.name]?.[day.iso]).length;
        let streak = 0;
        for (let i = days.length - 1; i >= 0; i -= 1) {
            if (logs?.[habit.name]?.[days[i].iso]) streak += 1;
            else if (streak) break;
        }
        return { ...habit, completed, rate: Math.round((completed / 7) * 100), streak };
    });

    const bestHabit = [...metrics].sort((a, b) => b.rate - a.rate)[0];
    const average = metrics.length ? Math.round(metrics.reduce((sum, item) => sum + item.rate, 0) / metrics.length) : 0;

    const changeWeek = (dir) => {
        const next = parseIso(weekStart);
        next.setDate(next.getDate() + (dir * 7));
        router.get('/muslim/habit-tracker', { week_start: toIso(next) }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const toggleLog = (habitName, iso) => {
        if (isGuest) return;
        const done = !Boolean(logs?.[habitName]?.[iso]);
        axios.post('/api/muslim/habit-tracker/toggle', { date: iso, habit_name: habitName, done }).then(({ data }) => {
            setLogs((current) => {
                const next = { ...(current[habitName] || {}) };
                if (data.status === 'unchecked') delete next[iso];
                else next[iso] = data;
                return { ...current, [habitName]: next };
            });
        });
    };

    const updateReflection = (value) => {
        setReflection(value);
        if (isGuest) return;
        setStatus('Menyimpan refleksi...');
        if (saveRef.current) clearTimeout(saveRef.current);
        saveRef.current = setTimeout(() => {
            axios.post('/api/muslim/habit-tracker/reflection', { week_start: weekStart, content: value }).then(() => setStatus('Refleksi tersimpan.'));
        }, 700);
    };

    const addHabit = () => {
        if (isGuest || !newHabit.name.trim()) return;
        axios.post('/api/muslim/habit-tracker/definitions', { ...newHabit, name: newHabit.name.trim() }).then(({ data }) => {
            setDefinitions((current) => [...current, data]);
            setNewHabit({ name: '', icon: 'mosque', color: 'emerald' });
            setShowForm(false);
            setStatus('Amalan baru ditambahkan.');
        });
    };

    const archiveHabit = (habit) => {
        if (isGuest) return;
        axios.patch(`/api/muslim/habit-tracker/definitions/${habit.id}`, { archived: true }).then(() => {
            setDefinitions((current) => current.filter((item) => item.id !== habit.id));
            setStatus(`${habit.name} diarsipkan.`);
        });
    };

    return (
        <JournalLayout pageTitle="Muslim OS - Habit Islami" headerTitle="Habit Islami" headerSubtitle="Consistency is key to Jannah" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">track_changes</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="w-full max-w-[1500px] min-h-[820px] bg-page-bg shadow-notebook rounded-xl border border-gray-200 flex flex-col xl:flex-row overflow-hidden">
                    <section className="w-full xl:w-2/3 p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-gray-100">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h3 className="font-handwriting text-4xl text-gray-700">Tracker Ibadah Mingguan</h3>
                                <p className="font-note text-sm text-gray-400 mt-1">{weekRange?.start} - {weekRange?.end}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => changeWeek(-1)} className="w-11 h-11 rounded-full border border-gray-200 bg-white/80 text-gray-500"><span className="material-symbols-outlined">chevron_left</span></button>
                                <div className="px-4 py-2 rounded-full bg-gray-100 font-note text-sm text-gray-500">{average}% rata-rata</div>
                                <button onClick={() => changeWeek(1)} className="w-11 h-11 rounded-full border border-gray-200 bg-white/80 text-gray-500"><span className="material-symbols-outlined">chevron_right</span></button>
                            </div>
                        </div>

                        {definitions.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-10 text-center">
                                <span className="material-symbols-outlined text-5xl text-gray-300">track_changes</span>
                                <p className="font-handwriting text-2xl text-gray-700 mt-3">Belum ada tracker aktif</p>
                                <p className="font-note text-sm text-gray-400 mt-2">{isGuest ? 'Login untuk menyimpan checklist dan refleksi mingguan.' : 'Tambahkan amalan baru untuk mulai melacak progres.'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-gray-100 bg-white/70">
                                <table className="w-full min-w-[760px]">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left p-4 font-display text-gray-500">Amalan</th>
                                            {days.map((day) => <th key={day.iso} className="p-4 text-center font-display text-sm text-gray-400"><span className="block capitalize">{day.label}</span><span className="font-note text-xs text-gray-300">{day.day}</span></th>)}
                                            <th className="p-4 text-center font-display text-gray-500">Streak</th>
                                            <th className="p-4 text-center font-display text-gray-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {metrics.map((habit) => (
                                            <tr key={habit.id} className="border-t border-dashed border-gray-100">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[habit.color] || colors.emerald}`}>
                                                            <span className="material-symbols-outlined text-lg">{habit.icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-display font-semibold text-gray-700">{habit.name}</p>
                                                            <p className="font-note text-xs text-gray-400">{habit.completed}/7 hari</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {days.map((day) => {
                                                    const checked = Boolean(logs?.[habit.name]?.[day.iso]);
                                                    return (
                                                        <td key={day.iso} className="p-4 text-center">
                                                            <button type="button" disabled={isGuest} onClick={() => toggleLog(habit.name, day.iso)} className={`w-10 h-10 rounded-2xl border-2 inline-flex items-center justify-center ${checked ? 'bg-primary/10 border-primary/10 text-primary' : 'bg-white border-gray-200 text-gray-300'} ${isGuest ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                                <span className="material-symbols-outlined text-lg">{checked ? 'check' : 'add'}</span>
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                                <td className="p-4 text-center font-handwriting text-lg text-gray-700">{habit.streak}</td>
                                                <td className="p-4 text-center">
                                                    <button type="button" disabled={isGuest} onClick={() => archiveHabit(habit)} className={`w-9 h-9 rounded-full border border-gray-200 text-gray-400 ${isGuest ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-5 space-y-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <button type="button" disabled={isGuest} onClick={() => setShowForm((current) => !current)} className={`px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold ${isGuest ? 'opacity-60 cursor-not-allowed' : ''}`}>Tambah Amalan</button>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">{status || 'Checklist mingguan aktif'}</span>
                            </div>
                            {showForm && !isGuest && (
                                <div className="grid gap-3 md:grid-cols-[1.8fr_1fr_1fr_auto] rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4">
                                    <input value={newHabit.name} onChange={(e) => setNewHabit((current) => ({ ...current, name: e.target.value }))} placeholder="Nama amalan" className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-note text-sm" />
                                    <select value={newHabit.icon} onChange={(e) => setNewHabit((current) => ({ ...current, icon: e.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-3 font-note text-sm">
                                        {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                                    </select>
                                    <select value={newHabit.color} onChange={(e) => setNewHabit((current) => ({ ...current, color: e.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-3 font-note text-sm">
                                        {Object.keys(colors).map((color) => <option key={color} value={color}>{color}</option>)}
                                    </select>
                                    <button type="button" onClick={addHabit} className="rounded-xl bg-primary px-4 py-3 text-white font-display font-semibold">Simpan</button>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="w-full xl:w-1/3 p-6 md:p-8 paper-lines">
                        <div className="rounded-2xl border border-gray-100 bg-white/70 p-5 mb-5">
                            <p className="font-note text-xs uppercase tracking-[0.25em] text-gray-400">Best Habit</p>
                            <p className="font-handwriting text-3xl text-gray-700 mt-2">{bestHabit?.name || 'Belum ada'}</p>
                            <p className="font-note text-sm text-gray-400 mt-1">{bestHabit?.rate || 0}% konsistensi pekan ini</p>
                        </div>

                        <div className="bg-yellow-100 p-5 shadow-sticky rotate-[-1deg] border border-yellow-200 mb-6">
                            <p className="font-handwriting text-lg text-gray-800 leading-relaxed text-center italic">"Amalan yang paling dicintai Allah adalah yang paling konsisten, meskipun sedikit."</p>
                            <p className="font-note text-xs text-gray-500 text-center mt-2">HR. Bukhari dan Muslim</p>
                        </div>

                        <div className="mb-3 text-center">
                            <h3 className="font-handwriting text-2xl text-gray-700">Refleksi Pekan Ini</h3>
                        </div>
                        <textarea value={reflection} onChange={(e) => updateReflection(e.target.value)} disabled={isGuest} placeholder={isGuest ? 'Login untuk menyimpan refleksi.' : 'Apa yang ingin kamu jaga lebih baik pekan ini?'} className={`w-full min-h-[260px] rounded-2xl border border-gray-100 bg-white/60 p-4 font-note text-base text-gray-700 ${isGuest ? 'opacity-70 cursor-not-allowed' : ''}`}></textarea>
                    </aside>
                </div>
            </div>
        </JournalLayout>
    );
}
