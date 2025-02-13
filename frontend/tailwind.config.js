// import flowbitePlugin from 'flowbite/plugin'
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
        gray: {
          850: "#192338", // Custom dark blue shade
        },
      },
    },
  },
  plugins: [],
};
