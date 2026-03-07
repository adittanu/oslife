import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

export default function JournalLayout({ children, pageTitle, headerTitle, headerSubtitle, titleFontClass, bgIcon }) {
    return (
        <div className="bg-journal-bg paper-texture text-text-journal font-display flex overflow-hidden" style={{ height: '125vh' }}>
            <Head title={pageTitle} />
            
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {bgIcon && (
                    <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
                        {bgIcon}
                    </div>
                )}
                
                <Header 
                    title={headerTitle} 
                    subtitle={headerSubtitle} 
                    titleFontClass={titleFontClass} 
                />

                {children}

                <button className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </main>
        </div>
    );
}
