import { useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { detectMode } from '@/config/modeConfig';
import { tourSteps } from '@/config/tourSteps';
import axios from 'axios';

export default function GuidedTour() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const user = auth?.user;

    const startTour = useCallback((currentMode) => {
        const config = tourSteps[currentMode];
        if (!config) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            stagePadding: 4,
            stageRadius: 12,
            popoverOffset: 10,
            popoverClass: 'tour-popover',
            nextBtnText: 'Next →',
            prevBtnText: '← Back',
            doneBtnText: 'Got it!',
            progressText: '{{current}} / {{total}}',
            steps: config.steps,
            onDestroyed: () => {
                if (user) {
                    axios.post('/api/tour/seen', { mode: currentMode }).catch(() => {});
                }
            },
        });

        // Small delay to ensure DOM elements are rendered
        setTimeout(() => driverObj.drive(), 500);
    }, [user]);

    // Auto-start tour for first-time mode visit
    useEffect(() => {
        if (!user) return;

        const seenTours = user.seen_tours || [];
        if (!seenTours.includes(mode)) {
            startTour(mode);
        }
    }, [mode, user, startTour]);

    // Expose startTour globally so the "?" button can trigger it
    useEffect(() => {
        window.__startTour = () => startTour(mode);
        return () => { delete window.__startTour; };
    }, [mode, startTour]);

    return null;
}
