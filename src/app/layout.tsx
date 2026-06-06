import type { Metadata } from 'next';
import { Inter, Marcellus } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import NextAuthSessionProvider from './SessionProvider';
import ScrollProgressBar from '@/components/ScrollProgressBar';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const marcellus = Marcellus({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-marcellus' })
const nalinak = localFont({ src: '../../public/fonts/Nalinak.otf', display: 'swap', variable: '--font-nalinak' })

export const metadata: Metadata = {
  title: 'Culinary Canvas',
  description: 'Culinary Canvas the best healthy way to life. Order fresh, organic, and healthy food delivered to your doorstep.',
  keywords: 'food delivery, healthy food, organic, fresh vegetables, fruits, grocery delivery',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${marcellus.variable} ${nalinak.variable}`}>
        <ScrollProgressBar />
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}