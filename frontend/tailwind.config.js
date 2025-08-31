/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D52A0',
        secondary: '#7091E6',
        accent: '#8697C4',
        light: '#ADBBDA',
        background: '#EDE8F5',
      },
    },
  },
  plugins: [],
}
