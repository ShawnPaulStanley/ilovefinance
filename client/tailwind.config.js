/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0D0D0D',
          dark: '#080808',
          subtle: '#141414',
        },
        surface: {
          DEFAULT: '#141710',
          elevated: '#1C2016',
          border: '#2B2F23',
        },
        olive: {
          DEFAULT: '#2B2F23',
          dark: '#1C2016',
          light: '#3C4232',
          border: '#383E2D',
        },
        neon: {
          DEFAULT: '#D7FF00',
          hover: '#C2E600',
          glow: 'rgba(215, 255, 0, 0.15)',
        },
        lime: {
          DEFAULT: '#C7FF3D',
          hover: '#B5F22B',
          soft: 'rgba(199, 255, 61, 0.12)',
        },
        gain: {
          DEFAULT: '#D7FF00',
          soft: 'rgba(215, 255, 0, 0.12)',
        },
        loss: {
          DEFAULT: '#FF4343',
          soft: 'rgba(255, 67, 67, 0.12)',
        },
        subtext: '#8E9482',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Anton', 'sans-serif'],
        sans: ['Inter', 'Helvetica', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      letterSpacing: {
        compressed: '-0.02em',
        tightest: '-0.04em',
        wideheader: '0.05em',
      }
    },
  },
  plugins: [],
}
