import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function ScriptWriter() {
    const scripts = [
        { id: 1, title: 'Morning Routine 2026', platform: 'youtube', status: 'editing', words: 842, updated: 'Today' },
        { id: 2, title: '5 Creator Tools You Need', platform: 'youtube', status: 'draft', words: 1205, updated: 'Yesterday' },
        { id: 3, title: 'Desk Setup Tour', platform: 'tiktok', status: 'final', words: 156, updated: 'Mar 7' },
        { id: 4, title: 'Why I Quit My 9-5', platform: 'instagram', status: 'draft', words: 320, updated: 'Mar 6' },
        { id: 5, title: 'Collab Intro - Design Challenge', platform: 'instagram', status: 'draft', words: 198, updated: 'Mar 5' },
        { id: 6, title: 'Weekly Q&A - March', platform: 'twitter', status: 'outline', words: 87, updated: 'Mar 4' },
    ];

    const platformStyles = {
        instagram: 'bg-pink-100 text-pink-700',
        youtube: 'bg-red-100 text-red-700',
        tiktok: 'bg-gray-200 text-gray-800',
        twitter: 'bg-blue-100 text-blue-700',
    };

    const platformIcons = {
        instagram: 'photo_camera',
        youtube: 'play_circle',
        tiktok: 'music_note',
        twitter: 'tag',
    };

    const statusDot = {
        draft: 'bg-yellow-400',
        editing: 'bg-blue-400',
        final: 'bg-green-400',
        outline: 'bg-gray-400',
    };

    const sampleScript = `[HOOK - 0:00-0:05]
"Stop scrolling — this morning routine changed my entire life as a creator."

[INTRO - 0:05-0:30]
Hey everyone, welcome back to the channel. So I've been getting a LOT of comments asking about my morning routine, especially since I posted that "day in my life" vlog last month.

Today I'm going to walk you through exactly what I do every single morning to stay productive, creative, and honestly... sane.

[SECTION 1: THE WAKE UP - 0:30-2:00]
First things first — I wake up at 6:30 AM. I know, I know. But hear me out. I used to be a night owl, editing until 3 AM. That was destroying my creativity.

Now I wake up, and the FIRST thing I do is NOT check my phone. This is huge. Instead, I:
- Drink a full glass of water
- 5 minutes of stretching
- Write 3 things I'm grateful for in my journal

[SECTION 2: CREATIVE BLOCK - 2:00-4:00]
From 7 to 9 AM is what I call my "creative block." This is when I do my most important creative work — writing scripts (like this one!), brainstorming ideas, or planning content.

No emails. No DMs. No notifications. Just pure creative flow.

[CTA - 4:00-4:30]
If you found this helpful, smash that like button and subscribe — I post new videos every Tuesday and Friday. Drop a comment telling me YOUR morning routine, I'd love to hear it!

See you in the next one. Peace!`;

    const wordCount = sampleScript.split(/\s+/).filter(Boolean).length;
    const charCount = sampleScript.length;

    return (
        <JournalLayout
            pageTitle="Creator OS - Script Writer"
            headerTitle="Script Writer"
            headerSubtitle="Craft your story"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">edit_note</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 min-h-[700px]">

                        {/* Left Panel: Script List */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 overflow-hidden">
                                {/* Panel Header */}
                                <div className="p-4 border-b border-gray-200 bg-primary/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-handwriting text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl">description</span>
                                            My Scripts
                                        </h3>
                                        <span className="font-note text-sm text-gray-500">{scripts.length} drafts</span>
                                    </div>
                                    <button className="w-full py-2 rounded-lg bg-primary text-white font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        New Script
                                    </button>
                                </div>

                                {/* Script List */}
                                <div className="divide-y divide-gray-100">
                                    {scripts.map((script, idx) => (
                                        <div
                                            key={script.id}
                                            className={`p-3 cursor-pointer transition-colors hover:bg-primary/5 ${idx === 0 ? 'bg-primary/10 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`font-handwriting text-base leading-tight ${idx === 0 ? 'text-primary font-bold' : 'text-gray-800 font-bold'}`}>
                                                    {script.title}
                                                </h4>
                                                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${statusDot[script.status]}`}></span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${platformStyles[script.platform]}`}>
                                                    <span className="material-symbols-outlined text-[11px]">{platformIcons[script.platform]}</span>
                                                    {script.platform}
                                                </span>
                                                <span className="font-note text-[11px] text-gray-400">{script.words} words</span>
                                                <span className="font-note text-[11px] text-gray-400 ml-auto">{script.updated}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Template Suggestions Sticky */}
                            <div className="bg-orange-100 p-5 shadow-sticky rotate-[-1deg] rounded-lg mt-6 relative">
                                <div className="absolute -top-3 right-6">
                                    <span className="material-symbols-outlined text-gray-400 rotate-45 text-2xl opacity-50">push_pin</span>
                                </div>
                                <h4 className="font-sketch text-lg text-gray-800 mb-3 border-b border-orange-300 pb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                                    Script Templates
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-white/60 rounded-lg p-2.5">
                                        <p className="font-handwriting text-sm font-bold text-gray-800">Hook &rarr; Story &rarr; CTA</p>
                                        <p className="font-note text-xs text-gray-500">Classic YouTube structure</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5">
                                        <p className="font-handwriting text-sm font-bold text-gray-800">Problem &rarr; Agitate &rarr; Solve</p>
                                        <p className="font-note text-xs text-gray-500">Great for tutorials & tips</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5">
                                        <p className="font-handwriting text-sm font-bold text-gray-800">3-Second Hook &rarr; Payoff</p>
                                        <p className="font-note text-xs text-gray-500">TikTok / Reels format</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-2.5">
                                        <p className="font-handwriting text-sm font-bold text-gray-800">Listicle: Number &rarr; Items &rarr; Wrap</p>
                                        <p className="font-note text-xs text-gray-500">Carousel & thread friendly</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Editor */}
                        <div className="flex-1 flex flex-col">
                            <div className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden">
                                {/* Editor Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            className="bg-transparent border-none focus:ring-0 font-handwriting text-2xl font-bold text-gray-800 p-0 outline-none placeholder-gray-300"
                                            defaultValue="Morning Routine 2026"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${platformStyles.youtube}`}>
                                            <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                            youtube
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                            <span className={`w-2 h-2 rounded-full ${statusDot.editing}`}></span>
                                            Editing
                                        </span>
                                    </div>
                                </div>

                                {/* Toolbar */}
                                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1 flex-wrap bg-gray-50/50">
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Bold">
                                        <span className="material-symbols-outlined text-lg">format_bold</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Italic">
                                        <span className="material-symbols-outlined text-lg">format_italic</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Heading">
                                        <span className="material-symbols-outlined text-lg">title</span>
                                    </button>
                                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Bullet List">
                                        <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Numbered List">
                                        <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                                    </button>
                                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Timestamp">
                                        <span className="material-symbols-outlined text-lg">timer</span>
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500" title="Section Break">
                                        <span className="material-symbols-outlined text-lg">horizontal_rule</span>
                                    </button>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-note text-xs font-bold transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                            Copy
                                        </button>
                                        <button className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-note text-xs font-bold transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">save</span>
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Editor Area */}
                                <div className="flex-1 p-4 relative">
                                    <textarea
                                        className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none font-note text-base text-gray-800 leading-relaxed focus:ring-0 custom-scrollbar"
                                        defaultValue={sampleScript}
                                    ></textarea>
                                </div>

                                {/* Footer: Word Count & Stats */}
                                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-4">
                                        <span className="font-note text-sm text-gray-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">notes</span>
                                            {wordCount} words
                                        </span>
                                        <span className="font-note text-sm text-gray-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">text_fields</span>
                                            {charCount.toLocaleString()} characters
                                        </span>
                                        <span className="font-note text-sm text-gray-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">timer</span>
                                            ~4 min read
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-note text-xs text-gray-400">Last saved: 2 min ago</span>
                                        <span className="material-symbols-outlined text-green-500 text-[16px]">cloud_done</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Sticky Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {/* Writing Tips Sticky */}
                                <div className="bg-yellow-100 p-4 shadow-sticky rotate-[0.5deg] rounded-lg relative">
                                    <div className="absolute -top-2 left-6 w-16 h-5 bg-primary/20 blur-[1px] rotate-[-2deg]"></div>
                                    <h4 className="font-sketch text-base text-gray-800 mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-lg">tips_and_updates</span>
                                        Writing Tips
                                    </h4>
                                    <ul className="space-y-1.5 font-note text-sm text-gray-600">
                                        <li className="flex items-start gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[14px] mt-0.5">arrow_right</span>
                                            Hook them in the first 3 seconds
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[14px] mt-0.5">arrow_right</span>
                                            Use "you" more than "I"
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[14px] mt-0.5">arrow_right</span>
                                            Keep sentences short and punchy
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[14px] mt-0.5">arrow_right</span>
                                            End with a clear call to action
                                        </li>
                                    </ul>
                                </div>

                                {/* Caption Limits Sticky */}
                                <div className="bg-blue-100 p-4 shadow-sticky rotate-[-0.5deg] rounded-lg relative">
                                    <div className="absolute -top-3 right-8">
                                        <span className="material-symbols-outlined text-gray-400 rotate-45 text-2xl opacity-50">push_pin</span>
                                    </div>
                                    <h4 className="font-sketch text-base text-gray-800 mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">rule</span>
                                        Platform Limits
                                    </h4>
                                    <div className="space-y-1.5 font-note text-sm text-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-pink-500">photo_camera</span>
                                                Instagram caption
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-700">2,200 chars</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-red-500">play_circle</span>
                                                YouTube description
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-700">5,000 chars</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-gray-700">music_note</span>
                                                TikTok caption
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-700">4,000 chars</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-blue-500">tag</span>
                                                Twitter post
                                            </span>
                                            <span className="font-handwriting font-bold text-gray-700">280 chars</span>
                                        </div>
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
