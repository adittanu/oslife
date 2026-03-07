import React from 'react';

export default function Header({ title, subtitle, titleFontClass = "font-elegant" }) {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-transparent shrink-0 z-20">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h2 className={`text-4xl ${titleFontClass} font-bold text-gray-800 tracking-tight`}>{title}</h2>
                    <p className="text-sm font-note text-gray-500 italic">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex bg-white/50 backdrop-blur shadow-sm rounded-2xl p-1 border border-orange-100">
                    <label className="cursor-pointer">
                        <input defaultChecked className="peer sr-only" name="mode" type="radio"/>
                        <span className="block px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-primary peer-checked:text-white transition-all">Life</span>
                    </label>
                    <label className="cursor-pointer">
                        <input className="peer sr-only" name="mode" type="radio"/>
                        <span className="block px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-primary peer-checked:text-white transition-all">Muslim</span>
                    </label>
                    <label className="cursor-pointer">
                        <input className="peer sr-only" name="mode" type="radio"/>
                        <span className="block px-5 py-2 rounded-xl text-xs font-bold text-gray-400 peer-checked:bg-primary peer-checked:text-white transition-all">Work</span>
                    </label>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-white border border-orange-100 text-gray-400 flex items-center justify-center shadow-sm relative group hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">search</span>
                </button>
            </div>
        </header>
    );
}
