import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#213555",
        primary: "#ebebeb",
        secondary: "#111111",
        todo: "#F5EFE7",
        todoCategory: "#D8C4B6",
        input: "#f9f9f9",
        button: "#0466C8",
        buttonHover: "#0456A6",
        deneme: "#",
      },
    },
  },
  plugins: [],
} satisfies Config;
