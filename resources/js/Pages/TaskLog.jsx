import React, { useState, useRef, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const DEFAULT_HABITS = [
    { habit_name: 'Water', icon: 'water_drop', value: 0 },
    { habit_name: 'Sleep', icon: 'bedtime', value: '' },
    { habit_name: 'Pray', icon: 'mosque', value: 0 },
    { habit_name: 'Read', icon: 'menu_book', value: false },
];

const TAG_OPTIONS = [
    { value: 'Work', bg: 'bg-sticky-blue', text: 'text-blue-700' },
    { value: 'Personal', bg: 'bg-sticky-purple', text: 'text-purple-700' },
    { value: 'Sunnah', bg: 'bg-sticky-green', text: 'text-green-700' },
];

function getTagStyle(tag) {
    const found = TAG_OPTIONS.find(t => t.value === tag);
    return found || { bg: 'bg-gray-100', text: 'text-gray-600' };
}

export default function TaskLog({ date, tasks: propTasks, habits: propHabits, notes: propNotes }) {
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
        router.visit(`/task-log?date=${yyyy}-${mm}-${dd}`, { preserveState: false });
    };

    const onDatePick = (e) => {
        if (e.target.value) {
            router.visit(`/task-log?date=${e.target.value}`, { preserveState: false });
        }
    };

    // Today string for overdue comparison
    const todayStr = new Date().toISOString().split('T')[0];

    // --- Task State ---
    const [tasks, setTasks] = useState(propTasks || []);
    const [newTaskText, setNewTaskText] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => { setTasks(propTasks || []); }, [propTasks]);

    const addTask = async () => {
        if (!newTaskText.trim() || !isAuth) return;
        try {
            await axios.post('/api/tasks', {
                text: newTaskText.trim(),
                tag: selectedTag,
                due_date: currentDate,
            });
            setNewTaskText('');
            setSelectedTag(null);
            router.reload({ only: ['tasks'] });
        } catch (e) {
            console.error('Failed to add task', e);
        }
    };

    const toggleTask = async (task) => {
        if (!isAuth) return;
        const newCompleted = !task.completed;
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: newCompleted } : t));
        try {
            await axios.patch(`/api/tasks/${task.id}`, { completed: newCompleted });
        } catch (e) {
            // Revert on error
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
            console.error('Failed to toggle task', e);
        }
    };

    const deleteTask = async (taskId) => {
        if (!isAuth) return;
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            router.reload({ only: ['tasks'] });
        } catch (e) {
            console.error('Failed to delete task', e);
        }
    };

    const isOverdue = (task) => {
        return task.due_date && task.due_date < todayStr && !task.completed;
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
        setHabitItems(newItems);
        autoSaveHabits(newItems);
    };

    const updateSleepValue = (idx, val) => {
        const newItems = [...habitItems];
        newItems[idx] = { ...newItems[idx], value: val };
        setHabitItems(newItems);
        autoSaveHabits(newItems);
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

    // --- Render helpers ---
    const renderWaterDots = (value) => {
        const count = typeof value === 'number' ? value : 0;
        return (
            <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < count ? 'bg-blue-400' : 'bg-blue-100 border border-blue-200'}`} />
                ))}
            </div>
        );
    };

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

    return (
        <JournalLayout
            pageTitle="Mosiku Task Log Journal"
            headerTitle="Task Log"
            headerSubtitle={formattedDate}
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-yellow-400 rotate-[-15deg]">schedule</span>}
        >
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-pink-300">stars</span>
            </div>

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
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>

                    {/* ======== LEFT PAGE — Task List ======== */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines overflow-hidden">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div className="w-full text-center">
                                <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Daily Task List</h3>
                                <div className="h-0.5 w-32 bg-blue-200 mx-auto mt-2 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative h-full w-full px-2 space-y-6 mt-6">
                            {tasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">task_alt</span>
                                    <p className="font-note text-lg text-gray-300 italic">Belum ada task hari ini...</p>
                                </div>
                            ) : (
                                tasks.map((task) => {
                                    const tagStyle = getTagStyle(task.tag);
                                    const overdue = isOverdue(task);
                                    return (
                                        <div key={task.id} className="flex items-center gap-4 group">
                                            <div className="relative flex-shrink-0">
                                                <input
                                                    checked={task.completed}
                                                    onChange={() => toggleTask(task)}
                                                    className="task-checkbox peer w-5 h-5 text-pink-500 bg-transparent border-2 border-gray-400 rounded-sm focus:ring-pink-500 focus:ring-offset-page-bg cursor-pointer"
                                                    id={`task-${task.id}`}
                                                    type="checkbox"
                                                    readOnly={!isAuth}
                                                />
                                                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white opacity-0 peer-checked:opacity-100 text-[18px] font-bold">check</span>
                                            </div>
                                            <label
                                                className={`font-handwriting text-2xl md:text-3xl cursor-pointer flex-1 transition-all flex items-center justify-between gap-2 ${
                                                    task.completed ? 'text-gray-400 line-through decoration-wavy decoration-red-300' : 'text-gray-700'
                                                }`}
                                                htmlFor={`task-${task.id}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {task.text}
                                                    {overdue && (
                                                        <span className="font-note text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full no-underline inline-block" style={{ textDecoration: 'none' }}>
                                                            overdue
                                                        </span>
                                                    )}
                                                </span>
                                                {task.tag && (
                                                    <span className={`px-3 py-1 ${tagStyle.bg} ${tagStyle.text} text-xs font-sans font-bold rounded-full flex-shrink-0`}>
                                                        {task.tag}
                                                    </span>
                                                )}
                                            </label>
                                            {isAuth && (
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-300 hover:text-red-500 flex-shrink-0"
                                                    title="Hapus task"
                                                >
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {/* Add new task */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-gray-400">add</span>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-2xl text-gray-500 placeholder-gray-400 outline-none"
                                        placeholder="Tulis task baru..."
                                        type="text"
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                    />
                                </div>
                                {/* Tag selector */}
                                <div className="flex items-center gap-2 pl-10">
                                    <span className="font-note text-xs text-gray-400">Tag:</span>
                                    {TAG_OPTIONS.map((tag) => (
                                        <button
                                            key={tag.value}
                                            onClick={() => setSelectedTag(selectedTag === tag.value ? null : tag.value)}
                                            className={`px-3 py-1 text-xs font-sans font-bold rounded-full transition-all ${
                                                selectedTag === tag.value
                                                    ? `${tag.bg} ${tag.text} ring-2 ring-offset-1 ring-current`
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10">
                            <img alt="Coffee cup doodle" className="w-20 opacity-40 mix-blend-multiply rotate-[-5deg]" src="/images/ciku-default.svg"/>
                        </div>
                    </div>

                    {/* ======== RIGHT PAGE — Habits + Notes ======== */}
                    <div className="flex-1 p-8 md:p-12 relative dot-grid overflow-hidden">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>

                        {/* Mini Habit Grid */}
                        <div className="mb-8">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-4 text-center">Habits</h3>
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

                        {/* Quick Notes */}
                        <div className="mb-4 flex flex-col items-center">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Quick Notes</h3>
                        </div>

                        <div className="relative w-full h-48 bg-sticky-yellow p-6 shadow-sticky transform rotate-[1deg] group transition-transform hover:rotate-0">
                            <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 bg-pink-200/50 rotate-[-2deg] w-24 z-20 shadow-sm mix-blend-multiply"></div>
                            <textarea
                                value={notesContent}
                                onChange={onNotesChange}
                                className="w-full h-full bg-transparent border-none resize-none font-note text-xl text-gray-800 leading-relaxed focus:ring-0 custom-scrollbar outline-none"
                                placeholder="Tulis catatan singkat di sini..."
                            />
                        </div>

                        <div className="absolute bottom-12 right-12 opacity-60 z-0 rotate-12">
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
