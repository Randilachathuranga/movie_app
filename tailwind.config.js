/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014", // Example color
        secondary: "#151312", // Example color
        light:{
          100: "#D6C6FF", // Example color
          200: "#A8B5DB",
          300: "#9CA4AB", // Example color
        },
        dark:{
          100: "#1A1A2E", // Example color
          200: "#0f0d23",
        },
        accent: "#221f3d", // Example color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
}