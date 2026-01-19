import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Spam Detector - Clasificador SVM de Correos',
  description: 'Sistema inteligente de deteccion de spam utilizando Maquinas de Vectores de Soporte (SVM). Analiza correos electronicos para clasificarlos como SPAM o HAM (legitimos) con alta precision.',
  keywords: ['spam detector', 'email classifier', 'SVM', 'machine learning', 'spam filter', 'ham', 'correo spam'],
  authors: [{ name: 'Spam Detector' }],
  generator: 'Next.js',
  openGraph: {
    title: 'Spam Detector - Clasificador SVM de Correos',
    description: 'Detecta correos spam con inteligencia artificial usando SVM',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
