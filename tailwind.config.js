/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 20s linear infinite",
        marquee2: "marquee2 20s linear infinite ",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      backgroundImage: {
        candlestick: "url(/images/candlesticks.png)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        primary: "#0B0E13",
        secondary: "#12181F",
        tertiary: "#161D26",
        appviolet: "#7995f5",
      },
      textColor: {
        appviolet: "#7995f5",
      },
      backgroundSize: {
        halfauto: "50% auto",
      },
      borderColor: {
        tertiary: "#161D26",
      },
    },
  },
  plugins: [],
};
