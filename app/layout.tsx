import type { Metadata } from 'next'
import { Oswald, Barlow } from 'next/font/google'
import './globals.css'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700'] })
const barlow = Barlow({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'La Bombonera Tracker',
  description: 'Seguimiento de asistencia a La Bombonera',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${barlow.variable} bg-boca-dark min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
