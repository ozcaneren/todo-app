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
        background: "#09090b",
        primary: "#ebebeb",
        text: "#fafafa",
        textSecondary: "#a1a1aa",
        borderColor: "#27272a",
        secondary: "#111111",
        todo: "#F5EFE7",
        todoCategory: "#D8C4B6",
        input: "#f9f9f9",
        button: "#27272a",
        buttonHover: "#212124",
        deneme: "#",
      },
    },
  },
  plugins: [],
} satisfies Config;
