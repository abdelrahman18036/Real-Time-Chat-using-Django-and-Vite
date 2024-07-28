/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode with a class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#2d2a6e",
        purple: "#6d28d9",
        "dark-bg": "#1a202c",
        "text-light": "#e2e8f0",
        "light-bg": "##f5f5f7", // Light mode background color
        "light-text": "#000000", // Light mode text color
      },
    },
  },
  plugins: [],
};
