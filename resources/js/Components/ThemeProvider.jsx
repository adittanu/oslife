import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { modeConfig, detectMode } from '@/config/modeConfig';

const themeColors = {
    pink:   { hex: '#EC4899', rgb: '236 72 153' },
    blue:   { hex: '#3B82F6', rgb: '59 130 246' },
    green:  { hex: '#22C55E', rgb: '34 197 94' },
    purple: { hex: '#A855F7', rgb: '168 85 247' },
    orange: { hex: '#F97316', rgb: '249 115 22' },
};

export default function ThemeProvider({ children }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const mode = detectMode(auth?.user, currentUrl);
    const config = modeConfig[mode] || modeConfig.life;

    const theme = config.defaultTheme || 'pink';

    useEffect(() => {
        const colors = themeColors[theme] || themeColors.pink;
        document.documentElement.style.setProperty('--color-primary-rgb', colors.rgb);
        document.documentElement.style.setProperty('--color-primary', colors.hex);
    }, [theme]);

    return <>{children}</>;
}
