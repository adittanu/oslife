import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const platformOptions = ['instagram', 'youtube', 'tiktok', 'twitter'];

const platformColors = {
    instagram: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', bar: 'bg-pink-400' },
    youtube: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', bar: 'bg-red-500' },
    tiktok: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', bar: 'bg-gray-700' },
    twitter: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500' },
};

const platformIcons = {
    instagram: 'photo_camera',
    youtube: 'play_circle',
    tiktok: 'music_note',
    twitter: 'tag',
};

// Default best times data
const DEFAULT_BEST_TIMES = [
    { platform: 'Instagram', times: '9 AM, 12 PM, 7 PM' },
    { platform: 'YouTube', times: '2 PM, 5 PM' },
    { platform: 'TikTok', times: '7 AM, 11 AM, 8 PM' },
];

// Default weekly growth data
const DEFAULT_WEEKLY_GROWTH = [
    { day: 'Mon', followers: 0, height: '0%' },
    { day: 'Tue', followers: 0, height: '0%' },
    { day: 'Wed', followers: 0, height: '0%' },
    { day: 'Thu', followers: 0, height: '0%' },
    { day: 'Fri', followers: 0, height: '0%' },
    { day: 'Sat', followers: 0, height: '0%' },
    { day: 'Sun', followers: 0, height: '0%' },
];

export default function Analytics({ stats: propStats, weeklyGrowth: propWeeklyGrowth, topContent: propTopContent }) {
    const [stats, setStats] = useState({});
    const [weeklyGrowth, setWeeklyGrowth] = useState(propWeeklyGrowth || DEFAULT_WEEKLY_GROWTH);
    const [topContent, setTopContent] = useState(propTopContent || []);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState(null);
    const [formData, setFormData] = useState({
        platform: 'instagram',
        followers: '',
        engagement_rate: '',
        avg_views: '',
        revenue: '',
    });

    useEffect(() => {
        if (propStats) {
            setStats(propStats);
        }
    }, [propStats]);

    useEffect(() => {
        setWeeklyGrowth(propWeeklyGrowth || DEFAULT_WEEKLY_GROWTH);
    }, [propWeeklyGrowth]);

    useEffect(() => {
        setTopContent(propTopContent || []);
    }, [propTopContent]);

    const calculateTotals = () => {
        const values = Object.values(stats);
        if (values.length === 0) return { followers: 0, engagement: 0, avgViews: 0, revenue: 0 };

        const totalFollowers = values.reduce((sum, s) => sum + (parseInt(s.followers) || 0), 0);
        const avgEngagement = values.length > 0
            ? values.reduce((sum, s) => sum + (parseFloat(s.engagement_rate) || 0), 0) / values.length
            : 0;
        const avgViews = values.reduce((sum, s) => sum + (parseInt(s.avg_views) || 0), 0) / (values.length || 1);
        const totalRevenue = values.reduce((sum, s) => sum + (parseFloat(s.revenue) || 0), 0);

        return { followers: totalFollowers, engagement: avgEngagement, avgViews, revenue: totalRevenue };
    };

    const totals = calculateTotals();

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const openAddModal = () => {
        setEditingPlatform(null);
        setFormData({
            platform: 'instagram',
            followers: '',
            engagement_rate: '',
            avg_views: '',
            revenue: '',
        });
        setShowEditModal(true);
    };

    const openEditModal = (platform) => {
        const stat = stats[platform];
        setEditingPlatform(platform);
        setFormData({
            platform,
            followers: stat?.followers || '',
            engagement_rate: stat?.engagement_rate || '',
            avg_views: stat?.avg_views || '',
            revenue: stat?.revenue || '',
        });
        setShowEditModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                followers: parseInt(formData.followers) || 0,
                engagement_rate: parseFloat(formData.engagement_rate) || 0,
                avg_views: parseInt(formData.avg_views) || 0,
                revenue: parseFloat(formData.revenue) || 0,
            };

            const response = await axios.post('/api/creator/platform-stats', data);
            setStats(prev => ({
                ...prev,
                [data.platform]: response.data.stat,
            }));
            setWeeklyGrowth(response.data.weeklyGrowth || DEFAULT_WEEKLY_GROWTH);
            setTopContent(response.data.topContent || []);
            setShowEditModal(false);
        } catch (err) {
            console.error('Failed to save stats:', err);
        }
    };

    const weeklyGrowthData = weeklyGrowth || DEFAULT_WEEKLY_GROWTH;
    const topContentData = topContent || [];
    const hasData = Object.keys(stats).length > 0;
    const weeklyTotal = weeklyGrowthData.reduce((sum, item) => sum + (item.followers || 0), 0);
    const strongestPlatform = Object.entries(stats).sort((a, b) => (b[1]?.followers || 0) - (a[1]?.followers || 0))[0]?.[0];

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

                    {/* Add Stats Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={openAddModal}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Update Platform Stats
                        </button>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Followers', value: formatNumber(totals.followers), icon: 'group', change: `${weeklyTotal >= 0 ? '+' : ''}${formatNumber(weeklyTotal)} this week`, changeColor: weeklyTotal > 0 ? 'text-green-600' : 'text-gray-400', bg: 'bg-orange-50' },
                            { label: 'Engagement Rate', value: totals.engagement.toFixed(1) + '%', icon: 'trending_up', change: `${Object.keys(stats).length} platforms tracked`, changeColor: 'text-blue-600', bg: 'bg-pink-50' },
                            { label: 'Avg Views', value: formatNumber(Math.round(totals.avgViews)), icon: 'visibility', change: `${topContentData.length} posts with metrics`, changeColor: 'text-indigo-600', bg: 'bg-blue-50' },
                            { label: 'Revenue', value: '$' + totals.revenue.toLocaleString(), icon: 'payments', change: strongestPlatform ? `${strongestPlatform} leads audience` : 'Add platform stats', changeColor: strongestPlatform ? 'text-green-600' : 'text-gray-400', bg: 'bg-green-50' },
                        ].map((m, i) => (
                            <div key={i} className={`${m.bg} rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10">
                                    <span className="material-symbols-outlined text-[48px] text-gray-800">{m.icon}</span>
                                </div>
                                <p className="font-note text-sm text-gray-500">{m.label}</p>
                                <p className="font-handwriting text-3xl font-bold text-gray-800 mt-1">{m.value}</p>
                                <p className={`font-note text-sm mt-2 ${m.changeColor}`}>{m.change}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Platform Breakdown */}
                        <div className="lg:col-span-1 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-orange-100/80 rotate-1"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Platform Breakdown</h3>
                            {hasData ? (
                                <div className="space-y-4">
                                    {Object.entries(stats).map(([platform, stat]) => {
                                        const colors = platformColors[platform] || platformColors.instagram;
                                        return (
                                            <div
                                                key={platform}
                                                onClick={() => openEditModal(platform)}
                                                className={`${colors.bg} ${colors.text} border ${colors.border} rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow`}
                                            >
                                                <span className="material-symbols-outlined text-2xl">{platformIcons[platform]}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-handwriting text-xl font-bold capitalize">{platform}</span>
                                                        <span className="font-handwriting text-xl font-bold">{formatNumber(stat.followers || 0)}</span>
                                                    </div>
                                                    <p className="font-note text-xs opacity-70 mt-0.5">
                                                        {stat.engagement_rate || 0}% engagement
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
                                    <p className="font-note text-sm">No platform stats yet</p>
                                    <button
                                        onClick={openAddModal}
                                        className="mt-3 text-primary font-note text-sm hover:underline"
                                    >
                                        Add your first platform
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Weekly Growth Chart */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 right-8 bg-blue-100/70 rotate-[3deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Weekly Follower Growth</h3>
                            <div className="flex items-end gap-3 h-48 px-2">
                                {weeklyGrowthData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="font-note text-xs text-gray-500">{d.followers > 0 ? '+' : ''}{d.followers}</span>
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
                                <p className="font-note text-sm text-gray-400">
                                    Total this week: <span className="font-bold text-primary">
                                        {weeklyTotal > 0 ? '+' : ''}{weeklyTotal}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Performing Content */}
                        <div className="lg:col-span-2 bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                            <div className="washi-tape -top-2 left-1/4 bg-pink-100/80 rotate-[-1deg]"></div>
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700 mt-2 mb-5">Top Performing Content</h3>
                            {topContentData.length > 0 ? (
                                <div className="space-y-3">
                                    {topContentData.map((c, i) => (
                                        <div key={i} className="bg-white/60 rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:bg-white/80 transition-colors">
                                            <span className="font-handwriting text-2xl font-bold text-gray-300 w-8 text-center">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-handwriting text-lg text-gray-800 truncate">{c.title}</p>
                                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                                                    c.platform === 'tiktok' ? 'bg-gray-100 text-gray-700' :
                                                    c.platform === 'youtube' ? 'bg-red-100 text-red-700' :
                                                    'bg-pink-100 text-pink-700'
                                                }`}>{c.platform}</span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-handwriting text-lg font-bold text-gray-700">{formatNumber(c.views)}</p>
                                                <p className="font-note text-xs text-green-600">{c.engagement} interactions</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">trophy</span>
                                    <p className="font-note text-sm">No content performance data yet</p>
                                    <p className="font-note text-xs mt-1">Connect your platforms to see analytics</p>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {/* Best Posting Times - Sticky Note */}
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-orange-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">schedule</span>
                                    Best Posting Times
                                </h4>
                                <div className="space-y-3">
                                    {DEFAULT_BEST_TIMES.map((bt, i) => (
                                        <div key={i}>
                                            <p className="font-note text-sm font-bold text-gray-700">{bt.platform}</p>
                                            <p className="font-handwriting text-lg text-gray-600">{bt.times}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Insight */}
                            <div className="bg-orange-100 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-orange-200">
                                <h4 className="font-handwriting text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">lightbulb</span>
                                    Quick Insight
                                </h4>
                                {hasData ? (
                                    <p className="font-note text-sm text-orange-700 leading-relaxed">
                                        {strongestPlatform
                                            ? `Audience terbesar kamu saat ini ada di ${strongestPlatform}. Dorong lebih banyak konten dengan format yang sudah terbukti bekerja di sana.`
                                            : 'Tambahkan data platform untuk melihat insight personal.'}
                                    </p>
                                ) : (
                                    <p className="font-note text-sm text-orange-700 leading-relaxed">
                                        Add your platform stats to get personalized insights and recommendations.
                                    </p>
                                )}
                            </div>

                            {/* Monthly Goal */}
                            <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[1deg] border border-blue-100">
                                <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2">Monthly Goal</h4>
                                <div className="flex justify-between font-note text-sm text-gray-600 mb-1">
                                    <span>Growth target</span>
                                    <span>{hasData ? 'In progress' : 'Set a goal'}</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-primary" style={{ width: hasData ? '45%' : '0%' }}></div>
                                </div>
                                <p className="font-note text-xs text-gray-400 mt-2">
                                    {hasData ? 'Keep creating to reach your goal!' : 'Add stats to track your goals'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add/Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-6 w-full max-w-md">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">
                            {editingPlatform ? `Edit ${editingPlatform} Stats` : 'Add Platform Stats'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    disabled={!!editingPlatform}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-gray-100"
                                >
                                    {platformOptions.map(p => (
                                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Followers</label>
                                <input
                                    type="number"
                                    value={formData.followers}
                                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                                    placeholder="e.g., 12500"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Engagement Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.engagement_rate}
                                    onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                                    placeholder="e.g., 4.2"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Average Views</label>
                                <input
                                    type="number"
                                    value={formData.avg_views}
                                    onChange={(e) => setFormData({ ...formData, avg_views: e.target.value })}
                                    placeholder="e.g., 23500"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Revenue ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.revenue}
                                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                                    placeholder="e.g., 2340.50"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors"
                                >
                                    {editingPlatform ? 'Update' : 'Add'} Stats
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
