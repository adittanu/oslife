import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

const colorMap = {
    blue: 'bg-sticky-blue',
    pink: 'bg-sticky-pink',
    green: 'bg-sticky-green',
    purple: 'bg-sticky-purple',
    yellow: 'bg-sticky-yellow',
};

const colorBorderMap = {
    blue: 'border-blue-200',
    pink: 'border-pink-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    yellow: 'border-yellow-200',
};

const colorOptions = ['blue', 'pink', 'green', 'purple', 'yellow'];

const monthNamesId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function Calendar({ month, year, monthNum, monthName, daysInMonth, firstDayOfWeek, events = {}, upcoming = [], today }) {
    const { auth } = usePage().props;
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const [selectedDay, setSelectedDay] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newColor, setNewColor] = useState('blue');
    const [saving, setSaving] = useState(false);

    // Build calendar grid rows
    // firstDayOfWeek: Monday=1, Tuesday=2, ..., Saturday=6, Sunday=0
    // Grid columns: Mon(0), Tue(1), Wed(2), Thu(3), Fri(4), Sat(5), Sun(6)
    const startCol = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const totalCells = startCol + daysInMonth;
    const totalRows = Math.ceil(totalCells / 7);
    const weeks = [];

    for (let row = 0; row < totalRows; row++) {
        const week = [];
        for (let col = 0; col < 7; col++) {
            const cellIndex = row * 7 + col;
            const dayNum = cellIndex - startCol + 1;
            week.push(dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null);
        }
        weeks.push(week);
    }

    // Month navigation
    const prevMonth = () => {
        const d = new Date(year, monthNum - 2, 1);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.visit(`/calendar?month=${m}`);
    };

    const nextMonth = () => {
        const d = new Date(year, monthNum, 1);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        router.visit(`/calendar?month=${m}`);
    };

    const prevMonthName = monthNamesId[(monthNum - 2 + 12) % 12].substring(0, 3);
    const nextMonthName = monthNamesId[monthNum % 12].substring(0, 3);

    // Today check
    const todayParts = today ? today.split('-') : [];
    const todayDay = todayParts.length === 3 && parseInt(todayParts[0]) === year && parseInt(todayParts[1]) === monthNum
        ? parseInt(todayParts[2])
        : null;

    // Click day to open inline add
    const handleDayClick = (day) => {
        if (!auth?.user) return;
        if (selectedDay === day) {
            setSelectedDay(null);
        } else {
            setSelectedDay(day);
            setNewTitle('');
            setNewTime('');
            setNewColor('blue');
        }
    };

    // Save event
    const handleSaveEvent = async () => {
        if (!newTitle.trim() || !selectedDay || saving) return;
        setSaving(true);
        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        try {
            await axios.post('/api/calendar/event', {
                date: dateStr,
                title: newTitle.trim(),
                time: newTime || null,
                color: newColor,
            });
            setSelectedDay(null);
            setNewTitle('');
            setNewTime('');
            router.reload();
        } catch (e) {
            console.error('Failed to save event', e);
        } finally {
            setSaving(false);
        }
    };

    // Delete event
    const handleDeleteEvent = async (id) => {
        if (!auth?.user) return;
        try {
            await axios.delete(`/api/calendar/event/${id}`);
            router.reload();
        } catch (e) {
            console.error('Failed to delete event', e);
        }
    };

    // Quick add from sidebar
    const [quickTitle, setQuickTitle] = useState('');
    const handleQuickAdd = async (e) => {
        if (e.key !== 'Enter' || !quickTitle.trim() || !auth?.user) return;
        const dateStr = today || `${year}-${String(monthNum).padStart(2, '0')}-01`;
        try {
            await axios.post('/api/calendar/event', {
                date: dateStr,
                title: quickTitle.trim(),
                color: 'blue',
            });
            setQuickTitle('');
            router.reload();
        } catch (e) {
            console.error('Failed to save event', e);
        }
    };

    const hasAnyEvents = Object.keys(events).length > 0;

    return (
        <JournalLayout
            pageTitle="Mosiku - Calendar"
            headerTitle="Calendar"
            headerSubtitle={`${monthName} ${year}`}
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-blue-300 rotate-12">calendar_month</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl">
                    {/* Month header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={prevMonth}
                            className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                            <span className="font-note">{prevMonthName}</span>
                        </button>
                        <h3 className="font-handwriting text-4xl font-bold text-gray-800">
                            {monthName} {year}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium"
                        >
                            <span className="font-note">{nextMonthName}</span>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Calendar grid */}
                    <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 overflow-hidden">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-gray-200">
                            {days.map((day, i) => (
                                <div
                                    key={i}
                                    className={`px-2 py-3 text-center text-sm font-bold uppercase tracking-wider ${
                                        i >= 5 ? 'text-primary/60' : 'text-gray-400'
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        {weeks.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                {week.map((day, di) => {
                                    const dayEvents = day ? (events[day] || []) : [];
                                    const isToday = day === todayDay;
                                    const isSelected = day === selectedDay;

                                    return (
                                        <div
                                            key={di}
                                            onClick={() => day && handleDayClick(day)}
                                            className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 transition-colors ${
                                                day ? 'hover:bg-white/60 cursor-pointer' : 'bg-gray-50/30'
                                            } ${isToday ? 'bg-primary/5' : ''} ${isSelected ? 'bg-primary/10 ring-1 ring-primary/30' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <span
                                                        className={`font-handwriting text-lg inline-flex items-center justify-center ${
                                                            isToday
                                                                ? 'bg-primary text-white w-7 h-7 rounded-full font-bold'
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {day}
                                                    </span>
                                                    {dayEvents.map((event, ei) => (
                                                        <div
                                                            key={ei}
                                                            className={`${colorMap[event.color] || 'bg-sticky-blue'} mt-1 px-2 py-1 rounded-lg group relative`}
                                                        >
                                                            <span className="font-note text-xs text-gray-700 truncate block">
                                                                {event.time && event.time !== '00:00' && (
                                                                    <span className="text-gray-500 mr-1">{event.time}</span>
                                                                )}
                                                                {event.text}
                                                            </span>
                                                            {auth?.user && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteEvent(event.id);
                                                                    }}
                                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white rounded-full text-xs leading-none items-center justify-center hidden group-hover:flex hover:bg-red-500"
                                                                >
                                                                    x
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Inline add form */}
                                                    {isSelected && auth?.user && (
                                                        <div className="mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="text"
                                                                value={newTitle}
                                                                onChange={(e) => setNewTitle(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEvent()}
                                                                className="w-full bg-transparent border-none outline-none focus:ring-0 font-note text-xs text-gray-700 placeholder-gray-400 p-0"
                                                                placeholder="Tulis jadwal..."
                                                                autoFocus
                                                            />
                                                            <input
                                                                type="time"
                                                                value={newTime}
                                                                onChange={(e) => setNewTime(e.target.value)}
                                                                className="w-full bg-transparent border-none outline-none focus:ring-0 font-note text-xs text-gray-500 p-0"
                                                            />
                                                            <div className="flex items-center gap-1">
                                                                {colorOptions.map((c) => (
                                                                    <button
                                                                        key={c}
                                                                        onClick={() => setNewColor(c)}
                                                                        className={`w-4 h-4 rounded-full ${colorMap[c]} ${
                                                                            newColor === c ? 'ring-2 ring-primary ring-offset-1' : ''
                                                                        }`}
                                                                    />
                                                                ))}
                                                                <button
                                                                    onClick={handleSaveEvent}
                                                                    disabled={saving || !newTitle.trim()}
                                                                    className="ml-auto text-primary hover:text-primary/80 disabled:opacity-40"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Ghost placeholder when no events */}
                    {!hasAnyEvents && (
                        <p className="text-center font-note text-gray-400 italic mt-6">
                            Belum ada jadwal bulan ini...
                        </p>
                    )}

                    {/* Upcoming events & Quick Add */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg]">
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2">
                                Upcoming Events
                            </h4>
                            <div className="space-y-3">
                                {upcoming.length > 0 ? (
                                    upcoming.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="font-handwriting text-primary font-bold whitespace-nowrap">
                                                {item.date}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${colorMap[item.color] || 'bg-sticky-blue'} flex-shrink-0`} />
                                            <span className="font-note text-gray-700 truncate">{item.text}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="font-note text-gray-400 italic text-sm">
                                        Tidak ada jadwal mendatang...
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="bg-sticky-blue p-6 shadow-sticky rotate-[1deg]">
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-blue-200 pb-2">
                                Quick Add
                            </h4>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">add_circle</span>
                                <input
                                    className="w-full bg-transparent border-none outline-none focus:ring-0 font-note text-lg text-gray-600 placeholder-gray-400"
                                    placeholder="Tambah jadwal baru..."
                                    type="text"
                                    value={quickTitle}
                                    onChange={(e) => setQuickTitle(e.target.value)}
                                    onKeyDown={handleQuickAdd}
                                />
                            </div>
                            <p className="font-note text-xs text-gray-400 mt-2 italic">
                                Tekan Enter untuk menambah ke hari ini
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
