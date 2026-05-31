import { Geist_Mono, Outfit, Roboto_Slab } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const robotoSlabHeading = Roboto_Slab({subsets:['latin'],variable:'--font-heading'});

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Medusa — Query anything. Visually.",
  description:
    "A developer-grade visual query builder. Nest conditions, preview SQL, MongoDB, and GraphQL in real time.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, robotoSlabHeading.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
