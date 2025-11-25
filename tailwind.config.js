/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        emeraldGlow: {
          500: "#1fd376",
          700: "#0f7b3c"
        },
        goldSpark: {
          100: "#fff5d8",
          200: "#ffe6a8",
          300: "#ffd26f"
        }
      },
      fontFamily: {
        display: ["Quicksand", "Prompt", "sans-serif"],
        script: ["Pacifico", "cursive"]
      },
      boxShadow: {
        glow: "0 8px 20px rgba(0,0,0,0.32), 0 0 14px rgba(31,211,118,0.35), 0 0 32px rgba(31,211,118,0.2)"
      }
    }
  },
  plugins: []
};
