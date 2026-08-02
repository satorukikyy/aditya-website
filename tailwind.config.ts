import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.tsx',
  ],
  theme: {
    extend: {
      colors: {
        'c-bg':           '#FAF3E8',
        'c-surface':      '#FFFFFF',
        'c-text':         '#0D0D0D',
        'c-muted':        '#3F3B36',
        'c-subtle':       '#7A736A',
        'c-border':       '#0D0D0D',
        'c-purple':       '#7C3AED',
        'c-purple-hover': '#6D28D9',
        'c-purple-light': '#EDE9FE',
        'c-yellow':       '#FFD12E',
        'c-pink':         '#FF8FD8',
        'c-cyan':         '#7AE1EA',
        'c-lime':         '#B5F163',
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0 0 #0D0D0D',
        'brutal':    '5px 5px 0 0 #0D0D0D',
        'brutal-lg': '8px 8px 0 0 #0D0D0D',
        'brutal-purple': '5px 5px 0 0 #7C3AED',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
