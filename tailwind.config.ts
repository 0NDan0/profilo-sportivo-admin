import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textShadow: {
        'curve-up': '0px -2px 4px rgba(0, 0, 0, 0.2)',
      },
      transform: {
        'curve-up': 'perspective(500px) rotateX(-5deg)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#3995f2",
        "custom-blue": "#3995f2"
      },
      screens: {
        "xs": "390px"
      }
    },
  },
  plugins: [],
} satisfies Config;
