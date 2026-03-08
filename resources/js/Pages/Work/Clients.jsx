import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Clients() {
    const clients = [
        { name: 'Sarah Mitchell', company: 'Acme Corp', email: 'sarah@acmecorp.com', status: 'Active', projects: 3, lastInteraction: 'Mar 7, 2026', avatar: 'S', color: 'bg-blue-200 text-blue-800' },
        { name: 'James Park', company: 'ShopWell Inc', email: 'james@shopwell.io', status: 'Active', projects: 2, lastInteraction: 'Mar 5, 2026', avatar: 'J', color: 'bg-emerald-200 text-emerald-800' },
        { name: 'Maria Garcia', company: 'GreenLeaf Co', email: 'maria@greenleaf.co', status: 'Active', projects: 1, lastInteraction: 'Mar 3, 2026', avatar: 'M', color: 'bg-purple-200 text-purple-800' },
        { name: 'David Chen', company: 'FitTrack', email: 'david@fittrack.app', status: 'Active', projects: 1, lastInteraction: 'Feb 28, 2026', avatar: 'D', color: 'bg-pink-200 text-pink-800' },
        { name: 'Emily Ross', company: 'TechStart Inc', email: 'emily@techstart.com', status: 'Lead', projects: 0, lastInteraction: 'Mar 6, 2026', avatar: 'E', color: 'bg-amber-200 text-amber-800' },
        { name: 'Robert Kim', company: 'Nomad Studio', email: 'robert@nomadstudio.co', status: 'Lead', projects: 0, lastInteraction: 'Mar 1, 2026', avatar: 'R', color: 'bg-orange-200 text-orange-800' },
        { name: 'Lisa Wang', company: 'Bright Ideas LLC', email: 'lisa@brightideas.com', status: 'Inactive', projects: 2, lastInteraction: 'Jan 15, 2026', avatar: 'L', color: 'bg-gray-200 text-gray-700' },
    ];

    const statusConfig = {
        Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Lead: 'bg-amber-100 text-amber-700 border-amber-200',
        Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
    };

    const statusCounts = {
        Active: clients.filter(c => c.status === 'Active').length,
        Lead: clients.filter(c => c.status === 'Lead').length,
        Inactive: clients.filter(c => c.status === 'Inactive').length,
    };

    return (
        <JournalLayout
            pageTitle="Work OS - Clients"
            headerTitle="Client Tracker"
            headerSubtitle="Manage your relationships"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">people</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Decorative element */}
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">contacts</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header Section with Stats and Add Button */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/80 rotate-1"></div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700">All Clients</h3>
                                <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">
                                    {clients.length} total
                                </span>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">person_add</span> Add Client
                            </button>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <span key={status} className={`${statusConfig[status]} border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                                    <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                                    {status}: {count}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Client Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {clients.map((client, idx) => {
                            const tapeColors = ['bg-blue-100/80', 'bg-green-100/80', 'bg-purple-100/80', 'bg-pink-100/80', 'bg-amber-100/80', 'bg-orange-100/80', 'bg-gray-100/80'];
                            const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[0deg]'];
                            return (
                                <div key={idx} className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 paper-lines hover:shadow-lg transition-shadow">
                                    <div className={`washi-tape -top-2 left-8 ${tapeColors[idx % tapeColors.length]} ${rotations[idx % rotations.length]}`}></div>

                                    <div className="flex items-start gap-4 mt-2">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 rounded-full ${client.color} flex items-center justify-center font-handwriting text-xl font-bold flex-shrink-0 shadow-sm`}>
                                            {client.avatar}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-handwriting text-xl font-bold text-gray-800">{client.name}</h4>
                                                <span className={`${statusConfig[client.status]} border text-xs font-bold px-2 py-0.5 rounded-full`}>
                                                    {client.status}
                                                </span>
                                            </div>
                                            <p className="font-note text-sm text-gray-500 mt-0.5">{client.company}</p>

                                            <div className="mt-3 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-gray-400">mail</span>
                                                    <span className="font-note text-sm text-gray-600 truncate">{client.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-gray-400">folder</span>
                                                    <span className="font-note text-sm text-gray-600">{client.projects} project{client.projects !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-gray-400">event</span>
                                                    <span className="font-note text-xs text-gray-400">Last contact: {client.lastInteraction}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary bg-gray-50 hover:bg-primary/5 py-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-sm">mail</span> Email
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary bg-gray-50 hover:bg-primary/5 py-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit_note</span> Notes
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary bg-gray-50 hover:bg-primary/5 py-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-sm">visibility</span> View
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                "Your network is your net worth."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                - Porter Gale
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
