import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                "primary": "rgb(var(--color-primary-rgb, 236 72 153) / <alpha-value>)",
                "desk-bg": "#F5F1E9",
                "journal-bg": "#FDFCF0",
                "page-bg": "#FFFDF5",
                "sticky-yellow": "#FEF9C3",
                "sticky-pink": "#FCE7F3",
                "sticky-blue": "#E0F2FE",
                "sticky-green": "#DCFCE7",
                "sticky-purple": "#F3E8FF",
                "text-journal": "#4B5563",
                "line-color": "#F3D2C1",
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ["Nunito", "sans-serif"],
                handwriting: ["Caveat", "cursive"],
                note: ["Patrick Hand", "cursive"],
                sketch: ["Gochi Hand", "cursive"],
                elegant: ["Homemade Apple", "cursive"],
                scrapbook: ["Reenie Beanie", "cursive"]
            },
            boxShadow: {
                'sticky': '3px 4px 12px rgba(0, 0, 0, 0.08)',
                'sticky-hover': '5px 8px 15px rgba(0, 0, 0, 0.12)',
                'polaroid': '0 4px 15px rgba(0,0,0,0.1), 0 0 0 10px #ffffff',
                'torn': '0 10px 20px rgba(0,0,0,0.05)',
                'notebook': '0 20px 40px -10px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.05)',
                'notebook-spine': 'inset 15px 0 20px -10px rgba(0,0,0,0.05)',
                'photo': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 8px #fff',
                'photo-rotate': '2px 8px 10px rgba(0, 0, 0, 0.15), 0 0 0 8px #fff'
            }
        },
    },

    plugins: [forms, containerQueries],
};
