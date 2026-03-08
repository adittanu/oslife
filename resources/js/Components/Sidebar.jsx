import React from 'react';
import { usePage } from '@inertiajs/react';
import SidebarNav from '@/Components/SidebarNav';
import { modeConfig, detectMode } from '@/config/modeConfig';

export default function Sidebar() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const config = modeConfig[mode] || modeConfig.life;

    return (
        <aside className="w-64 bg-white/60 backdrop-blur-md flex-col border-r border-orange-100 hidden md:flex h-full shrink-0 z-30">
            <div className="p-8 flex items-center gap-3">
                <div className="bg-center bg-no-repeat bg-cover rounded-2xl h-12 w-12 border-2 border-primary rotate-3 shadow-md" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_k8zodvgRy8J2Vg_lS-vpqOiCOMN7YDmjiDQ6rPpf1E9BQdiL5yaBRegMph3ndGJG5iBGCoGeXXoiD8gBnHTIlWdkb-qemjG6P1UGMrF9IOotUALq9sL__D-Qeoaniq5p_wGKkKop7xzg6fNL1yz0jRGw44WbxxNv3fpKFrvWOx2Oz-KVXmDDkuTKFl84eLDUWsFz1JYQ3jVM-GAgy-vMes50uH8ukigGXHVXQ7sDPzC639P7W_Ukma5OSle2SLxGV7Rs8X5KEdc")'}}></div>
                <div className="flex flex-col">
                    <h1 className="text-primary text-xl font-handwriting font-bold leading-tight">{config.brandTitle}</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{config.label}</p>
                </div>
            </div>

            <SidebarNav />
        </aside>
    );
}
