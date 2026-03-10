import React, { useState, useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

function formatDuration(minutes) {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTimer(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimeTracking({ entries: propEntries, projects: propProjects }) {
    const [entries, setEntries] = useState(propEntries || []);
    const [projects, setProjects] = useState(propProjects || []);
    const [showModal, setShowModal] = useState(false);
    const [runningEntry, setRunningEntry] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [formData, setFormData] = useState({ project_id: '', description: '', duration: '' });

    useEffect(() => { setEntries(propEntries || []); }, [propEntries]);
    useEffect(() => { setProjects(propProjects || []); }, [propProjects]);

    // Find running entry and start timer
    useEffect(() => {
        const running = entries.find(e => e.is_running);
        if (running) {
            setRunningEntry(running);
            const start = new Date(running.start_time).getTime();
            setTimerSeconds(Math.floor((Date.now() - start) / 1000));
        }
    }, [entries]);

    // Timer interval
    useEffect(() => {
        if (!runningEntry) return;
        const interval = setInterval(() => {
            const start = new Date(runningEntry.start_time).getTime();
            setTimerSeconds(Math.floor((Date.now() - start) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [runningEntry]);

    const weeklyData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const hours = days.map(() => 0);
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        entries.forEach(e => {
            const entryDate = new Date(e.start_time);
            if (entryDate >= startOfWeek) {
                const dayIdx = entryDate.getDay();
                const mins = e.end_time ? new Date(e.end_time).getTime() - new Date(e.start_time).getTime() : (Date.now() - new Date(e.start_time).getTime());
                hours[dayIdx] += mins / 60000;
            }
        });
        const max = Math.max(...hours, 60);
        return days.map((day, i) => ({ day, hours: hours[i], height: `${(hours[i] / max) * 100}%` }));
    }, [entries]);

    const totalWeekHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);
    const todayTotal = entries.filter(e => {
        const today = new Date().toISOString().split('T')[0];
        return e.start_time?.startsWith(today);
    }).reduce((sum, e) => {
        const start = new Date(e.start_time).getTime();
        const end = e.end_time ? new Date(e.end_time).getTime() : Date.now();
        return sum + (end - start) / 60000;
    }, 0);

    const startTimer = async () => {
        if (!projects.length) { alert('Tambahkan proyek terlebih dahulu'); return; }
        try {
            const res = await axios.post('/api/work/time-entries', {
                project_id: projects[0].id,
                start_time: new Date().toISOString(),
                is_running: true,
                description: ''
            });
            setEntries([res.data, ...entries]);
            setRunningEntry(res.data);
            setTimerSeconds(0);
        } catch (err) { console.error(err); }
    };

    const stopTimer = async () => {
        if (!runningEntry) return;
        try {
            const res = await axios.put(`/api/work/time-entries/${runningEntry.id}`, {
                end_time: new Date().toISOString(),
                is_running: false
            });
            setEntries(entries.map(e => e.id === runningEntry.id ? res.data : e));
            setRunningEntry(null);
            setTimerSeconds(0);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const durationMins = parseInt(formData.duration) || 0;
            const startTime = new Date();
            startTime.setMinutes(startTime.getMinutes() - durationMins);
            const res = await axios.post('/api/work/time-entries', {
                project_id: formData.project_id,
                description: formData.description,
                start_time: startTime.toISOString(),
                end_time: new Date().toISOString(),
                is_running: false
            });
            setEntries([res.data, ...entries]);
            setShowModal(false);
            setFormData({ project_id: '', description: '', duration: '' });
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await axios.delete(`/api/work/time-entries/${id}`);
            setEntries(entries.filter(e => e.id !== id));
        } catch (err) { console.error(err); }
    };

    const openAdd = () => {
        setFormData({ project_id: projects[0]?.id || '', description: '', duration: '' });
        setShowModal(true);
    };

    if (!entries.length && !runningEntry) {
        return (
            <JournalLayout pageTitle="Work OS - Time Tracking" headerTitle="Time Tracking" headerSubtitle="Track every minute" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="schedule" title="Belum ada entri waktu" description="Mulai timer atau catat waktu kerja secara manual" actionLabel="Log Time" onAction={openAdd} />
                    </div>
                </div>
                {showModal && <TimeEntryModal formData={formData} setFormData={setFormData} projects={projects} handleSubmit={handleSubmit} setShowModal={setShowModal} />}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Time Tracking" headerTitle="Time Tracking" headerSubtitle="Track every minute" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">schedule</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]"><span className="material-symbols-outlined text-[80px] text-primary">hourglass_top</span></div>
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-10">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-rose-100/80 rotate-1"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-2">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700 mb-1 flex items-center justify-center md:justify-start gap-2"><span className="material-symbols-outlined text-rose-400">timer</span>Today's Timer</h3>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 inline-block">
                                    <p className="font-handwriting text-6xl font-bold text-gray-800 tracking-wider">{formatTimer(timerSeconds)}</p>
                                    {runningEntry && <div className="mt-3"><p className="font-note text-sm text-gray-600"><span className="font-bold text-primary">{runningEntry.project?.name || '-'}</span></p></div>}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-5">
                                <button onClick={runningEntry ? stopTimer : startTimer} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 group ${runningEntry ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary hover:bg-primary/90'}`}>
                                    <span className="material-symbols-outlined text-3xl text-white">{runningEntry ? 'stop' : 'play_arrow'}</span>
                                </button>
                                <p className="font-note text-xs text-gray-400">{runningEntry ? 'Click to stop timer' : 'Click to start timer'}</p>
                                <div className="bg-rose-50 border border-rose-100 rounded-xl px-6 py-3 text-center">
                                    <p className="font-note text-xs text-gray-500">Today's Total</p>
                                    <p className="font-handwriting text-2xl font-bold text-rose-700">{formatDuration(todayTotal)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-10 bg-blue-100/80 rotate-[-2deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5 flex items-center gap-2"><span className="material-symbols-outlined text-blue-400">bar_chart</span>Weekly Summary</h3>
                            <div className="flex items-end gap-3 h-48 px-2">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="font-note text-xs text-gray-500">{d.hours > 0 ? `${(d.hours/60).toFixed(1)}h` : ''}</span>
                                        <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                                            <div className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all ${d.hours > 0 ? 'bg-primary/70' : 'bg-gray-200/50'}`} style={{ height: d.height }}></div>
                                        </div>
                                        <span className="font-note text-xs text-gray-600 font-bold">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-4"><p className="font-note text-sm text-gray-400">Week total: <span className="font-bold text-primary">{(totalWeekHours/60).toFixed(1)}h</span></p></div>
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-5">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">insights</span>Week at a Glance</h4>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between"><span className="font-note text-sm text-gray-600">Total Hours</span><span className="font-handwriting text-lg font-bold text-gray-800">{(totalWeekHours/60).toFixed(1)}h</span></div>
                                    <div className="flex justify-between"><span className="font-note text-sm text-gray-600">Avg per Day</span><span className="font-handwriting text-lg font-bold text-gray-800">{(totalWeekHours/7).toFixed(1)}h</span></div>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2">Weekly Goal</h4>
                                <div className="flex justify-between font-note text-sm text-gray-600 mb-1"><span>40 hours</span><span>{Math.round((totalWeekHours/2400)*100)}%</span></div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((totalWeekHours/2400)*100, 100)}%` }}></div></div>
                                <p className="font-note text-xs text-gray-400 mt-2">{(40 - totalWeekHours/60).toFixed(1)}h remaining</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8 paper-lines">
                        <div className="washi-tape -top-2 left-20 bg-green-100/80 rotate-[-1deg]"></div>
                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div><h3 className="font-handwriting text-2xl font-bold text-gray-700">Recent Entries</h3><p className="font-note text-sm text-gray-400">Your logged time</p></div>
                            <button onClick={openAdd} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm"><span className="material-symbols-outlined text-[18px]">add</span> Log Time</button>
                        </div>
                        <div className="space-y-3">
                            {entries.filter(e => !e.is_running).slice(0, 10).map((entry, idx) => {
                                const mins = entry.end_time ? new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime() : 0;
                                return (
                                    <div key={entry.id || idx} className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border border-gray-100 hover:bg-white/80 transition-colors">
                                        <div className="w-1.5 h-12 rounded-full bg-primary/40 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{entry.project?.name || '-'}</span>
                                            <p className="font-note text-sm text-gray-600 mt-1 truncate">{entry.description || '-'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-handwriting text-lg font-bold text-gray-800">{formatDuration(mins/60000)}</p>
                                            <p className="font-note text-xs text-gray-400">{new Date(entry.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <button onClick={() => handleDelete(entry.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <TimeEntryModal formData={formData} setFormData={setFormData} projects={projects} handleSubmit={handleSubmit} setShowModal={setShowModal} />}
        </JournalLayout>
    );
}

function TimeEntryModal({ formData, setFormData, projects, handleSubmit, setShowModal }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="font-handwriting text-xl font-bold mb-4">Log Time</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required>
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" rows={2} />
                    <input type="number" placeholder="Duration (minutes)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">Add Entry</button>
                    </div>
                </form>
            </div>
        </div>
    );
}