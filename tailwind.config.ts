import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#0F1215',
          dark: '#1A1E23',
        },
        badge: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          blue: '#3B82F6',
        },
        status: {
          active: '#22C55E',
          inactive: '#EF4444',
        }
      },
    },
  },
  plugins: [],
};

export default config;