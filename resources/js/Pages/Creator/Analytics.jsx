import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Analytics() {
    const metrics = [
        { label: 'Total Followers', value: '125.4K', icon: 'group', change: '+2.3%', changeColor: 'text-green-600', bg: 'bg-orange-50' },
        { label: 'Engagement Rate', value: '4.2%', icon: 'trending_up', change: '+0.5%', changeColor: 'text-green-600', bg: 'bg-pink-50' },
        { label: 'Avg Views', value: '23.5K', icon: 'visibility', change: '+12%', changeColor: 'text-green-600', bg: 'bg-blue-50' },
        { label: 'Revenue', value: '$2,340', icon: 'payments', change: '+$340', changeColor: 'text-green-600', bg: 'bg-green-50' },
    ];

    const platforms = [
        { name: 'Instagram', icon: 'photo_camera', followers: '58.2K', color: 'bg-pink-100 text-pink-700 border-pink-200', growth: '+1.2K this week' },
        { name: 'YouTube', icon: 'play_circle', followers: '42.1K', color: 'bg-red-100 text-red-700 border-red-200', growth: '+890 this week' },
        { name: 'TikTok', icon: 'music_note', followers: '25.1K', color: 'bg-purple-100 text-purple-700 border-purple-200', growth: '+2.1K this week' },
    ];

    const weeklyGrowth = [
        { day: 'Mon', followers: 320, height: '40%' },
        { day: 'Tue', followers: 480, height: '60%' },
        { day: 'Wed', followers: 290, height: '36%' },
        { day: 'Thu', followers: 650, height: '81%' },
        { day: 'Fri', followers: 800, height: '100%' },
        { day: 'Sat', followers: 540, height: '68%' },
        { day: 'Sun', followers: 420, height: '53%' },
    ];

    const topContent = [
        { title: '10 Morning Routine Hacks', platform: 'TikTok', views: '142K', engagement: '8.7%' },
        { title: 'My Honest Review: iPad Pro', platform: 'YouTube', views: '89K', engagement: '5.2%' },
        { title: 'Day in My Life as a Creator', platform: 'Instagram', views: '67K', engagement: '6.1%' },
        { title: 'How I Edit My Videos', platform: 'YouTube', views: '54K', engagement: '4.8%' },
        { title: 'Packing Orders ASMR', platform: 'TikTok', views: '51K', engagement: '7.3%' },
    ];

    const bestTimes = [
        { platform: 'Instagram', times: '9 AM, 12 PM, 7 PM' },
        { platform: 'YouTube', times: '2 PM, 5 PM' },
        { platform: 'TikTok', times: '7 AM, 11 AM, 8 PM' },
    ];

    return (
        <JournalLayout
            pageTitle="Creator OS - Analytics"
            headerTitle="Analytics"
            headerSubtitle="Track your growth"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">monitoring</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((m, i) => (
                            <div key={i} className={`${m.bg} rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10">
                                    <span className="material-symbols-outlined text-[48px] text-gray-800">{m.icon}</span>
                                </div>
                                <p className="font-note text-sm text-gray-500">{m.label}</p>
                                <p className="font-handwriting text-3xl font-bold text-gray-800 mt-1">{m.value}</p>
                                <p className={`font-note text-sm mt-2 ${m.changeColor}`}>
                                    <span className="material-symbols-outlined text-sm align-middle">arrow_upward</span> {m.change}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Platform Breakdown */}
                        <div className="lg:col-span-1 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-orange-100/80 rotate-1"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Platform Breakdown</h3>
                            <div className="space-y-4">
                                {platforms.map((p, i) => (
                                    <div key={i} className={`${p.color} border rounded-xl p-4 flex items-center gap-4`}>
                                        <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-handwriting text-xl font-bold">{p.name}</span>
                                                <span className="font-handwriting text-xl font-bold">{p.followers}</span>
                                            </div>
                                            <p className="font-note text-xs opacity-70 mt-0.5">{p.growth}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Growth Chart */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[3deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Weekly Follower Growth</h3>
                            <div className="flex items-end gap-3 h-48 px-2">
                                {weeklyGrowth.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="font-note text-xs text-gray-500">+{d.followers}</span>
                                        <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-primary/70 rounded-t-lg transition-all duration-500"
                                                style={{ height: d.height }}
                                            ></div>
                                        </div>
                                        <span className="font-note text-xs text-gray-600 font-bold">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-4">
                                <p className="font-note text-sm text-gray-400">Total this week: <span className="font-bold text-primary">+3,500</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Performing Content */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/4 bg-pink-100/80 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Top Performing Content</h3>
                            <div className="space-y-3">
                                {topContent.map((c, i) => (
                                    <div key={i} className="bg-white/60 rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:bg-white/80 transition-colors">
                                        <span className="font-handwriting text-2xl font-bold text-gray-300 w-8 text-center">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-handwriting text-lg text-gray-800 truncate">{c.title}</p>
                                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                                                c.platform === 'TikTok' ? 'bg-purple-100 text-purple-700' :
                                                c.platform === 'YouTube' ? 'bg-red-100 text-red-700' :
                                                'bg-pink-100 text-pink-700'
                                            }`}>{c.platform}</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-handwriting text-lg font-bold text-gray-700">{c.views}</p>
                                            <p className="font-note text-xs text-green-600">{c.engagement} eng.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Best Posting Times - Sticky Note */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-orange-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">schedule</span>
                                    Best Posting Times
                                </h4>
                                <div className="space-y-3">
                                    {bestTimes.map((bt, i) => (
                                        <div key={i}>
                                            <p className="font-note text-sm font-bold text-gray-700">{bt.platform}</p>
                                            <p className="font-handwriting text-lg text-gray-600">{bt.times}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-orange-100 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-orange-200">
                                <h4 className="font-handwriting text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">lightbulb</span>
                                    Quick Insight
                                </h4>
                                <p className="font-note text-sm text-orange-700 leading-relaxed">
                                    Your TikTok content is growing the fastest! Consider repurposing your top-performing Reels into TikTok formats for maximum reach.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2">Monthly Goal</h4>
                                <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                    <span>130K followers</span>
                                    <span>96%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-primary" style={{ width: '96%' }}></div>
                                </div>
                                <p className="font-note text-xs text-gray-400 mt-2">4.6K more to go!</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
