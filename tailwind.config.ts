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
        oxanium: ['Poppins', 'cursive'],
        kanit: ['Poppins', 'cursive'],
        optimus: ['Poppins', 'cursive'],
        poppins: ['Poppins', 'cursive'],
        iceberg: ['Poppins', 'cursive'],
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
