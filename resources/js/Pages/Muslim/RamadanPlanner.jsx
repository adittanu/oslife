import React, { useState, useEffect } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import axios from 'axios';

export default function RamadanPlanner({ logs: initialLogs, goals: initialGoals, stats, currentYear, monthBase }) {
    const [logs, setLogs] = useState(initialLogs || {});
    const [goals, setGoals] = useState(initialGoals || []);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [newGoal, setNewGoal] = useState({
        goal_type: '',
        description: '',
        target: 30,
        ramadan_year: currentYear,
    });

    const specialNights = [21, 23, 25, 27, 29];

    useEffect(() => {
        setLogs(initialLogs || {});
    }, [initialLogs]);

    useEffect(() => {
        setGoals(initialGoals || []);
    }, [initialGoals]);

    // Generate 30 days of Ramadan
    const days = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const isSpecial = specialNights.includes(day);
        const log = logs[day] || null;
        return {
            day,
            isSpecial,
            log,
        };
    });

    const saveLog = (day, field, value) => {
        const date = `${monthBase}-${String(day).padStart(2, '0')}`;

        axios.post('/api/muslim/ramadan/log', {
            date,
            [field]: value,
        }).then(({ data }) => {
            setLogs((prev) => ({
                ...prev,
                [day]: { ...(prev[day] || {}), ...data },
            }));
        });
    };

    const saveGoalData = () => {
        if (!newGoal.goal_type || !newGoal.description) return;

        axios.post('/api/muslim/ramadan/goal', newGoal).then(({ data }) => {
            setGoals((prev) => {
                const exists = prev.some((goal) => goal.id === data.id || goal.goal_type === data.goal_type);
                if (exists) {
                    return prev.map((goal) => goal.id === data.id || goal.goal_type === data.goal_type ? data : goal);
                }
                return [...prev, data];
            });
            setShowGoalForm(false);
            setNewGoal({
                goal_type: '',
                description: '',
                target: 30,
                ramadan_year: currentYear,
            });
        });
    };

    const updateGoalProgress = (goalId, current) => {
        axios.patch(`/api/muslim/ramadan/goal/${goalId}`, { current }).then(({ data }) => {
            setGoals((prev) => prev.map((goal) => goal.id === goalId ? data : goal));
        });
    };

    const iftarMenu = [
        { day: 'Hari 1-5', menu: 'Kolak pisang, kurma, es buah' },
        { day: 'Hari 6-10', menu: 'Es cendol, gorengan, bubur sumsum' },
        { day: 'Hari 11-15', menu: 'Tajil masjid, kurma ajwa, jus alpukat' },
        { day: 'Hari 16-20', menu: 'Sop buah, roti maryam, teh hangat' },
        { day: 'Hari 21-25', menu: 'Bubur kacang hijau, kurma, air zam-zam' },
        { day: 'Hari 26-30', menu: 'Ketupat mini, opor, es kelapa muda' },
    ];

    return (
        <JournalLayout
            pageTitle="Muslim OS - Ramadan Planner"
            headerTitle="Ramadan Planner"
            headerSubtitle="The month of blessing"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">nights_stay</span>}
        >
            <div className="absolute bottom-16 left-[30%] opacity-15 pointer-events-none rotate-[15deg]">
                <span className="material-symbols-outlined text-[60px] text-indigo-300">auto_awesome</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1400px] h-auto min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col xl:flex-row border border-gray-200">
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-200 hidden xl:block z-10"></div>

                    {/* Left — 30-day Grid */}
                    <div className="w-full xl:w-2/3 p-6 md:p-10 relative border-b xl:border-b-0 xl:border-r border-gray-100 grid-lines overflow-hidden flex flex-col">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-indigo-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-4 z-10 relative">
                            <div className="w-full text-center xl:text-left xl:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Checklist Ramadan {currentYear}H</h3>
                                <div className="h-0.5 w-48 bg-indigo-200 mx-auto xl:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-6 mb-4 z-10 relative">
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-emerald-600">{stats?.completeFast || 0}</span>
                                <p className="font-note text-xs text-gray-400">Puasa Penuh</p>
                            </div>
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-indigo-600">{stats?.totalTarawih || 0}</span>
                                <p className="font-note text-xs text-gray-400">Tarawih</p>
                            </div>
                            <div className="text-center">
                                <span className="font-handwriting text-2xl font-bold text-amber-600">{stats?.totalQuran || 0}</span>
                                <p className="font-note text-xs text-gray-400">Halaman Quran</p>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-4 z-10 relative text-sm font-note text-gray-500 pl-4">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Sahur</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block"></span> Tarawih</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Quran</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-yellow-500">nights_stay</span> Lailatul Qadr</span>
                        </div>

                        {/* 30-day Grid */}
                        <div className="overflow-x-auto flex-1 custom-scrollbar relative z-10">
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 min-w-[600px]">
                                {days.map((d) => {
                                    const log = d.log;
                                    return (
                                        <div
                                            key={d.day}
                                            onClick={() => setSelectedDay(d.day)}
                                            className={`relative rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 cursor-pointer ${
                                                d.isSpecial
                                                    ? 'border-yellow-400 bg-yellow-50 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                                                    : 'border-gray-200 bg-white/60 hover:border-primary/30'
                                            }`}
                                        >
                                            {d.isSpecial && (
                                                <span className="absolute -top-2 -right-2 material-symbols-outlined text-yellow-500 text-base">nights_stay</span>
                                            )}
                                            <span className={`font-handwriting text-lg font-bold ${d.isSpecial ? 'text-yellow-700' : 'text-gray-700'}`}>
                                                {d.day}
                                            </span>
                                            <div className="flex gap-1 flex-wrap justify-center">
                                                {log?.sahur && <span className="w-4 h-4 rounded-full bg-emerald-400 text-white text-[8px] flex items-center justify-center">S</span>}
                                                {log?.tarawih && <span className="w-4 h-4 rounded-full bg-indigo-400 text-white text-[8px] flex items-center justify-center">T</span>}
                                                {log?.quran_pages > 0 && (
                                                    <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[8px] flex items-center justify-center">{log.quran_pages}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Day Detail Modal */}
                        {selectedDay && (
                            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
                                <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                                    <h4 className="font-handwriting text-2xl font-bold text-gray-700 mb-4">Hari {selectedDay} Ramadan</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={logs[selectedDay]?.sahur || false}
                                                onChange={(e) => saveLog(selectedDay, 'sahur', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="font-note text-gray-700">Sahur</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={logs[selectedDay]?.iftar || false}
                                                onChange={(e) => saveLog(selectedDay, 'iftar', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="font-note text-gray-700">Buka Puasa</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={logs[selectedDay]?.tarawih || false}
                                                onChange={(e) => saveLog(selectedDay, 'tarawih', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="font-note text-gray-700">Tarawih</span>
                                        </label>
                                        <div>
                                            <label className="font-note text-sm text-gray-500">Halaman Quran</label>
                                            <input
                                                type="number"
                                                value={logs[selectedDay]?.quran_pages || 0}
                                                onChange={(e) => saveLog(selectedDay, 'quran_pages', parseInt(e.target.value) || 0)}
                                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-note text-sm text-gray-500">Refleksi</label>
                                            <textarea
                                                value={logs[selectedDay]?.reflection || ''}
                                                onChange={(e) => saveLog(selectedDay, 'reflection', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDay(null)}
                                        className="mt-4 w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg"
                                    >
                                        Selesai
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-6 z-10 relative">
                            <div className="flex justify-between font-note text-sm text-gray-500 mb-1">
                                <span>Progress Ramadan</span>
                                <span>{stats?.totalDays || 0} / 30 hari</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
                                <div
                                    className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full transition-all"
                                    style={{ width: `${((stats?.totalDays || 0) / 30) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Iftar Menu & Special Notes */}
                    <div className="w-full xl:w-1/3 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-amber-100/70 rotate-[3deg]"></div>

                        <div className="mb-6 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-1 mt-4 xl:mt-0">Menu Buka Puasa</h3>
                            <span className="font-note text-gray-400 text-sm">Perencanaan iftar mingguan</span>
                        </div>

                        <div className="space-y-3 relative z-10 mb-8">
                            {iftarMenu.map((item, i) => (
                                <div key={i} className="bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm hover:bg-white/80 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-amber-500 text-base">restaurant</span>
                                        <span className="font-handwriting text-lg font-bold text-gray-700">{item.day}</span>
                                    </div>
                                    <p className="font-note text-sm text-gray-600 pl-7">{item.menu}</p>
                                </div>
                            ))}
                        </div>

                        {/* Goals */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-handwriting text-xl font-bold text-gray-700">Target Ramadan</h4>
                                <button
                                    onClick={() => setShowGoalForm(!showGoalForm)}
                                    className="text-primary text-sm font-note"
                                >
                                    + Tambah
                                </button>
                            </div>
                            {goals?.length === 0 ? (
                                <div className="bg-white/40 rounded-xl p-4 border border-dashed border-gray-200 text-center">
                                    <p className="font-note text-sm text-gray-400">Ketuk untuk tambah target...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {goals?.map((goal, i) => (
                                        <div key={goal.id || i} className="bg-white/60 p-3 rounded-xl border border-gray-100">
                                            <p className="font-handwriting text-base text-gray-700">{goal.description}</p>
                                            <div className="mt-2">
                                                <div className="flex justify-between text-xs font-note text-gray-400 mb-1">
                                                    <span>{goal.current}/{goal.target}</span>
                                                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={goal.target || 30}
                                                    value={goal.current || 0}
                                                    onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value, 10) || 0)}
                                                    className="w-full mt-2 accent-primary"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Lailatul Qadr sticky */}
                        <div className="bg-indigo-100 p-5 shadow-sticky rotate-[-1deg] relative z-10 border border-indigo-200 mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-indigo-600">nights_stay</span>
                                <h4 className="font-handwriting text-xl font-bold text-indigo-800">Malam Lailatul Qadr</h4>
                            </div>
                            <p className="font-note text-sm text-indigo-700 leading-relaxed">
                                Perbanyak ibadah di malam ganjil 10 hari terakhir: <strong>21, 23, 25, 27, 29 Ramadan</strong>.
                            </p>
                        </div>

                        {/* Dua sticky */}
                        <div className="bg-yellow-100 p-4 shadow-sticky rotate-[2deg] relative z-10 border border-yellow-200">
                            <h4 className="font-handwriting text-base text-yellow-800 mb-2">Doa Buka Puasa</h4>
                            <p className="font-handwriting text-lg text-gray-800 text-center leading-relaxed">
                                "Allahumma laka sumtu wa bika aamantu wa 'ala rizqika aftartu"
                            </p>
                            <p className="font-note text-xs text-gray-500 text-center mt-1">
                                Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
