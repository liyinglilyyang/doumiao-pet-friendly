import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEF9',
          100: '#FDFAF4',
          200: '#F8F1E4',
          300: '#EFE3CF',
        },
        brand: {
          orange: '#E0813D',
          'orange-light': '#F5A462',
          'orange-pale': '#FFF0E2',
          yellow: '#F0BE56',
          'yellow-pale': '#FEF9EC',
          green: '#7DAB77',
          'green-pale': '#EFF6EE',
          brown: '#7C5A42',
          'brown-mid': '#A07855',
          'brown-light': '#C4A07E',
          dark: '#1E1209',
        },
        warm: {
          50: '#FDF8F0',
          100: '#F9EFE0',
          200: '#F0DFC5',
          border: '#E8DCCB',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 2px 12px rgba(60, 30, 10, 0.08)',
        'card-hover': '0 6px 24px rgba(60, 30, 10, 0.14)',
        soft: '0 1px 6px rgba(60, 30, 10, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config
