import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function ContentCalendar() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentMonth = [
        [null, null, null, null, null, null, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 29],
        [30, 31, null, null, null, null, null],
    ];

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

    const contentPlan = {
        2: [{ platform: 'instagram', type: 'Reel' }],
        3: [{ platform: 'youtube', type: 'Video' }],
        5: [{ platform: 'tiktok', type: 'Reel' }, { platform: 'instagram', type: 'Story' }],
        7: [{ platform: 'twitter', type: 'Thread' }],
        9: [{ platform: 'instagram', type: 'Post' }],
        10: [{ platform: 'youtube', type: 'Short' }],
        12: [{ platform: 'tiktok', type: 'Reel' }],
        13: [{ platform: 'instagram', type: 'Carousel' }],
        14: [{ platform: 'twitter', type: 'Post' }],
        16: [{ platform: 'youtube', type: 'Video' }],
        17: [{ platform: 'instagram', type: 'Reel' }, { platform: 'tiktok', type: 'Reel' }],
        19: [{ platform: 'instagram', type: 'Story' }],
        21: [{ platform: 'twitter', type: 'Thread' }, { platform: 'instagram', type: 'Post' }],
        23: [{ platform: 'youtube', type: 'Video' }],
        24: [{ platform: 'tiktok', type: 'Reel' }],
        26: [{ platform: 'instagram', type: 'Carousel' }],
        28: [{ platform: 'twitter', type: 'Post' }],
        30: [{ platform: 'youtube', type: 'Short' }, { platform: 'instagram', type: 'Reel' }],
    };

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
                            <p className="font-handwriting text-3xl font-bold text-gray-800">24</p>
                            <p className="font-note text-sm text-gray-500">Posts This Month</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-pink-400"></div>
                            <span className="material-symbols-outlined text-pink-500 text-3xl mb-1 block">devices</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">4</p>
                            <p className="font-note text-sm text-gray-500">Platforms Active</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
                            <span className="material-symbols-outlined text-green-500 text-3xl mb-1 block">trending_up</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">4.8%</p>
                            <p className="font-note text-sm text-gray-500">Engagement Rate</p>
                        </div>
                        <div className="bg-page-bg shadow-notebook rounded-xl p-4 border border-gray-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
                            <span className="material-symbols-outlined text-blue-500 text-3xl mb-1 block">visibility</span>
                            <p className="font-handwriting text-3xl font-bold text-gray-800">12.3K</p>
                            <p className="font-note text-sm text-gray-500">Total Reach</p>
                        </div>
                    </div>

                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-6">
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
                        {currentMonth.map((week, wi) => (
                            <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className={`min-h-[90px] md:min-h-[110px] p-1.5 md:p-2 border-r border-gray-100 last:border-r-0 transition-colors ${
                                            day ? 'hover:bg-primary/5 cursor-pointer' : 'bg-gray-50/30'
                                        } ${day === 9 ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset' : ''}`}
                                    >
                                        {day && (
                                            <>
                                                <span className={`font-handwriting text-base md:text-lg ${day === 9 ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                    {day}
                                                </span>
                                                <div className="mt-0.5 space-y-1">
                                                    {contentPlan[day] && contentPlan[day].map((item, ci) => (
                                                        <div key={ci} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] md:text-xs font-bold ${platformColors[item.platform]}`}>
                                                            <span className="material-symbols-outlined text-[12px] md:text-[14px]">{platformIcons[item.platform]}</span>
                                                            <span className="truncate">{item.type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section: Sticky Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Upcoming Deadlines */}
                        <div className="bg-orange-100 p-6 shadow-sticky rotate-[-1deg] rounded-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="material-symbols-outlined text-gray-400 rotate-45 text-3xl opacity-50">push_pin</span>
                            </div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-orange-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">schedule</span>
                                Upcoming Deadlines
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm">Mar 10</span>
                                    <span className="font-note text-gray-700">YouTube video on "Morning Routine" - Final Edit</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm">Mar 12</span>
                                    <span className="font-note text-gray-700">TikTok collab with @creativestudio</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm">Mar 16</span>
                                    <span className="font-note text-gray-700">YouTube sponsorship video - Draft due</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-handwriting text-primary font-bold text-sm">Mar 23</span>
                                    <span className="font-note text-gray-700">Monthly Q&A live stream</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Mix */}
                        <div className="bg-yellow-100 p-6 shadow-sticky rotate-[1deg] rounded-lg relative">
                            <div className="absolute -top-2 right-8 w-20 h-6 bg-primary/20 blur-[1px] rotate-[2deg]"></div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-yellow-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pie_chart</span>
                                Content Mix This Month
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-note text-gray-700 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>
                                        Instagram
                                    </span>
                                    <span className="font-handwriting font-bold text-gray-800">10 posts</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-note text-gray-700 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                        YouTube
                                    </span>
                                    <span className="font-handwriting font-bold text-gray-800">5 videos</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-note text-gray-700 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-gray-700 inline-block"></span>
                                        TikTok
                                    </span>
                                    <span className="font-handwriting font-bold text-gray-800">4 reels</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-note text-gray-700 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                                        Twitter
                                    </span>
                                    <span className="font-handwriting font-bold text-gray-800">5 posts</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-yellow-300">
                                <p className="font-note text-gray-500 text-sm italic">Tip: Keep a 40/30/20/10 split for variety!</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
