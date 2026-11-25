import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          light: '#CCFBF1',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        surface: '#FFFFFF',
        background: '#F8FAFC',
        'text-main': '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
      },
      borderRadius: {
        sm: '6px',
        card: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
