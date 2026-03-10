import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { router } from '@inertiajs/react';

export default function KajianNotes({ notes: initialNotes }) {
    const [notes, setNotes] = useState(initialNotes || []);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [newNote, setNewNote] = useState({
        date: new Date().toISOString().split('T')[0],
        title: '',
        speaker: '',
        notes: '',
        key_points: [],
        action_items: [],
        color: 'bg-blue-50',
    });
    const [newKeyPoint, setNewKeyPoint] = useState('');
    const [newActionItem, setNewActionItem] = useState('');

    const colorOptions = [
        { value: 'bg-blue-50', border: 'border-blue-100' },
        { value: 'bg-emerald-50', border: 'border-emerald-100' },
        { value: 'bg-amber-50', border: 'border-amber-100' },
        { value: 'bg-rose-50', border: 'border-rose-100' },
        { value: 'bg-purple-50', border: 'border-purple-100' },
    ];

    const addKeyPoint = () => {
        if (newKeyPoint.trim()) {
            setNewNote({
                ...newNote,
                key_points: [...newNote.key_points, newKeyPoint.trim()]
            });
            setNewKeyPoint('');
        }
    };

    const addActionItem = () => {
        if (newActionItem.trim()) {
            setNewNote({
                ...newNote,
                action_items: [...newNote.action_items, newActionItem.trim()]
            });
            setNewActionItem('');
        }
    };

    const saveNote = () => {
        if (!newNote.title) return;

        router.post('/api/muslim/kajian-notes', newNote, {
            preserveScroll: true,
            onSuccess: () => {
                setNotes([...notes, { ...newNote, id: Date.now() }]);
                setShowForm(false);
                setNewNote({
                    date: new Date().toISOString().split('T')[0],
                    title: '',
                    speaker: '',
                    notes: '',
                    key_points: [],
                    action_items: [],
                    color: 'bg-blue-50',
                });
            },
        });
    };

    const deleteNote = (id) => {
        router.delete(`/api/muslim/kajian-notes/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setNotes(notes.filter(n => n.id !== id));
            },
        });
    };

    const getBorderClass = (colorClass) => {
        const found = colorOptions.find(c => c.value === colorClass);
        return found ? found.border : 'border-blue-100';
    };

    return (
        <JournalLayout
            pageTitle="Muslim OS - Kajian Notes"
            headerTitle="Kajian Notes"
            headerSubtitle="Seek knowledge from cradle to grave"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">school</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-16 opacity-10 pointer-events-none rotate-[-10deg]">
                    <span className="material-symbols-outlined text-[70px] text-primary">menu_book</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header card with stats */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-amber-100/80 rotate-1"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-3xl text-primary">auto_stories</span>
                                </div>
                                <div>
                                    <h3 className="font-handwriting text-2xl font-bold text-gray-700">Catatan Kajian</h3>
                                    <p className="font-note text-sm text-gray-400">{notes.length} catatan tersimpan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span> Catatan Baru
                            </button>
                        </div>
                    </div>

                    {/* Add Form */}
                    {showForm && (
                        <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                            <div className="washi-tape -top-2 left-20 bg-emerald-100/70 rotate-[-1deg]"></div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={newNote.date}
                                        onChange={(e) => setNewNote({...newNote, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={newNote.speaker}
                                        onChange={(e) => setNewNote({...newNote, speaker: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                        placeholder="Nama Pemateri"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    placeholder="Judul Kajian"
                                />
                                <textarea
                                    value={newNote.notes}
                                    onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                    placeholder="Catatan utama..."
                                    rows={4}
                                />

                                {/* Key Points */}
                                <div>
                                    <p className="font-handwriting text-sm font-bold text-gray-500 mb-2">Poin Penting:</p>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newKeyPoint}
                                            onChange={(e) => setNewKeyPoint(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-note text-sm"
                                            placeholder="Tambah poin penting..."
                                            onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
                                        />
                                        <button onClick={addKeyPoint} className="px-3 py-2 bg-primary/10 text-primary rounded-lg">
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {newNote.key_points.map((point, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-note">
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="flex items-center gap-2">
                                    <span className="font-note text-sm text-gray-500">Warna:</span>
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewNote({...newNote, color: color.value})}
                                            className={`w-6 h-6 rounded-full ${color.value} border-2 ${newNote.color === color.value ? 'border-primary' : 'border-transparent'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={saveNote}
                                    className="w-full py-2 bg-primary text-white rounded-lg font-handwriting text-lg hover:bg-primary/90"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notes Grid */}
                    {notes.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-5xl text-gray-300">school</span>
                            </div>
                            <p className="font-handwriting text-xl text-gray-400">Ketuk untuk tambah catatan kajian...</p>
                            <p className="font-note text-sm text-gray-300 mt-2">Simpan ilmu yang kamu dapat dari setiap kajian</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {notes.map((note, idx) => (
                                <div key={note.id || idx} className={`relative ${note.color} shadow-notebook rounded-xl ${getBorderClass(note.color)} border p-6 hover:shadow-lg transition-all group`}>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-note text-xs text-gray-400">
                                                    {new Date(note.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h4 className="font-handwriting text-xl font-bold text-gray-700 leading-snug">{note.title || 'Tanpa Judul'}</h4>
                                        </div>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>

                                    {/* Speaker */}
                                    {note.speaker && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                                <span className="material-symbols-outlined text-sm text-gray-500">person</span>
                                            </div>
                                            <span className="font-note text-sm text-gray-500">{note.speaker}</span>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {note.notes && (
                                        <div className="bg-white/50 rounded-lg p-4 border border-white/80 mb-4">
                                            <p className="font-note text-sm text-gray-600 leading-relaxed">{note.notes}</p>
                                        </div>
                                    )}

                                    {/* Key Points */}
                                    {note.key_points && note.key_points.length > 0 && (
                                        <div className="bg-white/50 rounded-lg p-4 border border-white/80">
                                            <p className="font-handwriting text-sm font-bold text-gray-500 mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base text-primary/50">lightbulb</span>
                                                Poin Penting:
                                            </p>
                                            <ul className="space-y-1">
                                                {note.key_points.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="material-symbols-outlined text-sm text-primary/40 mt-0.5">arrow_right</span>
                                                        <span className="font-note text-sm text-gray-600">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bottom sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-80 relative rotate-[-1deg] hover:rotate-0 transition-transform">
                            <p className="font-handwriting text-lg text-gray-800 leading-snug text-center" style={{ fontFamily: 'serif' }}>
                                "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللّٰهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ"
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga." (HR. Muslim)
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </JournalLayout>
    );
}