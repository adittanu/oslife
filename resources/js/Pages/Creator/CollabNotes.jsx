import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';

const STATUS_OPTIONS = ['outreach', 'negotiating', 'confirmed', 'done'];

const statusConfig = {
    outreach: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Outreach' },
    negotiating: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Negotiating' },
    confirmed: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Confirmed' },
    done: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Done' },
};

const DEFAULT_RATE_CARD = [
    { type: 'Instagram Post', rate: '$500' },
    { type: 'Instagram Reel', rate: '$800' },
    { type: 'Instagram Story', rate: '$200' },
    { type: 'YouTube Video', rate: '$1,500' },
    { type: 'TikTok Video', rate: '$600' },
    { type: 'Bundle Deal', rate: 'Custom' },
];

export default function CollabNotes({ collabs: propCollabs, stats }) {
    const [collabs, setCollabs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCollab, setEditingCollab] = useState(null);
    const [formData, setFormData] = useState({
        brand_name: '',
        status: 'outreach',
        deadline: '',
        payment: '',
        deliverables: '',
        notes: '',
    });

    useEffect(() => {
        if (propCollabs) {
            setCollabs(propCollabs);
        }
    }, [propCollabs]);

    const openAddModal = () => {
        setEditingCollab(null);
        setFormData({
            brand_name: '',
            status: 'outreach',
            deadline: '',
            payment: '',
            deliverables: '',
            notes: '',
        });
        setShowModal(true);
    };

    const openEditModal = (collab) => {
        setEditingCollab(collab);
        setFormData({
            brand_name: collab.brand_name,
            status: collab.status,
            deadline: collab.deadline ? collab.deadline.substring(0, 10) : '',
            payment: collab.payment || '',
            deliverables: collab.deliverables || '',
            notes: collab.notes || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCollab) {
                const response = await axios.patch(`/api/creator/collabs/${editingCollab.id}`, formData);
                setCollabs(prev => prev.map(c => c.id === editingCollab.id ? response.data.collab : c));
            } else {
                const response = await axios.post('/api/creator/collabs', formData);
                setCollabs(prev => [response.data.collab, ...prev]);
            }
            setShowModal(false);
        } catch (err) {
            console.error('Failed to save collab:', err);
        }
    };

    const handleDelete = async (collabId) => {
        if (!confirm('Are you sure you want to delete this collaboration?')) return;

        try {
            await axios.delete(`/api/creator/collabs/${collabId}`);
            setCollabs(prev => prev.filter(c => c.id !== collabId));
        } catch (err) {
            console.error('Failed to delete collab:', err);
        }
    };

    const upcomingDeadlines = collabs
        .filter(c => c.deadline && c.status !== 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);

    const hasData = collabs.length > 0;

    return (
        <JournalLayout
            pageTitle="Creator OS - Collab Notes"
            headerTitle="Collab Notes"
            headerSubtitle="Partnerships & deals"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">group</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Add Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={openAddModal}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-note text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Add Collaboration
                        </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Active Collabs', value: stats.active || 0, icon: 'handshake', bg: 'bg-orange-50' },
                            { label: 'Completed', value: stats.completed || 0, icon: 'task_alt', bg: 'bg-green-50' },
                            { label: 'Pending Revenue', value: '$' + (stats.pendingRevenue || 0).toLocaleString(), icon: 'account_balance_wallet', bg: 'bg-blue-50' },
                            { label: 'Total Earned (YTD)', value: '$' + (stats.totalEarned || 0).toLocaleString(), icon: 'paid', bg: 'bg-amber-50' },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl shadow-notebook border border-gray-100 p-4 relative`}>
                                <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
                                <p className="font-note text-sm text-gray-500 mt-1">{s.label}</p>
                                <p className="font-handwriting text-2xl font-bold text-gray-800">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Collabs List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-handwriting text-3xl font-bold text-gray-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">folder_shared</span>
                                All Collaborations
                            </h3>
                            {hasData ? (
                                collabs.map((c, i) => (
                                    <div key={c.id} className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform">
                                        {i === 0 && <div className="washi-tape -top-2 left-1/3 bg-green-100/80 rotate-1"></div>}
                                        {i === 1 && <div className="washi-tape -top-2 right-8 bg-yellow-100/80 rotate-[-1deg]"></div>}

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-1">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="font-handwriting text-2xl font-bold text-gray-800">{c.brand_name}</h4>
                                                    <span className={`${statusConfig[c.status].color} border text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                                                        {statusConfig[c.status].label}
                                                    </span>
                                                </div>
                                                <p className="font-note text-sm text-gray-500 mt-1">
                                                    <span className="material-symbols-outlined text-sm align-middle mr-1">inventory_2</span>
                                                    {c.deliverables || 'No deliverables set'}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-handwriting text-xl font-bold text-primary">{c.payment || 'TBD'}</p>
                                                <p className="font-note text-xs text-gray-400">
                                                    <span className="material-symbols-outlined text-xs align-middle mr-0.5">calendar_today</span>
                                                    {c.deadline ? new Date(c.deadline).toLocaleDateString() : 'No deadline'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="mt-3 bg-white/50 rounded-xl p-3 border border-dashed border-gray-200">
                                            <p className="font-note text-sm text-gray-600 leading-relaxed">
                                                <span className="material-symbols-outlined text-sm align-middle text-gray-400 mr-1">sticky_note_2</span>
                                                {c.notes || 'No notes added'}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => openEditModal(c)}
                                                className="text-primary font-note text-sm hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="text-red-500 font-note text-sm hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-8 text-center">
                                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">handshake</span>
                                    <h4 className="font-handwriting text-xl text-gray-600 mb-2">No collaborations yet</h4>
                                    <p className="font-note text-sm text-gray-400 mb-4">Start tracking your brand partnerships and collaborations</p>
                                    <button
                                        onClick={openAddModal}
                                        className="bg-primary text-white px-4 py-2 rounded-lg font-note text-sm font-bold hover:bg-primary/90 transition-colors"
                                    >
                                        Add Your First Collab
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Rate Card Sticky Note */}
                            <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[2deg] relative">
                                <div className="washi-tape w-16 h-4 bg-orange-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">sell</span>
                                    My Rate Card
                                </h4>
                                <div className="space-y-2">
                                    {DEFAULT_RATE_CARD.map((r, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-yellow-300/50 pb-1.5">
                                            <span className="font-note text-sm text-gray-700">{r.type}</span>
                                            <span className="font-handwriting text-lg font-bold text-gray-800">{r.rate}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="font-note text-xs text-gray-500 mt-3 italic">*Rates negotiable for long-term partnerships</p>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-5 relative">
                                <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-red-100/70 rotate-[-1deg]"></div>
                                <h4 className="font-handwriting text-xl font-bold text-gray-700 mt-2 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">alarm</span>
                                    Upcoming Deadlines
                                </h4>
                                {upcomingDeadlines.length > 0 ? (
                                    <div className="space-y-3">
                                        {upcomingDeadlines.map((d, i) => (
                                            <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${i < 2 ? 'bg-red-50' : 'bg-white/50'}`}>
                                                <span className={`material-symbols-outlined text-lg mt-0.5 ${i < 2 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {i < 2 ? 'priority_high' : 'radio_button_unchecked'}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-handwriting text-base text-gray-800 truncate">{d.brand_name}</p>
                                                    <div className="flex justify-between items-center mt-0.5">
                                                        <span className="font-note text-xs text-gray-400">{d.deliverables?.substring(0, 20) || 'No deliverables'}...</span>
                                                        <span className={`font-note text-xs font-bold ${i < 2 ? 'text-red-600' : 'text-gray-500'}`}>
                                                            {d.deadline ? new Date(d.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-400">
                                        <span className="material-symbols-outlined text-3xl mb-2">event_available</span>
                                        <p className="font-note text-sm">No upcoming deadlines</p>
                                    </div>
                                )}
                            </div>

                            {/* Outreach Tip */}
                            <div className="bg-orange-100 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-orange-200">
                                <h4 className="font-handwriting text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">tips_and_updates</span>
                                    Outreach Tip
                                </h4>
                                <p className="font-note text-sm text-orange-700 leading-relaxed">
                                    Always follow up within 5-7 days. Brands are busy -- a polite nudge shows professionalism, not desperation!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom motivational note */}
                    <div className="flex justify-center pb-4">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg] max-w-md">
                            <p className="font-handwriting text-xl text-gray-800 text-center leading-relaxed">
                                "Don't be afraid to ask for what you're worth. The right brands will value your creativity."
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-200 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4">
                            {editingCollab ? 'Edit Collaboration' : 'Add New Collaboration'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={formData.brand_name}
                                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                    placeholder="e.g., GlowSkin Co."
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s}>{statusConfig[s].label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Payment</label>
                                <input
                                    type="text"
                                    value={formData.payment}
                                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                                    placeholder="e.g., $1,200"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Deliverables</label>
                                <input
                                    type="text"
                                    value={formData.deliverables}
                                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                                    placeholder="e.g., 1 Reel + 2 Stories"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-note text-sm text-gray-600 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Contact info, requirements, etc."
                                    rows={3}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-note text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-note font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-primary text-white font-note font-medium hover:bg-primary/90 transition-colors"
                                >
                                    {editingCollab ? 'Update' : 'Add'} Collab
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
