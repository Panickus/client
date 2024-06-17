/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6894f2',
        secondary: '#040404',
        tertiary: '#33405c',
        quaternary: '#5c41e0',
        quinary: '#34747c',
      },
    },
  },
  darkMode: 'class', // Habilita el modo oscuro
  plugins: [],
};


