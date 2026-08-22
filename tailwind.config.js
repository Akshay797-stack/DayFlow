/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        odoo: {
          50: '#fdf6f9',
          100: '#faeaf2',
          200: '#f6d6e6',
          300: '#f0b4d2',
          400: '#e582b3',
          500: '#d55694',
          600: '#bf3978',
          700: '#a22961',
          800: '#714B67', // Classic Odoo Purple-Plum Brand Color
          900: '#5a223e',
          950: '#3a0f24',
        },
        brand: {
          teal: '#00A09D', // Odoo secondary teal
          primary: '#714B67',
          accent: '#017E84',
          surface: '#F9FAFB',
          card: '#FFFFFF',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkBorder: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'glow': '0 0 25px -5px rgba(113, 75, 103, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
