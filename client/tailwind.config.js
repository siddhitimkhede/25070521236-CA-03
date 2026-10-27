/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          light: '#FAF0EF',
          DEFAULT: '#F3D9D8',
          hover: '#ECD0CF',
          dark: '#E2B8B6'
        },
        ivory: {
          light: '#FDFCFA',
          DEFAULT: '#FAF7F2',
          dark: '#F0ECE4'
        },
        cream: {
          DEFAULT: '#F4EEE7',
          warm: '#EDE4DA'
        },
        rose: {
          light: '#EAD1CF',
          DEFAULT: '#D9AAA8',
          dark: '#C08D8B'
        },
        cocoa: {
          light: '#654D49',
          DEFAULT: '#493633',
          dark: '#352523'
        },
        taupe: {
          light: '#BFB0A6',
          DEFAULT: '#A89589',
          dark: '#8C776A'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Pinyon Script"', '"Cormorant Garamond"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(73, 54, 51, 0.05)',
        'card': '0 8px 30px -4px rgba(73, 54, 51, 0.08)',
        'drawer': '-10px 0 40px rgba(73, 54, 51, 0.12)',
        'float': '0 20px 40px -10px rgba(73, 54, 51, 0.12)'
      },
      letterSpacing: {
        'luxury': '0.2em',
        'subtle': '0.08em'
      }
    },
  },
  plugins: [],
}
