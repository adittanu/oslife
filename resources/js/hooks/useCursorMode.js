import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Hook to manage custom cursor based on current mode.
 * Sets data-cursor-mode attribute on document body.
 *
 * Modes:
 * - life: Pink (#EC4899)
 * - muslim: Green (#10B981)
 * - creator: Orange (#F97316)
 * - work: Blue (#3B82F6)
 */
export function useCursorMode(mode = null) {
    const { url } = usePage().props;

    useEffect(() => {
        // Detect mode from URL or use provided mode
        let cursorMode = mode;

        if (!cursorMode && url) {
            if (url.startsWith('/muslim')) {
                cursorMode = 'muslim';
            } else if (url.startsWith('/creator')) {
                cursorMode = 'creator';
            } else if (url.startsWith('/work')) {
                cursorMode = 'work';
            } else {
                cursorMode = 'life';
            }
        }

        // Set the cursor mode on body
        document.body.setAttribute('data-cursor-mode', cursorMode || 'life');

        return () => {
            document.body.removeAttribute('data-cursor-mode');
        };
    }, [mode, url]);
}

/**
 * Component to wrap app with cursor mode support.
 * Add this to your root layout.
 */
export function CursorModeProvider({ children, mode }) {
    useCursorMode(mode);
    return children;
}

export default useCursorMode;