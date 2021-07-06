module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Futura", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: {
        DEFAULT: "#fff",
      },
      black: {
        DEFAULT: "#000",
      },
      blue: {
        DEFAULT: "#4999e5",
      },
      gray: {
        dark: "#888",
        DEFAULT: "#777",
        light: "#bbb",
      },
      red: {
        DEFAULT: "#e25238",
      },
      yellow: {
        DEFAULT: "#eec643",
      },
      green: {
        DEFAULT: "#64d576",
      },
      orange: {
        DEFAULT: "#dc8530",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
