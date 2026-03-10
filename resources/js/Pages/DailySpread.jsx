import React, { useState, useRef, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const COLORS = ['bg-sticky-green/50', 'bg-sticky-blue/50', 'bg-sticky-purple/40', 'bg-sticky-pink/40', 'bg-sticky-yellow/50'];
const COLOR_OPTIONS = [
    { value: 'green', label: 'Green', cls: 'bg-sticky-green/50' },
    { value: 'blue', label: 'Blue', cls: 'bg-sticky-blue/50' },
    { value: 'purple', label: 'Purple', cls: 'bg-sticky-purple/40' },
    { value: 'pink', label: 'Pink', cls: 'bg-sticky-pink/40' },
    { value: 'yellow', label: 'Yellow', cls: 'bg-sticky-yellow/50' },
];

const MOOD_OPTIONS = [
    { mood: 'happy', icon: 'sentiment_very_satisfied', label: 'Senang', color: 'text-yellow-500' },
    { mood: 'optimistic', icon: 'sentiment_satisfied', label: 'Optimis', color: 'text-yellow-500' },
    { mood: 'neutral', icon: 'sentiment_neutral', label: 'Biasa', color: 'text-gray-400' },
    { mood: 'sad', icon: 'sentiment_dissatisfied', label: 'Sedih', color: 'text-blue-400' },
    { mood: 'stressed', icon: 'sentiment_stressed', label: 'Stres', color: 'text-red-400' },
];

const DEFAULT_GHOST_TIMES = ['07:00', '09:00', '12:00', '14:00', '17:00'];

const DEFAULT_HABITS = [
    { habit_name: 'Water', icon: 'water_drop', value: 0 },
    { habit_name: 'Sleep', icon: 'bedtime', value: '' },
    { habit_name: 'Pray', icon: 'mosque', value: 0 },
    { habit_name: 'Read', icon: 'menu_book', value: false },
];

function getColorClass(color) {
    const map = {
        green: 'bg-sticky-green/50',
        blue: 'bg-sticky-blue/50',
        purple: 'bg-sticky-purple/40',
        pink: 'bg-sticky-pink/40',
        yellow: 'bg-sticky-yellow/50',
    };
    return map[color] || COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getColorBg(color) {
    const map = {
        green: 'bg-green-50/50',
        blue: 'bg-blue-50/50',
        purple: 'bg-purple-50/50',
        pink: 'bg-pink-50/50',
        yellow: 'bg-yellow-50/50',
    };
    return map[color] || 'bg-gray-50/50';
}

const TILTS = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[2deg]', 'rotate-[0.5deg]'];

export default function DailySpread({ date, schedule: propSchedule, priorities: propPriorities, notes: propNotes, mood: propMood, habits: propHabits }) {
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
        router.visit(`/daily-spread?date=${yyyy}-${mm}-${dd}`, { preserveState: false });
    };

    const onDatePick = (e) => {
        if (e.target.value) {
            router.visit(`/daily-spread?date=${e.target.value}`, { preserveState: false });
        }
    };

    // --- Schedule State ---
    const [scheduleItems, setScheduleItems] = useState(propSchedule || []);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [editingScheduleIdx, setEditingScheduleIdx] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({ time: '', title: '', description: '', color: 'green' });

    useEffect(() => { setScheduleItems(propSchedule || []); }, [propSchedule]);

    const scheduleSaveRef = useRef(null);
    const autoSaveSchedule = useCallback((items) => {
        if (!isAuth) return;
        clearTimeout(scheduleSaveRef.current);
        scheduleSaveRef.current = setTimeout(() => {
            axios.post('/api/daily-spread/schedule', {
                date: currentDate,
                items: items.map(({ time, title, description, color }) => ({ time, title, description, color })),
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const addScheduleItem = () => {
        if (!scheduleForm.time || !scheduleForm.title) return;
        const newItems = [...scheduleItems, { ...scheduleForm, sort_order: scheduleItems.length }].sort((a, b) => a.time.localeCompare(b.time));
        setScheduleItems(newItems);
        setScheduleForm({ time: '', title: '', description: '', color: 'green' });
        setShowScheduleForm(false);
        autoSaveSchedule(newItems);
    };

    const updateScheduleItem = (idx) => {
        if (!scheduleForm.time || !scheduleForm.title) return;
        const newItems = [...scheduleItems];
        newItems[idx] = { ...newItems[idx], ...scheduleForm };
        newItems.sort((a, b) => a.time.localeCompare(b.time));
        setScheduleItems(newItems);
        setScheduleForm({ time: '', title: '', description: '', color: 'green' });
        setEditingScheduleIdx(null);
        autoSaveSchedule(newItems);
    };

    const removeScheduleItem = (idx) => {
        const newItems = scheduleItems.filter((_, i) => i !== idx);
        setScheduleItems(newItems);
        autoSaveSchedule(newItems);
    };

    const startEditSchedule = (idx) => {
        const item = scheduleItems[idx];
        setScheduleForm({ time: item.time, title: item.title, description: item.description || '', color: item.color || 'green' });
        setEditingScheduleIdx(idx);
        setShowScheduleForm(false);
    };

    // --- Priorities State ---
    const [priorityItems, setPriorityItems] = useState(() => {
        const p = propPriorities || [];
        if (p.length === 0) return [{ text: '', completed: false }, { text: '', completed: false }, { text: '', completed: false }];
        return p;
    });

    useEffect(() => {
        const p = propPriorities || [];
        if (p.length === 0) setPriorityItems([{ text: '', completed: false }, { text: '', completed: false }, { text: '', completed: false }]);
        else setPriorityItems(p);
    }, [propPriorities]);

    const prioritySaveRef = useRef(null);
    const autoSavePriorities = useCallback((items) => {
        if (!isAuth) return;
        clearTimeout(prioritySaveRef.current);
        prioritySaveRef.current = setTimeout(() => {
            axios.post('/api/daily-spread/priorities', {
                date: currentDate,
                items: items.filter(i => i.text.trim()).map(({ text, completed }) => ({ text, completed })),
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const updatePriority = (idx, field, value) => {
        const newItems = [...priorityItems];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setPriorityItems(newItems);
        autoSavePriorities(newItems);
    };

    const addPriority = () => {
        const newItems = [...priorityItems, { text: '', completed: false }];
        setPriorityItems(newItems);
    };

    // --- Notes State ---
    const [notesContent, setNotesContent] = useState(propNotes || '');
    useEffect(() => { setNotesContent(propNotes || ''); }, [propNotes]);

    const notesSaveRef = useRef(null);
    const autoSaveNotes = useCallback((content) => {
        if (!isAuth) return;
        clearTimeout(notesSaveRef.current);
        notesSaveRef.current = setTimeout(() => {
            axios.post('/api/daily-spread/notes', { date: currentDate, content });
        }, 1000);
    }, [currentDate, isAuth]);

    const onNotesChange = (e) => {
        setNotesContent(e.target.value);
        autoSaveNotes(e.target.value);
    };

    // --- Mood State ---
    const [currentMood, setCurrentMood] = useState(propMood || null);
    const [showMoodPicker, setShowMoodPicker] = useState(false);
    useEffect(() => { setCurrentMood(propMood || null); }, [propMood]);

    const saveMood = (moodOption) => {
        setCurrentMood({ mood: moodOption.mood, icon: moodOption.icon });
        setShowMoodPicker(false);
        if (!isAuth) return;
        axios.post('/api/daily-spread/mood', { date: currentDate, mood: moodOption.mood, icon: moodOption.icon });
    };

    // --- Habits State ---
    const [habitItems, setHabitItems] = useState(() => {
        if (propHabits && propHabits.length > 0) return propHabits;
        return DEFAULT_HABITS.map(h => ({ ...h }));
    });

    useEffect(() => {
        if (propHabits && propHabits.length > 0) setHabitItems(propHabits);
        else setHabitItems(DEFAULT_HABITS.map(h => ({ ...h })));
    }, [propHabits]);

    const habitsSaveRef = useRef(null);
    const autoSaveHabits = useCallback((items) => {
        if (!isAuth) return;
        clearTimeout(habitsSaveRef.current);
        habitsSaveRef.current = setTimeout(() => {
            axios.post('/api/daily-spread/habits', {
                date: currentDate,
                habits: items.map(({ habit_name, icon, value }) => ({ habit_name, icon, value })),
            });
        }, 1000);
    }, [currentDate, isAuth]);

    const toggleHabit = (idx) => {
        const newItems = [...habitItems];
        const h = newItems[idx];
        if (h.habit_name === 'Water') {
            h.value = typeof h.value === 'number' ? (h.value >= 8 ? 0 : h.value + 1) : 1;
        } else if (h.habit_name === 'Pray') {
            h.value = typeof h.value === 'number' ? (h.value >= 5 ? 0 : h.value + 1) : 1;
        } else if (h.habit_name === 'Read') {
            h.value = !h.value;
        }
        // Sleep is handled via input
        setHabitItems(newItems);
        autoSaveHabits(newItems);
    };

    const updateSleepValue = (idx, val) => {
        const newItems = [...habitItems];
        newItems[idx] = { ...newItems[idx], value: val };
        setHabitItems(newItems);
        autoSaveHabits(newItems);
    };

    // --- Schedule inline form ---
    const renderScheduleInlineForm = (onSubmit, onCancel) => (
        <div className="bg-white/50 p-3 rounded-lg space-y-2 mb-4">
            <div className="flex gap-2 items-baseline">
                <input
                    type="time"
                    className="font-note text-sm bg-transparent border-none outline-none focus:ring-0 w-28 px-1 py-1"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                />
                <input
                    type="text"
                    placeholder="Judul kegiatan..."
                    className="font-handwriting text-lg flex-1 bg-transparent border-none outline-none focus:ring-0 px-1 py-1 placeholder:text-gray-300 placeholder:italic placeholder:font-note"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm(f => ({ ...f, title: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                    autoFocus
                />
            </div>
            <input
                type="text"
                placeholder="Deskripsi (opsional)..."
                className="font-note text-sm w-full bg-transparent border-none outline-none focus:ring-0 px-1 py-1 placeholder:text-gray-300 placeholder:italic"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm(f => ({ ...f, description: e.target.value }))}
            />
            <div className="flex items-center gap-2">
                <span className="font-note text-xs text-gray-500">Warna:</span>
                {COLOR_OPTIONS.map(c => (
                    <button
                        key={c.value}
                        onClick={() => setScheduleForm(f => ({ ...f, color: c.value }))}
                        className={`w-5 h-5 rounded-full border-2 ${c.cls} ${scheduleForm.color === c.value ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'}`}
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <button onClick={onSubmit} className="font-note text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors">
                    Simpan
                </button>
                <button onClick={onCancel} className="font-note text-sm text-gray-500 px-3 py-1 rounded hover:bg-gray-100 transition-colors">
                    Batal
                </button>
            </div>
        </div>
    );

    // --- Render Water dots ---
    const renderWaterDots = (value) => {
        const count = typeof value === 'number' ? value : 0;
        const max = 8;
        return (
            <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                {Array.from({ length: Math.min(max, 8) }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < count ? 'bg-blue-400' : 'bg-blue-100 border border-blue-200'}`} />
                ))}
            </div>
        );
    };

    // --- Render Pray dots ---
    const renderPrayDots = (value) => {
        const count = typeof value === 'number' ? value : 0;
        return (
            <div className="flex gap-0.5 mt-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < count ? 'bg-green-400' : 'bg-green-100 border border-green-200'}`} />
                ))}
            </div>
        );
    };

    const hasScheduleData = scheduleItems.length > 0;
    const selectedMoodOption = currentMood ? MOOD_OPTIONS.find(m => m.mood === currentMood.mood) : null;

    return (
        <JournalLayout
            pageTitle="Mosiku - Daily Spread Journal Page"
            headerTitle="Daily Spread"
            headerSubtitle={formattedDate}
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">park</span>}
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
                    {/* Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Coffee cup doodle */}
                    <div className="absolute -top-6 -right-6 rotate-12 z-20 drop-shadow-md">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-200 border-dashed">
                            <span className="material-symbols-outlined text-4xl text-yellow-500">local_cafe</span>
                        </div>
                    </div>
                    {/* Pink tape decoration */}
                    <div className="absolute -bottom-4 left-10 -rotate-6 z-20">
                        <span className="w-32 h-8 bg-pink-200/80 block transform skew-x-12 opacity-80" style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}></span>
                    </div>

                    {/* ======== LEFT PAGE ======== */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100">
                        <div className="washi-tape top-4 left-20 bg-blue-200/50"></div>

                        {/* Schedule Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Today's Schedule</h3>
                                <p className="font-note text-gray-400">Time blocking for focus.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl text-orange-400">partly_cloudy_day</span>
                                <span className="font-note text-sm text-gray-500">22°C</span>
                            </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="relative pl-12 space-y-6 border-l-2 border-primary/20 ml-4 py-2">
                            {hasScheduleData ? (
                                <>
                                    {scheduleItems.map((item, idx) => (
                                        <div key={item.id || idx} className="relative group">
                                            <span className="absolute -left-[3.5rem] top-0 font-note text-gray-400 text-sm w-10 text-right">
                                                {item.time?.substring(0, 5)}
                                            </span>
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors"></div>

                                            {editingScheduleIdx === idx ? (
                                                <div className="-mt-2">
                                                    {renderScheduleInlineForm(
                                                        () => updateScheduleItem(idx),
                                                        () => { setEditingScheduleIdx(null); setScheduleForm({ time: '', title: '', description: '', color: 'green' }); }
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={`${getColorClass(item.color)} p-2 rounded-lg -mt-2 transform ${TILTS[idx % TILTS.length]} hover:rotate-0 transition-transform cursor-pointer relative group/card`}
                                                    onClick={() => startEditSchedule(idx)}
                                                >
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeScheduleItem(idx); }}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-400 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        x
                                                    </button>
                                                    <span className="font-handwriting text-xl text-gray-700">{item.title}</span>
                                                    {item.description && (
                                                        <p className="font-note text-sm text-gray-600">{item.description}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                /* Ghost placeholders */
                                DEFAULT_GHOST_TIMES.map((time, idx) => (
                                    <div key={time} className="relative group">
                                        <span className="absolute -left-[3.5rem] top-0 font-note text-gray-300 text-sm w-10 text-right">{time}</span>
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-200"></div>
                                        <div
                                            className="p-2 rounded-lg -mt-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                setScheduleForm({ time, title: '', description: '', color: 'green' });
                                                setShowScheduleForm(true);
                                            }}
                                        >
                                            <span className="text-gray-300 italic font-note text-lg">Ketuk untuk tambah kegiatan...</span>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Add button */}
                            {showScheduleForm ? (
                                <div className="mt-4">
                                    {renderScheduleInlineForm(
                                        addScheduleItem,
                                        () => { setShowScheduleForm(false); setScheduleForm({ time: '', title: '', description: '', color: 'green' }); }
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setShowScheduleForm(true); setScheduleForm({ time: '', title: '', description: '', color: 'green' }); }}
                                    className="mt-4 flex items-center gap-1 text-primary/60 hover:text-primary font-note text-sm transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah kegiatan
                                </button>
                            )}
                        </div>

                        {/* Priorities Sticky Note */}
                        <div className="mt-10 bg-sticky-yellow p-4 shadow-sticky sticky-note-tilt-2 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 blur-[2px] rotate-1"></div>
                            <h4 className="font-sketch text-xl text-red-500 mb-2 border-b border-red-200 pb-1">Top 3 Priorities!</h4>
                            <ul className="space-y-2">
                                {priorityItems.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <button onClick={() => updatePriority(idx, 'completed', !item.completed)}>
                                            <span className={`material-symbols-outlined text-lg ${item.completed ? 'text-green-600' : 'text-red-400'}`}>
                                                {item.completed ? 'check_box' : 'check_box_outline_blank'}
                                            </span>
                                        </button>
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => updatePriority(idx, 'text', e.target.value)}
                                            placeholder={idx === 0 ? 'Prioritas pertamamu hari ini...' : idx === 1 ? 'Prioritas kedua...' : 'Prioritas ketiga...'}
                                            className={`font-handwriting text-lg bg-transparent border-none outline-none focus:ring-0 flex-1 ${
                                                item.completed ? 'text-gray-500 line-through decoration-wavy decoration-red-300' : 'text-gray-800'
                                            } ${!item.text ? 'placeholder:text-gray-300 placeholder:italic placeholder:font-note' : ''}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {priorityItems.length < 6 && (
                                <button
                                    onClick={addPriority}
                                    className="mt-2 flex items-center gap-1 text-red-300 hover:text-red-500 font-note text-sm transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Tambah prioritas
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ======== RIGHT PAGE ======== */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-4 right-20 bg-pink-200/50 rotate-[2deg]"></div>

                        {/* Notes & Reflections */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Notes & Reflections
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                            </h3>
                            <div className="bg-white p-6 shadow-sm border border-gray-100 paper-lines min-h-[300px] relative rounded-lg">
                                <textarea
                                    value={notesContent}
                                    onChange={onNotesChange}
                                    placeholder="Tulis catatan & refleksi hari ini..."
                                    className="font-handwriting text-xl text-gray-600 leading-[2rem] w-full min-h-[260px] bg-transparent border-none outline-none resize-none placeholder:text-gray-300 placeholder:italic placeholder:font-note focus:ring-0"
                                    style={{ lineHeight: '2rem' }}
                                />
                                <div className="absolute bottom-4 right-4 opacity-40 rotate-[-10deg] pointer-events-none">
                                    <span className="material-symbols-outlined text-6xl text-purple-300">star</span>
                                </div>
                            </div>
                        </div>

                        {/* Habits & Mood Row */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Habits */}
                            <div className="flex-1">
                                <h4 className="font-sketch text-xl text-gray-700 mb-2">Habits</h4>
                                <div className="bg-white p-3 rounded-lg border border-gray-200 grid-lines shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        {habitItems.map((habit, idx) => {
                                            const isWater = habit.habit_name === 'Water';
                                            const isSleep = habit.habit_name === 'Sleep';
                                            const isPray = habit.habit_name === 'Pray';
                                            const isRead = habit.habit_name === 'Read';
                                            const hasValue = isWater ? (typeof habit.value === 'number' && habit.value > 0) :
                                                isSleep ? (habit.value && habit.value !== '') :
                                                isPray ? (typeof habit.value === 'number' && habit.value > 0) :
                                                isRead ? !!habit.value : false;

                                            const bgColor = isWater ? 'bg-blue-50/50' : isSleep ? 'bg-indigo-50/50' : isPray ? 'bg-green-50/50' : 'bg-yellow-50/50';
                                            const iconColor = isWater ? 'text-blue-400' : isSleep ? 'text-indigo-400' : isPray ? 'text-green-400' : 'text-yellow-500';
                                            const iconColorGhost = hasValue ? iconColor : 'text-gray-300';
                                            const icon = habit.icon || (isWater ? 'water_drop' : isSleep ? 'bedtime' : isPray ? 'mosque' : 'menu_book');

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex flex-col items-center p-2 border border-gray-100 rounded ${hasValue ? bgColor : 'bg-gray-50/30'} cursor-pointer hover:shadow-sm transition-shadow`}
                                                    onClick={() => !isSleep && toggleHabit(idx)}
                                                >
                                                    <span className={`material-symbols-outlined ${iconColorGhost} mb-1`}>{icon}</span>
                                                    <span className="font-note text-xs">{habit.habit_name}</span>
                                                    {isWater && renderWaterDots(habit.value)}
                                                    {isPray && renderPrayDots(habit.value)}
                                                    {isSleep && (
                                                        <input
                                                            type="text"
                                                            value={habit.value || ''}
                                                            onChange={(e) => updateSleepValue(idx, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            placeholder="7h 30m"
                                                            className="font-handwriting text-sm font-bold text-center w-16 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-300 placeholder:italic placeholder:font-note"
                                                        />
                                                    )}
                                                    {isRead && (
                                                        habit.value ? (
                                                            <span className="material-symbols-outlined text-green-500 text-sm mt-1">check</span>
                                                        ) : (
                                                            <span className="text-gray-300 italic font-note text-xs mt-1">Tap</span>
                                                        )
                                                    )}
                                                    {!hasValue && !isSleep && !isRead && (
                                                        <span className="text-gray-300 italic font-note text-[10px] mt-0.5">Tap untuk catat</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Mood */}
                            <div className="flex-1">
                                <h4 className="font-sketch text-xl text-gray-700 mb-2">Mood</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 h-auto min-h-[148px] shadow-sm relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-yellow-200/50 rounded-full blur-xl"></div>
                                    <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 bg-pink-200/50 rounded-full blur-xl"></div>

                                    {showMoodPicker ? (
                                        <div className="z-10 w-full">
                                            <p className="font-note text-sm text-gray-500 text-center mb-3">Bagaimana perasaanmu?</p>
                                            <div className="grid grid-cols-5 gap-1">
                                                {MOOD_OPTIONS.map((m) => (
                                                    <button
                                                        key={m.mood}
                                                        onClick={() => saveMood(m)}
                                                        className={`flex flex-col items-center p-1.5 rounded-lg hover:bg-gray-50 transition-colors ${currentMood?.mood === m.mood ? 'bg-primary/10 ring-1 ring-primary/30' : ''}`}
                                                    >
                                                        <span className={`material-symbols-outlined text-2xl ${m.color}`}>{m.icon}</span>
                                                        <span className="font-note text-[10px] text-gray-500 mt-0.5">{m.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : currentMood && selectedMoodOption ? (
                                        <div
                                            className="z-10 text-center cursor-pointer"
                                            onClick={() => setShowMoodPicker(true)}
                                        >
                                            <span className={`material-symbols-outlined text-5xl ${selectedMoodOption.color} mb-1 drop-shadow-sm`}>
                                                {selectedMoodOption.icon}
                                            </span>
                                            <p className="font-handwriting text-xl text-gray-600">{selectedMoodOption.label}</p>
                                        </div>
                                    ) : (
                                        <div
                                            className="z-10 text-center cursor-pointer"
                                            onClick={() => setShowMoodPicker(true)}
                                        >
                                            <span className="material-symbols-outlined text-5xl text-gray-300 mb-1">sentiment_neutral</span>
                                            <p className="text-gray-300 italic font-note">Bagaimana perasaanmu?</p>
                                        </div>
                                    )}

                                    {!showMoodPicker && (
                                        <div
                                            className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform z-20"
                                            onClick={() => setShowMoodPicker(true)}
                                        >
                                            <span className="w-3 h-3 rounded-full bg-gray-200 block"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
