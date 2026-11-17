import type { Config } from "tailwindcss";

const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        card: v("card"),
        bar: v("card"),
        tile: v("tile"),
        ink: v("ink"),
        silver: v("silver"),
        line: v("line"),
        accent: v("accent"),
        onaccent: v("onaccent"),
        brand: "#087BFF",
        ice: "#F4F8FF",
      },
      fontFamily: { sans: ["var(--font-vazir)", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
