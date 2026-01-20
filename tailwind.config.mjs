/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
    darkMode: 'class', // <--- ADD THIS LINE
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
        },
    },
    plugins: [
        typography, // Used the imported variable here
    ],
};