/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F9FF',
        card: '#FFFFFF',
        border: '#E5EEF9',
        primary: {
          DEFAULT: '#3B82F6',
          gradientStart: '#4F8CFF',
          gradientEnd: '#7AB8FF',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(59, 130, 246, 0.05)',
        'premium': '0 10px 40px -10px rgba(59, 130, 246, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
