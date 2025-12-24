import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "light",
      {
        black: {
          primary: "rgb(29,155,240)",
          secondary: "rgb(24,24,24)",
          accent: "#000000",
          neutral: "#1a1a1a",
          "base-100": "#000000",
        }
      }
    ]
  }
};
