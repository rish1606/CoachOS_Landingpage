import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Matt Black Theme
                'matt-black': '#0B0B0F',
                'matt-dark': '#121216',
                'matt-elevated': '#1a1a1e',
                'matt-border': 'rgba(255, 255, 255, 0.06)',
                'matt-border-hover': 'rgba(255, 255, 255, 0.12)',
            },
            fontFamily: {
                'display': ['Outfit', 'Inter', 'sans-serif'],
                'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
