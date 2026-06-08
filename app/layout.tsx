import type { Metadata } from 'next'
import { Oswald, Barlow } from 'next/font/google'
import './globals.css'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700'] })
const barlow = Barlow({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'La Bombonera Tracker',
  description: 'Seguimiento de asistencia a La Bombonera',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#00061a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${oswald.variable} ${barlow.variable} bg-boca-dark min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
