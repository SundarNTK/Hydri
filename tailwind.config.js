/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hydri: {
          blue: '#3aa1d6',
          'blue-dark': '#1c6f9c',
          leaf: '#4caf50',
          'leaf-dark': '#2e7d32',
          ink: '#1e4a52'
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 78, 121, 0.15)'
      },
      backdropBlur: {
        glass: '16px'
      }
    }
  },
  plugins: []
}
