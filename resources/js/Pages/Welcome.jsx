import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const modeData = [
    { name: 'Life', icon: 'favorite', color: 'pink', tape: 'bg-pink-200/80', rotate: 'rotate-[-1deg]', pages: 12, tagline: 'Organize your daily life', features: ['Daily Spread', 'Calendar', 'Task Log', 'Habit Tracker', 'Notes', 'Finances', 'Idea Dump', 'Gratitude', 'Mood Tracker', 'Goals', 'Focus Timer', 'Weekly Review'] },
    { name: 'Muslim', icon: 'mosque', color: 'green', tape: 'bg-green-200/80', rotate: 'rotate-[2deg]', pages: 12, tagline: 'Ibadah tracker lengkap', features: ['Daily Spread Islami', 'Islamic Calendar', 'Sholat Tracker', "Al-Qur'an Journal", 'Dzikir Counter', 'Doa Collection', 'Kajian Notes', 'Muhasabah', 'Sedekah Tracker', 'Ramadan Planner', 'Habit Islami', 'Weekly Muhasabah'] },
    { name: 'Creator', icon: 'edit_note', color: 'orange', tape: 'bg-orange-200/80', rotate: 'rotate-[1deg]', pages: 6, tagline: 'Content creation toolkit', features: ['Content Calendar', 'Content Ideas', 'Script Writer', 'Analytics', 'Brand Kit', 'Collab Notes'] },
    { name: 'Work', icon: 'business_center', color: 'blue', tape: 'bg-blue-200/80', rotate: 'rotate-[-2deg]', pages: 8, tagline: 'Freelancer management', features: ['Dashboard', 'Client Tracker', 'Project Pipeline', 'Time Tracking', 'Invoice Log', 'Income Tracker', 'Meeting Notes', 'Contract Templates'] },
];

function ModeModal({ mode, onClose, auth }) {
    if (!mode) return null;
    const iconColors = { pink: 'text-pink-500', green: 'text-green-500', orange: 'text-orange-500', blue: 'text-blue-500' };
    const bgColors = { pink: 'bg-pink-50', green: 'bg-green-50', orange: 'bg-orange-50', blue: 'bg-blue-50' };
    const borderColors = { pink: 'border-pink-200', green: 'border-green-200', orange: 'border-orange-200', blue: 'border-blue-200' };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-[fadeIn_0.2s]" onClick={onClose} />
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4" onClick={onClose}>
                <div
                    className="bg-[#FFF8F0] rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-[scaleIn_0.3s_ease-out]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`relative ${bgColors[mode.color]} p-8 pb-6 border-b ${borderColors[mode.color]}`}>
                        <div className={`washi-tape -top-2 left-1/2 -translate-x-1/2 ${mode.tape} rotate-1`}></div>
                        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
                        </button>
                        <div className="flex items-center gap-4 mt-2">
                            <div className={`w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm ${mode.rotate}`}>
                                <span className={`material-symbols-outlined text-4xl ${iconColors[mode.color]}`}>{mode.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-handwriting text-3xl font-bold text-gray-800">{mode.name} Mode</h3>
                                <p className="font-note text-gray-500">{mode.tagline}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features grid */}
                    <div className="p-6">
                        <p className="font-handwriting text-lg font-bold text-gray-600 mb-4">{mode.pages} halaman tersedia:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {mode.features.map((f, i) => (
                                <div key={f} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-100 shadow-sm"
                                     style={{ animationDelay: `${i * 50}ms`, animation: 'fadeSlideUp 0.3s ease-out both' }}>
                                    <span className={`material-symbols-outlined text-sm ${iconColors[mode.color]}`}>check_circle</span>
                                    <span className="font-note text-sm text-gray-700">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="px-6 pb-6">
                        <Link
                            href={auth?.user ? '/' : '/register'}
                            className={`block w-full py-3.5 rounded-xl font-bold text-center text-white shadow-md transition-opacity hover:opacity-90 ${
                                mode.color === 'pink' ? 'bg-pink-500' : mode.color === 'green' ? 'bg-green-500' : mode.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}
                        >
                            {auth?.user ? 'Mulai Sekarang' : 'Daftar & Coba ' + mode.name + ' Mode'}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Welcome({ auth }) {
    const [activeMode, setActiveMode] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    return (
        <>
            <Head>
                <title>Mosiku - Semua Hidupmu, Satu Catatan</title>
                <meta name="description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode: Life, Muslim, Creator, Work dalam satu platform." />
                <meta property="og:title" content="Mosiku - Semua Hidupmu, Satu Catatan" />
                <meta property="og:description" content="All-in-one life management system dengan estetika digital bullet journal. 4 Mode dalam satu platform." />
                <meta property="og:url" content="https://mosiku.app" />
                <link rel="canonical" href="https://mosiku.app" />
            </Head>
            <div className="bg-journal-bg paper-texture text-text-journal font-display scroll-smooth overflow-x-hidden">
                <nav className="fixed top-0 w-full z-50 bg-journal-bg/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/images/ciku-default.svg" alt="Mosiku" className="h-10 w-10 rotate-3 drop-shadow-md" />
                        <span className="text-primary text-2xl font-handwriting font-bold">Mosiku</span>
                    </div>

                    <div className="hidden md:flex gap-8 font-semibold text-gray-600">
                        <a className="hover:text-primary transition-colors" href="#modes">Modes</a>
                        <a className="hover:text-primary transition-colors" href="#features">Fitur</a>
                        <a className="hover:text-primary transition-colors" href="#pricing">Pricing</a>
                    </div>

                    <Link href={auth?.user ? "/daily-spread" : "/login"} className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold hover:bg-primary/20 transition-all">
                        {auth?.user ? 'Dashboard' : 'Login'}
                    </Link>
                </nav>

                <main>
                    {/* Hero */}
                    <section className="pt-32 pb-20 px-6 relative overflow-hidden min-h-screen flex items-center justify-center">
                        <motion.div
                            className="absolute top-20 left-10 opacity-20 pointer-events-none rotate-[-15deg]"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <span className="material-symbols-outlined text-[120px] text-green-400">potted_plant</span>
                        </motion.div>
                        <motion.div
                            className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <span className="material-symbols-outlined text-[100px] text-blue-300">water_bottle</span>
                        </motion.div>
                        <motion.div
                            className="absolute bottom-20 left-1/4 opacity-10 pointer-events-none rotate-[25deg]"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <span className="material-symbols-outlined text-[80px] text-pink-300">auto_stories</span>
                        </motion.div>

                        <div className="max-w-4xl mx-auto text-center relative z-10">
                            <motion.div
                                className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                4 Modes — 1 App — Unlimited Possibilities
                            </motion.div>
                            <motion.h1
                                className="text-5xl md:text-8xl font-elegant text-gray-800 mb-8 leading-tight"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                            >
                                Organize Your<br />Entire Life
                            </motion.h1>
                            <motion.p
                                className="text-xl md:text-2xl font-note text-gray-500 mb-12 max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                            >
                                All-in-one life management system dengan estetika digital bullet journal. Life, Muslim, Creator, dan Work mode dalam satu platform.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
                            >
                                <Link href={auth?.user ? "/daily-spread" : "/register"} className="washi-tape-btn text-xl">
                                    {auth?.user ? 'Go to Dashboard' : 'Daftar Sekarang'}
                                </Link>
                                <a href="#modes" className="text-gray-500 font-bold hover:text-primary transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined">play_circle</span> Lihat Semua Mode
                                </a>
                            </motion.div>
                            <motion.p
                                className="text-sm font-handwriting text-gray-400 mt-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
                            >
                                Mulai gratis hari ini. Tanpa kartu kredit.
                            </motion.p>
                        </div>
                    </section>

                    {/* Modes */}
                    <section className="py-20 px-6 bg-white/30" id="modes">
                        <motion.div
                            className="max-w-7xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-16" variants={itemVariants}>
                                <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-gray-700">4 Mode, 1 Aplikasi</h2>
                                <p className="font-note text-gray-500 mt-3 text-lg">Pilih mode sesuai kebutuhanmu — setiap mode mengubah seluruh tampilan dan fitur.</p>
                                <div className="h-1 w-24 bg-pink-200 mx-auto mt-4 rounded-full"></div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {modeData.map((mode) => {
                                    const iconColors = { pink: 'text-pink-500', green: 'text-green-500', orange: 'text-orange-500', blue: 'text-blue-500' };
                                    return (
                                        <motion.button
                                            key={mode.name}
                                            onClick={() => setActiveMode(mode)}
                                            className="group cursor-pointer text-left"
                                            variants={itemVariants}
                                        >
                                            <div className={`relative bg-page-bg rounded-2xl shadow-notebook p-6 border border-gray-100 transition-all group-hover:-translate-y-2 group-hover:shadow-lg ${mode.rotate}`}>
                                                <div className={`washi-tape -top-2 left-6 ${mode.tape} rotate-2`}></div>
                                                <div className="mt-2 mb-4">
                                                    <span className={`material-symbols-outlined text-4xl ${iconColors[mode.color]}`}>{mode.icon}</span>
                                                </div>
                                                <h3 className="text-2xl font-handwriting font-bold text-gray-800">{mode.name} Mode</h3>
                                                <p className="text-sm font-note text-gray-400 mt-1 mb-4">{mode.tagline}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-handwriting text-sm font-bold text-gray-500">{mode.pages} pages</span>
                                                    <span className={`material-symbols-outlined text-lg ${iconColors[mode.color]} group-hover:translate-x-1 transition-transform`}>arrow_forward</span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </section>

                    {/* How It Works */}
                    <section className="py-20 px-6">
                        <motion.div
                            className="max-w-4xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-16" variants={itemVariants}>
                                <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Cara Kerjanya</h2>
                                <p className="font-note text-gray-500 mt-3 text-lg">Mulai dalam 3 langkah sederhana</p>
                            </motion.div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[
                                    { step: '1', icon: 'person_add', title: 'Daftar Gratis', desc: 'Buat akun dalam hitungan detik. Tanpa kartu kredit.' },
                                    { step: '2', icon: 'tune', title: 'Pilih Mode', desc: 'Life, Muslim, Creator, atau Work — sesuai kebutuhanmu.' },
                                    { step: '3', icon: 'rocket_launch', title: 'Mulai Produktif', desc: 'Kelola hidupmu dengan journal digital yang estetik.' },
                                ].map((item) => (
                                    <motion.div
                                        key={item.step}
                                        className="text-center relative"
                                        variants={itemVariants}
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-3xl text-primary">{item.icon}</span>
                                        </div>
                                        <div className="font-handwriting text-sm text-primary font-bold mb-1">Step {item.step}</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                        <p className="font-note text-gray-500">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* Features */}
                    <section className="py-20 px-6" id="features">
                        <motion.div
                            className="max-w-6xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-16" variants={itemVariants}>
                                <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Fitur Unggulan</h2>
                                <p className="font-note text-gray-500 mt-3 text-lg">Semua yang kamu butuhkan dalam satu tempat</p>
                            </motion.div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                                {[
                                    { href: '/daily-spread', bg: 'bg-sticky-pink', rotate: 'rotate-3', iconColor: 'text-pink-600', icon: 'auto_stories', title: 'Daily Spread', desc: 'Journaling harian dengan estetika bullet journal.' },
                                    { href: '/habit-tracker', bg: 'bg-sticky-blue', rotate: '-rotate-2', iconColor: 'text-blue-600', icon: 'track_changes', title: 'Habit Tracker', desc: 'Bangun kebiasaan baik dengan tracking visual.' },
                                    { href: '/muslim/sholat-tracker', bg: 'bg-sticky-green', rotate: 'rotate-6', iconColor: 'text-green-600', icon: 'mosque', title: 'Sholat Tracker', desc: 'Catat sholat 5 waktu dan sunnah harian.' },
                                    { href: null, bg: 'bg-sticky-yellow', rotate: '-rotate-6', iconColor: 'text-yellow-600', icon: 'smart_toy', title: 'AI Assistant', desc: 'Personal AI chatbot yang tau konteks journal kamu.' },
                                ].map((feat, i) => {
                                    const Wrapper = feat.href ? Link : 'div';
                                    return (
                                        <motion.div
                                            key={feat.title}
                                            variants={itemVariants}
                                        >
                                            <Wrapper {...(feat.href ? { href: feat.href } : {})} className="flex flex-col items-center group cursor-pointer">
                                                <div className={`w-20 h-20 ${feat.bg} rounded-2xl flex items-center justify-center ${feat.rotate} shadow-sticky mb-6 group-hover:scale-110 transition-transform`}>
                                                    <span className={`material-symbols-outlined text-4xl ${feat.iconColor}`}>{feat.icon}</span>
                                                </div>
                                                <h4 className="font-bold text-lg">{feat.title}</h4>
                                                <p className="font-note text-gray-500 text-sm">{feat.desc}</p>
                                            </Wrapper>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Extra features row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mt-12">
                                {[
                                    { href: '/focus-timer', bg: 'bg-purple-50', border: 'border-purple-100', rotate: 'rotate-2', iconColor: 'text-purple-500', icon: 'timer', title: 'Focus Timer', desc: 'Pomodoro untuk deep work' },
                                    { href: '/finances', bg: 'bg-emerald-50', border: 'border-emerald-100', rotate: '-rotate-2', iconColor: 'text-emerald-500', icon: 'account_balance_wallet', title: 'Finances', desc: 'Kelola keuangan pribadi' },
                                    { href: '/creator/content-calendar', bg: 'bg-orange-50', border: 'border-orange-100', rotate: 'rotate-3', iconColor: 'text-orange-500', icon: 'calendar_month', title: 'Content Calendar', desc: 'Plan konten mingguan' },
                                    { href: '/work/pipeline', bg: 'bg-sky-50', border: 'border-sky-100', rotate: '-rotate-3', iconColor: 'text-sky-500', icon: 'view_kanban', title: 'Project Pipeline', desc: 'Kelola proyek freelance' },
                                ].map((feat, i) => (
                                    <motion.div
                                        key={feat.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                                    >
                                        <Link href={feat.href} className="flex flex-col items-center group cursor-pointer">
                                            <div className={`w-16 h-16 ${feat.bg} rounded-xl flex items-center justify-center ${feat.rotate} shadow-sm mb-4 group-hover:scale-110 transition-transform border ${feat.border}`}>
                                                <span className={`material-symbols-outlined text-3xl ${feat.iconColor}`}>{feat.icon}</span>
                                            </div>
                                            <h4 className="font-bold">{feat.title}</h4>
                                            <p className="font-note text-gray-400 text-xs">{feat.desc}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* Screenshot Gallery */}
                    <section className="py-20 px-6 bg-white/30">
                        <motion.div
                            className="max-w-6xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-16" variants={itemVariants}>
                                <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Lihat Tampilan Setiap Mode</h2>
                                <p className="font-note text-gray-500 mt-3 text-lg">Desain estetik yang bikin kamu betah</p>
                            </motion.div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'Life Mode', color: 'pink', desc: 'Daily Spread dengan estetika bullet journal' },
                                    { name: 'Muslim Mode', color: 'green', desc: 'Ibadah tracker dengan nuansa Islami' },
                                    { name: 'Creator Mode', color: 'orange', desc: 'Content planning yang terorganisir' },
                                    { name: 'Work Mode', color: 'blue', desc: 'Freelancer management yang rapi' },
                                ].map((mode, i) => {
                                    const bgColors = { pink: 'bg-pink-50', green: 'bg-green-50', orange: 'bg-orange-50', blue: 'bg-blue-50' };
                                    const borderColors = { pink: 'border-pink-200', green: 'border-green-200', orange: 'border-orange-200', blue: 'border-blue-200' };
                                    const dotColors = { pink: 'bg-pink-400', green: 'bg-green-400', orange: 'bg-orange-400', blue: 'bg-blue-400' };
                                    return (
                                        <motion.div
                                            key={mode.name}
                                            className={`rounded-2xl border ${borderColors[mode.color]} overflow-hidden shadow-lg`}
                                            variants={itemVariants}
                                        >
                                            <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                                </div>
                                                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono">lifeos.app/{mode.color}</div>
                                            </div>
                                            <div className={`${bgColors[mode.color]} h-56 flex flex-col items-center justify-center p-6`}>
                                                <div className={`w-12 h-12 ${dotColors[mode.color]} rounded-xl flex items-center justify-center mb-3`}>
                                                    <span className="material-symbols-outlined text-2xl text-white">
                                                        {mode.color === 'pink' ? 'favorite' : mode.color === 'green' ? 'mosque' : mode.color === 'orange' ? 'edit_note' : 'business_center'}
                                                    </span>
                                                </div>
                                                <h4 className="font-handwriting text-xl font-bold text-gray-700">{mode.name}</h4>
                                                <p className="font-note text-gray-500 text-sm mt-1">{mode.desc}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </section>

                    {/* Pricing */}
                    <section className="py-24 px-6 bg-white/50 relative overflow-hidden" id="pricing">
                        <motion.div
                            className="absolute bottom-10 left-[10%] opacity-20 pointer-events-none rotate-[20deg]"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <span className="material-symbols-outlined text-[100px] text-yellow-400">stars</span>
                        </motion.div>

                        <motion.div
                            className="max-w-6xl mx-auto relative z-10"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-16" variants={itemVariants}>
                                <h2 className="text-5xl font-elegant text-gray-800">Mulai Hidup Terorganisir</h2>
                                <p className="font-handwriting text-2xl text-primary mt-2">Pilih paket yang sesuai untukmu</p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Free Plan */}
                                <motion.div
                                    className="bg-page-bg p-8 rounded-2xl shadow-notebook border border-gray-100 flex flex-col relative"
                                    variants={itemVariants}
                                >
                                    <div className="washi-tape-accent -top-3 left-1/2 -translate-x-1/2 bg-gray-200/80 w-24"></div>
                                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Rp 0</span>
                                        <span className="text-gray-400">/selamanya</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 font-note text-lg flex-1">
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500">check_circle</span> 1 Mode (Life)</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500">check_circle</span> Daily Task Log</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500">check_circle</span> 3 Habit Trackers</li>
                                    </ul>
                                    <Link href="/register" className="block w-full py-3 rounded-xl border-2 border-gray-200 font-bold hover:bg-gray-50 transition-colors text-center">Mulai Gratis</Link>
                                </motion.div>

                                {/* Pro Plan */}
                                <motion.div
                                    className="bg-page-bg p-8 rounded-2xl shadow-notebook border-2 border-primary flex flex-col relative md:scale-105 z-20"
                                    variants={itemVariants}
                                >
                                    <div className="washi-tape-accent -top-3 left-1/2 -translate-x-1/2 bg-primary/20 w-32 rotate-1"></div>
                                    <div className="absolute -top-4 right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Populer</div>
                                    <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Rp 49.000</span>
                                        <span className="text-gray-400">/bulan</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 font-note text-lg flex-1">
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Semua 4 Mode</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> AI Assistant</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Unlimited Trackers</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Cloud Sync</li>
                                    </ul>
                                    <Link href="/checkout/pro" className="block w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity text-center">
                                        Bayar dengan Mayar
                                    </Link>
                                </motion.div>

                                {/* Team Plan */}
                                <motion.div
                                    className="bg-page-bg p-8 rounded-2xl shadow-notebook border border-gray-100 flex flex-col relative"
                                    variants={itemVariants}
                                >
                                    <div className="washi-tape-accent -top-3 left-1/2 -translate-x-1/2 bg-blue-100/80 w-24 -rotate-1"></div>
                                    <h3 className="text-2xl font-bold mb-2">Team</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Rp 199.000</span>
                                        <span className="text-gray-400">/bulan</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 font-note text-lg flex-1">
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">check_circle</span> Hingga 5 User</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">check_circle</span> Shared Workspaces</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">check_circle</span> Admin Dashboard</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">check_circle</span> Prioritas Support</li>
                                    </ul>
                                    <Link href="/checkout/team" className="block w-full py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors text-center">
                                        Bayar dengan Mayar
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Comparison Table */}
                            <motion.div
                                className="mt-16 overflow-x-auto"
                                variants={itemVariants}
                            >
                                <table className="w-full bg-page-bg rounded-2xl shadow-notebook border border-gray-100 overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left p-4 font-handwriting text-lg text-gray-600">Fitur</th>
                                            <th className="p-4 font-handwriting text-lg text-gray-600">Free</th>
                                            <th className="p-4 font-handwriting text-lg text-primary">Pro</th>
                                            <th className="p-4 font-handwriting text-lg text-gray-600">Team</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-note">
                                        {[
                                            { feature: 'Mode tersedia', free: '1 (Life)', pro: 'Semua 4', team: 'Semua 4' },
                                            { feature: 'Habit Trackers', free: '3', pro: 'Unlimited', team: 'Unlimited' },
                                            { feature: 'AI Assistant', free: false, pro: true, team: true },
                                            { feature: 'Cloud Sync', free: false, pro: true, team: true },
                                            { feature: 'Shared Workspace', free: false, pro: false, team: true },
                                            { feature: 'Team Members', free: '1', pro: '1', team: 'Hingga 5' },
                                            { feature: 'Prioritas Support', free: false, pro: false, team: true },
                                        ].map((row, i) => (
                                            <tr key={row.feature} className={i % 2 === 0 ? 'bg-white/50' : ''}>
                                                <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                                                {['free', 'pro', 'team'].map((plan) => (
                                                    <td key={plan} className="p-4 text-center">
                                                        {typeof row[plan] === 'boolean' ? (
                                                            <span className={`material-symbols-outlined text-lg ${row[plan] ? 'text-green-500' : 'text-gray-300'}`}>
                                                                {row[plan] ? 'check_circle' : 'cancel'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-600">{row[plan]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Testimonials */}
                    <section className="py-20 px-6">
                        <motion.div
                            className="max-w-5xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-elegant text-center mb-12"
                                variants={itemVariants}
                            >
                                Apa Kata Pengguna Kami
                            </motion.h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { text: '"Mosiku benar-benar mengubah cara saya mengelola waktu. Desainnya sangat menenangkan!"', name: 'Siti Aminah', initials: 'SA', bg: 'bg-sticky-yellow', avatarBg: 'bg-yellow-200', avatarText: 'text-yellow-700', rotate: 'rotate-[-1deg]' },
                                    { text: '"Muslim Mode sangat membantu menjaga rutinitas ibadah di tengah kesibukan kerja."', name: 'Budi Santoso', initials: 'BS', bg: 'bg-sticky-pink', avatarBg: 'bg-pink-200', avatarText: 'text-pink-700', rotate: 'rotate-[2deg]' },
                                    { text: '"Creator Mode bikin planning konten jadi jauh lebih terstruktur. Love it!"', name: 'Dina Putri', initials: 'DP', bg: 'bg-sticky-blue', avatarBg: 'bg-blue-200', avatarText: 'text-blue-700', rotate: 'rotate-[-1.5deg]' },
                                    { text: '"Sebagai freelancer, Work Mode ini game changer. Invoice & client tracking jadi rapi."', name: 'Rizky Pratama', initials: 'RP', bg: 'bg-sticky-green', avatarBg: 'bg-green-200', avatarText: 'text-green-700', rotate: 'rotate-[1deg]' },
                                    { text: '"AI Assistant-nya pinter banget, bisa bantu brainstorm dan kasih saran produktivitas."', name: 'Maya Lestari', initials: 'ML', bg: 'bg-sticky-yellow', avatarBg: 'bg-yellow-200', avatarText: 'text-yellow-700', rotate: 'rotate-[2.5deg]' },
                                    { text: '"Suka banget estetikanya. Kayak nulis di bullet journal tapi digital dan gak berantakan."', name: 'Andi Wijaya', initials: 'AW', bg: 'bg-sticky-pink', avatarBg: 'bg-pink-200', avatarText: 'text-pink-700', rotate: 'rotate-[-2deg]' },
                                ].map((t, i) => (
                                    <motion.div
                                        key={t.name}
                                        className={`${t.bg} p-6 shadow-sticky ${t.rotate} relative`}
                                        variants={itemVariants}
                                    >
                                        <p className="font-note text-lg mb-4 italic">{t.text}</p>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-bold ${t.avatarText}`}>{t.initials}</div>
                                            <span className="font-bold font-handwriting text-lg">{t.name}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* FAQ */}
                    <section className="py-20 px-6 bg-white/30">
                        <motion.div
                            className="max-w-3xl mx-auto"
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <motion.div className="text-center mb-12" variants={itemVariants}>
                                <h2 className="text-4xl md:text-5xl font-elegant text-gray-800">Pertanyaan Umum</h2>
                                <p className="font-note text-gray-500 mt-3 text-lg">Jawaban untuk pertanyaan yang sering ditanyakan</p>
                            </motion.div>
                            <div className="space-y-3">
                                {[
                                    { q: 'Apakah Mosiku benar-benar gratis?', a: 'Ya! Plan Free bisa dipakai selamanya tanpa kartu kredit. Kamu bisa upgrade ke Pro atau Team kapan saja untuk fitur lebih lengkap.' },
                                    { q: 'Apakah data saya aman?', a: 'Tentu. Data kamu tersimpan di server yang terenkripsi dan kami tidak pernah membagikan data pribadi ke pihak ketiga.' },
                                    { q: 'Bisa dipakai offline?', a: 'Mosiku bisa di-install ke home screen dan tetap bisa diakses saat offline. Data akan otomatis sync saat koneksi kembali.' },
                                    { q: 'Apa bedanya 4 mode yang tersedia?', a: 'Setiap mode mengubah tampilan dan fitur sesuai kebutuhan: Life untuk produktivitas harian, Muslim untuk ibadah, Creator untuk content creation, dan Work untuk freelancing.' },
                                    { q: 'Bisa ganti mode kapan saja?', a: 'Bisa! Kamu bisa switch mode kapan saja dari sidebar. Semua data di setiap mode tetap tersimpan.' },
                                    { q: 'Bagaimana cara membayar plan Pro/Team?', a: 'Pembayaran diproses melalui Mayar.id yang mendukung transfer bank, e-wallet, dan kartu kredit. Aman dan terpercaya.' },
                                ].map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-page-bg rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                                        variants={itemVariants}
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-5 text-left"
                                        >
                                            <span className="font-bold text-gray-700">{faq.q}</span>
                                            <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-5 pb-5 pt-0">
                                                <p className="font-note text-gray-500">{faq.a}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* CTA Final */}
                    <section className="py-24 px-6">
                        <motion.div
                            className="max-w-3xl mx-auto text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <h2 className="text-4xl md:text-5xl font-elegant text-gray-800 mb-4">Siap Mengorganisir Hidupmu?</h2>
                            <p className="font-note text-xl text-gray-500 mb-8">Gabung ribuan pengguna yang sudah lebih produktif dengan Mosiku.</p>
                            <Link href={auth?.user ? "/daily-spread" : "/register"} className="washi-tape-btn text-xl">
                                {auth?.user ? 'Go to Dashboard' : 'Mulai Gratis Sekarang'}
                            </Link>
                            <p className="text-sm font-handwriting text-gray-400 mt-4">Tanpa kartu kredit. Setup dalam 30 detik.</p>
                        </motion.div>
                    </section>
                </main>

                <motion.footer
                    className="bg-white border-t border-orange-100 pt-16 pb-8 px-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <img src="/images/ciku-default.svg" alt="Mosiku" className="h-10 w-10 rotate-3 drop-shadow-md" />
                                    <span className="text-primary text-2xl font-handwriting font-bold">Mosiku</span>
                                </div>
                                <p className="text-gray-500 max-w-sm font-note text-lg">Ekosistem produktivitas yang mindful, estetik, dan terintegrasi untuk kehidupan modern.</p>
                            </div>
                            <div>
                                <h5 className="font-bold mb-6">Modes</h5>
                                <ul className="space-y-4 text-gray-500">
                                    <li><Link className="hover:text-primary" href="/daily-spread">Life Mode</Link></li>
                                    <li><Link className="hover:text-primary" href="/muslim/daily-spread">Muslim Mode</Link></li>
                                    <li><Link className="hover:text-primary" href="/creator/content-calendar">Creator Mode</Link></li>
                                    <li><Link className="hover:text-primary" href="/work/dashboard">Work Mode</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold mb-6">Pembayaran Aman</h5>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70">
                                        <span className="text-xs font-bold text-gray-400">Powered by</span>
                                        <span className="font-black text-blue-600">Mayar.id</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200"></div>
                                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200"></div>
                                        <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400 font-medium">
                            © 2025 Mosiku. All rights reserved. Made with heart.
                        </div>
                    </div>
                </motion.footer>
            </div>

            <ModeModal mode={activeMode} onClose={() => setActiveMode(null)} auth={auth} />

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </>
    );
}
