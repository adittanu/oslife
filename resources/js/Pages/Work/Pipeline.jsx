import React, { useState, useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const STATUS_CONFIG = {
    'Active': { title: 'In Progress', icon: 'autorenew', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-400', headerBg: 'bg-blue-100', headerText: 'text-blue-800', iconColor: 'text-blue-600' },
    'On Hold': { title: 'On Hold', icon: 'pause_circle', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', headerBg: 'bg-amber-100', headerText: 'text-amber-800', iconColor: 'text-amber-600' },
    'Completed': { title: 'Completed', icon: 'check_circle', color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-400', headerBg: 'bg-emerald-100', headerText: 'text-emerald-800', iconColor: 'text-emerald-600' },
    'Cancelled': { title: 'Cancelled', icon: 'cancel', color: 'gray', bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-400', headerBg: 'bg-gray-100', headerText: 'text-gray-800', iconColor: 'text-gray-600' },
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Pipeline({ projects: propProjects, clients: propClients }) {
    const [projects, setProjects] = useState(propProjects || []);
    const [clients, setClients] = useState(propClients || []);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({ client_id: '', name: '', description: '', status: 'Active', budget: '', deadline: '' });

    useEffect(() => { setProjects(propProjects || []); }, [propProjects]);
    useEffect(() => { setClients(propClients || []); }, [propClients]);

    const { totalBudget, columns } = useMemo(() => {
        const grouped = { 'Active': [], 'On Hold': [], 'Completed': [], 'Cancelled': [] };
        projects.forEach(p => { if (grouped[p.status]) grouped[p.status].push(p); });
        const total = projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);
        return { totalBudget: formatCurrency(total), columns: grouped };
    }, [projects]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject?.id) {
                const res = await axios.put(`/api/work/projects/${editingProject.id}`, formData);
                setProjects(projects.map(p => p.id === editingProject.id ? res.data : p));
            } else {
                const res = await axios.post('/api/work/projects', formData);
                setProjects([res.data, ...projects]);
            }
            setShowModal(false);
            setEditingProject(null);
            setFormData({ client_id: '', name: '', description: '', status: 'Active', budget: '', deadline: '' });
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            await axios.delete(`/api/work/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) { console.error(err); }
    };

    const openEdit = (project) => {
        setEditingProject(project);
        setFormData({ client_id: project.client_id || '', name: project.name || '', description: project.description || '', status: project.status || 'Active', budget: project.budget || '', deadline: project.deadline || '' });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingProject(null);
        setFormData({ client_id: clients[0]?.id || '', name: '', description: '', status: 'Active', budget: '', deadline: '' });
        setShowModal(true);
    };

    if (!projects.length) {
        return (
            <JournalLayout pageTitle="Work OS - Pipeline" headerTitle="Project Pipeline" headerSubtitle="Track your project flow" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">view_kanban</span>}>
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <WorkEmptyState icon="view_kanban" title="Belum ada proyek" description="Tambahkan proyek pertama untuk memulai pipeline-mu" actionLabel="Add Project" onAction={openAdd} />
                    </div>
                </div>
                {showModal && <ProjectModal formData={formData} setFormData={setFormData} clients={clients} handleSubmit={handleSubmit} editingProject={editingProject} setShowModal={setShowModal} />}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Pipeline" headerTitle="Project Pipeline" headerSubtitle="Track your project flow" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">view_kanban</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="absolute bottom-20 left-10 opacity-10 pointer-events-none rotate-[-15deg]"><span className="material-symbols-outlined text-[80px] text-primary">assignment</span></div>
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <div><h3 className="font-handwriting text-2xl font-bold text-gray-700">Pipeline Overview</h3><p className="font-note text-sm text-gray-400">Kelola proyek-proyekmu</p></div>
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2 text-center"><p className="font-note text-xs text-gray-500">Total Projects</p><p className="font-handwriting text-xl font-bold text-purple-700">{projects.length}</p></div>
                                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-center"><p className="font-note text-xs text-gray-500">Total Value</p><p className="font-handwriting text-xl font-bold text-green-700">{totalBudget}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {Object.entries(columns).map(([status, items], colIdx) => {
                            const config = STATUS_CONFIG[status] || STATUS_CONFIG['Active'];
                            const tapeRotations = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]', 'rotate-[2deg]'];
                            return (
                                <div key={status} className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-5">
                                    <div className={`washi-tape -top-2 left-8 ${config.headerBg}/80 ${tapeRotations[colIdx % 4]}`}></div>
                                    <div className={`flex items-center gap-3 mb-5 mt-2 ${config.headerBg} rounded-xl p-3`}>
                                        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center"><span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span></div>
                                        <div className="flex-1"><h4 className={`font-handwriting text-xl font-bold ${config.headerText}`}>{config.title}</h4></div>
                                        <span className={`${config.badge} font-bold text-sm px-2.5 py-0.5 rounded-full`}>{items.length}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {items.map((item, idx) => (
                                            <div key={item.id || idx} className={`${config.bg} rounded-xl p-4 border ${config.border} shadow-sm hover:shadow-md transition-shadow`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <h5 className="font-handwriting text-lg font-bold text-gray-800 leading-tight">{item.name}</h5>
                                                    <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-3"><span className="material-symbols-outlined text-sm text-gray-400">person</span><span className="font-note text-sm text-gray-500">{item.client?.name || '-'}</span></div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-gray-400">payments</span><span className="font-handwriting text-base font-bold text-gray-700">{formatCurrency(item.budget)}</span></div>
                                                    <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-gray-400">event</span><span className="font-note text-xs text-gray-500">{formatDate(item.deadline)}</span></div>
                                                </div>
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200/50">
                                                    <button onClick={() => handleDelete(item.id)} className="flex-1 text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={openAdd} className={`w-full mt-4 py-2.5 border-2 border-dashed ${config.border} rounded-xl text-sm font-bold ${config.headerText} opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5`}>
                                        <span className="material-symbols-outlined text-sm">add</span> Add Project
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {showModal && <ProjectModal formData={formData} setFormData={setFormData} clients={clients} handleSubmit={handleSubmit} editingProject={editingProject} setShowModal={setShowModal} />}
        </JournalLayout>
    );
}

function ProjectModal({ formData, setFormData, clients, handleSubmit, editingProject, setShowModal }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="font-handwriting text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required>
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.company}</option>)}
                    </select>
                    <input type="text" placeholder="Project Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" rows={2} />
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                        <option value="Active">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <input type="number" placeholder="Budget (USD)" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" step="0.01" />
                    <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">{editingProject ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}