/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#33A0FF',
          dark: '#1E88E5',
        },
        secondary: {
          light: '#FF4252',
          dark: '#E53935',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
        surface: {
          light: '#F5F5F5',
          dark: '#2D2D2D',
        },
        text: {
          light: '#22262A',
          dark: '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
}