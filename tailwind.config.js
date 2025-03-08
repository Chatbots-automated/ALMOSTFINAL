/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        elida: {
          beige: '#F5E6D3',
          peach: '#FFE4D6',
          lavender: '#E6E6FA',
          cream: '#FDFBF7',
          sand: '#E8DFD8',
          warm: '#FFE8D6',
          accent: '#B76E79',
          gold: '#D4AF37',
          dark: '#2C2C2C',
          light: '#FFFAF0'
        }
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #D4AF37, #FFF3A3, #D4AF37)',
        'luxury-gradient': 'linear-gradient(to right, #D4AF37, #B76E79)',
        'soft-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 25px -3px rgba(212, 175, 55, 0.3)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      letterSpacing: {
        'widest': '0.2em',
      }
    }
  },
  plugins: []
}