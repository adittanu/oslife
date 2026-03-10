import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

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
};

const DEFAULT_SCRIPT = `[HOOK - 0:00-0:05]
"Start with a hook that grabs attention immediately."

[INTRO - 0:05-0:30]
Introduce yourself and the topic. Keep it brief and engaging.

[SECTION 1 - 0:30-2:00]
First main point. Use examples and be specific.

[SECTION 2 - 2:00-4:00]
Second main point. Add value with actionable tips.

[CTA - 4:00-4:30]
Call to action. Ask viewers to like, subscribe, or comment.

[OUTRO - 4:30-5:00]
Wrap up and sign off. Leave them wanting more!`;

export default function ScriptWriter({ scripts: propScripts }) {
    const [scripts, setScripts] = useState([]);
    const [selectedScript, setSelectedScript] = useState(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('youtube');
    const [status, setStatus] = useState('draft');
    const [showNewModal, setShowNewModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPlatform, setNewPlatform] = useState('youtube');
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        if (propScripts && propScripts.length > 0) {
            setScripts(propScripts);
            // Select first script by default
            const first = propScripts[0];
            setSelectedScript(first);
            setContent(first.content || DEFAULT_SCRIPT);
            setTitle(first.title);
            setPlatform(first.platform);
            setStatus(first.status);
        } else {
            // Show placeholder
            setContent(DEFAULT_SCRIPT);
            setTitle('Untitled Script');
        }
    }, [propScripts]);

    const wordCount = useMemo(() => {
        return content.split(/\s+/).filter(Boolean).length;
    }, [content]);

    const charCount = useMemo(() => content.length, [content]);
    const readTime = useMemo(() => Math.ceil(wordCount / 150), [wordCount]); // ~150 WPM

    // Auto-save
    useEffect(() => {
        if (!selectedScript) return;

        const timeout = setTimeout(async () => {
            try {
                await axios.patch(`/api/creator/scripts/${selectedScript.id}`, {
                    title,
                    content,
                    platform,
                    status,
                });
                setLastSaved(new Date());
                // Update scripts list
                setScripts(prev => prev.map(s =>
                    s.id === selectedScript.id
                        ? { ...s, title, content, word_count: wordCount, status, platform }
                        : s
                ));
            } catch (err) {
                console.error('Auto-save failed:', err);
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [content, title, platform, status, selectedScript, wordCount]);

    const handleScriptSelect = (script) => {
        if (selectedScript && selectedScript.id === script.id) return;
        setSelectedScript(script);
        setContent(script.content || DEFAULT_SCRIPT);
        setTitle(script.title);
        setPlatform(script.platform);
        setStatus(script.status);
    };

    const handleNewScript = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const response = await axios.post('/api/creator/scripts', {
                title: newTitle,
                platform: newPlatform,
                status: 'draft',
                content: DEFAULT_SCRIPT,
            });

            const newScript = response.data.script;
            setScripts(prev => [newScript, ...prev]);
            setSelectedScript(newScript);
            setContent(DEFAULT_SCRIPT);
            setTitle(newScript.title);
            setPlatform(newScript.platform);
            setStatus('draft');
            setShowNewModal(false);
            setNewTitle('');
            setNewPlatform('youtube');
        } catch (err) {
            console.error('Failed to create script:', err);
        }
    };

    const handleDeleteScript = async (scriptId) => {
        if (!confirm('Are you sure you want to delete this script?')) return;

        try {
            await axios.delete(`/api/creator/scripts/${scriptId}`);
            const updated = scripts.filter(s => s.id !== scriptId);
            setScripts(updated);

            if (selectedScript?.id === scriptId) {
                if (updated.length > 0) {
                    const first = updated[0];
                    setSelectedScript(first);
                    setContent(first.content || DEFAULT_SCRIPT);
                    setTitle(first.title);
                    setPlatform(first.platform);
                    setStatus(first.status);
                } else {
                    setSelectedScript(null);
                    setContent(DEFAULT_SCRIPT);
                    setTitle('Untitled Script');
                }
            }
        } catch (err) {
            console.error('Failed to delete script:', err);
        }
    };

    const handleCopyContent = () => {
        navigator.clipboard.writeText(content);
        alert('Script copied to clipboard!');
    };

    const hasScripts = scripts.length > 0;

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
                                    <button
                                        onClick={() => setShowNewModal(true)}
                                        className="w-full py-2 rounded-lg bg-primary text-white font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        New Script
                                    </button>
                                </div>

                                {/* Script List */}
                                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                                    {hasScripts ? (
                                        scripts.map((script, idx) => (
                                            <div
                                                key={script.id}
                                                onClick={() => handleScriptSelect(script)}
                                                className={`p-3 cursor-pointer transition-colors hover:bg-primary/5 ${selectedScript?.id === script.id ? 'bg-primary/10 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`font-handwriting text-base leading-tight ${selectedScript?.id === script.id ? 'text-primary font-bold' : 'text-gray-800 font-bold'}`}>
                                                        {script.title}
                                                    </h4>
                                                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${statusDot[script.status]}`}></span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${platformStyles[script.platform]}`}>
                                                        <span className="material-symbols-outlined text-[11px]">{platformIcons[script.platform]}</span>
                                                        {script.platform}
                                                    </span>
                                                    <span className="font-note text-[11px] text-gray-400">{script.word_count || 0} words</span>
                                                    <span className="font-note text-[11px] text-gray-400 ml-auto">
                                                        {script.updated_at ? new Date(script.updated_at).toLocaleDateString() : 'Today'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400">
                                            <span className="material-symbols-outlined text-4xl mb-2">description</span>
                                            <p className="font-note text-sm">No scripts yet</p>
                                            <p className="font-note text-xs mt-1">Create your first script to get started!</p>
                                        </div>
                                    )}
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
                                    <div
                                        className="bg-white/60 rounded-lg p-2.5 cursor-pointer hover:bg-white/80 transition-colors"
                                        onClick={() => setContent(`[HOOK - 0:00-0:05]\n"Stop scrolling — this changed my life."\n\n[INTRO - 0:05-0:30]\nHey everyone, welcome back...\n\n[SECTION 1 - 0:30-2:00]\nMain point here...\n\n[CTA - 4:00-4:30]\nLike and subscribe!\n\n[OUTRO - 4:30-5:00]\nSee you next time!`)}
                                    >
                                        <p className="font-handwriting text-sm font-bold text-gray-800">Hook &rarr; Story &rarr; CTA</p>
                                        <p className="font-note text-xs text-gray-500">Classic YouTube structure</p>
                                    </div>
                                    <div
                                        className="bg-white/60 rounded-lg p-2.5 cursor-pointer hover:bg-white/80 transition-colors"
                                        onClick={() => setContent(`[PROBLEM]\n"Are you struggling with...?"\n\n[AGITATE]\n"This is causing you to..."\n\n[SOLUTION]\n"Here's how to fix it..."\n\n[PROOF]\n"I did this and got..."\n\n[CTA]\n"Try it yourself!"`)}
                                    >
                                        <p className="font-handwriting text-sm font-bold text-gray-800">Problem &rarr; Agitate &rarr; Solve</p>
                                        <p className="font-note text-xs text-gray-500">Great for tutorials & tips</p>
                                    </div>
                                    <div
                                        className="bg-white/60 rounded-lg p-2.5 cursor-pointer hover:bg-white/80 transition-colors"
                                        onClick={() => setContent(`3-SECOND HOOK:\nVisual/text only\n\nPAYOFF (3-15s):\nThe reveal/result\n\nCTA:\nFollow for more!`)}
                                    >
                                        <p className="font-handwriting text-sm font-bold text-gray-800">3-Second Hook &rarr; Payoff</p>
                                        <p className="font-note text-xs text-gray-500">TikTok / Reels format</p>
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
                                            className="bg-transparent border-none focus:ring-0 font-handwriting text-2xl font-bold text-gray-800 p-0 outline-none placeholder-gray-300 w-full max-w-md"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Script Title..."
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={platform}
                                            onChange={(e) => setPlatform(e.target.value)}
                                            className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold uppercase focus:ring-primary focus:border-primary"
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="twitter">Twitter</option>
                                        </select>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs font-bold uppercase focus:ring-primary focus:border-primary"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="editing">Editing</option>
                                            <option value="final">Final</option>
                                        </select>
                                        {selectedScript && (
                                            <button
                                                onClick={() => handleDeleteScript(selectedScript.id)}
                                                className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors"
                                                title="Delete script"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Toolbar */}
                                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1 flex-wrap bg-gray-50/50">
                                    <button
                                        onClick={() => setContent(content + '\n\n[HOOK]\n')}
                                        className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-500 text-xs font-bold"
                                        title="Add Hook"
                                    >
                                        [HOOK]
                                    </button>
                                    <button
                                        onClick={() => setContent(content + '\n\n[INTRO]\n')}
                                        className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-500 text-xs font-bold"
                                        title="Add Intro"
                                    >
                                        [INTRO]
                                    </button>
                                    <button
                                        onClick={() => setContent(content + '\n\n[SECTION]\n')}
                                        className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-500 text-xs font-bold"
                                        title="Add Section"
                                    >
                                        [SECTION]
                                    </button>
                                    <button
                                        onClick={() => setContent(content + '\n\n[CTA]\n')}
                                        className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-500 text-xs font-bold"
                                        title="Add CTA"
                                    >
                                        [CTA]
                                    </button>
                                    <button
                                        onClick={() => setContent(content + '\n\n[OUTRO]\n')}
                                        className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-500 text-xs font-bold"
                                        title="Add Outro"
                                    >
                                        [OUTRO]
                                    </button>
                                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button
                                            onClick={handleCopyContent}
                                            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-note text-xs font-bold transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                {/* Editor Area */}
                                <div className="flex-1 p-4 relative">
                                    <textarea
                                        className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none font-note text-base text-gray-800 leading-relaxed focus:ring-0 custom-scrollbar"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Start writing your script here..."
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
                                            ~{readTime} min read
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lastSaved && (
                                            <span className="font-note text-xs text-gray-400">
                                                Last saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
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
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* New Script Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-6 w-full max-w-md">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">Create New Script</h3>
                        <form onSubmit={handleNewScript} className="space-y-4">
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Script Title</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g., Morning Routine 2026"
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Platform</label>
                                <select
                                    value={newPlatform}
                                    onChange={(e) => setNewPlatform(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="twitter">Twitter</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Create Script
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
