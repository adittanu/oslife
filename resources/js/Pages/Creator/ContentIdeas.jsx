import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function ContentIdeas() {
    const categories = [
        {
            name: 'Trending',
            color: 'bg-red-50',
            borderColor: 'border-red-300',
            tagColor: 'bg-red-100 text-red-700',
            icon: 'local_fire_department',
            iconColor: 'text-red-500',
            ideas: [
                { title: '"Get Ready With Me" but for my workspace setup', platform: 'tiktok', status: 'planned', notes: 'Trending audio: lofi beats + fast cuts' },
                { title: 'React to viral productivity hacks', platform: 'youtube', status: 'draft', notes: 'Film this weekend, keep under 10 min' },
                { title: '"A day in my life as a content creator"', platform: 'instagram', status: 'planned', notes: 'Reel format, aesthetic transitions' },
            ],
        },
        {
            name: 'Evergreen',
            color: 'bg-green-50',
            borderColor: 'border-green-300',
            tagColor: 'bg-green-100 text-green-700',
            icon: 'park',
            iconColor: 'text-green-500',
            ideas: [
                { title: '10 apps every creator needs in 2026', platform: 'youtube', status: 'done', notes: 'Pinned comment with links' },
                { title: 'How I plan my content calendar', platform: 'instagram', status: 'draft', notes: 'Carousel with screenshots of my system' },
                { title: 'Lighting setup for beginners', platform: 'youtube', status: 'planned', notes: 'B-roll of actual setup needed' },
            ],
        },
        {
            name: 'Personal',
            color: 'bg-blue-50',
            borderColor: 'border-blue-300',
            tagColor: 'bg-blue-100 text-blue-700',
            icon: 'person',
            iconColor: 'text-blue-500',
            ideas: [
                { title: 'My creative burnout story + how I recovered', platform: 'youtube', status: 'draft', notes: 'Be vulnerable, share real numbers' },
                { title: 'Studio makeover vlog', platform: 'tiktok', status: 'planned', notes: 'Before/after timelapse style' },
            ],
        },
        {
            name: 'Collaboration',
            color: 'bg-purple-50',
            borderColor: 'border-purple-300',
            tagColor: 'bg-purple-100 text-purple-700',
            icon: 'group',
            iconColor: 'text-purple-500',
            ideas: [
                { title: 'Collab with @designdaily - "Design vs Code" challenge', platform: 'instagram', status: 'planned', notes: 'DM sent, waiting for reply' },
                { title: 'Podcast guest appearance - The Creator Economy Show', platform: 'twitter', status: 'done', notes: 'Episode airs March 20' },
            ],
        },
    ];

    const platformStyles = {
        instagram: 'bg-pink-100 text-pink-700 border-pink-200',
        youtube: 'bg-red-100 text-red-700 border-red-200',
        tiktok: 'bg-gray-200 text-gray-800 border-gray-300',
        twitter: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const platformIcons = {
        instagram: 'photo_camera',
        youtube: 'play_circle',
        tiktok: 'music_note',
        twitter: 'tag',
    };

    const statusStyles = {
        draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        planned: 'bg-blue-100 text-blue-800 border-blue-300',
        done: 'bg-green-100 text-green-800 border-green-300',
    };

    const statusIcons = {
        draft: 'edit_note',
        planned: 'schedule',
        done: 'check_circle',
    };

    return (
        <JournalLayout
            pageTitle="Creator OS - Content Ideas"
            headerTitle="Content Ideas"
            headerSubtitle="Your creative brain dump"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">lightbulb</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Quick Add Area */}
                    <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-5 mb-8 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 rounded-t-xl"></div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl">add_circle</span>
                            <input
                                className="flex-1 bg-transparent border-none focus:ring-0 font-note text-lg text-gray-600 placeholder-gray-400 outline-none"
                                placeholder="Quick brain dump... type an idea and hit enter"
                                type="text"
                            />
                            <div className="flex gap-2 shrink-0">
                                <select className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 font-note text-sm text-gray-600 focus:ring-primary focus:border-primary">
                                    <option>Instagram</option>
                                    <option>YouTube</option>
                                    <option>TikTok</option>
                                    <option>Twitter</option>
                                </select>
                                <button className="bg-primary text-white px-4 py-1.5 rounded-lg font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Top Section: Trending Sticky + Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Trending Topics Sticky */}
                        <div className="md:col-span-2 bg-orange-100 p-6 shadow-sticky rotate-[-0.5deg] rounded-lg relative">
                            <div className="absolute -top-3 left-8">
                                <span className="material-symbols-outlined text-gray-400 rotate-45 text-3xl opacity-50">push_pin</span>
                            </div>
                            <h4 className="font-sketch text-xl text-gray-800 mb-4 border-b border-orange-300 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">trending_up</span>
                                Trending Right Now
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">local_fire_department</span>
                                    <div>
                                        <p className="font-handwriting text-gray-800 font-bold">"Silent vlogging" aesthetic</p>
                                        <p className="font-note text-gray-500 text-sm">No talking, ASMR vibes, 2M+ views avg</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">local_fire_department</span>
                                    <div>
                                        <p className="font-handwriting text-gray-800 font-bold">AI tools for creators</p>
                                        <p className="font-note text-gray-500 text-sm">High search volume, sponsor potential</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">whatshot</span>
                                    <div>
                                        <p className="font-handwriting text-gray-800 font-bold">Desk setup tours</p>
                                        <p className="font-note text-gray-500 text-sm">Evergreen + trending combo</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">whatshot</span>
                                    <div>
                                        <p className="font-handwriting text-gray-800 font-bold">"What I wish I knew" series</p>
                                        <p className="font-note text-gray-500 text-sm">Relatable, high save rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ideas Counter Sticky */}
                        <div className="bg-yellow-100 p-6 shadow-sticky rotate-[1deg] rounded-lg relative">
                            <div className="absolute -top-2 right-6 w-16 h-5 bg-primary/20 blur-[1px] rotate-[3deg]"></div>
                            <h4 className="font-sketch text-lg text-gray-800 mb-3 border-b border-yellow-300 pb-2">Idea Bank</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600">Total ideas</span>
                                    <span className="font-handwriting text-2xl font-bold text-gray-800">13</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-yellow-600">edit_note</span> Drafts
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-yellow-700">4</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span> Planned
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-blue-700">7</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span> Done
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-green-700">2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanban-lite Board */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div key={category.name} className="flex flex-col">
                                {/* Category Header */}
                                <div className={`${category.color} rounded-t-xl border ${category.borderColor} border-b-0 px-4 py-3 flex items-center gap-2`}>
                                    <span className={`material-symbols-outlined ${category.iconColor}`}>{category.icon}</span>
                                    <h3 className="font-handwriting text-xl font-bold text-gray-800">{category.name}</h3>
                                    <span className="ml-auto font-note text-sm text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">{category.ideas.length}</span>
                                </div>

                                {/* Cards Container */}
                                <div className={`bg-page-bg rounded-b-xl border ${category.borderColor} border-t-0 p-3 space-y-3 min-h-[200px]`}>
                                    {category.ideas.map((idea, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer group"
                                        >
                                            <h4 className="font-handwriting text-base font-bold text-gray-800 leading-tight mb-2 group-hover:text-primary transition-colors">
                                                {idea.title}
                                            </h4>
                                            <p className="font-note text-xs text-gray-500 mb-3 line-clamp-2">{idea.notes}</p>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${platformStyles[idea.platform]}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{platformIcons[idea.platform]}</span>
                                                    {idea.platform}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[idea.status]}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{statusIcons[idea.status]}</span>
                                                    {idea.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Idea Button */}
                                    <button className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 font-note text-sm hover:bg-gray-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        Add idea
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Inspiration Sticky */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-blue-100 p-5 shadow-sticky rotate-[1deg] rounded-lg max-w-md relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="material-symbols-outlined text-gray-400 rotate-45 text-2xl opacity-50">push_pin</span>
                            </div>
                            <p className="font-handwriting text-xl text-gray-700 text-center font-bold italic">
                                "You don't need more ideas. You need to execute the ones you have."
                            </p>
                            <p className="text-center font-note text-gray-500 text-sm mt-2">- a wise creator on Twitter</p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}
