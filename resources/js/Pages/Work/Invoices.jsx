import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const STATUS_CONFIG = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const STATUS_ICON = {
    Paid: 'check_circle',
    Pending: 'schedule',
    Overdue: 'error',
    Cancelled: 'cancel',
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateInvoiceNumber() {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `INV-${num}`;
}

export default function Invoices({ invoices: propInvoices, clients: propClients, projects: propProjects }) {
    const [invoices, setInvoices] = useState(propInvoices || []);
    const [clients, setClients] = useState(propClients || []);
    const [projects, setProjects] = useState(propProjects || []);
    const [showModal, setShowModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [formData, setFormData] = useState({
        client_id: '',
        invoice_number: '',
        amount: '',
        status: 'Pending',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        description: '',
        project_id: '',
        paid_date: '',
    });

    useEffect(() => { setInvoices(propInvoices || []); }, [propInvoices]);
    useEffect(() => { setClients(propClients || []); }, [propClients]);
    useEffect(() => { setProjects(propProjects || []); }, [propProjects]);

    const summary = useMemo(() => {
        const totalOutstanding = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        const thisMonth = new Date().toISOString().slice(0, 7);
        const paidThisMonth = invoices.filter(i => i.status === 'Paid' && i.paid_date?.startsWith(thisMonth)).reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        const overdue = invoices.filter(i => i.status === 'Overdue' || (i.status === 'Pending' && new Date(i.due_date) < new Date())).length;
        return {
            totalOutstanding: formatCurrency(totalOutstanding),
            paidThisMonth: formatCurrency(paidThisMonth),
            overdue,
            total: invoices.length
        };
    }, [invoices]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInvoice?.id) {
                const res = await axios.put(`/api/work/invoices/${editingInvoice.id}`, {
                    ...formData,
                    project_id: formData.project_id || null,
                    paid_date: formData.paid_date || null,
                });
                setInvoices(invoices.map(i => i.id === editingInvoice.id ? res.data : i));
            } else {
                const res = await axios.post('/api/work/invoices', {
                    ...formData,
                    project_id: formData.project_id || null,
                    paid_date: formData.paid_date || null,
                });
                setInvoices([res.data, ...invoices]);
            }
            setShowModal(false);
            setEditingInvoice(null);
            setFormData({ client_id: '', invoice_number: generateInvoiceNumber(), amount: '', status: 'Pending', issue_date: new Date().toISOString().split('T')[0], due_date: '', description: '', project_id: '', paid_date: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this invoice?')) return;
        try {
            await axios.delete(`/api/work/invoices/${id}`);
            setInvoices(invoices.filter(i => i.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const markAsPaid = async (invoice) => {
        try {
            const res = await axios.put(`/api/work/invoices/${invoice.id}`, { status: 'Paid', paid_date: new Date().toISOString().split('T')[0] });
            setInvoices(invoices.map(i => i.id === invoice.id ? res.data : i));
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            client_id: invoice.client_id || '',
            invoice_number: invoice.invoice_number || '',
            amount: invoice.amount || '',
            status: invoice.status || 'Pending',
            issue_date: invoice.issue_date ? String(invoice.issue_date).slice(0, 10) : '',
            due_date: invoice.due_date ? String(invoice.due_date).slice(0, 10) : '',
            description: invoice.description || '',
            project_id: invoice.project_id || '',
            paid_date: invoice.paid_date ? String(invoice.paid_date).slice(0, 10) : '',
        });
        setShowModal(true);
    };

    const openAdd = () => {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setEditingInvoice(null);
        setFormData({ client_id: clients[0]?.id || '', invoice_number: generateInvoiceNumber(), amount: '', status: 'Pending', issue_date: new Date().toISOString().split('T')[0], due_date: nextMonth.toISOString().split('T')[0], description: '', project_id: '', paid_date: '' });
        setShowModal(true);
    };

    const summaryData = [
        { label: 'Total Outstanding', value: summary.totalOutstanding, icon: 'pending_actions', bg: 'bg-yellow-50', color: 'text-yellow-700' },
        { label: 'Paid This Month', value: summary.paidThisMonth, icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-700' },
        { label: 'Overdue', value: summary.overdue.toString(), icon: 'warning', bg: 'bg-red-50', color: 'text-red-700' },
        { label: 'Total Invoices', value: summary.total.toString(), icon: 'receipt_long', bg: 'bg-blue-50', color: 'text-blue-700' },
    ];

    if (!invoices.length) {
        return (
            <JournalLayout pageTitle="Work OS - Invoices" headerTitle="Invoices" headerSubtitle="Track payments & billing" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="receipt_long" title="Belum ada invoice" description="Buat invoice pertamamu untuk mulai melacak pembayaran" actionLabel="Create Invoice" onAction={openAdd} />
                    </div>
                </div>
                {showModal && <InvoiceModal formData={formData} setFormData={setFormData} clients={clients} projects={projects} handleSubmit={handleSubmit} editingInvoice={editingInvoice} setShowModal={setShowModal} />}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Invoices" headerTitle="Invoices" headerSubtitle="Track payments & billing" titleFontClass="font-handwriting" bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">receipt_long</span>}>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryData.map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl shadow-notebook border border-gray-100 p-5 relative overflow-hidden hover:-translate-y-1 transition-transform`}>
                                <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-[48px] text-gray-800">{s.icon}</span></div>
                                <p className="font-note text-sm text-gray-500">{s.label}</p>
                                <p className={`font-handwriting text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 p-6 relative">
                        <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-blue-100/80 rotate-1"></div>
                        <div className="flex justify-between items-center mt-2 mb-6">
                            <h3 className="font-handwriting text-2xl font-bold text-gray-700">Invoice Log</h3>
                            <button onClick={openAdd} className="flex items-center gap-2 bg-primary/90 text-white font-note text-sm px-4 py-2 rounded-xl shadow hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span> Create Invoice
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-note text-gray-700">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 text-gray-500 text-sm">
                                        <th className="py-3 px-2">Invoice #</th>
                                        <th className="py-3 px-2">Client</th>
                                        <th className="py-3 px-2">Amount</th>
                                        <th className="py-3 px-2">Date</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv, i) => (
                                        <tr key={inv.id || i} className="border-b border-gray-100 hover:bg-white/60 transition-colors">
                                            <td className="py-4 px-2"><span className="font-handwriting text-lg font-bold text-primary">{inv.invoice_number}</span></td>
                                            <td className="py-4 px-2">
                                                <div>
                                                    <span className="font-handwriting text-lg text-gray-800">{inv.client?.name || '-'}</span>
                                                    {inv.project?.name && <p className="font-note text-xs text-gray-400 mt-1">{inv.project.name}</p>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2"><span className="font-handwriting text-lg font-bold text-gray-800">{formatCurrency(inv.amount)}</span></td>
                                            <td className="py-4 px-2"><span className="font-note text-sm text-gray-500">{formatDate(inv.issue_date)}</span></td>
                                            <td className="py-4 px-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${STATUS_CONFIG[inv.status]}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{STATUS_ICON[inv.status]}</span>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                {inv.status !== 'Paid' && <button onClick={() => markAsPaid(inv)} className="text-green-500 hover:text-green-700 transition-colors" title="Mark as Paid"><span className="material-symbols-outlined text-[20px]">check_circle</span></button>}
                                                <button onClick={() => openEdit(inv)} className="text-gray-400 hover:text-primary transition-colors ml-2"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                                <button onClick={() => handleDelete(inv.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[1deg] relative">
                            <div className="washi-tape w-16 h-4 bg-pink-200/60 rotate-[-5deg] -top-2 left-1/2 -translate-x-1/2"></div>
                            <h4 className="font-handwriting text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">tips_and_updates</span>Reminder</h4>
                            <p className="font-note text-sm text-gray-600 leading-relaxed">Klik tombol centang untuk menandai invoice sebagai lunas.</p>
                        </div>
                        <div className="bg-blue-50 p-5 rounded-xl shadow-notebook rotate-[-1deg] border border-blue-100">
                            <h4 className="font-handwriting text-lg font-bold text-blue-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-blue-600">trending_up</span>This Month</h4>
                            <p className="font-note text-sm text-gray-600">{summary.total} invoices sent</p>
                            <p className="font-note text-sm text-green-600 font-bold mt-2">Total: {formatCurrency(invoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0))}</p>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <InvoiceModal formData={formData} setFormData={setFormData} clients={clients} projects={projects} handleSubmit={handleSubmit} editingInvoice={editingInvoice} setShowModal={setShowModal} />}
        </JournalLayout>
    );
}

function InvoiceModal({ formData, setFormData, clients, projects, handleSubmit, editingInvoice, setShowModal }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="font-handwriting text-xl font-bold mb-4">{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required>
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.company}</option>)}
                    </select>
                    <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                        <option value="">Link to Project (Optional)</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="text" placeholder="Invoice Number" value={formData.invoice_number} onChange={e => setFormData({...formData, invoice_number: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                    <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" step="0.01" required />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-note text-sm text-gray-500">Issue Date</label>
                            <input type="date" value={formData.issue_date} onChange={e => setFormData({...formData, issue_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                        </div>
                        <div>
                            <label className="font-note text-sm text-gray-500">Due Date</label>
                            <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
                        </div>
                    </div>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {formData.status === 'Paid' && (
                        <div>
                            <label className="font-note text-sm text-gray-500">Paid Date</label>
                            <input type="date" value={formData.paid_date} onChange={e => setFormData({...formData, paid_date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        </div>
                    )}
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" rows={3} />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">{editingInvoice ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
