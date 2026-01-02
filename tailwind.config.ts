import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          foreground: "#0b0f19",
        },
        secondary: {
          DEFAULT: "rgb(var(--royal) / <alpha-value>)",
          foreground: "#f8fafc",
        },
        accent: {
          DEFAULT: "rgb(var(--light-gold) / <alpha-value>)",
          foreground: "#0b0f19",
        },
        border: "var(--border)",
        card: "var(--card)",
        cardForeground: "var(--card-foreground)",
        overlay: "var(--overlay)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-playfair)", ...fontFamily.serif],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(0,0,0,0.35)",
        card: "0 25px 60px -15px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        grain:
          "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 160 160%22%3E%3Cfilter id=%22n%22 x=%22-20%25%22 y=%22-20%25%22 width=%22140%25%22 height=%22140%25%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E')",
        radial:
          "radial-gradient(circle at 20% 20%, rgba(13,173,141,0.28), transparent 35%), radial-gradient(circle at 80% 0%, rgba(17,100,180,0.32), transparent 32%), radial-gradient(circle at 50% 90%, rgba(141,216,204,0.14), transparent 35%)",
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease forwards",
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 12s ease-in-out infinite",
        first: "var(--animate-first)",
        second: "var(--animate-second)",
        third: "var(--animate-third)",
        fourth: "var(--animate-fourth)",
        fifth: "var(--animate-fifth)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;
