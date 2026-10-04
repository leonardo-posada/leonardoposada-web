import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NavBar } from "@/components/site/nav-bar";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { GridOverlay } from "@/components/site/grid-overlay";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { themeInitScript } from "@/components/site/theme-toggle";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

/** JSON-LD Person schema · helps search engines understand who owns this site. */
const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  description: SITE.description,
  url: SITE_URL,
  email: `mailto:${SITE.email}`,
  sameAs: [SITE.socials.linkedin, SITE.socials.dribbble, SITE.socials.instagram],
} as const;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: "@leonardoposada",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SmoothScroll />
        <NavBar />
        <main id="top" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <GridOverlay />
      </body>
    </html>
  );
}
