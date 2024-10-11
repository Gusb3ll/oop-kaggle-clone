import { Inter as InterFont } from 'next/font/google'

export const Inter = InterFont({
  weight: ['400', '500', '700', '800'],
  preload: true,
  variable: '--font-inter',
  display: 'swap',
  subsets: ['latin'],
})
