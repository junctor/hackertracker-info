module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    safelist: [
      "border-blue",
      "border-red",
      "border-yellow",
      "border-green",
      "border-orange",
      "hover:text-blue",
      "hover:text-red",
      "hover:text-yellow",
      "hover:text-green",
      "hover:text-orange",
      "hover:text-blue",
      "hover:text-red",
      "hover:text-yellow",
      "hover:text-green",
      "hover:text-orange",
    ],
  },
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
      background: {
        DEFAULT: "#212529",
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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#eec643",
          "primary-focus": "#e25238",
          "primary-content": "#ffffff",
          secondary: "#e25238",
          "secondary-focus": "#eec643",
          "secondary-content": "#ffffff",
          accent: "#dc8530",
          "accent-focus": "#4999e5",
          "accent-content": "#ffffff",
          neutral: "#4999e5",
          "neutral-focus": "#64d576",
          "neutral-content": "#ffffff",
          "base-content": "#bbb",
          "base-100": "#212529",
          "base-200": "#bbb",
          "base-300": "#777",
          info: "#4999e5",
          success: "#64d576",
          warning: "#eec643",
          error: "#e25238",
        },
      },
    ],
  },
};
