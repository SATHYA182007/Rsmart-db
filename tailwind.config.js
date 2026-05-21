/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          muted: 'var(--sidebar-muted)',
          border: 'var(--sidebar-border)',
        },
        // status colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Instrument Sans Variable', 'Inter', 'sans-serif'],
        heading: ['Roboto Slab Variable', 'serif'],
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],
        'sm': ['0.9375rem', { lineHeight: '1.5rem' }],
        'base': ['1.0625rem', { lineHeight: '1.625rem' }],
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }],
        'xl': ['1.3125rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.625rem', { lineHeight: '2.125rem' }],
        '3xl': ['2rem', { lineHeight: '2.375rem' }],
      },
      borderRadius: {
        'card': 'var(--radius)',
        '4xl': '2rem',
        '3xl': '1.5rem',
        '2xl': '1rem',
        'xl': '0.75rem',
        'lg': '0.625rem',
      },
      boxShadow: {
        'soft':    '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 8px 0 rgba(0,0,0,0.04)',
        'card':    '0 2px 12px -2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'premium': '0 8px 32px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
        'glow':    '0 0 0 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
