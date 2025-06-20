module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glow-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.5)',
          },
        },
      },
    },
  },
};
