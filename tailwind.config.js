/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        arcade: {
          chassis: 'rgb(var(--arcade-chassis) / <alpha-value>)',
          surface: 'rgb(var(--arcade-surface) / <alpha-value>)',
          groove: 'rgb(var(--arcade-groove) / <alpha-value>)',
          border: 'rgb(var(--arcade-border) / <alpha-value>)',
          cyan: 'rgb(var(--arcade-cyan) / <alpha-value>)',
          amber: 'rgb(var(--arcade-amber) / <alpha-value>)',
          magenta: 'rgb(var(--arcade-magenta) / <alpha-value>)',
          green: 'rgb(var(--arcade-green) / <alpha-value>)',
          cream: 'rgb(var(--arcade-cream) / <alpha-value>)',
          creamDark: 'rgb(var(--arcade-cream-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Fredoka', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Lexend', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'arcade-sm': '0 3px 0 rgba(0,0,0,0.6)',
        'arcade-md': '0 6px 0 rgba(0,0,0,0.6)',
        'arcade-lg': '0 8px 0 rgba(0,0,0,0.7)',
        'keycap-amber': '0 6px 0 #B87B00, 0 10px 15px rgba(0,0,0,0.4)',
        'keycap-cyan': '0 6px 0 #009E89, 0 10px 15px rgba(0,0,0,0.4)',
        'keycap-magenta': '0 6px 0 #9E1050, 0 10px 15px rgba(0,0,0,0.4)',
        'keycap-cream': '0 6px 0 #B8AF9C, 0 10px 15px rgba(0,0,0,0.4)',
        'keycap-neutral': '0 6px 0 #181E2E, 0 10px 15px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
