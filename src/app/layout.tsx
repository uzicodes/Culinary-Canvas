import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Culinary Canvas - Fresh & Healthy Food Delivery',
  description: 'Choose Culinary Canvas the best healthy way to life. Order fresh, organic, and healthy food delivered to your doorstep.',
  keywords: 'food delivery, healthy food, organic, fresh vegetables, fruits, grocery delivery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}