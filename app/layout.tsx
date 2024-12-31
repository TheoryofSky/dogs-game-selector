import './globals.css'
import type { Metadata } from 'next'
import { Pixelify_Sans } from 'next/font/google'

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'D.O.G.S - Democratic Ordered Games Selection',
  description: 'Collaboratively choose and rank video games with friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pixelifySans.className}>{children}</body>
    </html>
  )
}

