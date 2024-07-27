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
      },
    },
  },
  plugins: [],
};
