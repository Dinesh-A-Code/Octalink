import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/content/site";
import { themeScript } from "@/lib/theme/themeScript";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { SmoothScrollProvider } from "@/lib/gsap/SmoothScrollProvider";
import { GrainOverlay } from "@/components/primitives/GrainOverlay";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Digital studio for websites and software`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "digital studio",
    "web design",
    "landing page design",
    "business website",
    "web application development",
    "freelance web development",
  ],
  authors: site.operators.map((name) => ({ name })),
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — Digital studio for websites and software`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Digital studio`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <ThemeProvider>
          <SmoothScrollProvider>
            <a
              href="#main"
              className="sr-only rounded-sharp focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[110] focus:bg-fg focus:px-5 focus:py-3 focus:text-sm focus:text-bg"
            >
              Skip to content
            </a>
            {children}
            <GrainOverlay />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
