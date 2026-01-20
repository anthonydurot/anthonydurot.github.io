/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
    darkMode: 'class', // <--- Critical for the toggle to work
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
        },
    },
    plugins: [typography],
};