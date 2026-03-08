import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import ThemeProvider from '@/Components/ThemeProvider';

export default function Checkout({ plan, user }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(`/checkout/${plan.slug}`);
    };

    const colorMap = {
        free: { accent: 'bg-gray-200/80', badge: 'bg-gray-500', check: 'text-green-500' },
        pro: { accent: 'bg-pink-200/60', badge: 'bg-primary', check: 'text-primary' },
        team: { accent: 'bg-blue-100/80', badge: 'bg-gray-800', check: 'text-blue-500' },
    };
    const colors = colorMap[plan.slug] || colorMap.free;

    return (
        <ThemeProvider>
            <Head title={`Checkout — ${plan.name}`} />
            <div className="min-h-screen bg-journal-bg paper-texture flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    {/* Back link */}
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 font-medium text-sm">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Kembali ke beranda
                    </Link>

                    {/* Simulation banner */}
                    <div className="bg-sticky-yellow border-2 border-yellow-300 border-dashed rounded-2xl px-5 py-4 mb-6 rotate-[-0.5deg] shadow-sticky">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-600 text-2xl mt-0.5">science</span>
                            <div>
                                <p className="font-bold text-yellow-800 text-sm">Mode Simulasi</p>
                                <p className="text-yellow-700 text-sm font-note mt-0.5">
                                    Ini adalah simulasi pembayaran. Tidak ada uang yang dicharge — klik bayar untuk langsung mengaktifkan paket.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Checkout card */}
                    <div className="bg-page-bg rounded-2xl shadow-notebook border border-gray-100 relative overflow-hidden">
                        <div className={`washi-tape-accent -top-2 left-1/2 -translate-x-1/2 ${colors.accent} w-28 rotate-1`}></div>

                        <div className="px-8 py-10 pt-12">
                            {/* Plan header */}
                            <div className="text-center mb-8">
                                <span className={`inline-block ${colors.badge} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3`}>
                                    Paket {plan.name}
                                </span>
                                <div className="mt-2">
                                    <span className="text-4xl font-bold text-gray-800">{plan.priceLabel}</span>
                                    <span className="text-gray-400 ml-1">/{plan.period}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-dashed border-orange-100 my-6"></div>

                            {/* Features */}
                            <div className="mb-8">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Yang kamu dapatkan</p>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${colors.check}`}>check_circle</span>
                                            <span className="font-note text-lg text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-dashed border-orange-100 my-6"></div>

                            {/* User info */}
                            {user && (
                                <div className="mb-6 bg-white/60 rounded-xl px-4 py-3 border border-orange-50">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Akun</p>
                                    <p className="font-semibold text-gray-700">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            )}

                            {/* Simulated payment method */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Metode Pembayaran</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/80 border-2 border-primary rounded-xl px-3 py-2.5 text-center cursor-pointer">
                                        <span className="text-xs font-bold text-primary">QRIS</span>
                                    </div>
                                    <div className="bg-white/80 border-2 border-orange-100 rounded-xl px-3 py-2.5 text-center cursor-pointer hover:border-primary/50 transition-colors">
                                        <span className="text-xs font-bold text-gray-500">Transfer</span>
                                    </div>
                                    <div className="bg-white/80 border-2 border-orange-100 rounded-xl px-3 py-2.5 text-center cursor-pointer hover:border-primary/50 transition-colors">
                                        <span className="text-xs font-bold text-gray-500">E-Wallet</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pay button */}
                            <form onSubmit={submit}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full washi-tape-btn text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : `Bayar ${plan.priceLabel}`}
                                </button>
                            </form>

                            <p className="text-center mt-4 text-xs text-gray-400 font-medium flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                Simulasi — tidak ada transaksi nyata
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
