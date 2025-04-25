/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#d4af37',
            dark: '#b8971d',
            light: '#e3c261',
          },
          secondary: {
            DEFAULT: '#2a5a9e',
            dark: '#1a4580',
          },
          accent: '#e74c3c',
          dark: '#2c3e50',
          light: '#f8f9fa',
          'text-dark': '#333333',
          'text-light': '#666666',
          'text-lighter': '#999999',
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        },
        boxShadow: {
          'custom-light': '0 2px 6px rgba(0, 0, 0, 0.05)',
          'custom': '0 4px 12px rgba(0, 0, 0, 0.1)',
          'custom-dark': '0 6px 16px rgba(0, 0, 0, 0.15)',
        },
        height: {
          'header': '80px',
          'header-scrolled': '70px',
        },
        transitionProperty: {
          'height': 'height',
        },
        screens: {
          'xs': '480px',
        }
      },
    },
    plugins: [],
  }