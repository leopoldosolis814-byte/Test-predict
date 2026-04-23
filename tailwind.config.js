/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Badge colors used dynamically
    "bg-green-100", "text-green-700",
    "bg-orange-100", "text-orange-700",
    "bg-sky-100", "text-sky-700",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
