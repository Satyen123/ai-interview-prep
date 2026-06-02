/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#09090b',
          darker: '#030303',
          card: 'rgba(15, 15, 23, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#8b5cf6', // Violet
          accentGlow: 'rgba(139, 92, 246, 0.25)',
          neon: '#06b6d4', // Cyan
          neonGlow: 'rgba(6, 182, 212, 0.25)',
          jade: '#10b981', // Success Emerald
          gold: '#f59e0b'  // Streaks Amber
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
