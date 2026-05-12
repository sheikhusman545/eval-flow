import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#365c8e',
          50: '#eef3fa',
          100: '#d5e2f3',
          200: '#abc5e7',
          300: '#82a8db',
          400: '#588bcf',
          500: '#365c8e',
          600: '#2b4a72',
          700: '#203755',
          800: '#162539',
          900: '#0b121c',
        },
        secondary: {
          DEFAULT: '#6fbf45',
          50: '#f0fae8',
          100: '#d9f1c5',
          200: '#b3e38b',
          300: '#8dd551',
          400: '#6fbf45',
          500: '#59a036',
          600: '#448028',
          700: '#2e601b',
          800: '#19400d',
          900: '#0a2005',
        },
        brand: {
          orange: '#fd5303',
          'orange-light': '#fff0eb',
        },
      },
      fontFamily: {
        sans: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
}

export default config
