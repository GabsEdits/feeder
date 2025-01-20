import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Variable", "sans-serif"],
        mono: ["Geist Mono Variable", "monospace"],
        serif: ["Instrument Serif", "serif"],
      },
    },
  },
} satisfies Config;
