/** @type {import('tailwindcss').Config} */

const htSafeList = require("./tailwind-ht-safelist.json");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // DC30 Theme
    "text-dc-purple",
    "text-dc-teal",
    "text-dc-yellow",
    "text-dc-red",
    "bg-dc-purple",
    "bg-dc-teal",
    "bg-dc-yellow",
    "bg-dc-red",
    //  Event colors
    ...htSafeList.colors.map((c) => `bg-[${c}]`),
    ...htSafeList.colors.map((c) => `hover:text-[${c}]`),
    ...htSafeList.colors.map((c) => `hover:bg-[${c}]`),
  ],
  theme: {
    extend: {
      fontFamily: {
        benguiat: ["var(--font-benguiat)"],
      },
      colors: {
        "dc-purple": "#686EA0",
        "dc-teal": "#81C8BD",
        "dc-yellow": "#ECDA25",
        "dc-red": "#F8A28B",
        "dc-text": "#eeeeee",
        "dc-gray": "#2D2D2D",
        "dc-border": "#646464",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dc: {
          primary: "#81C8BD",
          secondary: "#686EA0",
          accent: "#F8A28B",
          neutral: "#ECDA25",
        },
      },
    ],
  },
};
