import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Pipeline() {
    const columns = [
        {
            title: 'Discovery',
            icon: 'search',
            color: 'amber',
            tapeColor: 'bg-amber-100/80',
            items: [
                { name: 'Marketing Website', client: 'Acme Corp', budget: '$3,500', deadline: 'Apr 10', progress: 10, tags: ['Web Design'] },
                { name: 'Product Photography', client: 'TechStart Inc', budget: '$1,200', deadline: 'Apr 15', progress: 5, tags: ['Photography'] },
            ],
        },
        {
            title: 'In Progress',
            icon: 'autorenew',
            color: 'blue',
            tapeColor: 'bg-blue-100/80',
            items: [
                { name: 'E-commerce Redesign', client: 'ShopWell Inc', budget: '$8,000', deadline: 'Mar 15', progress: 72, tags: ['UI/UX', 'Dev'] },
                { name: 'Brand Identity Package', client: 'GreenLeaf Co', budget: '$4,500', deadline: 'Mar 22', progress: 45, tags: ['Branding'] },
                { name: 'Mobile App Prototype', client: 'FitTrack', budget: '$6,000', deadline: 'Apr 1', progress: 30, tags: ['Mobile', 'UI/UX'] },
            ],
        },
        {
            title: 'Completed',
            icon: 'check_circle',
            color: 'emerald',
            tapeColor: 'bg-emerald-100/80',
            items: [
                { name: 'Logo Redesign', client: 'Nomad Studio', budget: '$2,000', deadline: 'Feb 20', progress: 100, tags: ['Branding'] },
                { name: 'Social Media Kit', client: 'Bright Ideas LLC', budget: '$1,500', deadline: 'Feb 28', progress: 100, tags: ['Design'] },
            ],
        },
    ];

    const colorMap = {
        amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', headerBg: 'bg-amber-100', headerText: 'text-amber-800', iconColor: 'text-amber-600' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-400', headerBg: 'bg-blue-100', headerText: 'text-blue-800', iconColor: 'text-blue-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-400', headerBg: 'bg-emerald-100', headerText: 'text-emerald-800', iconColor: 'text-emerald-600' },
    };

    const totalBudget = '$26,700';
    const totalProjects = 7;

    return (
        <JournalLayout
            pageTitle="Work OS - Pipeline"
            headerTitle="Project Pipeline"
            headerSubtitle="Track your project flow"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">view_kanban</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Decorative element */}
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">assignment</span>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Pipeline Overview */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <div>
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700">Pipeline Overview</h3>
                                <p className="font-note text-sm text-gray-400">Drag and drop to move projects between stages</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2 text-center">
                                    <p className="font-note text-xs text-gray-500">Total Projects</p>
                                    <p className="font-handwriting text-xl font-bold text-purple-700">{totalProjects}</p>
                                </div>
                                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-center">
                                    <p className="font-note text-xs text-gray-500">Total Value</p>
                                    <p className="font-handwriting text-xl font-bold text-green-700">{totalBudget}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanban Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {columns.map((col, colIdx) => {
                            const colors = colorMap[col.color];
                            const tapeRotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'];
                            return (
                                <div key={colIdx} className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-5">
                                    <div className={`washi-tape -top-2 left-8 ${col.tapeColor} ${tapeRotations[colIdx]}`}></div>

                                    {/* Column Header */}
                                    <div className={`flex items-center gap-3 mb-5 mt-2 ${colors.headerBg} rounded-xl p-3`}>
                                        <div className={`w-9 h-9 rounded-full bg-white/60 flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${colors.iconColor}`}>{col.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-handwriting text-xl font-bold ${colors.headerText}`}>{col.title}</h4>
                                        </div>
                                        <span className={`${colors.badge} font-bold text-sm px-2.5 py-0.5 rounded-full`}>
                                            {col.items.length}
                                        </span>
                                    </div>

                                    {/* Project Cards */}
                                    <div className="space-y-4">
                                        {col.items.map((item, idx) => (
                                            <div key={idx} className={`${colors.bg} rounded-xl p-4 border ${colors.border} shadow-sm hover:shadow-md transition-shadow`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <h5 className="font-handwriting text-lg font-bold text-gray-800 leading-tight">{item.name}</h5>
                                                    {item.progress >= 100 && (
                                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm rotate-12 flex-shrink-0">
                                                            <span className="material-symbols-outlined text-xs text-white">star</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <span className="material-symbols-outlined text-sm text-gray-400">person</span>
                                                    <span className="font-note text-sm text-gray-500">{item.client}</span>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {item.tags.map((tag, tIdx) => (
                                                        <span key={tIdx} className="bg-white/80 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Budget & Deadline */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-gray-400">payments</span>
                                                        <span className="font-handwriting text-base font-bold text-gray-700">{item.budget}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-gray-400">event</span>
                                                        <span className="font-note text-xs text-gray-500">{item.deadline}</span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div>
                                                    <div className="flex justify-between font-note text-xs text-gray-500 mb-1">
                                                        <span>Progress</span>
                                                        <span className="font-bold">{item.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                                        <div className={`h-full ${colors.bar} rounded-full transition-all`} style={{ width: `${item.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Project Button */}
                                    <button className={`w-full mt-4 py-2.5 border-2 border-dashed ${colors.border} rounded-xl text-sm font-bold ${colors.headerText} opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5`}>
                                        <span className="material-symbols-outlined text-sm">add</span> Add Project
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                "A project is complete when it starts working for you, rather than you working for it."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                - Scott Allen
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
