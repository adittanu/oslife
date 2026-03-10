import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const platformColors = {
    instagram: 'bg-pink-100 text-pink-700 border-pink-300',
    youtube: 'bg-red-100 text-red-700 border-red-300',
    tiktok: 'bg-gray-100 text-gray-800 border-gray-400',
    twitter: 'bg-blue-100 text-blue-700 border-blue-300',
};

const platformIcons = {
    instagram: 'photo_camera',
    youtube: 'play_circle',
    tiktok: 'music_note',
    twitter: 'tag',
};

const platformOptions = ['instagram', 'youtube', 'tiktok', 'twitter'];
const typeOptions = ['Reel', 'Video', 'Post', 'Story', 'Short', 'Carousel', 'Thread'];

// Generate calendar grid for a given month/year
function generateCalendarGrid(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month, 0).getDate();

    // Adjust so Monday = 0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const weeks = [];
    let currentWeek = new Array(startOffset).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
}

export default function ContentCalendar({ year: propYear, month: propMonth, posts: propPosts, stats }) {
    const [year, setYear] = useState(propYear || new Date().getFullYear());
    const [month, setMonth] = useState(propMonth || new Date().getMonth() + 1);
    const [posts, setPosts] = useState(propPosts || {});
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        platform: 'instagram',
        type: 'Post',
        title: '',
        notes: '',
        status: 'planned',
    });

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const calendarGrid = generateCalendarGrid(year, month);
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
    const todayDay = today.getDate();

    useEffect(() => {
        setPosts(propPosts || {});
    }, [propPosts]);

    const navigateMonth = (offset) => {
        let newMonth = month + offset;
        let newYear = year;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        router.visit(`/creator/content-calendar?year=${newYear}&month=${newMonth}`, { preserveState: false });
        setYear(newYear);
        setMonth(newMonth);
    };

    const openAddModal = (day) => {
        setSelectedDay(day);
        setEditingPost(null);
        setFormData({
            platform: 'instagram',
            type: 'Post',
            title: '',
            notes: '',
            status: 'planned',
        });
        setShowModal(true);
    };

    const openEditModal = (post) => {
        setEditingPost(post);
        setSelectedDay(new Date(post.post_date).getDate());
        setFormData({
            platform: post.platform,
            type: post.type,
            title: post.title || '',
            notes: post.notes || '',
            status: post.status,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postDate = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        const data = { ...formData, post_date: postDate };

        try {
            if (editingPost) {
                const response = await axios.patch(`/api/creator/content-posts/${editingPost.id}`, data);
                // Update local state
                setPosts(prev => {
                    const dayPosts = prev[selectedDay] || [];
                    const updated = dayPosts.map(p => p.id === editingPost.id ? response.data.post : p);
                    return { ...prev, [selectedDay]: updated };
                });
            } else {
                const response = await axios.post('/api/creator/content-posts', data);
                // Update local state
                setPosts(prev => ({
                    ...prev,
                    [selectedDay]: [...(prev[selectedDay] || []), response.data.post],
                }));
            }
            setShowModal(false);
        } catch (err) {
            console.error('Failed to save post:', err);
        }
    };

    const handleDelete = async (postId, day) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`/api/creator/content-posts/${postId}`);
            setPosts(prev => ({
                ...prev,
                [day]: (prev[day] || []).filter(p => p.id !== postId),
            }));
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    // Calculate content mix
    const allPosts = Object.values(posts).flat();
    const contentMix = allPosts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
    }, {});

    const hasData = allPosts.length > 0;

    return (
        <JournalLayout
            pageTitle="Creator OS - Content Calendar"
            headerTitle="Content Calendar"
            headerSubtitle="Plan, create, publish"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">calendar_month</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary/60"></div>
                            <span className="material-symbols-outlined text-primary text-3xl mb-1 block">article</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">{stats.postsThisMonth || 0}</p>
                            <p className="font-note text-sm text-gray-500">Posts This Month</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-pink-400"></div>
                            <span className="material-symbols-outlined text-pink-500 text-3xl mb-1 block">devices</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">{stats.platformsActive || 0}</p>
                            <p className="font-note text-sm text-gray-500">Platforms Active</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
                            <span className="material-symbols-outlined text-green-500 text-3xl mb-1 block">check_circle</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">{allPosts.filter(p => p.status === 'published').length}</p>
                            <p className="font-note text-sm text-gray-500">Published</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
                            <span className="material-symbols-outlined text-blue-500 text-3xl mb-1 block">schedule</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">{allPosts.filter(p => p.status === 'planned').length}</p>
                            <p className="font-note text-sm text-gray-500">Planned</p>
                        </div>
                    </div>

                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => navigateMonth(-1)} className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="material-symbols-outlined">chevron_left</span>
                            <span className="font-note">{monthNames[month - 2] || 'Dec'}</span>
                        </button>
                        <h3 className="font-handwriting text-4xl font-bold text-gray-800">{monthNames[month - 1]} {year}</h3>
                        <button onClick={() => navigateMonth(1)} className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors font-medium">
                            <span className="font-note">{monthNames[month] || 'Jan'}</span>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* Platform Legend */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        {Object.entries(platformColors).map(([platform, classes]) => (
                            <div key={platform} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${classes}`}>
                                <span className="material-symbols-outlined text-[14px]">{platformIcons[platform]}</span>
                                {platform}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
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
                        {calendarGrid.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                {week.map((day, di) => {
                                    const isToday = isCurrentMonth && day === todayDay;
                                    const dayPosts = posts[day] || [];

                                    return (
                                        <div
                                            key={di}
                                            onClick={() => day && openAddModal(day)}
                                            className={`min-h-[90px] md:min-h-[110px] p-1.5 md:p-2 border-r border-gray-100 last:border-r-0 transition-colors ${
                                                day ? 'hover:bg-primary/5 cursor-pointer' : 'bg-gray-50/30'
                                            } ${isToday ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <span className={`font-handwriting text-base md:text-lg ${isToday ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                        {day}
                                                    </span>
                                                    <div className="mt-0.5 space-y-1">
                                                        {dayPosts.map((post, ci) => (
                                                            <div
                                                                key={ci}
                                                                onClick={(e) => { e.stopPropagation(); openEditModal(post); }}
                                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] md:text-xs font-bold cursor-pointer hover:opacity-80 ${platformColors[post.platform]}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[12px] md:text-[14px]">{platformIcons[post.platform]}</span>
                                                                <span className="truncate">{post.type}</span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(post.id, day); }}
                                                                    className="ml-auto text-[10px] opacity-50 hover:opacity-100"
                                                                >
                                                                    x
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {dayPosts.length === 0 && (
                                                            <div className="text-gray-300 italic font-note text-xs text-center py-1 hover:text-primary transition-colors">
                                                                + Add
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section: Content Mix / Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Content Mix */}
                        <div className="bg-yellow-100 p-6 shadow-sticky rotate-[-0.5deg] rounded-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="material-symbols-outlined text-gray-400 rotate-45 text-3xl opacity-50">push_pin</span>
                            </div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pie_chart</span>
                                Content Mix This Month
                            </h4>
                            {hasData ? (
                                <div className="space-y-2">
                                    {Object.entries(contentMix).map(([platform, count]) => (
                                        <div key={platform} className="flex items-center justify-between">
                                            <span className="font-note text-gray-700 flex items-center gap-2 capitalize">
                                                <span className={`w-3 h-3 rounded-full inline-block ${platform === 'instagram' ? 'bg-pink-400' : platform === 'youtube' ? 'bg-red-500' : platform === 'tiktok' ? 'bg-gray-700' : 'bg-blue-500'}`}></span>
                                                {platform}
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-800">{count} posts</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="font-note text-gray-500 italic">No content planned yet. Click on any date to add your first post!</p>
                                    <div className="mt-3 space-y-2 opacity-50">
                                        <div className="flex items-center justify-between">
                                            <span className="font-note text-gray-700 flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>
                                                Instagram
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-800">--</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-note text-gray-700 flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                                YouTube
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-800">--</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-orange-100 p-6 shadow-sticky rotate-[1deg] rounded-lg relative">
                            <div className="absolute -top-2 right-8 w-20 h-6 bg-primary/20 blur-[1px] rotate-[2deg]"></div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-orange-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                                Quick Tips
                            </h4>
                            <ul className="space-y-2 font-note text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    Click any date to add a new post
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    Click on an existing post to edit it
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    Use 'x' on a post to delete it
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-6 w-full max-w-md">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">
                            {editingPost ? 'Edit Post' : `Add Post - ${monthNames[month - 1]} ${selectedDay}`}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    {platformOptions.map(p => (
                                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    {typeOptions.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Title (optional)</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Morning Routine Video"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="planned">Planned</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Add any notes..."
                                    rows={3}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors"
                                >
                                    {editingPost ? 'Update' : 'Add'} Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
