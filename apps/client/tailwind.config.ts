import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import defaultTheme from 'daisyui/src/theming/themes'
import { Config } from 'tailwindcss'

const defaultColors = {
  primary: '#000000',
}

const config = {
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/scenes/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
      },
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        kaggle: {
          ...defaultTheme['light'],
          'base-content': '#000000',
          'base-100': '#FFFFFF',
          ...defaultColors,
        },
      },
    ],
  },
} satisfies Config

export default config
