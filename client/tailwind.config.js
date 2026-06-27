/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f472b6",
        primarySoft: "#fdf2f8",
        primaryStrong: "#db2777",
        ink: "#4b3d49",
        mist: "#fffafc",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px rgba(244, 114, 182, 0.15)",
      },
    },
  },
  plugins: [],
};
