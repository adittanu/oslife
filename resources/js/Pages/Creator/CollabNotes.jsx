import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function CollabNotes() {
    const collabs = [
        {
            brand: 'GlowSkin Co.',
            status: 'Confirmed',
            statusColor: 'bg-green-100 text-green-700 border-green-200',
            deadline: 'Mar 20, 2026',
            payment: '$1,200',
            deliverables: '1 Reel + 2 Stories',
            notes: 'Contact: Sarah M. (sarah@glowskin.co). They want a "get ready with me" style. Must tag @glowskinco and use #GlowWithUs. Approved mood board on file.',
        },
        {
            brand: 'FitFuel Nutrition',
            status: 'Negotiating',
            statusColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            deadline: 'Apr 5, 2026',
            payment: '$2,500',
            deliverables: '1 YouTube Video + 1 TikTok',
            notes: 'Contact: James L. (james@fitfuel.com). Waiting on final rate approval. They offered $2,000 but I countered with $2,500. Product samples arriving next week.',
        },
        {
            brand: 'Wanderlust Travel',
            status: 'Outreach',
            statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
            deadline: 'TBD',
            payment: 'TBD',
            deliverables: 'Travel vlog series (3 videos)',
            notes: 'Sent pitch deck on Mar 1. Follow up by Mar 12 if no response. They have a big campaign planned for summer. Could be a long-term partnership.',
        },
        {
            brand: 'TechByte Gadgets',
            status: 'Done',
            statusColor: 'bg-gray-100 text-gray-600 border-gray-200',
            deadline: 'Feb 28, 2026',
            payment: '$800',
            deliverables: '1 Instagram Post + 1 Story',
            notes: 'Completed! Payment received Mar 5. Great working relationship. They mentioned wanting to collaborate again for their summer launch. Keep in touch.',
        },
    ];

    const rateCard = [
        { type: 'Instagram Post', rate: '$500' },
        { type: 'Instagram Reel', rate: '$800' },
        { type: 'Instagram Story', rate: '$200' },
        { type: 'YouTube Video', rate: '$1,500' },
        { type: 'TikTok Video', rate: '$600' },
        { type: 'Bundle Deal', rate: 'Custom' },
    ];

    const upcomingDeadlines = [
        { brand: 'GlowSkin Co.', task: 'Submit draft for review', date: 'Mar 15', urgent: true },
        { brand: 'GlowSkin Co.', task: 'Publish Reel', date: 'Mar 20', urgent: false },
        { brand: 'FitFuel Nutrition', task: 'Finalize contract', date: 'Mar 18', urgent: true },
        { brand: 'FitFuel Nutrition', task: 'Film & publish', date: 'Apr 5', urgent: false },
        { brand: 'Wanderlust Travel', task: 'Follow up on pitch', date: 'Mar 12', urgent: true },
    ];

    const statusOrder = ['Confirmed', 'Negotiating', 'Outreach', 'Done'];

    return (
        <JournalLayout
            pageTitle="Creator OS - Collab Notes"
            headerTitle="Collab Notes"
            headerSubtitle="Partnerships & deals"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">group</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Active Collabs', value: '3', icon: 'handshake', bg: 'bg-orange-50' },
                            { label: 'Completed', value: '1', icon: 'task_alt', bg: 'bg-green-50' },
                            { label: 'Pending Revenue', value: '$3,700', icon: 'account_balance_wallet', bg: 'bg-blue-50' },
                            { label: 'Total Earned (YTD)', value: '$4,500', icon: 'paid', bg: 'bg-amber-50' },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl shadow-notebook border border-gray-100 p-4 relative`}>
                                <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
                                <p className="font-note text-sm text-gray-500 mt-1">{s.label}</p>
                                <p className="font-handwriting text-2xl font-bold text-gray-800">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Collabs List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">folder_shared</span>
                                All Collaborations
                            </h3>
                            {collabs.map((c, i) => (
                                <div key={i} className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform">
                                    {i === 0 && <div className="washi-tape -top-2 left-1/3 bg-green-100/80 rotate-1"></div>}
                                    {i === 1 && <div className="washi-tape -top-2 right-8 bg-yellow-100/80 rotate-[-1deg]"></div>}

                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-1">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="font-handwriting text-2xl font-bold text-gray-800">{c.brand}</h4>
                                                <span className={`${c.statusColor} border text-xs font-bold px-2.5 py-0.5 rounded-full`}>{c.status}</span>
                                            </div>
                                            <p className="font-note text-sm text-gray-500 mt-1">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1">inventory_2</span>
                                                {c.deliverables}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-handwriting text-xl font-bold text-primary">{c.payment}</p>
                                            <p className="font-note text-xs text-gray-400">
                                                <span className="material-symbols-outlined text-xs align-middle mr-0.5">calendar_today</span>
                                                {c.deadline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="mt-3 bg-white/50 rounded-xl p-3 border border-dashed border-gray-200">
                                        <p className="font-note text-sm text-gray-600 leading-relaxed">
                                            <span className="material-symbols-outlined text-sm align-middle text-gray-400 mr-1">sticky_note_2</span>
                                            {c.notes}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Rate Card Sticky Note */}
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-orange-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">sell</span>
                                    My Rate Card
                                </h4>
                                <div className="space-y-2">
                                    {rateCard.map((r, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-yellow-300/50 pb-1.5">
                                            <span className="font-note text-sm text-gray-700">{r.type}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-800">{r.rate}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="font-note text-xs text-gray-500 mt-3 italic">*Rates negotiable for long-term partnerships</p>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-5 relative">
                                <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-red-100/70 rotate-[-1deg]"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-700 mt-2 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">alarm</span>
                                    Upcoming Deadlines
                                </h4>
                                <div className="space-y-3">
                                    {upcomingDeadlines.map((d, i) => (
                                        <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${d.urgent ? 'bg-red-50' : 'bg-white/50'}`}>
                                            <span className={`material-symbols-outlined text-lg mt-0.5 ${d.urgent ? 'text-red-500' : 'text-gray-400'}`}>
                                                {d.urgent ? 'priority_high' : 'radio_button_unchecked'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-handwriting text-base text-gray-800 truncate">{d.task}</p>
                                                <div className="flex justify-between items-center mt-0.5">
                                                    <span className="font-note text-xs text-gray-400">{d.brand}</span>
                                                    <span className={`font-note text-xs font-bold ${d.urgent ? 'text-red-600' : 'text-gray-500'}`}>{d.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Outreach Tip */}
                            <div className="bg-orange-100 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-orange-200">
                                <h4 className="font-handwriting text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">tips_and_updates</span>
                                    Outreach Tip
                                </h4>
                                <p className="font-note text-sm text-orange-700 leading-relaxed">
                                    Always follow up within 5-7 days. Brands are busy -- a polite nudge shows professionalism, not desperation!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom motivational note */}
                    <div className="flex justify-center pb-4">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "Don't be afraid to ask for what you're worth. The right brands will value your creativity."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
