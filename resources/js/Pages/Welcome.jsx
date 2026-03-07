import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Life OS - Organize Your Entire Life" />
            <div className="bg-journal-bg paper-texture text-text-journal font-display scroll-smooth overflow-x-hidden">
                <nav className="fixed top-0 w-full z-50 bg-journal-bg/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-xl h-10 w-10 border-2 border-primary rotate-3 shadow-md" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_k8zodvgRy8J2Vg_lS-vpqOiCOMN7YDmjiDQ6rPpf1E9BQdiL5yaBRegMph3ndGJG5iBGCoGeXXoiD8gBnHTIlWdkb-qemjG6P1UGMrF9IOotUALq9sL__D-Qeoaniq5p_wGKkKop7xzg6fNL1yz0jRGw44WbxxNv3fpKFrvWOx2Oz-KVXmDDkuTKFl84eLDUWsFz1JYQ3jVM-GAgy-vMes50uH8ukigGXHVXQ7sDPzC639P7W_Ukma5OSle2SLxGV7Rs8X5KEdc')" }}></div>
                        <span className="text-primary text-2xl font-handwriting font-bold">Life OS</span>
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
                    <section className="pt-32 pb-20 px-6 relative overflow-hidden min-h-screen flex items-center justify-center">
                        <div className="absolute top-20 left-10 opacity-20 pointer-events-none rotate-[-15deg]">
                            <span className="material-symbols-outlined text-[120px] text-green-400">potted_plant</span>
                        </div>
                        <div className="absolute top-40 right-20 opacity-20 pointer-events-none rotate-[10deg]">
                            <span className="material-symbols-outlined text-[100px] text-blue-300">water_bottle</span>
                        </div>
                        
                        <div className="max-w-4xl mx-auto text-center relative z-10">
                            <h1 className="text-6xl md:text-8xl font-elegant text-gray-800 mb-8 leading-tight">Organize Your Entire Life</h1>
                            <p className="text-xl md:text-2xl font-note text-gray-500 mb-12 max-w-2xl mx-auto">Sistem manajemen hidup all-in-one dengan estetika digital bullet journal untuk produktivitas yang lebih tenang.</p>
                            
                            <div className="flex flex-col items-center gap-4">
                                <a className="washi-tape-btn text-xl" href="#pricing">Daftar Sekarang</a>
                                <p className="text-sm font-handwriting text-gray-400 mt-2">Mulai gratis hari ini. Tanpa kartu kredit.</p>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 px-6 bg-white/30" id="modes">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-handwriting font-bold text-gray-700">Pilih Mode Sesuai Kebutuhanmu</h2>
                                <div className="h-1 w-24 bg-pink-200 mx-auto mt-4 rounded-full"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <Link href="/daily-spread" className="group cursor-pointer">
                                    <div className="bg-page-bg rounded-r-xl shadow-notebook notebook-spine aspect-[3/4] p-6 flex flex-col justify-between border-y border-r border-gray-100 transition-transform group-hover:-translate-y-2">
                                        <div className="washi-tape-accent -top-2 left-6 bg-blue-100/80 rotate-2"></div>
                                        <div>
                                            <span className="material-symbols-outlined text-blue-400 text-4xl mb-4">favorite</span>
                                            <h3 className="text-2xl font-elegant font-bold">Life Mode</h3>
                                            <p className="text-sm font-note mt-2">Daily tracker, gratitude journal, and habit building.</p>
                                        </div>
                                        <div className="grid-lines h-32 rounded-lg border border-gray-50 opacity-40"></div>
                                    </div>
                                </Link>
                                
                                <div className="group cursor-pointer">
                                    <div className="bg-page-bg rounded-r-xl shadow-notebook notebook-spine aspect-[3/4] p-6 flex flex-col justify-between border-y border-r border-gray-100 transition-transform group-hover:-translate-y-2">
                                        <div className="washi-tape-accent -top-2 left-6 bg-green-100/80 -rotate-1"></div>
                                        <div>
                                            <span className="material-symbols-outlined text-green-500 text-4xl mb-4">menu_book</span>
                                            <h3 className="text-2xl font-elegant font-bold">Muslim Mode</h3>
                                            <p className="text-sm font-note mt-2">Quran journal, prayer tracking, and sunnah list.</p>
                                        </div>
                                        <div className="grid-lines h-32 rounded-lg border border-gray-50 opacity-40"></div>
                                    </div>
                                </div>
                                
                                <Link href="/task-log" className="group cursor-pointer">
                                    <div className="bg-page-bg rounded-r-xl shadow-notebook notebook-spine aspect-[3/4] p-6 flex flex-col justify-between border-y border-r border-gray-100 transition-transform group-hover:-translate-y-2">
                                        <div className="washi-tape-accent -top-2 left-6 bg-purple-100/80 rotate-3"></div>
                                        <div>
                                            <span className="material-symbols-outlined text-purple-400 text-4xl mb-4">business_center</span>
                                            <h3 className="text-2xl font-elegant font-bold">Work Mode</h3>
                                            <p className="text-sm font-note mt-2">Project management, meeting notes, and focus timer.</p>
                                        </div>
                                        <div className="grid-lines h-32 rounded-lg border border-gray-50 opacity-40"></div>
                                    </div>
                                </Link>
                                
                                <Link href="/idea-dump" className="group cursor-pointer">
                                    <div className="bg-page-bg rounded-r-xl shadow-notebook notebook-spine aspect-[3/4] p-6 flex flex-col justify-between border-y border-r border-gray-100 transition-transform group-hover:-translate-y-2">
                                        <div className="washi-tape-accent -top-2 left-6 bg-yellow-100/80 -rotate-2"></div>
                                        <div>
                                            <span className="material-symbols-outlined text-yellow-500 text-4xl mb-4">edit_note</span>
                                            <h3 className="text-2xl font-elegant font-bold">Creator Mode</h3>
                                            <p className="text-sm font-note mt-2">Content calendar, scriptwriting, and idea dump.</p>
                                        </div>
                                        <div className="grid-lines h-32 rounded-lg border border-gray-50 opacity-40"></div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 px-6" id="features">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-4xl font-elegant text-center mb-16">Fitur All-in-One</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                                <Link href="/task-log" className="flex flex-col items-center group cursor-pointer">
                                    <div className="w-20 h-20 bg-sticky-pink rounded-2xl flex items-center justify-center rotate-3 shadow-sticky mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl text-pink-600">task_alt</span>
                                    </div>
                                    <h4 className="font-bold text-lg">Task Log</h4>
                                    <p className="font-note text-gray-500">Kelola tugas harian dengan gaya bullet journal.</p>
                                </Link>
                                
                                <Link href="/habit-tracker" className="flex flex-col items-center group cursor-pointer">
                                    <div className="w-20 h-20 bg-sticky-blue rounded-2xl flex items-center justify-center -rotate-2 shadow-sticky mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl text-blue-600">auto_graph</span>
                                    </div>
                                    <h4 className="font-bold text-lg">Habit Tracker</h4>
                                    <p className="font-note text-gray-500">Bangun kebiasaan baik dengan tracking visual.</p>
                                </Link>
                                
                                <div className="flex flex-col items-center group cursor-pointer">
                                    <div className="w-20 h-20 bg-sticky-green rounded-2xl flex items-center justify-center rotate-6 shadow-sticky mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl text-green-600">import_contacts</span>
                                    </div>
                                    <h4 className="font-bold text-lg">Quran Journal</h4>
                                    <p className="font-note text-gray-500">Tadabbur dan hafalan dalam satu tempat.</p>
                                </div>
                                
                                <Link href="/notes" className="flex flex-col items-center group cursor-pointer">
                                    <div className="w-20 h-20 bg-sticky-yellow rounded-2xl flex items-center justify-center -rotate-6 shadow-sticky mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl text-yellow-600">movie_edit</span>
                                    </div>
                                    <h4 className="font-bold text-lg">Notes</h4>
                                    <p className="font-note text-gray-500">Draft ide & catatan Anda dengan mudah.</p>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="py-24 px-6 bg-white/50 relative overflow-hidden" id="pricing">
                        <div className="absolute bottom-10 left-[10%] opacity-20 pointer-events-none rotate-[20deg]">
                            <span className="material-symbols-outlined text-[100px] text-yellow-400">stars</span>
                        </div>
                        
                        <div className="max-w-6xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-elegant text-gray-800">Mulai Hidup Terorganisir</h2>
                                <p className="font-handwriting text-2xl text-primary mt-2">Pilih paket yang sesuai untukmu</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Free Plan */}
                                <div className="bg-page-bg p-8 rounded-2xl shadow-notebook border border-gray-100 flex flex-col relative">
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
                                    <button className="w-full py-3 rounded-xl border-2 border-gray-200 font-bold hover:bg-gray-50 transition-colors">Mulai Gratis</button>
                                </div>
                                
                                {/* Pro Plan */}
                                <div className="bg-page-bg p-8 rounded-2xl shadow-notebook border-2 border-primary flex flex-col relative md:scale-105 z-20">
                                    <div className="washi-tape-accent -top-3 left-1/2 -translate-x-1/2 bg-primary/20 w-32 rotate-1"></div>
                                    <div className="absolute -top-4 right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Populer</div>
                                    <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Rp 49.000</span>
                                        <span className="text-gray-400">/bulan</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 font-note text-lg flex-1">
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Semua 4 Mode</li>
                                        <li className="flex items-center gap-2"><span class="material-symbols-outlined text-primary">check_circle</span> Unlimited Trackers</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Cloud Sync</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">check_circle</span> Custom Sticker Pack</li>
                                    </ul>
                                    <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Bayar dengan Mayar
                                    </button>
                                </div>
                                
                                {/* Team Plan */}
                                <div className="bg-page-bg p-8 rounded-2xl shadow-notebook border border-gray-100 flex flex-col relative">
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
                                    <button className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                                        Bayar dengan Mayar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-elegant text-center mb-12">Apa Kata Pengguna Kami</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-sticky-yellow p-6 shadow-sticky rotate-[-1deg] relative">
                                    <p className="font-note text-xl mb-4 italic">"Life OS benar-benar mengubah cara saya mengelola waktu. Desainnya sangat menenangkan!"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-yellow-200"></div>
                                        <span className="font-bold font-handwriting text-lg">Siti Aminah</span>
                                    </div>
                                </div>
                                <div className="bg-sticky-pink p-6 shadow-sticky rotate-[2deg] relative">
                                    <p className="font-note text-xl mb-4 italic">"Sangat terbantu dengan Muslim Mode untuk menjaga rutinitas ibadah di tengah kesibukan kerja."</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-pink-200"></div>
                                        <span className="font-bold font-handwriting text-lg">Budi Santoso</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-white border-t border-orange-100 pt-16 pb-8 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-center bg-no-repeat bg-cover rounded-xl h-10 w-10 border-2 border-primary rotate-3 shadow-md" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_k8zodvgRy8J2Vg_lS-vpqOiCOMN7YDmjiDQ6rPpf1E9BQdiL5yaBRegMph3ndGJG5iBGCoGeXXoiD8gBnHTIlWdkb-qemjG6P1UGMrF9IOotUALq9sL__D-Qeoaniq5p_wGKkKop7xzg6fNL1yz0jRGw44WbxxNv3fpKFrvWOx2Oz-KVXmDDkuTKFl84eLDUWsFz1JYQ3jVM-GAgy-vMes50uH8ukigGXHVXQ7sDPzC639P7W_Ukma5OSle2SLxGV7Rs8X5KEdc')" }}></div>
                                    <span className="text-primary text-2xl font-handwriting font-bold">Life OS</span>
                                </div>
                                <p className="text-gray-500 max-w-sm font-note text-lg">Membangun ekosistem produktivitas yang mindful, estetik, dan terintegrasi untuk masyarakat modern.</p>
                            </div>
                            <div>
                                <h5 className="font-bold mb-6">Navigasi</h5>
                                <ul className="space-y-4 text-gray-500">
                                    <li><a className="hover:text-primary" href="#">Tentang Kami</a></li>
                                    <li><a className="hover:text-primary" href="#features">Fitur</a></li>
                                    <li><a className="hover:text-primary" href="#">Blog</a></li>
                                    <li><a className="hover:text-primary" href="#">Kontak</a></li>
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
                            © 2024 Life OS. All rights reserved. Managed with heart.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
