import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

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

const categoryConfig = {
    trending: { color: 'bg-red-50', borderColor: 'border-red-300', tagColor: 'bg-red-100 text-red-700', icon: 'local_fire_department', iconColor: 'text-red-500' },
    evergreen: { color: 'bg-green-50', borderColor: 'border-green-300', tagColor: 'bg-green-100 text-green-700', icon: 'park', iconColor: 'text-green-500' },
    personal: { color: 'bg-blue-50', borderColor: 'border-blue-300', tagColor: 'bg-blue-100 text-blue-700', icon: 'person', iconColor: 'text-blue-500' },
    collaboration: { color: 'bg-purple-50', borderColor: 'border-purple-300', tagColor: 'bg-purple-100 text-purple-700', icon: 'group', iconColor: 'text-purple-500' },
};

const DEFAULT_CATEGORIES = ['trending', 'evergreen', 'personal', 'collaboration'];

export default function ContentIdeas({ ideas: propIdeas, stats }) {
    const [ideas, setIdeas] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIdea, setEditingIdea] = useState(null);
    const [quickAddText, setQuickAddText] = useState('');
    const [quickAddPlatform, setQuickAddPlatform] = useState('instagram');
    const [formData, setFormData] = useState({
        title: '',
        category: 'trending',
        platform: 'instagram',
        status: 'draft',
        notes: '',
    });

    useEffect(() => {
        // Group ideas by category
        const grouped = {};
        DEFAULT_CATEGORIES.forEach(cat => grouped[cat] = []);

        if (propIdeas) {
            Object.entries(propIdeas).forEach(([category, items]) => {
                grouped[category] = items || [];
            });
        }
        setIdeas(grouped);
    }, [propIdeas]);

    const openAddModal = (category = 'trending') => {
        setEditingIdea(null);
        setFormData({
            title: '',
            category,
            platform: 'instagram',
            status: 'draft',
            notes: '',
        });
        setShowAddModal(true);
    };

    const openEditModal = (idea) => {
        setEditingIdea(idea);
        setFormData({
            title: idea.title,
            category: idea.category,
            platform: idea.platform,
            status: idea.status,
            notes: idea.notes || '',
        });
        setShowAddModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingIdea) {
                const response = await axios.patch(`/api/creator/content-ideas/${editingIdea.id}`, formData);
                // Update local state
                setIdeas(prev => {
                    const newIdeas = { ...prev };
                    Object.keys(newIdeas).forEach(cat => {
                        newIdeas[cat] = newIdeas[cat].map(i => i.id === editingIdea.id ? response.data.idea : i);
                    });
                    return newIdeas;
                });
            } else {
                const response = await axios.post('/api/creator/content-ideas', formData);
                // Update local state
                setIdeas(prev => ({
                    ...prev,
                    [formData.category]: [...(prev[formData.category] || []), response.data.idea],
                }));
            }
            setShowAddModal(false);
        } catch (err) {
            console.error('Failed to save idea:', err);
        }
    };

    const handleDelete = async (ideaId, category) => {
        if (!confirm('Are you sure you want to delete this idea?')) return;

        try {
            await axios.delete(`/api/creator/content-ideas/${ideaId}`);
            setIdeas(prev => ({
                ...prev,
                [category]: (prev[category] || []).filter(i => i.id !== ideaId),
            }));
        } catch (err) {
            console.error('Failed to delete idea:', err);
        }
    };

    const handleQuickAdd = async (e) => {
        if (e.key !== 'Enter' || !quickAddText.trim()) return;

        try {
            const data = {
                title: quickAddText,
                category: 'trending',
                platform: quickAddPlatform,
                status: 'draft',
                notes: '',
            };
            const response = await axios.post('/api/creator/content-ideas', data);
            setIdeas(prev => ({
                ...prev,
                trending: [...(prev.trending || []), response.data.idea],
            }));
            setQuickAddText('');
        } catch (err) {
            console.error('Failed to add idea:', err);
        }
    };

    const allIdeas = Object.values(ideas).flat();
    const hasData = allIdeas.length > 0;

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
                                value={quickAddText}
                                onChange={(e) => setQuickAddText(e.target.value)}
                                onKeyDown={handleQuickAdd}
                            />
                            <div className="flex gap-2 shrink-0">
                                <select
                                    value={quickAddPlatform}
                                    onChange={(e) => setQuickAddPlatform(e.target.value)}
                                    className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 font-note text-sm text-gray-600 focus:ring-primary focus:border-primary"
                                >
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="twitter">Twitter</option>
                                </select>
                                <button
                                    onClick={handleQuickAdd}
                                    className="bg-primary text-white px-4 py-1.5 rounded-lg font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Top Section: Trending Topics + Stats */}
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
                                        <p className="font-handwriting text-gray-800 font-bold">"Get Ready With Me" but for my workspace setup</p>
                                        <p className="font-note text-gray-500 text-sm">Trending audio: lofi beats + fast cuts</p>
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
                                    <span className="font-handwriting text-2xl font-bold text-gray-800">{stats.total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-yellow-600">edit_note</span> Drafts
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-yellow-700">{stats.drafts || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span> Planned
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-blue-700">{stats.planned || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-note text-gray-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span> Done
                                    </span>
                                    <span className="font-handwriting text-lg font-bold text-green-700">{stats.done || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {DEFAULT_CATEGORIES.map((category) => {
                            const config = categoryConfig[category];
                            const categoryIdeas = ideas[category] || [];

                            return (
                                <div key={category} className="flex flex-col">
                                    {/* Category Header */}
                                    <div className={`${config.color} rounded-t-xl border ${config.borderColor} border-b-0 px-4 py-3 flex items-center gap-2`}>
                                        <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
                                        <h3 className="font-handwriting text-xl font-bold text-gray-800 capitalize">{category}</h3>
                                        <span className="ml-auto font-note text-sm text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">{categoryIdeas.length}</span>
                                    </div>

                                    {/* Cards Container */}
                                    <div className={`bg-page-bg rounded-b-xl border ${config.borderColor} border-t-0 p-3 space-y-3 min-h-[200px]`}>
                                        {categoryIdeas.length > 0 ? (
                                            categoryIdeas.map((idea, idx) => (
                                                <div
                                                    key={idea.id}
                                                    onClick={() => openEditModal(idea)}
                                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer group"
                                                >
                                                    <h4 className="font-handwriting text-base font-bold text-gray-800 leading-tight mb-2 group-hover:text-primary transition-colors">
                                                        {idea.title}
                                                    </h4>
                                                    <p className="font-note text-xs text-gray-500 mb-3 line-clamp-2">{idea.notes || 'No notes'}</p>
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
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-300">
                                                <span className="material-symbols-outlined text-4xl mb-2">lightbulb_outline</span>
                                                <p className="font-note text-sm italic">No ideas yet</p>
                                            </div>
                                        )}

                                        {/* Add Idea Button */}
                                        <button
                                            onClick={() => openAddModal(category)}
                                            className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 font-note text-sm hover:bg-gray-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                            Add idea
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-6 w-full max-w-md">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">
                            {editingIdea ? 'Edit Idea' : 'Add New Idea'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Your content idea..."
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-note text-sm text-gray-600 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        <option value="trending">Trending</option>
                                        <option value="evergreen">Evergreen</option>
                                        <option value="personal">Personal</option>
                                        <option value="collaboration">Collaboration</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-note text-sm text-gray-600 mb-1">Platform</label>
                                    <select
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        <option value="instagram">Instagram</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="twitter">Twitter</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="planned">Planned</option>
                                    <option value="done">Done</option>
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
                                {editingIdea && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(editingIdea.id, editingIdea.category)}
                                        className="px-4 py-2 rounded-lg border border-red-200 text-red-600 font-note font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors"
                                >
                                    {editingIdea ? 'Update' : 'Add'} Idea
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
