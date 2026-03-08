import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function MeetingNotes() {
    const meetings = [
        {
            title: 'Q1 Strategy Review',
            date: 'Mar 7, 2026',
            time: '10:00 AM',
            attendees: ['Sarah K.', 'Mike R.', 'Lisa T.'],
            keyPoints: [
                'Revenue exceeded Q1 targets by 12%',
                'New client onboarding process approved',
                'Marketing budget increased for Q2',
            ],
            actionItems: [
                { text: 'Draft Q2 proposal for Acme Studios', done: true },
                { text: 'Update client onboarding checklist', done: false },
            ],
            color: 'border-l-blue-400',
            tagColor: 'bg-blue-100 text-blue-700',
            tag: 'Strategy',
        },
        {
            title: 'Design Sprint Kickoff',
            date: 'Mar 5, 2026',
            time: '2:00 PM',
            attendees: ['Alex M.', 'Jordan P.'],
            keyPoints: [
                'Sprint goal: redesign dashboard UI',
                'User research findings presented',
                'Wireframes due by end of week',
            ],
            actionItems: [
                { text: 'Create low-fi wireframes for dashboard', done: true },
                { text: 'Schedule user testing sessions', done: false },
            ],
            color: 'border-l-purple-400',
            tagColor: 'bg-purple-100 text-purple-700',
            tag: 'Design',
        },
        {
            title: 'Client Check-in: Nova Digital',
            date: 'Mar 3, 2026',
            time: '11:30 AM',
            attendees: ['Nova Team', 'Sarah K.'],
            keyPoints: [
                'Project milestone 3 delivered on time',
                'Scope change requested for analytics module',
                'Next delivery date: March 20',
            ],
            actionItems: [
                { text: 'Send revised SOW with scope changes', done: false },
                { text: 'Update project timeline in tracker', done: false },
            ],
            color: 'border-l-green-400',
            tagColor: 'bg-green-100 text-green-700',
            tag: 'Client',
        },
        {
            title: 'Weekly Standup',
            date: 'Mar 2, 2026',
            time: '9:00 AM',
            attendees: ['Full Team'],
            keyPoints: [
                'All tasks on track for sprint deadline',
                'New intern starting next Monday',
                'Office closed March 15 for maintenance',
            ],
            actionItems: [
                { text: 'Prepare onboarding materials for intern', done: true },
                { text: 'Back up all files before office closure', done: false },
            ],
            color: 'border-l-orange-400',
            tagColor: 'bg-orange-100 text-orange-700',
            tag: 'Standup',
        },
        {
            title: 'Budget Planning Session',
            date: 'Feb 28, 2026',
            time: '3:00 PM',
            attendees: ['Mike R.', 'Finance Team'],
            keyPoints: [
                'Annual software subscriptions reviewed',
                'New tool budget approved: $500/mo',
                'Travel budget cut by 15%',
            ],
            actionItems: [
                { text: 'Cancel unused Figma seats', done: true },
                { text: 'Research cheaper hosting options', done: true },
            ],
            color: 'border-l-red-400',
            tagColor: 'bg-red-100 text-red-700',
            tag: 'Finance',
        },
    ];

    const allActionItems = meetings.flatMap(m =>
        m.actionItems.map(a => ({ ...a, meeting: m.title }))
    );

    return (
        <JournalLayout
            pageTitle="Work OS - Meeting Notes"
            headerTitle="Meeting Notes"
            headerSubtitle="Capture every detail"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">record_voice_over</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header with button */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-note text-sm text-gray-500">{meetings.length} meetings recorded this month</p>
                        </div>
                        <button className="flex items-center gap-2 bg-primary/90 text-white font-note text-sm px-4 py-2 rounded-xl shadow hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            New Meeting Note
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Meeting Cards */}
                        <div className="lg:col-span-2 space-y-4">
                            {meetings.map((m, i) => (
                                <div key={i} className={`bg-page-bg rounded-2xl shadow-notebook border border-gray-100 border-l-4 ${m.color} p-6 relative hover:-translate-y-0.5 transition-transform`}>
                                    {i === 0 && <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[3deg]"></div>}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-handwriting text-2xl font-bold text-gray-800">{m.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="font-note text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    {m.date}
                                                </span>
                                                <span className="font-note text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {m.time}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.tagColor}`}>{m.tag}</span>
                                    </div>

                                    <div className="flex items-center gap-1 mb-3">
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">group</span>
                                        <span className="font-note text-xs text-gray-500">{m.attendees.join(', ')}</span>
                                    </div>

                                    <div className="bg-white/50 rounded-xl p-4 border border-dashed border-gray-200 mb-3">
                                        <h4 className="font-handwriting text-sm font-bold text-gray-600 mb-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                                            Key Points
                                        </h4>
                                        <ul className="space-y-1">
                                            {m.keyPoints.map((kp, j) => (
                                                <li key={j} className="font-note text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    {kp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-1">
                                        {m.actionItems.map((a, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-[18px] ${a.done ? 'text-green-500' : 'text-gray-300'}`}>
                                                    {a.done ? 'check_box' : 'check_box_outline_blank'}
                                                </span>
                                                <span className={`font-note text-sm ${a.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{a.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {/* All Action Items */}
                            <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                                <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/80 rotate-[-1deg]"></div>
                                <h3 className="font-handwriting text-xl font-bold text-gray-700 mt-2 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">checklist</span>
                                    All Action Items
                                </h3>
                                <div className="space-y-3">
                                    {allActionItems.map((a, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className={`material-symbols-outlined text-[18px] mt-0.5 ${a.done ? 'text-green-500' : 'text-gray-300'}`}>
                                                {a.done ? 'check_box' : 'check_box_outline_blank'}
                                            </span>
                                            <div>
                                                <p className={`font-note text-sm ${a.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{a.text}</p>
                                                <p className="font-note text-xs text-gray-400">{a.meeting}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                                    <p className="font-note text-xs text-gray-500">
                                        {allActionItems.filter(a => a.done).length} of {allActionItems.length} completed
                                    </p>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div className="h-full rounded-full bg-green-500" style={{ width: `${(allActionItems.filter(a => a.done).length / allActionItems.length) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Note Sticky */}
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-orange-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">push_pin</span>
                                    Quick Reminder
                                </h4>
                                <p className="font-note text-sm text-gray-600 leading-relaxed">
                                    Next all-hands meeting is on March 15. Prepare slide deck and Q1 results summary before then.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-600">insights</span>
                                    Meeting Stats
                                </h4>
                                <div className="space-y-2 font-note text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>This week</span>
                                        <span className="font-bold">3 meetings</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg duration</span>
                                        <span className="font-bold">45 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Action items open</span>
                                        <span className="font-bold text-orange-600">{allActionItems.filter(a => !a.done).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
