/* eslint-disable global-require */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // DC30 Theme
    "text-dc-pink",
    "text-dc-blue",
    "text-dc-green",
    "text-dc-drk-green",
    "text-dc-red",
    "bg-dc-pink",
    "bg-dc-blue",
    "bg-dc-green",
    "bg-dc-drk-green",
    "bg-dc-red",
    //  Event colors
    "bg-[#2896ff]",
    "hover:bg-[#2896ff]",
  ],
  theme: {
    extend: {
      colors: {
        "dc-pink": "#c16784",
        "dc-blue": "#326295",
        "dc-green": "#71cc98",
        "dc-drk-green": "#4b9560",
        "dc-red": "#c04c36",
        "dc-text": "#eeeeee",
        "dc-gray": "#2D2D2D",
        "dc-border": "#646464",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dc: {
          primary: "#326295",
          secondary: "#c04c36",
          accent: "#71cc98",
          neutral: "#c16784",
          "base-100": "#2D2D2D",
        },
      },
    ],
  },
};
