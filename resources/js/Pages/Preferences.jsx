import React, { useState } from 'react';
import JournalLayout from '@/Layouts/JournalLayout';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';

function Section({ title, icon, children }) {
    return (
        <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 relative overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-50 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <h3 className="font-handwriting text-2xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function ProfileSection({ user }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Section title="Profile" icon="person">
            <form onSubmit={submit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Nama</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-gray-50 text-gray-400 font-note text-lg cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1 font-note">Email tidak dapat diubah</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    {recentlySuccessful && (
                        <span className="font-note text-green-600 text-sm">Tersimpan!</span>
                    )}
                </div>
            </form>
        </Section>
    );
}

function PasswordSection() {
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <Section title="Ubah Password" icon="lock">
            <form onSubmit={submit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Password Saat Ini</label>
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.current_password} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Password Baru</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                        placeholder="Minimal 8 karakter"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Konfirmasi Password Baru</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                        placeholder="Ulangi password baru"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Ubah Password'}
                    </button>
                    {recentlySuccessful && (
                        <span className="font-note text-green-600 text-sm">Password diubah!</span>
                    )}
                </div>
            </form>
        </Section>
    );
}

function PlanSection({ user }) {
    const planDetails = {
        free: { name: 'Free', price: 'Rp 0', period: 'selamanya' },
        pro: { name: 'Pro', price: 'Rp 49.000', period: 'bulan' },
        team: { name: 'Team', price: 'Rp 199.000', period: 'bulan' },
    };
    const current = planDetails[user.plan] || planDetails.free;

    return (
        <Section title="Plan & Billing" icon="credit_card">
            <div className="flex items-start gap-6 flex-wrap">
                <div className={`flex-1 min-w-[200px] border-2 ${user.plan === 'pro' ? 'border-primary' : user.plan === 'team' ? 'border-blue-500' : 'border-gray-200'} rounded-2xl p-5 bg-white/60`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            user.plan === 'pro' ? 'bg-primary/10 text-primary' : user.plan === 'team' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {current.name}
                        </span>
                        <span className="font-note text-sm text-gray-400">Plan aktif</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-3xl font-bold text-gray-800">{current.price}</span>
                        <span className="text-gray-400 ml-1">/{current.period}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {user.plan !== 'pro' && (
                        <Link href="/checkout/pro" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-center text-sm">
                            Upgrade ke Pro
                        </Link>
                    )}
                    {user.plan !== 'team' && (
                        <Link href="/checkout/team" className="px-5 py-2.5 bg-gray-800 text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-center text-sm">
                            {user.plan === 'pro' ? 'Upgrade ke Team' : 'Coba Team'}
                        </Link>
                    )}
                    {user.plan !== 'free' && (
                        <Link href="/checkout/free" className="px-5 py-2.5 border-2 border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors text-center text-sm">
                            Downgrade ke Free
                        </Link>
                    )}
                </div>
            </div>
        </Section>
    );
}

function AppearanceSection({ user }) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        theme: user.theme || 'pink',
    });

    const themes = [
        { key: 'pink', label: 'Sakura', color: 'bg-pink-500', ring: 'ring-pink-300' },
        { key: 'blue', label: 'Ocean', color: 'bg-blue-500', ring: 'ring-blue-300' },
        { key: 'green', label: 'Forest', color: 'bg-green-500', ring: 'ring-green-300' },
        { key: 'purple', label: 'Lavender', color: 'bg-purple-500', ring: 'ring-purple-300' },
        { key: 'orange', label: 'Sunset', color: 'bg-orange-500', ring: 'ring-orange-300' },
    ];

    const selectTheme = (key) => {
        setData('theme', key);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('preferences.appearance'));
    };

    return (
        <Section title="Appearance" icon="palette">
            <form onSubmit={submit}>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">Tema Warna</label>
                    <div className="flex gap-3">
                        {themes.map((t) => (
                            <button
                                type="button"
                                key={t.key}
                                onClick={() => selectTheme(t.key)}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                                    data.theme === t.key ? 'bg-white shadow-md scale-105' : 'hover:bg-white/60'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full ${t.color} ${data.theme === t.key ? `ring-4 ${t.ring}` : ''}`}></div>
                                <span className="font-note text-xs text-gray-500">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">Mode Tampilan</label>
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-white shadow-md border-2 border-primary">
                            <span className="material-symbols-outlined text-yellow-500">light_mode</span>
                            <div>
                                <p className="font-bold text-sm text-gray-700">Light</p>
                                <p className="font-note text-xs text-gray-400">Terang & bersih</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-white/60 border-2 border-gray-200 opacity-50 cursor-not-allowed">
                            <span className="material-symbols-outlined text-gray-600">dark_mode</span>
                            <div>
                                <p className="font-bold text-sm text-gray-700">Dark</p>
                                <p className="font-note text-xs text-gray-400">Segera hadir</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Tema'}
                    </button>
                    {recentlySuccessful && (
                        <span className="font-note text-green-600 text-sm">Tema disimpan!</span>
                    )}
                </div>
            </form>
        </Section>
    );
}

function JournalSettingsSection({ user }) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        default_mode: user.default_mode || 'life',
        first_day: user.first_day || 'monday',
        language: user.language || 'id',
    });

    const modes = [
        { key: 'life', label: 'Life Mode', icon: 'favorite', color: 'text-pink-400' },
        { key: 'muslim', label: 'Muslim Mode', icon: 'menu_book', color: 'text-green-500' },
        { key: 'work', label: 'Work Mode', icon: 'business_center', color: 'text-purple-400' },
        { key: 'creator', label: 'Creator Mode', icon: 'edit_note', color: 'text-yellow-500' },
    ];

    const submit = (e) => {
        e.preventDefault();
        patch(route('preferences.journal'));
    };

    return (
        <Section title="Journal Settings" icon="tune">
            <form onSubmit={submit} className="space-y-6 max-w-md">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-3">Default Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        {modes.map((m) => (
                            <button
                                type="button"
                                key={m.key}
                                onClick={() => setData('default_mode', m.key)}
                                className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${
                                    data.default_mode === m.key
                                        ? 'bg-white shadow-md border-2 border-primary'
                                        : 'bg-white/60 border-2 border-transparent hover:bg-white/80'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${m.color}`}>{m.icon}</span>
                                <span className="font-note text-sm text-gray-700">{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Hari Pertama Minggu</label>
                    <select
                        value={data.first_day}
                        onChange={(e) => setData('first_day', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                    >
                        <option value="monday">Senin</option>
                        <option value="sunday">Minggu</option>
                        <option value="saturday">Sabtu</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Bahasa</label>
                    <select
                        value={data.language}
                        onChange={(e) => setData('language', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors"
                    >
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                    {recentlySuccessful && (
                        <span className="font-note text-green-600 text-sm">Pengaturan disimpan!</span>
                    )}
                </div>
            </form>
        </Section>
    );
}

function DangerSection() {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { data, setData, delete: destroy, processing, errors } = useForm({
        password: '',
    });

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleDelete = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'));
    };

    return (
        <Section title="Akun" icon="manage_accounts">
            <div className="flex flex-col gap-4 max-w-md">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Keluar dari akun
                </button>

                <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="text-sm text-gray-400 mb-3 font-note">Zona Berbahaya</p>
                    {!confirmDelete ? (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                        >
                            <span className="material-symbols-outlined">delete_forever</span>
                            Hapus Akun
                        </button>
                    ) : (
                        <form onSubmit={handleDelete}>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                                <p className="text-sm text-red-600 font-medium mb-3">Yakin ingin menghapus akun? Masukkan password untuk konfirmasi.</p>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-red-200 bg-white text-gray-700 font-note focus:border-red-400 focus:ring-red-200 focus:ring-2"
                                    placeholder="Password kamu"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">delete_forever</span>
                                    Konfirmasi Hapus
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Section>
    );
}

export default function Preferences() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <JournalLayout
            pageTitle="Mosiku - Preferences"
            headerTitle="Preferences"
            headerSubtitle="Make Mosiku truly yours."
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[100px] text-gray-300 rotate-12">settings</span>}
        >
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <ProfileSection user={user} />
                    <PasswordSection />
                    <PlanSection user={user} />
                    <AppearanceSection user={user} />
                    <JournalSettingsSection user={user} />
                    <DangerSection />
                </div>
            </div>
        </JournalLayout>
    );
}
