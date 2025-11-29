/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          hover: '#45a049',
        },
        secondary: {
          DEFAULT: '#2196F3',
          hover: '#1976D2',
        },
        warning: {
          DEFAULT: '#FF9800',
          hover: '#F57C00',
        },
        danger: {
          DEFAULT: '#f44336',
          hover: '#da190b',
        },
        info: {
          DEFAULT: '#9C27B0',
          hover: '#7B1FA2',
        },
        background: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)', 
          tertiary: 'var(--color-bg-tertiary)',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

