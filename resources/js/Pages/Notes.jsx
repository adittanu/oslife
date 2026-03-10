import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const COLOR_OPTIONS = [
    { value: 'yellow', bg: 'bg-sticky-yellow', border: 'border-yellow-200' },
    { value: 'pink', bg: 'bg-sticky-pink', border: 'border-pink-200' },
    { value: 'green', bg: 'bg-sticky-green', border: 'border-green-200' },
    { value: 'blue', bg: 'bg-sticky-blue', border: 'border-blue-200' },
];

function getColorStyle(color) {
    const found = COLOR_OPTIONS.find(c => c.value === color);
    return found || COLOR_OPTIONS[0];
}

export default function Notes({ notes: propNotes }) {
    const [notes, setNotes] = useState(propNotes || []);
    const [selectedNote, setSelectedNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const saveRef = useRef(null);

    useEffect(() => {
        setNotes(propNotes || []);
        if (propNotes && propNotes.length > 0 && !selectedNote) {
            setSelectedNote(propNotes[0]);
            setTitle(propNotes[0].title);
            setContent(propNotes[0].content);
            setSelectedColor(propNotes[0].color || 'yellow');
            setTags(propNotes[0].tags || []);
        }
    }, [propNotes]);

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setSelectedColor(selectedNote.color || 'yellow');
            setTags(selectedNote.tags || []);
        }
    }, [selectedNote]);

    const autoSave = useRef(null);
    const triggerAutoSave = (data) => {
        clearTimeout(autoSave.current);
        autoSave.current = setTimeout(() => {
            if (selectedNote?.id) {
                axios.patch(`/api/notes/${selectedNote.id}`, data);
            }
        }, 1000);
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setSelectedColor(note.color || 'yellow');
        setTags(note.tags || []);
    };

    const createNewNote = async () => {
        try {
            const res = await axios.post('/api/notes', {
                title: 'New Note',
                content: '',
                color: 'yellow',
                tags: [],
            });
            setNotes([res.data, ...notes]);
            handleSelectNote(res.data);
        } catch (e) {
            console.error('Failed to create note', e);
        }
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (selectedNote?.id) {
            triggerAutoSave({ title: newTitle });
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: newTitle } : n));
        }
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        if (selectedNote?.id) {
            triggerAutoSave({ content: newContent });
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, content: newContent } : n));
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        if (selectedNote?.id) {
            triggerAutoSave({ color });
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, color } : n));
        }
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            setNewTag('');
            if (selectedNote?.id) {
                triggerAutoSave({ tags: updatedTags });
            }
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = tags.filter(t => t !== tagToRemove);
        setTags(updatedTags);
        if (selectedNote?.id) {
            triggerAutoSave({ tags: updatedTags });
        }
    };

    const deleteNote = async () => {
        if (!selectedNote?.id) return;
        try {
            await axios.delete(`/api/notes/${selectedNote.id}`);
            const filtered = notes.filter(n => n.id !== selectedNote.id);
            setNotes(filtered);
            if (filtered.length > 0) {
                handleSelectNote(filtered[0]);
            } else {
                setSelectedNote(null);
                setTitle('');
                setContent('');
                setTags([]);
            }
        } catch (e) {
            console.error('Failed to delete note', e);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <JournalLayout
            pageTitle="Mosiku Notes Collection Page"
            headerTitle="Notes"
            headerSubtitle="Jotting down life's details."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[80px] text-green-400 rotate-[-15deg]">local_cafe</span>}
        >
            <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                <span className="material-symbols-outlined text-[70px] text-blue-300">push_pin</span>
            </div>
            <div className="absolute bottom-10 left-[40%] opacity-20 pointer-events-none rotate-[20deg]">
                <span className="material-symbols-outlined text-[60px] text-yellow-300">edit</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-[1200px] h-full min-h-[850px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10 shadow-notebook-spine"></div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 grid-lines overflow-y-auto custom-scrollbar">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <div className="w-full text-center md:text-left md:pl-4">
                                <h3 className="font-handwriting text-4xl font-bold text-gray-700 mt-2">Recent Notes</h3>
                                <div className="h-0.5 w-32 bg-blue-200 mx-auto md:mx-0 mt-3 rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-6 mt-8 relative z-10">
                            {notes.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">note_alt</span>
                                    <p className="font-note text-lg text-gray-300 italic">No notes yet...</p>
                                </div>
                            ) : (
                                notes.map((note) => {
                                    const colorStyle = getColorStyle(note.color);
                                    return (
                                        <div
                                            key={note.id}
                                            className={`${colorStyle.bg} p-5 rounded-lg shadow-sticky hover:shadow-sticky-hover transition-all cursor-pointer rotate-[-1deg] torn-paper relative border ${colorStyle.border} ${selectedNote?.id === note.id ? 'ring-2 ring-primary' : ''}`}
                                            onClick={() => handleSelectNote(note)}
                                        >
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="material-symbols-outlined text-gray-400 rotate-45 text-3xl opacity-50">push_pin</span>
                                            </div>
                                            <div className="flex justify-between items-start mb-2 mt-2">
                                                <h4 className="font-handwriting text-2xl text-gray-800 font-bold">{note.title}</h4>
                                                <span className="font-note text-sm text-gray-500">{formatDate(note.created_at)}</span>
                                            </div>
                                            <p className="font-note text-lg text-gray-600 line-clamp-2">{note.content}</p>
                                            {note.tags && note.tags.length > 0 && (
                                                <div className="mt-3 flex gap-2">
                                                    {note.tags.map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded-md text-xs font-bold bg-white/50 text-gray-700 border border-gray-300">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            <button
                                onClick={createNewNote}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-note text-xl hover:bg-gray-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 mb-4"
                            >
                                <span className="material-symbols-outlined">add</span> Create New Note
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-10 relative paper-lines overflow-hidden flex flex-col">
                        <div className="washi-tape top-4 right-10 bg-green-100/70 rotate-[3deg]"></div>
                        <div className="washi-tape bottom-10 -right-4 bg-yellow-100/70 rotate-[-15deg] w-40"></div>

                        <div className="flex justify-between items-start mb-6 z-10 relative">
                            <input
                                className="bg-transparent border-none focus:ring-0 font-handwriting text-4xl font-bold text-gray-800 p-0 w-full placeholder-gray-300 outline-none"
                                placeholder="Note Title..."
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                            />
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                <button
                                    onClick={deleteNote}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-2xl">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 z-10 relative">
                            <span className="font-note text-gray-400 text-lg">Tags:</span>
                            <div className="flex gap-2 relative">
                                {tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-sm font-note bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 transition-colors flex items-center gap-1"
                                    >
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ))}
                                <div className="flex items-center gap-1">
                                    <input
                                        className="bg-transparent border-none focus:ring-0 font-note text-sm text-gray-500 outline-none w-20"
                                        placeholder="Add tag..."
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                    />
                                    <button onClick={addTag} className="text-gray-400 hover:text-primary">
                                        <span className="material-symbols-outlined text-[14px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 z-10 relative">
                            <span className="font-note text-gray-400 text-sm">Color:</span>
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleColorChange(opt.value)}
                                    className={`w-6 h-6 rounded-full border-2 ${opt.bg} ${selectedColor === opt.value ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}`}
                                />
                            ))}
                        </div>

                        <div className="relative w-full flex-1 z-10">
                            <textarea
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-note text-2xl text-gray-800 leading-[2.5rem] focus:ring-0 custom-scrollbar"
                                placeholder="Start writing here..."
                                value={content}
                                onChange={handleContentChange}
                            />
                        </div>

                        <div className="text-center text-gray-400 font-note text-sm mt-4">
                            {selectedNote?.updated_at ? `Last edited: ${new Date(selectedNote.updated_at).toLocaleString()}` : 'Not saved yet'}
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
