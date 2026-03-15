import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const TAG_COLORS = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-pink-100 text-pink-700'];

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MeetingNotes({ notes: propNotes, clients: propClients, projects: propProjects }) {
    const [notes, setNotes] = useState(propNotes || []);
    const [clients, setClients] = useState(propClients || []);
    const [projects, setProjects] = useState(propProjects || []);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({ client_id: '', project_id: '', title: '', meeting_date: '', content: '' });

    useEffect(() => { setNotes(propNotes || []); }, [propNotes]);
    useEffect(() => { setClients(propClients || []); }, [propClients]);
    useEffect(() => { setProjects(propProjects || []); }, [propProjects]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNote?.id) {
                const res = await axios.put(`/api/work/meeting-notes/${editingNote.id}`, { ...formData, project_id: formData.project_id || null, client_id: formData.client_id || null });
                setNotes(notes.map(n => n.id === editingNote.id ? res.data : n));
            } else {
                const res = await axios.post('/api/work/meeting-notes', { ...formData, project_id: formData.project_id || null, client_id: formData.client_id || null });
                setNotes([res.data, ...notes]);
            }
            setShowModal(false);
            setEditingNote(null);
            setFormData({ client_id: '', project_id: '', title: '', meeting_date: '', content: '' });
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this note?')) return;
        try {
            await axios.delete(`/api/work/meeting-notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (err) { console.error(err); }
    };

    const openEdit = (note) => {
        setEditingNote(note);
        setFormData({ client_id: note.client_id || '', project_id: note.project_id || '', title: note.title || '', meeting_date: note.meeting_date ? String(note.meeting_date).slice(0, 10) : '', content: note.content || '' });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingNote(null);
        setFormData({ client_id: clients[0]?.id || '', project_id: '', title: '', meeting_date: new Date().toISOString().split('T')[0], content: '' });
        setShowModal(true);
    };

    if (!notes.length) {
        return (
            <JournalLayout pageTitle="Work OS - Meeting Notes" headerTitle="Meeting Notes" headerSubtitle="Document your meetings" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="event_note" title="Belum ada catatan rapat" description="Catat rapat pertamamu untuk menjaga komunikasi tetap terdokumentasi" actionLabel="Add Note" onAction={openAdd} />
                    </div>
                </div>
                {showModal && <NoteModal formData={formData} setFormData={setFormData} clients={clients} projects={projects} handleSubmit={handleSubmit} editingNote={editingNote} setShowModal={setShowModal} />}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Meeting Notes" headerTitle="Meeting Notes" headerSubtitle="Document your meetings" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">event_note</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <div><h3 className="font-handwriting text-2xl font-bold text-gray-700">All Meetings</h3><p className="font-note text-sm text-gray-400">{notes.length} notes</p></div>
                        <button onClick={openAdd} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl"><span className="material-symbols-outlined text-[18px]">add</span> Add Note</button>
                    </div>
                    <div className="space-y-4">
                        {notes.map((note, idx) => (
                            <div key={note.id || idx} className="bg-page-bg shadow-notebook rounded-xl border-l-4 border-blue-400 border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-handwriting text-xl font-bold text-gray-800">{note.title}</h4>
                                            <span className={`${TAG_COLORS[idx % TAG_COLORS.length]} text-xs font-bold px-2.5 py-0.5 rounded-full`}>{note.client?.name || 'General'}</span>
                                            {note.project?.name && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{note.project.name}</span>}
                                        </div>
                                        <p className="font-note text-sm text-gray-500">{formatDate(note.meeting_date)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(note)} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                        <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                    </div>
                                </div>
                                {note.content && <p className="font-note text-sm text-gray-600 mt-4 whitespace-pre-wrap">{note.content}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && <NoteModal formData={formData} setFormData={setFormData} clients={clients} projects={projects} handleSubmit={handleSubmit} editingNote={editingNote} setShowModal={setShowModal} />}
        </JournalLayout>
    );
}

function NoteModal({ formData, setFormData, clients, projects, handleSubmit, editingNote, setShowModal }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="font-handwriting text-xl font-bold mb-4">{editingNote ? 'Edit Note' : 'Add Meeting Note'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                        <option value="">Select Client (Optional)</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                        <option value="">Select Project (Optional)</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="text" placeholder="Meeting Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
                    <input type="date" value={formData.meeting_date} onChange={e => setFormData({...formData, meeting_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
                    <textarea placeholder="Meeting notes..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" rows={5} />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl">{editingNote ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
