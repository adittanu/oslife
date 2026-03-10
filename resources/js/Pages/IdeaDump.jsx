import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const COLOR_OPTIONS = [
    { value: 'yellow', bg: 'bg-sticky-yellow', border: 'border-yellow-200' },
    { value: 'pink', bg: 'bg-sticky-pink', border: 'border-pink-200' },
    { value: 'blue', bg: 'bg-sticky-blue', border: 'border-blue-200' },
    { value: 'green', bg: 'bg-sticky-green', border: 'border-green-200' },
];

export default function IdeaDump({ ideas: propIdeas }) {
    const [ideas, setIdeas] = useState(propIdeas || []);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        setIdeas(propIdeas || []);
        if (propIdeas && propIdeas.length > 0 && !selectedIdea) {
            setSelectedIdea(propIdeas[0]);
            setTitle(propIdeas[0].title);
            setContent(propIdeas[0].content);
            setType(propIdeas[0].type || '');
            setSelectedColor(propIdeas[0].color || 'yellow');
            setTags(propIdeas[0].tags || []);
        }
    }, [propIdeas]);

    useEffect(() => {
        if (selectedIdea) {
            setTitle(selectedIdea.title);
            setContent(selectedIdea.content);
            setType(selectedIdea.type || '');
            setSelectedColor(selectedIdea.color || 'yellow');
            setTags(selectedIdea.tags || []);
        }
    }, [selectedIdea]);

    const autoSaveRef = useRef(null);
    const triggerAutoSave = (data) => {
        clearTimeout(autoSaveRef.current);
        autoSaveRef.current = setTimeout(() => {
            if (selectedIdea?.id) {
                axios.patch(`/api/ideas/${selectedIdea.id}`, data);
            }
        }, 1000);
    };

    const handleSelectIdea = (idea) => {
        setSelectedIdea(idea);
        setTitle(idea.title);
        setContent(idea.content);
        setType(idea.type || '');
        setSelectedColor(idea.color || 'yellow');
        setTags(idea.tags || []);
    };

    const createNewIdea = async () => {
        try {
            const res = await axios.post('/api/ideas', {
                title: 'New Idea',
                content: '',
                type: '',
                color: 'yellow',
                tags: [],
            });
            setIdeas([res.data, ...ideas]);
            handleSelectIdea(res.data);
        } catch (e) {
            console.error('Failed to create idea', e);
        }
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (selectedIdea?.id) {
            triggerAutoSave({ title: newTitle });
            setIdeas(prev => prev.map(i => i.id === selectedIdea.id ? { ...i, title: newTitle } : i));
        }
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        if (selectedIdea?.id) {
            triggerAutoSave({ content: newContent });
            setIdeas(prev => prev.map(i => i.id === selectedIdea.id ? { ...i, content: newContent } : i));
        }
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        if (selectedIdea?.id) {
            triggerAutoSave({ type: newType });
            setIdeas(prev => prev.map(i => i.id === selectedIdea.id ? { ...i, type: newType } : i));
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        if (selectedIdea?.id) {
            triggerAutoSave({ color });
            setIdeas(prev => prev.map(i => i.id === selectedIdea.id ? { ...i, color } : i));
        }
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            setNewTag('');
            if (selectedIdea?.id) {
                triggerAutoSave({ tags: updatedTags });
            }
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = tags.filter(t => t !== tagToRemove);
        setTags(updatedTags);
        if (selectedIdea?.id) {
            triggerAutoSave({ tags: updatedTags });
        }
    };

    const deleteIdea = async () => {
        if (!selectedIdea?.id) return;
        try {
            await axios.delete(`/api/ideas/${selectedIdea.id}`);
            const filtered = ideas.filter(i => i.id !== selectedIdea.id);
            setIdeas(filtered);
            if (filtered.length > 0) {
                handleSelectIdea(filtered[0]);
            } else {
                setSelectedIdea(null);
                setTitle('');
                setContent('');
                setType('');
                setTags([]);
            }
        } catch (e) {
            console.error('Failed to delete idea', e);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getColorStyle = (color) => {
        const found = COLOR_OPTIONS.find(c => c.value === color);
        return found || COLOR_OPTIONS[0];
    };

    return (
        <JournalLayout
            pageTitle="Mosiku Idea Dump Canvas"
            headerTitle="Idea Dump"
            headerSubtitle="Capture everything before it flies away."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">emoji_objects</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>

                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 dot-grid overflow-y-auto custom-scrollbar">
                        <div className="washi-tape top-4 left-20 bg-blue-200/50"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div>
                                <h3 className="font-handwriting text-4xl font-bold text-gray-800">Captured Ideas</h3>
                                <p className="font-note text-gray-400">Your brainstorm collection.</p>
                            </div>
                            <button
                                onClick={createNewIdea}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">add</span> New Idea
                            </button>
                        </div>

                        <div className="space-y-4 mt-8 relative z-10">
                            {ideas.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">lightbulb</span>
                                    <p className="font-note text-lg text-gray-300 italic">No ideas captured yet...</p>
                                </div>
                            ) : (
                                ideas.map((idea) => {
                                    const colorStyle = getColorStyle(idea.color);
                                    return (
                                        <div
                                            key={idea.id}
                                            className={`${colorStyle.bg} p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border ${colorStyle.border} ${selectedIdea?.id === idea.id ? 'ring-2 ring-primary' : ''}`}
                                            onClick={() => handleSelectIdea(idea)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-handwriting text-xl text-gray-800 font-bold">{idea.title}</h4>
                                                <span className="font-note text-xs text-gray-500">{formatDate(idea.created_at)}</span>
                                            </div>
                                            <p className="font-note text-sm text-gray-600 line-clamp-2 mt-1">{idea.content}</p>
                                            {idea.type && (
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-white/50 rounded text-xs font-bold text-gray-600">
                                                    {idea.type}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative bg-opacity-50 flex flex-col">
                        <div className="washi-tape top-4 right-20 bg-pink-200/50 rotate-[2deg]"></div>

                        <div className="mb-8 flex justify-between items-end">
                            <input
                                className="bg-transparent border-none focus:ring-0 font-handwriting text-3xl font-bold text-gray-800 p-0 w-full placeholder-gray-300 outline-none"
                                placeholder="Idea Title..."
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                            />
                            <button
                                onClick={deleteIdea}
                                className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                            >
                                <span className="material-symbols-outlined text-2xl">delete</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <input
                                className="bg-transparent border-b border-gray-300 focus:border-primary focus:ring-0 font-note text-lg text-gray-700 p-1 outline-none w-48"
                                placeholder="Type (optional)"
                                type="text"
                                value={type}
                                onChange={handleTypeChange}
                            />
                            <div className="flex items-center gap-2">
                                {COLOR_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleColorChange(opt.value)}
                                        className={`w-6 h-6 rounded-full border-2 ${opt.bg} ${selectedColor === opt.value ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full flex-1 z-10">
                            <textarea
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-xl text-gray-800 leading-relaxed focus:ring-0 custom-scrollbar"
                                placeholder="Capture your idea here..."
                                value={content}
                                onChange={handleContentChange}
                            />
                        </div>

                        <div className="text-center text-gray-400 font-note text-sm mt-4">
                            {selectedIdea?.updated_at ? `Last edited: ${new Date(selectedIdea.updated_at).toLocaleString()}` : 'Not saved yet'}
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
