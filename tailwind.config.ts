import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        oxanium: ['CaveatBrush', 'cursive'],
        kanit: ['CaveatBrush', 'cursive'],
        optimus: ['CaveatBrush', 'cursive'],
        poppins: ['CaveatBrush', 'cursive'],
        iceberg: ['CaveatBrush', 'cursive'],
      },
      textShadow: {
        'neon-white': '0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)',
        'neon-white-light': '0 0 3px rgba(255, 255, 255, 0.5), 0 0 6px rgba(255, 255, 255, 0.3)',
      },
      boxShadow: {
        'white-glow': '0 0 20px rgba(255, 255, 255, 0.8)', // Custom white box shadow
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'), // Import the text shadow plugin
  ],
};

export default config;
