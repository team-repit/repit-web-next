import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#A0DD9E",
          200: "#6CBB69",
          300: "#3E945C",
          400: "#046B51",
          500: "#04614A",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F6",
          200: "#E5E8EB",
          300: "#D1D6DB",
          400: "#B0B8C1",
          500: "#8B95A1",
          600: "#6B7684",
          700: "#4E5968",
          800: "#333D4B",
          900: "#191F28",
        },
        alert: {
          negative: {
            primary: "#FF3937",
            secondary: "#FFECEE",
          },
          positive: {
            primary: "#00C854",
            secondary: "#E6FBED",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
