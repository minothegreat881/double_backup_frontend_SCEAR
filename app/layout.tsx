import type React from "react"
import ClientLayout from "./ClientLayout"
import './globals.css'

export const metadata = {
  title: "S.C.E.A.R. - Rímska armáda a pomocné zbory",
  description: "Historicko-vojenská skupina venovaná autentickej rekonštrukcii rímskych pomocných zborov",
  generator: 'v0.dev',
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent"
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}