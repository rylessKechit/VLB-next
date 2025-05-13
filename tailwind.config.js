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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        rounded: ['Inter', 'system-ui', 'sans-serif'],
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
        'xxs': '375px',
        'xxxs': '320px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'slide-in-up': 'slideInUp 0.6s ease-out forwards',
        'gradient': 'gradient 3s ease infinite',
        'bounce': 'bounce 1s infinite',
        'bounce-slow': 'bounce 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
      },
      // Espacements personnalisés pour mobile
      spacing: {
        '56': '3.5rem', // Pour les zones tactiles recommandées
        '15': '3.75rem',
      },
      // Hauteurs minimales pour les zones tactiles
      minHeight: {
        '12': '3rem',
        '14': '3.5rem',
        'touch': '44px', // Standard iOS/Android pour zones tactiles
      },
    },
  },
  plugins: [
    // Plugin pour ajouter des utilitaires Tailwind personnalisés
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Utilitaire pour les transitions tactiles
        '.touch-action-none': {
          'touch-action': 'none',
        },
        '.touch-action-manipulation': {
          'touch-action': 'manipulation',
        },
        // Utilitaire pour désactiver le highlight sur mobile
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        // Utilitaire pour les zones tactiles
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        // Smooth scroll pour mobile
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        // Utilitaires pour améliorer les performances
        '.will-change-transform': {
          'will-change': 'transform',
        },
        '.will-change-opacity': {
          'will-change': 'opacity',
        },
        '.translate3d-0': {
          'transform': 'translate3d(0, 0, 0)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true
  },
}