import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Contracts() {
    const contracts = [
        {
            title: 'Website Redesign Project',
            client: 'Acme Studios',
            startDate: 'Jan 15, 2026',
            endDate: 'Jun 30, 2026',
            value: '$18,000',
            status: 'Active',
            type: 'Fixed Price',
        },
        {
            title: 'Monthly Retainer - Social Media',
            client: 'Nova Digital',
            startDate: 'Feb 1, 2026',
            endDate: 'Jan 31, 2027',
            value: '$3,000/mo',
            status: 'Active',
            type: 'Retainer',
        },
        {
            title: 'Brand Identity Package',
            client: 'Bright Ideas Co.',
            startDate: 'Nov 1, 2025',
            endDate: 'Feb 28, 2026',
            value: '$8,500',
            status: 'Expired',
            type: 'Fixed Price',
        },
        {
            title: 'App Development - Phase 1',
            client: 'Sunset Agency',
            startDate: 'Mar 10, 2026',
            endDate: 'Sep 10, 2026',
            value: '$25,000',
            status: 'Draft',
            type: 'Milestone',
        },
        {
            title: 'SEO Consulting',
            client: 'Pixel Perfect LLC',
            startDate: 'Dec 1, 2025',
            endDate: 'May 31, 2026',
            value: '$2,000/mo',
            status: 'Active',
            type: 'Retainer',
        },
    ];

    const templates = [
        { name: 'Freelance Service Agreement', icon: 'handshake', description: 'Standard contract for freelance work with scope, payment terms, and IP clauses', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { name: 'Non-Disclosure Agreement', icon: 'lock', description: 'Mutual NDA template for client projects and confidential information', color: 'bg-purple-50 border-purple-200 text-purple-700' },
        { name: 'Monthly Retainer Agreement', icon: 'event_repeat', description: 'Recurring service contract with monthly deliverables and payment schedule', color: 'bg-green-50 border-green-200 text-green-700' },
        { name: 'Scope Change Request', icon: 'swap_horiz', description: 'Amendment template for project scope changes with revised pricing', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    ];

    const statusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Expired': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'Draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return '';
        }
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'Active': return 'check_circle';
            case 'Expired': return 'cancel';
            case 'Draft': return 'edit_note';
            default: return '';
        }
    };

    const activeContracts = contracts.filter(c => c.status === 'Active').length;
    const totalValue = '$48,500+';

    return (
        <JournalLayout
            pageTitle="Work OS - Contracts"
            headerTitle="Contracts"
            headerSubtitle="Manage agreements & templates"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">description</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Summary Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">verified</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Active</p>
                            <p className="font-handwriting text-3xl font-bold text-green-700 mt-1">{activeContracts}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">edit_note</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Draft</p>
                            <p className="font-handwriting text-3xl font-bold text-yellow-700 mt-1">1</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">history</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Expired</p>
                            <p className="font-handwriting text-3xl font-bold text-gray-600 mt-1">1</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform">
                            <div className="absolute top-2 right-2 opacity-10">
                                <span className="material-symbols-outlined text-[48px] text-gray-800">payments</span>
                            </div>
                            <p className="font-note text-sm text-gray-500">Total Value</p>
                            <p className="font-handwriting text-3xl font-bold text-blue-700 mt-1">{totalValue}</p>
                        </div>
                    </div>

                    {/* Contracts List */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-green-100/80 rotate-1"></div>
                        <div className="flex justify-between items-center mt-2 mb-6">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Contract Tracker</h3>
                            <button className="flex items-center gap-2 bg-primary/90 text-white font-note text-sm px-4 py-2 rounded-xl shadow hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                New Contract
                            </button>
                        </div>

                        <div className="space-y-4">
                            {contracts.map((c, i) => (
                                <div key={i} className="bg-white/60 rounded-xl p-5 border border-gray-100 hover:bg-white/80 transition-colors hover:-translate-y-0.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="font-handwriting text-xl font-bold text-gray-800">{c.title}</h4>
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(c.status)}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{statusIcon(c.status)}</span>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                <span className="font-note text-sm text-gray-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">person</span>
                                                    {c.client}
                                                </span>
                                                <span className="font-note text-sm text-gray-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">date_range</span>
                                                    {c.startDate} - {c.endDate}
                                                </span>
                                                <span className="font-note text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.type}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-handwriting text-2xl font-bold text-gray-800">{c.value}</p>
                                            <div className="flex items-center gap-2 justify-end mt-1">
                                                <button className="text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Templates Section */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 right-8 bg-purple-100/70 rotate-[3deg]"></div>
                        <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">folder_copy</span>
                            Contract Templates
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {templates.map((t, i) => (
                                <div key={i} className={`${t.color} border rounded-xl p-5 hover:-translate-y-0.5 transition-transform cursor-pointer`}>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[28px] mt-0.5">{t.icon}</span>
                                        <div className="flex-1">
                                            <h4 className="font-handwriting text-lg font-bold">{t.name}</h4>
                                            <p className="font-note text-xs opacity-70 mt-1 leading-relaxed">{t.description}</p>
                                            <button className="font-note text-xs font-bold mt-3 flex items-center gap-1 hover:underline">
                                                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                                Use Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Sticky + Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[1deg] relative">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">notifications</span>
                                Upcoming
                            </h4>
                            <p className="font-note text-sm text-gray-600 leading-relaxed">
                                SEO Consulting contract with Pixel Perfect LLC expires May 31. Start renewal discussions by mid-May.
                            </p>
                        </div>

                        <div className="bg-red-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-red-100">
                            <h4 className="font-handwriting text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600">gavel</span>
                                Legal Reminder
                            </h4>
                            <p className="font-note text-sm text-gray-600 leading-relaxed">
                                Always have clients sign NDAs before sharing project details. Keep signed copies in cloud storage.
                            </p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl shadow-notebook rotate-[2deg] border border-green-100">
                            <h4 className="font-handwriting text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">trending_up</span>
                                Contract Revenue
                            </h4>
                            <div className="space-y-1 font-note text-sm text-gray-600">
                                <p>Fixed Price: $43,500</p>
                                <p>Retainers: $5,000/mo</p>
                                <p className="font-bold text-green-700 mt-2">Active pipeline looking strong!</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
