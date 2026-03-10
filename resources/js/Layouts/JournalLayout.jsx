import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import ThemeProvider from '@/Components/ThemeProvider';
import MobileSidebar from '@/Components/MobileSidebar';
import ChatWidget from '@/Components/ChatWidget';
import GuidedTour from '@/Components/GuidedTour';
import { useCursorMode } from '@/hooks/useCursorMode';

export default function JournalLayout({ children, pageTitle, headerTitle, headerSubtitle, titleFontClass, bgIcon }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Set cursor mode based on current route
    useCursorMode();

    return (
        <ThemeProvider>
        <div className="bg-journal-bg paper-texture text-text-journal font-display flex overflow-hidden" style={{ height: '125vh' }}>
            <Head title={pageTitle} />

            <Sidebar />

            <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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
                    onMenuToggle={() => setMobileMenuOpen(true)}
                />

                {children}
            </main>

            {usePage().props.auth?.user && <ChatWidget />}
            {usePage().props.auth?.user && <GuidedTour />}
        </div>
        </ThemeProvider>
    );
}
