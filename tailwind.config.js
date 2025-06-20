/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {

    extend: {

      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },

      colors: {

        primary: {
          DEFAULT: '#006aff',
          50 : '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#006aff',
          600: '#0055cc',
          700: '#004099',
          800: '#002a66',
          900: '#001533',
        },

        neutral: {
          50 : '#fafafa',
          100: '#f5f5f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },

        surface: {

          DEFAULT: '#ffffff',
          muted  : '#f3f4f6',
          overlay: 'rgba(0,0,0,.6)',

          dark     : '#1e1e1e',
          mutedDark: '#2a2a2a',
          overlayDark: 'rgba(0,0,0,.7)',
        },

        text: {
          DEFAULT: '#1f2937',
          soft   : '#4b5563',
          inverted: '#ffffff',
          dark   : '#f3f4f6',
        },

        border: {
          DEFAULT: '#e5e7eb',
          dark   : '#374151',
        },

        success : '#16a34a',
        warning : '#d97706',
        danger  : '#dc2626',
        info    : '#2563eb',
      },

      boxShadow: {

        'blue-sm'   : '0 1px 2px 0 rgba(0,106,255,.05)',
        'blue-md'   : '0 4px 6px -1px rgba(0,106,255,.1), 0 2px 4px -1px rgba(0,106,255,.06)',
        'blue-lg'   : '0 10px 15px -3px rgba(0,106,255,.1), 0 4px 6px -2px rgba(0,106,255,.05)',
        'blue-xl'   : '0 20px 25px -5px rgba(0,106,255,.1), 0 10px 10px -5px rgba(0,106,255,.04)',
        'blue-inner': 'inset 0 2px 4px 0 rgba(0,0,0,.1)',

        'inner-dark': 'inset 0 0 0 1px rgba(255,255,255,.06)',
      },

      animation: {
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'fade-in'     : 'fadeIn .3s ease-in-out',
      },
      keyframes: {
        'pulse-subtle': {
          '0%,100%': { opacity: '1' },
          '50%'   : { opacity: '.8' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to  : { opacity: '1' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}