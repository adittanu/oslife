import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

export default function Gratitude({ entries: propEntries }) {
    const [entries, setEntries] = useState(propEntries || []);
    const [newEntry, setNewEntry] = useState('');

    useEffect(() => {
        setEntries(propEntries || []);
    }, [propEntries]);

    const handleAddEntry = async () => {
        if (!newEntry.trim()) return;
        try {
            const res = await axios.post('/api/gratitude', {
                content: newEntry.trim(),
                media_type: 'text',
            });
            setEntries([res.data, ...entries]);
            setNewEntry('');
            router.reload({ only: ['entries'] });
        } catch (e) {
            console.error('Failed to add gratitude entry', e);
        }
    };

    const handleDeleteEntry = async (id) => {
        try {
            await axios.delete(`/api/gratitude/${id}`);
            setEntries(entries.filter(e => e.id !== id));
            router.reload({ only: ['entries'] });
        } catch (e) {
            console.error('Failed to delete entry', e);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <JournalLayout
            pageTitle="Mosiku Gratitude Journal Page"
            headerTitle="Gratitude Journal"
            headerSubtitle="Cultivating thankfulness every single day."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-pink-300 rotate-12">spa</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center items-start">
                <div className="relative w-full max-w-6xl h-auto min-h-[800px] bg-page-bg shadow-notebook rounded-xl flex flex-col md:flex-row border border-gray-200">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block z-10"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none hidden md:block z-10"></div>
                    <div className="absolute -top-6 -left-6 z-0 opacity-10 pointer-events-none rotate-[-10deg]">
                        <span className="material-symbols-outlined text-9xl text-pink-500">local_florist</span>
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none z-0 rotate-12">
                        <span className="material-symbols-outlined text-9xl text-yellow-500">sunny</span>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative border-r border-gray-100 paper-lines overflow-hidden">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/80 rotate-1"></div>
                        <div className="flex justify-between items-start mb-8 z-10 relative">
                            <div className="w-full text-center">
                                <h3 className="font-handwriting text-3xl font-bold text-gray-700 mt-2">Things I'm Grateful For</h3>
                                <div className="h-0.5 w-32 bg-pink-200 mx-auto mt-2 rounded-full"></div>
                            </div>
                        </div>

                        <div className="relative h-full w-full px-2 space-y-10 mt-10">
                            {entries.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">spa</span>
                                    <p className="font-note text-lg text-gray-300 italic">No entries yet. Start your gratitude journey!</p>
                                </div>
                            ) : (
                                entries.map((entry, i) => (
                                    <div key={entry.id} className="flex gap-4 items-baseline group relative">
                                        <span className="font-handwriting text-2xl text-pink-400 w-8">{i + 1}.</span>
                                        <p className="font-handwriting text-3xl text-gray-600 border-b border-transparent leading-relaxed w-full">
                                            {entry.content}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 text-gray-400 hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ))
                            )}

                            <div className="flex gap-4 items-baseline group">
                                <span className="font-handwriting text-2xl text-pink-400 w-8">+</span>
                                <input
                                    className="font-handwriting text-3xl text-gray-400 border-b border-dotted border-gray-300 leading-relaxed w-full outline-none focus:border-pink-300 transition-colors italic"
                                    placeholder="Add something you're grateful for..."
                                    type="text"
                                    value={newEntry}
                                    onChange={(e) => setNewEntry(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-10 left-10">
                            <img alt="Flower doodle" className="w-24 opacity-40 mix-blend-multiply rotate-[-15deg]" src="/images/ciku-default.svg"/>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative bg-opacity-50">
                        <div className="washi-tape top-0 right-10 bg-purple-100/70 rotate-[3deg]"></div>
                        <div className="mb-12 flex flex-col items-center">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 mb-2 flex items-center gap-2">
                                Moments of Joy
                            </h3>
                            <span className="font-note text-gray-400 text-sm">Snapshots of happiness</span>
                        </div>

                        <div className="relative h-[600px] w-full">
                            {entries.length > 0 && entries.slice(0, 4).map((entry, i) => (
                                <div
                                    key={entry.id}
                                    className={`absolute z-10 rotate-[-3deg] hover:rotate-0 transition-transform duration-300 cursor-pointer group ${
                                        i === 0 ? 'top-0 left-4' : i === 1 ? 'top-20 right-8' : i === 2 ? 'bottom-32 left-10' : 'bottom-10 right-20'
                                    }`}
                                >
                                    <div className="bg-white p-3 pb-8 shadow-photo w-56 transform group-hover:scale-105 transition-transform">
                                        <div className="h-40 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center mb-2">
                                            <span className="material-symbols-outlined text-6xl text-pink-300">favorite</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-note text-gray-600 text-sm line-clamp-2">{entry.content}</p>
                                            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-1">{formatDate(entry.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {entries.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="font-note text-gray-400 italic">Your moments of joy will appear here</p>
                                </div>
                            )}

                            <div className="absolute top-[40%] left-[40%] opacity-60 z-0">
                                <svg height="100" viewBox="0 0 100 100" width="100">
                                    <path d="M50 10 Q60 40 90 50 Q60 60 50 90 Q40 60 10 50 Q40 40 50 10" fill="#FEF9C3" stroke="#FCD34D" strokeWidth="1"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </JournalLayout>
    );
}
