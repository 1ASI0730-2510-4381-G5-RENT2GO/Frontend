/** @type {import('tailwindcss').Config} */
module.exports = {
  /*  Activa el modo oscuro por clase: <html class="dark"> … */
  darkMode: 'class',

  /*  Rutas donde Tailwind analizará los templates */
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    /* -----------------------------------------------------------------------
       1️⃣  Personalizaciones
    ----------------------------------------------------------------------- */
    extend: {
      /*  Tipografías */
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },

      /* --------------------------------------------------
         1.1 Colores
         --------------------------------------------------
         — primary: tu color de marca (existente)
         — neutral: escala de grises
         — surface: fondos principales
         — muted  : fondos secundarios / cards
         — text   : colores de texto
         — border : líneas y contornos
      */
      colors: {
        /* Paleta de marca ------------------------------ */
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

        /* Escala neutral (gris) ------------------------ */
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

        /* Fondos -------------------------------------- */
        surface: {
          /*  Modo claro (DEFAULT) */
          DEFAULT: '#ffffff',   // paper / body
          muted  : '#f3f4f6',   // paneles, tarjetas
          overlay: 'rgba(0,0,0,.6)',

          /*  Modo oscuro (sufijo -dark) */
          dark     : '#1e1e1e',
          mutedDark: '#2a2a2a',
          overlayDark: 'rgba(0,0,0,.7)',
        },

        /* Texto --------------------------------------- */
        text: {
          DEFAULT: '#1f2937',   // gris-800
          soft   : '#4b5563',   // gris-600
          inverted: '#ffffff',
          dark   : '#f3f4f6',   // gris-100 en dark
        },

        /* Bordes / dividers --------------------------- */
        border: {
          DEFAULT: '#e5e7eb',   // gris-200
          dark   : '#374151',   // gris-700
        },

        /* Estados de mensaje (opcionales)-------------- */
        success : '#16a34a',
        warning : '#d97706',
        danger  : '#dc2626',
        info    : '#2563eb',
      },

      /* Sombras ---------------------------------------- */
      boxShadow: {
        /* Sombras azules ya existentes */
        'blue-sm'   : '0 1px 2px 0 rgba(0,106,255,.05)',
        'blue-md'   : '0 4px 6px -1px rgba(0,106,255,.1), 0 2px 4px -1px rgba(0,106,255,.06)',
        'blue-lg'   : '0 10px 15px -3px rgba(0,106,255,.1), 0 4px 6px -2px rgba(0,106,255,.05)',
        'blue-xl'   : '0 20px 25px -5px rgba(0,106,255,.1), 0 10px 10px -5px rgba(0,106,255,.04)',
        'blue-inner': 'inset 0 2px 4px 0 rgba(0,0,0,.1)',

        /* Sombra suave para modo oscuro */
        'inner-dark': 'inset 0 0 0 1px rgba(255,255,255,.06)',
      },

      /* Animaciones ----------------------------------- */
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

  /* -----------------------------------------------------------------------
     2️⃣  Plugins Tailwind (opcional pero recomendable)
  ----------------------------------------------------------------------- */
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}