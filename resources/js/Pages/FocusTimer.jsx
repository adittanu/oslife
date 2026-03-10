import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

export default function FocusTimer({ todaySessions: propSessions, stats: propStats }) {
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [stats, setStats] = useState(propStats || {
        total_sessions: 0,
        total_minutes: 0,
        tasks_completed: 0,
        streak: 0,
    });
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [activeSession, setActiveSession] = useState(null);
    const intervalRef = useRef(null);

    const modes = {
        focus: { label: 'Focus', duration: 25, color: 'primary', icon: 'local_fire_department' },
        short: { label: 'Short Break', duration: 5, color: 'green-500', icon: 'coffee' },
        long: { label: 'Long Break', duration: 15, color: 'blue-500', icon: 'self_improvement' },
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            handleCompleteSession();
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(modes[newMode].duration * 60);
        setIsRunning(false);
    };

    const resetTimer = () => {
        setTimeLeft(modes[mode].duration * 60);
        setIsRunning(false);
    };

    const startSession = async () => {
        try {
            const res = await axios.post('/api/focus/sessions', {
                date: new Date().toISOString().split('T')[0],
                duration: modes[mode].duration,
                mode: mode,
                tasks: tasks.map(t => (typeof t === 'string' ? { text: t, done: false } : t)),
            });
            setActiveSession(res.data);
            setTasks(res.data.tasks || tasks);
        } catch (e) {
            console.error('Failed to start session', e);
        }
    };

    const handleCompleteSession = async () => {
        setIsRunning(false);
        if (activeSession?.id) {
            try {
                await axios.patch(`/api/focus/sessions/${activeSession.id}`, { completed: true });
                setStats((prev) => ({
                    ...prev,
                    total_sessions: (prev.total_sessions || 0) + 1,
                    total_minutes: (prev.total_minutes || 0) + (activeSession.duration || 0),
                }));
            } catch (e) {
                console.error('Failed to complete session', e);
            }
        }
        setTimeLeft(modes[mode].duration * 60);
    };

    const addTask = async () => {
        if (!newTask.trim()) return;
        try {
            if (activeSession?.id) {
                const res = await axios.post(`/api/focus/sessions/${activeSession.id}/tasks`, {
                    text: newTask.trim(),
                });
                setTasks(res.data.tasks || [...tasks, newTask.trim()]);
            } else {
                setTasks([...tasks, newTask.trim()]);
            }
            setNewTask('');
        } catch (e) {
            console.error('Failed to add task', e);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    useEffect(() => {
        setStats(propStats || {
            total_sessions: 0,
            total_minutes: 0,
            tasks_completed: 0,
            streak: 0,
        });
    }, [propStats]);

    const progress = (((modes[mode].duration * 60) - timeLeft) / (modes[mode].duration * 60)) * 100;

    return (
        <JournalLayout
            pageTitle="Mosiku - Focus Timer"
            headerTitle="Focus Timer"
            headerSubtitle="Deep work, one session at a time."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-red-300 rotate-12">timer</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    {/* Left — Timer */}
                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 flex flex-col items-center justify-center">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-red-100/80 rotate-1"></div>

                        {/* Mode switcher */}
                        <div className="flex gap-2 mb-10">
                            {Object.entries(modes).map(([key, m]) => (
                                <button
                                    key={key}
                                    onClick={() => switchMode(key)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                        mode === key
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Timer circle */}
                        <div className="relative w-64 h-64 mb-8">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                                <circle
                                    cx="50" cy="50" r="45" fill="none"
                                    stroke="#EC4899"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-handwriting text-6xl font-bold text-gray-800">
                                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                                </span>
                                <span className="font-note text-gray-400 text-sm mt-1">{modes[mode].label}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={resetTimer}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">refresh</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (!isRunning && !activeSession) startSession();
                                    setIsRunning(!isRunning);
                                }}
                                className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {isRunning ? 'pause' : 'play_arrow'}
                                </span>
                            </button>
                            <button
                                onClick={() => switchMode(mode === 'focus' ? 'short' : 'focus')}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">skip_next</span>
                            </button>
                        </div>

                        {/* Session dots */}
                        <div className="flex gap-2 mt-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < (stats.total_sessions || 0) % 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            ))}
                            <span className="font-note text-xs text-gray-400 ml-2">{stats.total_sessions || 0} sessions today</span>
                        </div>
                    </div>

                    {/* Right — Task list & stats */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="washi-tape top-0 right-10 bg-yellow-100/70 rotate-[3deg]"></div>

                        <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-6">Focus Tasks</h3>
                        <div className="space-y-3 mb-10">
                            {tasks.length === 0 ? (
                                <p className="font-note text-gray-400 italic">No tasks added yet</p>
                            ) : (
                                tasks.map((task, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <span className="material-symbols-outlined text-gray-300 text-lg">radio_button_unchecked</span>
                                        <span className="font-note text-lg text-gray-700">{typeof task === 'string' ? task : task.text}</span>
                                    </div>
                                ))
                            )}
                            <div className="flex items-center gap-3 mt-4">
                                <span className="material-symbols-outlined text-gray-300">add</span>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 font-note text-lg text-gray-500 placeholder-gray-300"
                                    placeholder="Add focus task..."
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                />
                            </div>
                        </div>

                        {/* Today's stats */}
                        <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-4">Today's Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-sticky-pink p-4 rounded-xl shadow-sm text-center">
                                <span className="font-handwriting text-3xl font-bold text-gray-800">{stats.total_sessions || 0}</span>
                                <p className="font-note text-sm text-gray-500">Sessions</p>
                            </div>
                            <div className="bg-sticky-blue p-4 rounded-xl shadow-sm text-center">
                                <span className="font-handwriting text-3xl font-bold text-gray-800">{stats.total_minutes || 0}m</span>
                                <p className="font-note text-sm text-gray-500">Focus Time</p>
                            </div>
                            <div className="bg-sticky-green p-4 rounded-xl shadow-sm text-center">
                                <span className="font-handwriting text-3xl font-bold text-gray-800">{tasks.filter(t => typeof t === 'object' ? t.done : false).length}</span>
                                <p className="font-note text-sm text-gray-500">Tasks Done</p>
                            </div>
                            <div className="bg-sticky-yellow p-4 rounded-xl shadow-sm text-center">
                                <span className="font-handwriting text-3xl font-bold text-gray-800">🔥</span>
                                <p className="font-note text-sm text-gray-500">{stats.streak || 0} Day Streak</p>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none rotate-[-10deg]">
                            <span className="material-symbols-outlined text-[80px] text-orange-300">local_fire_department</span>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
