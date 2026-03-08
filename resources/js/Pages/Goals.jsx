import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Goals() {
    const goals = [
        {
            title: 'Launch Side Project',
            category: 'Career',
            deadline: 'June 2026',
            progress: 65,
            color: 'primary',
            milestones: [
                { text: 'Design mockups', done: true },
                { text: 'Build MVP', done: true },
                { text: 'Beta testing', done: false },
                { text: 'Launch day!', done: false },
            ]
        },
        {
            title: 'Read 24 Books',
            category: 'Personal',
            deadline: 'Dec 2026',
            progress: 25,
            color: 'green-500',
            milestones: [
                { text: '6 books (Q1)', done: true },
                { text: '12 books (Q2)', done: false },
                { text: '18 books (Q3)', done: false },
                { text: '24 books (Q4)', done: false },
            ]
        },
        {
            title: 'Save Rp 50 Juta',
            category: 'Finance',
            deadline: 'Dec 2026',
            progress: 40,
            color: 'blue-500',
            milestones: [
                { text: 'Rp 12.5 Juta (Q1)', done: true },
                { text: 'Rp 25 Juta (Q2)', done: true },
                { text: 'Rp 37.5 Juta (Q3)', done: false },
                { text: 'Rp 50 Juta (Q4)', done: false },
            ]
        },
    ];

    return (
        <JournalLayout
            pageTitle="Life OS - Goals"
            headerTitle="Goals"
            headerSubtitle="Dream big, plan smart, work hard."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-yellow-400 rotate-12">flag</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl">
                    {/* Year header */}
                    <div className="text-center mb-8">
                        <h3 className="font-handwriting text-4xl font-bold text-gray-800">2026 Goals</h3>
                        <div className="h-1 w-24 bg-primary/30 mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Goals grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {goals.map((goal, i) => (
                            <div
                                key={i}
                                className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative overflow-hidden hover:-translate-y-1 transition-transform"
                            >
                                <div className={`washi-tape-accent -top-2 left-1/2 -translate-x-1/2 w-20 ${
                                    i === 0 ? 'bg-pink-200/60' : i === 1 ? 'bg-green-200/60' : 'bg-blue-200/60'
                                } rotate-1`}></div>

                                <div className="mt-4">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        i === 0 ? 'bg-pink-100 text-primary' : i === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {goal.category}
                                    </span>
                                    <h4 className="font-handwriting text-2xl font-bold text-gray-800 mt-2">{goal.title}</h4>
                                    <p className="font-note text-sm text-gray-400 mt-1">Target: {goal.deadline}</p>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-4 mb-4">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${
                                                i === 0 ? 'bg-primary' : i === 1 ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Milestones */}
                                <div className="space-y-2 mt-4">
                                    {goal.milestones.map((ms, mi) => (
                                        <div key={mi} className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-lg ${ms.done ? 'text-green-500' : 'text-gray-300'}`}>
                                                {ms.done ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                            <span className={`font-note text-sm ${ms.done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                                {ms.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add new goal */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border-2 border-dashed border-gray-200 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                        <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
                        <p className="font-handwriting text-xl text-gray-400 mt-2 group-hover:text-primary transition-colors">Add New Goal</p>
                    </div>

                    {/* Motivational sticky note */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "A goal without a plan is just a wish."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">— Antoine de Saint-Exupéry</p>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
