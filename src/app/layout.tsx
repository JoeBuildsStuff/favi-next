import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { jsonLdScript } from "@/lib/json-ld"
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site"
import { cn } from "@/lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `getfavi (favi) — ${SITE_TAGLINE}`,
    template: `%s | getfavi`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "favi",
    "getfavi",
    "favicon",
    "favicon API",
    "favi developer resources",
    "Vercel developer resources",
    "Lucide",
    "Tabler",
    "Phosphor",
    "Remix Icon",
    "PWA icons",
  ],
  authors: [{ name: SITE_NAME, url: SITE_ORIGIN }],
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/",
      "application/openapi+json": "/openapi.json",
    },
  },
  openGraph: {
    type: "website",
    siteName: "getfavi",
    title: `getfavi (favi) — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `getfavi (favi) — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="h-full min-h-full bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(),
          }}
        />
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
