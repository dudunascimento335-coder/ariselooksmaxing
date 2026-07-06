/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        'neon-blue': '#0ea5e9',
        'neon-blue-bright': '#38bdf8',
        'neon-purple': '#a855f7',
        'neon-purple-bright': '#c084fc',
        border: 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
