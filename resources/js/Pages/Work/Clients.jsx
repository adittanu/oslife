import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const STATUS_CONFIG = {
    Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Lead: 'bg-amber-100 text-amber-700 border-amber-200',
    Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
};

const AVATAR_COLORS = [
    'bg-blue-200 text-blue-800',
    'bg-emerald-200 text-emerald-800',
    'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800',
    'bg-amber-200 text-amber-800',
    'bg-orange-200 text-orange-800',
];

export default function Clients({ clients: propClients }) {
    const { auth } = usePage().props;
    const isAuth = !!auth?.user;

    const [clients, setClients] = useState(propClients || []);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'Lead',
        notes: '',
        avatar_color: 'bg-blue-200'
    });

    useEffect(() => {
        setClients(propClients || []);
    }, [propClients]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient?.id) {
                const res = await axios.put(`/api/work/clients/${editingClient.id}`, formData);
                setClients(clients.map(c => c.id === editingClient.id ? res.data : c));
            } else {
                const res = await axios.post('/api/work/clients', formData);
                setClients([res.data, ...clients]);
            }
            setShowModal(false);
            setEditingClient(null);
            setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead', notes: '', avatar_color: 'bg-blue-200' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this client?')) return;
        try {
            await axios.delete(`/api/work/clients/${id}`);
            setClients(clients.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            company: client.company || '',
            email: client.email || '',
            phone: client.phone || '',
            status: client.status,
            notes: client.notes || '',
            avatar_color: client.avatar_color || 'bg-blue-200'
        });
        setShowModal(true);
    };

    const statusCounts = {
        Active: clients.filter(c => c.status === 'Active').length,
        Lead: clients.filter(c => c.status === 'Lead').length,
        Inactive: clients.filter(c => c.status === 'Inactive').length,
    };

    const openAdd = () => {
        setEditingClient(null);
        setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead', notes: '', avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] });
        setShowModal(true);
    };

    // Empty state
    if (!clients.length) {
        return (
            <JournalLayout
                pageTitle="Work OS - Clients"
                headerTitle="Client Tracker"
                headerSubtitle="Manage your relationships"
                titleFontClass="font-handwriting"
                bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">people</span>}
            >
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState
                            icon="people"
                            title="Belum ada klien"
                            description="Tambahkan klien pertama untuk memulai workflow freelancer-mu"
                            actionLabel="Add Client"
                            onAction={openAdd}
                        />
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                            <h3 className="font-handwriting text-xl font-bold mb-4">{editingClient ? 'Edit Client' : 'Add Client'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={formData.company}
                                    onChange={e => setFormData({...formData, company: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="Lead">Lead</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <textarea
                                    placeholder="Notes"
                                    value={formData.notes}
                                    onChange={e => setFormData({...formData, notes: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        {editingClient ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout
            pageTitle="Work OS - Clients"
            headerTitle="Client Tracker"
            headerSubtitle="Manage your relationships"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">people</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]">
                    <span className="material-symbols-outlined text-[80px] text-primary">contacts</span>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header Section with Stats and Add Button */}
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 md:p-8">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-100/80 rotate-1"></div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-handwriting text-2xl font-bold text-gray-700">All Clients</h3>
                                <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">
                                    {clients.length} total
                                </span>
                            </div>
                            <button onClick={openAdd} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">person_add</span> Add Client
                            </button>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <span key={status} className={`${STATUS_CONFIG[status]} border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                                    <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                                    {status}: {count}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Client Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {clients.map((client, idx) => {
                            const tapeColors = ['bg-blue-100/80', 'bg-green-100/80', 'bg-purple-100/80', 'bg-pink-100/80', 'bg-amber-100/80', 'bg-orange-100/80', 'bg-gray-100/80'];
                            const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[0deg]'];
                            return (
                                <div key={client.id || idx} className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6 paper-lines hover:shadow-lg transition-shadow">
                                    <div className={`washi-tape -top-2 left-8 ${tapeColors[idx % tapeColors.length]} ${rotations[idx % rotations.length]}`}></div>

                                    <div className="flex items-start gap-4 mt-2">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 rounded-full ${client.avatar_color || AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center font-handwriting text-xl font-bold flex-shrink-0 shadow-sm`}>
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-handwriting text-xl font-bold text-gray-800">{client.name}</h4>
                                                <span className={`${STATUS_CONFIG[client.status]} border text-xs font-bold px-2 py-0.5 rounded-full`}>
                                                    {client.status}
                                                </span>
                                            </div>
                                            <p className="font-note text-sm text-gray-500 mt-0.5">{client.company}</p>

                                            <div className="mt-3 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-gray-400">mail</span>
                                                    <span className="font-note text-sm text-gray-600 truncate">{client.email}</span>
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm text-gray-400">phone</span>
                                                        <span className="font-note text-sm text-gray-600">{client.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <button onClick={() => openEdit(client)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary bg-gray-50 hover:bg-primary/5 py-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit</span> Edit
                                        </button>
                                        <button onClick={() => handleDelete(client.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50 py-2 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Motivational sticky note */}
                    <div className="flex justify-center pb-8">
                        <div className="bg-sticky-yellow p-6 shadow-sticky w-72 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                            <div className="absolute -top-3 left-[40%] w-14 h-4 bg-gray-200/50 rotate-[1deg] z-20 rounded-sm shadow-sm"></div>
                            <p className="font-handwriting text-xl text-gray-800 leading-snug text-center">
                                "Your network is your net worth."
                            </p>
                            <p className="font-note text-sm text-gray-500 text-center mt-2">
                                - Porter Gale
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-handwriting text-xl font-bold mb-4">{editingClient ? 'Edit Client' : 'Add Client'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            <select
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="Lead">Lead</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <textarea
                                placeholder="Notes"
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                rows={3}
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                    {editingClient ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}