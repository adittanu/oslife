import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Calendar() {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const currentMonth = [
        [null, null, null, null, null, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30],
    ];

    const events = {
        5: [{ text: 'Team Meeting', color: 'bg-sticky-blue' }],
        9: [{ text: 'Deadline Project', color: 'bg-sticky-pink' }],
        12: [{ text: 'Dentist', color: 'bg-sticky-purple' }],
        15: [{ text: 'Mom Birthday', color: 'bg-sticky-yellow' }],
        20: [{ text: 'Presentation', color: 'bg-sticky-blue' }],
        25: [{ text: 'Weekly Review', color: 'bg-sticky-green' }],
    };

    return (
        <JournalLayout
            pageTitle="Life OS - Calendar"
            headerTitle="Calendar"
            headerSubtitle="March 2026"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-blue-300 rotate-12">calendar_month</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl">
                    {/* Month header */}
                    <div className="flex items-center justify-between mb-8">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="material-symbols-outlined">chevron_left</span>
                            <span className="font-note">Feb</span>
                        </button>
                        <h3 className="font-handwriting text-4xl font-bold text-gray-800">March 2026</h3>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="font-note">Apr</span>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Calendar grid */}
                    <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 overflow-hidden">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-gray-200">
                            {days.map((day, i) => (
                                <div key={i} className={`px-2 py-3 text-center text-sm font-bold uppercase tracking-wider ${i >= 5 ? 'text-primary/60' : 'text-gray-400'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        {currentMonth.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 transition-colors ${
                                            day ? 'hover:bg-white/60 cursor-pointer' : 'bg-gray-50/30'
                                        } ${day === 9 ? 'bg-primary/5' : ''}`}
                                    >
                                        {day && (
                                            <>
                                                <span className={`font-handwriting text-lg ${day === 9 ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                    {day}
                                                </span>
                                                {events[day] && events[day].map((event, ei) => (
                                                    <div key={ei} className={`${event.color} mt-1 px-2 py-1 rounded-lg`}>
                                                        <span className="font-note text-xs text-gray-700 truncate block">{event.text}</span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Upcoming events sidebar */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg]">
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2">Upcoming Events</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold">9 Mar</span>
                                    <span className="font-note text-gray-700">Deadline Project</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold">12 Mar</span>
                                    <span className="font-note text-gray-700">Dentist Appointment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold">15 Mar</span>
                                    <span className="font-note text-gray-700">Mom's Birthday</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sticky-blue p-6 shadow-sticky rotate-[1deg]">
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-blue-200 pb-2">Quick Add</h4>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">add_circle</span>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 font-note text-lg text-gray-600 placeholder-gray-400"
                                    placeholder="Add new event..."
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
