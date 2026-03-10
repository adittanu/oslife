import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const STATUS_CONFIG = {
    Signed: 'bg-green-100 text-green-700 border-green-200',
    Sent: 'bg-blue-100 text-blue-700 border-blue-200',
    Draft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Expired: 'bg-gray-100 text-gray-600 border-gray-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Contracts({ contracts: propContracts, clients: propClients }) {
    const [contracts, setContracts] = useState(propContracts || []);
    const [clients, setClients] = useState(propClients || []);
    const [showModal, setShowModal] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [formData, setFormData] = useState({ client_id: '', title: '', content: '', status: 'Draft', signed_date: '', expiry_date: '' });

    useEffect(() => { setContracts(propContracts || []); }, [propContracts]);
    useEffect(() => { setClients(propClients || []); }, [propClients]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContract?.id) {
                const res = await axios.put(`/api/work/contracts/${editingContract.id}`, formData);
                setContracts(contracts.map(c => c.id === editingContract.id ? res.data : c));
            } else {
                const res = await axios.post('/api/work/contracts', formData);
                setContracts([res.data, ...contracts]);
            }
            setShowModal(false);
            setEditingContract(null);
            setFormData({ client_id: '', title: '', content: '', status: 'Draft', signed_date: '', expiry_date: '' });
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this contract?')) return;
        try {
            await axios.delete(`/api/work/contracts/${id}`);
            setContracts(contracts.filter(c => c.id !== id));
        } catch (err) { console.error(err); }
    };

    const openEdit = (contract) => {
        setEditingContract(contract);
        setFormData({ client_id: contract.client_id || '', title: contract.title || '', content: contract.content || '', status: contract.status || 'Draft', signed_date: contract.signed_date || '', expiry_date: contract.expiry_date || '' });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingContract(null);
        setFormData({ client_id: clients[0]?.id || '', title: '', content: '', status: 'Draft', signed_date: '', expiry_date: '' });
        setShowModal(true);
    };

    if (!contracts.length) {
        return (
            <JournalLayout pageTitle="Work OS - Contracts" headerTitle="Contracts" headerSubtitle="Manage client agreements" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="description" title="Belum ada kontrak" description="Buat kontrak pertamamu untuk mulai mengelola agreement" actionLabel="Add Contract" onAction={openAdd} />
                    </div>
                </div>
                {showModal && <ContractModal formData={formData} setFormData={setFormData} clients={clients} handleSubmit={handleSubmit} editingContract={editingContract} setShowModal={setShowModal} />}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Contracts" headerTitle="Contracts" headerSubtitle="Manage client agreements" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">description</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="relative bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-purple-100/80 rotate-1"></div>
                        <div className="flex justify-between items-center mt-2">
                            <div><h3 className="font-handwriting text-2xl font-bold text-gray-700">All Contracts</h3><p className="font-note text-sm text-gray-400">{contracts.length} total</p></div>
                            <button onClick={openAdd} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl"><span className="material-symbols-outlined text-[18px]">add</span> Add Contract</button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {contracts.map((contract, idx) => (
                            <div key={contract.id || idx} className="bg-page-bg shadow-notebook rounded-xl border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-handwriting text-xl font-bold text-gray-800">{contract.title}</h4>
                                            <span className={`${STATUS_CONFIG[contract.status]} border text-xs font-bold px-2.5 py-0.5 rounded-full`}>{contract.status}</span>
                                        </div>
                                        <p className="font-note text-sm text-gray-500">{contract.client?.name || '-'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(contract)} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                        <button onClick={() => handleDelete(contract.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-6 text-sm text-gray-500">
                                    <span>Signed: {formatDate(contract.signed_date)}</span>
                                    <span>Expires: {formatDate(contract.expiry_date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && <ContractModal formData={formData} setFormData={setFormData} clients={clients} handleSubmit={handleSubmit} editingContract={editingContract} setShowModal={setShowModal} />}
        </JournalLayout>
    );
}

function ContractModal({ formData, setFormData, clients, handleSubmit, editingContract, setShowModal }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="font-handwriting text-xl font-bold mb-4">{editingContract ? 'Edit Contract' : 'Add Contract'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required>
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="text" placeholder="Contract Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" required />
                    <textarea placeholder="Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" rows={4} />
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Signed">Signed</option>
                        <option value="Expired">Expired</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={formData.signed_date} onChange={e => setFormData({...formData, signed_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" />
                        <input type="date" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl">{editingContract ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}